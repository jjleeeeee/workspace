#!/usr/bin/env python3
"""Variant 커버리지 검사 — figma-console analyze_component_set 독립 fixture 사용"""
import sys, json

from frontmatter_utils import load_contract

def run(md_path, fixture_path):
    with open(fixture_path) as f:
        fixture = json.load(f)
    content, _ = load_contract(md_path)

    axes = fixture['axes']
    props = fixture.get('componentProps', {})
    passed, failed = [], []

    # axes 값 커버리지
    for axis, values in axes.items():
        for val in values:
            if val in content:
                passed.append(f"{axis}={val}")
            else:
                failed.append(f"{axis}={val}")

    # componentProps 커버리지
    for prop in props:
        if prop in content:
            passed.append(f"prop:{prop}")
        else:
            failed.append(f"prop:{prop}")

    total = len(passed) + len(failed)
    print(f"VARIANTS: {len(passed)}/{total}")
    for f_ in failed:
        print(f"  MISSING: {f_}")
    return bool(content) and len(failed) == 0

if __name__ == "__main__":
    ok = run(sys.argv[1], sys.argv[2])
    sys.exit(0 if ok else 1)
