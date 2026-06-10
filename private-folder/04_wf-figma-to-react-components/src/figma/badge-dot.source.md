---
component: BadgeDot
figma_name: Badge_Dot
node_id: "8451:112783"
component_key: "d1ea898a9e908e7470a7518abae5b45c18e0a58a"
source_read: "2026-05-05"
status: implemented
---

# BadgeDot Source Note

## Description

탐색 항목이나 아이콘에 알림 또는 상태가 있음을 점 형태로 표시하는 배지 컴포넌트.

## Figma Contract

- Axes: `Mode`, `Size`, `Outline`
- `Mode`: `Default`, `Fixed`
- `Size`: `Small`, `Medium`, `Large`
- `Outline`: `OFF`, `ON`
- Representative screenshot: `https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/faa41de6-8e87-4c4a-ac5b-49fc0cdb5792`
- Layout baseline: `src/figma/baselines/badge-dot-default.png` (`6x6`, scale 1)
- Visual baseline: `src/figma/baselines/badge-dot-default@3x.png` (`18x18`, scale 3)

## Variant Nodes

- Default / Small / OFF: `8451:112785`
- Default / Small / ON: `8451:112788`
- Default / Medium / OFF: `8451:112787`
- Default / Medium / ON: `8451:112782`
- Default / Large / OFF: `35125:15514`
- Default / Large / ON: `35125:15515`
- Fixed / Small / OFF: `8934:10557`
- Fixed / Small / ON: `8934:10559`
- Fixed / Medium / OFF: `8934:10563`
- Fixed / Medium / ON: `8934:10562`
- Fixed / Large / OFF: `51377:4755`
- Fixed / Large / ON: `51377:4756`

## Layout

- OFF dimensions: Small `4x4`, Medium `6x6`, Large `8x8`
- ON dimensions: Small `6x6`, Medium `8x8`, Large `12x12`
- Outline stroke: Small/Medium `1px`, Large `2px`
- Shape: pill radius / fully round

## Token Mapping

- Default fill: `--cds-system-color-status-danger-red`
- Fixed fill: `--cds-system-fixed-color-status-danger-red`
- Default outline: `--cds-system-color-outline-default-reverse`
- Fixed outline: `--cds-system-fixed-color-outline-default-reverse`

## Asset Status

No asset-backed visual is used.

## Known Gaps

- This component is token and geometry based. There is no nested icon/image export requirement.

## Alpha Token Notes

- N/A for legacy backfill (2026-05-08): explicit evidence for this section was not recorded as a dedicated section in the existing source note.
- Re-read Figma and replace this note with concrete evidence before changing this component contract.

## Font Mapping Notes

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
