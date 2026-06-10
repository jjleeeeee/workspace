# Nested Module Inventory

## Trigger

Read this before implementing any parent component that contains named nested
modules such as Leading, Trailing, Content, Title, Body, Button, Slot, or
Optional modules.

## Lesson

A complex component is not defined by its default screenshot. Nested component
sets often own their own enums, booleans, text props, instance swaps, and asset
roles. Those nested contracts must be inventoried before implementation starts.

## Apply

- Read the parent node first, then identify nested modules from composition,
  assets, property names, and visible child names.
- Read each nested component set separately when it has its own node/key or
  property dropdown.
- Record nested role, node/key, owner type, options, required child atoms, and
  coverage in the source note.
- When a parent repeats or wraps a child component, identify which behavior is
  parent-owned and which remains child-owned.
- Treat hidden dropdown options as contract candidates even when the default
  screenshot does not show them.
- Implement only after coverage is labeled `complete`, `partial`, or
  `deferred`.

## Source Cases

- `retrospectives/retrospective_list-item-native_2026-05-07.md`
- `src/figma/list-item-native.source.md`
