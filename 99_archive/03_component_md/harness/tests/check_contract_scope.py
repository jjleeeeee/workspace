#!/usr/bin/env python3
"""Implementation Contract minimum scope check for component MD."""
import sys

from frontmatter_utils import has_top_level_key, load_contract

REQUIRED_CONTRACT_TOPICS = {
    "component": "component",
    "source": "source",
    "props": "props",
    "variants": "variants",
    "states": "states",
    "tokens": "tokens",
    "layout": "layout",
    "accessibility": "accessibility",
    "rules": "rules",
    "notes": "notes",
}

def run(md_path):
    contract, _ = load_contract(md_path)

    failed = []
    for topic, key in REQUIRED_CONTRACT_TOPICS.items():
        if not has_top_level_key(contract, key):
            failed.append(topic)

    total = len(REQUIRED_CONTRACT_TOPICS)
    print(f"CONTRACT_SCOPE: {total - len(failed)}/{total}")
    for topic in failed:
        print(f"  MISSING: {topic}")
    return bool(contract) and not failed

if __name__ == "__main__":
    sys.exit(0 if run(sys.argv[1]) else 1)
