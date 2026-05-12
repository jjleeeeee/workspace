#!/usr/bin/env python3
"""
pixel_compare.py — design-md-harness용 픽셀 비교 도구

cds-ds 버전과의 차이:
- DSL 트리 의존 제거 → --mask-json (image_mask.json) 으로 이미지 영역 마스킹
- 게이트 기준: pixel_sim_effective ≥ PASS_THRESHOLD (SSIM은 참고값)
- size mismatch는 기본 FAIL (--allow-resize 또는 --allow-crop 명시 필요)

사용:
  python3 pixel_compare.py \
    --figma <path> --rendered <path> \
    --output <path> [--diff-png <path>] \
    [--sample-name <name>] [--allow-resize] [--allow-crop] \
    [--mask-json fixture/image_mask.json]
"""

import argparse
import json
import sys
from datetime import datetime
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw
from skimage.metrics import structural_similarity as ssim


PASS_THRESHOLD = 0.85


class SizeMismatchError(Exception):
    pass


# ─── 마스킹 (image_mask.json 기반) ──────────────────────────────────────────

def build_mask_from_json(
    mask_json_path: str,
    compare_w: int,
    compare_h: int,
    scale: float = 1.0,
    export_origin: tuple[float, float] = (0.0, 0.0),
) -> tuple[np.ndarray, list[dict]]:
    """
    image_mask.json [{id, name, x, y, width, height, ...}...] → boolean mask.

    coord_space="css" (메타 필드)인 경우 raster 좌표계로 변환:
      raster_x = (css_x - export_origin.x) * scale
      raster_y = (css_y - export_origin.y) * scale
      raster_w = css_w * scale
      raster_h = css_h * scale

    coord_space 미지정 또는 "raster"인 경우 figma_w/figma_h 기반 비례 변환 (레거시).
    """
    try:
        raw = json.loads(Path(mask_json_path).read_text(encoding="utf-8"))
    except Exception:
        return np.zeros((compare_h, compare_w), dtype=bool), []

    # coord_space 메타 지원 (새 포맷: {"coord_space": "css", "regions": [...]})
    if isinstance(raw, dict) and "regions" in raw:
        coord_space = raw.get("coord_space", "css")
        regions: list[dict] = raw["regions"]
    else:
        coord_space = "raster_legacy"
        regions = raw if isinstance(raw, list) else []

    mask = np.zeros((compare_h, compare_w), dtype=bool)
    applied = []
    ox, oy = export_origin

    for r in regions:
        if coord_space == "css":
            # css → raster 변환
            px = int((float(r.get("x", 0)) - ox) * scale)
            py = int((float(r.get("y", 0)) - oy) * scale)
            pw = int(float(r.get("width", 0)) * scale)
            ph = int(float(r.get("height", 0)) * scale)
        else:
            # 레거시: figma_w/figma_h 기반 비례
            figma_w = float(r.get("figma_w") or r.get("figma_width") or compare_w)
            figma_h = float(r.get("figma_h") or r.get("figma_height") or compare_h)
            scale_x = compare_w / figma_w if figma_w else 1.0
            scale_y = compare_h / figma_h if figma_h else 1.0
            px = int(float(r.get("x", 0)) * scale_x)
            py = int(float(r.get("y", 0)) * scale_y)
            pw = int(float(r.get("width", 0)) * scale_x)
            ph = int(float(r.get("height", 0)) * scale_y)

        x0, y0 = max(0, px), max(0, py)
        x1, y1 = min(compare_w, px + pw), min(compare_h, py + ph)
        if x1 > x0 and y1 > y0:
            mask[y0:y1, x0:x1] = True
            applied.append({
                "id": r.get("id", ""),
                "name": r.get("name", ""),
                "bbox_px": {"x": x0, "y": y0, "width": x1 - x0, "height": y1 - y0},
            })

    return mask, applied


# ─── 이미지 유틸 ─────────────────────────────────────────────────────────────

def load_image(path: str) -> Image.Image:
    img = Image.open(path).convert("RGBA")
    white_bg = Image.new("RGBA", img.size, (255, 255, 255, 255))
    white_bg.paste(img, mask=img.split()[3])
    return white_bg.convert("RGBA")


def normalize_images(
    figma: Image.Image,
    rendered: Image.Image,
    *,
    allow_resize: bool = False,
    allow_crop: bool = False,
) -> tuple[Image.Image, Image.Image]:
    figma_w, figma_h = figma.size
    rendered_w, rendered_h = rendered.size

    if figma.size != rendered.size:
        if not (allow_resize or allow_crop):
            raise SizeMismatchError(
                f"figma {figma.size} != rendered {rendered.size}. "
                "--allow-resize 또는 --allow-crop 플래그가 필요합니다."
            )
        if allow_resize and (rendered_w, rendered_h) != (figma_w, figma_h):
            rendered = rendered.resize((figma_w, figma_h), Image.LANCZOS)
            rendered_w, rendered_h = rendered.size
        if allow_crop:
            compare_h = min(figma_h, rendered_h)
            return figma.crop((0, 0, figma_w, compare_h)), rendered.crop((0, 0, figma_w, compare_h))

    return figma, rendered


def compute_ssim(img_a: Image.Image, img_b: Image.Image) -> float:
    """참고값용 SSIM (마스크 미적용, 게이트 기준 아님)."""
    a = np.array(img_a.convert("RGB"))
    b = np.array(img_b.convert("RGB"))
    score, _ = ssim(a, b, data_range=255, channel_axis=2, full=True)
    return float(score)


def compute_pixel_diff(
    img_a: Image.Image, img_b: Image.Image, threshold: float = 0.1
) -> tuple[np.ndarray, np.ndarray]:
    """
    반환: (mismatch_mask, max_diff_map)
    - mismatch_mask: bool (H, W) — threshold 초과 픽셀
    - max_diff_map: float32 (H, W) ∈ [0, 1] — 채널별 최대 차이
    """
    a = np.array(img_a.convert("RGB")).astype(np.float32) / 255.0
    b = np.array(img_b.convert("RGB")).astype(np.float32) / 255.0
    diff = np.abs(a - b)
    max_diff = diff.max(axis=2)
    mismatch = max_diff > threshold
    return mismatch, max_diff.astype(np.float32)


def extract_diff_regions(mask: np.ndarray, top_n: int = 10) -> list[dict]:
    from PIL import ImageFilter
    mask_uint8 = (mask.astype(np.uint8)) * 255
    pil_mask = Image.fromarray(mask_uint8)
    dilated = pil_mask.filter(ImageFilter.MaxFilter(9))
    dilated_arr = np.array(dilated) > 0

    visited = np.zeros_like(dilated_arr, dtype=bool)
    regions = []
    h, w = dilated_arr.shape
    for y in range(h):
        for x in range(w):
            if dilated_arr[y, x] and not visited[y, x]:
                stack = [(y, x)]
                ys, xs = [y], [x]
                visited[y, x] = True
                while stack:
                    cy, cx = stack.pop()
                    for dy, dx in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                        ny, nx = cy + dy, cx + dx
                        if 0 <= ny < h and 0 <= nx < w and dilated_arr[ny, nx] and not visited[ny, nx]:
                            visited[ny, nx] = True
                            stack.append((ny, nx))
                            ys.append(ny)
                            xs.append(nx)
                min_y, max_y = min(ys), max(ys)
                min_x, max_x = min(xs), max(xs)
                area = (max_y - min_y + 1) * (max_x - min_x + 1)
                mismatch_ratio = float(mask[min_y:max_y + 1, min_x:max_x + 1].sum()) / max(area, 1)
                regions.append({
                    "bbox": {"x": int(min_x), "y": int(min_y),
                             "width": int(max_x - min_x + 1), "height": int(max_y - min_y + 1)},
                    "mismatch_ratio": round(mismatch_ratio, 4),
                    "area_px": area,
                })
    regions.sort(key=lambda r: r["area_px"], reverse=True)
    for i, r in enumerate(regions[:top_n]):
        r["rank"] = i + 1
    return regions[:top_n]


def _diff_colormap(diff_val: float) -> tuple[int, int, int, int]:
    """max_diff_map ∈ [0,1] → RGBA 히트맵 색상."""
    if diff_val < 0.1:
        return (0, 0, 0, 0)  # 투명
    alpha = min(220, int(80 + diff_val * 200))
    if diff_val < 0.3:
        return (80, 200, 80, alpha)   # green
    elif diff_val < 0.6:
        return (240, 220, 60, alpha)  # yellow
    else:
        return (230, 60, 60, alpha)   # red


def generate_diff_image(
    figma: Image.Image,
    max_diff_map: np.ndarray,
    image_mask: np.ndarray,
    mask_regions: list[dict],
) -> Image.Image:
    """
    diff 히트맵 생성:
    - 베이스: figma 50% darken (ground truth)
    - green→yellow→red 히트맵 오버레이 (max_diff_map 기반)
    - mask 영역: 점선 테두리 사각형만 (비교 제외 표시)
    """
    # figma 50% darken
    base_arr = np.array(figma.convert("RGB")).astype(np.float32)
    base_arr = (base_arr * 0.5).astype(np.uint8)
    base = Image.fromarray(base_arr).convert("RGBA")

    # 히트맵 오버레이
    h, w = max_diff_map.shape
    overlay_arr = np.zeros((h, w, 4), dtype=np.uint8)
    for y in range(h):
        for x in range(w):
            if not image_mask[y, x]:
                rgba = _diff_colormap(float(max_diff_map[y, x]))
                overlay_arr[y, x] = rgba
    overlay = Image.fromarray(overlay_arr, "RGBA")
    result = Image.alpha_composite(base, overlay)

    # mask 영역: 점선 테두리 사각형
    draw = ImageDraw.Draw(result)
    for region in mask_regions:
        bbox = region["bbox_px"]
        x0, y0 = bbox["x"], bbox["y"]
        x1, y1 = x0 + bbox["width"], y0 + bbox["height"]
        # 점선 효과: 4px on / 4px off
        dash = 4
        for i in range(x0, x1, dash * 2):
            draw.line([(i, y0), (min(i + dash, x1), y0)], fill=(180, 180, 180, 200), width=1)
            draw.line([(i, y1 - 1), (min(i + dash, x1), y1 - 1)], fill=(180, 180, 180, 200), width=1)
        for i in range(y0, y1, dash * 2):
            draw.line([(x0, i), (x0, min(i + dash, y1))], fill=(180, 180, 180, 200), width=1)
            draw.line([(x1 - 1, i), (x1 - 1, min(i + dash, y1))], fill=(180, 180, 180, 200), width=1)

    return result


def generate_composite(figma: Image.Image, rendered: Image.Image, diff: Image.Image) -> Image.Image:
    """Figma | Rendered | Diff 세로 3분할 합성."""
    w = figma.width
    h = figma.height
    rendered_r = rendered.resize((w, h), Image.LANCZOS) if rendered.size != (w, h) else rendered
    diff_r = diff.resize((w, h), Image.LANCZOS) if diff.size != (w, h) else diff
    composite = Image.new("RGBA", (w * 3, h), (255, 255, 255, 255))
    composite.paste(figma.convert("RGBA"), (0, 0))
    composite.paste(rendered_r.convert("RGBA"), (w, 0))
    composite.paste(diff_r.convert("RGBA"), (w * 2, 0))
    return composite


# ─── 메인 ────────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(description="Pixel comparison for design-md-harness")
    parser.add_argument("--figma", required=True)
    parser.add_argument("--rendered", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--diff-png", default=None)
    parser.add_argument("--composite-png", default=None, help="Figma|Rendered|Diff 합성 PNG")
    parser.add_argument("--sample-name", default="unknown")
    parser.add_argument("--allow-resize", action="store_true", help="크기 불일치 시 rendered를 figma 폭에 맞게 resize")
    parser.add_argument("--allow-crop", action="store_true", help="크기 불일치 시 min 높이로 crop (레거시 동작)")
    parser.add_argument("--mask-json", default=None, help="image_mask.json 경로")
    parser.add_argument("--mask-scale", type=float, default=None, help="CSS→raster 변환 scale (명시 시 --fixture-meta보다 우선)")
    parser.add_argument("--fixture-meta", default=None, help="fixture.meta.json 경로 — figma_screenshot.scale 자동 로드")
    parser.add_argument("--mask-export-origin-x", type=float, default=0.0)
    parser.add_argument("--mask-export-origin-y", type=float, default=0.0)
    args = parser.parse_args()

    try:
        figma_img = load_image(args.figma)
        rendered_img = load_image(args.rendered)
    except Exception as e:
        _write_error(args.output, f"이미지 로드 실패: {e}")
        sys.exit(1)

    orig_figma = figma_img.size
    orig_rendered = rendered_img.size

    try:
        figma_img, rendered_img = normalize_images(
            figma_img, rendered_img,
            allow_resize=args.allow_resize,
            allow_crop=args.allow_crop,
        )
    except SizeMismatchError as e:
        _write_error(args.output, str(e))
        sys.exit(1)

    cw, ch = figma_img.size

    # mask 로드
    image_mask = np.zeros((ch, cw), dtype=bool)
    masked_regions: list[dict] = []

    # fixture.meta.json에서 scale 자동 로드 (--mask-scale 명시가 우선)
    fixture_scale = None
    if args.fixture_meta:
        try:
            meta = json.loads(Path(args.fixture_meta).read_text(encoding="utf-8"))
            fixture_scale = meta.get("figma_screenshot", {}).get("scale")
        except Exception:
            pass
    mask_scale = args.mask_scale if args.mask_scale is not None else (fixture_scale or 1.0)
    export_origin = (args.mask_export_origin_x, args.mask_export_origin_y)

    if args.mask_json and Path(args.mask_json).exists():
        image_mask, masked_regions = build_mask_from_json(
            args.mask_json, cw, ch,
            scale=mask_scale,
            export_origin=export_origin,
        )

    # diff 계산 — 원본에서 먼저 (mask 적용 전)
    ssim_naive = compute_ssim(figma_img, rendered_img)  # 참고값
    mismatch_mask, max_diff_map = compute_pixel_diff(figma_img, rendered_img)

    # mask는 mismatch 결과에만 적용
    effective_mask = ~image_mask
    mismatch_in_effective = mismatch_mask & effective_mask
    effective_px = int(effective_mask.sum())
    mismatch_px = int(mismatch_in_effective.sum())

    # effective_px == 0: mask이 전체를 덮어 비교 불가 → 자동 PASS 방지
    if effective_px == 0:
        _write_error(args.output, "mask_covers_all: effective_px=0, mask이 이미지 전체를 덮어 비교 불가")
        sys.exit(1)

    pixel_sim_effective = 1.0 - (mismatch_px / effective_px)

    regions = extract_diff_regions(mismatch_in_effective)

    if args.diff_png:
        diff_img = generate_diff_image(figma_img, max_diff_map, image_mask, masked_regions)
        Path(args.diff_png).parent.mkdir(parents=True, exist_ok=True)
        diff_img.save(args.diff_png)

        if args.composite_png:
            composite = generate_composite(figma_img, rendered_img, diff_img)
            Path(args.composite_png).parent.mkdir(parents=True, exist_ok=True)
            composite.save(args.composite_png)

    total_px = cw * ch
    masked_px = int(image_mask.sum())

    result = {
        "sample_name": args.sample_name,
        "figma_path": args.figma,
        "rendered_path": args.rendered,
        "image_size": {
            "figma_original": list(orig_figma),
            "rendered_original": list(orig_rendered),
            "compared": [cw, ch],
        },
        "image_asset_mask": {
            "applied": bool(image_mask.any()),
            "masked_regions": masked_regions,
            "masked_pixels": masked_px,
            "effective_pixels": effective_px,
        },
        "score_ssim_naive": round(ssim_naive, 4),       # 참고값 (마스크 미적용)
        "score_pixel_similarity": round(pixel_sim_effective, 4),  # 게이트 기준
        "pass": pixel_sim_effective >= PASS_THRESHOLD,
        "pass_threshold": PASS_THRESHOLD,
        "diff_regions": regions,
        "summary": {
            "total_pixels": total_px,
            "effective_pixels": effective_px,
            "masked_pixels": masked_px,
            "mismatch_pixels": mismatch_px,
            "mismatch_ratio": round(1.0 - pixel_sim_effective, 4),
        },
        "diff_png_path": args.diff_png,
        "composite_png_path": args.composite_png,
        "generated_at": datetime.now().isoformat(),
    }

    Path(args.output).parent.mkdir(parents=True, exist_ok=True)
    Path(args.output).write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(result, ensure_ascii=False, indent=2))
    sys.exit(0 if result["pass"] else 1)


def _write_error(output: str, msg: str) -> None:
    result = {"pass": False, "error": msg}
    Path(output).parent.mkdir(parents=True, exist_ok=True)
    Path(output).write_text(json.dumps(result, ensure_ascii=False, indent=2))
    print(json.dumps(result), file=sys.stderr)


if __name__ == "__main__":
    main()
