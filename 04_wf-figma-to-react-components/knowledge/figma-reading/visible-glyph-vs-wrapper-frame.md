# Visible Glyph vs Wrapper Frame

## Trigger

Read this when a small visual attachment looks position-sensitive: badge dots,
count badges, close icons, avatar decorations, chip badges, toggle knobs, or
any tiny visual nested inside a larger clickable/control area.

## Lesson

The visible glyph is not always the layout object. Figma often positions a
wrapper frame in auto-layout, then aligns the visible dot/icon/vector inside
that frame. CSS should reproduce the wrapper frame contract first, then the
visible glyph alignment inside it.

## Apply

- Record both wrapper frame bounds and visible glyph/vector bounds.
- Classify placement as `auto-layout child`, `absolute overlay`, `slot frame`,
  or `unknown` before writing CSS.
- Do not infer `top/right` overlay positioning from the visible pixel alone.
- When the wrapper frame is the layout child, align the frame against the parent
  and align the glyph inside the frame separately.
- Add a targeted visual baseline for the attachment state when the default
  component baseline does not exercise it.

## Source Cases

- `retrospectives/retrospective_chips_2026-05-08.md`
- `src/figma/chips.source.md`
- Chips `Badge_Dot`: Figma node `82119:48720` uses an `8x14` trailing frame
  with a `4x4` visible dot aligned to the frame top.
