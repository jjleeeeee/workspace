# Media-Dependent Baselines

## Trigger

Read this when adding a component to `visual-registry.json`, especially if the
Figma screenshot contains profile photos, thumbnails, product images, generated
sample media, or any consumer-supplied content.

## Lesson

Visual diff needs the same state and the same content policy on both sides.
A Figma screenshot with concrete media is not a valid automated baseline for a
component whose default state intentionally renders a placeholder until the
consumer supplies `src`.

## Apply

- Classify the visual comparison before registering it:
  - `registered`: same state, same content policy, deterministic baseline.
  - `deferred-media`: Figma baseline uses concrete/sample media but code default
    uses placeholder or consumer content.
  - `manual-only`: `FigmaCompare` supports review but should not be pass/fail.
  - `structural`: size/layout/composition is checked, full pixel parity is not
    claimed.
- Do not raise `maxDiffPixelRatio` to hide a media mismatch.
- If media is needed, add deterministic reference media first, then register the
  automated diff.
- Record deferred media baselines in the source note so Storybook screenshots do
  not look more complete than they are.
- Parent composition components may still use structural diff when the child
  media state is intentionally placeholder-based.

## Source Cases

- `retrospectives/retrospective_visual-registry-media-baseline_2026-05-07.md`
- `src/figma/avatar.source.md`
- `src/figma/thumbnail.source.md`
- `src/figma/list-item-native.source.md`
