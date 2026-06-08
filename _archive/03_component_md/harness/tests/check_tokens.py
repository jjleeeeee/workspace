#!/usr/bin/env python3
"""컬러 토큰 검증 - 이름 존재 여부 (Variables API 독립 fixture 사용)"""
import sys, json

from frontmatter_utils import load_contract

def run(md_path, fixture_path):
    with open(fixture_path) as f:
        fixture = json.load(f)
    content, _ = load_contract(md_path)

    tokens = {k: v for k, v in fixture.items() if not k.startswith('_')}
    name_passed, name_failed = [], []

    for token in tokens:
        if token in content:
            name_passed.append(token)
        else:
            name_failed.append(token)

    total = len(tokens)
    print(f"TOKENS: {len(name_passed)}/{total}")
    for t in name_failed:
        print(f"  MISSING: {t}")
    return bool(content) and len(name_failed) == 0

if __name__ == "__main__":
    ok = run(sys.argv[1], sys.argv[2])
    sys.exit(0 if ok else 1)
