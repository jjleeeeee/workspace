---
status: implemented
---

# Tooltip Source Note

## Figma Source

- Component set: `Tooltip`
- Node ID: `7891:6903`
- Component set key: `51e3f2d3c3ea2ece4c8b084477cee852a10eb2da`
- Default visual baseline variant: `46332:10856`
- MCP reads:
  - Console MCP `figma_get_design_system_kit` on `2026-05-05`
  - Framelink `get_figma_data(fileKey=DWEduE6GfxYMlyxKPNJ8jA, nodeId=7891:6903, depth=2)`
  - Framelink `get_figma_data(fileKey=DWEduE6GfxYMlyxKPNJ8jA, nodeId=46332:10856, depth=5)`
  - Console MCP `figma_get_component_image` for `46332:10856` at `1x` and `3x`

## Description

특정 객체와 연결해 짧은 안내나 강조 내용을 표시하는 컴포넌트.

## Variant Axes

- `Mode`: `Default`, `Fixed`
- `Size`: `Large`, `Medium`
- `Color`: `Black`, `White_fixed`, `Tint`
- `Position`: `Bottom Center`, `Bottom Left`, `Bottom Right`, `Left Center`, `Right Center`, `Top Center`, `Top Left`, `Top Right`
- `Button - Close`: boolean
- `Label`: text

## Prop Mapping

- `Mode` -> `mode: "default" | "fixed"`
- `Size` -> `size: "large" | "medium"`
- `Color` -> `color: "black" | "white-fixed" | "tint"`
- `Position` -> `position: "bottom-center" | "bottom-left" | "bottom-right" | "left-center" | "right-center" | "top-center" | "top-left" | "top-right"`
- `Button - Close` -> `buttonClose: boolean`
- `Label` -> `label: string`

## Visual Contract

- Default baseline: `225x41` sample rendered result for the default label, close button, and bottom-center caret.
- Large content padding: `8px 12px`, gap `4px`, radius `8px`
- Medium content padding: `6px 8px`
- Caret item: `14x7`
- Black fill token: `system/color/surface/default-reverse-600a-unequal`
- White fixed fill token: `system/fixed_color/surface/default-reverse`
- Tint token: `system/color/roles/accent-blue` or fixed equivalents depending on mode/position
- Large label: `body-xs/system-500`
- Medium label: `caption-s/system-500`

## Font Mapping Notes

| Field | Value |
| --- | --- |
| Figma fontFamily | `WeGothicSans` |
| font family type | `system-alias` |
| availability | `available` |
| system alias meaning | `macOS SF / Apple SD Gothic style rendering` |
| CSS font-family order | `"WeGothicSans", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", var(--cds-typography-default-font-family-body, Pretendard, ui-sans-serif, system-ui, sans-serif)` |
| decision | `use-system-alias` |
| visual diff risk | `font-rendering` |

## Sizing Interpretation Notes

| Field | Value |
| --- | --- |
| Figma layout sizing | `hug` |
| sample rendered size | `225x41` |
| text wrapping rule | `wraps, max 8 lines` |
| min/max constraints | `max content width 240px` |
| padding and gap source | `Figma layout: Large 8px 12px, Medium 6px 8px, gap 4px` |
| asset frame contribution | `close frame 16x16, icon visual 12x12, internal padding 2px; caret 14x7` |
| CSS sizing decision | `hug-content + constrained-max` |
| forbidden interpretation | `sample-size-is-not-min-width` |

- The `225x41` default baseline is an observed sample result, not a CSS `min-width`.
- The bubble should resize with `Label` content until the `240px` max content width is reached.
- When `Button - Close=false`, the label can use the close button space within the same max width constraint.

## Asset Mapping

- Close button uses nested DS icon `24/em/ic_close_medium`, mapped as `ChordIcon name="closeMedium"` from Figma node `10177:64523`.
- Caret is a nested DS `element / caret item`.
- Current component keeps the caret as CSS geometry until the nested caret asset is exported/mapped.

## Known Gaps

- White fixed shadow is confirmed exact: `box-shadow: 0 6px 28px #0000001a` matches Figma spec (DROP_SHADOW, color #0000001A, offset y=6, blur-radius=28). Source note previously said "approximated" — that claim is stale and has been corrected.
- Caret item remains a replacement area.
- Position variants are represented structurally; only `Bottom Center` is in this batch's visual baseline.
- Tint/fixed position token: confirmed via live Figma read (2026-05-09). `[data-mode="fixed"][data-color="tint"]` uses `system/fixed_color/surface/primary-100` (`--cds-system-fixed-color-surface-primary-100`) for all positions except Bottom Center. `[data-position="bottom-center"]` overrides to `system/fixed_color/roles/secondary-blue`. Both rules are implemented and tested.

## Alpha Token Notes

- N/A for legacy backfill (2026-05-08): explicit evidence for this section was not recorded as a dedicated section in the existing source note.
- Re-read Figma and replace this note with concrete evidence before changing this component contract.

## Text Behavior Notes

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
