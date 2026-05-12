"""
svg_inline.py — SVG 보안 sanitize 후 인라인 삽입용 준비

보안 규칙:
  - root <svg> width/height 재설정
  - 모든 id, url(#...) 참조에 컴포넌트별 prefix (ID 충돌 방지)
  - 제거: <script>, <style>, on* 속성, <foreignObject>
  - 차단: href/xlink:href/src에서 javascript:, vbscript:, data:text/html,
          protocol-relative (//), 외부 href (http/https/file)
  - <image href> 외부 참조 차단 (data: URI만 허용)
  - CSS url(http..) / url(javascript:) 차단
  - colorable 기본값: False (안전 우선). manifest.json에서 명시적으로 전달받을 것.
    colorable=True + 단색 fill/stroke만 currentColor 치환
    (gradient/mask 자동 검출 시 colorable 강제 False)
"""

from __future__ import annotations

import re
import uuid
import xml.etree.ElementTree as ET
from pathlib import Path


def _auto_detect_colorable(svg_text: str) -> bool:
    """gradient 또는 mask 패턴 있으면 colorable=False."""
    blockers = re.compile(
        r"<(linearGradient|radialGradient|pattern|mask)\b",
        re.IGNORECASE,
    )
    return not bool(blockers.search(svg_text))


def _make_prefix(component_ref: str) -> str:
    safe = re.sub(r"[^a-zA-Z0-9_-]", "_", component_ref)
    short = str(uuid.uuid4())[:8]
    return f"svg_{safe}_{short}"


_DANGEROUS_SCHEME = re.compile(
    r"^\s*(javascript|vbscript|data\s*:\s*text/html):",
    re.IGNORECASE,
)
_PROTO_RELATIVE = re.compile(r"^\s*//")
_EXTERNAL_URL = re.compile(r"^(https?:|file:)", re.IGNORECASE)
_DATA_URI = re.compile(r"^data:", re.IGNORECASE)
_CSS_DANGEROUS_URL = re.compile(
    r"url\s*\(\s*['\"]?\s*(javascript:|vbscript:|//|https?:|file:)",
    re.IGNORECASE,
)
_DANGEROUS_ATTRS = re.compile(r"^on\w+$", re.IGNORECASE)


def _is_dangerous_url(val: str) -> bool:
    return bool(_DANGEROUS_SCHEME.match(val) or _PROTO_RELATIVE.match(val))


def sanitize(
    svg_path: Path,
    *,
    component_ref: str,
    width: str | None = None,
    height: str | None = None,
    colorable: bool = False,
) -> str:
    """
    SVG 파일을 읽어 sanitize 후 인라인 삽입 가능한 문자열 반환.

    Args:
        svg_path: SVG 파일 경로
        component_ref: ID prefix용 컴포넌트 키 (예: "birthday_hat")
        width: 덮어쓸 width 값 (예: "16px")
        height: 덮어쓸 height 값 (예: "16px")
        colorable: True이면 단색 fill/stroke → currentColor 치환.
                   False(기본)이면 색상 그대로 보존.
                   manifest.json의 colorable 필드에서 명시적으로 전달받을 것.
    """
    raw = svg_path.read_text(encoding="utf-8")

    # gradient/mask 있으면 colorable 강제 False (손상 방지)
    if colorable and not _auto_detect_colorable(raw):
        colorable = False

    prefix = _make_prefix(component_ref)

    ET.register_namespace("", "http://www.w3.org/2000/svg")
    ET.register_namespace("xlink", "http://www.w3.org/1999/xlink")

    try:
        root = ET.fromstring(raw)
    except ET.ParseError as e:
        raise ValueError(f"SVG 파싱 실패 ({svg_path.name}): {e}") from e

    xlink_ns = "http://www.w3.org/1999/xlink"

    # width/height 재설정 (root <svg> 만)
    if width is not None:
        root.set("width", width)
    if height is not None:
        root.set("height", height)

    # viewBox 유지 (없으면 width×height로 생성)
    if "viewBox" not in root.attrib and width and height:
        w_num = re.sub(r"[^\d.]", "", width) or "0"
        h_num = re.sub(r"[^\d.]", "", height) or "0"
        root.set("viewBox", f"0 0 {w_num} {h_num}")

    def _prefix_id(val: str) -> str:
        return f"{prefix}_{val}"

    def _rewrite_url_ref(val: str) -> str:
        return re.sub(r"url\(#([^)]+)\)", lambda m: f"url(#{_prefix_id(m.group(1))})", val)

    def _process_node(node: ET.Element) -> bool:
        """노드 처리. True 반환 시 부모에서 제거."""
        tag_local = node.tag.split("}")[-1] if "}" in node.tag else node.tag

        # 위험 태그 제거
        if tag_local.lower() in ("script", "foreignobject", "style"):
            return True

        # id prefix 부여
        if "id" in node.attrib:
            node.set("id", _prefix_id(node.attrib["id"]))

        attrs_to_delete = []
        for attr, val in list(node.attrib.items()):
            attr_local = attr.split("}")[-1] if "}" in attr else attr

            # on* 이벤트 핸들러 제거
            if _DANGEROUS_ATTRS.match(attr_local):
                attrs_to_delete.append(attr)
                continue

            # xlink:href / href / src 처리
            if attr_local in ("href", "src") or attr == f"{{{xlink_ns}}}href":
                if _is_dangerous_url(val) or _EXTERNAL_URL.match(val):
                    attrs_to_delete.append(attr)
                elif val.startswith("#"):
                    node.set(attr, f"#{_prefix_id(val[1:])}")
                elif not _DATA_URI.match(val) and tag_local.lower() == "image":
                    # <image>: data: URI만 허용
                    attrs_to_delete.append(attr)
                continue

            # url(#...) 참조 rewrite
            if "url(#" in val:
                node.set(attr, _rewrite_url_ref(val))

            # CSS 내 위험 URL 차단
            if attr_local == "style" and _CSS_DANGEROUS_URL.search(val):
                node.set(attr, re.sub(r"url\s*\([^)]*\)", "none", val))

            # colorable: fill/stroke currentColor 치환 (단색만)
            if colorable and attr_local in ("fill", "stroke"):
                if not val.startswith("url(") and val not in ("none", "inherit", "currentColor", "transparent"):
                    node.set(attr, "currentColor")

        for attr in attrs_to_delete:
            del node.attrib[attr]

        # 자식 순회 (역순으로 제거 안전)
        to_remove = []
        for child in list(node):
            if _process_node(child):
                to_remove.append(child)
        for child in to_remove:
            node.remove(child)

        return False

    _process_node(root)

    result = ET.tostring(root, encoding="unicode", xml_declaration=False)
    return result
