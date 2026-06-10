# Icon Area vs Icon Asset

## Trigger

Read this when a Figma description mentions `icon_area`, nested icon names, null
markers, placeholders, or replacement areas.

## Lesson

`icon_area` is a sizing wrapper, not the SVG glyph. Similar shape is not proof
of an icon asset. Only confirmed Figma icon components should be mapped through
the icon registry.

## Apply

- Classify each visual as `icon component`, `icon_area wrapper`, `component
  state shape`, `placeholder`, or `unknown`.
- Use `ChordIcon` only for confirmed icon components.
- Preserve `icon_area` frame size separately from the internal SVG or vector
  bounds.
- Keep null markers and placeholders documented when they are not production
  product icons.
- Do not silently replace unknown assets with text, emoji, or CSS drawings.

## Source Cases

- `history/2026-05-05_icon-asset-registry-workflow.md`
- `rules/asset-classification.md`
- Tag and PaginationList icon-registry correction discussion.
