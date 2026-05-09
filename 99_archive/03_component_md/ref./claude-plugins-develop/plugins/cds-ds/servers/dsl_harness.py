#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
"""
DSL v2 구조적 하네스 평가기

figma_fetch_design() 응답과 생성된 DSL v2 JSON을 비교해 구조적 완성도 점수를 출력한다.
점수 80 이상: PASS, 미만: FAIL (exit code 1).

DSL v2 구조 가정:
  { schemaVersion, metadata, coordinateSystem, nodes: [Node, ...] }
  Node: { id, type, name, catalog?, layout?, style?, text?, asset?, children? }

사용:
  uv run --script dsl_harness.py <figma_raw.json> <dsl_output.json>
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any


def _collect_figma_instances(node: dict) -> list[dict]:
    results = []
    if node.get("type") == "INSTANCE":
        results.append(node)
    for child in node.get("children", []):
        results.extend(_collect_figma_instances(child))
    return results


def _figma_response_instances(figma_raw: dict) -> list[dict]:
    """`nodes` 트리에서 INSTANCE 노드 수집."""
    acc: list[dict] = []
    for root in figma_raw.get("nodes") or []:
        acc.extend(_collect_figma_instances(root))
    return acc


def _collect_dsl_nodes(nodes: list[dict]) -> list[dict]:
    results = []
    for n in nodes:
        results.append(n)
        if n.get("children"):
            results.extend(_collect_dsl_nodes(n["children"]))
    return results


def _match_dsl(figma_name: str, dsl_nodes: list[dict]) -> dict | None:
    name_lower = figma_name.lower().replace(" ", "-")
    for n in dsl_nodes:
        catalog = n.get("catalog") or {}
        c_id = (catalog.get("id") or "").lower()
        n_name = (n.get("name") or "").lower()
        if n_name == figma_name.lower() or (c_id and (c_id in name_lower or name_lower in c_id)):
            return n
    return None


def _has_catalog(n: dict) -> bool:
    return bool(n.get("catalog") and n["catalog"].get("id"))


def _figma_size_axis_match(figma_size_axis: dict | None, dsl_size_axis: dict | None) -> bool:
    """v2 정규화된 Figma SizePolicy axis와 DSL SizePolicy axis 매칭."""
    if figma_size_axis is None or dsl_size_axis is None:
        return False
    fmode = figma_size_axis.get("mode")
    dmode = dsl_size_axis.get("mode")
    if fmode != dmode:
        return False
    if fmode == "fixed":
        return figma_size_axis.get("value") == dsl_size_axis.get("value")
    return True


def _figma_layout_kind_axis(figma_layout: dict) -> tuple[str | None, str | None]:
    """Figma raw layout (이미 v2 정규화: kind/axis) → DSL Layout.kind/axis."""
    kind = figma_layout.get("kind")
    axis = figma_layout.get("axis")
    if kind == "stack" and axis in ("horizontal", "vertical"):
        return kind, axis
    return None, None


def _has_token_ref(value: Any) -> bool:
    """Style/Text/Asset/Catalog 등에 TokenRef('token:...' 등)가 있는지 재귀 확인."""
    if isinstance(value, str):
        return value.startswith(("token:", "textStyle:", "hardcoded:", "unresolved:"))
    if isinstance(value, dict):
        return any(_has_token_ref(v) for v in value.values())
    if isinstance(value, list):
        return any(_has_token_ref(v) for v in value)
    return False


def _find_node_by_id(children: list[dict], nid: str) -> dict | None:
    for c in children:
        if c.get("id") == nid:
            return c
        nested = _find_node_by_id(c.get("children") or [], nid)
        if nested is not None:
            return nested
    return None


def _catalog_has_visible_text(catalog: dict, children: list[dict]) -> bool:
    """v2: catalog.props 문자열, slots.{text|ref → 자식 text.value}로 본문 존재 여부."""
    for v in (catalog.get("props") or {}).values():
        if isinstance(v, str) and v.strip():
            return True
    for slot_val in (catalog.get("slots") or {}).values():
        if isinstance(slot_val, dict):
            if isinstance(slot_val.get("text"), str) and slot_val["text"].strip():
                return True
            ref = slot_val.get("ref")
            if isinstance(ref, str):
                ch = _find_node_by_id(children, ref)
                if ch and (ch.get("text") or {}).get("value"):
                    return True
        elif isinstance(slot_val, str):
            ch = _find_node_by_id(children, slot_val)
            if ch and (ch.get("text") or {}).get("value"):
                return True
    return False


def score_dsl(figma_raw: dict, dsl: dict) -> dict[str, Any]:
    issues: list[dict] = []
    deductions = 0

    figma_components = _figma_response_instances(figma_raw)
    dsl_flat = _collect_dsl_nodes(dsl.get("nodes", []))

    total = len(figma_components)
    dsl_count = len(dsl_flat)

    # 1. 컴포넌트 커버리지 — DSL 노드 중 catalog 매핑된 것 vs Figma INSTANCE 수
    if total == 0:
        issues.append({"level": "warning", "component": "*", "message": "Figma INSTANCE 컴포넌트가 없음"})
    else:
        mapped = sum(1 for n in dsl_flat if _has_catalog(n))
        coverage = mapped / total
        if coverage < 0.5:
            deductions += 30
            issues.append({"level": "error", "component": "*", "message": f"DS 매핑 커버리지 낮음: {coverage:.0%} ({mapped}/{total})"})
        elif coverage < 0.8:
            deductions += 15
            issues.append({"level": "warning", "component": "*", "message": f"DS 매핑 불완전: {coverage:.0%} ({mapped}/{total})"})

    # 2. 레이아웃 완성도 — Figma layout(horizontal/vertical) → DSL layout.kind/axis 매칭
    for fc in figma_components:
        flayout = fc.get("layout") or {}
        expected_kind, expected_axis = _figma_layout_kind_axis(flayout)
        if expected_kind is None or expected_kind == "absolute":
            continue
        name = fc.get("name", "")
        m = _match_dsl(name, dsl_flat)
        if not m:
            continue
        dlayout = m.get("layout") or {}
        if dlayout.get("kind") != expected_kind or dlayout.get("axis") != expected_axis:
            deductions += 10
            issues.append({
                "level": "error",
                "component": name,
                "message": (
                    f"layout 불일치 (Figma kind/axis={flayout.get('kind')}/{flayout.get('axis')} "
                    f"→ 기대 kind={expected_kind}, axis={expected_axis})"
                ),
            })

    # 3. 크기 완성도 — Figma layout.size {width, height} → DSL layout.size 매칭
    for fc in figma_components:
        name = fc.get("name", "")
        m = _match_dsl(name, dsl_flat)
        if not m:
            continue
        figma_size = (fc.get("layout") or {}).get("size") or {}
        dsl_size = (m.get("layout") or {}).get("size") or {}
        for axis_key in ("width", "height"):
            fax = figma_size.get(axis_key)
            if fax is None:
                continue
            if not _figma_size_axis_match(fax, dsl_size.get(axis_key)):
                deductions += 5
                issues.append({"level": "warning", "component": name, "message": f"{axis_key} SizePolicy 불일치 (Figma: {fax})"})

    # 4. 토큰 참조 완성도 — Figma boundVariables → DSL style/text 안에 TokenRef
    for fc in figma_components:
        if not fc.get("boundVariables"):
            continue
        name = fc.get("name", "")
        m = _match_dsl(name, dsl_flat)
        if not m:
            continue
        if not (
            _has_token_ref(m.get("style"))
            or _has_token_ref(m.get("text"))
            or _has_token_ref(m.get("asset"))
            or _has_token_ref(m.get("catalog"))
        ):
            deductions += 10
            issues.append({"level": "error", "component": name, "message": "TokenRef 누락 (Figma boundVariables 존재)"})

    # 5. 텍스트 완성도 — Figma text → DSL text.value (또는 catalog.slots.label.text)
    for fc in figma_components:
        if "text" not in fc:
            continue
        name = fc.get("name", "")
        m = _match_dsl(name, dsl_flat)
        if not m:
            continue
        text_node = m.get("text") or {}
        catalog = m.get("catalog") or {}
        children = m.get("children") or []
        has_text = bool(text_node.get("value")) or _catalog_has_visible_text(catalog, children)
        if not has_text:
            deductions += 5
            issues.append({
                "level": "warning",
                "component": name,
                "message": "text.value 또는 catalog.props/slots(텍스트·ref 자식)에 문자열 없음",
            })

    # 6. fill 완성도 — Figma style.fills → DSL style.fills 또는 catalog
    for fc in figma_components:
        if not (fc.get("style") or {}).get("fills"):
            continue
        name = fc.get("name", "")
        m = _match_dsl(name, dsl_flat)
        if not m:
            continue
        style = m.get("style") or {}
        fills = style.get("fills") or []
        if not fills and not _has_catalog(m):
            deductions += 5
            issues.append({"level": "warning", "component": name, "message": "style.fills 누락 (Figma fill 존재)"})

    score = max(0, 100 - deductions)

    # 플랫폼 노트
    has_sizing = any((n.get("layout") or {}).get("size") for n in dsl_flat)
    has_layout = any((n.get("layout") or {}).get("kind") for n in dsl_flat)
    has_tokens = any(
        _has_token_ref(n.get("style"))
        or _has_token_ref(n.get("text"))
        or _has_token_ref(n.get("asset"))
        or _has_token_ref(n.get("catalog"))
        for n in dsl_flat
    )

    platform_notes = {
        "ios": (
            "SwiftUI frame()/background() 적용 가능 — layout·sizing 완비"
            if has_sizing and has_layout
            else "Layout/SizePolicy 누락 — SwiftUI 사이징 수동 지정 필요"
        ),
        "android": (
            "Compose Row/Column + fillMaxWidth 매핑 가능"
            if has_layout
            else "Layout.kind 누락 — Jetpack Compose layout 수동 지정 필요"
        ),
        "web": (
            "CSS flexbox 완비"
            if has_layout and has_sizing
            else "flexbox 정보 불완전 — CSS 수동 보완 필요"
        ),
    }

    fix_hints: list[str] = [i["message"] + f" [{i['component']}]" for i in issues if i["level"] == "error"]

    return {
        "score": score,
        "pass": score >= 80,
        "issues": issues,
        "platform_notes": platform_notes,
        "fix_hints": fix_hints,
    }


def main() -> None:
    args = sys.argv[1:]
    if len(args) < 2:
        print("Usage: dsl_harness.py <figma_raw.json> <dsl_output.json>", file=sys.stderr)
        sys.exit(2)

    figma_raw = json.loads(Path(args[0]).read_text(encoding="utf-8"))
    dsl = json.loads(Path(args[1]).read_text(encoding="utf-8"))

    result = score_dsl(figma_raw, dsl)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    sys.exit(0 if result["pass"] else 1)


if __name__ == "__main__":
    main()
