# CLAUDE.md - Claude Code Adapter

@docs/AI_RULES.md

Before doing any work in this project, read and follow `docs/AI_RULES.md`.
Treat the imported rules as binding project instructions.

This file is a Claude Code adapter. `docs/AI_RULES.md` is still the canonical
shared rule source, but the high-risk rules below are repeated here so they stay
visible in Claude memory.

## Claude Critical Rules

- If Console MCP Desktop Bridge is disconnected or a required MCP read fails,
  stop immediately, report the blocker, and ask the user to reconnect/retry.
- Do not create or update `src/figma/<component>.source.md` without successful
  live Figma reads from the required MCP tools.
- Do not implement components without a source note backed by live Figma reads.
- Do not use variant detail markdown files as source of truth.
- Do not infer unknown visual/spec values without Figma data, token data, user
  input, or source note gaps.
- Do not mark component work done without the validation gates in
  `docs/AI_RULES.md`.

## Claude Development Workflow

- Before implementing any feature, bugfix, refactor, or behavior change, invoke
  the relevant Superpowers skill first.
- For production code changes, use `superpowers:test-driven-development` before
  writing implementation code.
- Write or update the failing test first, run it, then implement the minimum
  code to pass.
- If TDD is not appropriate because the task is docs-only, config-only,
  generated output, or a throwaway prototype, state that reason before
  proceeding.
