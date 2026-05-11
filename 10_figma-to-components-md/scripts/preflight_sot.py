#!/usr/bin/env python3
"""
preflight_sot.py — Phase 0: SoT 파일 git tracked 검증

src/tokens/*.json, src/figma-component-keys/index.md,
src/figma-component-keys/variant-keys/*.md가 모두 git에 tracked 되어 있는지 확인.
untracked 상태이면 FAIL — "see Phase 0 in plan" 메시지 출력.

사용:
  python3 scripts/preflight_sot.py
"""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent
REQUIRED_PATHS = [
    "src/tokens/tokens.color.v1.0.json",
    "src/tokens/tokens.typography.v1.0.json",
    "src/tokens/tokens.size.v1.0.json",
    "src/figma-component-keys/index.md",
]


def git_tracked_files() -> set[str]:
    result = subprocess.run(
        ["git", "ls-files"],
        cwd=REPO_ROOT,
        capture_output=True,
        text=True,
    )
    return set(result.stdout.splitlines())


def main() -> None:
    tracked = git_tracked_files()
    missing: list[str] = []

    for rel in REQUIRED_PATHS:
        if rel not in tracked:
            missing.append(rel)

    # variant-keys 디렉토리: 파일이 1개 이상 tracked 되어 있어야 함
    variant_keys_dir = REPO_ROOT / "src" / "figma-component-keys" / "variant-keys"
    if variant_keys_dir.exists():
        tracked_variant_keys = [f for f in tracked if f.startswith("src/figma-component-keys/variant-keys/")]
        if not tracked_variant_keys:
            missing.append("src/figma-component-keys/variant-keys/ (no files tracked)")
    else:
        missing.append("src/figma-component-keys/variant-keys/ (directory missing)")

    if missing:
        print("[preflight] FAIL — 다음 SoT 파일이 git에 tracked 되어 있지 않습니다:", file=sys.stderr)
        for m in missing:
            print(f"  ✗ {m}", file=sys.stderr)
        print("\n[preflight] 해결 방법: git add <file> && git commit", file=sys.stderr)
        print("[preflight] (Phase 0 in plan/10-harness-shared-spec-evolution.md 참조)", file=sys.stderr)
        sys.exit(1)

    print(f"[preflight] PASS — SoT {len(REQUIRED_PATHS) + 1}개 경로 모두 git tracked")
    sys.exit(0)


if __name__ == "__main__":
    main()
