# Source Note Required Section Audit

## Date

2026-05-08

## Context

`workflow/source-note-contract.md` required several source-note sections, but
legacy `src/figma/*.source.md` files did not consistently include those headings.
The workflow contract was stronger than the local audit.

## Decision

- Backfill all legacy source notes with the missing required section headings.
- Use explicit legacy notes instead of inferring missing Figma evidence.
- Add `source-note-missing-required-heading` to `npm run rules:audit`.
- Treat legacy `N/A` backfill as a prompt to re-read Figma before changing that
  component contract.

## Result

All `src/figma/*.source.md` files now include these headings:

- `Alpha Token Notes`
- `Font Mapping Notes`
- `Text Behavior Notes`
- `Sizing Interpretation Notes`
- `Nested Atom Mapping`
- `Nested Module Inventory`
- `Token vs Rendered Pixel Notes`
- `Known Gaps`

## Verification

- RED: `npm run rules:audit` failed with 211
  `source-note-missing-required-heading` issues after the audit rule was added.
- GREEN: `npm run rules:audit` passed after source-note backfill.
