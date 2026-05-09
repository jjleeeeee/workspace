---
status: implemented
---

# Scrim Overlay Source Note

## Figma Source

- Component: `Scrim_Overlay`
- Node ID: `10482:75325`
- Component key: `82556da89c0795003b5b07261ac8dc65fb09da1c`
- MCP reads:
  - Console MCP `figma_get_design_system_kit` on `2026-05-05`
  - Console MCP `figma_get_component(nodeId=10482:75325, enrich=true)`
  - Framelink `get_figma_data(fileKey=DWEduE6GfxYMlyxKPNJ8jA, nodeId=10482:75325, depth=2)`
  - Console MCP `figma_get_component_image` for `10482:75325` at `1x` and `3x`

## Description

배경 콘텐츠 위에 반투명 레이어를 덮어 전면 UI와 배경 사이의 위계를 만드는 오버레이.

## Variant Axes

- No Figma variant axes.

## Prop Mapping

- No Figma-facing controls.
- `fullCover` is implementation-only and hidden from Storybook controls.

## Visual Contract

- Default baseline: `393x852`
- Fill token: `system/fixed_color/surface/default-400a`
- Token value already includes alpha. Do not add extra CSS opacity.

## Known Gaps

- The baseline story uses the Figma component size. Product usage should usually use `fullCover` or consumer layout sizing.

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
