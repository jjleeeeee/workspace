# Rules Guide

`rules/` contains repeatable policy decisions that became too detailed for
`AGENTS.md`.

## Read Order

1. `figma-source-priority.md`
2. `asset-classification.md`
3. `token-font-pixel.md`
4. `nested-composition.md`
5. `storybook-validation.md`

## How To Use

- `AGENTS.md` is the short routing contract.
- `PLAYBOOK.md` is the short operating contract.
- `workflow/` explains step-by-step procedure.
- `rules/` explains repeated decisions and forbidden interpretations.
- `scripts/audit-workflow-rules.mjs` checks only rules that can be detected
  reliably from local files.

When a retrospective creates a repeatable rule, add it here first. Add an audit
check only when the failure pattern can be detected without guesswork.
