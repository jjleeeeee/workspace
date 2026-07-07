# AI Rules - Chord DS Figma To React Components Workflow

This is the canonical shared rule source for all AI coding tools in this
project. Read and follow this file before doing any project work.

If this file conflicts with a tool-specific adapter such as `AGENTS.md` or
`CLAUDE.md`, the adapter controls tool startup behavior, but shared project
rules live here.

## Canonical Entry

Use this file as the single shared gate matrix. Tool-specific adapters
(`AGENTS.md`, `CLAUDE.md`) may load this file first, but they must stay thin.
`README.md`, `PLAYBOOK.md`, and `workflow/` should summarize or point back to
this file instead of defining a different completion path.

## Mission

This folder builds trustworthy React + Storybook components from live Chord DS
Figma component data. Build one component at a time, document the Figma read,
verify visually, and record lessons before moving on.

## Read Order

1. Current tool adapter: `AGENTS.md` or `CLAUDE.md` only to route into this file.
2. `docs/AI_RULES.md` (this file).
3. `README.md`.
4. `PLAYBOOK.md`.
5. `rules/README.md`.
6. `knowledge/README.md`.
7. `workflow/README.md`.
8. Step-specific `workflow/*.md`, `rules/*.md`, and triggered `knowledge/*.md`.
9. Target source note: `src/figma/<component>.source.md`.
10. Related files in `src/components/<Component>/`.
11. `retrospectives/` before continuing a component family.
12. `history/` before changing workflow structure, source priority, or validation.
13. `../design-cds-docs/99_ref/ref-figma-component-keys/chord-ds/index.md`
    only to find `nodeId` and `componentKey`

## Workflow Gate

- Treat `docs/AI_RULES.md` as the canonical shared routing contract.
- Treat `PLAYBOOK.md` as the short operating contract.
- Treat `rules/` as repeatable policy and forbidden interpretation.
- Treat `knowledge/` as reusable lessons selected by the current task trigger.
- Treat `workflow/` as the detailed implementation procedure.
- If Console MCP Desktop Bridge is disconnected or a required MCP read fails,
  stop immediately, report the blocker, and ask the user to reconnect/retry
  before continuing.
- Record workflow decisions in `history/`, component learnings in
  `retrospectives/`, and reusable lessons in `knowledge/`.

## Gate Matrix

| Gate | Required action | Output | Stop or defer rule |
| --- | --- | --- | --- |
| Entry | Read the current adapter, then this file, then the playbook/workflow docs needed for the task. | Current task scope and required references. | If docs conflict, this file wins for shared gates. |
| Target | Use `index.md` only to find component `nodeId` and `componentKey`. | Figma entrypoint. | Do not use variant detail markdown as implementation evidence. |
| Source read | Read parent component set metadata, representative child context, and visual image through the required MCP tools. | Source evidence for axes, props, layout, tokens, assets, and baseline. | If Console MCP Desktop Bridge is disconnected or a required parent/representative read fails, stop and ask the user to reconnect or retry. |
| Nested read | If nested component sets/modules are discovered, read them separately before finalizing implementation scope. | `Nested Module Inventory` with coverage. | If nested node id or nested MCP read fails after parent evidence is available, record `nested-read-failed:<name>` and mark coverage `deferred`; this is not a full-parity gate. |
| Source note | Write or update `src/figma/<component>.source.md` before implementation. Include each required section or an explicit `N/A` note. | Source note with Known Gaps and coverage. | Do not start component code without this note. |
| Build | Write prop/state contract tests, React/CSS, Storybook stories, and visual registry entries. | Component files and stories. | Storybook Controls expose Figma-facing props only. |
| Validation | Run the full completion command set and browser smoke. | Test/type/build/audit/visual evidence. | Browser smoke is render evidence, not visual parity. |
| Record | Add `history/`, `retrospectives/`, or `knowledge/` updates when the workflow or reusable learning changes. | Traceable decision record. | Do not silently change workflow policy. |

## Allowed

- Build React components in this package only.
- Use Framelink/Figma MCP and Console MCP to read Figma component data.
- Use `index.md` only as a component address registry.
- Read tokens from the sibling `chord-design-system/tokens` folder via relative path (do not copy JSON into this package).
- Create or update `src/figma/<component>.source.md` before implementation.
- Create Storybook stories with `Playground`, variants/states, and
  `FigmaCompare`.
- Run unit tests, typecheck, Storybook build, browser smoke, and visual review.
- Run `visual:baseline` and `visual:diff` before marking Figma parity complete.

## Critical Forbidden

- Do not implement without a source note.
- Do not use variant detail markdown files as source of truth.
- Do not infer unknown colors, spacing, typography, radius, layout, assets, or
  behavior without Figma data, token data, user input, or source note gaps.
- Do not let old implementation choices override live Figma reads.
- Do not expose native/internal props in Storybook Controls.
- Do not silently replace asset-backed visuals with text, emoji, or CSS drawings.
- Do not map icons by shape similarity; classify assets first.
- Do not treat `icon_area` as the SVG asset.
- Do not use consumer `src` samples for component fallback assets.
- Do not resize nested DS atoms with CSS scale or arbitrary frame overrides.
- Do not call browser smoke a visual match.
- Do not report non-gating visual diff output as Figma parity.
- Do not mark a component done after tests only.
- Do not continue source-note or component implementation when Console MCP
  Desktop Bridge is disconnected or required MCP source reads cannot complete.

## Source Priority

1. User intent and current request
2. Console MCP component description and enriched metadata
3. Framelink/Figma MCP child node design context
4. Figma screenshot or component image
5. Local token JSON
6. Existing source note
7. Browser smoke and visual review result
8. LLM inference

If a value is not confirmed, leave it out or record it in `Known Gaps`.
Detailed source rules live in `rules/figma-source-priority.md`.

## Source Priority By Data Type

- Axes, component properties, constraints, and description: prefer Console MCP
  enriched metadata, then confirm risky cases through representative child reads.
- Layout, padding, radius, typography, rendered size, and state visuals: prefer
  representative child context and local baseline images. Record Console/child
  conflicts instead of averaging them.
- Color and token semantics: prefer Figma bound variables and local token JSON.
  Use rendered pixels only after checking visual environment, token mapping, and
  component CSS.
- Assets and icons: prefer Figma structure and asset classification. Shape
  similarity is not evidence.
- Nested modules: parent evidence discovers candidates; each nested component set
  needs a separate read or a documented `deferred` coverage entry.

## Required Gates

1. Confirm target component node id/key from `index.md`.
2. Read Figma with MCP tools.
3. Write or update source note.
4. Write tests for prop/state contracts.
5. Implement React/CSS using token variables and confirmed assets.
6. Add Storybook stories with Figma-facing Controls only.
7. Run `npm test`, `npm run typecheck`, `npm run build-storybook`,
   `npm run visual:baseline`, `npm run visual:diff`, `npm run rules:audit`, and
   `npm run knowledge:audit`.
8. Run browser smoke and confirm component console error count is 0.
9. Record retrospective, knowledge, or history when a repeatable lesson appears.

## Rule Index

- `rules/figma-source-priority.md`: source priority and source-of-truth limits
- `rules/asset-classification.md`: icons, fallback, placeholder, `icon_area`
- `rules/token-font-pixel.md`: alpha tokens, fonts, token vs rendered pixels
- `rules/nested-composition.md`: nested atom composition through public props
- `rules/storybook-validation.md`: Controls, FigmaCompare, Done Criteria
- `knowledge/README.md`: reusable learning cards and retrospective promotion

## Done Criteria

- Source note exists and lists MCP reads, axes, props, tokens, layout, assets,
  Known Gaps, and required sections marked either with evidence or explicit
  `N/A`.
- Storybook Controls expose only Figma-facing props.
- Asset-backed visuals are exported, mapped, or explicitly marked as gaps.
- Nested atoms are mapped through public props and recorded when parent size
  changes nested size.
- Complex components record nested module coverage as
  `complete / partial / deferred` before being marked done.
- Visual registry entries align with source note coverage through
  `comparisonScope` and `isParityGate`; partial/deferred entries are not
  reported as full Figma parity.
- Unit tests, typecheck, Storybook build, visual baseline/diff, rules audit,
  knowledge audit, browser smoke, and component console check pass.
- Repeatable learnings have been promoted to `knowledge/` or explicitly marked
  as not reusable.
- Workflow decisions are recorded in `history/`; component learnings are recorded
  in `retrospectives/`; reusable lessons are recorded in `knowledge/`.
