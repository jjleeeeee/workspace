# 2026-06-10 — Flatten base/color and base/size into system tokens

## Decision

Remove `base/color/*` and `base/size/*` from Figma `WDS_tokens` collection.
System tokens now hold RGBA / FLOAT values directly instead of aliasing into base.

## Scope

Branch: `vuq1CyC1Pi4NZYE7ximg3I` (main file `DWEduE6GfxYMlyxKPNJ8jA`)
Collection: `WDS_tokens` (`VariableCollectionId:490:8920`)

Out of scope: typography base vars (`base/text_*`, `base/lineheight`, `base/logo`, `base/wds_version`).

## Pre-flatten counts

| Group | Count |
| --- | --- |
| base/color/* | 291 |
| base/size/* | 30 |
| system/color/* | 247 (61 direct, 185 →base, 1 dangling) |
| system/fixed_color/* | 162 (all →base) |
| system/size/* | 66 (all →base) |

## Actions taken

1. `outputs/raw/figma.variables.local.2026-06-10.pre-flatten.json` — REST snapshot saved.
2. `tools/flatten-base-to-system.mjs --execute` — 826 mode-values re-pointed, 316 base vars deleted.
3. `outputs/raw/figma.variables.local.2026-06-10.post-flatten.json` — post-flatten snapshot saved.

## Post-flatten verification (REST)

- system/* count: 520 → 520 (0 deleted, 0 added) ✓
- alias→base remaining: 0 ✓
- direct values: 470 ✓
- dangling: 1 (brand-green, see below)
- base/color+size in WDS: `deletedButReferenced: true` (Figma ghost state, externally referenced)

## Catalog validation

```
tokens: 408, errorCount: 0, colorBaseCount: 0, colorNonHexCount: 0, aliasOfNonNullCount: 0
```

Regression tests: pass.

## brand-green exception

`system/color/roles/brand-green` (`VariableID:1258:60662`):
- `deletedButReferenced: true` — deleted in Figma UI already
- Design node refs in this file: 0 (46-page full scan)
- Variable→variable refs: 0
- Alias targets (`VariableID:7602:99996`, `VariableID:7606:100151`) already missing
- Kept in `alias:dangling` whitelist — external library consumer prevents cleanup from this file

## Canonical sync status

Pending — run Phase E when ready:
```bash
cp outputs/current/color.json ../../chord-design-system/tokens/color.json
cp outputs/current/size.json ../../chord-design-system/tokens/size.json
```
