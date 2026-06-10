---
component: Toast
figma_name: "[V2] Toast"
node_id: "63694:4595"
component_set_key: "c582282238f4497a69ce1f3a82bd4c59723de883"
status: implemented
last_synced: "2026-05-05"
---

# Toast Source Note

## Figma Read
- Index lookup only: `design-cds-docs/99_ref/ref-figma-component-keys/chord-ds/index.md`
- Component set read: Console MCP `figma_get_component(63694:4595, enrich=true)`
- Representative variant read: Framelink `get_figma_data(63694:4596, depth=5)`
- Baseline exports:
  - `src/figma/baselines/toast-default.png` from `63694:4596`, scale `1`, `293x42`
  - `src/figma/baselines/toast-default@3x.png` from `63694:4596`, scale `3`, `879x126`

## Description
사용자 작업에 대한 짧은 시스템 상태 피드백을 자동으로 사라지는 하단 메시지로 전달하는 컴포넌트.

## Variant Axes
| Figma axis | Code prop | Values |
| --- | --- | --- |
| `Mode` | `mode` | `default`, `fixed` |

## Props
| Prop | Default | Notes |
| --- | --- | --- |
| `label` | `Translate it into the following language.` | Maps to Figma text property `Label#7943:0`. |

## Token Mapping
| Part | Mode | Token |
| --- | --- | --- |
| Container fill | `default` | `system/color/surface/default-reverse-600a-unequal` |
| Container fill | `fixed` | `system/fixed_color/surface/gray-200` |
| Label | all | `system/fixed_color/text/default` |
| Typography | all | `body-xs/400` |

## Alpha Token Notes
- `system/color/surface/default-reverse-600a-unequal` is already an alpha token.
- Do not add CSS `opacity` or additional color alpha on top of that token.

## Font Mapping Notes
| Item | Value |
| --- | --- |
| Figma text style | `body-xs/400` |
| Figma fontFamily | `WeGothicSans` |
| Type | `system-alias` |
| CSS order | `"WeGothicSans", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", var(--cds-typography-default-font-family-body, Pretendard, ui-sans-serif, system-ui, sans-serif)` |
| Font size | `14px` |
| Line height | `18px` |
| Weight | `400` |
| Decision | `use-system-alias` |

## Sizing Interpretation Notes
| Item | Value |
| --- | --- |
| Figma sizing | `hug width`, `hug height` |
| Default sample rendered size | `293x42` |
| Label sample size | `261x18` |
| Padding | `12px 16px` |
| Radius | `8px` |
| Max lines | `2` |
| Placement guidance | bottom placement, `20px` from bottom UI |
| Responsive guidance | `10px` mobile side margins, `410px` max width |
| CSS decision | `hug-content + max-inline-size: 410px` |
| Forbidden interpretation | `sample-size-is-not-min-width` |

## Asset Notes
- Toast is text-only in the consumer-facing contract.
- Hidden Figma checkbox and `icon_area` descendants are excluded from implementation.
- Do not add icon, button, action, or blocking behavior to Toast.

## Visual Baseline
- Default visual baseline uses `Mode=Default`, node `63694:4596`.
- The `293x42` baseline is the default label sample result only; it is not a minimum width contract.

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

## Known Gaps

- Legacy backfill (2026-05-08): no explicit Known Gaps section was recorded in the existing source note.
- Re-read Figma and update this section before expanding coverage or claiming new parity.
