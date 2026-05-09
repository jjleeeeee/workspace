#!/usr/bin/env python3
"""Component MD body section coverage."""
import sys

from frontmatter_utils import load_contract

REQUIRED_SECTIONS = [
    "## 1. 역할과 사용",
    "## 2. 시각적 성격",
    "## 3. 구조",
    "## 4. 컴포넌트 스타일링",
    "## 5. 상태와 인터랙션",
    "## 6. 레이아웃과 반응형 규칙",
    "## 7. 권장/금지",
    "## 8. 에이전트 프롬프트 가이드",
]

def run(md_path):
    frontmatter, body = load_contract(md_path)

    failed = [section for section in REQUIRED_SECTIONS if section not in body]
    total = len(REQUIRED_SECTIONS) + 1
    passed = len(REQUIRED_SECTIONS) - len(failed)
    if frontmatter:
        passed += 1
    else:
        failed.insert(0, "YAML frontmatter contract")
    print(f"DESIGN_SECTIONS: {passed}/{total}")
    for section in failed:
        print(f"  MISSING: {section}")
    return not failed

if __name__ == "__main__":
    sys.exit(0 if run(sys.argv[1]) else 1)
