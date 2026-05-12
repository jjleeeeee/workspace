"""
handoff.py — handoff_N.json 스키마 read/write (SSOT)

루프 간 상태 인계 파일의 스키마를 단일 모듈로 정의.
harness 오케스트레이터와 design_md_generator 에이전트가 이 스키마를 참조.
"""
from __future__ import annotations

import json
from pathlib import Path


# ─── 스키마 ───────────────────────────────────────────────────────────────────

def empty_handoff(loop: int = 0) -> dict:
    """빈 handoff 구조체 반환 (첫 루프 초기값)."""
    return {
        "loop": loop,
        "verified_pass": [],
        "remaining_issues": [],
        "fix_log": [],
        "ssim": 0.0,
        "pixel_pass": False,
        "regression_streak": {},
        "regression_detected_this_loop": [],
        "static_all_pass": False,
        "visual_fix_hints": [],
    }


def build_handoff(
    loop: int,
    harness_result: dict,
    pixel_result: dict,
    qa_fix_hints: list[str],
    prev_handoff: dict | None = None,
) -> dict:
    """루프 결과들을 병합해 handoff dict 생성.

    Args:
        loop: 현재 루프 번호 (1~5)
        harness_result: design_md_harness.py 출력 JSON
        pixel_result: pixel_compare.py 출력 JSON
        qa_fix_hints: design_md_qa 에이전트 fix_hints 목록
        prev_handoff: 이전 루프 handoff (fix_log 누적용)
    """
    checks: list[dict] = harness_result.get("checks") or []
    verified_pass = [c["id"] for c in checks if c.get("pass")]
    remaining_issues = [
        {"id": c["id"], "message": c.get("message", ""), "fix_hint": (c.get("fix_hints") or [""])[0]}
        for c in checks if not c.get("pass")
    ]

    prev_log: list[str] = (prev_handoff or {}).get("fix_log") or []
    fix_log = prev_log + [f"loop {loop}: 정적 {harness_result.get('summary', {}).get('passed', '?')}/"
                         f"{harness_result.get('summary', {}).get('total', '?')} 통과, "
                         f"SSIM {pixel_result.get('score_ssim', 0):.3f}"]

    return {
        "loop": loop,
        "verified_pass": verified_pass,
        "remaining_issues": remaining_issues,
        "fix_log": fix_log,
        "ssim": pixel_result.get("score_ssim", 0.0),
        "pixel_pass": pixel_result.get("pass", False),
        "regression_streak": harness_result.get("regression_streak") or {},
        "regression_detected_this_loop": harness_result.get("regression_detected_this_loop") or [],
        "static_all_pass": harness_result.get("all_pass", False),
        "visual_fix_hints": qa_fix_hints,
    }


# ─── IO ───────────────────────────────────────────────────────────────────────

def load(path: str | Path) -> dict:
    """handoff JSON 파일 로드. 파일 없으면 빈 handoff 반환."""
    p = Path(path)
    if not p.exists():
        return empty_handoff()
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except Exception:
        return empty_handoff()


def save(handoff: dict, path: str | Path) -> None:
    """handoff dict를 JSON 파일로 저장."""
    p = Path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(handoff, ensure_ascii=False, indent=2), encoding="utf-8")


def get_verified_pass(handoff: dict) -> set[str]:
    """handoff에서 verified_pass set 반환."""
    return set(handoff.get("verified_pass") or [])
