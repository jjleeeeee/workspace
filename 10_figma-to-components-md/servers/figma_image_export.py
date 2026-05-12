#!/usr/bin/env python3
"""
figma_image_export.py — Figma REST API로 3x PNG 내보내기

2단계 REST 호출:
  1. GET /v1/files/:key/nodes?ids=:node_id  → absoluteBoundingBox (css_*), absoluteRenderBounds
  2. GET /v1/images/:key?ids=:node_id&scale=3&format=png  → render URL
  다운로드 후 PIL로 raster_width/height 실측.

사용:
  python3 servers/figma_image_export.py \
    --file-key DWEduE6GfxYMlyxKPNJ8jA \
    --node-id 62973:7591 \
    --scale 3 \
    --output fixture/figma_screenshot.png

출력 (stdout JSON):
  {
    "path": "fixture/figma_screenshot.png",
    "node_id": "62973:7591",
    "scale": 3,
    "css_width": 84, "css_height": 90,
    "raster_width": 252, "raster_height": 270,
    "export_bounds": {"x": 0, "y": 0, "width": 84, "height": 90},
    "source": "figma-rest"
  }
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import time
from pathlib import Path


class MissingTokenError(Exception):
    pass


class ImageRenderFailedError(Exception):
    pass


class RasterSizeMismatchError(Exception):
    pass


class RestApiError(Exception):
    pass


def _get(url: str, token: str, retries: int = 3) -> dict:
    """GET JSON from Figma REST API with exponential backoff."""
    import urllib.request
    import urllib.error

    req = urllib.request.Request(url, headers={"X-Figma-Token": token})
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 502, 503, 504) and attempt < retries - 1:
                time.sleep(2 ** attempt)
                continue
            raise RestApiError(f"HTTP {e.code}: {url}") from e
        except Exception as e:
            if attempt < retries - 1:
                time.sleep(2 ** attempt)
                continue
            raise RestApiError(f"요청 실패: {e}") from e
    raise RestApiError(f"재시도 {retries}회 실패: {url}")


def _download(url: str, output: Path, retries: int = 3) -> bytes:
    import urllib.request
    import urllib.error

    for attempt in range(retries):
        try:
            with urllib.request.urlopen(url, timeout=60) as resp:
                data = resp.read()
            output.parent.mkdir(parents=True, exist_ok=True)
            output.write_bytes(data)
            return data
        except Exception as e:
            if attempt < retries - 1:
                time.sleep(2 ** attempt)
                continue
            raise RestApiError(f"다운로드 실패: {e}") from e
    raise RestApiError(f"다운로드 재시도 {retries}회 실패")


def export_node(
    file_key: str,
    node_id: str,
    scale: int,
    output: Path,
    token: str,
) -> dict:
    api_base = "https://api.figma.com"

    # node_id URL 인코딩 (: → %3A)
    node_id_enc = node_id.replace(":", "%3A")

    # Step 1: 노드 bounds 조회
    nodes_url = f"{api_base}/v1/files/{file_key}/nodes?ids={node_id_enc}"
    nodes_resp = _get(nodes_url, token)
    node_data = (nodes_resp.get("nodes") or {}).get(node_id, {})
    if not node_data:
        raise RestApiError(f"node_id='{node_id}' 를 파일에서 찾을 수 없음")

    doc = node_data.get("document") or {}
    bbox = doc.get("absoluteBoundingBox") or {}
    render_bounds = doc.get("absoluteRenderBounds") or bbox

    css_width = int(round(float(bbox.get("width", 0))))
    css_height = int(round(float(bbox.get("height", 0))))
    export_bounds = {
        "x": float(render_bounds.get("x", 0)),
        "y": float(render_bounds.get("y", 0)),
        "width": float(render_bounds.get("width", css_width)),
        "height": float(render_bounds.get("height", css_height)),
    }

    # Step 2: 렌더 URL 요청 (use_absolute_bounds=true: 시각 효과 제외하고 bbox에 맞춤)
    images_url = (
        f"{api_base}/v1/images/{file_key}"
        f"?ids={node_id_enc}&scale={scale}&format=png&use_absolute_bounds=true"
    )
    images_resp = _get(images_url, token)
    render_url = (images_resp.get("images") or {}).get(node_id)
    if not render_url:
        raise ImageRenderFailedError(
            f"node_id='{node_id}' 렌더 URL 없음 (null). "
            "Figma REST API 32MP 크기 제한 초과 가능성 — scale 낮추거나 노드 크기 확인 필요."
        )

    # Step 3: PNG 다운로드
    _download(render_url, output)

    # Step 4: raster 크기 실측
    try:
        from PIL import Image
        with Image.open(output) as img:
            raster_width, raster_height = img.size
    except Exception as e:
        raise RestApiError(f"PNG 크기 확인 실패: {e}") from e

    # raster ≈ absoluteBoundingBox × scale ± 4 검증 (use_absolute_bounds=true 사용으로 bbox 기준 렌더)
    expected_w = round(float(bbox.get("width", css_width)) * scale)
    expected_h = round(float(bbox.get("height", css_height)) * scale)
    if abs(raster_width - expected_w) > 4 or abs(raster_height - expected_h) > 4:
        raise RasterSizeMismatchError(
            f"raster({raster_width}×{raster_height}) ≠ bbox×scale({expected_w}×{expected_h}). "
            f"Figma absoluteBoundingBox({css_width}×{css_height}) 기준. 노드 크기나 scale 확인 필요."
        )

    return {
        "path": str(output),
        "node_id": node_id,
        "scale": scale,
        "css_width": css_width,
        "css_height": css_height,
        "raster_width": raster_width,
        "raster_height": raster_height,
        "export_bounds": export_bounds,
        "export_used_absolute_bounds": True,
        "source": "figma-rest",
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Figma REST API 3x PNG export")
    parser.add_argument("--file-key", required=True, help="Figma 파일 키")
    parser.add_argument("--node-id", required=True, help="노드 ID (예: 62973:7591)")
    parser.add_argument("--scale", type=int, default=3, help="export 배율 (기본 3)")
    parser.add_argument("--output", required=True, help="저장 경로")
    args = parser.parse_args()

    token = os.environ.get("FIGMA_API_TOKEN", "").strip()
    if not token:
        print(
            "[figma_image_export] FIGMA_API_TOKEN 환경변수가 없습니다.\n"
            "  export FIGMA_API_TOKEN=<your token>\n"
            "  또는 .env 파일에 추가 후 source .env",
            file=sys.stderr,
        )
        sys.exit(1)

    output = Path(args.output)
    try:
        result = export_node(args.file_key, args.node_id, args.scale, output, token)
    except MissingTokenError as e:
        print(f"[figma_image_export] 토큰 오류: {e}", file=sys.stderr)
        sys.exit(1)
    except ImageRenderFailedError as e:
        print(f"[figma_image_export] 렌더 실패: {e}", file=sys.stderr)
        sys.exit(1)
    except RasterSizeMismatchError as e:
        print(f"[figma_image_export] raster 크기 불일치: {e}", file=sys.stderr)
        sys.exit(1)
    except RestApiError as e:
        print(f"[figma_image_export] API 오류: {e}", file=sys.stderr)
        sys.exit(1)

    print(json.dumps(result, ensure_ascii=False, indent=2))
    sys.exit(0)


if __name__ == "__main__":
    main()
