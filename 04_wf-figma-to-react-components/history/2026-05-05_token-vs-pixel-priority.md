# Token vs Pixel Priority Decision

Date: 2026-05-05

## Decision

Use tokens as the source of truth for semantic system values, and use Figma
rendered baselines as the source of truth for final component pixels.

## Priority

1. Check the visual environment first: baseline scale, DPR, transparent
   background, Storybook wrapper, and font loading.
2. Check that Figma bound tokens and source note token mappings match.
3. If token mapping is correct but rendered pixels differ, fix component CSS,
   box model, border handling, font, or intrinsic sizing.
4. If token value and Figma rendered output structurally conflict, record it in
   source note `Known Gaps` and workflow history before using any override.

## Current Example

`TextButton` currently has a true size mismatch:

- Figma layout baseline: `63x40`
- Storybook actual: `65x40`

This is not treated as font rendering noise or a blurry baseline issue. The fix
belongs to a later component loop.

## Rule

Do not claim parity because a token was used. Do not ignore tokens simply to make
pixel diff pass. Classify the mismatch first, then choose the smallest recorded
fix.
