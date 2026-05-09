---
status: implemented
---

# Title Header Source Note

## MCP Reads

- Console MCP: `figma_get_component("64450:27844", enrich=true)` — 2026-05-08
- Official MCP: `get_design_context("64450:28044", fileKey="DWEduE6GfxYMlyxKPNJ8jA")` — 2026-05-08
- Figma REST image export: `64450:28044`, scale `1` and `3` — local baselines captured 2026-05-08
- Framelink REST `get_figma_data("64450:28044", depth=3)` — nested instance swap discovery 2026-05-08
- Framelink REST `get_figma_data("65513:23665", depth=3)` — nested instance swap discovery 2026-05-08
- Framelink REST `get_figma_data("62973:7805", depth=1)` — atoms/leading_Left Types enumerated 2026-05-08
- Framelink REST `get_figma_data("79724:13590", depth=1)` — atoms/leading_Center Types enumerated 2026-05-08
- Framelink REST `get_figma_data("68949:28698", depth=1)` — atoms/trailing Types enumerated 2026-05-08

## Figma Reference

- Component Set: `64450:27844` (Title Header)
- Component Set Key: `33261ba4635ef136dd94de771e9ded865a98c6d4`
- File: `DWEduE6GfxYMlyxKPNJ8jA`

## Axes

```
Mode(2) × Align(2) = 4 variants
Mode: Default | Fixed
Align: Left | Center
```

## Variant Registry

| Variant | Node ID | Key |
|---|---|---|
| Mode=Default, Align=Left | `64450:28044` | `d58508050fa6843f5e234d0fe8fa929afe1beb46` |
| Mode=Fixed, Align=Left | `68998:22347` | `ccdadd57d18d51db17d2bbe7a28913ddfacd9a94` |
| Mode=Default, Align=Center | `65513:23665` | `2604a482e1d7a9947c6aa335056cd6dd05907169` |
| Mode=Fixed, Align=Center | `65513:23700` | `93d1df27e4c3ebf83da13fab48c626ae0767b9b6` |

## Props (Figma Component Properties)

| Prop | Figma Property | Type | Default |
|---|---|---|---|
| mode | Mode (VARIANT) | "default" \| "fixed" | "default" |
| align | Align (VARIANT) | "left" \| "center" | "left" |
| showLeading | Leading#65431:2 | boolean | true |
| showTrailing | Trailing#68951:9 | boolean | true |
| showSubTitle | [Sub] Title#65491:0 | boolean | true |
| showTitleBadge | [Title] Badge#65387:0 | boolean | true |
| showBadge1 | Badge_1#62336:141 | boolean | true |
| showBadge2 | Badge_2#62336:170 | boolean | true |
| showSubBadge | [Sub] Badge#62336:199 | boolean | true |
| showTitleMultiple | [Title] Multiple#62347:0 | boolean | false |
| showSubTitleMultiple | [Sub] Multiple#62347:37 | boolean | false |
| titleLabel | (text content) | string | "Title" |
| subTitleLabel | (text content) | string | "SubTitle" |
| trailingLabel | (text content) | string | "Detail" |
| leadingSlot | (slot) | ReactNode | — |
| trailingSlot | (slot) | ReactNode | — |
| badge1Slot | (slot) | ReactNode | — |
| badge2Slot | (slot) | ReactNode | — |
| subBadgeSlot | (slot) | ReactNode | — |
| multipleTitleSlot | Multiple Title#74501:0 | ReactNode | — |
| multipleSubTitleSlot | Multiple SubTitle#74501:15 | ReactNode | — |
| multipleSlot | Multiple#76618:10 | ReactNode | — |
| marquee | Marquee#61750:0 | boolean | false |
| leadingType | atoms/leading_Left Type | "icon" \| "avatar-group" | "icon" |
| trailingType | atoms/trailing Type | "text-icon" \| "dropdown" | "dropdown" |
| showTrailingText | Text#68951:5 | boolean | true |
| showTrailingIcon | Icon#68951:2 | boolean | true |

**Storybook Controls** (Figma-facing): `mode`, `align`, `showLeading`, `showSubTitle`, `showTrailing`, `showTitleBadge`

## Tokens

| Part | Mode | Role | Token | CSS var | Fallback |
|---|---|---|---|---|---|
| Title | Default | text color | system/color/text/default | `--cds-system-color-text-default` | #000000 |
| Title | Fixed | text color | system/fixed_color/text/default | `--cds-system-fixed-color-text-default` | #FFFFFF |
| SubTitle | Default | text color | system/color/text/gray-500 | `--cds-system-color-text-gray-500` | #8E8E8E |
| SubTitle | Fixed | text color | system/fixed_color/text/gray-500 | `--cds-system-fixed-color-text-gray-500` | #777777 |
| Trailing detail | Default | text color | system/color/text/default | `--cds-system-color-text-default` | #000000 |
| Trailing detail | Fixed | text color | system/fixed_color/text/default | `--cds-system-fixed-color-text-default` | #FFFFFF |

## Typography

| Part | Token | Size | Line-height | Weight |
|---|---|---|---|---|
| Title | body-m/system-700 | 16px | 22px | 700 |
| SubTitle | caption-m/system-400 | 13px | 17px | 400 |
| Trailing detail | body-xs/system-500 | 14px | 18px | 500 |

## Layout

- Component size: 393×48px (all 4 variants, fixed height)
- Root: horizontal flex, align-items center
- Left: `padding: 0 16px`, root-gap 12px, content inner gap 8px, text left
- Center: `padding: 0 16px 0 8px`, root-gap 8px, title text center
- Leading (Left): 38×46px avatar-group area
- Leading (Center): 40×40px icon area
- Text area: max-width fills remaining after leading + trailing
- Trailing: 64×20px trailing group (label + icon)

## Assets

| Part | Source | Classification | v1 Coverage |
|---|---|---|---|
| Leading (Left) | `atoms/leading_Left` — Type=Icon \| AvatarGroup | nested DS atom | complete for default branches — `AvatarGroup` is composed; icon branch remains unmapped placeholder unless `leadingSlot` is supplied |
| Leading (Center) | `atoms/leading_Center` — Type=Icon (only) | icon_area (not SVG) | deferred — accepts `leadingSlot`; only Icon type in Figma |
| Trailing | `atoms/trailing` — Type=Text+Icon \| Dropdown | nested DS module | deferred — accepts `trailingSlot`; consumer passes Text+Icon or Dropdown |
| Badge_1, Badge_2 | icon_area, size=xxsmall(12) | icon_area | deferred — accepts `badge1Slot`, `badge2Slot` |
| Sub Badge | icon_area, size=xxsmall(12) | icon_area | deferred — accepts `subBadgeSlot` |
| Metadata tags (Multiple) | DS Tag component | nested DS atom | deferred — accepts `multipleSlot` |

## Nested Module Inventory

*MCP read date: 2026-05-08. Reads: deep component read on `64450:28044` (Align=Left) and `65513:23665` (Align=Center).*

| Nested role | Node id (instance) | Module/component (set id) | Owner type | Axes/props/options | Required child atoms/assets | Coverage | Deferred reason |
|---|---|---|---|---|---|---|---|
| leading (Align=Left) | `76502:9617` | `atoms/leading_Left` (`62973:7805`) | module | Type=`Icon` \| `AvatarGroup` | `AvatarGroup` component → `[V2] Avatar` (Size=XSmall, Type=Squircle), `icon_area` | complete | Exposed as `leadingType`; default icon is slot/unmapped, avatar-group composes the new `AvatarGroup` atom. |
| leading (Align=Center) | `79743:23651` | `atoms/leading_Center` (`79724:13590`) | module | Type=`Icon` (only) | `icon_area` (size=medium, 24px) | complete | — |
| trailing | `68998:22692` | `atoms/trailing` (`68949:28698`) | module | Type=`Text+Icon` \| `Dropdown`; boolean: `Text`, `Icon` | `icon_area` (size=small, 20px) + text atom "Detail" (14px/500) | complete | Exposed as `trailingType`, `showTrailingText`, `showTrailingIcon`. |
| badge area (title/sub) | `65403:49622`, `65403:49625` | `icon_area` (xxsmall) | atom | size=`xxsmall(12)` | icon_area wrapper | partial | Icon keys not mapped; badge slots accept consumer ReactNode |
| metadata / tag | slot only | `Tag` component | component-set | — | DS Tag atom | deferred | consumer provides via `multipleSlot` |

## Composition

Nested DS components (all marked deferred for v1, exposed as slots):
- `AvatarGroup` via Avatar Group — leading in Align=Left
- `atoms/trailing` — trailing text + icon group
- `Tag` — metadata tags in Multiple area

## Implementation Coverage

| Area | v1 Coverage |
|---|---|
| Mode × Align variants | complete — 4 variants via data-mode / data-align |
| titleLabel, subTitleLabel, trailingLabel | complete |
| showLeading, showSubTitle, showTrailing | complete |
| showTitleBadge, showBadge1, showBadge2, showSubBadge | complete (slot-based) |
| showTitleMultiple, showSubTitleMultiple | complete (slot-based) |
| leadingSlot, trailingSlot | complete slot override; default branches are implemented for confirmed enum structure |
| badge1Slot, badge2Slot, subBadgeSlot | partial — visible area, no default icon |
| multipleTitleSlot, multipleSubTitleSlot, multipleSlot | partial — renders slot content |
| LIVE badge (Avatar nested) | deferred — part of leadingSlot |

## Known Gaps (v1)

- Badge icon names (icon_area instances in Figma) not mapped to ChordIcon keys; `badge1Slot`/`badge2Slot`/`subBadgeSlot` default to empty.
- Leading supports `leadingType="icon" | "avatar-group"` for Align=Left and composes `AvatarGroup`; Align=Center forces `icon`. Exact icon glyph remains unmapped.
- Trailing supports `trailingType="text-icon" | "dropdown"` plus `showTrailingText` and `showTrailingIcon`; exact dropdown glyph uses the confirmed arrow-down ChordIcon.
- Metadata tag Multiple area (tag list, membership gradient) is deferred to `multipleSlot`.
- Marquee (overflow animation) not implemented (visible area renders normally).
- LIVE badge inside Avatar Group is part of `leadingSlot` and not independently toggleable.

## Visual Validation

- Layout baseline: `src/figma/baselines/title-header-default.png` (`393x48`, scale 1).
- Visual baseline: `src/figma/baselines/title-header-default@3x.png` (`1179x144`, scale 3).
- Visual registry id: `title-header-default`.
- Visual registry scope: `comparisonScope="structure-only"`, `isParityGate=false`.
- Reason: visible nested slot coverage remains partial (`Avatar Group`, badges, trailing module), so the baseline is useful for structure review but not full parity.

## Alpha Token Notes

- No separate alpha opacity is applied to text in this component.
- Token names with alpha, if added later, must be used as color tokens and not combined with ad-hoc opacity on the same selector.

## Font Mapping Notes

- Figma text is treated as `WeGothicSans`, the Chord DS system alias for macOS SF / Apple SD Gothic.
- CSS should prefer `"WeGothicSans", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo"` before fallback project fonts.

## Text Behavior Notes

- Root height is fixed at `48px`; this component is a compact header, not a growing text row.
- Title is `max_lines=1`; `Marquee#61750:0` is the only confirmed long-title escape hatch.
- Do not convert Title Header to a multiline row unless Figma adds a new variant/contract.

## Sizing Interpretation Notes

- `393x48` is a hard parent contract for all four variants.
- Align=Left leading frame is `38x46`; Align=Center leading frame is `40x40`.
- Trailing group target is `64x20`; its text/icon visibility toggles should not change the parent height.

## Nested Atom Mapping

- `atoms/leading_Left`, `atoms/leading_Center`, and `atoms/trailing` are nested module contracts and are represented by explicit enum props, not by unlabelled arbitrary slots.
- `AvatarGroup` is used only for the confirmed AvatarGroup branch. `icon_area` remains a sizing wrapper, not an icon asset.

## Token vs Rendered Pixel Notes

- Parent `48px` height and leading/trailing frame sizes follow Figma rendered bounds.
- Slot glyph differences are classified as asset coverage, not parent layout success.
