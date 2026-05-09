# Desktop Bridge Stop And Ask

Date: 2026-05-08

## Decision

Make the Desktop Bridge failure rule explicit in `docs/AI_RULES.md`.

## Context

`workflow/exceptions.md` already said to stop all work when Console MCP Desktop
Bridge is not connected and ask the user to run the Desktop Bridge plugin before
retrying. After moving shared rules into `docs/AI_RULES.md`, that rule remained
in the detailed workflow docs but was not visible in the canonical first-read
rule file.

## Chosen Scope

- Add a Workflow Gate rule to stop, report, and ask for reconnect/retry when
  Console MCP Desktop Bridge is disconnected or required MCP reads fail.
- Add the same condition to Critical Forbidden so source-note and component
  implementation cannot continue on incomplete live Figma reads.

## Follow-Up

- Keep recovery details in `workflow/exceptions.md`.
- Keep first-read blocker rules surfaced in `docs/AI_RULES.md`.
