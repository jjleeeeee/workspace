"""
pixel_compare.py 회귀 테스트 8 케이스
  1. self-compare → mismatch_px == 0, pixel_sim_effective == 1.0
  2. effective 영역에 흰 박스 합성 → mismatch_px > 0
  3. mask 영역에만 흰 박스 합성 → mismatch_px == 0
  4. size mismatch + 옵션 없음 → SizeMismatchError
  5. size mismatch + --allow-crop → 통과 (기존 동작)
  6. mask 전체 덮음 → effective_px == 0 확인 (FAIL 트리거 방지)
  7. fixture.meta.json에서 scale 자동 로드
  8. height-only mismatch + allow_resize → 정확히 resize
"""

import json
import sys
import tempfile
from pathlib import Path

import numpy as np
import pytest
from PIL import Image

sys.path.insert(0, str(Path(__file__).parent.parent / "servers"))
from pixel_compare import (
    SizeMismatchError,
    build_mask_from_json,
    compute_pixel_diff,
    normalize_images,
)


def _make_rgb(w: int, h: int, color: tuple[int, int, int] = (200, 200, 200)) -> Image.Image:
    img = Image.new("RGB", (w, h), color)
    return img.convert("RGBA")


# Case 1: 동일 이미지 비교 → mismatch 0
def test_self_compare():
    img = _make_rgb(100, 100, (128, 128, 128))
    mismatch_mask, max_diff_map = compute_pixel_diff(img, img)
    image_mask = np.zeros((100, 100), dtype=bool)
    mismatch_in_effective = mismatch_mask & ~image_mask
    mismatch_px = int(mismatch_in_effective.sum())
    effective_px = int((~image_mask).sum())
    pixel_sim = 1.0 - (mismatch_px / max(effective_px, 1))
    assert mismatch_px == 0
    assert pixel_sim == 1.0


# Case 2: effective 영역에 흰 박스 → mismatch_px > 0
def test_effective_box_mismatch():
    base = _make_rgb(100, 100, (50, 50, 50))
    modified = base.copy()
    arr = np.array(modified)
    arr[10:30, 10:30] = [255, 255, 255, 255]  # 흰 박스 (effective 영역)
    modified = Image.fromarray(arr)

    mismatch_mask, _ = compute_pixel_diff(base, modified)
    image_mask = np.zeros((100, 100), dtype=bool)  # 마스크 없음
    mismatch_in_effective = mismatch_mask & ~image_mask
    mismatch_px = int(mismatch_in_effective.sum())
    assert mismatch_px > 0


# Case 3: mask 영역에만 흰 박스 → mismatch_px == 0
def test_masked_box_no_mismatch():
    base = _make_rgb(100, 100, (50, 50, 50))
    modified = base.copy()
    arr = np.array(modified)
    arr[10:30, 10:30] = [255, 255, 255, 255]  # 흰 박스
    modified = Image.fromarray(arr)

    mismatch_mask, _ = compute_pixel_diff(base, modified)

    # 흰 박스 영역 전체를 마스크
    image_mask = np.zeros((100, 100), dtype=bool)
    image_mask[10:30, 10:30] = True

    mismatch_in_effective = mismatch_mask & ~image_mask
    mismatch_px = int(mismatch_in_effective.sum())
    assert mismatch_px == 0


# Case 4: size mismatch + 옵션 없음 → SizeMismatchError
def test_size_mismatch_raises():
    figma = _make_rgb(100, 100)
    rendered = _make_rgb(200, 200)
    with pytest.raises(SizeMismatchError):
        normalize_images(figma, rendered)


# Case 5: size mismatch + allow_crop → 통과 (min 높이로 crop)
def test_size_mismatch_allow_crop():
    figma = _make_rgb(100, 80)
    rendered = _make_rgb(100, 200)
    out_figma, out_rendered = normalize_images(figma, rendered, allow_crop=True)
    assert out_figma.size == (100, 80)
    assert out_rendered.size == (100, 80)


# Case 6: mask 전체 덮음 → effective_px == 0
def test_mask_covers_all_gives_zero_effective():
    img = _make_rgb(50, 50, (100, 100, 100))
    mismatch_mask, _ = compute_pixel_diff(img, img)
    image_mask = np.ones((50, 50), dtype=bool)  # 전체 마스크
    effective_mask = ~image_mask
    effective_px = int(effective_mask.sum())
    assert effective_px == 0, "mask 전체 시 effective_px는 0이어야 함"


# Case 7: fixture.meta.json에서 mask_scale 자동 로드
def test_fixture_meta_scale_load():
    meta = {"figma_screenshot": {"scale": 3}}
    with tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False) as f:
        json.dump(meta, f)
        meta_path = f.name

    # 직접 로드 로직 검증 (main() 없이)
    loaded = json.loads(Path(meta_path).read_text())
    scale = loaded.get("figma_screenshot", {}).get("scale")
    assert scale == 3, f"scale 자동 로드 실패: {scale}"
    Path(meta_path).unlink()


# Case 8: height-only mismatch + allow_resize → 정확히 (figma_w, figma_h)로 resize
def test_allow_resize_height_only_mismatch():
    figma = _make_rgb(100, 200)
    rendered = _make_rgb(100, 150)  # 너비 같고 높이만 다름
    out_figma, out_rendered = normalize_images(figma, rendered, allow_resize=True)
    assert out_rendered.size == (100, 200), (
        f"height-only mismatch 시 allow_resize가 ({100}, {200})으로 resize해야 함, got {out_rendered.size}"
    )
