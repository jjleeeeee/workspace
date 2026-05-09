---
title: BadgeNumber font mismatch resolution
date: 2026-05-05
component: BadgeNumber
category: font-rendering
status: resolved
---

# BadgeNumber Font Mismatch Resolution

## Context

`BadgeNumber` matched the Figma baseline size at `39x16`, but failed visual diff:

- Before: `visualDiff=0.054843`, `visualMatch=0.945157`
- Layout size: matched
- Visual size: matched

The diff was concentrated in text pixels. Background color and component bounds matched.

## Root Cause

The implementation treated `WeGothicSans` as an unavailable Figma-only font and fell back to the local typography token family (`Pretendard`).

User clarification: `WeGothicSans` should be treated as a macOS system font in this environment.

## Decision

Use `WeGothicSans` as the first font family for `BadgeNumber`, treat it as a
macOS system font alias, then add OS/system fallback before the typography token
fallback:

```css
font-family: "WeGothicSans", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo",
  var(--cds-typography-default-font-family-body, Pretendard, ui-sans-serif, system-ui, sans-serif);
```

This is classified as a `font-rendering` / `token-mapping` issue, not a component box model issue.

## Result

After the change:

- `BadgeNumber`: `visualDiff=0.000178`
- `BadgeNumber`: `visualMatch=0.999822`
- All current visual diff entries pass.

## Workflow Lesson

When Figma development data names a concrete font family, do not silently replace
it with the generic typography token. First classify whether that family is an
actual font, system alias, token alias, or unknown value.
