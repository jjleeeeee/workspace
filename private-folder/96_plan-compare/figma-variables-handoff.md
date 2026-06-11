# Handoff: Figma Variables Count Investigation

## Next Session Focus

Continue Chord Design System token extraction work from Figma REST API, especially aligning REST `variables/local` output with the Figma Variables UI count.

## Context

- Workspace: `/Users/jj.iee/Desktop/workspace`
- Figma file URL provided by user:
  - `https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA/branch/vuq1CyC1Pi4NZYE7ximg3I/Chord-Design-System?m=auto&node-id=1553-157697&t=X09wNs8W3wLQ3pqL-1`
- Main file key: `DWEduE6GfxYMlyxKPNJ8jA`
- Branch key used for REST calls: `vuq1CyC1Pi4NZYE7ximg3I`
- `.env` was created at `/Users/jj.iee/Desktop/workspace/.env` with:
  - `FIGMA_TOKEN=` set by user
  - `FIGMA_FILE_KEY=DWEduE6GfxYMlyxKPNJ8jA`
  - `FIGMA_BRANCH_KEY=vuq1CyC1Pi4NZYE7ximg3I`
- Do not print or copy the token value.

## What Was Verified

Figma Variables REST API works with the user's PAT.

Endpoint used:

```bash
GET https://api.figma.com/v1/files/$FIGMA_BRANCH_KEY/variables/local
```

Initial REST summary:

- collections: `13`
- variables: `626`
- local `WDS_tokens` collection id: `VariableCollectionId:490:8920`
- `WDS_tokens` modes: `light`, `dark`

## Key Finding

The mismatch between REST count and Figma UI count is caused by `deletedButReferenced: true`.

Figma REST `variables/local` includes deleted-but-still-referenced variables. The Figma Variables UI count excludes them.

When filtering WDS local system variables with:

```js
variable.name.startsWith("system/") && !variable.deletedButReferenced
```

the REST counts match the user's screenshot exactly:

```text
system total 409
color: 182
fixed_color: 162
size: 65
```

For `system/color`, after excluding `deletedButReferenced`:

```text
button: 5
divide: 16
icon: 29
outline: 14
roles: 23
status: 13
surface: 56
text: 26
total: 182
```

For `system/fixed_color`:

```text
button: 6
divide: 15
icon: 28
outline: 13
roles: 12
status: 13
surface: 50
text: 25
total: 162
```

## Deleted-But-Referenced Examples

These appear in REST but not in the Figma UI count:

- `system/color/button/ghost`
- `system/color/roles/brand-green`
- `system/color/community/*`
- `system/color/dm/*`

`system/color/roles/brand-green` was already documented as a known dangling/deleted reference in:

- `/Users/jj.iee/Desktop/workspace/private-folder/02_wf-figma-color-token-extraction/workflow/color-token-extraction-guide.md`
- `/Users/jj.iee/Desktop/workspace/private-folder/02_wf-figma-color-token-extraction/history/2026-04-23_color-token-rest-extraction.md`

## Existing Relevant Files

- Extraction tool:
  - `/Users/jj.iee/Desktop/workspace/private-folder/02_wf-figma-color-token-extraction/tools/extract-figma-color-tokens.mjs`
- Tests:
  - `/Users/jj.iee/Desktop/workspace/private-folder/02_wf-figma-color-token-extraction/tools/extract-figma-color-tokens.test.mjs`
- Current outputs:
  - `/Users/jj.iee/Desktop/workspace/private-folder/02_wf-figma-color-token-extraction/outputs/current/color.json`
  - `/Users/jj.iee/Desktop/workspace/private-folder/02_wf-figma-color-token-extraction/outputs/current/tokens.color.v1.0.json`
- Raw snapshots:
  - `/Users/jj.iee/Desktop/workspace/private-folder/02_wf-figma-color-token-extraction/outputs/raw/figma.variables.local.2026-06-10.pre-flatten.json`
  - `/Users/jj.iee/Desktop/workspace/private-folder/02_wf-figma-color-token-extraction/outputs/raw/figma.variables.local.2026-06-10.post-flatten.json`

## Suggested Next Actions

1. Update final token extraction logic to exclude `deletedButReferenced` variables from final catalog output.
2. Keep deleted-but-referenced variables in diagnostics if useful for audit/debugging.
3. Add or update tests around:
   - `deletedButReferenced: true` exclusion
   - `system/color` UI count parity
   - `system/fixed_color` parity
4. Re-run extraction and validation.

## Suggested Skills

- `tdd`: for adding a failing test before changing extractor behavior.
- `lint-and-validate`: for running project validation after edits.
- `systematic-debugging`: if count mismatch reappears.
- `handoff`: if pausing again after code changes.

## Cautions

- Workspace has many untracked files unrelated to this session. Do not revert or clean them.
- `.env` contains a Figma PAT. Do not commit it and do not expose it in logs.
- Prior `rg` over raw JSON produced very large output. Prefer focused Node scripts over broad text search on raw snapshots.
