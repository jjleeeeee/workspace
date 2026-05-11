"""
component_keys_loader.py — Figma 컴포넌트 키 레지스트리 파서

SoT: src/figma-component-keys/index.md + variant-keys/<comp>.md
이 파일들을 수정하지 않는다. 갱신은 외부 Figma readback 파이프라인 책임.
"""
from __future__ import annotations

import re
from pathlib import Path
from typing import Any

_KEYS_DIR = Path(__file__).parent.parent.parent / "src" / "figma-component-keys"
_INDEX_FILE = _KEYS_DIR / "index.md"
_VARIANT_KEYS_DIR = _KEYS_DIR / "variant-keys"

# ─── 내부 파싱 헬퍼 ───────────────────────────────────────────────────────────

def _parse_md_table_rows(text: str) -> list[list[str]]:
    """Markdown 테이블에서 데이터 행(헤더·구분선 제외) 파싱."""
    rows: list[list[str]] = []
    for line in text.splitlines():
        line = line.strip()
        if not line.startswith("|") or not line.endswith("|"):
            continue
        cells = [c.strip() for c in line[1:-1].split("|")]
        # 구분선 행 제외 (예: | --- | --- |)
        if all(re.match(r"^[-:]+$", c) for c in cells if c):
            continue
        if cells:
            rows.append(cells)
    return rows


def _strip_backtick(value: str) -> str:
    """` [V2] Avatar ` → [V2] Avatar"""
    return value.strip().strip("`").strip()


def _component_name_to_kebab(figma_name: str) -> str:
    """[V2] Avatar → avatar, Badge_Number → badge-number"""
    name = re.sub(r"^\[.*?\]\s*", "", figma_name).strip()
    name = re.sub(r"[_\s]+", "-", name.lower())
    name = re.sub(r"[^a-z0-9-]", "", name)
    return name.strip("-")


# ─── 캐시 ────────────────────────────────────────────────────────────────────

_index_cache: dict[str, Any] | None = None
_variant_cache: dict[str, list[dict]] = {}


def _ensure_index_file() -> None:
    if not _INDEX_FILE.exists():
        raise FileNotFoundError(
            f"[component_keys_loader] index.md not found: {_INDEX_FILE}\n"
            "SoT 파일이 git에 tracked 되어 있지 않습니다. Phase 0을 먼저 완료하세요."
        )


# ─── 공개 API ─────────────────────────────────────────────────────────────────

def figma_file_key() -> str:
    """index.md 상단의 Figma file key 반환."""
    _ensure_index_file()
    text = _INDEX_FILE.read_text(encoding="utf-8")
    m = re.search(r"Figma file:\s*`([^`]+)`", text)
    return m.group(1).strip() if m else ""


def index_last_checked() -> str:
    """index.md 상단의 Last checked 날짜 반환 (staleness 경고용)."""
    _ensure_index_file()
    text = _INDEX_FILE.read_text(encoding="utf-8")
    m = re.search(r"Last checked:\s*(.+)", text)
    return m.group(1).strip() if m else ""


def load_index() -> dict[str, dict]:
    """index.md의 Component Set Summary 테이블 파싱.

    Returns:
        {kebab-name → {
            figma_name, level, type, node_id,
            component_set_key, variant_count, level
        }}
    """
    global _index_cache
    if _index_cache is not None:
        return _index_cache

    _ensure_index_file()
    text = _INDEX_FILE.read_text(encoding="utf-8")
    rows = _parse_md_table_rows(text)

    result: dict[str, dict] = {}
    # 헤더 행: Component | Level | Type | Node ID | Component Set Key / Component Key | Variant Count | Detail
    header_row_found = False
    for row in rows:
        if not row:
            continue
        # 헤더 행 건너뛰기
        if row[0].lower().strip("`").strip() in ("component", ""):
            header_row_found = True
            continue
        if len(row) < 5:
            continue

        figma_name = _strip_backtick(row[0])
        level = _strip_backtick(row[1])
        node_type = _strip_backtick(row[2])
        node_id = _strip_backtick(row[3])
        component_set_key = _strip_backtick(row[4])
        variant_count_raw = _strip_backtick(row[5]) if len(row) > 5 else "0"
        try:
            variant_count = int(variant_count_raw)
        except ValueError:
            variant_count = 0

        kebab = _component_name_to_kebab(figma_name)
        result[kebab] = {
            "figma_name": figma_name,
            "level": level,
            "type": node_type,
            "node_id": node_id,
            "component_set_key": component_set_key,
            "variant_count": variant_count,
        }

    _index_cache = result
    return result


def load_variant_keys(component_name: str) -> list[dict]:
    """variant-keys/<component-name>.md 파싱.

    Args:
        component_name: kebab-case 이름 (예: "avatar", "dropdown-box")

    Returns:
        [{"variant": str, "node_id": str, "key": str}, ...]
    """
    if component_name in _variant_cache:
        return _variant_cache[component_name]

    file_path = _VARIANT_KEYS_DIR / f"{component_name}.md"
    if not file_path.exists():
        return []

    text = file_path.read_text(encoding="utf-8")
    rows = _parse_md_table_rows(text)

    result: list[dict] = []
    for row in rows:
        if len(row) < 3:
            continue
        variant = _strip_backtick(row[0])
        node_id = _strip_backtick(row[1])
        key = _strip_backtick(row[2])
        # 헤더 행 건너뛰기
        if variant.lower() in ("variant", "") or node_id.lower() in ("node id", ""):
            continue
        if variant and node_id and key:
            result.append({"variant": variant, "node_id": node_id, "key": key})

    _variant_cache[component_name] = result
    return result


def get_component_entry(component_name: str) -> dict | None:
    """index에서 컴포넌트 항목 반환. 없으면 None."""
    return load_index().get(component_name)


def list_component_names() -> list[str]:
    """등록된 모든 컴포넌트 kebab-name 목록."""
    return list(load_index().keys())
