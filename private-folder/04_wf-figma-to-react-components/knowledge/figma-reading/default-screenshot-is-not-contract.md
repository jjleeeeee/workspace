# Default Screenshot Is Not Contract

## Trigger

Read this when a Figma default node or screenshot looks complete enough to
implement from directly.

## Lesson

The default screenshot is a sample state, not the full component contract. It
can hide variant axes, booleans, nested enums, slot states, text options, and
asset swaps.

## Apply

- Use default screenshots for geometry and visual reference, not contract
  completeness.
- Confirm Figma variant axes and component properties before choosing public
  props.
- For complex components, inspect property dropdowns or REST data when MCP
  context does not reveal nested options.
- Label `FigmaCompare` as manual or representative when it compares only one
  branch.

## Source Cases

- `retrospectives/retrospective_list-item-native_2026-05-07.md`
- `retrospectives/retrospective_atom-batch-badge-skeleton_2026-05-05.md`
