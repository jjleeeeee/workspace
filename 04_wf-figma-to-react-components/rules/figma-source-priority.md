# Figma Source Priority Rules

## Priority

1. User intent and current request.
2. Console MCP component description and enriched metadata.
3. Framelink/Figma MCP child node design context.
4. Figma screenshot or component image.
5. Local token JSON.
6. Existing `src/figma/<component>.source.md`.
7. Browser smoke and visual review result.
8. LLM inference.

## Rules

- Use `index.md` only as an address registry for `nodeId` and `componentKey`.
- Do not use variant detail markdown files as source of truth.
- Do not let old implementation choices override live Figma reads.
- If a value is not confirmed, leave it out or record it in `Known Gaps`.
- Record workflow-level source priority changes in `history/`.
