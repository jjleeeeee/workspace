# Description vs Live Variant Divergence

## Trigger

Read this card when a Figma component description says a state or variant behaves one way, but the component is complex enough to contain nested modules, optional slots, state-specific branches, or sampled live variants.

## Lesson

Figma description is a strong contract source, but it is not always the final proof of every rendered branch. A description can summarize behavior while a live variant node contains additional swaps, changed dimensions, direct child instances, or hidden branch-specific structure.

In `ListItemWeb`, the description said `States=Disabled` applies `0.2` opacity to the state layer. That was true but incomplete: the live `Mode=Default, Size=Small, States=Disabled` node also swapped trailing from `TextAndIcon` to a `20x20 Check` branch, used a direct divider, and rendered as `393x56`.

## Apply

- Read the parent component set description first.
- Read the default variant, then at least the representative state/size variants that can change child branches.
- For each representative variant, inspect actual child instance ids, component ids, variant props, dimensions, opacity, and optional-slot presence.
- If description and live node diverge, record it as `description vs live variant divergence` in the source note.
- Do not silently choose one source. State the decision:
  - follow live node for rendered branch parity,
  - keep description as product contract,
  - or mark the conflict deferred until design clarification.
- Add a branch-specific baseline when the divergence changes rendered size, trailing/leading module, divider structure, or other visible layout.

## Source Cases

- [List_Item_Web Retrospective](../../retrospectives/retrospective_list-item-web_2026-05-08.md)
- `src/figma/list-item-web.source.md`
