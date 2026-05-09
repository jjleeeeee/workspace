---
type: WorkflowReference
status: Draft
version: 1.0
updated: 2026-05-05
---

# Description YAML Schema

이 문서는 Figma Component Description에 저장하는 YAML 구조와 section 규칙을
정의한다. YAML은 plain `description`에만 저장한다.

## Required Shape

```yaml
component:
  name: "<component_name>"
  description: "<한 줄 설명>"
  figma_file: "<file_key>"
  node_id: "<component_set_node_id>"
  component_set_key: "<component_set_key>"
  last_synced: "<YYYY-MM-DD>"

axes:
  <AxisName>: ["<value1>", "<value2>"]

variants:
  count: <n>
  formula: "<Axis1(n1) x Axis2(n2)>"
  constraints:
    - "<유효/무효 조합 규칙>"
  registry:
    - { variant: "<name>", node_id: "<id>", key: "<component_key>" }

props:
  <PropName>:
    type: '"<value1>" | "<value2>"'
    default: '"<default>"'
    description: "<설명>"

tokens:
  <token_key>:
    part: "<part_name>"
    role: "fill | stroke"
    applies_to: "<Status=...>"
    default: "<system/color/...>"
    fixed: "<system/fixed_color/...>"
  label_gap:
    token: "<system/size/...>"
    value: "<Npx>"

typography:
  <text_role>:
    font_family: "<Figma fontFamily 값>"
    classification: "actual-font | system-alias | token-alias | unknown"
    system_fallback: "<OS 시스템 폰트, e.g. SF Pro / Apple SD Gothic>"
    token_fallback: "<token 기반 폰트 참조>"
    note: "<분류 근거 또는 미확정 이유>"

assets:
  <asset_key>:
    part: "<part_name>"
    role: "icon | image | logo | badge | emoji"
    source: "<DS asset key or Figma node id>"
    applies_to: "<Status=... / Prop=...>"
    size: "<WxHpx>"
    tint:
      default: "<system/color/...>"
      fixed: "<system/fixed_color/...>"
    implementation: "<기존 개발 asset 사용. CSS/vector redraw 금지.>"
    semantic_rule: "<문자처럼 보여도 role=icon/image/logo/badge이면 text content로 대체하지 않는다.>"

composition:
  uses:
    - component: "<nested_component_name>"
      node_id: "<nested_component_set_node_id>"
      component_set_key: "<nested_component_set_key>"
      role: "<부모 컴포넌트 안에서의 의미>"
      usage_condition: "<Prop/State/Slot 조건. 불명확하면 referenced>"
      spec_owner: "<하위 컴포넌트 Description 또는 component set 이름>"

layout:
  component_size: "<WxHpx>"
  <other_dimensions>: "<value>"
  part_spacing:
    "<part_a>__to__<part_b>":
      variation_checked_by:
        axes: true
        props: true
        states: true
      default:
        token: "<system/size/...>"
        value: "<Npx>"
      variants:
        - when: "<Axis/Prop/State 조건>"
          token: "<system/size/...>"
          value: "<Npx>"

text_behavior:
  <text_role>:
    text_auto_resize: "NONE | WIDTH_AND_HEIGHT | HEIGHT | TRUNCATE"
    parent_sizing: "<hug / fixed / min-height / mixed>"
    overflow_policy: "<wrap / clip / ellipsis / unknown>"
    row_height_behavior: "<grows-with-text / fixed / unknown>"
    inline_adornments:
      - part: "<badge/icon/suffix/prefix name>"
        role: "badge | icon | suffix | prefix"
        attachment: "rendered-text-end | container-end | fixed-slot"
        rule: "Badge follows the rendered end of title text, not the full title container end."

implementation_order:
  - "Resolve size and layout metrics first."
  - "Resolve mode/type/color visual tokens next."
  - "Apply status overrides after visual tokens."
  - "Apply radius/shape rule last."
  - "Disabled and Loading states must override enabled visual treatment."

implementation_coverage:
  axes: "Variant board로 전수 구현하거나 유효 조합 수와 제외 조합을 명시한다."
  props: "Variant 축이 아닌 prop도 slot/content/control sample로 검증 가능하게 구현한다."
  assets: "Icon/image/loading 등 asset-backed visual은 text fallback 없이 asset/component 의미를 보존한다."
  layout: "Size, padding, gap, radius, alignment 등 시각 구조 값을 구현에 반영한다."
  exclusions: "구현하지 않는 prop/assets/layout 항목은 제외 사유를 명시한다."

rules:
  do:
    - "<규칙>"
  dont:
    - "<규칙>"

spec_notes:
  <sub_element>:
    size_table:
      <size_group>: { <key>: <value> }
  <gradient_key>:
    type: "gradient"
    style_name: "<figma_paint_style_name>"
    stops:
      - { pos: "<n%>", token: "<system/color/...>" }
  implementation:
    - "<구현 주의사항>"

source_gaps:
  - part: "<part_or_field>"
    reason: "<확인하지 못한 이유>"
```

## Required Sections

validator는 최소한 다음 top-level section을 기대한다.

- `component`
- `axes`
- `variants`
- `tokens`
- `layout`
- `implementation_order`
- `implementation_coverage`
- `rules`

`component`에는 `name`, `description`, `figma_file`, `node_id`,
`component_set_key`, `last_synced`가 있어야 한다.

`implementation_coverage`에는 `axes`, `props`, `assets`, `layout`,
`exclusions`가 있어야 한다.

## Section Rules

- `implementation_order`는 플랫폼 중립 구현 순서다. CSS selector,
  framework API, modifier class 같은 기술별 구현법을 쓰지 않는다.
- `implementation_coverage`는 axes뿐 아니라 props, assets, layout까지
  구현 검증 범위를 명시한다.
- `layout.part_spacing`은 part-to-part 기준으로 기록한다. 조건별 간격이
  다르면 `variants[]`에 `when`, `token`, `value`를 분리한다.
- `typography`는 선택 섹션이다. Figma text node의 `fontFamily` 값을
  `actual-font`, `system-alias`, `token-alias`, `unknown` 중 하나로 분류한다.
  `system-alias`이면 `system_fallback`에 OS 시스템 폰트를 기록한다.
  `WeGothicSans`처럼 macOS 전용 렌더링 alias는 `system-alias`로 분류한다.
  분류가 불명확하면 `unknown`으로 남기고 `source_gaps`에 이유를 기록한다.
- `text_behavior`는 선택 섹션이다. `textAutoResize`, parent sizing, overflow
  policy, inline adornment 위치, row height behavior가 구현 결과를 바꿀 때
  기록한다. 특히 badge/icon/suffix/prefix가 text 끝에 붙는지 container 끝에
  붙는지 명시한다. parent의 fixed height나 single-line 스크린샷만으로
  ellipsis 처리를 추론하지 않는다.
- `assets.*.semantic_rule`은 asset-backed visual을 text content로 대체하지
  않기 위한 규칙이다.
- `composition.uses`는 복합 컴포넌트에서만 추가한다. 부모 컴포넌트는 하위
  DS component 상세 스펙을 복붙하지 않고 재사용 관계만 기록한다.
- `spec_notes`는 출처, readback 결과, markitdown 보충 정보, 복합 스펙 메모가
  필요할 때 추가한다. 단순 컴포넌트도 source/verification note는 허용한다.
- `source_gaps`는 확인하지 못한 값이 있을 때만 추가한다. `token: null`을
  직접 저장하지 않고 gap 이유를 적는다.

## Asset Policy

- `ic_*`, `24/em/*`, image fill, logo, avatar image, badge, emoji,
  semantic vector는 `assets`에 기록한다.
- 개발팀에 이미 있는 asset은 export path가 아니라 DS asset key를 `source`에 기록한다.
- source가 불명확하면 임의로 다시 그리지 않고 `source_gaps`에 기록한다.

## Composition Policy

- `Badge_Dot`, `[V2] Divider`, `[V2] Avatar`, `Tag`, `Thumbnail`,
  `Trailing`처럼 구현자가 기존 DS component로 재사용해야 하는 관계만 기록한다.
- `icon_area`, `Selection`, 내부 vector/frame, 단순 장식 layer 같은
  low-level detail은 `composition.uses`에서 제외한다.
- 관계는 확인됐지만 위치나 조건이 불명확하면
  `usage_condition: "referenced"`처럼 남기고 구체적 미확정 내용은
  `source_gaps`에 기록한다.
