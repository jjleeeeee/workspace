# Nested Composition Rules

Nested DS atoms must be composed through public props, not resized by CSS hacks.

## Rules

- **Do not conclude a nested instance swap slot is fixed to one type based on
  API output alone.** Both Plugin API (`componentPropertyDefinitions`) and REST
  API (`propertyDefinitions`) only return *promoted* properties. A slot that
  looks single-type in the API may have 6+ types in Figma. Always read the
  component set behind the slot directly before concluding the type list.
- For complex components, run a Recursive Nested Module Inventory before
  deciding the public API or implementation scope.
- Do not resize nested DS atoms with CSS `scale()`, percentage sizing, or
  arbitrary frame overrides.
- Read the nested Figma instance and map parent size to nested atom
  variant/size props.
- Parent component size can change nested atom size. Do not infer the whole
  table from one representative node.
- Record parent size, nested component, variant/size, frame size, offset, and
  visibility in the source note.
- If a nested visual is not a DS atom, classify it as asset, state shape,
  fallback, placeholder, or unknown before implementation.

## Recursive Nested Module Inventory

- Extract nested candidates from parent `description.composition.uses`,
  `description.assets.source`, component set keys, and nested node ids.
- If a nested item is a component set or module, read that node separately with
  MCP before implementation.
- Record nested variant axes, boolean props, text props, instance swaps, asset
  roles, and required child atoms/assets.
- Treat nested enums that are not visible in the default screenshot as contract
  candidates, not as absent behavior.
- Mark each nested module coverage as `complete`, `partial`, or `deferred`.
- Unimplemented nested enum branches are `deferred coverage`, not vague
  `Known Gaps`.
- If only the parent default path is implemented, call it `partial/default-only`
  in the source note and Storybook docs.

Detailed component build procedure lives in `workflow/component-build-loop.md`.
