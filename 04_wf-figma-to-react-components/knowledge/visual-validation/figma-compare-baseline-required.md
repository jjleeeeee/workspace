# FigmaCompare Baseline Required Before Completion

## Trigger

Read this when writing the `FigmaCompare` Storybook story for any component.

## Lesson

`FigmaCompare` without a real Figma screenshot is a placeholder, not a
comparison. Leaving "Visual baseline not yet registered" text in the story
and marking the component complete means the user will discover the gap by
opening Storybook themselves.

The baseline image must be captured, saved, and wired into the story **before**
the component is reported as done.

## Apply

- Run `get_screenshot` (or `figma_get_component_image`) for the primary
  Figma node (Mode=Default, State=Default or equivalent canonical variant).
- Save to `src/figma/baselines/<component-name>-default.png`.
- Reference via `new URL("../../figma/baselines/<component>.png", import.meta.url).href`
  in the story.
- Show baseline image and live component side-by-side in a flex/grid layout,
  each with a monospace label (`Figma (node …)` / `Implementation`).
- Do not use `FigmaCompare` itself as the visual registry `storyId`. Register
  a neutral single-component story such as `Playground`; side-by-side labels
  and the reference image can bleed into transparent component captures.
- Do not write placeholder text like "not yet registered" — capture first,
  then write the story.

## Source Cases

- `retrospectives/retrospective_dropdown-box_2026-05-08.md`
- Pattern reference: `Thumbnail.stories.tsx`, `Avatar.stories.tsx`
