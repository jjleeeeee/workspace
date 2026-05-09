#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# dependencies = ["httpx>=0.27"]
# ///
"""
DS Token Linter

DSL v2 JSON(`nodes[]`) 전역 문자열을 재귀 스캔해 cds-catalogs와 대조한다.

Usage:
  uv run --script ds_token_lint.py <file_or_dir> [<file_or_dir> ...]
  uv run --script ds_token_lint.py .                  # 디렉터리 내 dsl_*.json + *.dsl.json
  uv run --script ds_token_lint.py dsl_text_button.json

검사 항목 (DSL v2):
  ERROR   — TokenRef prefix 없는 raw value (hex, px 등) — token:dotted.path 권장
  ERROR   — token: 형식이지만 '.' 구분자 누락
  ERROR   — unresolved: 값이 매칭 가능 토큰 보유(교체 필요) 또는 미등록
  WARNING — token:<path> 가 cds-catalogs에 없는 경로
  WARNING — hardcoded: 값이 매칭 토큰 보유 (의도적 폴백이면 무시)
"""

import base64
import json
import os
import re
import subprocess
import sys
from pathlib import Path

import httpx

# ── Config ──────────────────────────────────────────────────────────────

REPO = "weversecorp/cds-catalogs"
TOKENS_DIR = "catalogs/tokens"
GH_API_BASE = "https://api.github.com"
HTTP_TIMEOUT = 30

_USE_COLOR = sys.stdout.isatty() and not os.environ.get("NO_COLOR")


def _c(code: str, t: str) -> str: return f"\033[{code}m{t}\033[0m" if _USE_COLOR else t
def red(t: str) -> str: return _c("31", t)
def yellow(t: str) -> str: return _c("33", t)
def green(t: str) -> str: return _c("32", t)
def bold(t: str) -> str: return _c("1", t)
def cyan(t: str) -> str: return _c("36", t)
def dim(t: str) -> str: return _c("2", t)


# ── GitHub ───────────────────────────────────────────────────────────────

def gh_token() -> str:
    tok = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
    if tok and tok.strip():
        return tok.strip()
    r = subprocess.run(["gh", "auth", "token"], capture_output=True, text=True, timeout=5)
    if r.returncode == 0 and r.stdout.strip():
        return r.stdout.strip()
    raise RuntimeError("GitHub 인증 필요: gh auth login")


def _gh_h() -> dict:
    return {"Authorization": f"Bearer {gh_token()}", "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28"}


def gh_file_json(path: str) -> dict:
    r = httpx.get(f"{GH_API_BASE}/repos/{REPO}/contents/{path}", headers=_gh_h(), timeout=HTTP_TIMEOUT)
    r.raise_for_status()
    return json.loads(base64.b64decode(r.json()["content"]))


# ── 카탈로그 로드 ─────────────────────────────────────────────────────────

def load_catalog() -> tuple[set[str], dict[str, str]]:
    """
    Returns:
      valid_paths: cds-catalogs에 존재하는 모든 토큰 경로 집합 ($ 없는 형태, . 구분자)
      reverse_index: raw value → $token.path (색상/크기 역방향 조회용)
    """
    valid_paths: set[str] = set()
    reverse_index: dict[str, str] = {}

    r = httpx.get(f"{GH_API_BASE}/repos/{REPO}/contents/{TOKENS_DIR}", headers=_gh_h(), timeout=HTTP_TIMEOUT)
    r.raise_for_status()
    token_files = [i["name"] for i in r.json() if i["type"] == "file" and i["name"].endswith(".json")]

    for fname in token_files:
        cat = gh_file_json(f"{TOKENS_DIR}/{fname}")
        for token in cat.get("tokens", []):
            name = token.get("name", "")
            if not name:
                continue
            path = name.replace("/", ".")
            valid_paths.add(path)

            # reverse index: raw value → $token.path (light mode 기준)
            for theme_vals in token.get("values", {}).values():
                raw = str(theme_vals.get("raw", "")).strip()
                if raw:
                    token_path = "$" + path
                    # 중복 시 첫 번째만 유지 (먼저 만나는 토큰 우선)
                    if raw not in reverse_index:
                        reverse_index[raw] = token_path
                    if raw.upper() not in reverse_index:
                        reverse_index[raw.upper()] = token_path
            break  # values 구조: {light: {raw: ...}, dark: {raw: ...}}

    return valid_paths, reverse_index


# ── raw value 판별 ────────────────────────────────────────────────────────

_HEX_RE = re.compile(r'^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$')
_PX_RE = re.compile(r'^\d+(\.\d+)?(px|pt|rem|em|vh|vw|%)$')
_NUM_RE = re.compile(r'^\d+(\.\d+)?$')

_KNOWN_FONT_WEIGHTS = {"thin", "extralight", "light", "regular", "medium", "semibold", "bold", "extrabold", "black",
                       "100", "200", "300", "400", "500", "600", "700", "800", "900"}
_KNOWN_FONT_FAMILIES = {"apple sd gothic neo", "noto sans kr", "roboto", "inter", "sf pro", "pretendard"}


def classify_raw(v: str) -> str | None:
    """raw value 유형 반환. None이면 raw value 아님 (정상 참조 또는 기타)."""
    s = v.strip()
    if _HEX_RE.match(s):
        return "color"
    if _PX_RE.match(s.lower()):
        return "size"
    if _NUM_RE.match(s):
        return "number"
    if s.lower() in _KNOWN_FONT_WEIGHTS:
        return "fontWeight"
    if any(s.lower().startswith(f) for f in _KNOWN_FONT_FAMILIES):
        return "fontFamily"
    return None


# ── DSL 스캔 ─────────────────────────────────────────────────────────────

def _dotted_token_path(suggestion: str) -> str:
    """reverse_index 값은 `$a.b.c` 형태 — v2 `token:` 은 달러 없이 dotted path."""
    s = suggestion.strip()
    return s[1:] if s.startswith("$") else s


def scan_value(val: str, path: str, valid_paths: set[str], reverse_index: dict[str, str]) -> list[dict]:
    """단일 TokenRef 또는 raw 값 검사. v2: 'token:'/'textStyle:'/'hardcoded:'/'unresolved:' prefix 지원."""
    issues = []
    v = str(val).strip()

    if v.startswith("token:"):
        token_path = v[len("token:"):]
        if "." not in token_path:
            issues.append({"level": "error", "path": path, "value": v,
                           "message": "잘못된 토큰 형식 — '.' 구분자 필요 (예: token:system.color.button.default)"})
        elif token_path not in valid_paths:
            issues.append({"level": "warning", "path": path, "value": v,
                           "message": "cds-catalogs에 존재하지 않는 토큰 경로"})
    elif v.startswith("textStyle:"):
        # 합성 텍스트 스타일 식별자 — 카탈로그 검증 대상 외 (현 시점)
        pass
    elif v.startswith("hardcoded:"):
        literal = v[len("hardcoded:"):]
        suggestion = reverse_index.get(literal) or reverse_index.get(literal.upper())
        if suggestion:
            dotted = _dotted_token_path(suggestion)
            issues.append({"level": "error", "path": path, "value": v,
                           "message": f"hardcoded 값 사용 — DS 토큰 'token:{dotted}' 사용 권장"})
        else:
            issues.append({"level": "warning", "path": path, "value": v,
                           "message": "hardcoded 값 사용 — 의도적 폴백이면 무시"})
    elif v.startswith("unresolved:"):
        literal = v[len("unresolved:"):]
        suggestion = reverse_index.get(literal) or reverse_index.get(literal.upper())
        if suggestion:
            dotted = _dotted_token_path(suggestion)
            issues.append({"level": "error", "path": path, "value": v,
                           "message": f"unresolved 값 — DS 토큰 'token:{dotted}' 으로 교체 필요"})
        else:
            issues.append({"level": "error", "path": path, "value": v,
                           "message": "unresolved 값 — 대응 DS 토큰 미등록 (cds-catalogs 추가 필요)"})
    else:
        # prefix 없음 — raw value 검사 (v2에서는 TokenRef로 감싸야 함)
        raw_type = classify_raw(v)
        if raw_type is not None:
            suggestion = reverse_index.get(v) or reverse_index.get(v.upper())
            if suggestion:
                dotted = _dotted_token_path(suggestion)
                issues.append({"level": "error", "path": path, "value": v,
                               "message": f"raw {raw_type} 값 직접 사용 — 'token:{dotted}' 사용 권장"})
            else:
                issues.append({"level": "error", "path": path, "value": v,
                               "message": f"raw {raw_type} 값 직접 사용 — 'hardcoded:'/'unresolved:' prefix 또는 토큰 등록 필요"})

    return issues


_LINT_EXCLUDED_PATH_SEGMENTS = (
    ".catalog.variant.",   # axes enum values (예: 'Filled', 'medium', 'Large(44)')
    ".catalog.props.",     # prop 값 (예: 'Button Text', '구매하기', boolean 문자열)
    ".catalog.state",      # 상태 enum
    ".catalog.id",         # 카탈로그 id (예: 'textbutton')
    ".catalog.componentId",
    ".catalog.version",
    ".name",                # 노드 이름
    ".id",                  # 노드 id
    ".note",                # 사람용 주석
    ".text.value",          # 텍스트 콘텐츠 — 토큰 아님
    ".text.maxLines",
    ".text.overflow",
    ".text.textAlign",
    ".asset.alt",
    ".asset.name",
    ".asset.url",
    ".asset.format",
    ".asset.kind",
    ".source.",             # 원본 추적 메타
    ".metadata.",           # 생성 정보
    ".coordinateSystem.",   # 좌표계 메타
)


def _is_excluded(path: str) -> bool:
    """variant·props·이름·노트 등 토큰 검사 대상이 아닌 경로 필터링."""
    return any(seg in path for seg in _LINT_EXCLUDED_PATH_SEGMENTS)


def _scan_recursive(obj, prefix: str, valid_paths: set[str], reverse_index: dict[str, str]) -> list[dict]:
    """Node 트리 전역 재귀 — 토큰 후보 위치의 문자열에만 scan_value 적용. variant·props·name 등은 제외."""
    issues = []
    if isinstance(obj, dict):
        for k, v in obj.items():
            sub = f"{prefix}.{k}" if prefix else k
            if isinstance(v, str):
                if not _is_excluded(sub):
                    issues.extend(scan_value(v, sub, valid_paths, reverse_index))
            elif isinstance(v, (dict, list)):
                issues.extend(_scan_recursive(v, sub, valid_paths, reverse_index))
    elif isinstance(obj, list):
        for i, item in enumerate(obj):
            issues.extend(_scan_recursive(item, f"{prefix}[{i}]", valid_paths, reverse_index))
    return issues


def scan_dsl(dsl: dict, valid_paths: set[str], reverse_index: dict[str, str]) -> list[dict]:
    """DSL v2 JSON 전체 스캔. nodes[] 트리를 재귀 탐색하며 TokenRef 위치를 검사."""
    issues = []
    nodes = dsl.get("nodes", [])
    issues.extend(_scan_recursive(nodes, "nodes", valid_paths, reverse_index))
    return issues


# ── 파일 수집 ─────────────────────────────────────────────────────────────

def collect_files(args: list[str]) -> list[Path]:
    files = []
    for a in args:
        p = Path(a)
        if p.is_dir():
            merged = list(dict.fromkeys([*p.glob("dsl_*.json"), *p.glob("*.dsl.json")]))
            files.extend(sorted(merged, key=lambda x: str(x)))
        elif p.is_file() and p.suffix == ".json":
            files.append(p)
        else:
            print(yellow(f"  skip: {a} (JSON 파일 또는 디렉터리만 지원)"))
    return files


# ── 메인 ─────────────────────────────────────────────────────────────────

def main() -> int:
    targets = sys.argv[1:] or ["."]
    files = collect_files(targets)

    if not files:
        print(red("lint 대상 파일 없음. dsl_*.json 파일이나 디렉터리를 지정하세요."))
        return 1

    print(bold("╔══════════════════════════════════════════════╗"))
    print(bold("║  cds-ds Token Linter                          ║"))
    print(bold("╚══════════════════════════════════════════════╝"))

    # 카탈로그 로드 (1회)
    print(f"\n{bold('카탈로그 로드 중...')}")
    try:
        valid_paths, reverse_index = load_catalog()
        print(f"  토큰 경로: {len(valid_paths)}개 / reverse index: {len(reverse_index)}개")
    except Exception as e:
        print(red(f"  카탈로그 로드 실패: {e}"))
        return 1

    total_errors = 0
    total_warnings = 0

    for fpath in files:
        print(f"\n{bold(f'── {fpath} ──')}")
        try:
            dsl = json.loads(fpath.read_text(encoding="utf-8"))
        except Exception as e:
            print(red(f"  파싱 실패: {e}"))
            total_errors += 1
            continue

        issues = scan_dsl(dsl, valid_paths, reverse_index)

        errors = [i for i in issues if i["level"] == "error"]
        warnings = [i for i in issues if i["level"] == "warning"]

        if not issues:
            print(f"  {green('✅ 이슈 없음')}")
        else:
            for iss in errors:
                print(f"  {red('ERROR')}  {dim(iss['path'])}")
                print(f"         값: {cyan(repr(iss['value']))}")
                print(f"         {iss['message']}")
            for iss in warnings:
                print(f"  {yellow('WARN ')}  {dim(iss['path'])}")
                print(f"         값: {cyan(repr(iss['value']))}")
                print(f"         {iss['message']}")

        e_cnt = len(errors)
        w_cnt = len(warnings)
        badge = green("PASS") if e_cnt == 0 else red("FAIL")
        print(f"\n  결과: {badge} — error {e_cnt}건, warning {w_cnt}건")
        total_errors += e_cnt
        total_warnings += w_cnt

    print(f"\n{bold('══════════════════════════════════════════════')}")
    overall = green("✅ ALL PASS") if total_errors == 0 else red("❌ FAIL")
    print(f"전체: {overall} — error {total_errors}건, warning {total_warnings}건 ({len(files)}개 파일)")

    return 0 if total_errors == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
