# Parent Container, Child Contract

## Trigger

Read this before implementing a parent component that visually repeats or wraps
another DS component, such as Menu, Dropdown, Select, List, Sheet, Dialog, Card,
or grouped rows.

## Lesson

A parent component must not steal a child component's contract. If the child
owns row typography, padding, status, icon slots, or internal layout, the parent
should compose the child through public props instead of recreating those
details with private CSS.

## Apply

- Define the parent responsibility first: surface, bounds, placement, clipping,
  scrolling, grouping, or state orchestration.
- Define the child responsibility separately: row/body/content layout,
  typography, leading/trailing slots, disabled visual, and nested assets.
- If the parent needs a special child shape, add a verified child composition
  branch through public props.
- Do not use CSS scale, parent selectors, or private duplicate markup to force a
  child into the parent.
- Document the parent-specific child branch in both source notes when it becomes
  reusable.

## Source Cases

- `src/figma/menu.source.md`
- `src/figma/list-item-native.source.md`
- `retrospectives/retrospective_menu-list-item-composition_2026-05-07.md`
