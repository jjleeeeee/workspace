"""
figma_walker.py — figma_raw.json 노드 순회 공통 유틸 (SSOT)

design_md_harness.py / figma_mcp_adapter.py 양쪽에서 중복으로 정의했던
_walk_figma, _to_kebab, 레이아웃·색상 추출 로직을 단일 모듈로 통합.
"""
from __future__ import annotations

import re
from typing import Any


# ─── 노드 순회 ────────────────────────────────────────────────────────────────

def walk(node: dict) -> list[dict]:
    """단일 노드를 루트로 하는 트리를 flat 리스트로 반환."""
    result = [node]
    for child in node.get("children") or []:
        result.extend(walk(child))
    return result


def all_nodes(figma_raw: dict) -> list[dict]:
    """figma_raw.json 전체 노드를 flat 리스트로 반환."""
    acc: list[dict] = []
    for root in figma_raw.get("nodes") or []:
        acc.extend(walk(root))
    return acc


# ─── 이름 변환 ────────────────────────────────────────────────────────────────

def to_kebab(name: str) -> str:
    """PascalCase / 공백 / 슬래시 → kebab-case."""
    return re.sub(r"[\s_/]+", "-", name.lower().strip())


# ─── 색상 추출 ────────────────────────────────────────────────────────────────

def rgb_to_hex(color: dict) -> str:
    """Figma RGBA dict (0~1 range) → hex string."""
    try:
        r = round((color.get("r") or 0) * 255)
        g = round((color.get("g") or 0) * 255)
        b = round((color.get("b") or 0) * 255)
        return f"#{r:02x}{g:02x}{b:02x}"
    except Exception:
        return ""


def resolve_token_name(binding: Any, token_map: dict) -> str:
    """Figma boundVariables binding → CDS 토큰 이름.

    두 가지 형식 지원:
    - VariableID 기반 (Figma REST API → figma_raw.json)
    - VAR_NAME 기반 (Figma MCP → figma_mcp_adapter 출력)
    """
    if not isinstance(binding, dict):
        return ""
    # VariableID 기반
    var_id = binding.get("id") or ""
    if var_id:
        mapped = token_map.get("figma_var_id_to_cds") or {}
        result = mapped.get(var_id, "")
        if result:
            return result
    # VAR_NAME 기반
    if binding.get("type") == "VAR_NAME":
        var_name = binding.get("name") or ""
        if var_name:
            return var_name.replace("/", ".")
    return ""


# ─── 레이아웃 추출 ────────────────────────────────────────────────────────────

def extract_layout_axis(node: dict) -> str | None:
    """노드에서 레이아웃 axis 추출. 없으면 None."""
    layout = node.get("layout") or {}
    layout_mode = node.get("layoutMode") or layout.get("layoutMode") or ""
    if layout.get("kind") == "stack":
        return layout.get("axis") or ("horizontal" if layout_mode == "HORIZONTAL" else "vertical")
    if layout_mode == "HORIZONTAL":
        return "horizontal"
    if layout_mode == "VERTICAL":
        return "vertical"
    return None


def extract_padding(node: dict) -> dict[str, float]:
    """노드에서 padding 값 추출. {top, right, bottom, left}"""
    keys = {"paddingTop": "top", "paddingRight": "right",
            "paddingBottom": "bottom", "paddingLeft": "left"}
    result: dict[str, float] = {}
    for figma_key, md_key in keys.items():
        val = node.get(figma_key)
        if val is not None:
            result[md_key] = float(val)
    return result


def is_layout_node(node: dict) -> bool:
    """auto-layout이 적용된 노드인지 판단."""
    layout = node.get("layout") or {}
    layout_mode = node.get("layoutMode") or layout.get("layoutMode") or ""
    return layout.get("kind") == "stack" or layout_mode in ("HORIZONTAL", "VERTICAL")


# ─── variant 수집 ─────────────────────────────────────────────────────────────

def collect_variant_nodes(figma_raw: dict) -> list[dict]:
    """COMPONENT_SET 하위의 COMPONENT(variant) 노드를 수집.

    Returns: [{"variant_name": str, "node_id": str, "parent_name": str}, ...]
    """
    results: list[dict] = []
    for node in all_nodes(figma_raw):
        if node.get("type") == "COMPONENT":
            parent_name = (node.get("parent") or {}).get("name") or ""
            results.append({
                "variant_name": node.get("name") or "",
                "node_id": node.get("id") or "",
                "parent_name": parent_name,
            })
    return results


# ─── TEXT 노드 textAutoResize / overflow 추출 ─────────────────────────────────

def extract_text_behavior(node: dict) -> dict:
    """TEXT 노드에서 textAutoResize 및 overflow 단서 추출.

    Returns: {
        "node_id": str,
        "name": str,
        "text_auto_resize": str,   # "NONE" | "WIDTH_AND_HEIGHT" | "HEIGHT" | "TRUNCATE"
        "overflow_policy": str,    # "clip" | "scroll" | "unknown"
    }
    """
    resize = (
        node.get("textAutoResize")
        or (node.get("style") or {}).get("textAutoResize")
        or "NONE"
    )
    overflow = node.get("overflow") or node.get("textTruncation") or ""
    if "TRUNCAT" in str(resize).upper() or "TRUNCAT" in str(overflow).upper():
        overflow_policy = "truncate"
    elif "CLIP" in str(overflow).upper():
        overflow_policy = "clip"
    elif "SCROLL" in str(overflow).upper():
        overflow_policy = "scroll"
    else:
        overflow_policy = "unknown"

    return {
        "node_id": node.get("id") or "",
        "name": node.get("name") or "",
        "text_auto_resize": str(resize).upper(),
        "overflow_policy": overflow_policy,
    }


def collect_text_behaviors(figma_raw: dict) -> list[dict]:
    """figma_raw 전체 TEXT 노드의 text_behavior 수집."""
    return [extract_text_behavior(n) for n in all_nodes(figma_raw) if n.get("type") == "TEXT"]


# ─── asset 노드 role 분류 ──────────────────────────────────────────────────────

_ICON_PATTERNS = re.compile(r"\bicon\b", re.IGNORECASE)
_IMAGE_PATTERNS = re.compile(r"\b(image|img|photo|thumbnail)\b", re.IGNORECASE)
_LOGO_PATTERNS = re.compile(r"\b(logo|brand)\b", re.IGNORECASE)
_BADGE_PATTERNS = re.compile(r"\b(badge|dot|indicator)\b", re.IGNORECASE)


def classify_asset_role(node: dict) -> str | None:
    """INSTANCE 또는 VECTOR 노드의 asset role 분류.

    Returns: "icon" | "image" | "logo" | "badge" | None
    """
    name = node.get("name") or ""
    comp_name = (node.get("mainComponent") or {}).get("name") or ""
    combined = f"{name} {comp_name}"

    if _LOGO_PATTERNS.search(combined):
        return "logo"
    if _BADGE_PATTERNS.search(combined):
        return "badge"
    if _ICON_PATTERNS.search(combined):
        return "icon"
    if _IMAGE_PATTERNS.search(combined):
        return "image"

    # INSTANCE이지만 패턴 매칭 안 되면 icon으로 폴백 (Figma DS atom은 대부분 icon)
    if node.get("type") == "INSTANCE":
        return "icon"
    return None


def collect_asset_nodes(figma_raw: dict) -> list[dict]:
    """figma_raw에서 icon/image/logo/badge로 분류 가능한 노드 수집."""
    results: list[dict] = []
    for node in all_nodes(figma_raw):
        if node.get("type") not in ("INSTANCE", "VECTOR", "FRAME"):
            continue
        role = classify_asset_role(node)
        if role:
            bbox = node.get("absoluteBoundingBox") or node.get("bbox") or {}
            instance_w = float(bbox.get("width", 0)) if bbox else 0.0
            instance_h = float(bbox.get("height", 0)) if bbox else 0.0
            results.append({
                "node_id": node.get("id") or "",
                "name": node.get("name") or "",
                "role": role,
                "visible": node.get("visible", True),
                "parent_node_id": (node.get("parent") or {}).get("id") or "",
                "bbox": {
                    "x": float(bbox.get("x", 0)),
                    "y": float(bbox.get("y", 0)),
                    "width": instance_w,
                    "height": instance_h,
                },
                "instance_size": {"width": instance_w, "height": instance_h},
            })
    return results


def collect_visible_overlays(figma_raw: dict, representative_node_id: str) -> list[dict]:
    """representative variant 서브트리에서 visible=True인 오버레이 노드 수집.

    오버레이: role이 icon/image/logo/badge인 INSTANCE 또는 자체적으로 의미있는 레이어.
    Returns: [{"node_id", "name", "role", "visible", "instance_size"}]
    """
    rep_node: dict | None = None
    for node in all_nodes(figma_raw):
        if node.get("id") == representative_node_id:
            rep_node = node
            break
    if rep_node is None:
        return []

    results: list[dict] = []
    for node in walk(rep_node):
        if node.get("id") == representative_node_id:
            continue
        if node.get("visible") is False:
            continue
        role = classify_asset_role(node)
        if role:
            bbox = node.get("absoluteBoundingBox") or node.get("bbox") or {}
            results.append({
                "node_id": node.get("id") or "",
                "name": node.get("name") or "",
                "role": role,
                "visible": True,
                "instance_size": {
                    "width": float(bbox.get("width", 0)),
                    "height": float(bbox.get("height", 0)),
                },
            })
    return results
