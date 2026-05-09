---
status: implemented
---

# CircularProgressIndicator Source Note

## Figma Source

- Component set: `Circular_Progress_Indicator`
- Node ID: `9003:21751`
- Component set key: `52969b5595e5042dda34b6a45dbb86939887af5c`
- MCP reads:
  - Console MCP `figma_get_design_system_kit` on `2026-05-05`
  - Framelink `get_figma_data(fileKey=DWEduE6GfxYMlyxKPNJ8jA, nodeId=9003:21751, depth=2)`
  - Framelink `get_figma_data(fileKey=DWEduE6GfxYMlyxKPNJ8jA, nodeId=8998:21680, depth=4)`
  - Console MCP `figma_get_component_image` for default variant `8998:21680` at `1x` and `3x`
  - Framelink `download_figma_images` for nested icon area `81407:905664`

## Description

컴포넌트 내부 처리 중 상태를 원형 진행 표시로 보여주는 인디케이터.

## Variant Axes

- `Mode`: `Default`, `Fixed`
- Boolean component property: `Button`, default `true`

## Prop Mapping

- `Mode` -> `mode: "default" | "fixed"`
- `Button` -> `button: boolean`
- `buttonContent` is an internal escape hatch for the nested cancel button asset and is hidden from Storybook Controls.

## Visual Contract

- Component: `56x56`
- Background: `56x56`, radius `100px`, fill `system/fixed_color/surface/black-600a-same`
- Track: `44x44`, absolute `x=6`, `y=6`, `2px` stroke, token `system/fixed_color/surface/white-100a-same`
- Progress value: `41x44`, absolute `x=9`, `y=6`, `2px` stroke, token `system/fixed_color/outline/default`
- Cancel button asset: `16x16`, nested DS component `공통요소 / 인디케이터 / btn_circle_indicator_cancel`

## Asset Policy

- The cancel button is an asset-backed nested DS component.
- Current implementation renders the exported nested icon area asset when `Button=true`.
- Replacement/maintenance target:
  - Figma nested component: `공통요소 / 인디케이터 / btn_circle_indicator_cancel`
  - Code area: `CircularProgressIndicator` `buttonContent` slot
  - Expected asset size: `16x16`
  - Expected icon vector area: `10x10`, `1.5px` stroke
  - Expected color token: `system/fixed_color/icon/default`
  - Exported file: `src/figma/assets/circular-progress-cancel-icon-area.svg`

## Known Gaps

- The asset is currently an exported SVG from the nested icon area, not a package-level shared icon registry entry.
- If a shared DS asset registry is added later, replace the local SVG URL without changing the public Figma-facing props.

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
