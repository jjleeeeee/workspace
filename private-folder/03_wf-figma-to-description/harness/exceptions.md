---
type: WorkflowReference
status: Draft
version: 1.0
updated: 2026-05-05
---

# Exceptions And Recovery

이 문서는 실패, 누락, 복구 옵션을 다룬다. 기본 원칙은 **자동 대체 금지**다.

## Required Tools

| Tool | Purpose | Missing behavior |
| --- | --- | --- |
| Framelink MCP | component structure, variant node id, component key, layout extraction | 구조 추출 불가로 보고 후 중단 |
| figma-console MCP | fill/stroke variable name extraction, Desktop Bridge status | token binding 검증 불가로 보고 후 중단 |
| Figma official MCP `use_figma` | plain Description write | Description write 불가로 보고 후 중단 |
| local validator | draft YAML sanity check | warning/failure를 기록하고 수동 검토 |

## Automatic Replacement Is Forbidden

- Framelink MCP 실패 시 REST API로 자동 대체하지 않는다.
- figma-console MCP 실패 시 Variables API로 자동 대체하지 않는다.
- `use_figma` 실패 시 figma-console write로 자동 대체하지 않는다.
- Desktop Bridge 실패 시 cloud-only draft를 자동 생성하지 않는다.

복구 옵션은 target component에 대해 사용자 명시 승인이 있을 때만 실행한다.

## Cloud-Only Degraded Mode

Figma official cloud context, Framelink, REST API 등으로 일부 데이터를 읽을 수
있어도 Desktop Bridge 또는 필수 MCP preflight가 실패하면 기본 흐름은 중단한다.

사용자가 현재 컴포넌트에 대해 명시적으로 cloud-only draft를 승인한 경우에만
draft를 만들 수 있다. 이때 draft에는 반드시 다음을 기록한다.

- `source_gaps`: Desktop Bridge 미연결로 token binding, deep extraction,
  write/readback을 전수 검증하지 못했다는 이유
- 완료 보고: degraded mode draft이므로 Figma Description SoT 반영 전 추가 검증이 필요하다는 한계

## Common Failures

| Situation | Response |
| --- | --- |
| `figma_get_status` 연결 실패 | Figma Desktop Bridge plugin 재실행 후 재시도 |
| `getNodeById` dynamic-page 오류 | `getNodeByIdAsync` 사용 |
| Figma official context timeout | Framelink + figma-console read 조합으로 좁혀 진행 |
| fill variable이 `null` | 추측하지 않고 `source_gaps`에 기록 |
| instance layer fill이 `null` | 복합 component의 일반 패턴일 수 있으므로 relation 확인 |
| Description 글자 수가 과도하게 길어짐 | registry full expansion 대신 count, constraints, sample 사용 검토 |
| `figma_set_description` 후 list indentation 손상 | 해당 경로 중단, `use_figma` 또는 승인된 `figma_execute` write만 사용 |
| plain `description` write 후 clear로 Description이 0자가 됨 | write 순서 오류. legacy clear를 먼저 실행하고 plain write를 다시 수행 |
| readback에 HTML entity 노출 | decode 후 검증. decode 결과가 정상이면 통과 |
| component/variant 이름에 제어문자 포함 | YAML 작성 전 `name.replace(/[\x00-\x1F\x7F]/g, '')` 적용 |

## Large Framelink Result

Framelink 결과가 context limit을 초과해 tool-result 파일로 저장되면 target
component set만 좁혀 확인한다.

```python
import json, re

with open("<saved_tool_result_path>", "r") as f:
    raw = json.load(f)

text = raw if isinstance(raw, str) else json.dumps(raw)
pattern = re.compile(
    r'"componentSetId":\s*"<node_id>".*?"name":\s*"([^"]+)".*?"id":\s*"([^"]+)".*?"key":\s*"([^"]+)"',
    re.DOTALL
)
matches = pattern.findall(text)
```

이 파싱은 대형 결과에서 필요한 variant tuple을 찾기 위한 복구 수단이다.
YAML 저장 전에는 가능한 live Figma 값과 다시 대조한다.
