#!/usr/bin/env python3
"""
preflight_sot.py — Phase 0: SoT 파일 git tracked 검증

src/tokens/*.json, src/figma-component-keys/index.md,
src/figma-component-keys/variant-keys/*.md가 모두 git에 tracked 되어 있는지 확인.
untracked 상태이면 FAIL — "see Phase 0 in plan" 메시지 출력.

사용:
  python3 scripts/preflight_sot.py [--require-figma-api]

  --require-figma-api: FIGMA_API_TOKEN 환경변수 없으면 FAIL (기본: 경고만)
"""
from __future__ import annotations

import argparse
import os
import subprocess
import sys
from pathlib import Path

# 프로젝트 루트 .env 자동 로드 (FIGMA_API_TOKEN 등)
try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).parent.parent / ".env")
except ImportError:
    pass

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
    parser = argparse.ArgumentParser(description="SoT preflight 검증")
    parser.add_argument(
        "--require-figma-api",
        action="store_true",
        help="FIGMA_API_TOKEN 환경변수 없으면 FAIL (기본: 경고만)",
    )
    args = parser.parse_args()

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
        sys.exit(1)

    # FIGMA_API_TOKEN 체크
    token = os.environ.get("FIGMA_API_TOKEN", "").strip()
    if not token:
        if args.require_figma_api:
            print(
                "[preflight] FAIL — FIGMA_API_TOKEN 환경변수 없음 (--require-figma-api)\n"
                "  export FIGMA_API_TOKEN=<your token>",
                file=sys.stderr,
            )
            sys.exit(1)
        else:
            print(
                "[preflight] WARNING — FIGMA_API_TOKEN 없음. "
                "REST API 기능(refresh_fixture.py 등)은 동작하지 않습니다.",
                file=sys.stderr,
            )

    sot_count = len(REQUIRED_PATHS) + 1  # +1 for variant-keys dir
    print(f"[preflight] PASS — SoT {sot_count}개 경로 모두 git tracked")
    sys.exit(0)


if __name__ == "__main__":
    main()
