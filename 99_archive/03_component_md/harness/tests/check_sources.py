#!/usr/bin/env python3
"""소스 간 교차 검증 — figma-console vs REST API vs avatar.md 3방향 비교"""
import sys, json, re

from frontmatter_utils import load_contract

def run(md_path, fixture_console, fixture_rest):
    with open(fixture_console) as f:
        console = json.load(f)
    with open(fixture_rest) as f:
        rest = json.load(f)
    content, _ = load_contract(md_path)

    passed, failed = [], []

    # 1. figma-console vs REST API axes — REST must be subset of console
    # (REST API may omit unpublished variants; console sees all)
    for axis in rest.get('axes', {}):
        if axis not in console.get('axes', {}):
            failed.append(f"REST has unknown axis: {axis}")
            continue
        c_vals = set(console['axes'][axis])
        r_vals = set(rest['axes'][axis])
        extra = r_vals - c_vals  # REST values not in console = real mismatch
        if not extra:
            passed.append(f"REST {axis} ⊆ console")
        else:
            failed.append(f"REST {axis} has unknown values: {sorted(extra)}")

    # 2. variant count — REST may be less than console (unpublished/internal variants)
    if rest['variantCount'] <= console['variantCount']:
        passed.append(f"variantCount ok (console={console['variantCount']} rest={rest['variantCount']})")
    else:
        failed.append(f"variantCount: REST ({rest['variantCount']}) > console ({console['variantCount']})")

    # 3. MD에 REST API 모든 axis값 존재
    for axis, values in rest['axes'].items():
        for val in values:
            if val in content:
                passed.append(f"MD has REST {axis}={val}")
            else:
                failed.append(f"MD missing REST {axis}={val}")

    total = len(passed) + len(failed)
    print(f"SOURCES: {len(passed)}/{total}")
    for f_ in failed:
        print(f"  MISMATCH: {f_}")
    return bool(content) and len(failed) == 0

if __name__ == "__main__":
    ok = run(sys.argv[1], sys.argv[2], sys.argv[3])
    sys.exit(0 if ok else 1)
