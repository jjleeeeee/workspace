#!/usr/bin/env python3
"""
design_md_harness.py — design.md 정적 평가 엔진

Figma raw JSON + design.md 를 받아
정적 gate 체크를 수행하고 JSON 결과를 출력.

공통 로직(노드 순회·토큰 해석·fix_hints 포맷·회귀 검사)은
harness/lib/ 에서 import한다.

사용:
  python3 servers/design_md_harness.py \
    --figma-raw  fixture/figma_raw.json \
    --design-md  _workspace/drafts/attempt_N/ComponentName.md \
    --output     _workspace/reviews/attempt_N/harness_result.json \
    [--token-map fixture/token_map.json] \
    [--fixture-meta fixture/fixture.meta.json] \
    [--token-snapshot fixture/token_snapshot.json] \
    [--comp-keys-snapshot fixture/component_keys_snapshot.json] \
    [--handoff   _workspace/reviews/handoff_N-1.json]
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
import unicodedata
from pathlib import Path
from typing import Any

import yaml

# harness.lib 공통 모듈 import (SSOT)
sys.path.insert(0, str(Path(__file__).parent.parent))
from harness.lib import component_keys_loader as ckl
from harness.lib import figma_walker as fw
from harness.lib import fix_hints as fh
from harness.lib import handoff as ho
from harness.lib import token_resolver as tr
from harness.lib.fix_hints import fail_result, hint, pass_result, warning_result
from harness.lib.token_resolver import (
    AmbiguousTokenName,
    name_to_ids,
    token_id_exists,
    token_id_has_mode_value,
)


ROOT_DIR = Path(__file__).parent.parent
REQUIRED_SECTIONS_V2 = [
    ("overview", "Overview"),
    ("source reads", "Source Reads"),
    ("figma identity", "Figma Identity"),
    ("variant axes", "Variant Axes"),
    ("figma props", "Figma Props"),
    ("layout", "Layout"),
    ("asset notes", "Asset Notes"),
    ("text behavior notes", "Text Behavior Notes"),
    ("implementation order", "Implementation Order"),
    ("do's and don'ts", "Do's and Don'ts"),
    ("known gaps", "Known Gaps"),
]


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


def _section_key(value: str) -> str:
    normalized = value.replace("’", "'").replace("‘", "'")
    return re.sub(r"\s+", " ", normalized).lower().strip()


def _extract_sections(body: str) -> dict[str, str]:
    sections: dict[str, str] = {}
    current_key: str | None = None
    lines: list[str] = []
    for line in body.splitlines():
        m = re.match(r"^##\s+(.+)$", line)
        if m:
            if current_key is not None:
                sections[_section_key(current_key)] = "\n".join(lines).strip()
            current_key = m.group(1)
            lines = []
        else:
            lines.append(line)
    if current_key is not None:
        sections[_section_key(current_key)] = "\n".join(lines).strip()
    return sections


def _normalize_text(s: str) -> str:
    return unicodedata.normalize("NFC", s).strip()


def _load_json(path: str | None) -> tuple[Any | None, str | None]:
    if path is None:
        return None, "path 없음"
    json_path = Path(path)
    if not json_path.exists():
        return None, f"파일 없음: {json_path}"
    try:
        return json.loads(json_path.read_text(encoding="utf-8")), None
    except Exception as e:
        return None, f"JSON 로드 실패: {e}"


def _component_name(meta: dict) -> str:
    return str(((meta.get("component") or {}).get("name") or "")).strip()


def _token_refs(meta: dict) -> list[tuple[str, str, Any]]:
    refs: list[tuple[str, str, Any]] = []
    tokens = meta.get("tokens") or {}
    if not isinstance(tokens, dict):
        return refs
    for token_key, entry in tokens.items():
        if not isinstance(entry, dict):
            continue
        for field in ("default", "fixed"):
            if field in entry:
                refs.append((str(token_key), field, entry.get(field)))
    return refs


def _parse_token_ref(value: Any) -> tuple[str, str] | None:
    if isinstance(value, str):
        raw = value.strip()
        if raw.startswith("token:"):
            return ("id", raw)
        m = re.match(r"^\{cds:\s*([^}]+)\}$", raw)
        if m:
            return ("cds_name", m.group(1).strip())
        return None

    if isinstance(value, dict):
        if "token" in value:
            raw = str(value.get("token") or "").strip()
            if raw.startswith("token:"):
                return ("id", raw)
        if "id" in value:
            raw = str(value.get("id") or "").strip()
            if raw.startswith("token:"):
                return ("id", raw)
        if "cds" in value:
            raw = str(value.get("cds") or "").strip()
            if raw:
                return ("cds_name", raw)
    return None


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


# ─── 개별 체크 ───────────────────────────────────────────────────────────────

def check_text_coverage(figma_raw: dict, meta: dict) -> dict:
    figma_texts: set[str] = set()
    for n in fw.all_nodes(figma_raw):
        if n.get("type") == "TEXT":
            val = (n.get("text") or {}).get("value") or n.get("characters") or ""
            if val:
                figma_texts.add(_normalize_text(val))

    if not figma_texts:
        return fh.pass_result("text-coverage", "Figma TEXT 노드 없음 — 스킵")

    md_texts: set[str] = set()
    for comp in (meta.get("components") or {}).values():
        _collect_md_texts(comp, md_texts)

    missing = figma_texts - md_texts
    if not missing:
        return fh.pass_result("text-coverage", f"TEXT {len(figma_texts)}건 모두 커버됨")

    hints = [fh.hint("text-coverage", f"'{t}' — components 또는 children[].text에 추가 필요")
             for t in sorted(missing)]
    return fh.fail_result("text-coverage", f"텍스트 {len(missing)}건 누락", hints)


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
    figma_colors: set[str] = set()
    for n in fw.all_nodes(figma_raw):
        bv = n.get("boundVariables") or {}
        for field_name, binding in bv.items():
            if "color" in field_name.lower() or "fill" in field_name.lower():
                token_name = fw.resolve_token_name(binding, token_map)
                if token_name:
                    figma_colors.add(token_name)
        style = n.get("style") or {}
        for fill in style.get("fills") or []:
            if fill.get("type") == "SOLID":
                color = fill.get("color") or {}
                if color:
                    hex_val = fw.rgb_to_hex(color)
                    if hex_val:
                        figma_colors.add(hex_val)

    if not figma_colors:
        return fh.pass_result("color-coverage", "Figma 색상 없음 — 스킵")

    md_colors = set((meta.get("colors") or {}).keys())
    md_resolved_hexes: set[str] = set()
    cds_vals = token_map.get("cds_values") or {}
    for v in (meta.get("colors") or {}).values():
        if not isinstance(v, str):
            continue
        resolved = tr.resolve_color(v, meta, token_map)
        if resolved and resolved != "#cccccc":
            md_resolved_hexes.add(resolved.lower().strip())

    missing = []
    for color in figma_colors:
        found = (color in md_colors
                 or color.lower() in md_resolved_hexes
                 or any(color.lower() in str(v).lower() for v in (meta.get("colors") or {}).values()))
        if not found:
            missing.append(color)

    if not missing:
        return fh.pass_result("color-coverage", f"색상 {len(figma_colors)}건 모두 커버됨")

    hints = [fh.hint("color-coverage", f"'{c}' — YAML colors 섹션에 추가 필요")
             for c in sorted(missing)]
    return fh.fail_result("color-coverage", f"색상 {len(missing)}건 누락", hints)


def check_typography_coverage(figma_raw: dict, meta: dict, token_map: dict) -> dict:
    figma_typos: set[str] = set()
    for n in fw.all_nodes(figma_raw):
        if n.get("type") == "TEXT":
            style_name = (n.get("style") or {}).get("textStyleId") or \
                         (n.get("textStyle") or {}).get("name") or ""
            if style_name:
                figma_typos.add(style_name)
            bv = n.get("boundVariables") or {}
            for field, binding in bv.items():
                if "typography" in field.lower() or "textstyle" in field.lower():
                    token_name = fw.resolve_token_name(binding, token_map)
                    if token_name:
                        figma_typos.add(token_name)

    if not figma_typos:
        return fh.pass_result("typography-coverage", "Figma 타이포그래피 없음 — 스킵")

    md_typos = set((meta.get("typography") or {}).keys())
    md_typo_refs: set[str] = set()
    for v in (meta.get("typography") or {}).values():
        if isinstance(v, dict):
            ref = v.get("fromCds") or ""
            if ref:
                md_typo_refs.add(ref)

    missing = [t for t in figma_typos
               if t not in md_typos and t not in md_typo_refs
               and not any(t.lower() in str(v).lower() for v in (meta.get("typography") or {}).values())]

    if not missing:
        return fh.pass_result("typography-coverage", f"타이포그래피 {len(figma_typos)}건 모두 커버됨")

    hints = [fh.hint("typography-coverage", f"'{t}' — YAML typography 섹션에 추가 필요 (fromCds 필드 포함)")
             for t in sorted(missing)]
    return fh.fail_result("typography-coverage", f"타이포그래피 {len(missing)}건 누락", hints)


def check_component_coverage(figma_raw: dict, meta: dict) -> dict:
    figma_instances: set[str] = set()
    for n in fw.all_nodes(figma_raw):
        if n.get("type") == "INSTANCE":
            comp_name = (n.get("mainComponent") or {}).get("name") or n.get("name") or ""
            if comp_name:
                figma_instances.add(comp_name)

    if not figma_instances:
        return fh.pass_result("component-coverage", "Figma INSTANCE 없음 — 스킵")

    md_comps = set((meta.get("components") or {}).keys())
    missing = []
    for inst in figma_instances:
        kebab = fw.to_kebab(inst)
        if kebab not in md_comps and inst not in md_comps:
            missing.append(inst)

    if not missing:
        return fh.pass_result("component-coverage", f"컴포넌트 {len(figma_instances)}건 모두 커버됨")

    hints = [fh.hint("component-coverage", f"'{c}' — YAML components.{fw.to_kebab(c)} 섹션 추가 필요")
             for c in sorted(missing)]
    return fh.fail_result("component-coverage", f"컴포넌트 {len(missing)}건 누락", hints)


def check_layout_coverage(figma_raw: dict, meta: dict) -> dict:
    layout_nodes = []
    for n in fw.all_nodes(figma_raw):
        if fw.is_layout_node(n):
            axis = fw.extract_layout_axis(n) or "horizontal"
            layout_nodes.append({"name": n.get("name") or "", "axis": axis})

    if not layout_nodes:
        return fh.pass_result("layout-coverage", "Figma auto-layout 노드 없음 — 스킵")

    md_comps = meta.get("components") or {}
    missing = []
    for ln in layout_nodes:
        kebab = fw.to_kebab(ln["name"])
        comp = md_comps.get(kebab) or md_comps.get(ln["name"])
        if comp is None:
            continue
        md_layout = comp.get("layout") or {}
        if not md_layout.get("kind") or not md_layout.get("axis"):
            missing.append(f"{ln['name']} (axis={ln['axis']})")

    if not missing:
        return fh.pass_result("layout-coverage", "auto-layout 모두 커버됨")

    hints = [fh.hint("layout-coverage",
                     f"'{n}' — components.{fw.to_kebab(n.split(' ')[0])}.layout.kind/axis 추가 필요")
             for n in missing]
    return fh.fail_result("layout-coverage", f"layout 미정의 {len(missing)}건", hints)


def check_token_colors(meta: dict, token_map: dict) -> dict:
    cds_reverse: dict[str, str] = {}
    for figma_name, cds_path in token_map.get("mapped", {}).items():
        raw_val = token_map.get("cds_values", {}).get(cds_path, "")
        if raw_val:
            cds_reverse[raw_val.lower().lstrip("#")] = cds_path

    issues = []
    for key, val in (meta.get("colors") or {}).items():
        if not isinstance(val, str):
            continue
        if re.match(r"^#[0-9a-fA-F]{3,8}$", val.strip()):
            hex_norm = val.strip().lstrip("#").lower()
            if hex_norm in cds_reverse:
                issues.append(fh.hint(
                    "token-colors",
                    f"colors.{key}='{val}' — CDS 토큰 '{cds_reverse[hex_norm]}' 사용 가능. "
                    f"{{cds: {cds_reverse[hex_norm]}}} 로 교체 필요"
                ))
            else:
                issues.append(fh.hint(
                    "token-colors",
                    f"colors.{key}='{val}' — raw hex 직접 사용. {{cds: system.color.xxx}} 형태로 교체 필요"
                ))

    if not issues:
        return fh.pass_result("token-colors", "모든 색상이 토큰 참조 사용")
    return fh.fail_result("token-colors", f"raw hex {len(issues)}건 감지", issues)


def check_token_typography(meta: dict) -> dict:
    issues = []
    for key, val in (meta.get("typography") or {}).items():
        if isinstance(val, dict) and not val.get("fromCds"):
            issues.append(fh.hint(
                "token-typography",
                f"typography.{key} — fromCds 필드 없음. fromCds: 'typography.xxx.yyy' 형태로 추가 필요"
            ))

    if not issues:
        return fh.pass_result("token-typography", "모든 타이포그래피에 fromCds 필드 있음")
    return fh.fail_result("token-typography", f"fromCds 누락 {len(issues)}건", issues)


def check_broken_ref(meta: dict) -> dict:
    all_keys = {
        "colors": set((meta.get("colors") or {}).keys()),
        "typography": set((meta.get("typography") or {}).keys()),
        "rounded": set((meta.get("rounded") or {}).keys()),
        "spacing": set((meta.get("spacing") or {}).keys()),
    }
    issues = []
    for yaml_path, namespace, key in tr.all_references_in(meta):
        if namespace in all_keys and key not in all_keys[namespace]:
            issues.append(fh.hint(
                "broken-ref",
                f"'{yaml_path}' 의 참조 {{{namespace}.{key}}} — '{key}'가 {namespace} 섹션에 없음"
            ))

    if not issues:
        return fh.pass_result("broken-ref", "모든 참조 유효")
    return fh.fail_result("broken-ref", f"깨진 참조 {len(issues)}건", issues)


def check_variants_registry_matches_sot(meta: dict) -> dict:
    check_id = "variants-registry-matches-source-of-truth"
    comp_name = _component_name(meta)
    if not comp_name:
        return fail_result(check_id, "component.name 누락", [
            hint(check_id, "component.name에 variant-keys/<comp>.md와 일치하는 kebab-name 작성 필요")
        ])

    try:
        sot_variants = ckl.load_variant_keys(comp_name)
    except Exception as e:
        return fail_result(check_id, "variant keys SoT 로드 실패", [
            hint(check_id, f"src/figma-component-keys/variant-keys/{comp_name}.md 확인 필요: {e}")
        ])

    if not sot_variants:
        return warning_result(check_id, "SoT variant list 없음 — 스킵", [
            hint(check_id, f"src/figma-component-keys/variant-keys/{comp_name}.md 등록 또는 fixture 대상 확인 필요")
        ])

    registry_raw = ((meta.get("variants") or {}).get("registry") or [])
    if not isinstance(registry_raw, list):
        return fail_result(check_id, "variants.registry 형식 오류", [
            hint(check_id, "variants.registry는 [{ variant, node_id, key }] 리스트여야 함")
        ])

    issues: list[str] = []
    registry_pairs_list: list[tuple[str, str]] = []
    for idx, entry in enumerate(registry_raw):
        if not isinstance(entry, dict):
            issues.append(hint(check_id, f"variants.registry[{idx}] — 객체 형식으로 작성 필요"))
            continue
        node_id = str(entry.get("node_id") or "").strip()
        key = str(entry.get("key") or "").strip()
        if not node_id or not key:
            issues.append(hint(
                check_id,
                f"variants.registry[{idx}] — node_id/key 누락 또는 오타. "
                "{ variant, node_id, key } 형식으로 재작성 필요"
            ))
            continue
        registry_pairs_list.append((node_id, key))

    sot_pairs = {
        (str(item.get("node_id") or "").strip(), str(item.get("key") or "").strip())
        for item in sot_variants
        if item.get("node_id") and item.get("key")
    }
    registry_pairs = set(registry_pairs_list)

    duplicate_pairs = sorted({
        pair for pair in registry_pairs_list
        if registry_pairs_list.count(pair) > 1
    })
    for node_id, key in duplicate_pairs:
        issues.append(hint(check_id, f"중복 registry 항목: node_id='{node_id}', key='{key}' — 1개만 남기기"))

    missing = sorted(sot_pairs - registry_pairs)
    extra = sorted(registry_pairs - sot_pairs)
    sot_by_node = {node_id: key for node_id, key in sot_pairs}
    sot_by_key = {key: node_id for node_id, key in sot_pairs}

    for node_id, key in missing:
        issues.append(hint(check_id, f"SoT 누락: node_id='{node_id}', key='{key}' — variants.registry에 추가 필요"))

    for node_id, key in extra:
        if node_id in sot_by_node:
            issues.append(hint(
                check_id,
                f"key 오타 의심: node_id='{node_id}'의 key가 '{key}'로 작성됨. "
                f"SoT key='{sot_by_node[node_id]}'로 수정 필요"
            ))
        elif key in sot_by_key:
            issues.append(hint(
                check_id,
                f"node_id 오타 의심: key='{key}'의 node_id가 '{node_id}'로 작성됨. "
                f"SoT node_id='{sot_by_key[key]}'로 수정 필요"
            ))
        else:
            issues.append(hint(check_id, f"SoT에 없는 extra 항목: node_id='{node_id}', key='{key}' — 삭제 또는 SoT 확인 필요"))

    if not issues:
        return pass_result(check_id, f"variants.registry {len(sot_pairs)}건이 SoT와 일치")
    return fail_result(check_id, f"variants.registry SoT 불일치 {len(issues)}건", issues)


def check_component_identity_matches_index(meta: dict) -> dict:
    check_id = "component-identity-matches-index"
    component = meta.get("component") or {}
    comp_name = _component_name(meta)
    if not comp_name:
        return fail_result(check_id, "component.name 누락", [
            hint(check_id, "component.name에 index.md의 kebab-name 작성 필요")
        ])

    try:
        entry = ckl.get_component_entry(comp_name)
    except Exception as e:
        return fail_result(check_id, "index.md 로드 실패", [
            hint(check_id, f"src/figma-component-keys/index.md 확인 필요: {e}")
        ])

    if entry is None:
        return fail_result(check_id, "컴포넌트 identity SoT 없음", [
            hint(check_id, "index.md에 등록되지 않은 컴포넌트")
        ])

    issues = []
    for field in ("figma_name", "node_id", "component_set_key", "level"):
        actual = str(component.get(field) or "").strip()
        expected = str(entry.get(field) or "").strip()
        if actual != expected:
            issues.append(hint(
                check_id,
                f"component.{field}='{actual}' — index.md 값 '{expected}'와 일치하도록 수정 필요"
            ))

    if not issues:
        return pass_result(check_id, "component identity가 index.md와 일치")
    return fail_result(check_id, f"component identity 불일치 {len(issues)}건", issues)


def check_representative_variant_defined(meta: dict) -> dict:
    check_id = "representative-variant-defined"
    representative = ((meta.get("variants") or {}).get("representative") or {})
    if not isinstance(representative, dict):
        return fail_result(check_id, "variants.representative 형식 오류", [
            hint(check_id, "variants.representative는 variant/node_id를 가진 객체여야 함")
        ])

    missing = [field for field in ("variant", "node_id") if not representative.get(field)]
    if not missing:
        return pass_result(check_id, "대표 variant와 node_id 정의됨")

    return fail_result(check_id, f"representative 필드 누락: {missing}", [
        hint(check_id, f"variants.representative.{field} 작성 필요")
        for field in missing
    ])


def check_fixture_schema_version(fixture_meta_path: str | None) -> dict:
    check_id = "fixture-schema-version"
    fixture_meta, error = _load_json(fixture_meta_path)
    if fixture_meta is None:
        return fail_result(check_id, "fixture.meta.json 없음", [
            hint(check_id, f"fixture.meta.json 없음 — representative fixture 재캡처 필요 ({error})")
        ])
    if not isinstance(fixture_meta, dict):
        return fail_result(check_id, "fixture.meta.json 형식 오류", [
            hint(check_id, "fixture.meta.json은 JSON object여야 함")
        ])

    issues = []
    schema_version = fixture_meta.get("schema_version")
    screenshot = fixture_meta.get("figma_screenshot") or {}
    screenshot_kind = screenshot.get("kind") if isinstance(screenshot, dict) else None

    if schema_version != "v2-representative":
        issues.append(hint(
            check_id,
            f"schema_version='{schema_version}' — 'v2-representative'로 fixture 재캡처 필요"
        ))
    if screenshot_kind != "representative_variant":
        issues.append(hint(
            check_id,
            f"figma_screenshot.kind='{screenshot_kind}' — representative_variant 스크린샷으로 재캡처 필요"
        ))

    if not issues:
        return pass_result(check_id, "fixture.meta.json schema/version 정상")
    return fail_result(check_id, f"fixture schema 불일치 {len(issues)}건", issues)


def check_representative_screenshot_matches_spec(meta: dict, fixture_meta_path: str | None) -> dict:
    check_id = "representative-screenshot-matches-spec"
    fixture_meta, error = _load_json(fixture_meta_path)
    if fixture_meta is None:
        return warning_result(check_id, "fixture.meta.json 없음 — 스킵", [
            hint(check_id, f"fixture.meta.json을 추가하면 representative screenshot node_id를 검증할 수 있음 ({error})")
        ])
    if not isinstance(fixture_meta, dict):
        return fail_result(check_id, "fixture.meta.json 형식 오류", [
            hint(check_id, "fixture.meta.json은 JSON object여야 함")
        ])

    spec_node_id = str((((meta.get("variants") or {}).get("representative") or {}).get("node_id") or "")).strip()
    fixture_node_id = str(((fixture_meta.get("figma_screenshot") or {}).get("node_id") or "")).strip()
    if not spec_node_id:
        return fail_result(check_id, "representative node_id 누락", [
            hint(check_id, "variants.representative.node_id 작성 필요")
        ])
    if spec_node_id == fixture_node_id:
        return pass_result(check_id, "대표 variant node_id와 fixture screenshot node_id 일치")

    return fail_result(check_id, "대표 variant screenshot node_id 불일치", [
        hint(
            check_id,
            f"fixture figma_screenshot.node_id='{fixture_node_id}' — "
            f"variants.representative.node_id='{spec_node_id}'로 fixture 재캡처 필요"
        )
    ])


def check_tokens_id_resolves(meta: dict) -> dict:
    check_id = "tokens-id-resolves"
    issues = []
    for token_key, field, value in _token_refs(meta):
        parsed = _parse_token_ref(value)
        if parsed is None:
            continue
        kind, ref = parsed
        if kind == "id":
            try:
                exists = token_id_exists(ref)
            except Exception as e:
                return fail_result(check_id, "token catalog 로드 실패", [
                    hint(check_id, f"src/tokens/*.json SoT 확인 필요: {e}")
                ])
            if not exists:
                issues.append(hint(check_id, f"tokens.{token_key}.{field}='{ref}' — 존재하지 않는 token id. src/tokens/*.json 확인 필요"))
        elif kind == "cds_name":
            try:
                ids = name_to_ids(ref)
            except AmbiguousTokenName as e:
                issues.append(hint(check_id, f"tokens.{token_key}.{field}='{ref}' — {e}. 직접 id로 재작성 필요"))
                continue
            except Exception as e:
                return fail_result(check_id, "token catalog 로드 실패", [
                    hint(check_id, f"src/tokens/*.json SoT 확인 필요: {e}")
                ])
            if not ids:
                issues.append(hint(check_id, f"tokens.{token_key}.{field}='{{cds: {ref}}}' — name에 매핑되는 token id 없음"))
                continue
            try:
                missing_ids = [token_id for token_id in ids if not token_id_exists(token_id)]
            except Exception as e:
                return fail_result(check_id, "token catalog 로드 실패", [
                    hint(check_id, f"src/tokens/*.json SoT 확인 필요: {e}")
                ])
            for token_id in missing_ids:
                issues.append(hint(check_id, f"tokens.{token_key}.{field}='{{cds: {ref}}}' — 매핑 id '{token_id}'가 SoT에 없음"))

    if not issues:
        return pass_result(check_id, "tokens default/fixed 참조가 SoT token id로 resolve됨")
    return fail_result(check_id, f"resolve 불가 token 참조 {len(issues)}건", issues)


def check_tokens_id_has_mode_value(meta: dict) -> dict:
    check_id = "tokens-id-has-mode-value"
    mode = str((((meta.get("token_catalog") or {}).get("render_mode") or {}).get("color") or "light")).strip()
    issues = []
    for token_key, field, value in _token_refs(meta):
        parsed = _parse_token_ref(value)
        if parsed is None or parsed[0] != "id":
            continue
        token_id = parsed[1]
        try:
            has_mode_value = token_id_has_mode_value(token_id, mode)
        except Exception as e:
            return fail_result(check_id, "token catalog 로드 실패", [
                hint(check_id, f"src/tokens/*.json SoT 확인 필요: {e}")
            ])
        if not has_mode_value:
            issues.append(hint(
                check_id,
                f"tokens.{token_key}.{field}='{token_id}' — values.{mode}.raw 없음. token_catalog.render_mode.color 또는 token SoT 확인 필요"
            ))

    if not issues:
        return pass_result(check_id, f"token id 참조가 mode '{mode}' 값을 가짐")
    return fail_result(check_id, f"mode 값 없는 token id {len(issues)}건", issues)


def check_tokens_name_not_ambiguous(meta: dict) -> dict:
    check_id = "tokens-name-not-ambiguous"
    issues = []
    for token_key, field, value in _token_refs(meta):
        parsed = _parse_token_ref(value)
        if parsed is None or parsed[0] != "cds_name":
            continue
        name = parsed[1]
        try:
            ids = name_to_ids(name)
        except AmbiguousTokenName as e:
            issues.append(hint(check_id, f"tokens.{token_key}.{field}='{{cds: {name}}}' — {e}. 직접 id로 재작성 필요"))
            continue
        except Exception as e:
            return fail_result(check_id, "token catalog 로드 실패", [
                hint(check_id, f"src/tokens/*.json SoT 확인 필요: {e}")
            ])
        if len(ids) > 1:
            issues.append(hint(
                check_id,
                f"tokens.{token_key}.{field}='{{cds: {name}}}' — 복수 id {ids}에 매핑됨. 직접 id로 재작성 필요"
            ))

    if not issues:
        return pass_result(check_id, "legacy {cds: ...} token name 참조가 모호하지 않음")
    return fail_result(check_id, f"ambiguous token name {len(issues)}건", issues)


def check_token_catalog_sha256(fixture_token_snapshot_path: str | None) -> dict:
    check_id = "token-catalog-sha256-matches"
    snapshot, error = _load_json(fixture_token_snapshot_path)
    if snapshot is None:
        return warning_result(check_id, "token_snapshot.json 없음 — 스킵", [
            hint(check_id, f"fixture/token_snapshot.json 추가 시 token SoT 변경 여부를 검증할 수 있음 ({error})")
        ])
    if not isinstance(snapshot, list):
        return fail_result(check_id, "token_snapshot.json 형식 오류", [
            hint(check_id, "token_snapshot.json은 [{ file, sha256 }] 리스트여야 함")
        ])

    issues = []
    for idx, entry in enumerate(snapshot):
        if not isinstance(entry, dict):
            issues.append(hint(check_id, f"token_snapshot[{idx}] — {{ file, sha256 }} 객체로 작성 필요"))
            continue
        file_name = str(entry.get("file") or "").strip()
        expected = str(entry.get("sha256") or "").strip()
        if not file_name or not expected:
            issues.append(hint(check_id, f"token_snapshot[{idx}] — file/sha256 누락"))
            continue
        file_path = Path(file_name)
        if not file_path.exists():
            issues.append(hint(check_id, f"'{file_name}' 파일 없음 — fixture 재캡처 또는 실행 경로 확인 필요"))
            continue
        actual = _sha256(Path(file_name))
        if actual != expected:
            issues.append(hint(check_id, f"'{file_name}' sha256 불일치 — fixture 재캡처 필요"))

    if not issues:
        return pass_result(check_id, f"token catalog snapshot {len(snapshot)}건 일치")
    return fail_result(check_id, f"token catalog sha256 불일치 {len(issues)}건", issues)


def check_component_keys_sha256(fixture_comp_keys_snapshot_path: str | None, comp_name: str) -> dict:
    check_id = "component-keys-sha256-matches"
    snapshot, error = _load_json(fixture_comp_keys_snapshot_path)
    if snapshot is None:
        return warning_result(check_id, "component_keys_snapshot.json 없음 — 스킵", [
            hint(check_id, f"fixture/component_keys_snapshot.json 추가 시 component key SoT 변경 여부를 검증할 수 있음 ({error})")
        ])
    if not isinstance(snapshot, dict):
        return fail_result(check_id, "component_keys_snapshot.json 형식 오류", [
            hint(check_id, "component_keys_snapshot.json은 { index, variant_keys } 객체여야 함")
        ])
    if not comp_name:
        return fail_result(check_id, "component.name 누락", [
            hint(check_id, "component.name에 variant-keys/<comp>.md와 일치하는 kebab-name 작성 필요")
        ])

    targets = {
        "index": ROOT_DIR / "src" / "figma-component-keys" / "index.md",
        "variant_keys": ROOT_DIR / "src" / "figma-component-keys" / "variant-keys" / f"{comp_name}.md",
    }
    issues = []
    for key_name, current_path in targets.items():
        expected = str(((snapshot.get(key_name) or {}).get("sha256") or "")).strip()
        if not expected:
            issues.append(hint(check_id, f"component_keys_snapshot.{key_name}.sha256 누락"))
            continue
        if not current_path.exists():
            issues.append(hint(check_id, f"'{current_path}' 파일 없음 — component key SoT 확인 필요"))
            continue
        actual = _sha256(current_path)
        if actual != expected:
            issues.append(hint(check_id, f"{key_name} sha256 불일치 — fixture 재캡처 필요"))

    if not issues:
        return pass_result(check_id, "component key snapshot이 현재 SoT와 일치")
    return fail_result(check_id, f"component key sha256 불일치 {len(issues)}건", issues)


def check_missing_sections_v2(body: str) -> dict:
    sections = _extract_sections(body)
    missing = [(key, display) for key, display in REQUIRED_SECTIONS_V2 if key not in sections]

    if not missing:
        return pass_result("missing-sections", "v2 필수 섹션 모두 존재")
    hints = [hint("missing-sections", f"'## {display}' 섹션 추가 필요") for _, display in missing]
    return fail_result(
        "missing-sections",
        f"v2 필수 섹션 {len(missing)}개 누락: {[key for key, _ in missing]}",
        hints,
    )


def check_section_order_v2(body: str) -> dict:
    expected_order = [key for key, _ in REQUIRED_SECTIONS_V2]
    display_by_key = {key: display for key, display in REQUIRED_SECTIONS_V2}
    present = []
    for line in body.splitlines():
        m = re.match(r"^##\s+(.+)$", line)
        if m:
            key = _section_key(m.group(1))
            if key in expected_order:
                present.append(key)

    issues = []
    last_idx = -1
    for section in present:
        idx = expected_order.index(section)
        if idx < last_idx:
            issues.append(hint(
                "section-order",
                f"'## {display_by_key[section]}' 섹션 위치 오류. "
                f"정해진 순서: {' → '.join(display_by_key[key] for key in expected_order)}"
            ))
        else:
            last_idx = idx

    if not issues:
        return pass_result("section-order", "v2 섹션 순서 정상")
    return fail_result("section-order", f"v2 섹션 순서 위반 {len(issues)}건", issues)


def check_unmapped_figma_token(token_map: dict) -> dict:
    unmapped = token_map.get("unmapped") or []
    if not unmapped:
        return fh.pass_result("unmapped-figma-token", "모든 Figma 시멘틱 토큰 CDS 매핑 완료")
    return fh.warning_result(
        "unmapped-figma-token",
        f"CDS 매핑 미완료 토큰 {len(unmapped)}건 (warning)",
        [fh.hint("unmapped-figma-token", f"'{t}' — token_map.json에 CDS 매핑 추가 권장")
         for t in unmapped],
    )


# ─── 메인 ────────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(description="design.md 정적 평가 엔진")
    parser.add_argument("--figma-raw", required=True)
    parser.add_argument("--token-map", default=None)
    parser.add_argument("--design-md", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--handoff", default=None)
    parser.add_argument("--fixture-meta", default=None)
    parser.add_argument("--token-snapshot", default=None)
    parser.add_argument("--comp-keys-snapshot", default=None)
    args = parser.parse_args()

    try:
        figma_raw = json.loads(Path(args.figma_raw).read_text(encoding="utf-8"))
    except Exception as e:
        _exit_error(args.output, f"figma_raw 로드 실패: {e}")
        return

    token_map = {"mapped": {}, "unmapped": [], "cds_values": {}}
    if args.token_map:
        try:
            token_map = json.loads(Path(args.token_map).read_text(encoding="utf-8"))
        except Exception as e:
            print(f"[harness] token_map 로드 실패: {e} — 빈 맵 사용", file=sys.stderr)
    else:
        token_map = {"mapped": {}, "unmapped": [], "cds_values": {}}

    try:
        meta, body = parse_design_md(args.design_md)
    except Exception as e:
        _exit_error(args.output, f"design.md 파싱 실패: {e}")
        return

    prev_handoff = ho.load(args.handoff) if args.handoff else ho.empty_handoff()
    comp_name = _component_name(meta)

    checks = [
        check_text_coverage(figma_raw, meta),
        check_color_coverage(figma_raw, meta, token_map),
        check_typography_coverage(figma_raw, meta, token_map),
        check_component_coverage(figma_raw, meta),
        check_layout_coverage(figma_raw, meta),
        check_token_colors(meta, token_map),
        check_token_typography(meta),
        check_broken_ref(meta),
        check_missing_sections_v2(body),
        check_section_order_v2(body),
        check_variants_registry_matches_sot(meta),
        check_component_identity_matches_index(meta),
        check_representative_variant_defined(meta),
        check_fixture_schema_version(args.fixture_meta),
        check_representative_screenshot_matches_spec(meta, args.fixture_meta),
        check_tokens_id_resolves(meta),
        check_tokens_id_has_mode_value(meta),
        check_tokens_name_not_ambiguous(meta),
        check_token_catalog_sha256(args.token_snapshot),
        check_component_keys_sha256(args.comp_keys_snapshot, comp_name),
        check_unmapped_figma_token(token_map),
    ]

    # 회귀 검사 (harness.lib.fix_hints 사용)
    regression_this_loop: list[str] = []
    updated_streak: dict = {}
    critical_regression: list[str] = []
    if prev_handoff.get("verified_pass"):
        regression_this_loop, updated_streak, critical_regression = fh.check_regression(checks, prev_handoff)
        for c in checks:
            if c["id"] in regression_this_loop:
                fh.tag_regression(c)

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
