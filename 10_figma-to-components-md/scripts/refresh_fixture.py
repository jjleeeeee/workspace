#!/usr/bin/env python3
"""
refresh_fixture.py — fixture/ 원자적 재생성 (temp dir 패턴)

동작:
  1. preflight 검증
  2. fixture.new/ 생성 (작업 공간)
  3. fixture/에서 보존 파일 → fixture.new/ 복사 (figma_raw 제외)
  4. figma_raw.json 새로 가져오기 (FIGMA_API_TOKEN 있을 때)
  5. figma_image_export.py → fixture.new/figma_screenshot.png + meta
  6. fixture.meta.json 재생성
  7. image_mask.json 재생성 (새 figma_raw 기반)
  8. fixture.lock 재생성
  9. 원자적 swap: fixture/ → fixture.old/, fixture.new/ → fixture/
 10. fixture.old/ 삭제

실패 시: fixture.new/ 만 삭제. 기존 fixture/ 무결 보장.

사용:
  python3 scripts/refresh_fixture.py \
    --file-key DWEduE6GfxYMlyxKPNJ8jA \
    --node-id 62973:7591 \
    --component avatar \
    [--component-set-node <id>] [--scale 3] [--force] [--require-figma-api]
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import shutil
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent
FIXTURE_DIR = REPO_ROOT / "fixture"
FIXTURE_NEW = REPO_ROOT / "fixture.new"
FIXTURE_OLD = REPO_ROOT / "fixture.old"


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _preflight(require_figma_api: bool) -> None:
    cmd = [sys.executable, str(REPO_ROOT / "scripts" / "preflight_sot.py")]
    if require_figma_api:
        cmd.append("--require-figma-api")
    result = subprocess.run(cmd, cwd=REPO_ROOT)
    if result.returncode != 0:
        raise RuntimeError("preflight 실패")


def _cleanup_new() -> None:
    """fixture.new/ 정리 (실패 시 호출)."""
    if FIXTURE_NEW.exists():
        shutil.rmtree(FIXTURE_NEW)
        print("[refresh_fixture] fixture.new/ 정리 완료", file=sys.stderr)


def _copy_preserved_files() -> None:
    """fixture/에서 재생성 불필요한 파일을 fixture.new/로 복사 (figma_raw 제외)."""
    preserve = [
        "expected_nodes.json",
        "component_keys_snapshot.json",
        "token_snapshot.json",
    ]
    for name in preserve:
        src = FIXTURE_DIR / name
        if src.exists():
            shutil.copy2(src, FIXTURE_NEW / name)
            print(f"[refresh_fixture] {name} 보존")


def _fetch_figma_raw(file_key: str, component_set_node: str, token: str) -> dict | None:
    """Figma REST API로 컴포넌트 세트 노드 트리 새로 가져오기."""
    import urllib.request
    import urllib.error

    node_id_enc = component_set_node.replace(":", "%3A")
    url = f"https://api.figma.com/v1/files/{file_key}/nodes?ids={node_id_enc}&depth=5"
    req = urllib.request.Request(url, headers={"X-Figma-Token": token})

    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = json.loads(resp.read().decode("utf-8"))
            nodes = data.get("nodes") or {}
            if not nodes:
                raise RuntimeError(f"figma_raw nodes 비어있음: node_id={component_set_node}")
            node_key = list(nodes.keys())[0]
            return nodes[node_key].get("document") or {}
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 502, 503, 504) and attempt < 2:
                time.sleep(2 ** attempt)
                continue
            raise RuntimeError(f"figma_raw 가져오기 실패 HTTP {e.code}: {url}") from e
        except Exception as e:
            if attempt < 2:
                time.sleep(2 ** attempt)
                continue
            raise RuntimeError(f"figma_raw 가져오기 실패: {e}") from e
    return None


def _export_screenshot(file_key: str, node_id: str, scale: int) -> dict:
    output = FIXTURE_NEW / "figma_screenshot.png"
    cmd = [
        sys.executable, str(REPO_ROOT / "servers" / "figma_image_export.py"),
        "--file-key", file_key,
        "--node-id", node_id,
        "--scale", str(scale),
        "--output", str(output),
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, cwd=REPO_ROOT)
    if result.returncode != 0:
        raise RuntimeError(f"figma_image_export 실패:\n{result.stderr}")
    return json.loads(result.stdout)


def _find_node(root: dict, node_id: str) -> dict | None:
    """figma_raw 트리에서 node_id 일치 노드 반환 (없으면 None)."""
    stack = [root]
    target = node_id.replace("-", ":")
    while stack:
        node = stack.pop()
        if not isinstance(node, dict):
            continue
        nid = (node.get("id") or "").replace("-", ":")
        if nid == target:
            return node
        for child in node.get("children") or []:
            stack.append(child)
    return None


def _build_image_mask(figma_raw: dict | None, screenshot_node_id: str | None = None) -> list[dict]:
    """figma_raw에서 image/icon 노드를 추출해 mask regions 생성 (CSS 상대 좌표계).

    screenshot_node_id 지정 시:
      - 해당 노드의 subtree만 순회 (다른 variant 노드 제외)
      - 해당 노드의 absoluteBoundingBox를 origin으로 사용 (→ 좌표가 0,0 기준)
    미지정 시: figma_raw 루트 기준 (component set 전체, 레거시 동작).
    """
    if not figma_raw:
        return []

    # screenshot 노드를 root로 찾아 subtree + origin 결정
    if screenshot_node_id:
        subtree_root = _find_node(figma_raw, screenshot_node_id)
        if subtree_root is None:
            subtree_root = figma_raw
    else:
        subtree_root = figma_raw

    root_bbox = subtree_root.get("absoluteBoundingBox") or {}
    ox = float(root_bbox.get("x", 0))
    oy = float(root_bbox.get("y", 0))

    regions = []
    stack = [subtree_root]

    while stack:
        node = stack.pop()
        if not isinstance(node, dict):
            continue
        fills = node.get("fills") or []
        has_image_fill = any(f.get("type") == "IMAGE" for f in fills)

        if has_image_fill:
            bbox = node.get("absoluteBoundingBox") or {}
            w = float(bbox.get("width", 0))
            h = float(bbox.get("height", 0))
            if w > 0 and h > 0:
                regions.append({
                    "id": node.get("id", ""),
                    "name": node.get("name", ""),
                    "x": float(bbox.get("x", 0)) - ox,
                    "y": float(bbox.get("y", 0)) - oy,
                    "width": w,
                    "height": h,
                })

        for child in node.get("children") or []:
            stack.append(child)

    return regions


def _write_fixture_meta(
    export_info: dict,
    component_name: str,
    figma_file: str,
    component_set_node: str,
) -> None:
    meta = {
        "schema_version": "v3-capture-contract",
        "component": {
            "name": component_name,
            "figma_file": figma_file,
            "node_id": component_set_node,
        },
        "figma_screenshot": {
            "source": export_info.get("source", "figma-rest"),
            "scale": export_info["scale"],
            "css_width": export_info["css_width"],
            "css_height": export_info["css_height"],
            "raster_width": export_info["raster_width"],
            "raster_height": export_info["raster_height"],
            "export_bounds": export_info.get("export_bounds", {}),
            "node_id": export_info["node_id"],
            "captured_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        },
    }
    path = FIXTURE_NEW / "fixture.meta.json"
    path.write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")
    print("[refresh_fixture] fixture.meta.json 작성 (v3-capture-contract)")


def _write_fixture_lock() -> None:
    lock = {}
    for f in sorted(FIXTURE_NEW.iterdir()):
        if f.name == "fixture.lock" or not f.is_file():
            continue
        lock[f.name] = _sha256(f)
    lock_path = FIXTURE_NEW / "fixture.lock"
    lock_path.write_text(json.dumps(lock, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"[refresh_fixture] fixture.lock 재생성 ({len(lock)}개 파일)")


def _atomic_swap() -> None:
    """fixture.new/ → fixture/ 원자적 교체."""
    # fixture.old/ 잔존 정리
    if FIXTURE_OLD.exists():
        shutil.rmtree(FIXTURE_OLD)

    if FIXTURE_DIR.exists():
        FIXTURE_DIR.rename(FIXTURE_OLD)

    FIXTURE_NEW.rename(FIXTURE_DIR)

    if FIXTURE_OLD.exists():
        shutil.rmtree(FIXTURE_OLD)

    print("[refresh_fixture] fixture/ 원자적 교체 완료")


def main() -> None:
    parser = argparse.ArgumentParser(description="fixture/ 원자적 재생성")
    parser.add_argument("--file-key", required=True, help="Figma 파일 키")
    parser.add_argument("--node-id", required=True, help="representative 노드 ID")
    parser.add_argument("--component", required=True, help="컴포넌트 이름 (kebab-case)")
    parser.add_argument("--component-set-node", default="", help="컴포넌트 세트 노드 ID (figma_raw 가져오기용)")
    parser.add_argument("--scale", type=int, default=3)
    parser.add_argument("--force", action="store_true", help="fixture.lock 있어도 강제 재생성")
    parser.add_argument("--require-figma-api", action="store_true", help="FIGMA_API_TOKEN 필수 체크")
    args = parser.parse_args()

    lock_path = FIXTURE_DIR / "fixture.lock"
    if lock_path.exists() and not args.force:
        print(
            f"[refresh_fixture] fixture.lock 존재. 재생성하려면 --force 플래그 추가.\n  {lock_path}",
            file=sys.stderr,
        )
        sys.exit(1)

    # 이전 실행 잔존 정리
    if FIXTURE_NEW.exists():
        print("[refresh_fixture] fixture.new/ 잔존 발견 → 정리", file=sys.stderr)
        shutil.rmtree(FIXTURE_NEW)

    print("[refresh_fixture] 시작 — temp dir 패턴 원자적 fixture 재생성")

    try:
        # Step 1: preflight
        print("[refresh_fixture] Step 1: preflight")
        _preflight(args.require_figma_api)

        # Step 2: fixture.new/ 생성
        FIXTURE_NEW.mkdir(parents=True, exist_ok=True)

        # Step 3: 보존 파일 복사 (figma_raw 제외 — 새로 가져올 것)
        print("[refresh_fixture] Step 3: 보존 파일 복사")
        if FIXTURE_DIR.exists():
            _copy_preserved_files()

        # Step 4: figma_raw.json 새로 가져오기
        token = os.environ.get("FIGMA_API_TOKEN", "").strip()
        comp_set_node = args.component_set_node or args.node_id
        if token:
            print(f"[refresh_fixture] Step 4: figma_raw.json 가져오기 (node={comp_set_node})")
            figma_raw = _fetch_figma_raw(args.file_key, comp_set_node, token)
            if figma_raw:
                raw_path = FIXTURE_NEW / "figma_raw.json"
                raw_path.write_text(json.dumps(figma_raw, ensure_ascii=False, indent=2), encoding="utf-8")
                print("[refresh_fixture]   figma_raw.json 재생성 완료")
            else:
                print("[refresh_fixture]   figma_raw.json 가져오기 실패 — 건너뜀", file=sys.stderr)
                figma_raw = None
        else:
            print("[refresh_fixture] Step 4: FIGMA_API_TOKEN 없음 — figma_raw.json 기존 것 사용", file=sys.stderr)
            old_raw = FIXTURE_DIR / "figma_raw.json"
            if old_raw.exists():
                shutil.copy2(old_raw, FIXTURE_NEW / "figma_raw.json")
            figma_raw = None
            if (FIXTURE_NEW / "figma_raw.json").exists():
                try:
                    figma_raw = json.loads((FIXTURE_NEW / "figma_raw.json").read_text(encoding="utf-8"))
                except Exception:
                    pass

        # Step 5: figma_image_export
        print(f"[refresh_fixture] Step 5: figma 3x 캡처 (node={args.node_id}, scale={args.scale})")
        export_info = _export_screenshot(args.file_key, args.node_id, args.scale)
        print(f"  → {export_info['raster_width']}×{export_info['raster_height']} PNG 저장")

        # Step 6: fixture.meta.json
        print("[refresh_fixture] Step 6: fixture.meta.json 작성")
        _write_fixture_meta(
            export_info,
            component_name=args.component,
            figma_file=args.file_key,
            component_set_node=comp_set_node,
        )

        # Step 7: image_mask.json 재생성 (새 figma_raw 기반)
        print("[refresh_fixture] Step 7: image_mask.json 재생성")
        if figma_raw is None and (FIXTURE_NEW / "figma_raw.json").exists():
            try:
                figma_raw = json.loads((FIXTURE_NEW / "figma_raw.json").read_text(encoding="utf-8"))
            except Exception:
                pass
        regions = _build_image_mask(figma_raw, screenshot_node_id=args.node_id)
        mask_data = {"coord_space": "css", "regions": regions}
        (FIXTURE_NEW / "image_mask.json").write_text(
            json.dumps(mask_data, ensure_ascii=False, indent=2), encoding="utf-8"
        )
        print(f"  → image_mask.json 재생성 ({len(regions)}개 region)")

        # Step 8: fixture.lock
        print("[refresh_fixture] Step 8: fixture.lock 재생성")
        _write_fixture_lock()

        # Step 9: 원자적 swap
        print("[refresh_fixture] Step 9: 원자적 swap")
        _atomic_swap()

        print("[refresh_fixture] 완료 — fixture/ 재생성 성공")

    except Exception as e:
        print(f"[refresh_fixture] 오류: {e}", file=sys.stderr)
        _cleanup_new()
        print("[refresh_fixture] fixture.new/ 정리 완료. 기존 fixture/ 무결.", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
