---
status: implemented
---

# Top Navigation — Figma Source Note

Date: 2026-05-08

## MCP Reads

- Console MCP: `figma_get_component("64450:39560", enrich=true)` — full spec, 32 variants, enriched metadata
- Official MCP: `get_design_context("64450:39561")` — design context (Mode=Default, Text Type=Center, Scroll Bg=Off)
- Figma REST image export: `64450:39561`, scale `1` and `3` — local baselines captured 2026-05-08

## Figma Node

- Component set node: `64450:39560`
- Reference variant: `64450:39561` (Mode=Default, Text Type=Center, Scroll Bg=Off)

## Variant Axes

| Axis | Values |
|---|---|
| Mode | `default`, `fixed` |
| Text_Type | `default`, `left`, `center`, `search`, `img`, `img-text`, `logo-svg`, `logo-svg-center` |
| Scroll_Bg | `on`, `off` |

**32 valid combinations**: Mode(2) × Text_Type(8) × Scroll_Bg(2) = all combinations valid.

## Layout

- Root container: `display: flex; height: 48px; padding-inline: 8px; width: 393px; align-items: center`
- Leading/Trailing area: `padding: 8px; display: flex; align-items: center` → total 40×40px hit area
- Text area: `flex: 1; display: flex; flex-direction: column; justify-content: center`

## Text_Type Layout Behavior

| Text_Type | Structure |
|---|---|
| `default` | [Leading] Title / SubTitle (left-aligned) [Trailing] |
| `left` | [Leading] Title / SubTitle (left-aligned, explicit) [Trailing] |
| `center` | [Leading] \_\_center: Title / SubTitle\_\_ [Trailing] (title absolutely centered) |
| `search` | [Leading] [Search 297×36px] [Trailing] |
| `img` | [Leading: Image] Title (no subtitle) [Trailing] |
| `img-text` | [Leading: Image] Title / SubTitle [Trailing] |
| `logo-svg` | [Logo SVG left-aligned] [Trailing] |
| `logo-svg-center` | [Leading] [Logo SVG centered] [Trailing] |

## Props

### Variant Axes → Props

| Prop | Type | Default |
|---|---|---|
| `mode` | `"default" \| "fixed"` | `"default"` |
| `textType` | `"default" \| "left" \| "center" \| "search" \| "img" \| "img-text" \| "logo-svg" \| "logo-svg-center"` | `"center"` |
| `scrollBg` | `"on" \| "off"` | `"off"` |

### Boolean Visibility Props (Figma-facing)

| Prop | Default | Notes |
|---|---|---|
| `showSubTitle` | `true` | Subtitle row |
| `showLeading` | `true` | Leading icon area |
| `showTrailing` | `true` | Trailing icon area |
| `showImage` | `true` | Image slot (img / img-text only) |
| `showOfficialBadge` | `true` | `[Title] Official Badge#61953:70`, badge next to title |
| `showSubTitleIcon` | `true` | `[Sub] Title Icon#64535:0` |
| `marquee` | `false` | `Marquee#61750:0` |
| `leadingType` | `icon-avatar` | nested `_atoms/Leading` Type |
| `trailingCount` | `1ea` | nested `_atoms/Trailing` count |

### Consumer Props (not in Storybook Controls)

| Prop | Type | Notes |
|---|---|---|
| `titleLabel` | `string` | Main title text |
| `subTitleLabel` | `string` | Subtitle text |
| `leadingSlot` | `ReactNode` | Leading icon/button |
| `trailingSlot` | `ReactNode` | Trailing icon/button |
| `imageSlot` | `ReactNode` | Avatar/image for img/img-text types |
| `logoSlot` | `ReactNode` | Logo SVG for logo-svg types |
| `leadingSlot`, `leadingAvatarSlot` | `ReactNode` | Overrides for nested leading Type branches |
| `trailingSlots` | `ReactNode[]` | Overrides for nested trailing count branches |

## Typography

| Element | Size | Weight | Token (default mode) | Token (fixed mode) |
|---|---|---|---|---|
| Title | 17px | Bold (700) | `--cds-system-color-text-default` | `--cds-system-fixed-color-text-default` |
| SubTitle | 13px | Regular (400) | `--cds-system-color-text-gray-500` | `--cds-system-fixed-color-text-gray-500` |

## Tokens

| Property | Token (default mode) | Token (fixed mode) |
|---|---|---|
| Background (Scroll Bg=On) | `--cds-system-color-surface-default` | `--cds-system-fixed-color-surface-default` |
| Background (Scroll Bg=Off) | `transparent` | `transparent` |
| Title color | `--cds-system-color-text-default` | `--cds-system-fixed-color-text-default` |
| SubTitle color | `--cds-system-color-text-gray-500` | `--cds-system-fixed-color-text-gray-500` |

## Nested Module Inventory

*MCP read date: 2026-05-08. Read: `figma_get_component("64450:39560", enrich=true)` + `get_design_context("64450:39561")`.*

| Nested role | Node id/key | Module/component | Owner type | Axes/props/options | Required child atoms/assets | Coverage | Deferred reason |
|---|---|---|---|---|---|---|---|
| leading | `64450:29257` | `_atoms/Leading` | component-set | Type=`Icon+Avatar` \| `Avatar` \| `Icon` | `icon_area`, Avatar-sized slot | complete | **Corrected 2026-05-08**: Icon+Avatar = [_atoms/Leading Icon type, 40×40px] + [Avatar XSmall Squircle, 38×38px] adjacent in a row (78px total), NOT overlay. Avatar-only = 38×38px no padding. Icon-only = 40×40px 8px padding. |
| trailing | `64450:29265` | `_atoms/Trailing` | component-set | count=`1ea` \| `2ea` \| `3ea` \| `Lottie`; booleans `Trailing`, `Trailing_1`, `Trailing_2`, `Trailing_3` | icon areas or lottie placeholder slot | complete | Exposed as `trailingCount` plus `trailingSlots`; lottie remains slot-only. |
| search area | DS `Search` component | `Search` | component-set | width=297px, height=36px | `Search` component (existing in codebase) | partial | Search component render confirmed; exact 297×36 constraint not pixel-verified |
| official badge | unknown | `BadgeDot` (placeholder) | atom | — | `BadgeDot` component | deferred | exact badge atom type not confirmed from Figma; `BadgeDot` used as placeholder |
| image slot | slot only | consumer `Avatar` / `Thumbnail` | component-set | — | consumer-provided ReactNode | deferred | slot pattern; consumer provides sized content |
| logo slot | slot only | consumer SVG | asset | — | consumer SVG | deferred | exact logo dimensions not confirmed; slot pattern |

## Assets / Icons

- Leading/Trailing icons: rendered via `ChordIcon` component (consumer-provided slot)
- Image slot: consumer provides `ReactNode` (Avatar or Thumbnail)
- Logo slot: consumer provides SVG ReactNode
- Official badge: `BadgeDot` or similar atom (exact badge component TBD — Known Gap)

## Known Gaps (v1)

- `Text_Type=default` vs `Text_Type=left` exact visual difference is still subtle; both are left text layouts but remain distinct data states.
- Official badge exact nested icon is not mapped; `BadgeDot` is used only because Figma property says Official Badge and parent description places it as a title-owned badge. Revisit if exact badge asset differs.
- `logo-svg` and `logo-svg-center` slots use consumer-provided ReactNode; exact dimensions not confirmed.
- `Marquee` scroll title interaction deferred.
- `Search` inner component sizing (297×36px) not pixel-verified against `Search` component output.

## Visual Validation

- Layout baseline: `src/figma/baselines/top-navigation-center-default.png` (`393x48`, scale 1).
- Visual baseline: `src/figma/baselines/top-navigation-center-default@3x.png` (`1179x144`, scale 3).
- Visual registry id: `top-navigation-center-default`.
- Visual registry scope: `comparisonScope="structure-only"`, `isParityGate=false`.
- Reason: the representative `Text_Type=Center` branch compares cleanly, but other text types, logo slots, official badge, and Search sizing remain partial/deferred.

## Alpha Token Notes

- Scroll background tokens are surface tokens; do not apply extra opacity.
- Transparent Scroll_Bg=Off is intentional and should not inherit a default surface.

## Font Mapping Notes

- Figma text is treated as `WeGothicSans`, the Chord DS system alias for macOS SF / Apple SD Gothic.
- CSS should prefer `"WeGothicSans", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo"` before fallback project fonts.

## Text Behavior Notes

- Root height is fixed at `48px`.
- The Figma description explicitly says to use Marquee for important long titles and not silently truncate important names.
- `marquee=true` should be represented as a data contract even if animation is deferred.

## Sizing Interpretation Notes

- Root width/height: `393x48`.
- Leading and trailing hit areas are `40x40` with internal padding.
- Search branch must reserve `297x36`.
- Logo width must be capped at `180px`.

## Nested Atom Mapping

- `_atoms/Leading` and `_atoms/Trailing` are real nested component sets and are represented by enum props.
- `Search` is composed through the existing `[V2] Search` atom; TopNavigation only owns the `297x36` wrapper.
- `icon_area` is a sizing wrapper. Default glyphs that are not confirmed by icon component identity are rendered as unresolved slots, not claimed as mapped assets.

## Token vs Rendered Pixel Notes

- Parent layout parity focuses on `393x48`, `40x40` icon hit areas, `297x36` Search slot, and logo max width.
- Icon glyph differences are classified under asset coverage unless they change slot size or alignment.
