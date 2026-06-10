# chord-icons Registry Verification Before Using ChordIcon

## Trigger

Read this when a component requires an icon via `<ChordIcon name="..." />`.

## Lesson

An SVG file existing in `src/assets/icons/` does **not** mean it is usable.
`ChordIcon` reads from the `chordIcons` registry object in `chord-icons.tsx`.
If a registry entry is missing, `ChordIcon` renders nothing without an error.
The gap is invisible in typecheck and only surfaces at runtime or in Storybook.

## Apply

- Before writing JSX that uses a `ChordIcon name`, search `chord-icons.tsx`
  for the expected key name (e.g., `arrowDownFoldMedium`).
- If missing: add `import <name>Svg from "./icons/<file>.svg?raw"` and a
  registry entry with `fileName`, `figmaKey`, `frameSize`, `nodeId`,
  `sourceName`, `svg`.
- Write a unit test that checks the icon renders via `data-testid` so TDD
  catches the gap before visual review.
- Record the icon name and registration in the source note under Assets.

## Source Cases

- `retrospectives/retrospective_dropdown-box_2026-05-08.md`
  (`arrowDownFoldMedium` SVG existed in `assets/icons/` but was unregistered)
