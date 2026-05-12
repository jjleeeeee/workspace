import re, yaml as pyyaml, glob
from pathlib import Path
from ruamel.yaml import YAML

VKEYS_DIR = Path("/Users/jj.iee/Desktop/workspace/03_wf-figma-to-description/refs/figma-component-keys/variant-keys")
DESC_DIR = Path("/Users/jj.iee/Desktop/workspace/03_wf-figma-to-description/draft-descriptions")

SIZE_PRIORITY = ["Medium", "Large", "Small", "XLarge", "XSmall"]
PREFER_STATUS = ["Default", "Off", "Inactive"]

def pick_representative(rows):
    default_mode = [r for r in rows if "Mode=Default" in r[0]]
    pool = default_mode if default_mode else rows
    default_status = [r for r in pool if any(f"Status={s}" in r[0] for s in PREFER_STATUS)]
    pool = default_status if default_status else pool
    for size in SIZE_PRIORITY:
        sized = [r for r in pool if f"Size={size}" in r[0]]
        if sized:
            return sized[0]
    return pool[0]

# Build lookup: slug → {node_id, variant}
baseline_map = {}
for md in VKEYS_DIR.glob("*.md"):
    slug = md.stem
    rows = re.findall(r'\| `([^`]+)` \| `([0-9:]+)` \|', md.read_text())
    if rows:
        variant_str, node_id = pick_representative(rows)
        baseline_map[slug] = {"node_id": node_id, "variant": variant_str}

yaml = YAML()
yaml.preserve_quotes = True
yaml.width = 200

for fp in sorted(DESC_DIR.glob("*.yaml")):
    doc = yaml.load(fp)
    if not doc: continue

    slug = fp.stem.replace(".description", "")
    comp = doc.get("component", {})
    file_key = comp.get("figma_file", "DWEduE6GfxYMlyxKPNJ8jA")

    if slug in baseline_map:
        ref = baseline_map[slug]
    else:
        # fallback: use first registry variant or component node_id
        registry = doc.get("variants", {}).get("registry", [])
        nid = registry[0].get("node_id") if registry else comp.get("node_id")
        variant = registry[0].get("variant", "representative") if registry else "representative"
        ref = {"node_id": nid, "variant": variant}

    doc["baseline"] = {
        "node_id": ref["node_id"],
        "variant": ref["variant"],
        "figma_file": file_key,
        "note": "Fetch on demand: figma_get_component_image(node_id, scale=2)"
    }

    yaml.dump(doc, fp)
    print(f"  {fp.name}: {ref['node_id']} ({ref['variant']})")

