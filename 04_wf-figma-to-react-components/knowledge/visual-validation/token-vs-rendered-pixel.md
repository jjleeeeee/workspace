# Token vs Rendered Pixel

## Trigger

Read this when a component uses token values but visual diff or Figma compare
still shows a size, color, radius, opacity, or typography mismatch.

## Lesson

Tokens are the semantic system source. Figma rendered output is the component
pixel target. A token being present does not automatically prove the rendered
component is correct.

## Apply

- First check comparison environment: scale, DPR, background, wrapper, and font
  loading.
- Confirm the Figma-bound token and source note token mapping.
- If token mapping is correct but pixels differ, inspect CSS box model,
  intrinsic size, line-height, radius, and layout.
- If token and rendered output structurally conflict, record the mismatch before
  hardcoding.
- Do not combine alpha tokens with extra opacity unless source evidence confirms
  a separate layer opacity.

## Source Cases

- `history/2026-05-05_token-vs-pixel-priority.md`
- `history/2026-05-05_text-button-size-mismatch.md`
- `history/2026-05-05_alpha-token-policy.md`
