---
component: Radio
figma_name: "[V2] Radio"
node_id: "59215:200965"
component_key: "a04bcc0355ca5db25efdc00cdfc68958db3f5976"
source_read: "2026-05-05"
status: implemented
---

# Radio Source Note

## Description

여러 항목 중 하나만 선택해야 하는 상황에서 사용하는 단일 선택 컨트롤.

## Figma Contract

- Axes: `Mode`, `Status`
- `Mode`: `Default`, `Fixed`
- `Status`: `Default`, `Enabled`, `Disabled`
- Representative baseline: `Mode=Default, Status=Default` (`59215:200966`)
- Layout baseline: `src/figma/baselines/radio-default.png` (`24x24`, scale 1)
- Visual baseline: `src/figma/baselines/radio-default@3x.png` (`72x72`, scale 3)

## MCP Reads

- Console MCP `figma_get_component(59215:200965, enrich=true)`
- Console MCP `figma_get_component_for_development(59215:200966)`
- Console MCP `figma_get_component_image(59215:200966, scale=1)`
- Console MCP `figma_get_component_image(59215:200966, scale=3)`

## Props Mapping

- `Mode` -> `mode: "default" | "fixed"`
- `Status` -> `status: "default" | "enabled" | "disabled"`
- Internal props: `checked`, `disabled`, `onChange`, hidden from Storybook Controls.

## Layout

- Component: `24x24`
- Outline diameter: `22px`, centered with `1px` inset
- Inner circle diameter: `8px`
- Label gap when used with text: `6px`

## Token Mapping

- Outline stroke default: `--cds-system-color-outline-default-200a`
- Outline stroke fixed: `--cds-system-fixed-color-outline-default-200a`
- Active primary default: `--cds-system-color-status-active-primary`
- Active primary fixed: `--cds-system-fixed-color-status-active-primary`
- Inner enabled default: `--cds-system-color-surface-default`
- Inner enabled fixed: `--cds-system-fixed-color-surface-default-reverse`
- Disabled background: `--cds-system-color-surface-default-reverse-100a` / `--cds-system-fixed-color-surface-default-reverse-100a`
- Disabled inner: `--cds-system-color-surface-default-reverse-200a` / `--cds-system-fixed-color-surface-default-reverse-200a`

## Font Mapping Notes

No text node in the atom.

## Asset Status

No external asset. Shape and inner circle are primitive ellipses in Figma.

## Known Gaps

- Group-level single-selection behavior belongs to a future RadioGroup, not this atom.

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
