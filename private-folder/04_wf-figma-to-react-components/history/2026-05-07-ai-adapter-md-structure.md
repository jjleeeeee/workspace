# AI Adapter MD Structure

Date: 2026-05-07

## Decision

Move shared AI project rules into `docs/AI_RULES.md` and keep `AGENTS.md` and
`CLAUDE.md` as thin tool-specific adapters.

## Context

The workflow needs to be usable from both Codex and Claude Code without
duplicating long rule blocks. Duplicated rule files are easy to drift when
source priority, validation gates, or forbidden interpretations change.

## Chosen Scope

- Add `docs/AI_RULES.md` as the canonical shared rule source.
- Keep `AGENTS.md` as a Codex read-first adapter.
- Add `CLAUDE.md` as a Claude Code read-first adapter with `@docs/AI_RULES.md`.
- Update `README.md` onboarding and folder map.
- Do not change runtime code, scripts, workflow folders, or component files.

## Follow-Up

- Put future shared rule edits in `docs/AI_RULES.md`.
- Put only tool-specific startup behavior in `AGENTS.md` or `CLAUDE.md`.
- Keep detailed policies in `rules/` and detailed procedures in `workflow/`.
