---
component: Skeleton
figma_name: Skeleton
node_id: "12447:42302"
component_key: "646e648144ff6565de0d221e746dce3d4883ac5a"
source_read: "2026-05-05"
status: implemented
---

# Skeleton Source Note

## Description

콘텐츠 로딩 중 실제 콘텐츠 영역의 형태를 미리 보여주는 플레이스홀더 컴포넌트.

## Figma Contract

- Axes: `Mode`, `Type`, `Size`
- `Mode`: `Default`, `Fixed`
- `Type`: `Rectangle`, `Line`, `Circle`
- `Size`: `Large`, `Medium`
- Representative screenshot: `https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/c0317c28-5668-4175-a1dd-7ef571737ef5`
- Layout baseline: `src/figma/baselines/skeleton-default.png` (`355x200`, scale 1)
- Visual baseline: `src/figma/baselines/skeleton-default@3x.png` (`1065x600`, scale 3)

## Variant Nodes

- Default / Rectangle / Large: `12447:42333`
- Default / Rectangle / Medium: `12447:42335`
- Default / Line / Large: `12447:42331`
- Default / Line / Medium: `12447:42337`
- Default / Circle / Large: `12447:42339`
- Default / Circle / Medium: `12447:42341`
- Fixed / Rectangle / Large: `12447:42283`
- Fixed / Rectangle / Medium: `12447:42299`
- Fixed / Line / Large: `12447:42298`
- Fixed / Line / Medium: `12447:42300`
- Fixed / Circle / Large: `12447:42301`
- Fixed / Circle / Medium: `12447:42303`

## Layout

- Rectangle Large: `355x200`, radius `8px`
- Rectangle Medium: `168x94`, radius `8px`
- Line Large: `355x20`, radius `4px`
- Line Medium: `168x16`, radius `4px`
- Circle Large: `48x48`, fully round
- Circle Medium: `32x32`, fully round

## Token Mapping

- Default base fill: `--cds-system-color-surface-default-gray-50`
- Fixed base fill: `--cds-system-fixed-color-surface-gray-100`
- Rectangle radius: `--cds-system-size-radius-box-100`
- Line radius: `--cds-system-size-radius-box-50`
- Default highlight: `--cds-system-color-surface-default-600a-unequal`
- Fixed highlight: `--cds-system-fixed-color-surface-default-reverse-50a`

## Asset Status

No asset-backed visual is used.

## Known Gaps

- Figma marks circle radius as source-component clipping. The implementation uses a fully round CSS radius.
- The shimmer is implemented as a CSS pseudo element from the Figma gradient geometry. It is not an exported image asset.

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
