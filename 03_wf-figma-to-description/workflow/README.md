---
type: WorkflowGuide
status: Active
version: 1.1
updated: 2026-05-12
---

# Workflow Guide

이 문서는 Figma Component Description YAML을 작성할 때 실제로 따라가는
실행 순서다. 루트 `PLAYBOOK.md`는 계약서이고, 이 문서는
작업 순서와 참조 문서의 허브다.

## Execution Contract

- `AGENTS.md`와 루트 `PLAYBOOK.md`를 먼저 읽는다.
- 단계별 상세 문서를 필요한 시점에 읽는다.
- validator와 history gate는 생략하지 않는다.
- 확인되지 않은 값은 추측하지 않고 `source_gaps`에 기록한다.
- Figma plain `description` 쓰기, bridge YAML 생성은 폐기됐다(2026-05-12).

## Step Table

| Step | Action | Output | Required detail |
| --- | --- | --- | --- |
| 1 | Preflight로 MCP/Bridge/file 일치 확인 | 진행 가능 여부 | `exceptions.md` |
| 2 | Framelink MCP로 component set 구조 읽기 | axes, variant, node/key, layout, typography | `exceptions.md` |
| 2.25 | key registry snapshot 대조 | key 대조 결과 | 이 문서 |
| 2.5 | markitdown reference 보충 | `spec_notes` 또는 rules 후보 | 이 문서 |
| 2.75 | Unpromoted nested instance swap 발견 | `composition.uses` slot 타입 목록 | 이 문서 |
| 3 | figma-console로 token binding 읽기 | part/token mapping | `exceptions.md` |
| 3.5 | 스크립트 보강 | resolved token 값 주입 | 이 문서 |
| 4 | draft YAML 작성 | `draft-descriptions/<component>.description.yaml` | `description-yaml-schema.md` |
| 5 | validator + history | validator PASS, history 기록 | `validation-checklist.md` |

## Step 1. Preflight

목표:

- 구조 추출용 Framelink MCP가 가능한지 확인한다.
- token 추출용 figma-console MCP와 Desktop Bridge가 target Figma file에 연결되어 있는지 확인한다.

판단 기준:

- 필수 MCP가 없으면 어떤 작업이 막히는지 보고하고 중단한다.
- Desktop Bridge 또는 필수 MCP preflight가 실패하면 draft도 만들거나 갱신하지 않는다.
- 복구 옵션은 `exceptions.md`를 따르며, 사용자 명시 승인 없이는 실행하지 않는다.

## Step 2. Framelink로 구조 읽기

목표:

- component set의 axes, variant 이름, node id, component key, layout 수치를 추출한다.

기본 호출:

```text
mcp__Framelink_Figma_MCP__get_figma_data {
  fileKey: "<file_key>",
  nodeId: "<component_set_node_id>"
}
```

판단 기준:

- `metadata.componentSets`에 target component set이 있어야 한다.
- `metadata.components`에 variants가 나열되어야 한다.
- variant name은 `Mode=Default, Status=Default`처럼 axis/value로 파싱한다.
- layout 수치가 globalVars key에 묶여 있으면 variant별 key를 통해 조회한다.
- **Representative Variant Rule**: default variant 하나만 읽지 않는다. 아래
  후보를 최소한으로 포함해야 token과 layout을 빠짐없이 추출할 수 있다.
  - default render
  - disabled 또는 loading state
  - color constraint가 있는 variant (mode=fixed 등)
  - ghost, outlined, selected 등 visual style 차이
  - radius 차이가 있는 variant
  - fixed mode가 있으면 fixed sample
  포함하지 않은 범주는 YAML `source_gaps`에 이유를 기록한다.
- text node의 `fontFamily` 값을 확인해 `typography` 섹션 후보를 기록한다.

## Step 2.25. Component Key Registry 대조

조건:

- `refs/figma-component-keys/index.md`에 target component set이 있을 때만 사용한다.
- `refs/figma-component-keys/variant-keys/<component>.md`는 variant key 대조나 sample 확인에만 사용한다.

판단 기준:

- registry와 live Figma 값이 일치하면 YAML의 `component_set_key`,
  `variants.registry`, `variants.registry_policy.sample` 작성에 사용할 수 있다.
- registry와 live Figma 값이 충돌하면 live Figma 값을 우선하고, 필요 시
  `source_gaps` 또는 history에 재검토 조건을 남긴다.
- variant가 많으면 Description에 full registry를 펼치지 않고 count,
  constraints, sample을 기록할 수 있다.

## Step 2.5. Markitdown Reference 보충

조건:

- `refs/markitdown-output/<component>.md`가 있을 때만 읽는다.
- 없으면 이 단계를 건너뛰고 token binding extraction으로 진행한다.

사용 대상:

- 서브 요소 크기 테이블
- gradient paint 상세
- 구현 주의사항 텍스트
- markitdown에만 있는 spec frame 보충 데이터

판단 기준:

- markitdown 내용과 Framelink/figma-console 추출값이 충돌하면 live 추출값을 우선한다.
- markitdown에만 있는 데이터는 `spec_notes` 또는 `rules` 후보로 기록한다.
- 의심스러운 값은 사용자 확인 대상 또는 `source_gaps`로 남긴다.

## Step 2.75. Unpromoted Nested Instance Swap 발견

조건:

- Step 2 읽기 결과 또는 component set child에 nested instance가 있을 때 수행한다.
- `composition.uses` 후보가 발견됐을 때만 이 단계를 실행한다.

목표:

- API(`componentPropertyDefinitions`, `propertyDefinitions`)는 promote된 속성만
  반환한다. Figma UI에 슬롯 드롭다운이 보이는데 API에 나오지 않으면
  **unpromoted nested instance swap**이다. API 결과만으로 "한 가지 타입 고정"이라
  결론 내리지 않는다.

발견 절차:

1. child variant 노드를 depth ≥ 3으로 읽는다.

   ```text
   mcp__Framelink_Figma_MCP__get_figma_data {
     fileKey: "<file_key>",
     nodeId: "<child-variant-node-id>",
     depth: 3
   }
   ```

2. 슬롯 역할의 INSTANCE 노드(예: `name: "Leading"`)의 `componentId`를 확인한다.

3. 반환된 `components` 맵에서 해당 `componentId`의 `componentSetId`를 추적한다.

4. `componentSetId`가 가리키는 component set을 별도로 읽어 모든 variant Type을
   열거한다.

   ```text
   mcp__Framelink_Figma_MCP__get_figma_data {
     fileKey: "<file_key>",
     nodeId: "<slot-component-set-id>",
     depth: 1
   }
   ```

5. 열거한 Type 목록을 YAML `composition.uses`와 필요 시 `assets`에 기록한다.

판단 기준:

- child variant node는 representative 하나만 읽어도 슬롯의 `componentSetId`를
  확인할 수 있다.
- slot component set read가 실패하면 `source_gaps`에
  `nested-instance-swap-read-failed: <slot-name>`을 기록한다.
- `composition.uses`에는 구현자가 기존 DS component로 재사용해야 하는 관계만
  기록한다. 내부 vector, 단순 장식 layer는 제외한다.

## Step 3. Token Binding 읽기

목표:

- figma-console `figma_execute`로 각 variant part의 fill/stroke에 바인딩된
  Figma Variable 이름을 추출한다.

판단 기준:

- `getNodeByIdAsync`를 사용한다.
- `token: null`은 hardcoded color 또는 instance resolve 한계일 수 있으므로
  YAML에 직접 넣지 않고 `source_gaps`에 기록한다.
- component/variant 이름의 제어문자는 YAML 작성 전에 strip한다.
- instance layer fill이 null인 복합 컴포넌트는 오류가 아닐 수 있으므로 관계를 확인한다.

## Step 3.5. 스크립트 보강

목표:

- `scripts/enrich_tokens.py`로 YAML `tokens` 블록의 `resolved.{light,dark,web_var}` 값을 채운다.
- `scripts/enrich_typography.py`로 `typography` 블록의 resolved 값을 채운다.

실행 조건:

- 신규 컴포넌트 draft 작성 후, 또는 `cds-catalogs/` 토큰 카탈로그가 갱신됐을 때.
- resolved 값이 이미 최신이면 생략한다.

실행 위치:

```bash
python scripts/enrich_tokens.py draft-descriptions/<component>.description.yaml
python scripts/enrich_typography.py draft-descriptions/<component>.description.yaml
```

판단 기준:

- 스크립트 결과는 draft 파일에 직접 반영된다.
- 보강 후에도 반드시 Step 5 validator를 실행한다.

## Step 4. Draft YAML 작성

목표:

- Step 2, 3, optional reference, 사용자 제공 Do/Don't를 합쳐 Description YAML을 작성한다.

필수 참조:

- `description-yaml-schema.md`

출력:

```text
draft-descriptions/<component>.description.yaml
```

판단 기준:

- `draft-descriptions/<component>.description.yaml`이 SoT다.
- 같은 component workflow를 다시 실행하면 같은 파일을 최신 결과로 덮어쓴다.
- schema section을 임의로 줄이지 않는다.

## Step 5. 검증/기록

목표:

- YAML을 validator로 검증하고, 결정 또는 동작 변경을 history에 기록한다.

필수 참조:

- `validation-checklist.md`

판단 기준:

- `node tools/validate-component-description.mjs draft-descriptions/<component>.description.yaml`를 실행한다.
- FAIL이면 YAML을 수정하고 재실행한다.
- 결정 또는 동작 변경이 있으면 history에 짧게 기록한다.
