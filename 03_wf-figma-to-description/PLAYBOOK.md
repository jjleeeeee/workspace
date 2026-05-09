---
type: Playbook
status: Draft
version: 1.2
date: 2026-05-05
project: "Figma Description Workflow"
owner: 디자인 시스템 담당자
related:
  - "AGENTS.md"
  - "workflow/README.md"
  - "history/figma-description-history.md"
---

# Figma Description Playbook

이 문서는 `03_wf-figma-to-description` 작업실의 **짧은 실행 계약서**다.
상세 스키마, Figma write/readback 코드, 예외 대응, 검증 체크리스트는
`workflow/` 아래 문서에서 관리한다.

## 1. 목적

Figma 컴포넌트의 구조, 토큰, layout, 구현 규칙을 읽어 Component
Description에 구조화 YAML을 저장하고 검증한다.

- Figma Component Description이 유일한 스펙 SoT다.
- 이 워크플로우는 `{component}.md` 파생 산출물을 만들지 않는다.
- `draft-descriptions/`는 Figma에 쓰기 전 validator로 확인하는 임시
  draft 위치이며 SoT가 아니다.

## 2. 필수 읽기 순서

1. `AGENTS.md`
2. `README.md`
3. 이 문서
4. `workflow/README.md`
5. 현재 단계에서 필요한 `workflow/*.md`
6. 필요한 경우에만 `refs/figma-component-keys/`와
   `refs/markitdown-output/`

단계별 상세 문서는 `workflow/README.md`의 Step table을 따른다.
validation, Figma readback, history gate는 생략하지 않는다.

## 3. Source Priority

1. 사용자 제공 Do/Don't와 현재 요청 의도
2. 실제 Figma component data
3. `refs/figma-component-keys/` key registry snapshot
4. `refs/markitdown-output/` supplemental data
5. 기존 history
6. LLM inference

확인되지 않은 값은 임의로 채우지 않고 제외하거나 `source_gaps`에 기록한다.

## 4. 금지 계약

- `descriptionMarkdown`을 YAML 저장 경로로 사용하지 않는다.
- plain `description` write 뒤에 `descriptionMarkdown`을 clear하지 않는다.
  legacy field clear는 항상 plain `description` write 전에 한다.
- Desktop Bridge 또는 필수 MCP preflight가 실패하면 기본 흐름에서
  `draft-descriptions/<component>.description.yaml`도 만들거나 갱신하지 않는다.
- REST API, Variables API, figma-console fallback write, cloud-only draft는
  사용자 승인 없이 자동 대체하지 않는다.
- 하위 DS component의 axes, tokens, layout 상세를 parent Description에
  복붙하지 않는다. 확인된 조합 관계는 `composition.uses`에 기록한다.
- asset-backed visual을 text, emoji, CSS drawing으로 조용히 대체하지 않는다.
- `{component}.md` 파생 문서를 만들지 않는다.

## 5. 전체 흐름

| Step | 목적 | 필수 참조 |
| --- | --- | --- |
| 1. Preflight | 필수 MCP, Desktop Bridge, target file 연결 확인 | `workflow/README.md`, `workflow/exceptions.md` |
| 2. Figma 구조/토큰 읽기 | axes, variants, node id, component key, layout, token binding 확보 | `workflow/README.md`, 필요 시 `workflow/exceptions.md` |
| 3. 보충 입력 대조 | key registry와 markitdown reference를 optional로 대조 | `workflow/README.md` |
| 4. Draft YAML 작성 | 확인된 데이터만 Description YAML로 구성 | `workflow/description-yaml-schema.md` |
| 5. 저장/검증/기록 | validator, Figma write, decode readback, history 기록 | `workflow/figma-write-readback.md`, `workflow/validation-checklist.md` |

## 6. Step Gate

### Step 1. Preflight

- Figma official MCP `use_figma`, Framelink MCP, figma-console MCP availability를 확인한다.
- figma-console은 Desktop Bridge 연결과 target file 일치를 확인한다.
- 실패 시 자동 fallback하지 않는다. 어떤 작업이 막히는지 보고하고 중단한다.

### Step 2. Structure And Token Read

- Framelink/Figma MCP로 component set의 axes, variant count, node id,
  component key, layout 데이터를 읽는다.
- figma-console로 각 part의 fill/stroke token binding을 읽는다.
- 결과가 너무 크면 저장된 tool-result에서 target component set만 좁혀 파싱한다.
- target 값과 local snapshot이 충돌하면 live Figma 값을 우선한다.

### Step 3. Supplemental Read

- `refs/figma-component-keys/`는 주소록/대조 snapshot으로만 사용한다.
- `refs/markitdown-output/<component>.md`는 존재할 때만 스펙 보충 입력으로 읽는다.
- markitdown 내용과 live extraction이 충돌하면 live extraction을 우선한다.

### Step 4. Draft YAML

- 스키마와 section 규칙은 `workflow/description-yaml-schema.md`를 따른다.
- `implementation_order`, `implementation_coverage`, `rules`는 모든 컴포넌트에 포함한다.
- 복합 컴포넌트에서만 `composition.uses`를 사용한다.
- `spec_notes`는 source, readback, markitdown 보충 메모가 필요할 때 사용한다.
- `token: null`은 직접 넣지 않고 `source_gaps`에 기록한다.

### Step 5. Save, Readback, History

- draft는 `draft-descriptions/<component>.description.yaml`로 저장하고 validator를 실행한다.
- write 전 legacy `descriptionMarkdown` 길이를 기록하고 먼저 clear한다.
- 검증된 YAML은 plain `description`에 저장한다.
- 저장 후 Figma readback을 HTML entity decode 기준으로 검증한다.
- `descriptionMarkdownLength === 0`을 확인한다.
- 결정 또는 동작 변경이 있으면 `history/figma-description-history.md`에 기록한다.

## 7. Done Criteria

- Figma Description YAML이 plain `description`에 저장됐다.
- Figma Description readback을 HTML entity decode 후 확인했다.
- legacy `descriptionMarkdown`이 0자임을 확인했다.
- local validator가 통과했거나 warning/failure 이유를 기록했다.
- `source_gaps`가 있으면 미확인 이유가 명시되어 있다.
- 필요한 경우 history에 변경 이유, 제외한 선택지, 재검토 조건을 기록했다.
- `{component}.md` 파생 산출물을 만들지 않았다.

## 8. 상세 문서

- `workflow/README.md`: 실행 순서와 단계별 참조 문서
- `workflow/description-yaml-schema.md`: YAML schema와 section 규칙
- `workflow/figma-write-readback.md`: `descriptionMarkdown`, write, readback 정책
- `workflow/validation-checklist.md`: validator, readback, 완료 체크리스트
- `workflow/exceptions.md`: MCP 실패, cloud-only degraded mode, 복구 옵션
