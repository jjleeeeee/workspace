---
component: LinearProgressIndicator
figma_name: Linear_Progress_Indicator
node_id: "9003:21727"
component_key: "42d64503b19a20dd5a6f7ea05e3c61cc3e75e9b7"
source_read: "2026-05-05"
status: implemented
---

# LinearProgressIndicator Source Note

## Description

작업 진행 상태를 수평 막대로 표시하는 진행 인디케이터.

## Figma Contract

- Axes: `Mode`, `Rounded`, `Height`
- `Mode`: `Default`, `Fixed`
- `Rounded`: `OFF`, `ON`
- `Height`: `Default (2)`, `4`
- Constraint: `Rounded=ON` exists only with `Height=Default (2)`.
- Representative baseline: `Mode=Default, Rounded=OFF, Height=Default (2)` (`9003:21726`)
- Layout baseline: `src/figma/baselines/linear-progress-indicator-default.png` (`393x2`, scale 1)
- Visual baseline: `src/figma/baselines/linear-progress-indicator-default@3x.png` (`1179x6`, scale 3)

## MCP Reads

- Console MCP `figma_get_component(9003:21727, enrich=true)`
- Console MCP `figma_get_component_for_development(9003:21726)`
- Console MCP `figma_get_component_image(9003:21726, scale=1)`
- Console MCP `figma_get_component_image(9003:21726, scale=3)`

## Variant Nodes

- Default / OFF / Default (2): `9003:21726`
- Default / ON / Default (2): `9003:21774`
- Default / OFF / 4: `9006:24640`
- Fixed / OFF / Default (2): `26104:94219`
- Fixed / ON / Default (2): `26104:94217`
- Fixed / OFF / 4: `26104:94215`

## Props Mapping

- `Mode` -> `mode: "default" | "fixed"`
- `Rounded` -> `rounded: "off" | "on"`
- `Height` -> `indicatorHeight: "default" | "4"`
- Internal prop: `progress`, hidden from Storybook Controls.

## Layout

- Reference width: `393px`
- Default height: `2px`
- Height `4`: `4px`
- Default loaded segment sample: `75px` of `393px`
- Height `4` loaded segment sample: `173px`
- Rounded `ON`: radius `2px`, only for default height.

## Token Mapping

- Track default off: `--cds-system-color-surface-gray-75`
- Track default on: `--cds-system-color-surface-white-200a-same`
- Track fixed: `--cds-system-fixed-color-surface-white-200a-same`
- Progress default: `--cds-system-color-roles-primary`
- Progress fixed: `--cds-system-fixed-color-roles-primary`

## Font Mapping Notes

No text node.

## Asset Status

No external asset. Figma composition uses nested DS line components, implemented as local CSS track and progress segment.

## Known Gaps

- Nested `Segment Option` and `elements / Line` are not split into separate React components in this package because their only current consumer is this atom.

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
