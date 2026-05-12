"""
fix_hints.py — fix_hints 포맷터 + 회귀 태깅 (SSOT)

design_md_harness.py의 11개 check 함수와 design_md_qa 에이전트가
동일한 포맷으로 fix_hints를 생성하도록 단일 구현으로 통합.
"""
from __future__ import annotations

REGRESSION_TAG = "[REGRESSION]"


# ─── 결과 빌더 ────────────────────────────────────────────────────────────────

def pass_result(check_id: str, message: str) -> dict:
    return {
        "id": check_id,
        "pass": True,
        "level": "pass",
        "message": message,
        "fix_hints": [],
    }


def fail_result(check_id: str, message: str, hints: list[str]) -> dict:
    return {
        "id": check_id,
        "pass": False,
        "level": "error",
        "message": message,
        "fix_hints": hints,
    }


def warning_result(check_id: str, message: str, hints: list[str]) -> dict:
    return {
        "id": check_id,
        "pass": True,
        "level": "warning",
        "message": message,
        "fix_hints": hints,
    }


# ─── 힌트 포맷터 ──────────────────────────────────────────────────────────────

def hint(check_id: str, body: str) -> str:
    """표준 fix_hint 문자열 생성: '<check_id>: <body>'"""
    return f"{check_id}: {body}"


def regression_hint(original_hint: str) -> str:
    """회귀 감지된 hint에 [REGRESSION] 태그 삽입."""
    return f"{REGRESSION_TAG} {original_hint}"


def tag_regression(check: dict) -> None:
    """check dict의 fix_hints에 회귀 태그를 인플레이스 삽입."""
    check["fix_hints"] = [regression_hint(h) for h in check["fix_hints"]]
    check["fix_hints"].append(
        regression_hint(f"'{check['id']}'는 이전 루프에서 통과했으나 다시 실패. 회귀 금지")
    )


# ─── 회귀 검사 ────────────────────────────────────────────────────────────────

def check_regression(
    checks: list[dict],
    handoff: dict,
) -> tuple[list[str], dict[str, int], list[str]]:
    """이전 루프 verified_pass 항목이 현재 루프에서 깨졌는지 확인.

    Returns:
        regressed: 회귀 항목 id 목록
        updated_streak: 각 항목별 연속 회귀 횟수
        critical: 연속 2회 회귀한 항목 (terminate 대상)
    """
    verified = set(handoff.get("verified_pass") or [])
    prev_streak: dict[str, int] = handoff.get("regression_streak") or {}
    current_pass = {c["id"] for c in checks if c.get("pass")}

    regressed = [item for item in verified if item not in current_pass]

    updated_streak = dict(prev_streak)
    for item in regressed:
        updated_streak[item] = updated_streak.get(item, 0) + 1

    critical = [item for item, count in updated_streak.items()
                if count >= 2 and item in regressed]

    return regressed, updated_streak, critical
