# Atom Batch Retrospective: BadgeDot, BadgeNumber, Skeleton

Date: 2026-05-05

## Scope

- Implemented components: `BadgeDot`, `BadgeNumber`, `Skeleton`
- Source policy: `index.md` only for node/component key lookup, Figma MCP/Console MCP for descriptions, variants, tokens, and representative images.
- Implementation was built from source notes and Figma references.

## What Worked

- Choosing asset-light atoms reduced placeholder risk. Unlike `TextButton`, none of the three components needed icon or image exports.
- Source notes before implementation made the prop contract narrower and easier to verify.
- Story controls were limited to Figma-facing axes:
  - `BadgeDot`: `mode`, `size`, `outline`
  - `BadgeNumber`: `mode`, `badgeType`, `label`
  - `Skeleton`: `mode`, `skeletonType`, `size`
- Contract tests were cheap but useful. They caught missing components first, then guarded Storybook controls from drifting away from Figma axes.

## What Needs Improvement

- Initial implementation relied too much on remote Figma screenshot URLs. This was later corrected by storing local 1x layout baselines and 3x visual baselines.
- A `FigmaCompare` story is not enough by itself. If the baseline image is scaled differently from the implementation, visual review can look wrong while smoke tests still pass.
- Visual parity needs a pixel diff harness with local baseline PNGs, exact screenshot dimensions, heatmap artifacts, and a bounded retry loop.
- 1x baseline is useful for CSS px size checks, but small atom text can look blurry or over-sensitive at 1x. Use 3x visual baselines for pixel diff.
- Skeleton gradient is CSS-reconstructed from Figma geometry. It passed the first visual diff baseline, but future Skeleton variants should still be checked with the same harness before promotion.
- `BadgeNumber` initially treated `WeGothicSans` as an unavailable Figma-only font and fell back to the token family. This was corrected after clarifying that `WeGothicSans` represents macOS SF / Apple SD Gothic style rendering as a system alias.

## Implementation Notes

- `BadgeDot` maps exact Figma dimensions for outline/off and outline/on states.
- `BadgeNumber` enforces the Figma label limit of four characters including plus sign.
- `Skeleton` uses fixed dimensions from Figma for rectangle, line, and circle variants.

## Next Recommendation

Recommended next batch: `LoadingDot`, `LinearProgressIndicator`, `Checkbox`.

Tradeoff: this introduces more state and animation complexity than the badge/skeleton batch, but it tests the workflow against real interaction/status components without jumping straight into icon-heavy buttons.

Alternative next batch: `Radio`, `ToggleSwitch`, `SelectNumberBox`.

This stays in form-control territory and may be better if we want to stabilize controlled/uncontrolled prop patterns first.

## Validation Result

- `npm test`: passed
- `npm run typecheck`: passed
- `npm run build-storybook`: passed
- `npm run build`: passed
- Browser smoke: passed for `BadgeDot`, `BadgeNumber`, and `Skeleton` Playground stories with zero console errors.
- Follow-up workflow change: add `visual:baseline` and `visual:diff`; do not treat smoke as visual parity.
- First pixel diff result after harness:
  - `BadgeDot`: passed after transparent screenshot capture was fixed.
  - `Skeleton`: passed after Storybook root/capture alignment was fixed.
  - `BadgeNumber`: failed on text anti-aliasing/font rendering diff while size matched.
  - `TextButton`: failed on width mismatch (`63x40` baseline vs `65x40` actual).
- Scale policy update:
  - Use 1x layout baseline for size gates.
  - Use 3x visual baseline for pixel diff.
  - `BadgeNumber` improved from 14.9% visual diff at 1x to 5.48% at 3x, which confirms that tiny 1x text diff was too harsh.
  - `TextButton` remains a true size mismatch, not a blurry baseline issue.
- Final follow-up fixes:
  - `BadgeNumber` passed after using `WeGothicSans` as a macOS system alias before OS/system and token fallback.
  - `TextButton` passed after replacing the default real border with an inset stroke only for outlined variants.

## Lessons Promoted

- Knowledge: [Token vs Rendered Pixel](../knowledge/visual-validation/token-vs-rendered-pixel.md)
- Promotion: `knowledge`
- Reason: 1x/3x baseline choice, font rendering, and token-vs-pixel mismatch are reusable validation lessons for later components.
