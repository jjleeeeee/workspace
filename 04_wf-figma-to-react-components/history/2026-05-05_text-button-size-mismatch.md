# TextButton Size Mismatch Resolution

Date: 2026-05-05

## Issue

`TextButton` failed the visual diff size gate.

- Figma layout baseline: `63x40`
- Storybook actual before fix: `65x40`

## Root Cause

The filled Figma representative node `52753:39957` has `strokes: []`, while the
CSS applied a real `1px` border to the base button. Browser auto width included
the left and right border pixels, adding 2px.

## Decision

Use `border: 0` for layout and render stroke-like variants with an inset visual
stroke. This matches Figma's inside-stroke model without changing auto width.

## Result

- Storybook actual after fix: `63x40`
- `text-button-default` visual diff: passed
- Remaining visual diff failure is `BadgeNumber`, unrelated to this fix.
