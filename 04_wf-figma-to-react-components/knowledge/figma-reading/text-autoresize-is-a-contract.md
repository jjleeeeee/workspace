# Text AutoResize Is A Contract

## Trigger

Read this when implementing text-heavy components such as ListItem, Menu rows,
Tooltip, Snackbar, Tags, Chips, TextField, or any component where long text may
overflow its sample frame.

## Lesson

Figma `textAutoResize` is not incidental metadata. It is a signal for how text
is expected to size or wrap. If Figma does not explicitly mention truncation,
ellipsis, line clamp, max lines, or clipping, default CSS one-line ellipsis is
an implementation guess.

## Apply

- Record `textAutoResize`, text node bounds, parent sizing, and any explicit
  overflow policy in `Text Behavior Notes`.
- Treat sample one-line text as sample content, not proof of truncation.
- Do not add `white-space: nowrap`, `text-overflow: ellipsis`, or line clamp by
  default.
- If the parent/root is hug or min-height based, let text wrapping grow the row
  before reaching for clipping or ellipsis. Use fixed clipping only when Figma
  confirms a fixed-height contract or product runtime explicitly opts in.
- If product/runtime safety needs truncation, make it opt-in and document that
  it is not a Figma-facing default.

## Source Cases

- `src/figma/list-item-native.source.md`
- ListItemNative title/body text: Figma node `81275:904969` exposes
  `Title textAutoResize=WIDTH_AND_HEIGHT` and `Body textAutoResize=HEIGHT`,
  while the earlier implementation still added implicit one-line ellipsis.
