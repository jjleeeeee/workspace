import json, glob
from pathlib import Path
from ruamel.yaml import YAML

TYPO_CATALOG = Path("/Users/jj.iee/Desktop/workspace/cds-catalogs/catalogs/tokens/tokens.typography.semantic.json")
DESC_DIR = Path("/Users/jj.iee/Desktop/workspace/03_wf-figma-to-description/draft-descriptions")

catalog = {t["name"]: t for t in json.loads(TYPO_CATALOG.read_text())["tokens"]}

def enrich(entry):
    if not isinstance(entry, dict) or "resolved" in entry:
        return False
    name = entry.get("token")
    if not name or not isinstance(name, str):
        return False
    if name not in catalog:
        return False
    t = catalog[name]
    entry["resolved"] = {
        "fontSize": t["fontSize"],
        "fontFamily": t["fontFamily"],
        "fontWeight": t["fontWeight"],
        "lineHeight": t["lineHeight"],
    }
    return True

yaml = YAML()
yaml.preserve_quotes = True
yaml.width = 200

total = 0
for fp in sorted(DESC_DIR.glob("*.yaml")):
    doc = yaml.load(fp)
    if not doc: continue
    tokens = doc.get("tokens", {})
    if not isinstance(tokens, dict): continue

    changed = 0
    for entry in tokens.values():
        if enrich(entry):
            changed += 1
    if changed:
        yaml.dump(doc, fp)
        total += changed
        print(f"  {fp.name}: +{changed}")

print(f"\ndone — {total} typography tokens resolved")
