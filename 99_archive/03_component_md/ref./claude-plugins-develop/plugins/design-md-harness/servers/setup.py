#!/usr/bin/env python3
"""
design-md-harness 의존성 자동 설치 스크립트.
멱등성 보장: requirements.txt MD5가 같으면 즉시 종료.
"""

import hashlib
import os
import subprocess
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REQ_FILE = os.path.join(SCRIPT_DIR, "requirements.txt")
SENTINEL = os.path.join(SCRIPT_DIR, ".deps_installed")


def req_hash() -> str:
    with open(REQ_FILE, "rb") as f:
        return hashlib.md5(f.read()).hexdigest()


def already_installed() -> bool:
    if not os.path.exists(SENTINEL):
        return False
    try:
        with open(SENTINEL) as f:
            return f.read().strip() == req_hash()
    except Exception:
        return False


def run(cmd: list[str]) -> None:
    result = subprocess.run(cmd, capture_output=False)
    if result.returncode != 0:
        print(f"[setup] 실패: {' '.join(cmd)}", file=sys.stderr)
        sys.exit(result.returncode)


def main() -> None:
    if already_installed():
        sys.exit(0)

    print("[setup] 의존성 설치 중...")
    run([sys.executable, "-m", "pip", "install", "-q", "-r", REQ_FILE])

    print("[setup] Playwright Chromium 설치 중...")
    run([sys.executable, "-m", "playwright", "install", "chromium", "--with-deps"])

    with open(SENTINEL, "w") as f:
        f.write(req_hash())
    print("[setup] 완료")


if __name__ == "__main__":
    main()
