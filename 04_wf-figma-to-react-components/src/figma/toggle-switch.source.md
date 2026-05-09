---
component: ToggleSwitch
figma_name: "Toggle Switch"
node_id: "7927:149092"
component_key: "707fb6a0b475122bef17b30346b9dfe6f211c50b"
source_read: "2026-05-05"
status: implemented
---

# ToggleSwitch Source Note

## Description

설정값을 ON/OFF로 즉시 변경하는 플랫폼별 스위치 컨트롤.

## Figma Contract

- Axes: `Mode`, `OS`, `Size`, `Status`
- `Mode`: `Default`, `Fixed`
- `OS`: `iOS`, `AOS`
- `Size`: `Medium`, `Small`
- `Status`: `Default`, `Enabled`, `Disabled`
- Representative baseline: `Mode=Default, OS=iOS, Size=Medium, Status=Default` (`7927:149568`)
- Layout baseline: `src/figma/baselines/toggle-switch-default.png` (`52x32`, scale 1)
- Visual baseline: `src/figma/baselines/toggle-switch-default@3x.png` (`156x96`, scale 3)

## MCP Reads

- Console MCP `figma_get_component(7927:149092, enrich=true)`
- Console MCP `figma_get_component_for_development(7927:149568)`
- Console MCP `figma_get_component_image(7927:149568, scale=1)`
- Console MCP `figma_get_component_image(7927:149568, scale=3)`

## Props Mapping

- `Mode` -> `mode: "default" | "fixed"`
- `OS` -> `platform: "ios" | "aos"`
- `Size` -> `size: "medium" | "small"`
- `Status` -> `status: "default" | "enabled" | "disabled"`
- Internal props: `checked`, `disabled`, `onChange`, hidden from Storybook Controls.

## Layout

- iOS medium: track `52x32`, thumb `28x28`, padding `2px`
- iOS small: track `32x20`, thumb `16x16`, padding `2px`
- AOS medium: track `52x32`, thumb `24x24`, padding `4px`
- AOS small: track `34x20`, thumb `14x14`, padding `3px`
- Thumb position: Default/Disabled left, Enabled right

## Token Mapping

- Track off default: `--cds-system-color-surface-gray-200`
- Track off fixed: `--cds-system-fixed-color-surface-gray-200`
- Track on default: `--cds-system-color-status-active-primary`
- Track on fixed: `--cds-system-fixed-color-status-active-primary`
- Track disabled default: `--cds-system-color-status-inactive-gray`
- Track disabled fixed: `--cds-system-fixed-color-status-inactive-gray`
- Thumb fill: `--cds-system-fixed-color-surface-default-reverse`
- Thumb disabled: `--cds-system-fixed-color-surface-default-reverse-300a`

## Font Mapping Notes

No text node in the atom.

## Asset Status

No external asset. Track and thumb are primitive shapes in Figma.

## Known Gaps

- `OS=iOS, Size=Small, Mode=Fixed, Status=Enabled` has a special `32x18.5` track geometry in source data. This first implementation keeps the shared iOS small `32x20` geometry and should be revisited if that exact variant becomes a visual baseline.

## Token vs Rendered Pixel Notes

| Field | Value |
| --- | --- |
| token id | `system/fixed_color/surface/default-reverse-300a` |
| token value | `#FFFFFF4D` |
| Figma rendered value | disabled thumb: 30% reverse surface |
| actual value | `--cds-system-fixed-color-surface-default-reverse-300a` with no extra opacity |
| decision | `token-mapping` |
| follow-up owner | `none` |

Note: Figma API may expose alpha-token paints as RGB color plus paint opacity.
Do not apply both the alpha token and an extra CSS opacity, because that creates
double alpha.

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
