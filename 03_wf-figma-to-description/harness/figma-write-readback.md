---
type: WorkflowReference
status: Deprecated
deprecated: 2026-05-12
reason: "Figma plain description write 폐기. draft-descriptions/*.description.yaml이 SoT."
version: 1.0
updated: 2026-05-05
---

> ⚠️ **폐기됨 (2026-05-12)** — Figma write/readback 단계는 제거됐다.
> `draft-descriptions/*.description.yaml`이 SoT이며, Figma 쓰기는 수행하지 않는다.
> 이 문서는 이력 참고용으로만 보관한다.

# Figma Write And Readback

이 문서는 Figma Component Description에 YAML을 저장하고 다시 읽어 검증하는
정책을 정의한다.

## Description Field Policy

Figma component에는 plain `description`과 rich-text `descriptionMarkdown`
필드가 모두 존재한다. 이 워크플로우는 YAML SoT를 plain `description`에만 저장한다.

- `descriptionMarkdown`은 Figma rich-text legacy field로 본다.
- `descriptionMarkdown` 필드 자체는 삭제할 수 없으므로 빈 문자열로 clear한다.
- write 전 대상 node가 `descriptionMarkdown`을 지원하는지 확인하고 기존 길이를 기록한다.
- `descriptionMarkdown.length > 0`이어도 자동 중단하지 않는다. 다음 write에서
  legacy field로 기록한 뒤 clear한다.
- clear는 반드시 plain `description` write 전에 실행한다.
- plain `description`을 쓴 뒤 `descriptionMarkdown = ""`를 실행하면 plain
  Description까지 비워질 수 있다.
- clear는 target component Description write의 일부로만 수행한다.
  `descriptionMarkdown`만 bulk cleanup하지 않는다.
- draft YAML, `{component}.md`, history, README 어디에도
  `descriptionMarkdown`을 YAML 저장 경로로 사용하지 않는다.

## Default Write Path

Figma official MCP `use_figma`를 기본 저장 경로로 사용한다. 호출 전에는
`figma-use` skill 지침을 따른다.

```javascript
const node = await figma.getNodeByIdAsync("<component_set_node_id>");
if (!node) throw new Error("Component set not found");
const beforeDescriptionMarkdownLength =
  "descriptionMarkdown" in node ? (node.descriptionMarkdown || "").length : null;

if ("descriptionMarkdown" in node) node.descriptionMarkdown = "";
node.description = yamlString;

return {
  mutatedNodeIds: [node.id],
  name: node.name,
  length: node.description.length,
  beforeDescriptionMarkdownLength,
  afterDescriptionMarkdownLength:
    "descriptionMarkdown" in node ? (node.descriptionMarkdown || "").length : null
};
```

판단 기준:

- `mutatedNodeIds`에 target component set node id가 포함되어야 한다.
- write 전 legacy `descriptionMarkdown` 길이를 기록해야 한다.
- write 후 `descriptionMarkdown`은 빈 문자열이어야 한다.
- Markdown/rich text 변환 경로를 거쳐 저장하지 않는다.

## User-Approved Recovery Write

Figma official MCP `use_figma`가 없거나 실패하면 자동 대체하지 않는다.
먼저 Description write가 불가능하다고 보고하고 중단한다.

사용자가 명시적으로 승인한 경우에만 figma-console `figma_execute`로 같은
Plugin API 코드를 실행한다.

```javascript
const node = await figma.getNodeByIdAsync("<component_set_node_id>");
if (!node) throw new Error("Component set not found");
const beforeDescriptionMarkdownLength =
  "descriptionMarkdown" in node ? (node.descriptionMarkdown || "").length : null;
if ("descriptionMarkdown" in node) node.descriptionMarkdown = "";
node.description = yamlString;
return {
  mutatedNodeIds: [node.id],
  length: node.description.length,
  beforeDescriptionMarkdownLength,
  afterDescriptionMarkdownLength:
    "descriptionMarkdown" in node ? (node.descriptionMarkdown || "").length : null
};
```

REST API는 Description write 경로로 사용하지 않는다.

## Readback Decode Check

저장 후 Figma Description을 다시 읽고 HTML entity를 decode해 구조를 확인한다.

```javascript
const node = await figma.getNodeByIdAsync("<component_set_node_id>");
const raw = node.description || "";
const descriptionMarkdownLength =
  "descriptionMarkdown" in node ? (node.descriptionMarkdown || "").length : null;
const decoded = raw
  .replace(/&quot;/g, '"')
  .replace(/&#34;/g, '"')
  .replace(/&apos;/g, "'")
  .replace(/&#39;/g, "'")
  .replace(/&amp;/g, "&")
  .replace(/&lt;/g, "<")
  .replace(/&gt;/g, ">");

return {
  hasRequiredKeys:
    decoded.includes("\naxes:\n") &&
    decoded.includes("\nvariants:\n") &&
    decoded.includes("\ntokens:\n") &&
    decoded.includes("\nimplementation_order:\n") &&
    decoded.includes("\nrules:\n"),
  preservesLists:
    decoded.includes("  constraints:\n    - ") &&
    decoded.includes("  registry:\n    - ") &&
    decoded.includes("implementation_order:\n  - "),
  hasSourceGapsIfNeeded:
    !decoded.includes("source_gaps:") ||
    /source_gaps:\n  - (part|item|field):/.test(decoded),
  hasSpecNotesIfNeeded: !decoded.includes("spec_notes:") || decoded.includes("\nspec_notes:\n"),
  descriptionMarkdownLength,
  legacyDescriptionMarkdownCleared: descriptionMarkdownLength === 0
};
```

기대 결과:

- `axes`, `variants`, `tokens`, `implementation_order`, `rules`가 존재한다.
- list indentation이 유지된다.
- `source_gaps`가 있으면 gap 이유가 명시되어 있다.
- legacy `descriptionMarkdown`은 0자다.
