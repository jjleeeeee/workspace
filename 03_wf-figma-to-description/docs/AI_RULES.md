# AI Rules - Figma Description Workflow

This is the canonical shared rule source for all AI coding tools in this
project. Read and follow this file before doing any project work.

If this file conflicts with a tool-specific adapter such as `AGENTS.md` or
`CLAUDE.md`, the adapter controls tool startup behavior, but shared project
rules live here.

## Mission

This folder is only for updating and validating Figma Component Description YAML.

`draft-descriptions/*.description.yaml` is the source of truth. Do not create
derived component Markdown output from this workflow.

## Read Order

1. Read `README.md` if it exists.
2. Read `PLAYBOOK.md`.
3. Read `workflow/README.md`.
4. Read the step-specific `workflow/*.md` files linked from
   `workflow/README.md` before doing that step.
5. Read `refs/figma-component-keys/index.md` and
   `refs/figma-component-keys/variant-keys/<component>.md` only when component
   set or variant keys are needed for the target component.
6. Read `refs/markitdown-output/<component>.md` only when the target component has
   a matching reference file.
7. After changes, record the reason in `history/figma-description-history.md` if
   that file exists.

## Workflow Gate

- Treat `docs/AI_RULES.md` as the canonical shared routing contract.
- Treat `PLAYBOOK.md` as the short contract and `workflow/` as the
  detailed procedure.
- Do not skip the validator or history gate when a decision or behavior changed.
- If a step-specific detail is unclear, read the linked `workflow/*.md` file
  before acting.

## Allowed

- Update `draft-descriptions/*.description.yaml`.
- Run the local Description validator when available.
- Run `scripts/enrich_tokens.py` and `scripts/enrich_typography.py` to backfill
  resolved token values from catalogs.
- Record decision and change history.
- Use `refs/markitdown-output/` as optional supplemental input.
- Use `refs/figma-component-keys/` as optional key registry reference.
- Record confirmed nested DS component relationships in `composition.uses` for
  composite components.
- Use subagents only for local reference inspection, draft YAML authoring, and
  validator work.

## Forbidden

- Do not create `{component}.md` as a derived workflow output.
- Do not create or update `bridge-descriptions/*.bridge.yaml`. Bridge YAML is
  deprecated as of 2026-05-12.
- Do not write Description YAML to Figma's plain `description` field or
  `descriptionMarkdown`. Figma write is deprecated as of 2026-05-12; the local
  YAML file is SoT.
- Do not infer unknown values that are not confirmed by Figma data, user input,
  or reference files.
- Do not copy child component axes, tokens, or layout details into the parent
  Description; reference the child component relationship instead.
- Do not treat `refs/figma-component-keys/` as the latest SoT without live Figma
  readback for the target component set.
- Do not let subagents use Figma Console MCP, Desktop Bridge, or official
  `use_figma` live read/write tools. The parent agent owns all live Figma
  read operations serially.

## Source Priority

1. User-provided Do/Don't and intent.
2. Actual Figma component data.
3. `refs/figma-component-keys/` key registry snapshot.
4. `refs/markitdown-output/` supplemental data.
5. Existing history.
6. LLM inference.

If a value is not confirmed, leave it out or record it in `source_gaps`.

## Done Criteria

- `draft-descriptions/<component>.description.yaml` is saved.
- Validator passes, or warnings are recorded.
- History is updated when a decision or behavior changed.
