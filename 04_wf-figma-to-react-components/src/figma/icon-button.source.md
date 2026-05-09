---
status: implemented
---

# Icon Button Source Note

## Figma Source

- Component set: `Icon Button`
- Node ID: `54093:38777`
- Component set key: `b60ecb5e664ce4e19bd9b11dd521d9b710d711df`
- Default visual baseline variant: `54093:38784`
- MCP reads:
  - Console MCP `figma_get_design_system_kit` on `2026-05-05`
  - Console MCP `figma_get_component(nodeId=54093:38777, enrich=true)`
  - Framelink `get_figma_data(fileKey=DWEduE6GfxYMlyxKPNJ8jA, nodeId=54093:38778, depth=4)`
  - Console MCP `figma_get_component_image` for `54093:38784` at `1x` and `3x`

## Description

아이콘만으로 주요 행동을 실행하는 정사각 버튼 컴포넌트.

## Variant Axes

- `Mode`: `Default`, `Fixed`
- `Type`: `Filled`, `Outlined`
- `Size`: `XLarge(52)`, `Medium(40)`, `Small(36)`, `XXSmall(24)`
- `State`: `Default`, `Hover`, `Disabled`
- `Radius`: `on`, `off`
- `Button Color`: `Default`, `Black`

## Prop Mapping

- `Mode` -> `mode: "default" | "fixed"`
- `Type` -> `buttonType: "filled" | "outlined"`
- `Size` -> `size: "xlarge" | "medium" | "small" | "xxsmall"`
- `State` -> `status: "default" | "hover" | "disabled"`
- `Radius` -> `radius: "on" | "off"`
- `Button Color` -> `buttonColor: "default" | "black"`

## Visual Contract

- Default baseline: `52x52`, filled default color, radius off.
- Size tokens:
  - XLarge: `system/size/button-height/xlarge` = `52px`
  - Medium: `system/size/button-height/medium` = `40px`
  - Small: `system/size/button-height/small` = `36px`
  - XXSmall: `system/size/button-height/xxsmall` = `24px`
- Radius off uses `system/size/radius/box/100`; radius on uses pill/circle radius.
- Filled default token: `system/color/button/default`
- Filled fixed token: `system/fixed_color/button/default`
- Filled black default token: `system/color/button/black`
- Filled black fixed token: `system/fixed_color/button/white`
- Disabled token: `system/color/button/disabled` or `system/fixed_color/button/disabled`
- Icon-on-filled token: `system/color/icon/default-reverse` or `system/fixed_color/icon/default-reverse`

## Asset Mapping

- Figma uses nested `icon_area` with the sample icon `24/em/ic_send_medium`.
- The current React component exposes `icon?: ReactNode` for caller-provided DS icon overrides.
- Default icon maps to `ChordIcon name="sendMedium"` from Figma node `15108:5842`, exported as `src/assets/icons/ic_send_medium.svg`.
- `icon_area` is treated as the sizing wrapper; the actual glyph comes from the icon registry.

## Known Gaps

- Hover overlay is represented through token background layering, but interaction-only Figma overlays should be reviewed visually per state.

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

## Token vs Rendered Pixel Notes

- N/A for legacy backfill (2026-05-08): explicit evidence for this section was not recorded as a dedicated section in the existing source note.
- Re-read Figma and replace this note with concrete evidence before changing this component contract.
