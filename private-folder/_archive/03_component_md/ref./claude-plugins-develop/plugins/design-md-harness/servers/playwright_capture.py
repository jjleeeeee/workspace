#!/usr/bin/env python3
"""
playwright_capture.py — HTML 파일을 Chromium으로 렌더링해 스크린샷 캡처.

사용:
  python3 playwright_capture.py \
    --html <path> --output <path> [--width 375] [--full-page]
"""

import argparse
import sys
from pathlib import Path


def main() -> None:
    parser = argparse.ArgumentParser(description="Playwright HTML screenshot")
    parser.add_argument("--html", required=True, help="HTML 파일 경로")
    parser.add_argument("--output", required=True, help="PNG 출력 경로")
    parser.add_argument("--width", type=int, default=375, help="viewport 폭 (px)")
    parser.add_argument("--full-page", action="store_true", help="전체 페이지 캡처")
    args = parser.parse_args()

    html_path = Path(args.html).resolve()
    if not html_path.exists():
        print(f"[playwright_capture] HTML 파일 없음: {html_path}", file=sys.stderr)
        sys.exit(1)

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("[playwright_capture] playwright 미설치 — python3 servers/setup.py 먼저 실행", file=sys.stderr)
        sys.exit(1)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": args.width, "height": 900})
        page.goto(f"file://{html_path}", wait_until="networkidle")

        page.screenshot(
            path=str(output_path),
            full_page=args.full_page,
            type="png",
        )
        browser.close()

    print(f"[playwright_capture] 저장: {output_path}")
    sys.exit(0)


if __name__ == "__main__":
    main()
