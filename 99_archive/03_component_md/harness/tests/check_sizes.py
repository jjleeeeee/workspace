#!/usr/bin/env python3
"""Size px값 정확도 검사"""
import sys, json, re

from frontmatter_utils import load_contract

def run(md_path, fixture_path):
    with open(fixture_path) as f:
        expected = json.load(f)
    content, _ = load_contract(md_path)

    passed, failed = [], []
    for size, vals in expected.items():
        img, touch = vals['image'], vals['touch']
        pattern = rf'name:\s*["\']?{re.escape(size)}["\']?[\s\S]*?image:\s*["\']?{img}px["\']?[\s\S]*?touch:\s*["\']?{touch}px["\']?'
        if re.search(pattern, content):
            passed.append(size)
        else:
            failed.append((size, img, touch))

    total = len(expected)
    print(f"SIZES: {len(passed)}/{total}")
    for size, img, touch in failed:
        print(f"  MISMATCH: {size} — expected {img}px / {touch}px")
    return bool(content) and len(failed) == 0

if __name__ == "__main__":
    ok = run(sys.argv[1], sys.argv[2])
    sys.exit(0 if ok else 1)
