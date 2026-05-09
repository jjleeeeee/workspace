# AI Rules - Figma Color Token Extraction

This is the canonical shared rule source for all AI coding tools in this
project. Read and follow this file before doing any project work.

If this file conflicts with a tool-specific adapter such as `AGENTS.md` or
`CLAUDE.md`, the adapter controls tool startup behavior, but shared project
rules live here.

## Mission

This folder is only for extracting and validating the Chord DS color token
catalog from Figma Variables.

The output scope is color only:

- include `system/color/*`
- include `system/fixed_color/*`
- exclude `base/color/*` from the final catalog
- flatten all aliases to final uppercase hex values

## Read Order

1. Read `README.md`.
2. Read `PLAYBOOK.md`.
3. Read `workflow/README.md`.
4. Read `workflow/color-token-extraction-guide.md` before changing extraction
   logic.
5. Read `workflow/validation-checklist.md` before claiming the output is valid.
6. Record extraction decisions or source behavior changes in `history/`.

## Workflow Gate

- Treat `docs/AI_RULES.md` as the canonical shared routing contract.
- Treat `PLAYBOOK.md` as the short contract and `workflow/` as the detailed
  procedure.
- Do not overwrite canonical `../cds-catalogs/catalogs/tokens/` until the local
  output validates and diff has been reviewed.
- Keep raw REST snapshots in `outputs/raw/` only when they explain a run or help
  future diff review.

## Allowed

- Regenerate `outputs/current/tokens.color.v1.0.json`.
- Validate color token catalog shape and checklist constraints.
- Compare current output against `outputs/previous-2026-04-23/` or canonical
  `../cds-catalogs/catalogs/tokens/`.
- Update `tools/` when extraction or validation rules change.
- Record decisions in `history/`.

## Forbidden

- Do not generate size or typography catalogs in this folder.
- Do not revive the archived DSL harness or HTML visual demo here.
- Do not expose `base/color/*` in the final color catalog.
- Do not keep unresolved color values in the final `tokens` array.
- Do not set `values.*.aliasOf` to a non-null value in the final color catalog.
- Do not silently remove `system/color/roles/brand-green` diagnostics unless the
  Figma REST source no longer reports it as a dangling/deleted reference.
- Do not edit unrelated archived content while working in this folder.

## Source Priority

1. User-provided intent for the current run.
2. Current Figma REST `variables/local` response.
3. `workflow/color-token-extraction-guide.md`.
4. Existing `history/` run logs.
5. Previous snapshot in `outputs/previous-2026-04-23/`.
6. LLM inference.

If a value cannot be resolved to final hex, exclude that token from output and
record `alias:dangling` diagnostics.

## Done Criteria

- `outputs/current/tokens.color.v1.0.json` exists.
- Validation reports `errorCount: 0`.
- Color token count and changed token ids are reviewed.
- `base/color` output count is `0`.
- non-hex color value count is `0`.
- `aliasOf !== null` count is `0`.
- `brand-green` dangling status is checked when present.
- Canonical sync, if requested, changes only intended token catalog files.
