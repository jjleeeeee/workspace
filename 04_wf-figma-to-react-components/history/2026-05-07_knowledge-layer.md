# Knowledge Layer Decision

Date: 2026-05-07

## Decision

Add `knowledge/` as a reusable learning layer between long retrospectives and
hard workflow rules.

## Reason

`AGENTS.md` was already becoming a routing contract. Adding every lesson there
would make it too long and increase the chance that important constraints get
ignored. `rules/` should also stay reserved for required or forbidden
interpretations, not every useful lesson.

The new layer keeps roles separate:

- `retrospectives/`: detailed event records
- `knowledge/`: reusable lessons from those records
- `rules/`: strong policy and forbidden interpretations
- `workflow/`: step order and gates
- `history/`: decisions that changed the system

## Scope

The first implementation adds a README, six starter knowledge cards, read-order
links, retrospective promotion sections, and a light audit script.

The audit intentionally checks structure only:

- `knowledge/README.md` exists
- every knowledge card is indexed
- every retrospective has `Lessons Promoted`
- linked knowledge files exist

It does not judge lesson quality or automatically promote rules.
