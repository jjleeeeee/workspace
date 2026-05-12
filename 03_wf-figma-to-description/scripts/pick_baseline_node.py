import re, glob
from pathlib import Path

VKEYS_DIR = Path("/Users/jj.iee/Desktop/workspace/03_wf-figma-to-description/refs/figma-component-keys/variant-keys")

# Priority order for picking representative variant
SIZE_PRIORITY = ["Medium", "Large", "Small", "XLarge", "XSmall", "XXLarge", "XXSmall"]
PREFER_MODE = "Default"
PREFER_STATUS = ["Default", "Off", "Inactive"]

def pick_representative(rows):
    """rows: list of (variant_str, node_id)"""
    # Filter to Mode=Default if possible
    default_mode = [r for r in rows if "Mode=Default" in r[0]]
    pool = default_mode if default_mode else rows

    # Filter to Status=Default if possible
    default_status = [r for r in pool if any(f"Status={s}" in r[0] for s in PREFER_STATUS)]
    pool = default_status if default_status else pool

    # Pick preferred size
    for size in SIZE_PRIORITY:
        sized = [r for r in pool if f"Size={size}" in r[0]]
        if sized:
            return sized[0]

    return pool[0]

results = {}
for md in sorted(VKEYS_DIR.glob("*.md")):
    slug = md.stem
    text = md.read_text()
    rows = re.findall(r'\| `([^`]+)` \| `([0-9:]+)` \|', text)
    if not rows:
        continue
    variant_str, node_id = pick_representative(rows)
    results[slug] = {"node_id": node_id, "variant": variant_str}
    print(f"{slug:<40} → {node_id}  ({variant_str})")

import json
print(f"\ntotal: {len(results)}")
