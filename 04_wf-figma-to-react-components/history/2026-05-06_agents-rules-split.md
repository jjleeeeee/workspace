# AGENTS Rules Split

Date: 2026-05-06

## Decision

Split the growing `AGENTS.md` Forbidden section into a dedicated `rules/`
folder, while keeping `AGENTS.md` as a short routing contract.

## Context

Component implementation retrospectives kept adding repeatable rules about
asset classification, token/pixel priority, fallback assets, Storybook controls,
and nested atom composition. Keeping all details in `AGENTS.md` made every rule
look equally urgent and increased the chance of missing the most important gate.

## Chosen Scope

- Add `rules/` as human-readable policy documents.
- Keep `workflow/` as step-by-step procedure.
- Keep `PLAYBOOK.md` as the short operating contract.
- Add `npm run rules:audit` for local patterns that can be detected reliably.
- Do not add a pre-commit hook yet.

## Reasoning

The first pass should reduce reading load without creating too much process
weight. A pre-commit hook can be added later if the audit script proves useful
and low-noise during component work.

## Follow-Up

- Add audit checks only for patterns that can be detected without guesswork.
- When a retrospective creates a repeatable decision, add it to `rules/` first.
- If the same violation recurs, add or refine an audit rule.
