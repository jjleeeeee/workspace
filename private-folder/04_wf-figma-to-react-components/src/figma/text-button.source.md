---
type: FigmaSourceNote
status: partial-ready
updated: 2026-05-09
component: TextButton
figma_file: DWEduE6GfxYMlyxKPNJ8jA
node_id: "52753:39618"
component_set_key: "70d2a20bcdfe3ac7a3c3190410d9a255d8783e1d"
---

# TextButton Source Note

## Source Boundary

- `index.md` was used only as an address registry for `nodeId` and `component_set_key`.
- Variant detail markdown files were not used.
- Component implementation should be based on Framelink/Figma MCP and Console MCP reads.

## MCP Reads

Framelink/Figma MCP:

- `get_design_context(fileKey="DWEduE6GfxYMlyxKPNJ8jA", nodeId="52753:39618")`
  - Result: component set was too large, so only sparse metadata was returned.
- `get_context_for_code_connect(fileKey="DWEduE6GfxYMlyxKPNJ8jA", nodeId="52753:39618")`
  - Result: component property definitions and variant axes.
- `get_design_context(fileKey="DWEduE6GfxYMlyxKPNJ8jA", nodeId="52753:39957")`
  - Representative: `Mode=Default, Type=Filled, Size=Medium(40), Button Color=Default, Status=Default, Radius=off`.
- `get_design_context(fileKey="DWEduE6GfxYMlyxKPNJ8jA", nodeId="52753:39979")`
  - Representative: `Mode=Default, Type=Filled, Size=Medium(40), Button Color=Default, Status=Loading, Radius=off`.
- `get_design_context(fileKey="DWEduE6GfxYMlyxKPNJ8jA", nodeId="52753:44303")`
  - Representative: `Mode=Default, Type=Ghost, Size=Medium(40), Button Color=Default, Status=Default, Radius=off`.
- `get_screenshot(fileKey="DWEduE6GfxYMlyxKPNJ8jA", nodeId="52753:39957", contentsOnly=true)`
  - Returned screenshot size: `63x40`.
- `get_design_context(fileKey="DWEduE6GfxYMlyxKPNJ8jA", nodeId="52753:39957")` re-read on 2026-05-09
  - Confirmed 576 variants total. All typography styles are WeGothicSans system-alias. Leading/trailing: `source_node="Options"` (consumer-provided slot). Loading indicator: `source_node="Options"`. `inner_gap: default=box/50 (4px), expanded=box/75 (6px)`. Font-family bug (missing WeGothicSans prefix) confirmed and fixed.

Console MCP:

- `figma_get_component(nodeId="52753:39618", format="metadata", enrich=true)`
  - Result: reliable component description, variant axes, option props, token mapping, and layout rules from Desktop Bridge.
- `figma_get_component_image(nodeId="52753:39957", format="png", scale=3)`
  - Result: visual reference URL for the default medium filled variant.
- `figma_get_component_image(nodeId="52753:39957", format="png", scale=1)`
  - Layout baseline: `src/figma/baselines/text-button-default.png` (`63x40`, scale 1).
- `figma_get_component_image(nodeId="52753:39957", format="png", scale=3)`
  - Visual baseline: `src/figma/baselines/text-button-default@3x.png` (`189x120`, scale 3).

## Description

사용자가 선택이나 행동을 실행할 수 있게 하는 텍스트 중심 버튼 컴포넌트.

## Variant Axes

| Figma Axis | Code Prop | Options |
| --- | --- | --- |
| Mode | `mode` | `default`, `fixed` |
| Type | `buttonType` | `filled`, `outlinedColor`, `outlinedGray`, `ghost` |
| Size | `size` | `xlarge`, `large`, `medium`, `small`, `xsmall`, `xxsmall` |
| Button Color | `buttonColor` | `default`, `black` |
| Status | `status` | `default`, `hover`, `loading`, `disabled` |
| Radius | `radius` | `off`, `on` |

## Component Properties

| Figma Property | Code Prop | Default | Note |
| --- | --- | --- | --- |
| Option-Leading | `optionLeading` | `false` | Shows leading content before the label |
| Option-Trailing | `optionTrailing` | `false` | Shows trailing content after the label |
| Button Text | `children` | `Text` | Button label |
| Trailing-Icon | `trailingIcon` | `true` | Applies only when trailing content is enabled |
| Trailing-Text | `trailingText` | `false` | Applies only when trailing content is enabled |

## Constraints

- `filled` and `outlinedColor` support both `default` and `black` button colors.
- `outlinedGray` and `ghost` support only `default` button color.
- Invalid black color combinations must be normalized to `default`.
- `status="loading"` prevents duplicate requests and replaces normal content with a loading indication.
- `status="disabled"` must not trigger actions.
- Hover and press use overlay layers without replacing base fill, stroke, or label colors.

## Token Mapping

| Role | Token |
| --- | --- |
| xlarge height | `system/size/button-height/xlarge` |
| large height | `system/size/button-height/large` |
| medium height | `system/size/button-height/medium` |
| small height | `system/size/button-height/small` |
| xsmall height | `system/size/button-height/xsmall` |
| xxsmall height | `system/size/button-height/xxsmall` |
| filled default bg | `system/color/button/default` |
| filled fixed default bg | `system/fixed_color/button/default` |
| filled black bg | `system/color/button/black` |
| filled fixed black bg | `system/fixed_color/button/white` |
| outlined gray stroke | `system/color/button/outlined_gray` |
| ghost bg | `system/color/button/ghost` |
| disabled bg/stroke | `system/color/button/disabled` |
| default text | `system/color/text/default` |
| reverse text | `system/color/text/default-reverse` |
| disabled text | `system/color/text/200a` |
| radius off | `system/size/radius/box/100`, 8px |
| radius on | `100`, pill |

## Layout Rules

- Width is hug by default; parent may force fill width.
- Content group must be centered as a whole, not label-only.
- Heights:
  - `xlarge`: 52px
  - `large`: 44px
  - `medium`: 40px
  - `small`: 36px
  - `xsmall`: 32px
  - `xxsmall`: 24px
- Horizontal padding:
  - `xlarge`: `system/size/padding/box/300`
  - `large`: `system/size/padding/box/250`
  - `medium`: `system/size/padding/box/200`
  - `small`: `system/size/padding/box/200`
  - `xsmall`: `system/size/padding/box/150`
  - `xxsmall`: `system/size/padding/box/100`
- `radius="off"` is 8px.
- `radius="on"` is pill.

## Implementation Notes

- Public prop name uses `buttonType`, not native `type`, to avoid conflict with `<button type>`.
- Native button `type` should default to `"button"` and be hidden from Storybook Controls.
- Storybook Controls must expose only Figma-facing props and label text.
- Leading/trailing icons are slot-only gaps in v1.
- Asset classification: `unknown` until the Figma nested icon source names are read and mapped.
- Unresolved leading/trailing defaults render slot-only markers with `data-asset-classification="unknown"`, not `ChordIcon` registry entries and not visible CSS drawings.
- Filled representative node `52753:39957` has `strokes: []`. CSS must not use a real border for filled variants because browser auto width includes border pixels and creates `65x40` instead of the Figma `63x40`.
- Figma strokes are `strokeAlign: INSIDE`; CSS stroke-like visuals should use inset rendering, not layout-affecting border width.

## Token vs Rendered Pixel Notes

| Field | Value |
| --- | --- |
| token id | `system/size/padding/box/200`, `system/size/button-height/medium` |
| token value | `16px horizontal padding`, `40px height` |
| Figma rendered value | `63x40`, filled representative has `strokes: []` |
| actual value | was `65x40` with CSS border, now `63x40` with inset stroke model |
| decision | `component-css` |
| follow-up owner | `none` |

## Known Gaps

- Loading animation uses CSS dots in v1. Figma notes mention loading indication, but a long-lived production Lottie asset was not provided.
- Leading/trailing icon production assets need Figma source names and `ChordIcon` registry entries before shipping. Figma confirmed `source_node="Options"` — consumer must supply the actual icon; slot-only approach is correct.
- If no asset source is found, the trailing icon prop remains slot-only or should be marked as unsupported rather than silently using CSS drawing or a similar-looking registry icon.

## Alpha Token Notes

- Hover/press use overlay `--cds-system-color-button-hover` (`#0000000a`) layered via `linear-gradient` on top of the base fill.
- Disabled state uses `--cds-system-color-button-disabled` for background/stroke; no separate CSS `opacity` added to the container.
- No explicit alpha tokens beyond the hover overlay were identified in the representative reads.

## Font Mapping Notes

| Field | Value |
| --- | --- |
| Figma fontFamily | `WeGothicSans` (multiple size scales: body-lg-700, body-m-700, body-s-700, body-xs-700, caption-s-700, caption-m-700, body-s-500) |
| font family type | system-alias |
| availability | available on target macOS as DS system alias |
| CSS font-family order | `"WeGothicSans", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", var(--cds-typography-default-font-family-body, Pretendard, ui-sans-serif, system-ui, sans-serif)` |
| decision | `use-system-alias` |
| visual diff risk | font-rendering |
| bug fix | WeGothicSans prefix was missing from CSS on initial implementation. Fixed 2026-05-09. |

## Text Behavior Notes

- Single-line label. No wrapping. `white-space: nowrap`, overflow `ellipsis`.
- Font size and line-height vary by `size` axis via CSS custom properties.
- Trailing text sub-label uses caption scale (`body-xs` or `text-75`, 12px / 14px).
- Content group is centered as a whole; label alone is not repositioned.

## Sizing Interpretation Notes

| Field | Value |
| --- | --- |
| Figma layout sizing | hug width, fixed height |
| sample rendered size | `63x40` (medium, filled, default label "Text") |
| text wrapping rule | single line, ellipsis, `white-space: nowrap` |
| min/max constraints | min width = button height (square); no max width set in Figma |
| inner gap | default (leading slot to label): `system/size/padding/box/50` (4px); expanded (label to trailing slot): `system/size/padding/box/75` (6px) |
| padding source | horizontal padding varies per size axis (box/300 → box/100) |
| CSS sizing decision | hug-content, height fixed via token, min-width = height |
| forbidden interpretation | `63px` is not a `min-width` |

## Nested Atom Mapping

- No DS atoms are rendered inline. The button renders its own label and optional CSS loading indicator.
- Leading and trailing icon slots are consumer-provided (Figma: `source_node="Options"`). Null marker `nullMedium` is used when the slot is unresolved.

## Nested Module Inventory

| Nested role | Figma source | Coverage | Notes |
| --- | --- | --- | --- |
| Leading slot | `source_node="Options"` (consumer) | complete | `nullMedium` marker for unresolved; consumer provides actual icon |
| Trailing slot | `source_node="Options"` (consumer) | complete | Same pattern; trailing text sub-label handled inline |
| Loading indicator | `source_node="Options"` (consumer) | partial | CSS dot animation approximation; production Lottie not available |
