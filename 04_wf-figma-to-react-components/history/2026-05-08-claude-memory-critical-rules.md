# Claude Memory Critical Rules

Date: 2026-05-08

## Decision

Keep `docs/AI_RULES.md` as the canonical shared rule source, but repeat a short
set of high-risk operational rules directly in `CLAUDE.md`.

## Context

Claude Code showed both `./CLAUDE.md` and `docs/AI_RULES.md` in `/memory`, so
the import path was working. The remaining risk was that critical blocker rules
could be too indirect during execution, especially Desktop Bridge failure,
source-note preconditions, source-of-truth limits, and validation gates.

## Chosen Scope

- Keep `AGENTS.md` thin for Codex.
- Keep the full shared rule set in `docs/AI_RULES.md`.
- Add only high-risk Claude-visible rules to `CLAUDE.md`.
- Do not fully duplicate the shared rule file or revert the adapter structure.

## Follow-Up

- Update `docs/AI_RULES.md` first when shared policy changes.
- Mirror only execution-critical Claude memory reminders in `CLAUDE.md`.
- If Claude still ignores direct `CLAUDE.md` rules, reconsider reverting the
  adapter pattern for this project only.
