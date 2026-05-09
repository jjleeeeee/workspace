# Gate Matrix And Validation Drift

## Date

2026-05-08

## Context

Workflow guidance had grown across `docs/AI_RULES.md`, `README.md`,
`PLAYBOOK.md`, and `workflow/*.md`. The direction was mostly consistent, but
entry order, completion commands, and MCP failure handling were easy to read as
separate contracts.

## Decision

- Make `docs/AI_RULES.md` the single shared gate matrix.
- Keep `AGENTS.md` and `CLAUDE.md` as thin tool adapters.
- Align completion commands across `README.md`, `PLAYBOOK.md`,
  `workflow/README.md`, and `workflow/validation-checklist.md`.
- Clarify required parent/representative MCP reads vs deferrable nested reads.
- Require new or touched source notes to include required sections or explicit
  `N/A` entries.
- Extend `npm run rules:audit` to catch completion command drift in the core
  workflow docs.

## Result

The workflow now has one canonical completion path:

```bash
npm test
npm run typecheck
npm run build-storybook
npm run visual:baseline
npm run visual:diff
npm run rules:audit
npm run knowledge:audit
```

Browser smoke remains required separately because it needs a running Storybook
static server and visual/manual confirmation.

## Verification

- `npm run rules:audit`
- `npm run knowledge:audit`
