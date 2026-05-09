---
status: implemented
---

# SelectNumberBox Source Note

## Figma Source

- Component set: `Select_Number_Box`
- Node ID: `12436:362`
- Component set key: `9d3d023e0d5060cdbcb54f40ff6c1df7a0c333a5`
- MCP reads:
  - Console MCP `figma_get_design_system_kit` on `2026-05-05`
  - Framelink `get_figma_data(fileKey=DWEduE6GfxYMlyxKPNJ8jA, nodeId=12436:362, depth=2)`
  - Framelink reads for representative variants `12436:394` and `15538:847` at `depth=4`
  - Console MCP `figma_get_component_image` for default variant `12436:394` at `1x` and `3x`

## Description

선택된 요소의 순서나 99+ 초과 상태를 작은 원형 숫자로 표시하는 상태 표시 컴포넌트.

## Variant Axes

- `Mode`: `Default`, `Fixed`
- `State`: `Selected`, `Selected-99+`, `Unselected`

## Prop Mapping

- `Mode` -> `mode: "default" | "fixed"`
- `State` -> `state: "selected" | "selected-99-plus" | "unselected"`
- `value` -> selected order label. Values over `99` normalize to `99+`.

## Visual Contract

- Component: `24x24`
- Marker: `22x22`, radius `100px`
- Selected fill: `system/fixed_color/roles/accent-primary` for default mode, `system/fixed_color/status/active-primary` for fixed mode
- Selected text: `WeGothicSans`, `700`, `12/16` for `Selected`; `10/13` for `Selected-99+`
- Unselected fill: `system/fixed_color/surface/default-200a`
- Unselected stroke: `1.5px`, default uses `system/fixed_color/outline/default-300a`, fixed uses `system/fixed_color/icon/300a`

## Token vs Rendered Pixel Notes

- Alpha tokens such as `default-200a`, `default-300a`, and `icon/300a` are used directly without extra CSS opacity.

## Known Gaps

- The raw Figma component set name includes a control character before `Select_Number_Box`; code uses the cleaned name.

## Alpha Token Notes

- N/A for legacy backfill (2026-05-08): explicit evidence for this section was not recorded as a dedicated section in the existing source note.
- Re-read Figma and replace this note with concrete evidence before changing this component contract.

## Font Mapping Notes

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
