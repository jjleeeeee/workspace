#!/usr/bin/env python3
"""
figma_mcp_adapter.py — Figma MCP get_design_context JSX 출력 → figma_raw.json 변환기

공통 노드 순회/추출 로직은 harness.lib.figma_walker를 사용한다.

사용:
  python3 servers/figma_mcp_adapter.py \
    --jsx-input .tmp/design_context.jsx \
    --keep-ids-json fixture/component_spec.json \
    --output fixture/figma_raw.json
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any

# harness.lib 공통 모듈 import (SSOT)
sys.path.insert(0, str(Path(__file__).parent.parent))
from harness.lib import figma_walker as fw


# ─── JSX 파싱 ─────────────────────────────────────────────────────────────────

def _extract_attrs(tag: str) -> dict[str, str]:
    attrs: dict[str, str] = {}
    for m in re.finditer(r'([\w-]+)=["\']([^"\']*)["\']', tag):
        attrs[m.group(1)] = m.group(2)
    for m in re.finditer(r'([\w-]+)=\{([^}]*)\}', tag):
        attrs[m.group(1)] = m.group(2).strip('"\'')
    return attrs


def _extract_css_vars(class_str: str) -> list[dict]:
    """Tailwind className 내 var(--X,fallback) 패턴에서 fills boundVariables 추출."""
    fills = []
    for m in re.finditer(
        r"var\(--([^,)]+),\s*([^)]+)\)",
        class_str.replace("\\/", "/")
    ):
        raw_name = m.group(1).replace("\\", "").replace("--", "")
        fallback = m.group(2).strip()
        if "color" in raw_name or "fill" in raw_name or "surface" in raw_name:
            fills.append({
                "type": "SOLID",
                "color": _hex_to_rgba(fallback),
                "boundVariables": {
                    "color": {"type": "VAR_NAME", "name": raw_name}
                }
            })
    return fills


def _hex_to_rgba(hex_color: str) -> dict:
    hex_color = hex_color.strip().lstrip("#")
    if len(hex_color) == 3:
        hex_color = "".join(c * 2 for c in hex_color)
    if len(hex_color) < 6:
        return {"r": 0, "g": 0, "b": 0, "a": 1}
    r = int(hex_color[0:2], 16) / 255
    g = int(hex_color[2:4], 16) / 255
    b = int(hex_color[4:6], 16) / 255
    return {"r": round(r, 4), "g": round(g, 4), "b": round(b, 4), "a": 1.0}


def _extract_typography_from_class(class_str: str) -> dict:
    """Tailwind font-* 클래스에서 typography style 추출."""
    style: dict[str, Any] = {}
    m = re.search(r"font-\[family-name:var\(--([^,)]+)", class_str)
    if m:
        style["fontFamily"] = m.group(1)
    m = re.search(r"text-\[length:var\(--([^,)]+)", class_str)
    if m:
        style["fontSize"] = m.group(1)
    m = re.search(r"leading-\[var\(--([^,)]+)", class_str)
    if m:
        style["lineHeightToken"] = m.group(1)
    return style


def _extract_layout_from_class(class_str: str) -> dict:
    """Tailwind 클래스에서 layoutMode / itemSpacing / padding 추출.
    figma_walker의 extract_layout_axis / extract_padding 에 대응하는 JSX 전용 파서.
    """
    layout: dict[str, Any] = {}
    if "flex-col" in class_str:
        layout["layoutMode"] = "VERTICAL"
    elif re.search(r"\bflex\b", class_str):
        layout["layoutMode"] = "HORIZONTAL"

    gap_m = re.search(r"gap-\[(\d+(?:\.\d+)?)px\]", class_str)
    if gap_m:
        layout["itemSpacing"] = float(gap_m.group(1))

    for side, key in [("t", "paddingTop"), ("r", "paddingRight"),
                      ("b", "paddingBottom"), ("l", "paddingLeft")]:
        m = re.search(rf"p{side}-\[(\d+(?:\.\d+)?)px\]", class_str)
        if m:
            layout[key] = float(m.group(1))
    px_m = re.search(r"px-\[(\d+(?:\.\d+)?)px\]", class_str)
    if px_m:
        v = float(px_m.group(1))
        layout.setdefault("paddingLeft", v)
        layout.setdefault("paddingRight", v)
    py_m = re.search(r"py-\[(\d+(?:\.\d+)?)px\]", class_str)
    if py_m:
        v = float(py_m.group(1))
        layout.setdefault("paddingTop", v)
        layout.setdefault("paddingBottom", v)

    return layout


# ─── 노드 트리 구축 ────────────────────────────────────────────────────────────

def _build_nodes(jsx: str) -> list[dict]:
    """JSX에서 data-node-id를 가진 모든 요소를 flat 노드 목록으로 변환."""
    nodes: dict[str, dict] = {}

    # <p data-node-id> → TEXT 노드 직접 처리
    p_text_pattern = re.compile(
        r'<p([^>]*data-node-id[^>]*)>(.*?)</p>',
        re.DOTALL,
    )
    for m in p_text_pattern.finditer(jsx):
        attrs = _extract_attrs(m.group(1))
        node_id = attrs.get("data-node-id", "")
        if not node_id:
            continue
        text = m.group(2).strip()
        class_str = attrs.get("className", "") or attrs.get("class", "")
        node: dict[str, Any] = {
            "id": node_id,
            "name": attrs.get("data-name", ""),
            "type": "TEXT",
            "characters": text,
        }
        style = _extract_typography_from_class(class_str)
        if style:
            node["style"] = style
        nodes[node_id] = node

    tag_pattern = re.compile(
        r"<(?:div|span|ol|ul|li|section|article|main|header|footer|nav)"
        r"([^>]*data-node-id[^>]*)>",
        re.DOTALL,
    )

    for m in tag_pattern.finditer(jsx):
        attrs = _extract_attrs(m.group(0))
        node_id = attrs.get("data-node-id", "")
        if not node_id or node_id in nodes:  # TEXT already registered
            continue

        name = attrs.get("data-name", "")
        class_str = attrs.get("className", "") or attrs.get("class", "")

        node = {"id": node_id, "name": name, "type": "FRAME"}

        fills = _extract_css_vars(class_str)
        if fills:
            node["fills"] = fills

        layout = _extract_layout_from_class(class_str)
        node.update(layout)

        nodes[node_id] = node

    # <div data-node-id> 내부 <img src> → IMAGE fill 추가
    img_in_div_pattern = re.compile(
        r'data-node-id="([^"]+)"[^>]*>(?:[^<]*)<(?:div|span)[^>]*>(?:[^<]*)'
        r'<img\b[^>]+>',
        re.DOTALL,
    )
    for m in img_in_div_pattern.finditer(jsx):
        node_id = m.group(1)
        if node_id in nodes and nodes[node_id].get("type") != "TEXT":
            existing = nodes[node_id].setdefault("fills", [])
            existing.append({"type": "IMAGE"})

    return list(nodes.values())


# ─── 필터링 ───────────────────────────────────────────────────────────────────

def _load_keep_ids(component_spec_path: str) -> tuple[set[str], set[str]]:
    if not Path(component_spec_path).exists():
        return set(), set()
    spec = json.loads(Path(component_spec_path).read_text())
    keep_ids: set[str] = set()
    for sc in spec.get("sub_components") or []:
        keep_ids.update(sc.get("component_instance_ids") or [])
    exclude_ids: set[str] = set(spec.get("doc_structure_node_ids_to_exclude") or [])
    return keep_ids, exclude_ids


def _filter_nodes(nodes: list[dict], keep_ids: set[str], exclude_ids: set[str]) -> list[dict]:
    if not keep_ids:
        return nodes
    return [n for n in nodes if n["id"] in keep_ids and n["id"] not in exclude_ids]


# ─── 메인 ─────────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(description="Figma MCP JSX → figma_raw.json 변환기")
    parser.add_argument("--jsx-input", required=True)
    parser.add_argument("--keep-ids-json", default="")
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    jsx = Path(args.jsx_input).read_text(encoding="utf-8")
    nodes = _build_nodes(jsx)

    if args.keep_ids_json:
        keep_ids, exclude_ids = _load_keep_ids(args.keep_ids_json)
        if keep_ids:
            nodes = _filter_nodes(nodes, keep_ids, exclude_ids)

    result = {"nodes": nodes}
    Path(args.output).write_text(
        json.dumps(result, indent=2, ensure_ascii=False), encoding="utf-8"
    )

    text_count = sum(1 for n in nodes if n.get("type") == "TEXT")
    color_count = sum(1 for n in nodes if n.get("fills"))
    print(f"Saved {args.output}: {len(nodes)} nodes, {text_count} TEXT, {color_count} with fills")


if __name__ == "__main__":
    main()
