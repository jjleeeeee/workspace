---
component: Snackbar
figma_name: "[V2] Snackbar"
node_id: "63694:5774"
component_set_key: "1d2be6f3586d1004dcb93f999e630377fe2a18c7"
status: implemented
last_synced: "2026-05-05"
---

# Snackbar Source Note

## Figma Read
- Index lookup only: `design-cds-docs/99_ref/ref-figma-component-keys/chord-ds/index.md`
- Component set read: Console MCP `figma_get_component(63694:5774, enrich=true)`
- Representative variant read: Framelink `get_figma_data(63694:5789, depth=5)`
- Baseline exports:
  - `src/figma/baselines/snackbar-default.png` from `63694:5789`, scale `1`, `373x44`
  - `src/figma/baselines/snackbar-default@3x.png` from `63694:5789`, scale `3`, `1119x132`

## Description
작업 결과를 알려주고 필요한 경우 선택적 후속 조치를 제공하는 하단 피드백 컴포넌트.

## Variant Axes
| Figma axis | Code prop | Values |
| --- | --- | --- |
| `Mode` | `mode` | `default`, `fixed` |

## Props
| Prop | Default | Notes |
| --- | --- | --- |
| `label` | `Translate it into the following language.` | Maps to Figma text property `Label#7943:0`. |
| `icon` | `false` | Maps to Figma boolean property `Icon#32952:18`. Enables optional leading icon area. |
| `actionLabel` | `Retry` | Code-facing name for the visible static Figma action text. Figma does not expose an action text component property. |

## Token Mapping
| Part | Mode | Token |
| --- | --- | --- |
| Container fill | `default` | `system/color/surface/default-reverse-600a-unequal` |
| Container fill | `fixed` | `system/fixed_color/surface/gray-200` |
| Label | all | `system/fixed_color/text/default` |
| Label typography | all | `body-xs/400` |
| Action label | all | `system/fixed_color/text/primary` |
| Action typography | all | `body-xs/system-500` |
| Optional icon | `icon=true` | `system/fixed_color/icon/default` |

## Alpha Token Notes
- `system/color/surface/default-reverse-600a-unequal` is already an alpha token.
- Do not add CSS `opacity` or additional color alpha on top of that token.

## Font Mapping Notes
| Item | Label | Action |
| --- | --- | --- |
| Figma text style | `body-xs/400` | `body-xs/system-500` |
| Figma fontFamily | `WeGothicSans` | `WeGothicSans` |
| Type | `system-alias` | `system-alias` |
| Font size | `14px` | `14px` |
| Line height | `18px` | `18px` |
| Weight | `400` | `500` |
| Decision | `use-system-alias` | `use-system-alias` |

CSS order: `"WeGothicSans", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", var(--cds-typography-default-font-family-body, Pretendard, ui-sans-serif, system-ui, sans-serif)`.

## Sizing Interpretation Notes
| Item | Value |
| --- | --- |
| Figma sample sizing | fixed width sample, hug height |
| Default sample rendered size | `373x44` |
| Fixed sample rendered size | `373x42` |
| Runtime sizing decision | fill available width with max `410px` and `10px` screen margins |
| Default sample block size decision | keep `44px` min block size for `Mode=Default` to match Figma rendered baseline |
| Fixed sample block size decision | keep `42px` min block size for `Mode=Fixed` |
| Padding | `12px 16px` |
| Gap | `8px` |
| Radius | `8px` |
| Optional icon area | `24x24px`, default hidden |
| Label sample width | `296px` |
| Max lines | `3` |
| Label alignment | left |
| Action | visible static `Retry`, hidden static `Cancel` excluded |
| Forbidden interpretation | `sample-width-is-not-min-width` |

## Asset Notes
- Optional leading icon source: `icon_area, size=medium(24), em=On`.
- Nested asset: `24/em/ic_question_mark_medium`, mapped as `ChordIcon name="questionMarkMedium"` from Figma node `36902:2249`.
- Current code keeps an `iconSlot` prop for caller-provided DS icon overrides. If no asset is passed and `icon=true`, the mapped question icon renders.

## Known Gaps
- Figma exposes `Retry` as visible static text and `Cancel` as hidden static text, with no action text component property.
- Code exposes `actionLabel` to make the visible action text usable while documenting that it is not a Figma component property.
- Optional icon asset mapping is complete for the default question icon. Other snackbar icon variants still need explicit mapping before use.

## Visual Baseline
- Default visual baseline uses `Mode=Default`, `Icon=false`, node `63694:5789`.
- The `373x44` baseline is the default sample result and visual registry target, not a minimum width contract for arbitrary runtime containers.

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
