"""
svg_inline.py 회귀 테스트 5 케이스
  1. javascript: href → 제거
  2. // protocol-relative → 제거
  3. <style>@import url(http://...) → <style> 태그 통째 제거
  4. 다색 SVG + colorable=False(기본) → fill 색상 그대로 보존
  5. 동일 SVG 2회 인라인 → ID prefix 충돌 없음
"""

import sys
import tempfile
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).parent.parent / "harness" / "lib"))
from svg_inline import sanitize


def _write_svg(content: str) -> Path:
    f = tempfile.NamedTemporaryFile(mode="w", suffix=".svg", delete=False, encoding="utf-8")
    f.write(content)
    f.flush()
    return Path(f.name)


# Case 1: javascript: href 차단
def test_javascript_href_blocked():
    svg_path = _write_svg(
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">'
        '<a href="javascript:alert(1)"><rect width="16" height="16"/></a>'
        '</svg>'
    )
    result = sanitize(svg_path, component_ref="test_xss")
    svg_path.unlink()
    assert "javascript:" not in result, "javascript: href가 제거되어야 함"


# Case 2: // protocol-relative 차단
def test_proto_relative_href_blocked():
    svg_path = _write_svg(
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">'
        '<image href="//evil.com/x.png" width="16" height="16"/>'
        '</svg>'
    )
    result = sanitize(svg_path, component_ref="test_proto")
    svg_path.unlink()
    assert "//evil.com" not in result, "protocol-relative URL이 제거되어야 함"


# Case 3: <style> 태그 통째 제거
def test_style_tag_removed():
    svg_path = _write_svg(
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">'
        '<style>@import url(http://evil.com/x.css); .cls { fill: red; }</style>'
        '<rect class="cls" width="16" height="16"/>'
        '</svg>'
    )
    result = sanitize(svg_path, component_ref="test_style")
    svg_path.unlink()
    assert "<style" not in result, "<style> 태그가 제거되어야 함"
    assert "@import" not in result, "@import가 제거되어야 함"
    assert "evil.com" not in result, "외부 URL이 제거되어야 함"


# Case 4: 다색 SVG + colorable=False(기본) → fill 색상 보존
def test_multicolor_svg_preserves_fills_when_not_colorable():
    svg_path = _write_svg(
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">'
        '<rect fill="#FF0000" width="12" height="24"/>'
        '<rect fill="#0000FF" x="12" width="12" height="24"/>'
        '</svg>'
    )
    result = sanitize(svg_path, component_ref="test_multicolor", colorable=False)
    svg_path.unlink()
    assert "currentColor" not in result, "colorable=False 시 currentColor로 치환 금지"
    assert "#FF0000" in result or "FF0000" in result.upper(), "빨간 fill이 보존되어야 함"


# Case 5: 동일 SVG 2회 인라인 → ID prefix 충돌 없음
def test_no_id_collision_on_double_inline():
    svg_content = (
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">'
        '<defs><clipPath id="clip1"><rect width="16" height="16"/></clipPath></defs>'
        '<rect clip-path="url(#clip1)" width="16" height="16"/>'
        '</svg>'
    )
    svg_path = _write_svg(svg_content)
    result1 = sanitize(svg_path, component_ref="icon_a")
    result2 = sanitize(svg_path, component_ref="icon_b")
    svg_path.unlink()

    # 두 결과에서 prefix된 ID 추출
    import re
    ids1 = set(re.findall(r'id="([^"]+)"', result1))
    ids2 = set(re.findall(r'id="([^"]+)"', result2))
    # 각각 prefix가 다르므로 겹치지 않아야 함
    assert not (ids1 & ids2), f"ID 충돌 발생: {ids1 & ids2}"
