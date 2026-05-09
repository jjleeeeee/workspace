---
component: Chips
figma_name: "[V2] Chips"
node_id: "59869:78921"
component_key: "6f1fa3aadc347f4c8c2f26405695b2415dbdcb95"
source_read: "2026-05-09"
status: implemented
---

# Chips Source Note

## Description

옵션, 필터, 탭성 선택지를 작은 단위로 보여주고 사용자가 하나 또는 여러 개를 선택하기 위해 사용하는 선택 컴포넌트.

## MCP Reads

- Console MCP `figma_get_component(59869:78921, format=metadata, enrich=true)` on 2026-05-08.
- Console MCP `figma_get_component_for_development(59869:78922)` default medium text/off.
- Console MCP `figma_get_component_for_development(59869:79090)` default small text/on.
- Console MCP `figma_get_component_for_development(67023:33412)` medium icon.
- Console MCP `figma_get_component_for_development(67023:28652)` small icon.
- Console MCP `figma_get_component_for_development(67023:33760)` medium image.
- Console MCP `figma_get_component_for_development(59869:79054)` filled selected.
- Console MCP `figma_get_component_for_development(59869:78966)` filled disabled.
- Official Figma MCP `get_design_context(59869:78922)` and `get_design_context(67023:33760)`.
- Console MCP `figma_get_component_image(59869:78922, scale=1/3)`.

## Figma Contract

- Axes: `Mode`, `Size`, `Type`, `State`, `Radius`
- `Mode`: `Default`, `Fixed`
- `Size`: `Small`, `Medium`
- `Type`: `Text`, `Icon`, `Image (Only Medium)`
- `State`: `Default`, `Filled_Selected`, `Outlined_Selected`, `Filled_Disabled`, `Outlined_Disabled`
- `Radius`: `ON`, `OFF`
- Boolean props: `Marquee`, `Badge`, `Badge_Number`
- Variant count: 100 (`120 theoretical - 20 Small/Image combinations`)
- Constraint: `Type=Image` is Medium only. Small supports Text and Icon only.

## Code Props Mapping

| Figma axis / prop | React prop | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `Mode` | `mode` | `"default" \| "fixed"` | `"default"` | Figma-facing |
| `Size` | `size` | `"small" \| "medium"` | `"small"` | Figma-facing |
| `Type` | `type` | `"text" \| "icon" \| "image"` | `"text"` | `image` normalizes to `text` when `size=small` |
| `State` | `state` | `"default" \| "filled-selected" \| "outlined-selected" \| "filled-disabled" \| "outlined-disabled"` | `"default"` | Figma-facing |
| `Radius` | `radius` | `"on" \| "off"` | `"on"` | Figma-facing |
| `Marquee` | `marquee` | `boolean` | `false` | Figma-facing, implemented as overflow mask |
| `Badge` | `badge` | `boolean` | `false` | Figma-facing, renders `BadgeDot` |
| `Badge_Number` | `badgeNumber` | `boolean` | `false` | Figma-facing, renders `BadgeNumber` |
| label text | `label` | `string` | — | runtime content |
| `Badge_Number Label` | `badgeNumberLabel` | `string \| number` | `3` | runtime content, hidden from Controls |
| Type icon swap | `icon` | `ReactNode` | `nullMedium` marker | runtime slot, hidden from Controls |
| Type image fill | `image` | `ReactNode` | Figma Img fixture | runtime slot, hidden from Controls |

## Layout

- Container: horizontal auto layout, center aligned, hug width, fixed height, max width `190px`.
- Height: Small `32px`, Medium `36px`.
- Default/Text/Icon padding: `12px` left and right (`system/size/padding/box/150`).
- Image padding: `6px` left (`system/size/padding/box/75`), `12px` right.
- Inner layout gap between leading media and label: `4px`.
- Radius ON: `100px`. Radius OFF: `8px`.
- Stroke weight: `1px`, inside.
- Text is single-line, ellipsis, max 1 line.

## Token Mapping

| Role | Default mode token | Fixed mode token |
| --- | --- | --- |
| default stroke | `--cds-system-color-button-outlined-gray` | `--cds-system-fixed-color-button-outlined-gray` |
| outlined selected stroke | `--cds-system-color-button-default` | `--cds-system-fixed-color-button-default` |
| disabled stroke/fill | `--cds-system-color-button-disabled` | `--cds-system-fixed-color-button-disabled` |
| filled selected fill | `--cds-system-color-surface-default-reverse` | `--cds-system-fixed-color-surface-default-reverse` |
| default text | `--cds-system-color-text-default` | `--cds-system-fixed-color-text-default` |
| selected text | selected filled: `--cds-system-color-text-default-reverse`; selected outlined: `--cds-system-color-text-primary` | selected filled: `--cds-system-fixed-color-text-default-reverse`; selected outlined: `--cds-system-fixed-color-text-primary` |
| disabled text | `--cds-system-color-text-200a` | `--cds-system-fixed-color-text-200a` |
| badge fill | `--cds-system-color-roles-negative` | `--cds-system-fixed-color-roles-negative` |

## Alpha Token Notes

| Field | Value |
| --- | --- |
| Figma raw paint | disabled fill/stroke exposes token plus opacity `0.1` |
| bound token | `system/color/button/disabled` / `system/fixed_color/button/disabled` |
| token alpha meaning | token value already includes alpha (`#0000001A` or `#FFFFFF1A`) |
| CSS mapping | css-variable-only |
| decision | `use-alpha-token`; do not add CSS `opacity` to the chip container |

## Font Mapping Notes

| Field | Value |
| --- | --- |
| Figma fontFamily | `WeGothicSans` via `font_family/body` token alias |
| font family type | system-alias |
| availability | available on target macOS as DS system alias |
| CSS font-family order | `"WeGothicSans", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", token fallback` |
| decision | `use-system-alias` |
| visual diff risk | low, but text anti-aliasing can still differ |

## Sizing Interpretation Notes

| Field | Value |
| --- | --- |
| Figma layout sizing | hug width, fixed height |
| sample rendered size | Text `57x36`, Icon `77x36`, Image `79x36`; Small Text `57x32` |
| text wrapping rule | single line, ellipsis, max width by layout |
| min/max constraints | max width `190px`; inner text max width varies by type |
| asset frame contribution | Icon `16x16`; Image `24x24`; BadgeDot frame `8x14` with `4x4` dot; BadgeNumber wrapper `20x16` |
| CSS sizing decision | hug-content with constrained max width |
| forbidden interpretation | sample widths are not min-widths |

- BadgeDot placement is auto-layout based, not an absolute overlay: the visible dot sits inside an `8x14` trailing frame with left padding `4px`, centered as a frame within the chip, and the `4x4` dot is aligned to the frame top.

## Token vs Rendered Pixel Notes

| Field | Value |
| --- | --- |
| token id | `base/text_size/text-150` |
| token value | repo default token `--cds-typography-default-base-text-size-text-150: 14px`; Figma dev context reports rendered `15px` |
| Figma rendered value | default baseline `57x36` |
| actual value | `14px` token fallback with `21px` line-height renders `57x36` |
| decision | `component-css` / `font-rendering` |
| follow-up owner | component |

- WeGothicSans is treated as a system alias. Browser fallback metrics rendered the default `Text` label at `59x36` when using hardcoded `15px`.
- The component uses the repo token value for font-size and keeps Figma line-height `21px` to match the rendered baseline without hardcoding sample width.

## Nested Module Inventory

| Nested role | Node id/key | Module/component | Owner type | Axes/props/options | Required child atoms/assets | Coverage | Deferred reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Label | `74530:27260` | `_atoms / text` | module | Mode, Type, State; text style `body-s/system-500` | none | complete | — |
| Type icon | `59869:79788` / icon asset `10219:78694` | `_atoms / Leading (Optional)` + `Setting` | module/icon component | Type=Icon, icon frame `16x16`, default null marker | `ChordIcon name="nullMedium"` or consumer slot | complete | — |
| Image | `67249:29449` | `Img` | asset | Type=Image Medium only, circle `24x24` | local fixture `src/figma/fixtures/chips-img.png` or consumer slot | complete | — |
| Gradient_Mask | `12729:7394` | `Gradient_Mask` | component state shape | visible when `Marquee=true`, width `172`, height `24` | CSS mask/fade | partial | CSS approximation, not separate standalone component |
| Badge_Dot | `8451:112785` | `Badge_Dot` | atom | Mode=Default/Fixed, Size=Small, Outline=OFF | `BadgeDot` | complete | — |
| Badge_Number | `11098:2468` | `Badge_Number` | atom | Mode=Default/Fixed, Type=Number, Label default `3` | `BadgeNumber` | complete | — |

## Asset Notes

| Asset | Classification | Status |
| --- | --- | --- |
| Type icon default | icon component | mapped to `ChordIcon name="nullMedium"` as Figma null marker |
| Type icon override | consumer-provided slot | supported through `icon` |
| Image default | component fixture | exported to `src/figma/fixtures/chips-img.png`; consumer can override through `image` |
| Badge_Dot | existing atom | `BadgeDot size="small" outline="off"` |
| Badge_Number | existing atom | `BadgeNumber badgeType="number" label={badgeNumberLabel}` |
| Gradient_Mask | component state shape | CSS fade mask approximation |

## Visual References

- Layout baseline: `src/figma/baselines/chips-default.png`
- Visual baseline: `src/figma/baselines/chips-default@3x.png`
- Default variant: node `59869:78922`, expected size `57x36`
- BadgeDot layout baseline: `src/figma/baselines/chips-badge-dot.png`
- BadgeDot visual baseline: `src/figma/baselines/chips-badge-dot@3x.png`
- BadgeDot variant: node `82119:48720`, `Size=Small`, `Type=Icon`, `State=Outlined_Selected`, `Radius=ON`, `Badge=true`, expected size `85x32`

## Known Gaps

- `Gradient_Mask` is implemented as CSS fade masking, not a standalone imported Figma component.
- `Badge=true` and `Badge_Number=true` precedence follows Figma description: Badge_Number wins over Badge_Dot.
- Type icon default is Figma `ic_null_medium` marker. Product icons should be supplied through `icon`.

## Text Behavior Notes

- Single-line label. No wrapping. `overflow: hidden; text-overflow: ellipsis; white-space: nowrap`.
- Label max width is constrained by the chip max width (190px) minus padding and any media frame.
- Text style: `body-s/system-500` (14px / 21px line-height, weight 500).
- Confirmed via `get_design_context(59869:78922)` on 2026-05-09: label node uses `textAutoResize: NONE`, single-line, truncated.

## Nested Atom Mapping

- **Badge_Dot** (`8451:112785`): mapped to `BadgeDot` atom with `size="small" outline="off"`. Figma Default/Fixed mode forwarded. Parent Chips passes `mode` to control BadgeDot color.
- **Badge_Number** (`11098:2468`): mapped to `BadgeNumber` atom with `badgeType="number"`. `badgeNumberLabel` prop forwarded.
- **Type icon** (`59869:79788`): consumer slot via `icon` prop. Default null marker = `ChordIcon name="nullMedium"` (Figma null marker, not a visible icon).
- **Image** (`67249:29449`): consumer slot via `image` prop. Default fixture = `src/figma/fixtures/chips-img.png`. 24x24 circle crop.
- **Gradient_Mask** (`12729:7394`): no direct atom import. Implemented as CSS mask fade on the label area when `Marquee=true`.
