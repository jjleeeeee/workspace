---
status: implemented
---

# PaginationDot Source Note

## Figma Source

- Component set: `Pagination_Dot(v2)`
- Node ID: `62324:12061`
- Component set key: `6dc90bf874beb759995aee563475cf96c3aa9a58`
- MCP reads:
  - Console MCP `figma_get_design_system_kit` on `2026-05-05`
  - Framelink `get_figma_data(fileKey=DWEduE6GfxYMlyxKPNJ8jA, nodeId=62324:12061, depth=2)`
  - Console MCP `figma_get_component_image` for default variant `62370:9703` at `1x` and `3x`

## Description

정확한 페이지 번호보다 현재 위치와 콘텐츠 흐름을 간단히 보여줄 때 사용하는 점 형태 페이지네이션.

## Variant Axes

- `Mode`: `Default`, `Fixed`
- `Dots`: `2`, `3`, `4`, `5`, `6+`
- `Selection`: `1`, `2`, `3`, `4`, `5`, `6`

## Prop Mapping

- `Mode` -> `mode: "default" | "fixed"`
- `Dots` -> `dots: "2" | "3" | "4" | "5" | "6+"`
- `Selection` -> `selection: 1 | 2 | 3 | 4 | 5 | 6`

## Visual Contract

- Component: `120x32`
- Layout: horizontal, center, `6px` gap, `12px` vertical padding
- Normal dot frame: `8x8`; normal dot ellipse: `6x6`
- Condensed `6+` dot ellipses: `6x6`, `4x4`, `2x2`
- Default selected fill: `system/color/icon/default`
- Fixed selected fill: `system/fixed_color/icon/default`
- Fixed selected stroke: `system/fixed_color/outline/gray-300`
- Unselected dots use alpha tokens directly without extra CSS opacity.

## Known Gaps

- Figma extraction reports two fixed-mode unselected token families for some mid-position variants. The first implementation maps by selected/unselected state and records the split as a follow-up if visual diff exposes it.
- Some `Dots=6+` edge variants have numeric right padding (`8px` or `9px`) without a bound token.

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
