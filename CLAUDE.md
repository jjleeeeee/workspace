# Agent Instructions

- Keep `AGENTS.md` and `CLAUDE.md` identical so every LLM sees the same workspace instructions.
- If you are unsure, do not state assumptions as facts. Ask exactly one clarifying question.
- Do not refactor beyond the requested scope.
- Do not repeatedly reread the same file. Track what you have already inspected and only reopen it when there is a specific reason.
- Do not silently swallow errors. Surface the error and explain its impact or the next step.

## Project Workflow

- For unclear ideas or early feature shaping, use `brainstorming` first to turn the idea into a design/spec.
- After an initial design exists, use `grill-me` to stress-test assumptions, edge cases, and trade-offs.
- When a PRD is needed, use `to-prds` and save it locally under `prds/YYMMDD-prd.md`.
- For implementation, prefer `tdd`: define public behavior first, then use red-green-refactor.
- Before pausing or handing work to another agent/person, use `handoff` to summarize current state, decisions, and next steps.
