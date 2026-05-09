# Partial Coverage Labeling

## Trigger

Read this when a component is useful but does not cover every Figma branch yet.

## Lesson

Partial coverage is acceptable only when it is visible. A component must not
look complete in source notes, Storybook docs, or review surfaces when it only
implements a default branch or a subset of nested modules.

## Apply

- Use explicit status values such as `partial/rest-inventoried`,
  `partial/default-only`, or `deferred`.
- Put the coverage status in the source note and Storybook docs.
- Keep branch gaps out of vague `Known Gaps` when they are actually scoped
  deferred coverage.
- Do not register broad visual parity until representative branch baselines
  exist.
- Do not build parent consumers on top of a partial component without naming the
  dependency risk.

## Source Cases

- `retrospectives/retrospective_list-item-native_2026-05-07.md`
- `rules/nested-composition.md`
