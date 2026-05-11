"""
token_resolver.py — CDS 토큰 해석 (SoT: src/tokens/*.json)

토큰 참조 우선순위:
  1. id 기반: "token:system.color.button.black" (unique, 권장)
  2. name 기반: "{cds: system/color/button/black}" (슬래시 구분)
     → 복수 id에 매핑되면 AmbiguousTokenName 예외

generator/renderer: 이 모듈의 resolve_by_id(token_id, mode)를 사용.
harness gate: token_id_exists(), token_id_has_mode_value(), name_to_ids()를 사용.
"""
from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

_SRC_DIR = Path(__file__).parent.parent.parent / "src" / "tokens"
_TOKEN_FILES = {
    "color": _SRC_DIR / "tokens.color.v1.0.json",
    "typography": _SRC_DIR / "tokens.typography.v1.0.json",
    "size": _SRC_DIR / "tokens.size.v1.0.json",
}

_UNRESOLVED_COLOR_FALLBACK = "#cccccc"
_UNRESOLVED_FALLBACK = "inherit"

_CDS_PATTERN = re.compile(r"^\{cds:\s*([^}]+)\}$")
_NS_PATTERN = re.compile(r"^\{(\w+)\.([^}]+)\}$")
_TOKEN_ID_PATTERN = re.compile(r"^token:.+")


class AmbiguousTokenName(ValueError):
    """하나의 name이 복수 token id에 매핑되는 경우."""
    pass


# ─── 카탈로그 로딩 ────────────────────────────────────────────────────────────

_catalog: dict | None = None


def _load_catalog() -> dict:
    """src/tokens/*.json 3개를 읽어 통합 카탈로그 반환.

    Structure:
        {
            "by_id": {token_id: {kind, name, values, ...}},
            "by_name": {name: [token_id, ...]},  # 중복 name → 복수 id
        }
    """
    by_id: dict[str, dict] = {}
    by_name: dict[str, list[str]] = {}

    for kind, path in _TOKEN_FILES.items():
        if not path.exists():
            raise FileNotFoundError(
                f"[token_resolver] SoT 파일 없음: {path}\n"
                "Phase 0을 완료해 src/tokens/ 파일을 git tracked 상태로 만드세요."
            )
        data = json.loads(path.read_text(encoding="utf-8"))
        for token in data.get("tokens") or []:
            tid = token.get("id") or ""
            tname = token.get("name") or ""
            if not tid:
                continue
            by_id[tid] = {**token, "kind": kind}
            if tname:
                by_name.setdefault(tname, []).append(tid)

    return {"by_id": by_id, "by_name": by_name}


def _get_catalog() -> dict:
    global _catalog
    if _catalog is None:
        _catalog = _load_catalog()
    return _catalog


def invalidate_cache() -> None:
    """테스트나 재로드 시 캐시 제거."""
    global _catalog
    _catalog = None


# ─── id 기반 API (권장) ────────────────────────────────────────────────────────

def token_id_exists(token_id: str) -> bool:
    """id가 SoT 카탈로그에 존재하는지 확인."""
    return token_id in _get_catalog()["by_id"]


def token_id_has_mode_value(token_id: str, mode: str) -> bool:
    """id가 지정 모드에서 실제 값(raw)을 가지는지 확인."""
    entry = _get_catalog()["by_id"].get(token_id)
    if not entry:
        return False
    values = entry.get("values") or {}
    mode_val = values.get(mode) or {}
    return bool(mode_val.get("raw"))


def resolve_by_id(token_id: str, mode: str) -> str:
    """id + mode → raw 값 반환. 미존재 시 fallback."""
    entry = _get_catalog()["by_id"].get(token_id)
    if not entry:
        return _UNRESOLVED_COLOR_FALLBACK
    values = entry.get("values") or {}
    mode_val = values.get(mode) or {}
    return mode_val.get("raw") or _UNRESOLVED_COLOR_FALLBACK


# ─── name 기반 API (보조, ambiguity 검출) ────────────────────────────────────

def name_to_ids(name: str) -> list[str]:
    """name → 매핑된 id 목록. 중복이 있으면 길이 > 1."""
    # name은 슬래시 구분: "system/color/button/black"
    # {cds: ...} 형식의 점 구분도 처리
    normalized = name.strip().replace(".", "/")
    return _get_catalog()["by_name"].get(normalized, [])


def resolve_by_name(name: str, mode: str) -> str:
    """name + mode → raw 값. 복수 id 매핑이면 AmbiguousTokenName."""
    ids = name_to_ids(name)
    if len(ids) > 1:
        raise AmbiguousTokenName(
            f"토큰 name '{name}'이 복수 id {ids}에 매핑됩니다. "
            "frontmatter에서 id를 직접 지정하세요 (예: token:system.color.button.black)."
        )
    if not ids:
        return _UNRESOLVED_COLOR_FALLBACK
    return resolve_by_id(ids[0], mode)


# ─── 참조 문자열 파싱 ─────────────────────────────────────────────────────────

def _parse_token_ref(value: str) -> tuple[str, str]:
    """참조 문자열을 (kind, key) 쌍으로 파싱.

    종류:
      "token:system.color.button.black"  → ("id", "token:system.color.button.black")
      "{cds: system/color/button/black}" → ("cds_name", "system/color/button/black")
      "{colors.primary}"                 → ("ns", "colors.primary")
    """
    value = (value or "").strip()
    if _TOKEN_ID_PATTERN.match(value):
        return ("id", value)
    cds_m = _CDS_PATTERN.match(value)
    if cds_m:
        return ("cds_name", cds_m.group(1).strip())
    ns_m = _NS_PATTERN.match(value)
    if ns_m:
        return ("ns", f"{ns_m.group(1)}.{ns_m.group(2)}")
    return ("literal", value)


# ─── 렌더러용 resolve 함수 (backward compat) ─────────────────────────────────

def resolve_color(value: str, meta: dict, token_map: dict | None = None,
                  depth: int = 0, mode: str = "light") -> str:
    """색상 참조 문자열 → hex 값.

    지원 형식:
      "token:xxx.yyy"          → resolve_by_id(id, mode)
      "{cds: path}"            → resolve_by_name(name, mode) [ambiguity 시 fallback]
      "{colors.x}"             → meta.colors[x] 재귀
      "#hex"                   → 그대로
    """
    if depth > 5:
        return _UNRESOLVED_COLOR_FALLBACK
    value = (value or "").strip()

    kind, key = _parse_token_ref(value)

    if kind == "id":
        return resolve_by_id(key, mode)

    if kind == "cds_name":
        try:
            return resolve_by_name(key, mode)
        except AmbiguousTokenName:
            return _UNRESOLVED_COLOR_FALLBACK

    if kind == "ns":
        ns, k = key.split(".", 1)
        if ns == "colors":
            colors = (meta or {}).get("colors") or {}
            nested = colors.get(k, _UNRESOLVED_COLOR_FALLBACK)
            return resolve_color(nested, meta, token_map, depth + 1, mode)
        return _UNRESOLVED_COLOR_FALLBACK

    if re.match(r"^#[0-9a-fA-F]{3,8}$", value):
        return value

    return _UNRESOLVED_COLOR_FALLBACK


def resolve_spacing(value: str, meta: dict) -> str:
    """spacing / rounded 참조 → CSS 값."""
    value = (value or "").strip()
    ns_m = _NS_PATTERN.match(value)
    if ns_m:
        ns, k = ns_m.group(1), ns_m.group(2)
        section = (meta or {}).get(ns) or {}
        return section.get(k, value)
    return value


def resolve_typography(value: str, meta: dict) -> dict:
    """typography 참조 → typography dict."""
    if isinstance(value, dict):
        return value
    value = (value or "").strip()
    ns_m = _NS_PATTERN.match(value)
    if ns_m and ns_m.group(1) == "typography":
        typos = (meta or {}).get("typography") or {}
        return typos.get(ns_m.group(2), {})
    return {}


# ─── broken-ref 검사용 ────────────────────────────────────────────────────────

def all_references_in(node: Any) -> list[tuple[str, str, str]]:
    """YAML 트리에서 모든 {namespace.key} 참조를 수집.

    Returns: [(yaml_path, namespace, key), ...]
    """
    results: list[tuple[str, str, str]] = []
    _collect_refs(node, "", results)
    return results


def _collect_refs(node: Any, path: str, out: list) -> None:
    if isinstance(node, dict):
        for k, v in node.items():
            _collect_refs(v, f"{path}.{k}" if path else k, out)
    elif isinstance(node, list):
        for i, item in enumerate(node):
            _collect_refs(item, f"{path}[{i}]", out)
    elif isinstance(node, str):
        for m in re.finditer(r"\{(\w+)\.(\S+?)\}", node):
            out.append((path, m.group(1), m.group(2)))
