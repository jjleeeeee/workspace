# Storybook And Validation Rules

## Storybook

- Storybook Controls expose only Figma-facing props.
- Native/internal/runtime props should be hidden from Controls.
- `FigmaCompare` is manual review support, not the pass/fail gate.
- `FigmaCompare` must render a local Figma reference image from
  `src/figma/baselines/` next to the current implementation.
- Visual registry entries must target a neutral single-component story such as
  `Playground`, not `FigmaCompare`; comparison labels/reference images can
  bleed into transparent element captures.
- Avoid parent composition demo stories inside atom stories unless the atom's
  contract explicitly includes that composition.

## Validation

- Storybook build alone is not done.
- Browser smoke proves render/no console errors; it does not prove visual match.
- Visual parity uses 1x layout size gates and 3x visual pixel diff.
- Placeholder or asset gaps must be visible in source notes and Storybook docs.

## Coverage-Aligned Visual Gate

- Visual registry entries must declare `comparisonScope` and `isParityGate`.
- `comparisonScope="full-parity"` means the registered baseline is allowed to
  fail or pass Figma parity for the selected component/story.
- `comparisonScope="structure-only"` means the screenshot is useful for layout
  drift, but missing media, branch coverage, or nested module gaps prevent a
  parity claim.
- `comparisonScope="shell-only"` means the screenshot checks the outer shell
  only. It must not be reported as Figma visual parity.
- If a source note says `partial`, `deferred`, `partial/default-only`, or has
  nested coverage gaps that affect the registered baseline, `isParityGate` must
  be `false`.
- A non-gating visual diff may still run, but its result is evidence for review,
  not a pass/fail completion claim.
- `FigmaCompare` manual review and `visual:diff` output must agree on the
  scope. If the side-by-side image is visibly missing required nested content,
  do not report visual parity even when pixel ratio is under threshold.

Detailed validation procedure lives in `workflow/validation-checklist.md`.
