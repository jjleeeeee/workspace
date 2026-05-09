---
status: implemented
---

# Scrollbar Source Note

## Figma Source

- Component set: `Scrollbar`
- Node ID: `27782:8837`
- Component set key: `ec2d17107a68bb443f80245ab791fb69380f0a50`
- MCP reads:
  - Console MCP `figma_get_design_system_kit` on `2026-05-05`
  - Framelink `get_figma_data(fileKey=DWEduE6GfxYMlyxKPNJ8jA, nodeId=27782:8837, depth=2)`
  - Console MCP `figma_get_component_image` for default variant `27782:8384` at `1x` and `3x`

## Description

스크롤 가능한 콘텐츠의 현재 위치와 이동 가능성을 보여주는 스크롤 컨트롤.

## Variant Axes

- `Mode`: `Default`, `Fixed - White`, `Fixed - Black`

## Prop Mapping

- `Mode` -> `mode: "default" | "fixed-white" | "fixed-black"`

## Visual Contract

- Component: `10x100`
- Container padding: `2px` left/right, `4px` top/bottom
- Thumb: `6x60`, radius `3px`
- Default thumb token: `system/color/surface/default-reverse-200a`
- Fixed white thumb token: `system/fixed_color/surface/default-reverse-200a`
- Fixed black thumb token: `system/fixed_color/surface/default-200a`

## Implementation Notes

- This is a DS atom, not a native browser scrollbar skin.
- The component should be positioned by the consuming view and should not overlap readable content.

## Known Gaps

- Horizontal scrollbar is not represented in this Figma component set.

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
