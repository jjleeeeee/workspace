# Claude Superpowers TDD Trigger

Date: 2026-05-08

## Decision

Add explicit Superpowers and TDD trigger rules to `CLAUDE.md`.

## Context

Superpowers was installed for Claude Code, but installation alone does not make
Claude invoke the relevant skills during implementation work. Codex was already
following a TDD-oriented workflow more reliably, while Claude needed a
project-memory reminder that feature, bugfix, refactor, and behavior-change
work should invoke Superpowers and use TDD before production code changes.

## Chosen Scope

- Add a short `Claude Development Workflow` section to `CLAUDE.md`.
- Require `superpowers:test-driven-development` before production code changes.
- Allow explicit TDD exceptions for docs-only, config-only, generated output, or
  throwaway prototypes when Claude states the reason first.
- Do not change `AGENTS.md` or the shared `docs/AI_RULES.md` for this
  Claude-specific behavior.

## Follow-Up

- If Claude still skips TDD, consider moving this reminder to
  `~/.claude/CLAUDE.md` as a user-level rule.
- Keep project-specific workflow details in `docs/AI_RULES.md` and
  `workflow/`.
