#!/usr/bin/env python3
"""Migrate legacy component MD files to YAML-contract + Markdown-guidance.

This script is intentionally local and conservative:
- fixture files remain the source lock for variants/tokens/sizes
- legacy Implementation Contract text is mined for props/accessibility/source notes
- Markdown guidance keeps the existing prose and drops the duplicated contract section
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def read_json(path: Path) -> dict:
    if not path.exists():
        return {}
    return json.loads(path.read_text(encoding="utf-8"))


def strip_code_fences(text: str) -> str:
    return re.sub(r"```[\s\S]*?```", "", text)


def split_sections(content: str) -> tuple[str, dict[str, str]]:
    lines = content.splitlines()
    title = lines[0].strip() if lines else "# Component"
    sections: dict[str, list[str]] = {}
    current = None
    for line in lines[1:]:
        match = re.match(r"^##\s+(\d+)\.\s+(.+)$", line)
        if match:
            current = match.group(1)
            sections[current] = [line]
            continue
        if current:
            sections[current].append(line)
    return title, {key: "\n".join(value).strip() for key, value in sections.items()}


def section_body(section: str) -> str:
    return re.sub(r"^##\s+\d+\.\s+.+\n?", "", section).strip()


def parse_props(contract: str) -> list[dict[str, str]]:
    match = re.search(r"###\s+공개 API / Props\s*\n([\s\S]*?)(?=\n###\s+|\Z)", contract)
    if not match:
        return []
    props = []
    for line in match.group(1).splitlines():
        line = line.strip()
        if not line.startswith("|") or "---" in line or line.lower().startswith("| prop"):
            continue
        cells = split_markdown_table_row(line)
        if len(cells) < 4:
            continue
        props.append(
            {
                "name": cells[0],
                "type": cells[1],
                "default": cells[2],
                "description": cells[3],
            }
        )
    return props


def split_markdown_table_row(line: str) -> list[str]:
    """Split a Markdown table row while preserving escaped pipe characters."""
    text = line.strip().strip("|")
    cells: list[str] = []
    current: list[str] = []
    escaped = False
    for char in text:
        if char == "\\" and not escaped:
            escaped = True
            current.append(char)
            continue
        if char == "|" and not escaped:
            cells.append("".join(current).strip().strip("`"))
            current = []
            continue
        current.append(char)
        escaped = False
    cells.append("".join(current).strip().strip("`"))
    return cells


def parse_subsection(contract: str, heading: str) -> str:
    match = re.search(rf"###\s+{re.escape(heading)}\s*\n([\s\S]*?)(?=\n###\s+|\Z)", contract)
    return match.group(1).strip() if match else ""


def parse_do_dont(section: str) -> tuple[list[str], list[str]]:
    body = section_body(section)
    do_part = ""
    dont_part = ""
    if "금지:" in body:
        do_part, dont_part = body.split("금지:", 1)
    else:
        do_part = body
    if "권장:" in do_part:
        do_part = do_part.split("권장:", 1)[1]
    do_items = re.findall(r"^-\s+(.+)$", do_part, flags=re.MULTILINE)
    dont_items = re.findall(r"^-\s+(.+)$", dont_part, flags=re.MULTILINE)
    return do_items, dont_items


def yaml_scalar(value: object) -> str:
    text = "" if value is None else str(value)
    text = text.replace("\\", "\\\\").replace('"', '\\"')
    return f'"{text}"'


def append_block(lines: list[str], indent: int, key: str, value: str) -> None:
    pad = " " * indent
    content_pad = pad + ("    " if key.startswith("- ") else "  ")
    cleaned = strip_code_fences(value).strip()
    lines.append(f"{pad}{key}: |")
    if not cleaned:
        lines.append(content_pad)
        return
    for line in cleaned.splitlines():
        lines.append(f"{content_pad}{line.rstrip()}")


def fixture_source(variants: dict, rest: dict) -> tuple[str, str, str, str]:
    source = variants.get("_source", {})
    rest_source = rest.get("_source", {})
    file_key = source.get("fileKey") or rest.get("fileKey") or ""
    node_id = (
        source.get("componentSetId")
        or variants.get("nodeId")
        or rest_source.get("filter", "").replace("node_id starts with ", "").replace(":", "")
    )
    set_key = source.get("componentSetKey", "")
    set_name = variants.get("componentSetName") or rest.get("componentSetName") or rest.get("containingFrame") or ""
    return file_key, node_id, set_key, set_name


def build_frontmatter(component: str, title: str, sections: dict[str, str], fixture_dir: Path) -> str:
    contract = section_body(sections.get("2", ""))
    variants = read_json(fixture_dir / "variants.json")
    rest = read_json(fixture_dir / "variants_rest.json")
    tokens = read_json(fixture_dir / "tokens.json")
    sizes = read_json(fixture_dir / "sizes.json")
    props = parse_props(contract)
    do_items, dont_items = parse_do_dont(sections.get("8", ""))
    file_key, node_id, set_key, set_name = fixture_source(variants, rest)
    title_text = title.lstrip("# ").strip()
    description = section_body(sections.get("1", "")).splitlines()[0] if sections.get("1") else ""

    lines: list[str] = ["---"]
    lines += [
        "component:",
        f"  name: {yaml_scalar(title_text)}",
        f"  description: {yaml_scalar(description)}",
        '  status: "stable"',
        '  version: "1.0"',
        "source:",
        '  figma_file: "Chord Design System"',
        f"  file_key: {yaml_scalar(file_key)}",
        "  component_set:",
        f"    name: {yaml_scalar(set_name or title_text)}",
        f"    node_id: {yaml_scalar(node_id)}",
        f"    key: {yaml_scalar(set_key)}",
        "  usage_source:",
        '    file_key: ""',
        '    node_id: ""',
        "props:",
    ]
    if props:
        for prop in props:
            name = prop["name"]
            lines += [
                f"  {yaml_scalar(name)}:",
                f"    type: {yaml_scalar(prop['type'])}",
                f"    default: {yaml_scalar(prop['default'])}",
                f"    description: {yaml_scalar(prop['description'])}",
                "    required: false",
            ]
    else:
        lines += ["  _none:", '    type: ""', '    default: ""', '    description: ""', "    required: false"]

    lines += ["variants:", "  axes:"]
    for axis, values in variants.get("axes", {}).items():
        lines.append(f"    {yaml_scalar(axis)}:")
        for value in values:
            lines.append(f"      - {yaml_scalar(value)}")
    lines += [
        "  component_props:",
    ]
    component_props = variants.get("componentProps", {})
    if component_props:
        for prop, meta in component_props.items():
            lines += [
                f"    {yaml_scalar(prop)}:",
                f"      type: {yaml_scalar(meta.get('type', ''))}",
                f"      default: {yaml_scalar(meta.get('defaultValue', ''))}",
            ]
    else:
        lines.append("    _none: {}")
    lines += [
        "  count:",
        f"    figma_console: {variants.get('variantCount', 0)}",
        f"    figma_rest: {rest.get('variantCount', 0)}",
        "  constraints:",
    ]
    constraints = parse_subsection(contract, "Variant 제약")
    if constraints:
        append_block(lines, 4, "- summary", constraints)
    else:
        lines.append('    - "REST values must be a subset of console values."')

    lines += ["states:"]
    state_text = parse_subsection(contract, "상태 매트릭스")
    if state_text:
        append_block(lines, 2, "_summary", state_text)
    else:
        lines += ["  Default:", '    applies_to: "root"', '    behavior: "Default state"']

    lines += ["tokens:"]
    token_names = [key for key in tokens.keys() if not key.startswith("_")]
    if token_names:
        for index, token in enumerate(token_names, 1):
            lines += [
                f"  token_{index}:",
                f"    default: {yaml_scalar(token)}",
                '    fixed: ""',
                '    fallback: ""',
            ]
    else:
        lines += ["  _none:", '    default: ""', '    fixed: ""', '    fallback: ""']

    lines += ["layout:", "  sizes:"]
    if sizes:
        for name, vals in sizes.items():
            lines += [
                f"    - name: {yaml_scalar(name)}",
                f"      image: {yaml_scalar(str(vals['image']) + 'px')}",
                f"      touch: {yaml_scalar(str(vals['touch']) + 'px')}",
            ]
    else:
        lines.append("    []")
    lines += ["  spacing:"]
    append_block(lines, 4, "- summary", parse_subsection(contract, "레이아웃 계약"))
    lines += ["  radius:", '    - role: "shape"', '      token: ""', "  responsive_rules:"]
    responsive = section_body(sections.get("7", ""))
    if responsive:
        append_block(lines, 4, "- summary", responsive)
    else:
        lines.append('    - ""')

    lines += ["accessibility:"]
    append_block(lines, 2, "summary", parse_subsection(contract, "접근성"))
    lines += ["rules:", "  do:"]
    lines += [f"    - {yaml_scalar(item)}" for item in do_items] or ['    - ""']
    lines += ["  dont:"]
    lines += [f"    - {yaml_scalar(item)}" for item in dont_items] or ['    - ""']
    lines += ["notes:"]
    append_block(lines, 2, "source_notes", parse_subsection(contract, "Figma 출처 메모"))
    lines += ["  source_gaps: []", "  deprecated: []", "---"]
    return "\n".join(lines)


def normalize_guidance_section(number: int, title: str, legacy_section: str) -> str:
    body = section_body(legacy_section)
    if number == 7:
        body = body.replace("권장:", "DO:").replace("금지:", "DON'T:")
    return f"## {number}. {title}\n\n{body.strip()}\n"


def migrate(component: str) -> None:
    md_path = ROOT / "components" / f"{component}.md"
    fixture_dir = ROOT / "harness" / "fixtures" / component
    content = md_path.read_text(encoding="utf-8")
    title, sections = split_sections(content)
    frontmatter = build_frontmatter(component, title, sections, fixture_dir)
    quote = ""
    first_role_line = section_body(sections.get("1", "")).splitlines()
    if first_role_line:
        quote = f"\n> {first_role_line[0]}\n"
    body_parts = [
        title,
        quote,
        normalize_guidance_section(1, "역할과 사용", sections.get("1", "")),
        normalize_guidance_section(2, "시각적 성격", sections.get("3", "")),
        normalize_guidance_section(3, "구조", sections.get("4", "")),
        normalize_guidance_section(4, "컴포넌트 스타일링", sections.get("5", "")),
        normalize_guidance_section(5, "상태와 인터랙션", sections.get("6", "")),
        normalize_guidance_section(6, "레이아웃과 반응형 규칙", sections.get("7", "")),
        normalize_guidance_section(7, "권장/금지", sections.get("8", "")),
        normalize_guidance_section(8, "에이전트 프롬프트 가이드", sections.get("9", "")),
    ]
    md_path.write_text(frontmatter + "\n\n" + "\n---\n\n".join(part.strip() for part in body_parts if part.strip()) + "\n", encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("components", nargs="+")
    args = parser.parse_args()
    for component in args.components:
        migrate(component)


if __name__ == "__main__":
    main()
