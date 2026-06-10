# Atom Batch Retrospective: LoadingDot, LinearProgressIndicator, Checkbox, Radio, ToggleSwitch

Date: 2026-05-05

## Scope

- Implemented components: `LoadingDot`, `LinearProgressIndicator`, `Checkbox`, `Radio`, `ToggleSwitch`
- Source policy: `index.md` only for node/component key lookup, Console MCP for descriptions, variants, geometry, and baselines.
- Implementation was built from source notes and Figma references.

## What Worked

- The previous source-note-first workflow held up well for five components at once.
- Local 1x layout and 3x visual baselines made default representative validation fast and repeatable.
- Separating Figma-facing props from internal props kept Storybook Controls clean:
  - `LoadingDot`: `mode`, `size`, `color`
  - `LinearProgressIndicator`: `mode`, `rounded`, `indicatorHeight`
  - `Checkbox`: `mode`, `checkboxType`, `status`
  - `Radio`: `mode`, `status`
  - `ToggleSwitch`: `mode`, `platform`, `size`, `status`
- Form controls benefited from explicit status resolvers, so `checked` and `disabled` can be used ergonomically without drifting away from Figma `Status`.

## What Needs Improvement

- `Checkbox` still uses an inline SVG for the check icon because the MCP read did not export a DS icon file/path. This is visible in the source note as an asset gap.
- `LoadingDot` has a CSS animation option, but the Figma baseline is static. The official Lottie asset remains a production follow-up if the product requires it.
- `ToggleSwitch` has one special iOS small fixed enabled geometry (`32x18.5`) that is documented but not promoted to baseline yet.
- Current visual diff only covers each component's representative default state. Variant-level baselines should be added when a component becomes production-targeted.

## Validation Result

- `npm test`: passed, 18 files / 39 tests
- `npm run typecheck`: passed
- `npm run build-storybook`: passed
- `npm run build`: passed
- `npm run visual:baseline`: passed for all 9 registry entries
- `npm run visual:diff`: passed for all 9 registry entries

Default representative visual diff:

- `LoadingDot`: `visualDiff=0`
- `LinearProgressIndicator`: `visualDiff=0`
- `Checkbox`: `visualDiff=0`
- `Radio`: `visualDiff=0`
- `ToggleSwitch`: `visualDiff=0`

## Next Recommendation

Recommended next batch: `SelectNumberBox`, `Scrollbar`, `Divider`, `ScrimOverlay`, `CircularProgressIndicator`.

Tradeoff: this mixes simple primitives with one progress/loading component, which should be low-risk and good for expanding registry coverage.

Alternative next batch: `IconButton`, `Chips`, `Tag`, `Tooltip`, `DropdownBox`.

This would test asset-heavy and composition-heavy behavior sooner, but it will likely expose more placeholder and nested component decisions.

## Lessons Promoted

- Knowledge: [Icon Area vs Icon Asset](../knowledge/assets/icon-area-vs-icon-asset.md)
- Promotion: `knowledge`
- Reason: Checkbox and LoadingDot exposed the difference between missing production assets, placeholders, and CSS-only interim visuals.
