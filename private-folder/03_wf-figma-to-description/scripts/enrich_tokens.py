import json, glob
from pathlib import Path
from ruamel.yaml import YAML

CATALOG_DIR = Path("/Users/jj.iee/Desktop/workspace/chord-design-system/tokens")
DESC_DIR = Path("/Users/jj.iee/Desktop/workspace/03_wf-figma-to-description/_workspace/outputs/draft-descriptions")

catalog = {}
for fname in CATALOG_DIR.glob("*.json"):
    data = json.loads(fname.read_text())
    for t in data["tokens"]:
        if "values" in t:
            catalog[t["name"]] = t["values"]

def resolved_entry(token_name, values):
    return {mode: v["raw"] for mode, v in values.items()}

def enrich_token_entry(entry):
    if not isinstance(entry, dict):
        return
    # Remove stale resolved first
    if "resolved" in entry:
        del entry["resolved"]

    if "token" in entry and isinstance(entry["token"], str):
        name = entry["token"]
        if name in catalog:
            entry["resolved"] = resolved_entry(name, catalog[name])

    if "default" in entry or "fixed" in entry:
        resolved = {}
        for field in ("default", "fixed"):
            name = entry.get(field)
            if name and isinstance(name, str) and name in catalog:
                resolved[field] = resolved_entry(name, catalog[name])
        if resolved:
            entry["resolved"] = resolved

yaml = YAML()
yaml.preserve_quotes = True
yaml.width = 200

stats = {"files": 0, "enriched": 0, "skipped": 0}

for fp in sorted(DESC_DIR.glob("*.yaml")):
    doc = yaml.load(fp)
    if not doc:
        continue
    tokens = doc.get("tokens")
    if not tokens or not isinstance(tokens, dict):
        continue

    changed = 0
    for key, entry in tokens.items():
        if not isinstance(entry, dict):
            continue
        enrich_token_entry(entry)
        if "resolved" in entry:
            changed += 1
            stats["enriched"] += 1
        else:
            stats["skipped"] += 1

    yaml.dump(doc, fp)
    if changed:
        stats["files"] += 1

print(f"done — {stats['files']} files, {stats['enriched']} tokens resolved, {stats['skipped']} skipped (typography/size/compound)")
