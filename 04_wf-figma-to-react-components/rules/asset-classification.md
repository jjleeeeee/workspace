# Asset Classification Rules

Classify visual assets before mapping or implementation.

## Classifications

- `icon component`: Figma structure confirms an icon glyph. Use `ChordIcon`.
- `icon_area wrapper`: sizing wrapper only, not an SVG asset.
- `component state shape`: component-owned shape such as ellipsis, caret,
  progress ring, or radio dot.
- `component fallback`: no-image, empty, or loading fallback rendered by the
  component when consumer content is absent.
- `placeholder`: temporary replacement with a recorded production condition.
- `unknown`: source is unclear; use slot-only or `Known Gaps`.

## Rules

- Shape similarity is not evidence.
- Do not silently replace icon, loading, image, logo, or badge assets with text,
  emoji, or CSS drawings.
- Do not import `src/assets/icons/*.svg` directly from components; use
  `ChordIcon name="..."` for mapped DS icons.
- Do not force Figma `Specialtype` or `_special` SVG icons to black or
  `currentColor`; preserve original SVG color.
- No-image/empty fallback assets are component fallback states, not consumer
  `src` sample media.
- Nested fallback marks/logos must use Figma rendered bounds and alignment; do
  not stretch them to the parent frame.

Detailed export flow lives in `workflow/icon-asset-registry.md`.
