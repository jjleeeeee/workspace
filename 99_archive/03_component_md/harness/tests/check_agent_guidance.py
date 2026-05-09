#!/usr/bin/env python3
"""Stitch-style guidance quality checks for component MD."""
import re
import sys

from frontmatter_utils import load_contract

CHECKS = {
    "role_usage": [r"사용", r"when|언제|용도|필요|상황|맥락"],
    "visual_character": [r"visual|시각|톤|인상|character"],
    "states": [r"Default", r"Disabled|Loading|Hover|Pressed|상태"],
    "dos": [r"DO:", r"DON'?T:"],
    "prompt_guide": [r"에이전트 프롬프트 가이드|Agent Prompt Guide", r"Create|Use|Generate|만들|사용"],
}

def run(md_path):
    frontmatter, body = load_contract(md_path)
    content = frontmatter + "\n" + body

    passed, failed = [], []
    for name, patterns in CHECKS.items():
        if all(re.search(pattern, content, flags=re.IGNORECASE) for pattern in patterns):
            passed.append(name)
        else:
            failed.append(name)

    print(f"AGENT_GUIDANCE: {len(passed)}/{len(CHECKS)}")
    for name in failed:
        print(f"  MISSING: {name}")
    return not failed

if __name__ == "__main__":
    sys.exit(0 if run(sys.argv[1]) else 1)
