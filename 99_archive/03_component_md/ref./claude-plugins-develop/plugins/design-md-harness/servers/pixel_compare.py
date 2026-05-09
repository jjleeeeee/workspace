#!/usr/bin/env python3
"""
pixel_compare.py — design-md-harness용 픽셀 비교 도구

cds-ds 버전과의 차이:
- DSL 트리 의존 제거 → --mask-json (image_mask.json) 으로 이미지 영역 마스킹
- SSIM PASS 임계값: 0.95 → 0.85

사용:
  python3 pixel_compare.py \
    --figma <path> --rendered <path> \
    --output <path> [--diff-png <path>] \
    [--sample-name <name>] [--match-figma-width] \
    [--mask-json fixture/image_mask.json]
"""

import argparse
import json
import sys
from datetime import datetime
from pathlib import Path

import numpy as np
from PIL import Image
from skimage.metrics import structural_similarity as ssim


PASS_THRESHOLD = 0.85


# ─── 마스킹 (image_mask.json 기반) ──────────────────────────────────────────

def build_mask_from_json(mask_json_path: str, compare_w: int, compare_h: int) -> tuple[np.ndarray, list[dict]]:
    """image_mask.json [{id, name, x, y, width, height, figma_w, figma_h}...] → boolean mask."""
    try:
        regions: list[dict] = json.loads(Path(mask_json_path).read_text(encoding="utf-8"))
    except Exception:
        return np.zeros((compare_h, compare_w), dtype=bool), []

    mask = np.zeros((compare_h, compare_w), dtype=bool)
    applied = []

    for r in regions:
        # image_mask.json의 좌표는 Figma 원본 크기 기준 → compare 크기로 스케일
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
            applied.append({"id": r.get("id", ""), "name": r.get("name", ""),
                            "bbox_px": {"x": x0, "y": y0, "width": x1 - x0, "height": y1 - y0}})

    return mask, applied


def apply_mask(img_a: Image.Image, img_b: Image.Image, mask: np.ndarray) -> tuple[Image.Image, Image.Image]:
    if not mask.any():
        return img_a, img_b
    neutral = (128, 128, 128)
    a_arr = np.array(img_a.convert("RGB"))
    b_arr = np.array(img_b.convert("RGB"))
    a_arr[mask] = neutral
    b_arr[mask] = neutral
    return Image.fromarray(a_arr), Image.fromarray(b_arr)


# ─── 이미지 유틸 ─────────────────────────────────────────────────────────────

def load_image(path: str) -> Image.Image:
    img = Image.open(path).convert("RGBA")
    white_bg = Image.new("RGBA", img.size, (255, 255, 255, 255))
    white_bg.paste(img, mask=img.split()[3])
    return white_bg.convert("RGBA")


def normalize_images(figma: Image.Image, rendered: Image.Image, match_width: bool) -> tuple[Image.Image, Image.Image]:
    figma_w, figma_h = figma.size
    rendered_w, rendered_h = rendered.size

    if match_width and rendered_w != figma_w:
        scale = figma_w / rendered_w
        new_h = int(rendered_h * scale)
        rendered = rendered.resize((figma_w, new_h), Image.LANCZOS)
        rendered_w, rendered_h = rendered.size

    compare_h = min(figma_h, rendered_h)
    return figma.crop((0, 0, figma_w, compare_h)), rendered.crop((0, 0, figma_w, compare_h))


def compute_ssim(img_a: Image.Image, img_b: Image.Image) -> tuple[float, np.ndarray]:
    a = np.array(img_a.convert("RGB"))
    b = np.array(img_b.convert("RGB"))
    score, diff_map = ssim(a, b, data_range=255, channel_axis=2, full=True)
    return float(score), diff_map


def compute_pixel_diff(img_a: Image.Image, img_b: Image.Image, threshold: float = 0.1) -> tuple[float, np.ndarray]:
    a = np.array(img_a.convert("RGB")).astype(float) / 255.0
    b = np.array(img_b.convert("RGB")).astype(float) / 255.0
    diff = np.abs(a - b)
    max_diff = diff.max(axis=2)
    mismatch = max_diff > threshold
    similarity = 1.0 - (mismatch.sum() / mismatch.size)
    return float(similarity), mismatch


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


def generate_diff_image(figma: Image.Image, rendered: Image.Image,
                        mismatch: np.ndarray, image_mask: np.ndarray) -> Image.Image:
    base = rendered.convert("RGBA")
    overlay_arr = np.zeros((*base.size[::-1], 4), dtype=np.uint8)
    overlay_arr[mismatch] = [255, 0, 0, 100]
    if image_mask.any():
        overlay_arr[image_mask] = [0, 100, 255, 80]
    overlay = Image.fromarray(overlay_arr, "RGBA")
    return Image.alpha_composite(base, overlay)


# ─── 메인 ────────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(description="Pixel comparison for design-md-harness")
    parser.add_argument("--figma", required=True)
    parser.add_argument("--rendered", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--diff-png", default=None)
    parser.add_argument("--sample-name", default="unknown")
    parser.add_argument("--match-figma-width", action="store_true")
    parser.add_argument("--mask-json", default=None, help="image_mask.json 경로")
    args = parser.parse_args()

    try:
        figma_img = load_image(args.figma)
        rendered_img = load_image(args.rendered)
    except Exception as e:
        _write_error(args.output, f"이미지 로드 실패: {e}")
        sys.exit(1)

    orig_figma = figma_img.size
    orig_rendered = rendered_img.size
    figma_img, rendered_img = normalize_images(figma_img, rendered_img, args.match_figma_width)
    cw, ch = figma_img.size

    image_mask = np.zeros((ch, cw), dtype=bool)
    masked_regions: list[dict] = []
    if args.mask_json and Path(args.mask_json).exists():
        image_mask, masked_regions = build_mask_from_json(args.mask_json, cw, ch)
        if image_mask.any():
            figma_img, rendered_img = apply_mask(figma_img, rendered_img, image_mask)

    ssim_score, _ = compute_ssim(figma_img, rendered_img)
    pixel_sim, mismatch_mask = compute_pixel_diff(figma_img, rendered_img)

    if image_mask.any():
        mismatch_mask = mismatch_mask & ~image_mask
    regions = extract_diff_regions(mismatch_mask)

    if args.diff_png:
        diff_img = generate_diff_image(figma_img, rendered_img, mismatch_mask, image_mask)
        Path(args.diff_png).parent.mkdir(parents=True, exist_ok=True)
        diff_img.save(args.diff_png)

    total_px = cw * ch
    masked_px = int(image_mask.sum())
    effective_px = total_px - masked_px
    mismatch_px = int(effective_px * (1.0 - pixel_sim))

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
        "score_ssim": round(ssim_score, 4),
        "score_pixel_similarity": round(pixel_sim, 4),
        "pass": ssim_score >= PASS_THRESHOLD,
        "pass_threshold": PASS_THRESHOLD,
        "diff_regions": regions,
        "summary": {
            "total_pixels": total_px,
            "effective_pixels": effective_px,
            "mismatch_pixels": mismatch_px,
            "mismatch_ratio": round(1.0 - pixel_sim, 4),
        },
        "diff_png_path": args.diff_png,
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
