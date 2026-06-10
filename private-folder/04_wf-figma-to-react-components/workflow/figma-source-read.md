---
type: WorkflowReference
status: Draft
version: 1.0
updated: 2026-05-08
---

# Figma Source Read

이 문서는 Figma component data를 읽고 representative variant를 고르는 기준을
정의한다.

## Address Lookup

```bash
rg -n "<Component Name>" "../design-cds-docs/99_ref/ref-figma-component-keys/chord-ds/index.md"
```

- `index.md`는 node id와 component key 주소록으로만 사용한다.
- variant detail markdown 파일은 source of truth로 사용하지 않는다.

## Framelink/Figma MCP

component set context:

```text
get_context_for_code_connect(
  fileKey="DWEduE6GfxYMlyxKPNJ8jA",
  nodeId="<component-set-node-id>",
  clientFrameworks="react",
  clientLanguages="typescript,css"
)
```

representative child context:

```text
get_design_context(fileKey="DWEduE6GfxYMlyxKPNJ8jA", nodeId="<representative-node-id>")
```

판단 기준:

- component set 전체가 너무 크면 sparse metadata만 신뢰하고 child node를 좁혀 읽는다.
- generated Tailwind/code는 그대로 사용하지 않고 token 기반 CSS로 변환한다.
- layout, padding, typography, radius, state behavior는 representative child node 기준으로 확인한다.

## Console MCP

metadata:

```text
figma_get_component(
  nodeId="<component-set-node-id>",
  format="metadata",
  enrich=true
)
```

visual reference:

```text
figma_get_component_image(
  nodeId="<representative-node-id>",
  format="png",
  scale=3
)
```

판단 기준:

- Console MCP description의 axes, constraints, token, layout을 source note에 기록한다.
- Framelink child node와 Console MCP 값이 다르면 conflict로 남긴다.
- screenshot URL은 만료될 수 있으므로 가능한 local baseline 저장을 선호한다.

## Required vs Deferrable Reads

Required reads:

- parent component set metadata
- representative child context
- representative visual image or local baseline source

Required read 실패 또는 Console MCP Desktop Bridge disconnected 상태에서는 source
note 작성과 component implementation을 중단하고 사용자에게 재연결/재시도를
요청한다.

Deferrable reads:

- parent read 후 발견된 nested component/module의 node id가 없거나 별도 nested
  read만 실패한 경우

이 경우에는 source note에 `nested-read-failed:<component-name>`을 남기고
`Nested Module Inventory` coverage를 `deferred`로 표시한다. Deferred nested
coverage는 implementation scope를 줄일 수는 있지만 full-parity visual gate로
보고할 수 없다.

## Representative Variant Rule

button-like component는 default variant만 읽지 않는다.

최소 후보:

- default render
- disabled 또는 loading state
- color constraint가 있는 variant
- ghost, outlined, selected 등 visual style 차이
- radius 차이
- fixed mode가 있으면 fixed sample

범주를 생략하면 source note의 `Known Gaps`에 이유를 기록한다.

이 기준은 `03_wf-figma-to-description` Step 2 Representative Variant Rule과
동일하다. Figma Description에 이미 coverage gap이 기록되어 있으면 해당
`source_gaps`를 이 source note의 `Known Gaps`로 가져올 수 있다.

## Nested Component Scan (필수)

component set MCP read 완료 후, description 또는 child node에서 nested component
또는 nested component-set 참조가 발견되면 **source note 완성 전에** 아래를 수행한다.

1. nested component/component-set의 nodeId를 기록한다.
2. 각 nested component set에 대해 별도 `figma_get_component` 또는
   `get_design_context` read를 수행한다.
3. nested component의 variant axes, props, options을 source note
   `Nested Module Inventory` 테이블에 기록한다.
4. **Nested Module Inventory 테이블이 채워지기 전에는 source note를 완성하지 않는다.**

판단 기준:

- `showLeading: boolean` 같은 visibility prop만으로 nested component의 enum을
  대체하지 않는다. enum을 먼저 읽고 기록한다.
- `ReactNode` slot으로 처리하는 nested component도 그 axes/props를 먼저 읽는다.
  읽기 전까지는 slot 계약을 확정하지 않는다.
- nested component nodeId를 확인할 수 없거나 MCP read가 실패하면 `Known Gaps`에
  `nested-read-failed: <component-name>`으로 기록하고 Inventory 테이블에 coverage를
  `deferred`로 표시한다. 이 경우에만 slot 계약이 허용된다.
- Figma MCP read는 nested component instance를 재귀적으로 해석하지 않는다.
  nested component의 enum은 반드시 해당 component set을 별도로 읽어야 알 수 있다.

## Unpromoted Nested Instance Swap 발견 절차

`componentPropertyDefinitions` (Plugin API) 또는 `propertyDefinitions` (REST API)는
component set 레벨에서 **promote된 속성만** 반환한다. Figma UI 디자인 패널에 슬롯
드롭다운이 보이는데 API에서 나오지 않으면 **unpromoted nested instance swap**이다.

molecule 컴포넌트일수록 내부 atom 슬롯이 여러 타입을 지원하는 경우가 많다.
API만 보고 "한 가지 타입으로 고정"이라고 결론 내리지 않는다.

발견 절차:

1. Framelink REST API로 **child variant 노드**를 depth ≥ 3으로 읽는다.

   ```text
   get_figma_data(
     fileKey="DWEduE6GfxYMlyxKPNJ8jA",
     nodeId="<child-variant-node-id>",
     depth=3
   )
   ```

2. 슬롯 역할을 하는 INSTANCE 노드(예: `name: "Leading"`)의 `componentId`를 확인한다.

3. 반환된 `components` 맵에서 해당 `componentId`의 `componentSetId`를 추적한다.

4. `componentSetId`가 가리키는 component set(예: `_atoms / modules / Leading
   (Optional)`)을 별도로 읽어 모든 variant Type을 열거한다.

   ```text
   get_figma_data(
     fileKey="DWEduE6GfxYMlyxKPNJ8jA",
     nodeId="<slot-component-set-id>",
     depth=1
   )
   ```

5. 열거한 Type 목록을 source note `Nested Module Inventory`와 `assets` 섹션에 기록한다.

판단 기준:

- API `propertyDefinitions`가 슬롯에 대해 boolean만 반환해도, Figma UI에서 드롭다운이
  보이면 반드시 위 절차를 수행한다.
- child variant node는 12개 변형 중 default/representative 하나만 읽어도 Leading의
  `componentSetId`를 확인할 수 있다.
- 슬롯의 component set read가 실패하면 `Known Gaps`에
  `nested-instance-swap-read-failed: <slot-name>`을 기록하고 coverage를 `deferred`로
  표시한다.

참조: [`knowledge/figma-reading/nested-instance-swap-discovery.md`](../knowledge/figma-reading/nested-instance-swap-discovery.md)

이 절차는 `03_wf-figma-to-description` Step 2.75와 동일한 발견 방법이다.
Figma Description의 `composition.uses`에 이미 slot 타입이 기록되어 있으면
해당 값을 우선 읽고 이 절차를 생략할 수 있다. Description이 없거나 불완전하면
직접 수행한다.
