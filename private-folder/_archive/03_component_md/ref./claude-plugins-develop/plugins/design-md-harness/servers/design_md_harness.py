#!/usr/bin/env python3
"""
design_md_harness.py — design.md 정적 평가 엔진

Figma raw JSON + token_map.json + design.md 를 받아
11개 boolean gate 체크를 수행하고 JSON 결과를 출력.

사용:
  python3 design_md_harness.py \
    --figma-raw  fixture/figma_raw.json \
    --token-map  fixture/token_map.json \
    --design-md  ComponentName.md \
    --output     .harness/attempt_N/harness_result.json \
    [--handoff   .harness/handoff_N-1.json]
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import unicodedata
from pathlib import Path
from typing import Any

import yaml


# ─── Figma raw 순회 ─────────────────────────────────────────────────────────

def _walk_figma(node: dict) -> list[dict]:
    result = [node]
    for child in node.get("children") or []:
        result.extend(_walk_figma(child))
    return result


def _all_figma_nodes(figma_raw: dict) -> list[dict]:
    acc: list[dict] = []
    for root in figma_raw.get("nodes") or []:
        acc.extend(_walk_figma(root))
    return acc


# ─── design.md 파싱 ──────────────────────────────────────────────────────────

def parse_design_md(path: str) -> tuple[dict, str]:
    """YAML front matter와 markdown body를 분리해 반환."""
    text = Path(path).read_text(encoding="utf-8")
    if not text.startswith("---"):
        return {}, text

    end = text.find("\n---", 3)
    if end == -1:
        return {}, text

    yaml_text = text[3:end].strip()
    body = text[end + 4:].strip()
    try:
        meta = yaml.safe_load(yaml_text) or {}
    except yaml.YAMLError:
        meta = {}
    return meta, body


def _extract_sections(body: str) -> dict[str, str]:
    """## 섹션 헤더 기준으로 body를 분리."""
    sections: dict[str, str] = {}
    current_key: str | None = None
    lines: list[str] = []
    for line in body.splitlines():
        m = re.match(r"^##\s+(.+)$", line)
        if m:
            if current_key is not None:
                sections[current_key.lower().strip()] = "\n".join(lines).strip()
            current_key = m.group(1)
            lines = []
        else:
            lines.append(line)
    if current_key is not None:
        sections[current_key.lower().strip()] = "\n".join(lines).strip()
    return sections


def _normalize_text(s: str) -> str:
    return unicodedata.normalize("NFC", s).strip()


# ─── 개별 체크 ───────────────────────────────────────────────────────────────

def check_text_coverage(figma_raw: dict, meta: dict) -> dict:
    """Figma TEXT 노드 value → design.md children[].text 또는 components 값에 모두 존재해야 함."""
    figma_texts = set()
    for n in _all_figma_nodes(figma_raw):
        if n.get("type") == "TEXT":
            val = (n.get("text") or {}).get("value") or n.get("characters") or ""
            if val:
                figma_texts.add(_normalize_text(val))

    if not figma_texts:
        return _pass("text-coverage", "Figma TEXT 노드 없음 — 스킵")

    # design.md에서 텍스트 수집 (children[].text + components 내 value 필드)
    md_texts: set[str] = set()
    for comp in (meta.get("components") or {}).values():
        _collect_md_texts(comp, md_texts)

    missing = figma_texts - md_texts
    if not missing:
        return _pass("text-coverage", f"TEXT {len(figma_texts)}건 모두 커버됨")

    hints = [f"text-coverage: '{t}' — components 또는 children[].text에 추가 필요" for t in sorted(missing)]
    return _fail("text-coverage", f"텍스트 {len(missing)}건 누락", hints)


def _collect_md_texts(node: Any, out: set[str]) -> None:
    if isinstance(node, dict):
        val = node.get("value") or node.get("text") or ""
        if isinstance(val, str) and val:
            out.add(_normalize_text(val))
        for v in node.values():
            _collect_md_texts(v, out)
    elif isinstance(node, list):
        for item in node:
            _collect_md_texts(item, out)
    elif isinstance(node, str) and node:
        out.add(_normalize_text(node))


def check_color_coverage(figma_raw: dict, meta: dict, token_map: dict) -> dict:
    """Figma 색상 fills → design.md YAML colors에 모두 정의돼야 함."""
    figma_colors: set[str] = set()
    for n in _all_figma_nodes(figma_raw):
        # boundVariables에 color 시멘틱 토큰이 있으면 토큰명으로 등록
        bv = n.get("boundVariables") or {}
        for field_name, binding in bv.items():
            if "color" in field_name.lower() or "fill" in field_name.lower():
                token_name = _resolve_figma_token_name(binding, token_map)
                if token_name:
                    figma_colors.add(token_name)
        # raw fills
        style = n.get("style") or {}
        for fill in style.get("fills") or []:
            if fill.get("type") == "SOLID":
                color = fill.get("color") or {}
                if color:
                    hex_val = _rgb_to_hex(color)
                    if hex_val:
                        figma_colors.add(hex_val)

    if not figma_colors:
        return _pass("color-coverage", "Figma 색상 없음 — 스킵")

    md_colors = set((meta.get("colors") or {}).keys())

    # YAML colors 값에서 실제 hex 수집 ({cds: path} 참조는 token_map으로 해석)
    md_resolved_hexes: set[str] = set()
    cds_vals = token_map.get("cds_values") or {}
    for v in (meta.get("colors") or {}).values():
        if not isinstance(v, str):
            continue
        v = v.strip()
        cds_match = re.match(r"\{cds:\s*([^}]+)\}", v)
        if cds_match:
            cds_path = cds_match.group(1).strip()
            raw = cds_vals.get(cds_path, "")
            if raw:
                md_resolved_hexes.add(raw.lower().strip())
        elif re.match(r"^#[0-9a-fA-F]{3,8}$", v):
            md_resolved_hexes.add(v.lower())

    missing = []
    for color in figma_colors:
        found = (color in md_colors
                 or color.lower() in md_resolved_hexes
                 or any(color.lower() in str(v).lower() for v in (meta.get("colors") or {}).values()))
        if not found:
            missing.append(color)

    if not missing:
        return _pass("color-coverage", f"색상 {len(figma_colors)}건 모두 커버됨")

    hints = [f"color-coverage: '{c}' — YAML colors 섹션에 추가 필요" for c in sorted(missing)]
    return _fail("color-coverage", f"색상 {len(missing)}건 누락", hints)


def check_typography_coverage(figma_raw: dict, meta: dict, token_map: dict) -> dict:
    """Figma 타이포그래피 스타일 → md YAML typography에 모두 정의돼야 함."""
    figma_typos: set[str] = set()
    for n in _all_figma_nodes(figma_raw):
        if n.get("type") == "TEXT":
            style_name = (n.get("style") or {}).get("textStyleId") or (n.get("textStyle") or {}).get("name") or ""
            if style_name:
                figma_typos.add(style_name)
            bv = n.get("boundVariables") or {}
            for field, binding in bv.items():
                if "typography" in field.lower() or "textstyle" in field.lower():
                    token_name = _resolve_figma_token_name(binding, token_map)
                    if token_name:
                        figma_typos.add(token_name)

    if not figma_typos:
        return _pass("typography-coverage", "Figma 타이포그래피 없음 — 스킵")

    md_typos = set((meta.get("typography") or {}).keys())
    md_typo_refs: set[str] = set()
    for v in (meta.get("typography") or {}).values():
        if isinstance(v, dict):
            ref = v.get("fromCds") or ""
            if ref:
                md_typo_refs.add(ref)

    missing = [t for t in figma_typos if t not in md_typos and t not in md_typo_refs
               and not any(t.lower() in str(v).lower() for v in (meta.get("typography") or {}).values())]

    if not missing:
        return _pass("typography-coverage", f"타이포그래피 {len(figma_typos)}건 모두 커버됨")

    hints = [f"typography-coverage: '{t}' — YAML typography 섹션에 추가 필요 (fromCds 필드 포함)" for t in sorted(missing)]
    return _fail("typography-coverage", f"타이포그래피 {len(missing)}건 누락", hints)


def check_component_coverage(figma_raw: dict, meta: dict) -> dict:
    """Figma INSTANCE → md components.<name>에 모두 정의돼야 함."""
    figma_instances: set[str] = set()
    for n in _all_figma_nodes(figma_raw):
        if n.get("type") == "INSTANCE":
            comp_name = (n.get("mainComponent") or {}).get("name") or n.get("name") or ""
            if comp_name:
                figma_instances.add(comp_name)

    if not figma_instances:
        return _pass("component-coverage", "Figma INSTANCE 없음 — 스킵")

    md_comps = set((meta.get("components") or {}).keys())
    # kebab-case 변환 후 비교
    missing = []
    for inst in figma_instances:
        kebab = _to_kebab(inst)
        if kebab not in md_comps and inst not in md_comps:
            missing.append(inst)

    if not missing:
        return _pass("component-coverage", f"컴포넌트 {len(figma_instances)}건 모두 커버됨")

    hints = [f"component-coverage: '{c}' — YAML components.{_to_kebab(c)} 섹션 추가 필요" for c in sorted(missing)]
    return _fail("component-coverage", f"컴포넌트 {len(missing)}건 누락", hints)


def check_layout_coverage(figma_raw: dict, meta: dict) -> dict:
    """Figma auto-layout → md components.<name>.layout에 매칭돼야 함."""
    layout_nodes = []
    for n in _all_figma_nodes(figma_raw):
        layout = n.get("layout") or {}
        if layout.get("kind") == "stack" or layout.get("layoutMode") in ("HORIZONTAL", "VERTICAL"):
            name = n.get("name") or ""
            axis = layout.get("axis") or ("horizontal" if layout.get("layoutMode") == "HORIZONTAL" else "vertical")
            layout_nodes.append({"name": name, "axis": axis})

    if not layout_nodes:
        return _pass("layout-coverage", "Figma auto-layout 노드 없음 — 스킵")

    md_comps = meta.get("components") or {}
    missing = []
    for ln in layout_nodes:
        kebab = _to_kebab(ln["name"])
        comp = md_comps.get(kebab) or md_comps.get(ln["name"])
        if comp is None:
            continue  # component-coverage에서 이미 체크
        md_layout = comp.get("layout") or {}
        if not md_layout.get("kind") or not md_layout.get("axis"):
            missing.append(f"{ln['name']} (axis={ln['axis']})")

    if not missing:
        return _pass("layout-coverage", "auto-layout 모두 커버됨")

    hints = [f"layout-coverage: '{n}' — components.{_to_kebab(n.split(' ')[0])}.layout.kind/axis 추가 필요"
             for n in missing]
    return _fail("layout-coverage", f"layout 미정의 {len(missing)}건", hints)


def check_token_colors(meta: dict, token_map: dict) -> dict:
    """YAML colors 값 중 raw hex만 있고 CDS 매핑 가능한데 토큰 미사용이면 fail."""
    cds_reverse: dict[str, str] = {}
    for figma_name, cds_path in token_map.get("mapped", {}).items():
        raw_val = token_map.get("cds_values", {}).get(cds_path, "")
        if raw_val:
            cds_reverse[raw_val.lower().lstrip("#")] = cds_path

    issues = []
    for key, val in (meta.get("colors") or {}).items():
        if not isinstance(val, str):
            continue
        # raw hex 값만 있고 cds 참조가 없는 경우
        if re.match(r"^#[0-9a-fA-F]{3,8}$", val.strip()):
            hex_norm = val.strip().lstrip("#").lower()
            if hex_norm in cds_reverse:
                issues.append(
                    f"token-colors: colors.{key}='{val}' — CDS 토큰 '{cds_reverse[hex_norm]}' 사용 가능. "
                    f"{{cds: {cds_reverse[hex_norm]}}} 로 교체 필요"
                )
            else:
                issues.append(
                    f"token-colors: colors.{key}='{val}' — raw hex 직접 사용. "
                    f"{{cds: system.color.xxx}} 형태로 CDS 토큰 참조 필요"
                )

    if not issues:
        return _pass("token-colors", "모든 색상이 토큰 참조 사용")
    return _fail("token-colors", f"raw hex {len(issues)}건 감지", issues)


def check_token_typography(meta: dict) -> dict:
    """YAML typography 항목에 fromCds 필드가 없으면 fail."""
    issues = []
    for key, val in (meta.get("typography") or {}).items():
        if isinstance(val, dict) and not val.get("fromCds"):
            issues.append(
                f"token-typography: typography.{key} — fromCds 필드 없음. "
                f"fromCds: 'typography.xxx.yyy' 형태로 CDS 토큰 경로 추가 필요"
            )

    if not issues:
        return _pass("token-typography", "모든 타이포그래피에 fromCds 필드 있음")
    return _fail("token-typography", f"fromCds 누락 {len(issues)}건", issues)


def check_broken_ref(meta: dict) -> dict:
    """{colors.xxx}, {typography.xxx} 참조가 YAML 내 실제 키와 일치하는지 확인."""
    all_keys = {
        "colors": set((meta.get("colors") or {}).keys()),
        "typography": set((meta.get("typography") or {}).keys()),
        "rounded": set((meta.get("rounded") or {}).keys()),
        "spacing": set((meta.get("spacing") or {}).keys()),
    }
    issues = []
    _check_refs_in(meta, all_keys, "", issues)

    if not issues:
        return _pass("broken-ref", "모든 참조 유효")
    return _fail("broken-ref", f"깨진 참조 {len(issues)}건", issues)


def _check_refs_in(node: Any, all_keys: dict, path: str, issues: list) -> None:
    if isinstance(node, dict):
        for k, v in node.items():
            _check_refs_in(v, all_keys, f"{path}.{k}" if path else k, issues)
    elif isinstance(node, list):
        for i, item in enumerate(node):
            _check_refs_in(item, all_keys, f"{path}[{i}]", issues)
    elif isinstance(node, str):
        # {colors.xxx}, {typography.xxx} 패턴 검출
        for m in re.finditer(r"\{(\w+)\.(\S+?)\}", node):
            namespace, key = m.group(1), m.group(2)
            if namespace in all_keys and key not in all_keys[namespace]:
                issues.append(
                    f"broken-ref: '{path}' 의 참조 {{{namespace}.{key}}} — "
                    f"'{key}'가 {namespace} 섹션에 없음"
                )


def check_missing_sections(body: str) -> dict:
    """필수 섹션 존재 여부 확인."""
    required = ["overview", "colors", "typography", "layout", "components"]
    sections = _extract_sections(body)
    missing = [s for s in required if s not in sections]

    if not missing:
        return _pass("missing-sections", "필수 섹션 모두 존재")
    hints = [f"missing-sections: '## {s.capitalize()}' 섹션 추가 필요" for s in missing]
    return _fail("missing-sections", f"필수 섹션 {len(missing)}개 누락: {missing}", hints)


def check_section_order(body: str) -> dict:
    """google-labs design.md 섹션 순서 준수 여부 확인."""
    expected_order = ["overview", "colors", "typography", "layout",
                      "elevation & depth", "shapes", "components", "do's and don'ts"]
    present = []
    for line in body.splitlines():
        m = re.match(r"^##\s+(.+)$", line)
        if m:
            present.append(m.group(1).lower().strip())

    issues = []
    last_idx = -1
    for section in present:
        # 가장 유사한 expected 항목 찾기
        idx = next((i for i, e in enumerate(expected_order) if e in section or section in e), -1)
        if idx == -1:
            continue
        if idx < last_idx:
            issues.append(
                f"section-order: '## {section}' 섹션이 잘못된 위치. "
                f"'{expected_order[idx]}'는 '{expected_order[last_idx]}' 앞에 와야 함"
            )
        else:
            last_idx = idx

    if not issues:
        return _pass("section-order", "섹션 순서 정상")
    return _fail("section-order", f"순서 위반 {len(issues)}건", issues)


def check_unmapped_figma_token(token_map: dict) -> dict:
    """Figma 시멘틱 토큰 중 CDS 매핑 실패한 항목 경고 (warning only, gate 아님)."""
    unmapped = token_map.get("unmapped") or []
    if not unmapped:
        return _pass("unmapped-figma-token", "모든 Figma 시멘틱 토큰 CDS 매핑 완료")
    # warning level — pass이지만 메시지에 표시
    return {
        "id": "unmapped-figma-token",
        "pass": True,
        "level": "warning",
        "message": f"CDS 매핑 미완료 토큰 {len(unmapped)}건 (warning)",
        "fix_hints": [
            f"unmapped-figma-token: '{t}' — token_map.json에 CDS 매핑 추가 권장"
            for t in unmapped
        ],
    }


# ─── 회귀 검사 ───────────────────────────────────────────────────────────────

def check_regression(checks: list[dict], handoff: dict) -> tuple[bool, list[str], dict]:
    """verified_pass 항목이 현재 루프에서 깨졌는지 확인.
    Returns (has_regression, regression_items, updated_streak)."""
    verified = set(handoff.get("verified_pass") or [])
    prev_streak: dict[str, int] = handoff.get("regression_streak") or {}
    current_pass = {c["id"] for c in checks if c.get("pass")}
    regressed = [item for item in verified if item not in current_pass]

    updated_streak = dict(prev_streak)
    for item in regressed:
        updated_streak[item] = updated_streak.get(item, 0) + 1

    # 연속 2회 회귀한 항목이 있으면 즉시 종료 신호
    critical = [item for item, count in updated_streak.items() if count >= 2 and item in regressed]
    return bool(regressed), regressed, updated_streak, critical


# ─── 유틸 ─────────────────────────────────────────────────────────────────────

def _pass(check_id: str, message: str) -> dict:
    return {"id": check_id, "pass": True, "level": "pass", "message": message, "fix_hints": []}


def _fail(check_id: str, message: str, hints: list[str]) -> dict:
    return {"id": check_id, "pass": False, "level": "error", "message": message, "fix_hints": hints}


def _rgb_to_hex(color: dict) -> str:
    try:
        r = round((color.get("r") or 0) * 255)
        g = round((color.get("g") or 0) * 255)
        b = round((color.get("b") or 0) * 255)
        return f"#{r:02x}{g:02x}{b:02x}"
    except Exception:
        return ""


def _to_kebab(name: str) -> str:
    return re.sub(r"[\s_/]+", "-", name.lower().strip())


def _resolve_figma_token_name(binding: Any, token_map: dict) -> str:
    if not isinstance(binding, dict):
        return ""
    # VariableID 기반 (Figma REST API 경유 figma_raw.json)
    var_id = binding.get("id") or ""
    if var_id:
        mapped = token_map.get("figma_var_id_to_cds") or {}
        result = mapped.get(var_id, "")
        if result:
            return result
    # VAR_NAME 기반 (Figma MCP 경유 figma_raw.json — figma_mcp_adapter 출력)
    if binding.get("type") == "VAR_NAME":
        var_name = binding.get("name") or ""
        if var_name:
            return var_name.replace("/", ".")
    return ""


# ─── 메인 ────────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(description="design.md 정적 평가 엔진")
    parser.add_argument("--figma-raw", required=True, help="fixture/figma_raw.json 경로")
    parser.add_argument("--token-map", required=True, help="fixture/token_map.json 경로")
    parser.add_argument("--design-md", required=True, help="design.md 경로")
    parser.add_argument("--output", required=True, help="harness_result.json 출력 경로")
    parser.add_argument("--handoff", default=None, help="이전 루프 handoff.json 경로 (회귀 검사용)")
    args = parser.parse_args()

    try:
        figma_raw = json.loads(Path(args.figma_raw).read_text(encoding="utf-8"))
    except Exception as e:
        _exit_error(args.output, f"figma_raw 로드 실패: {e}")
        return

    try:
        token_map = json.loads(Path(args.token_map).read_text(encoding="utf-8"))
    except Exception as e:
        token_map = {"mapped": {}, "unmapped": [], "figma_var_id_to_cds": {}, "cds_values": {}}
        print(f"[harness] token_map 로드 실패: {e} — 빈 맵 사용", file=sys.stderr)

    try:
        meta, body = parse_design_md(args.design_md)
    except Exception as e:
        _exit_error(args.output, f"design.md 파싱 실패: {e}")
        return

    handoff: dict = {}
    if args.handoff and Path(args.handoff).exists():
        try:
            handoff = json.loads(Path(args.handoff).read_text(encoding="utf-8"))
        except Exception:
            pass

    # ── 체크 실행 ─────────────────────────────────────────────────────────────
    checks = [
        check_text_coverage(figma_raw, meta),
        check_color_coverage(figma_raw, meta, token_map),
        check_typography_coverage(figma_raw, meta, token_map),
        check_component_coverage(figma_raw, meta),
        check_layout_coverage(figma_raw, meta),
        check_token_colors(meta, token_map),
        check_token_typography(meta),
        check_broken_ref(meta),
        check_missing_sections(body),
        check_section_order(body),
        check_unmapped_figma_token(token_map),
    ]

    # ── 회귀 검사 ─────────────────────────────────────────────────────────────
    regression_this_loop: list[str] = []
    updated_streak: dict = {}
    critical_regression: list[str] = []
    if handoff:
        _, regression_this_loop, updated_streak, critical_regression = check_regression(checks, handoff)
        # 회귀 항목 fix_hints에 [REGRESSION] 태그 삽입
        for c in checks:
            if c["id"] in regression_this_loop:
                c["fix_hints"] = [f"[REGRESSION] {h}" for h in c["fix_hints"]] + [
                    f"[REGRESSION] '{c['id']}'는 이전 루프에서 통과했으나 다시 실패. 회귀 금지"
                ]

    # ── 통과 판정 ─────────────────────────────────────────────────────────────
    # unmapped-figma-token은 warning이므로 gate에서 제외
    gate_checks = [c for c in checks if c["id"] != "unmapped-figma-token"]
    all_pass = all(c["pass"] for c in gate_checks)
    all_fix_hints = [h for c in checks for h in (c.get("fix_hints") or [])]

    result = {
        "all_pass": all_pass,
        "checks": checks,
        "fix_hints": all_fix_hints,
        "regression_detected_this_loop": regression_this_loop,
        "regression_streak": updated_streak,
        "critical_regression": critical_regression,
        "terminate_for_regression": bool(critical_regression),
        "summary": {
            "total": len(gate_checks),
            "passed": sum(1 for c in gate_checks if c["pass"]),
            "failed": sum(1 for c in gate_checks if not c["pass"]),
        },
    }

    Path(args.output).parent.mkdir(parents=True, exist_ok=True)
    Path(args.output).write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(result, ensure_ascii=False, indent=2))
    sys.exit(0 if all_pass else 1)


def _exit_error(output: str, msg: str) -> None:
    result = {"all_pass": False, "error": msg, "checks": [], "fix_hints": [msg]}
    Path(output).parent.mkdir(parents=True, exist_ok=True)
    Path(output).write_text(json.dumps(result, ensure_ascii=False, indent=2))
    print(json.dumps(result, ensure_ascii=False, indent=2), file=sys.stderr)
    sys.exit(1)


if __name__ == "__main__":
    main()
