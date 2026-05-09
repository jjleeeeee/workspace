# Inline Adornment Text Flow

## Trigger

Read this when a text label has a badge, icon, suffix, prefix, required marker,
or status dot visually attached to it.

## Lesson

An adornment that appears next to text in Figma is not automatically a sibling
slot in code. Figma auto layout can make a text-owned badge look like a flex
item, but the intended contract may be that it follows the rendered end of the
text after wrapping.

## Apply

- Check whether the adornment is owned by the text module or by the parent
  container.
- Record whether it attaches to the `rendered-text-end`, `container-end`, or a
  fixed slot.
- If it follows text, keep it in the inline text flow instead of placing it
  after a full-width text span.
- Add a long-text regression story when wrapping can change the adornment
  position.
- Do not infer container-end alignment from a short default label.

## Source Cases

- `retrospectives/retrospective_list-item-native-text-flow_2026-05-08.md`
- `src/figma/list-item-native.source.md`
