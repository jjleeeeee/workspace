# Token, Font, And Pixel Rules

## Tokens

- Token values are the source of truth for semantic color, spacing, and
  typography intent.
- Alpha token semantics beat raw Figma paint opacity.
- Do not add CSS `opacity` on top of alpha tokens such as `*-100a`, `*-200a`, or
  `*-300a` unless the source note records a separate layer opacity.

## Fonts

- Concrete Figma `fontFamily` values are part of the rendered baseline.
- Classify Figma fonts as `actual-font`, `system-alias`, `token-alias`, or
  `unknown`.
- For system aliases, prefer `"<FigmaFont>", OS system fallback, token fallback`.
- Treat `WeGothicSans` as a macOS system alias for SF / Apple SD Gothic style
  rendering.
- Classification results belong in `03_wf-figma-to-description` YAML
  `typography` section. When a Figma Description exists for this component,
  read the `typography` field first before re-deriving classification.

## Text Behavior

- `textAutoResize` is part of the text contract, not decorative metadata.
- Do not add default `white-space: nowrap`, `text-overflow: ellipsis`, or
  line-clamp unless Figma source explicitly confirms truncation/overflow policy.
- Parent fixed height or a one-line sample screenshot is not evidence of
  ellipsis.
- Preventing a text node from invading sibling slots is not the same as
  truncation. Use containment that preserves the parent contract. If the parent
  is hug/min-height based, let wrapping grow the row. Use clipping or visible
  ellipsis only when Figma confirms fixed-height behavior or runtime explicitly
  opts in.
- If truncation is needed for runtime safety but absent from Figma, expose it as
  an explicit opt-in behavior and record the decision in the source note.

## Pixel Priority

- Figma rendered baselines are the source of truth for final component size,
  layout, radius, and background parity.
- Figma sample rendered size is an observed result, not automatically a CSS
  sizing contract.
- Size mismatch is never renderer noise.
- If token values and rendered baselines conflict, record the conflict in source
  note `Known Gaps` and `history/` before hardcoding.
