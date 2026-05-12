#!/usr/bin/env python3
"""
generate_icon_manifest.py — src/icons/*.svg → src/icons/manifest.json 자동 생성

key 규칙:
  1. 파일명에서 접두어(ic_ / img_)와 확장자(.svg) 제거
  2. 이름 중간의 size 토큰(_medium/_small/_xsmall/_large 등) 제거
  3. 동일 key 충돌 시 size 토큰을 살려 구분

기존 manifest.json의 항목은 그대로 보존(덮어쓰지 않음).
새 SVG만 추가한다.

사용:
  python3 scripts/generate_icon_manifest.py
  python3 scripts/generate_icon_manifest.py --dry-run   # 실제 쓰지 않고 결과만 출력
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from xml.etree import ElementTree as ET

REPO_ROOT = Path(__file__).parent.parent
ICONS_DIR = REPO_ROOT / "src" / "icons"
MANIFEST_PATH = ICONS_DIR / "manifest.json"

SIZE_TOKENS = {"medium", "small", "xsmall", "large", "xlarge", "xxlarge", "xxsmall", "xxxlarge"}
PREFIX_RE = re.compile(r"^(ic_|img_)")


def file_to_preferred_key(stem: str) -> str:
    """파일명 stem → 선호 key (size 토큰 1개 제거)."""
    stem = PREFIX_RE.sub("", stem)
    parts = stem.split("_")
    # 오른쪽에서 첫 size 토큰 제거
    for i in range(len(parts) - 1, -1, -1):
        if parts[i] in SIZE_TOKENS:
            parts.pop(i)
            break
    return "_".join(parts)


def file_to_full_key(stem: str) -> str:
    """size 토큰 보존 — 충돌 해소용."""
    return PREFIX_RE.sub("", stem)


def parse_svg_size(svg_path: Path) -> list[int]:
    """SVG viewBox 또는 width/height에서 [w, h] 파싱."""
    try:
        tree = ET.parse(svg_path)
        root = tree.getroot()
        # namespace 제거
        tag = root.tag.split("}")[-1] if "}" in root.tag else root.tag
        if tag != "svg":
            return [24, 24]
        vb = root.get("viewBox", "")
        if vb:
            parts = vb.strip().split()
            if len(parts) == 4:
                return [int(float(parts[2])), int(float(parts[3]))]
        w = root.get("width", "24").rstrip("px")
        h = root.get("height", "24").rstrip("px")
        return [int(float(w)), int(float(h))]
    except Exception:
        return [24, 24]


def is_colorable(svg_path: Path) -> bool:
    """SVG 내 currentColor 사용 여부."""
    try:
        return "currentColor" in svg_path.read_text(encoding="utf-8")
    except Exception:
        return False


def main() -> None:
    parser = argparse.ArgumentParser(description="src/icons/*.svg → manifest.json 자동 생성")
    parser.add_argument("--dry-run", action="store_true", help="파일 쓰기 없이 결과만 출력")
    args = parser.parse_args()

    # 기존 manifest 로드
    existing: dict = {}
    if MANIFEST_PATH.exists():
        try:
            data = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
            existing = data.get("icons") or {}
        except Exception as e:
            print(f"[warn] manifest 로드 실패: {e} — 새로 생성", file=sys.stderr)

    # 이미 등록된 파일 목록
    covered_files = {entry.get("file") for entry in existing.values() if isinstance(entry, dict)}

    # SVG 파일 스캔
    svg_files = sorted(ICONS_DIR.glob("*.svg"))
    print(f"[scan] {len(svg_files)}개 SVG 발견, 기존 등록 {len(existing)}개")

    # 선호 key → file stem 매핑 (충돌 감지용)
    preferred: dict[str, list[str]] = {}
    for svg in svg_files:
        if svg.name in covered_files:
            continue
        key = file_to_preferred_key(svg.stem)
        preferred.setdefault(key, []).append(svg.stem)

    # 새 항목 생성
    new_entries: dict[str, dict] = {}
    for preferred_key, stems in preferred.items():
        for stem in stems:
            svg_path = ICONS_DIR / f"{stem}.svg"
            if len(stems) == 1:
                key = preferred_key
            else:
                # 충돌 → full key(size 토큰 포함)
                key = file_to_full_key(stem)
            # 기존 key 중복 방지
            if key in existing or key in new_entries:
                key = file_to_full_key(stem)
            if key in existing or key in new_entries:
                key = stem  # 최후 수단
            new_entries[key] = {
                "file": f"{stem}.svg",
                "default_size": parse_svg_size(svg_path),
                "colorable": is_colorable(svg_path),
            }

    merged = {**existing, **new_entries}
    result = {
        "schema": "renderer-asset-manifest/v1",
        "icons": dict(sorted(merged.items())),
    }

    print(f"[result] 총 {len(merged)}개 항목 (기존 {len(existing)} + 신규 {len(new_entries)})")

    if args.dry_run:
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return

    MANIFEST_PATH.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"[done] {MANIFEST_PATH} 갱신 완료")


if __name__ == "__main__":
    main()
