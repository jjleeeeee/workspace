---
component: BadgeNumber
figma_name: Badge_Number
node_id: "8451:113030"
component_key: "0ec884a8ce648a69360a64bc9b883cd0b3cc948d"
source_read: "2026-05-05"
status: implemented
---

# BadgeNumber Source Note

## Description

탐색 항목이나 아이콘에 알림 수량 또는 신규 상태를 라벨로 표시하는 배지 컴포넌트.

## Figma Contract

- Axes: `Mode`, `Type`
- Text property: `Label#8451:52`
- `Mode`: `Default`, `Fixed`
- `Type`: `Number`, `New`
- Label limit: max 4 characters including the plus sign.
- Representative screenshot: `https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/5803c295-f2b4-4287-9ae0-c1ae125e14eb`
- Layout baseline: `src/figma/baselines/badge-number-default.png` (`39x16`, scale 1)
- Visual baseline: `src/figma/baselines/badge-number-default@3x.png` (`117x48`, scale 3)

## Variant Nodes

- Default / Number: `11098:2468`
- Default / New: `11098:2470`
- Fixed / Number: `11098:2478`
- Fixed / New: `11098:2480`

## Layout

- Number default example: `999+`
- New default label: `N`
- Number size from default example: `39x16`
- New size: `16x16`
- Horizontal padding for Number: `4px`
- Radius: `20px`

## Token Mapping

- Default background: `--cds-system-color-roles-negative`
- Fixed background: `--cds-system-fixed-color-roles-negative`
- Text color: `--cds-system-color-text-white-same` / `--cds-system-fixed-color-text-white-same`
- Typography: `WeGothicSans`, `12px`, `16px` line-height, `500` weight.

## Font Mapping Notes

| Field | Value |
| --- | --- |
| Figma fontFamily | `WeGothicSans` |
| font family type | `system-alias` |
| availability | `available` |
| system alias meaning | macOS SF / Apple SD Gothic style rendering |
| CSS font-family order | `"WeGothicSans", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", var(--cds-typography-default-font-family-body, Pretendard, ui-sans-serif, system-ui, sans-serif)` |
| decision | `use-system-alias` |
| visual diff risk | `none` in current macOS validation environment |

## Asset Status

No asset-backed visual is used.

## Implementation Notes

- Figma development data names the font as `WeGothicSans`.
- Treat `WeGothicSans` as a macOS system font alias used to express SF / Apple SD Gothic style rendering, not as a required bundled font asset.
- Keep the Figma font family before OS/system fallback and generic typography token fallback.
- If `WeGothicSans` is unavailable in a test environment, text antialiasing and glyph width may fail visual diff even when box size and colors match.

## Known Gaps

- No current asset gap.

## Alpha Token Notes

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
