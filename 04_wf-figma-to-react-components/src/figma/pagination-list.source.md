---
status: implemented
---

# Pagination List Source Note

## Figma Source

- Component set: `Pagination_List(v2)`
- Node ID: `61753:7839`
- Component set key: `cf936b6328942bcd5428cadb0d709f3e471091c4`
- Default visual baseline variant: `61753:7838`
- MCP reads:
  - Console MCP `figma_get_design_system_kit` on `2026-05-05`
  - Framelink `get_figma_data(fileKey=DWEduE6GfxYMlyxKPNJ8jA, nodeId=61753:7839, depth=3)`
  - Console MCP `figma_get_component_image` for `61753:7838` at `1x` and `3x`

## Description

정확한 페이지 번호와 이전/다음 이동을 제공하는 숫자형 페이지네이션.

## Variant Axes

- `Mode`: `Default`, `Fixed`
- `Size`: `Large`, `Small`
- `Pages`: `2`, `3`, `4`, `5`, `6`, `7`, `8+`

## Prop Mapping

- `Mode` -> `mode: "default" | "fixed"`
- `Size` -> `size: "large" | "small"`
- `Pages` -> `pages: "2" | "3" | "4" | "5" | "6" | "7" | "8+"`
- `selectedPage` is an implementation prop because Figma selection is encoded in nested slot composition, not exposed as a top-level variant axis.

## Visual Contract

- Default baseline: `160x72`
- Large slot: `40x40`; small slot: `32x32`
- Vertical padding: `16px`
- Default pages `2`: Prev, `1`, `2`, Next.
- Selected page text: `body-xs/system-700`, token `system/color/text/default`
- Unselected page text: `body-xs/system-400`, token `system/color/text/400a`
- Disabled prev icon token: `system/color/icon/200a`
- Active next icon token: `system/color/icon/default`

## Asset Mapping

- Figma uses nested DS assets for `24/em/ic_arrow_left_medium`, `24/em/ic_arrow_right_medium`, and ellipsis state.
- Previous arrow maps to `ChordIcon name="arrowLeftMedium"` from Figma node `14227:2069`.
- Next arrow maps to `ChordIcon name="arrowRightMedium"` from Figma node `14227:2070`.
- Ellipsis remains a nested state/replacement area until the nested `Status=Ellipsis` slot component is implemented or exported.

## Known Gaps

- Ellipsis page model uses the observed `8+` structure, but only the default `Pages=2` variant is in visual baseline for this batch.

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
