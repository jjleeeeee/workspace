---
title: Alpha token policy
date: 2026-05-05
category: workflow
status: accepted
---

# Alpha Token Policy

## Context

`ToggleSwitch` disabled thumb exposed a token interpretation error. Figma API
reported the thumb paint as white with opacity `0.3`, while the bound token was
`system/fixed_color/surface/default-reverse-300a`.

The first implementation used the alpha token and CSS opacity together, which
created double alpha and made the thumb too faint.

## Decision

When a Figma paint has `boundVariables`, resolve the token meaning first.

If the token name already encodes alpha, such as `*-50a`, `*-100a`, `*-200a`,
or `*-300a`, use the token CSS variable without extra CSS `opacity`.

CSS `opacity` is allowed only when:

- opacity is not represented by a bound token, or
- the source note explicitly records it as a separate layer/part opacity.

## Example

Use:

```css
--toggle-thumb: var(--cds-system-fixed-color-surface-default-reverse-300a, #ffffff4d);
--toggle-thumb-opacity: 1;
```

Do not use:

```css
--toggle-thumb: var(--cds-system-fixed-color-surface-default-reverse-300a, #ffffff4d);
--toggle-thumb-opacity: 0.3;
```

## Workflow Lesson

Raw Figma paint opacity is not always an implementation instruction. It may be
the rendered decomposition of an alpha token. Token semantics must be checked
before translating raw opacity into CSS.
