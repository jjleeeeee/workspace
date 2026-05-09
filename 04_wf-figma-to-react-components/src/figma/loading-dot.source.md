---
component: LoadingDot
figma_name: Loading_Dot
node_id: "10384:29778"
component_key: "b1ecfc5a18468daceeaaa41142ef26f896c0f67f"
source_read: "2026-05-05"
status: implemented
---

# LoadingDot Source Note

## Description

화면 이동이나 컴포넌트 내부 처리 중 상태를 점 애니메이션으로 알려주는 로딩 컴포넌트.

## Figma Contract

- Axes: `Mode`, `Size`, `Color`
- `Mode`: `Default`, `Fixed`
- `Size`: `Medium`, `Small`
- `Color`: `Primary`, `White`
- Constraint: `Medium` is available only with `Color=Primary`.
- Representative baseline: `Mode=Default, Size=Medium, Color=Primary` (`10384:29779`)
- Layout baseline: `src/figma/baselines/loading-dot-default.png` (`60x60`, scale 1)
- Visual baseline: `src/figma/baselines/loading-dot-default@3x.png` (`180x180`, scale 3)

## MCP Reads

- Console MCP `figma_get_component(10384:29778, enrich=true)`
- Console MCP `figma_get_component_for_development(10384:29779)`
- Console MCP `figma_get_component_image(10384:29779, scale=1)`
- Console MCP `figma_get_component_image(10384:29779, scale=3)`

## Variant Nodes

- Default / Medium / Primary: `10384:29779`
- Default / Small / White: `10384:29783`
- Default / Small / Primary: `48790:15617`
- Fixed / Medium / Primary: `10384:29787`
- Fixed / Small / White: `10384:29791`
- Fixed / Small / Primary: `48790:15621`

## Props Mapping

- `Mode` -> `mode: "default" | "fixed"`
- `Size` -> `size: "medium" | "small"`
- `Color` -> `color: "primary" | "white"`
- Internal prop: `animated`, hidden from Storybook Controls.

## Layout

- Medium component: `60x60`
- Small component: `20x20`
- Medium dot: `8x8`, gap `8px`
- Small dot: `4x4`, gap `4px`
- Dot opacity sequence: `0.2`, `0.5`, `1`

## Token Mapping

- Medium primary default: `--cds-system-color-roles-primary`
- Medium primary fixed: `--cds-system-fixed-color-roles-primary`
- Small primary: `--cds-system-color-icon-primary`
- Small white: `--cds-system-color-icon-default-reverse`
- Medium gap: `--cds-system-size-padding-box-100`
- Small gap: `--cds-system-size-padding-box-50`

## Font Mapping Notes

No text node.

## Asset Status

- `loading_dot_motion` is described as a loading animation role.
- Figma component geometry provides three dots, but no Lottie JSON asset key or file path was exported.
- Implementation renders the Figma dot geometry and opacity sequence in CSS.
- `animated` is treated as a CSS behavior, not a production Lottie replacement.

## Known Gaps

- If product requires the official Lottie loading asset, replace or wrap this CSS implementation with the approved asset.

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
