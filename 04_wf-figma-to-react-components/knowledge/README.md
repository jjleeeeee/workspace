# Knowledge Layer

`knowledge/` contains reusable lessons extracted from retrospectives. It is the
middle layer between long event records and hard workflow rules.

## Role

- `retrospectives/`: what happened, why it happened, and what we learned.
- `knowledge/`: reusable learning cards for future component work.
- `rules/`: strong required or forbidden interpretations.
- `workflow/`: execution order and gates.
- `history/`: decisions that changed folder structure, policy, or validation.

## Promotion Path

```text
retrospective -> knowledge -> rules/workflow -> audit
```

- Promote to `knowledge/` when a lesson is likely to apply to another component.
- Promote to `rules/` only when the lesson must become a required or forbidden
  interpretation.
- Promote to `workflow/` only when the step order or required gate changes.
- Promote to an audit script only when the failure pattern can be detected from
  local files without guesswork.

## How To Read

Do not read every card before every task. Pick cards by trigger:

- Complex parent or nested modules:
  - [Nested Module Inventory](component-complexity/nested-module-inventory.md)
  - [Partial Coverage Labeling](component-complexity/partial-coverage-labeling.md)
  - [Parent Container, Child Contract](component-complexity/parent-container-child-contract.md)
- Figma source read uncertainty:
  - [Default Screenshot Is Not Contract](figma-reading/default-screenshot-is-not-contract.md)
  - [MCP vs REST API](figma-reading/mcp-vs-rest-api.md)
  - [Description vs Live Variant Divergence](figma-reading/description-vs-live-variant-divergence.md)
  - [Visible Glyph vs Wrapper Frame](figma-reading/visible-glyph-vs-wrapper-frame.md)
  - [Text AutoResize Is A Contract](figma-reading/text-autoresize-is-a-contract.md)
  - [Inline Adornment Text Flow](figma-reading/inline-adornment-text-flow.md)
  - [Nested Instance Swap Discovery](figma-reading/nested-instance-swap-discovery.md)
- Asset or icon ambiguity:
  - [Icon Area vs Icon Asset](assets/icon-area-vs-icon-asset.md)
  - [chord-icons Registry Verification](assets/chord-icons-registry-verification.md)
- Pixel or token mismatch:
  - [Token vs Rendered Pixel](visual-validation/token-vs-rendered-pixel.md)
- Visual diff baseline contains media or sample content:
  - [Media-Dependent Baselines](visual-validation/media-dependent-baselines.md)
- FigmaCompare story is missing a baseline image:
  - [FigmaCompare Baseline Required](visual-validation/figma-compare-baseline-required.md)
- CSS layout sizing is wrong despite correct numbers in code:
  - [Box-Sizing Audit Pattern](css-layout/box-sizing-audit-pattern.md)
- Slot prop is correct but container looks wrong in a story:
  - [Slot-Container CSS Coupling](css-layout/slot-container-css-coupling.md)

## Card Template

```md
# Card Title

## Trigger

When to read this card.

## Lesson

The reusable lesson.

## Apply

Short actions to take next time.

## Source Cases

Retrospective or history files that produced the lesson.
```

## Retrospective Requirement

Every new retrospective must include:

```md
## Lessons Promoted

- Knowledge: `knowledge/...`
- Promotion: `none | knowledge | rules | workflow | audit`
- Reason:
```

If no reusable lesson was found, write `None`.
