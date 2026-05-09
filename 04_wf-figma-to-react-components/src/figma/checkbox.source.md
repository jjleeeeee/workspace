---
component: Checkbox
figma_name: "[V2] Checkbox"
node_id: "60365:40276"
component_key: "80eebb7d094726a1a9e864931f4347d76008ca25"
source_read: "2026-05-05"
status: implemented
---

# Checkbox Source Note

## Description

단일 확인 또는 복수 항목 선택에 사용하는 선택 컨트롤.

## Figma Contract

- Axes: `Mode`, `Type`, `Status`
- `Mode`: `Default`, `Fixed`
- `Type`: `Circle`, `Square`
- `Status`: `Default`, `Enabled`, `Disabled`
- Representative baseline: `Mode=Default, Type=Circle, Status=Default` (`60365:40279`)
- Layout baseline: `src/figma/baselines/checkbox-default.png` (`24x24`, scale 1)
- Visual baseline: `src/figma/baselines/checkbox-default@3x.png` (`72x72`, scale 3)

## MCP Reads

- Console MCP `figma_get_component(60365:40276, enrich=true)`
- Console MCP `figma_get_component_for_development(60365:40279)`
- Console MCP `figma_get_component_image(60365:40279, scale=1)`
- Console MCP `figma_get_component_image(60365:40279, scale=3)`

## Props Mapping

- `Mode` -> `mode: "default" | "fixed"`
- `Type` -> `checkboxType: "circle" | "square"`
- `Status` -> `status: "default" | "enabled" | "disabled"`
- Internal props: `checked`, `disabled`, `onChange`, hidden from Storybook Controls.

## Layout

- Component: `24x24`
- Box: `22x22`, centered with `1px` inset
- Icon area: `16x16`
- Label gap when used with text: `6px`

## Token Mapping

- Default stroke: `--cds-system-color-outline-default-200a`
- Fixed stroke: `--cds-system-fixed-color-outline-default-200a`
- Enabled bg default: `--cds-system-color-roles-primary`
- Enabled bg fixed: `--cds-system-fixed-color-roles-primary`
- Disabled bg default: `--cds-system-color-surface-default-reverse-100a`
- Disabled bg fixed: `--cds-system-fixed-color-surface-default-reverse-100a`
- Enabled icon: `--cds-system-color-icon-default-reverse`
- Disabled icon: `--cds-system-color-icon-200a` / `--cds-system-fixed-color-icon-200a`

## Font Mapping Notes

No text node in the atom.

## Asset Status

- `check_icon` is asset-backed in Figma (`24/em/ic_check_medium` inside `icon_area`).
- Current registry status: `mapped SVG asset`.
- Registry entry: `ChordIcon name="checkMedium"`, source `24/em/ic_check_medium`, node `10177:64494`, key `9687bb4a90ddfd294a388cf5d54e353b3f85b107`.
- Exported file: `src/assets/icons/ic_check_medium.svg`.

## Known Gaps

- None for the check glyph. Future work can still compare the exact icon_area wrapper sizing against additional Checkbox variants.

## Alpha Token Notes

- N/A for legacy backfill (2026-05-08): explicit evidence for this section was not recorded as a dedicated section in the existing source note.
- Re-read Figma and replace this note with concrete evidence before changing this component contract.

## Text Behavior Notes

- N/A for legacy backfill (2026-05-08): explicit evidence for this section was not recorded as a dedicated section in the existing source note.
- Re-read Figma and replace this note with concrete evidence before changing this component contract.

## Sizing Interpretation Notes

- N/A for legacy backfill (2026-05-08): explicit evidence for this section was not recorded as a dedicated section in the existing source note.
- Re-read Figma and replace this note with concrete evidence before changing this component contract.

## Nested Atom Mapping

- N/A for legacy backfill (2026-05-08): explicit evidence for this section was not recorded as a dedicated section in the existing source note.
- Re-read Figma and replace this note with concrete evidence before changing this component contract.

## Nested Module Inventory

- N/A for legacy backfill (2026-05-08): explicit evidence for this section was not recorded as a dedicated section in the existing source note.
- Re-read Figma and replace this note with concrete evidence before changing this component contract.

## Token vs Rendered Pixel Notes

- N/A for legacy backfill (2026-05-08): explicit evidence for this section was not recorded as a dedicated section in the existing source note.
- Re-read Figma and replace this note with concrete evidence before changing this component contract.
