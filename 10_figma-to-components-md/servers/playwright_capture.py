#!/usr/bin/env python3
"""
playwright_capture.py — HTML 파일을 Chromium으로 렌더링해 스크린샷 캡처.

사용:
  python3 playwright_capture.py \
    --html <path> --output <path> \
    --css-width 84 [--css-height 900] [--device-scale-factor 3.0] [--full-page]

레거시 호환:
  --width 는 --css-width 와 동일하게 동작 (deprecated)
"""

import argparse
import sys
from pathlib import Path


def main() -> None:
    parser = argparse.ArgumentParser(description="Playwright HTML screenshot")
    parser.add_argument("--html", required=True, help="HTML 파일 경로")
    parser.add_argument("--output", required=True, help="PNG 출력 경로")
    parser.add_argument("--css-width", type=int, default=None, help="viewport CSS 폭 (px)")
    parser.add_argument("--css-height", type=int, default=900, help="viewport CSS 높이 (px)")
    parser.add_argument("--device-scale-factor", type=float, default=3.0, help="deviceScaleFactor (기본 3.0 → 3x raster)")
    parser.add_argument("--width", type=int, default=375, help="[deprecated] --css-width 사용 권장")
    parser.add_argument("--full-page", action="store_true", help="전체 페이지 캡처")
    args = parser.parse_args()

    css_width = args.css_width if args.css_width is not None else args.width
    if args.css_width is None and args.width != 375:
        pass  # --width was explicitly set; silently accept
    elif args.css_width is None:
        print("[playwright_capture] --css-width 미지정 — --width 기본값 375 사용 (deprecated)", file=sys.stderr)

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
        # device_scale_factor=3 → raster는 css의 3배 크기 PNG 출력
        context = browser.new_context(
            viewport={"width": css_width, "height": args.css_height},
            device_scale_factor=args.device_scale_factor,
        )
        page = context.new_page()
        page.goto(f"file://{html_path}", wait_until="networkidle")

        page.screenshot(
            path=str(output_path),
            full_page=args.full_page,
            type="png",
        )
        browser.close()

    print(f"[playwright_capture] 저장: {output_path} (css={css_width}×{args.css_height}, scale={args.device_scale_factor})")
    sys.exit(0)


if __name__ == "__main__":
    main()
