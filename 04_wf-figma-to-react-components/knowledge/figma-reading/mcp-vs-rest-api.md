# MCP vs REST API

## Trigger

Read this when Framelink, Figma MCP, or Console MCP does not expose enough
component-set detail, or when a user screenshot contradicts the implementation.

## Lesson

MCP design context is a strong first source, but complex component sets may need
Figma REST API or direct Figma UI evidence to expose property definitions and
nested branch structure.

## Apply

- Start with MCP reads because they are faster and include useful visual
  context.
- Use REST API as a targeted audit when nested enum/property coverage remains
  unclear.
- Store REST audit output under `src/figma/rest-audits/` when it affects the
  source note.
- Record which source confirmed each branch so later implementers do not treat
  inferred options as verified.

## Source Cases

- `retrospectives/retrospective_list-item-native_2026-05-07.md`
- `scripts/audit-figma-rest-list-item.mjs`
