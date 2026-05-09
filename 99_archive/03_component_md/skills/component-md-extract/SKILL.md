---
name: component-md-extract
description: Use when given a Figma URL to extract a Chord Design System component into a YAML-contract + Markdown-guidance component MD, generate independent fixtures, and run the component MD harness verification loop.
---

# Component MD Extract

Use this skill to create, refresh, or migrate `components/{component}.md`.

## Modes

- `new`: Figma component URL + optional Usage URL → fresh source extraction → YAML contract → Markdown guidance → fixtures → harness.
- `migrate`: existing `components/{component}.md` + existing fixtures → move legacy `## 2. 구현 계약` facts into YAML contract → keep Markdown guidance in sections 1–8 → harness.

## Preconditions

- Work from the `03_component_md/` project root.
- Use only the provided Figma URL and freshly extracted Figma data when writing the component document.
- Do not read the existing component MD or existing component fixture before drafting the document. Existing files may be used after drafting for comparison and source-gap review.
- Required tools: Framelink Figma MCP, figma-console MCP, Figma REST API token, and `bash harness/eval.sh`.

## Workflow

1. Choose mode.
   - Use `new` when the component does not yet have a canonical MD or when source isolation is required.
   - Use `migrate` for legacy Markdown-contract components already covered by `harness/fixtures/{componentName}/`.

2. Parse the Figma URL for `new` mode.
   - `fileKey`: segment after `/design/`
   - `nodeId`: `node-id=` value; keep both hyphen and colon forms
   - `componentName`: lowercase component name for `components/{componentName}.md`

3. Extract source data for `new` mode.
   - Use Framelink `get_figma_data` for the target node tree.
   - Use figma-console `analyze_component_set` for axes, variants, and component props.
   - Use figma-console `get_variables` for relevant `WDS_tokens`.
   - Use Figma REST `/v1/files/{fileKey}/components` as an independent source for `variants_rest.json`.

4. Migrate source data for `migrate` mode.
   - Read the legacy component MD and the matching fixture directory.
   - Use `python3 scripts/migrate_component_md_to_yaml.py {componentName}` for mechanical migration.
   - Do not include `components/TEMPLATE.md` or `components/icons.md` in batch migration.
   - After migration, review YAML vs Markdown for conflicts and source gaps.

5. Write the component document.
   - Output path: `components/{componentName}.md`
   - Use YAML frontmatter as the machine-readable contract and Markdown as the human/AI guidance layer.
   - Use this exact structure:

```md
---
component:
source:
props:
variants:
states:
tokens:
layout:
accessibility:
rules:
notes:
---

# Component

## 1. 역할과 사용
## 2. 시각적 성격
## 3. 구조
## 4. 컴포넌트 스타일링
## 5. 상태와 인터랙션
## 6. 레이아웃과 반응형 규칙
## 7. 권장/금지
## 8. 에이전트 프롬프트 가이드
```

6. Fill the YAML contract.
   - `component`: name, description, status, version.
   - `source`: Figma file, file key, component set name/node/key, usage source when available.
   - `props`: public API / props normalized for code.
   - `variants`: axes, counts from figma-console and REST, constraints.
   - `states`: state behavior and applicability.
   - `tokens`: role-to-token mappings, including fixed mode and observed fallback values when relevant.
   - `layout`: sizes, spacing, radius, and responsive rules.
   - `accessibility`: role, label, keyboard, ARIA, contrast.
   - `rules`: Do/Don't items.
   - `notes`: source gaps, deprecated values, special extraction notes.

7. Fill the Markdown guidance sections.
   - Explain where the component is used and when not to use it.
   - Describe visual character, density, hierarchy, and interaction feel.
   - Define anatomy using implementation-relevant part names.
   - Include state behavior, layout rules, Do/Don't guidance, and reusable agent prompts.
   - Do not duplicate long contract tables from YAML; use Markdown for reasoning and usage judgment.

8. Generate or update fixtures.
   - `harness/fixtures/{componentName}/variants.json`
   - `harness/fixtures/{componentName}/tokens.json`
   - `harness/fixtures/{componentName}/variants_rest.json`
   - `harness/fixtures/{componentName}/sizes.json` only when exact size contracts exist

9. Run the verification loop.

```bash
bash harness/eval.sh components/{componentName}.md
```

Loop up to 3 times. Fix only the generated component document or freshly generated fixtures from source data. If it still fails after 3 attempts, report the failing checks and stop.

For repository-wide migration or regression checks:

```bash
bash harness/eval_all.sh
```

## Harness Expectations

The harness has two tracks:

- Design Track: Markdown guidance sections, usage guidance, visual character, Do/Don't, and Agent Prompt Guide.
- Contract Track: variants, tokens, sizes, and REST source checks scoped to YAML frontmatter.

For `components/avatar.md`, the harness maps fixtures from `harness/fixtures/avatar/`.

## REST Normalization

When normalizing REST component names, remove only Korean explanatory parentheses and preserve size parentheses such as `XLarge(52)`.

```python
re.sub(r'\s*\([^)]*[^\x00-\x7F][^)]*\)', '', value).strip()
```

Filter REST components by `node_id.startswith("{componentPrefix}:")`, not by `containing_frame.nodeId`.

## Completion Report

Report:

- generated document path
- fixture paths created or updated
- harness score and check breakdown
- any source gaps or manual verification items
