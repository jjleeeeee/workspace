---
component: Tag
figma_name: tag
node_id: "30256:32826"
component_set_key: "bc5965253050f2719974ba59fab7b22b35a05b3f"
status: implemented
last_synced: "2026-05-05"
---

# Tag Source Note

## Figma Read
- Index lookup only: `design-cds-docs/99_ref/ref-figma-component-keys/chord-ds/index.md`
- Component set read: Console MCP `figma_get_component(30256:32826, enrich=true)`
- Development read: Console MCP `figma_get_component_for_development(30256:32826)`
- Representative variant read: Framelink `get_figma_data(30256:32822, depth=5)`
- Baseline exports:
  - `src/figma/baselines/tag-default.png` from `30256:32822`, scale `1`, `41x16`
  - `src/figma/baselines/tag-default@3x.png` from `30256:32822`, scale `3`, `123x48`

## Description
콘텐츠의 속성, 카테고리, 상태를 짧은 키워드로 식별하는 정보 표시 컴포넌트.

## Variant Axes
| Figma axis | Code prop | Values |
| --- | --- | --- |
| `Size` | `size` | `small`, `medium` |
| `Type` | `tagType` | `line`, `fill` |
| `Shape` | `shape` | `squircle`, `round` |
| `Color` | `color` | `primary`, `secondary-blue`, `secondary-green`, `secondary-purple`, `secondary-pink`, `gray`, `white`, `red`, `membership-malachite-green`, `membership-lavender`, `membership-cornflower-blue`, `live-red` |

Figma has `89` variants: `Size(2) x Type(2) x Shape(2) x 11 standard colors + LIVE Red exception(1)`.

## Props
| Prop | Default | Notes |
| --- | --- | --- |
| `label` | `Text` | Short keyword-style visible text. Figma description documents it even though live component properties do not expose it. |
| `showIcon` | `true` | Maps to Figma boolean property `Show Icon`. Removes the leading `icon_area` and collapses the `2px` gap when false. |
| `icon` | none | Internal asset slot. Hidden from Storybook Controls. |

## Constraints
- `live-red` exists only as `Size=Small, Type=Fill, Shape=Squircle`.
- Code normalizes `live-red` requests to that Figma-supported combination.
- Tag is non-interactive information labeling. Click, focus, dismissal, or selection behavior belongs to a wrapper or another component.

## Token Mapping
| Color | Token |
| --- | --- |
| `primary` | `system/fixed_color/roles/primary` |
| `secondary-blue` | `system/fixed_color/roles/secondary-blue` |
| `secondary-green` | `system/fixed_color/roles/secondary-green` |
| `secondary-purple` | `system/fixed_color/roles/secondary-purple` |
| `secondary-pink` | `system/fixed_color/roles/secondary-pink` |
| `gray` | `system/fixed_color/text/gray-500` |
| `white` | `system/fixed_color/text/default` |
| `red` | `system/fixed_color/roles/negative` |
| `membership-malachite-green` | `system/fixed_color/roles/membership-malachite-green` |
| `membership-lavender` | `system/fixed_color/roles/membership-lavender` |
| `membership-cornflower-blue` | `system/fixed_color/roles/membership-cornflower-blue` |
| `live-red` | `system/fixed_color/roles/negative` |

Type behavior:
- `line`: transparent background, `1px` stroke using color token at `0.4` layer opacity, text/icon using color token.
- `fill`: background using color token at `0.85` layer opacity, text/icon using `system/fixed_color/text/default`.
- `live-red`: background uses `system/fixed_color/roles/negative` at `1` layer opacity.

## Alpha Token Notes
- The opacity values above are Figma layer opacity on non-alpha fixed color role tokens.
- Do not add extra opacity to an alpha token. If a future mapping changes to `*-100a` or similar, re-check this section before applying opacity.

## Font Mapping Notes
| Item | Value |
| --- | --- |
| Figma text style | `caption-xs/system-700` |
| Figma fontFamily | `WeGothicSans` |
| Type | `system-alias` |
| CSS order | `"WeGothicSans", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", var(--cds-typography-default-font-family-body, Pretendard, ui-sans-serif, system-ui, sans-serif)` |
| Font size | `10px` |
| Line height | `13px` |
| Weight | `700` |
| Decision | `use-system-alias` |

## Sizing Interpretation Notes
| Item | Value |
| --- | --- |
| Figma sizing | `hug width`, fixed height by `Size` |
| Small height | `16px` |
| Medium height | `20px` |
| Small padding | `0 4px` |
| Medium padding | `0 6px` |
| Gap | `2px` |
| Icon area | `10x10px` |
| `ic_null_medium` rendered frame | `10x10px` inside `icon_area size=tiny(10)` |
| `ic_null_medium` nested guide/vector bound | Figma tree reports an inner bound near `8.33x8.33px`, but the exported baseline's visible red marker bounds are `10x10px` |
| Text sample | `Text`, `21x13px` |
| Default sample rendered size | `41x16` |
| Medium sample rendered size | `45x20` |
| CSS decision | `hug-content + fixed height` |
| Forbidden interpretation | `sample-size-is-not-min-width` |

Radius:
- `small + squircle`: `4px`
- `medium + squircle`: `6px`
- `round`: `24px`

## Asset Notes
- Leading icon source: `icon_area, size=tiny(10), em=On`
- Component key: `5333fee674d5321de4390fafeac274b584e8a10f`
- Current implementation preserves a `10x10` icon slot and a `10x10` `ic_null_medium` rendered frame. If no icon is provided, it renders the Figma null marker visible in the default baseline.
- The nested guide/vector bound from the Figma tree is not the Tag icon size. Public icon sizing and default marker rendering use the exported baseline's `10x10` frame.
- A visible icon must come from a DS icon asset or an explicit `icon` prop. Do not replace it with text content.

## Known Gaps
- `icon_area` nested null icon internals contain raw guide fills such as `#D9D9D9`. These are excluded from Tag color mapping.
- `ic_null_medium` exists in the shared icon registry, but Tag's default null marker is not treated as a production-complete product icon. A real visible Tag icon must be supplied through the explicit `icon` prop or mapped as a separate registry-backed asset.

## Visual Baseline
- Default visual baseline uses `Size=Small, Type=Line, Shape=Squircle, Color=Primary`, node `30256:32822`.
- The `41x16` baseline is the default sample result only; it is not a minimum width contract.

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
