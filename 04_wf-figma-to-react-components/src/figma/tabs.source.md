---
status: implemented
---

# [V2] Tabs — Figma Source Note

Date: 2026-05-08

## MCP Reads

- Console MCP: `figma_get_component("65172:10165", enrich=true)` — full spec, enriched metadata
- Official MCP: `get_design_context("66562:18181")` — design context (Mode=Default, Style=Bar, Type=Fixed, Size=Medium)
- Figma REST image export: `66562:18181`, scale `1` and `3` — local baselines captured 2026-05-08

## Figma Node

- Component set node: `65172:10165`
- Reference variant: `66562:18181` (Mode=Default, Style=Bar, Type=Fixed, Size=Medium)

## Variant Axes

| Axis | Values |
|---|---|
| Mode | `default`, `fixed` |
| Style | `bar`, `chip` |
| Type | `fixed`, `scrollable`, `expand` |
| Size | `medium`, `small-only-chips`, `small` |

**16 valid combinations** (not 36 theoretical):
- Style=Bar → Size=medium only, Type=fixed or scrollable only
- Style=Chip → all 3 Types, all 3 Sizes
- Type=Expand → Style=Chip only

## Props

### Figma-facing (Storybook Controls)
| Prop | Type | Default | Notes |
|---|---|---|---|
| `mode` | `"default" \| "fixed"` | `"default"` | Token family selector |
| `style` | `"bar" \| "chip"` | `"bar"` | Tab item visual style |
| `type` | `"fixed" \| "scrollable" \| "expand"` | `"fixed"` | Layout/overflow behavior |
| `size` | `"medium" \| "small-only-chips" \| "small"` | `"medium"` | Tab row height |
| `showExpandButton` | `boolean` | `true` | Only for type=expand |

### Consumer-controlled
| Prop | Type | Default | Notes |
|---|---|---|---|
| `tabItems` | `string[]` | `["Tab 1", "Tab 2", "Tab 3", "Tab 4"]` | Tab labels |
| `selectedIndex` | `number` | `0` | Active tab index |
| `onTabChange` | `(index: number) => void` | — | Selection callback |

## Tokens

| Purpose | Token | CSS Var | Fallback |
|---|---|---|---|
| Bar selected line (default) | `system/color/outline/default` | `--cds-system-color-outline-default` | `#000000` |
| Bar selected line (fixed) | `system/fixed_color/outline/default` | `--cds-system-fixed-color-outline-default` | `#ffffff` |
| Bar bottom separator (default) | `system/color/outline/default-100a` | `--cds-system-color-outline-default-100a` | `rgba(0,0,0,0.1)` |
| Bar bottom separator (fixed) | `system/fixed_color/outline/default-100a` | `--cds-system-fixed-color-outline-default-100a` | `rgba(255,255,255,0.1)` |
| Tab text selected (default) | `system/color/text/default` | `--cds-system-color-text-default` | `#000000` |
| Tab text unselected (default) | `system/color/text/gray-700` | `--cds-system-color-text-gray-700` | `#484848` |
| Tab text selected (fixed) | `system/fixed_color/text/default` | `--cds-system-fixed-color-text-default` | `#ffffff` |
| Tab text unselected (fixed) | `system/fixed_color/text/gray-700` | `--cds-system-fixed-color-text-gray-700` | — |
| Scroll more surface (default) | `system/color/surface/default-4` | `--cds-system-color-surface-default-4` | — |
| Scroll more surface (fixed) | `system/fixed_color/surface/default-reverse-100a` | `--cds-system-fixed-color-surface-default-reverse-100a` | — |
| Scroll more stroke (default) | `system/color/outline/default-50a-2` | `--cds-system-color-outline-default-50a-2` | — |
| Scroll more stroke (fixed) | `system/fixed_color/outline/default-50a` | `--cds-system-fixed-color-outline-default-50a` | — |
| Expand container (default) | `system/color/surface/default-2` | `--cds-system-color-surface-default-2` | — |
| Expand container (fixed) | `system/fixed_color/surface/default-gray-50` | `--cds-system-fixed-color-surface-default-gray-50` | — |

## Typography

| Element | Size | Weight | Line Height |
|---|---|---|---|
| Bar tab label | 15px | 700 (Bold) | 21px |
| Chip tab label | (delegated to Chips component) | — | — |

## Layout

| Variant | Height |
|---|---|
| Bar/Medium | 44px |
| Chip/Medium | 52px |
| Chip/Small (Only Chips) | 48px |
| Chip/Expand | 308px |

**Width**: 393px (full width)
**Bar**: horizontal padding 16px, bottom line 1px, selected line 3px bottom
**Chip**: container padding 8px 16px, item gap 8px
**Fixed chip area width**: 361px
**Scrollable chip area width**: 321px (+ 32px more control)
**Expand chips region**: 321x292px + 32px more button + 40px gradient overlay

## Assets

| Part | Source | Approach |
|---|---|---|
| scroll_more arrow | `arrowDownMedium` ChordIcon | KNOWN GAP: `16/em/ic_arrow_down_xsmall` not in registry. Use `arrowDownMedium` or omit icon. |
| Gradient fade overlay | Gradient_color component | Implemented via CSS linear-gradient — component-backed Figma asset not in codebase. |

## Nested Module Inventory

*MCP read date: 2026-05-08. Read: `figma_get_component("65172:10165", enrich=true)` + `get_design_context("66562:18181")`.*

| Nested role | Node id/key | Module/component | Owner type | Axes/props/options | Required child atoms/assets | Coverage | Deferred reason |
|---|---|---|---|---|---|---|---|
| bar tab item | `67331:10317` | `_atoms/Tabs` | component-set | Mode=`Default` \| `Fixed`; Select=`On` \| `Off`; `Badge` boolean default false | `BadgeDot` when Badge=true | complete | Reimplemented inline with explicit `barBadge` support after recursive read. |
| chip tab item | key from Chips DS | `Chips` component | component-set | `state=filled-selected / default / filled-disabled`; `size=medium / small` | `Chips` atom (already in codebase) | complete | Full Chips prop mapping implemented |
| scroll_more button | `12400:7597` | `element / component / scroll_more` | component-set | Size=`medium` \| `small`; State=`Spread` \| `Fold` | arrow icon + surface/stroke tokens | complete for size/state contract; icon partial | `arrowDownXsmall` is missing, so registry fallback remains documented. |
| expand gradient overlay | Figma-internal | `Gradient_color` | component-set | — | CSS linear-gradient | deferred | Figma component not in codebase; CSS approximation |

## Composition

- **Style=Bar**: Implements `_atoms/Tabs` inline with `Mode`, selected state, and `Badge` boolean support.
- **Style=Chip**: Uses existing `Chips` component with `state="filled-selected"` / `state="default"` / `state="filled-disabled"`.
- **scroll_more button**: Custom button with ChordIcon arrow + tokens. Not using Figma scroll_more component (not in codebase).

## Valid Combinations Table

| Style | Type | Size | Valid |
|---|---|---|---|
| bar | fixed | medium | ✓ |
| bar | scrollable | medium | ✓ |
| bar | expand | * | ✗ |
| chip | fixed | medium | ✓ |
| chip | fixed | small-only-chips | ✓ |
| chip | scrollable | medium | ✓ |
| chip | scrollable | small-only-chips | ✓ |
| chip | expand | medium | ✓ |
| chip | expand | small | ✓ |

## Known Gaps (v1)

- `arrowDownXsmall` (16px) not in chord-icons registry. Using `arrowDownMedium` (24px) as fallback for scroll_more button.
- Gradient fade overlay in Expand type: implemented via CSS gradient, not via Figma's `Gradient_color` component.
- Type=Scrollable: CSS horizontal scroll only — no momentum/snap behavior.
- Marquee (long label scroll animation) not implemented.
- Bar/Scrollable horizontal scroll behavior: basic overflow-x: auto.
- Invalid theoretical combinations normalize to the nearest valid Figma branch and expose `data-normalized-*` attributes for test/debug visibility.

## Visual Validation

- Layout baseline: `src/figma/baselines/tabs-bar-default.png` (`393x44`, scale 1).
- Visual baseline: `src/figma/baselines/tabs-bar-default@3x.png` (`1179x132`, scale 3).
- Visual registry id: `tabs-bar-default`.
- Visual registry scope: `comparisonScope="structure-only"`, `isParityGate=false`.
- Reason: the Bar/Fixed/Medium branch is structurally comparable, but chip, scroll, expand, and internal Figma modules remain partial/deferred.

## Alpha Token Notes

- Separator, scroll_more, and fixed-mode surface tokens include alpha in token identity. Use token color values directly.
- Do not add a second opacity layer to scroll_more or separator selectors.

## Font Mapping Notes

- Figma text is treated as `WeGothicSans`, the Chord DS system alias for macOS SF / Apple SD Gothic.
- CSS should prefer `"WeGothicSans", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo"` before fallback project fonts.

## Text Behavior Notes

- Figma description says long labels should not be silently truncated with ellipsis.
- Bar labels therefore use nowrap scrolling/overflow behavior rather than `text-overflow: ellipsis` as the completion signal.
- Chip labels delegate text behavior to `Chips`.

## Sizing Interpretation Notes

- Bar/Medium height is `44px`.
- Chip/Medium height is `52px`; Chip Small and Small (Only Chips) are `48px`.
- Expand branch is `308px` high and contains a `321x292` chip region plus `32x32` control and gradient overlay.
- The 16 valid combinations table is the implementation gate; unsupported theoretical combinations are normalized before rendering.

## Nested Atom Mapping

- `_atoms/Tabs` is implemented inline only because it is an internal Figma atom, but its `Badge`, `Mode`, and `Select` contract must be represented.
- `Chips` is composed directly for chip style.
- `scroll_more` is implemented as a module shell with documented size/state; missing `arrowDownXsmall` remains an asset registry gap.

## Token vs Rendered Pixel Notes

- Parent dimensions and valid-combination normalization are workflow gates before pixel diff is interpreted.
- If Bar labels overflow, the failure should be classified as text-behavior mismatch, not “visual noise.”
