# Nested Instance Swap Discovery

## Trigger

Read this when a component's Figma design panel shows a swappable slot (e.g.,
"Leading", "Icon") with multiple type options, but neither Console MCP
(`componentPropertyDefinitions`) nor the REST API (`propertyDefinitions`) exposes
that property.

## Lesson

`componentPropertyDefinitions` (Plugin API) and `propertyDefinitions` (REST API)
only return **promoted** properties — those explicitly surfaced at the component
set level. Nested instance swaps that are NOT promoted are invisible to both APIs.

The Figma UI shows nested instance overrides automatically in the Design panel,
which is why a "Leading" dropdown with Avatar / Checkbox / Icon / Radio /
Rectangular Thumbnail / Square Thumbnail is visible to the designer but absent
from API reads.

**How to discover the real swap options:**

1. Read a specific child variant node (not the component set root) with `depth ≥ 3`
   using Framelink REST API (`get_figma_data`).
2. Find the nested INSTANCE node (e.g., `name: "Leading", type: INSTANCE`).
3. Read its `componentId` — this is the currently selected variant.
4. Read its `componentSetId` — this is the **Leading component set** that holds
   all swap options (e.g., `_atoms / modules / Leading (Optional)`).
5. Read that component set directly to enumerate all variant Types.

**Example trace (ListItemWeb):**

```
ListItemWeb variant (69579:9080)
  └─ state layer
       └─ Leading (INSTANCE, componentId: 63354:137265)
            ├─ componentId → "Type=Square Thumbnail" (current)
            └─ componentSetId → 57343:20398
                 = "_atoms / modules / Leading (Optional)"
                 Types: Avatar | Checkbox | Icon | Radio |
                        Rectangular Thumbnail | Square Thumbnail
```

## Apply

- When a slot looks fixed by API but the Figma UI shows a dropdown: read a child
  variant with depth ≥ 3, trace `componentId` → `componentSetId`, then read the
  component set.
- Update the source note's `assets` and `composition` sections with the real
  component set name, node id, and all Types.
- In React, an unpromoted nested instance swap maps to `slotName?: ReactNode`
  (flexible) — the consumer passes the appropriate DS component. Document the
  valid DS types in a JSDoc comment or prop description.
- Do NOT assume a slot is "fixed to one type" based on API output alone.

## Source Cases

- `src/components/ListItemWeb/` — Leading slot investigation, 2026-05-08
- `src/components/ListItemWeb/` — Leading type correction, 2026-05-08: Knowledge
  card existed but trigger was missed. Previous session read only the active
  Square Thumbnail variant and concluded Leading was fixed to one type. Correct
  result (6 types) was only recovered after user explicitly pointed back to
  Figma. **Lesson: knowledge cards require a trigger; rules do not. This pattern
  is now a forbidden rule in `rules/nested-composition.md` so it is enforced
  without a trigger.**
