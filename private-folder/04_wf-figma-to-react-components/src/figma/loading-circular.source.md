---
status: implemented
---

# LoadingCircular Source Note

## Figma Source

- Component set: `Loading_Circular`
- Node ID: `10384:29888`
- Component set key: `b24a5889bca4523ee97a36936574bf3abbee155c`
- MCP reads:
  - Console MCP `figma_get_design_system_kit` on `2026-05-05`
  - Framelink `get_figma_data(fileKey=DWEduE6GfxYMlyxKPNJ8jA, nodeId=10384:29888, depth=2)`
  - Console MCP `figma_get_component_image` for default variant `10384:29889` at `1x` and `3x`

## Description

Dot Loading을 사용할 수 없는 컴포넌트 내부 상황에서 사용하는 원형 로딩 컴포넌트.

## Variant Axes

- `Mode`: `Default`, `Fixed`

## Prop Mapping

- `Mode` -> `mode: "default" | "fixed"`
- `animated` is implementation-only and is not exposed in Storybook Controls.

## Visual Contract

- Component: `20x20`
- Track: `16x16` circle, `2px` stroke, positioned at `x=2`, `y=2`
- Active arc: Figma `line` image/vector, `5.47x5.47`, positioned near `x=12.22`, `y=2.31`
- Default track token: `system/color/outline/default-reverse-300a`
- Fixed track token: `system/fixed_color/divide/white-300a-same`
- Active arc token: `system/fixed_color/outline/default`

## Asset Policy

- `circular_loading_motion` is an asset-backed loading motion role.
- The extracted component geometry is available, but no Lottie JSON asset path or motion timing is exposed.
- The React implementation uses static SVG geometry plus optional CSS rotation; it is not a production replacement for a missing Lottie asset.

## Known Gaps

- Motion timing is not confirmed by Figma extraction.
- If product requires the exact loading animation, replace the CSS animation with the official Lottie asset.

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
