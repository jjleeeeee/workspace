---
type: workflow-decision
date: 2026-05-08
status: accepted
---

# Coverage-Aligned Visual Gate

## Context

`TextFields` was marked as passing `visual:diff` even though the manual
FigmaCompare view clearly showed missing nested Input content: country code,
divider, placeholder, trailing TextButton, timer, and Guide Message text.

The automated diff compared only the registered `Playground` component element,
not the FigmaCompare side-by-side screen. The pixel threshold also allowed the
mostly-empty shell to pass because the missing content occupied a small ratio of
the total white baseline image.

## Decision

Visual registry entries now carry explicit scope:

- `comparisonScope="full-parity"`: may be used as a Figma parity pass/fail gate.
- `comparisonScope="structure-only"`: useful for layout drift, not full parity.
- `comparisonScope="shell-only"`: useful for outer shell review, not full parity.

Each entry also carries `isParityGate`.

Partial/deferred source coverage that affects the registered baseline must use
`isParityGate=false`. Non-gating visual diff output is review evidence only and
must be reported as `INFO/non-gating`, not `PASS`.

## Follow-Up

- `TextFields` is registered as `shell-only` until nested Input and Guide
  Message default content are implemented.
- `ListItemNative` remains `structure-only` while branch/media parity is still
  partial/rest-inventoried.
- `rules:audit` now checks visual registry scope against source-note coverage.
