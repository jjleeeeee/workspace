---
title: Figma fontFamily system alias policy
date: 2026-05-05
category: workflow
status: accepted
---

# Figma FontFamily System Alias Policy

## Context

`BadgeNumber` exposed a font mapping issue. Figma development data named
`WeGothicSans`. The first workflow update treated concrete Figma `fontFamily`
values mainly as actual fonts available in the runtime.

User clarification: `WeGothicSans` was created to represent macOS SF and
Apple SD Gothic style rendering. It should effectively be treated as a system
font alias, not necessarily as a bundled/distributable font asset.

## Decision

Source notes and implementation should classify Figma `fontFamily` values as:

- `actual-font`
- `system-alias`
- `token-alias`
- `unknown`

For `system-alias`, keep the Figma fontFamily first when it improves Figma
rendered parity, then add OS/system fallback, then token fallback.

Example:

```css
font-family: "WeGothicSans", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", var(--cds-typography-default-font-family-body, Pretendard, ui-sans-serif, system-ui, sans-serif);
```

## Consequence

Do not jump directly from a Figma font family name to generic typography token
fallback. First identify whether the Figma name is an actual font, system alias,
token alias, or unknown value.
