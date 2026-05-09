---
component:
  name: "Badge"
  description: "Badge는 navigation item, icon, compact control 위에 알림, 카운트, 상태 정보를 작게 표시하는 컴포넌트다. 사용자가 목적지를 열지 않고도 새 항목, 읽지 않음, 카운트 가능 상태를 알아야 할 때 사용한다."
  status: "stable"
  version: "1.0"
source:
  figma_file: "Chord Design System"
  file_key: ""
  component_set:
    name: "Badge"
    node_id: ""
    key: ""
  usage_source:
    file_key: ""
    node_id: ""
props:
  "kind":
    type: "\"Dot\""
    default: "\"Number\""
    description: "필수"
    required: false
  "Mode":
    type: "\"Default\""
    default: "\"Fixed\""
    description: "\"Default\""
    required: false
  "Size":
    type: "\"Small\""
    default: "\"Medium\""
    description: "\"Large\""
    required: false
  "Outline":
    type: "\"ON\""
    default: "\"OFF\""
    description: "boolean"
    required: false
  "Type":
    type: "\"Number\""
    default: "\"New\""
    description: "\"Number\""
    required: false
  "Label":
    type: "string"
    default: "\"999+\""
    description: "Number Badge 전용. `+` 포함 4자 이내로 제한한다."
    required: false
variants:
  axes:
    "Mode":
      - "Default"
      - "Fixed"
    "Size":
      - "Small"
      - "Medium"
      - "Large"
    "Outline":
      - "ON"
      - "OFF"
    "Type":
      - "Number"
      - "New"
  component_props:
    "Label":
      type: "text"
      default: "999+"
  count:
    figma_console: 16
    figma_rest: 16
  constraints:
    - summary: |
        Figma/REST Badge variant axis:
        
        | Axis | 값 |
        | --- | --- |
        | `Mode` | `Default`, `Fixed` |
        | `Size` | `Small`, `Medium`, `Large` |
        | `Outline` | `ON`, `OFF` |
        | `Type` | `Number`, `New` |
        
        Variant 개수:
        
        | 출처 | 개수 |
        | --- | ---: |
        | Figma REST component set `Badge` | 16 |
        | Design context extracted components | 16 |
        
        유효한 조합:
        
        | kind | 유효 props |
        | --- | --- |
        | `Dot` | `Mode`, `Size`, `Outline` |
        | `Number` | `Mode`, `Type`, `Label` |
states:
  _summary: |
    | 상태 | 적용 대상 | 동작 |
    | --- | --- | --- |
    | `Mode=Default` | Dot, Number | `system/color/*` 토큰을 사용한다. |
    | `Mode=Fixed` | Dot, Number | `system/fixed_color/*` 토큰을 사용한다. |
    | `Outline=ON` | Dot | reverse outline stroke를 추가하고 렌더링 지름을 키운다. |
    | `Outline=OFF` | Dot | 기본 red dot만 렌더링한다. |
    | `Type=Number` | Number | 사용자가 제공한 `Label`을 렌더링한다. |
    | `Type=New` | Number | 고정 `N`을 렌더링한다. |
    | Interactive hover/focus/pressed | Parent control | Badge는 presentational이며 interaction은 parent가 소유한다. |
tokens:
  token_1:
    default: "system/color/roles/negative"
    fixed: ""
    fallback: ""
  token_2:
    default: "system/fixed_color/roles/negative"
    fixed: ""
    fallback: ""
  token_3:
    default: "system/color/status/danger-red"
    fixed: ""
    fallback: ""
  token_4:
    default: "system/fixed_color/status/danger-red"
    fixed: ""
    fallback: ""
  token_5:
    default: "system/color/text/white-same"
    fixed: ""
    fallback: ""
  token_6:
    default: "system/fixed_color/text/white-same"
    fixed: ""
    fallback: ""
  token_7:
    default: "system/color/outline/default-reverse"
    fixed: ""
    fallback: ""
  token_8:
    default: "system/fixed_color/outline/default-reverse"
    fixed: ""
    fallback: ""
  token_9:
    default: "system/size/padding/box/50"
    fixed: ""
    fallback: ""
  token_10:
    default: "base/text_size/text-50"
    fixed: ""
    fallback: ""
  token_11:
    default: "base/lineheight/text-lineheight-50"
    fixed: ""
    fallback: ""
layout:
  sizes:
    - name: "Small"
      image: "4px"
      touch: "6px"
    - name: "Medium"
      image: "6px"
      touch: "8px"
    - name: "Large"
      image: "8px"
      touch: "12px"
  spacing:
    - summary: |
        Dot Badge:
        
        | Size | 이미지 | 터치 영역 |
        | --- | ---: | ---: |
        | Small | 4px | 6px |
        | Medium | 6px | 8px |
        | Large | 8px | 12px |
        
        Number Badge:
        
        | Type | 높이 | 최소 너비 | Padding |
        | --- | ---: | ---: | --- |
        | `Number` | 16px | 16px | `system/size/padding/box/50` horizontal |
        | `New` | 16px | 16px | 중앙 정렬된 `N` |
        
        Dot Badge radius는 완전한 원형이다. Number Badge radius는 `20px` pill radius를 사용한다. 텍스트는 `caption-s/system-500` semantics를 따른다.
  radius:
    - role: "shape"
      token: ""
  responsive_rules:
    - summary: |
        Badge 위치는 parent가 결정한다. 컴포넌트 내부에 outer margin을 넣지 않는다. Dot Badge size는 `Small`, `Medium`, `Large`로 고정된다. Number Badge는 고정 16px 높이와 최소 16px 너비를 사용한다.
        
        Badge를 icon 또는 avatar에 anchor할 때는 parent level에서 absolute positioning을 사용한다. parent가 명시적으로 공간을 예약하지 않는 한 Badge가 parent layout size에 영향을 주면 안 된다.
accessibility:
  summary: |
    인접 텍스트가 이미 상태를 전달한다면 Badge는 장식 요소다. unread/new 콘텐츠의 유일한 표시라면 parent control label에 해당 상태를 노출한다. 예: `Notifications, 3 unread`, `Messages, new`.
    
    Badge 단독으로 tab order에 넣지 않는다. focus와 keyboard behavior는 parent control이 소유한다.
rules:
  do:
    - "숫자가 필요 없는 unread/new presence에는 Dot Badge를 사용한다."
    - "`1`, `99`, `999+` 같은 compact count에는 Number Badge를 사용한다."
    - "Number Badge content는 `+` 포함 4자로 제한한다."
    - "dot이 white, image, mixed background 위에 놓이면 `Outline=ON`을 사용한다."
  dont:
    - "Badge 안에 긴 텍스트를 넣지 않는다."
    - "Badge 자체를 interactive하게 만들지 않는다."
    - "임의의 dot size를 사용하지 않는다."
    - "Badge를 status chip, tag, toast message 대체재로 사용하지 않는다."
notes:
  source_notes: |
    | 출처 | 값 |
    | --- | --- |
    | 파일 | `Chord Design System` |
    | File key | `DWEduE6GfxYMlyxKPNJ8jA` |
    | 문서 프레임 | `11859:104160` / `Badge` |
    | Header 본문 | `배지는 탐색 항목 및 아이콘에 대한 알림, 카운트 또는 상태 정보를 표시합니다.` |
    | 원칙 | `라벨이나 숫자를 포함할 수 있습니다.` |
    | 원칙 | `내용은 “+”를 포함하여 4자로 제한합니다.` |
    | REST set | `Badge` |
  source_gaps: []
  deprecated: []
---

# Badge
---

> Badge는 navigation item, icon, compact control 위에 알림, 카운트, 상태 정보를 작게 표시하는 컴포넌트다. 사용자가 목적지를 열지 않고도 새 항목, 읽지 않음, 카운트 가능 상태를 알아야 할 때 사용한다.
---

## 1. 역할과 사용

Badge는 navigation item, icon, compact control 위에 알림, 카운트, 상태 정보를 작게 표시하는 컴포넌트다. 사용자가 목적지를 열지 않고도 새 항목, 읽지 않음, 카운트 가능 상태를 알아야 할 때 사용한다.

가벼운 주의 표시에는 Dot Badge를 사용한다. count 또는 "new" marker를 직접 읽어야 하면 Number Badge를 사용한다. Badge는 host element의 보조 정보로 유지해야 하며 main label을 대체해서는 안 된다.

사용 용도는 알림, 카운트, 새 항목, 상태 신호를 작게 보조 표시하는 것이다.

긴 상태 텍스트, 전체 레이블, category chip, 지속 노출되는 system message에는 Badge를 사용하지 않는다.
---

## 2. 시각적 성격

Badge는 작고 밝으며 긴급한 인상을 준다. 시각 언어는 의도적으로 최소화한다. red fill, number/new label의 white text, 복잡하거나 대비가 강한 surface 위에서 쓰는 optional outline만 사용한다.

Dot Badge는 콘텐츠가 아니라 signal로 읽혀야 한다. Number Badge는 작은 크기에서도 pill shape, 높은 밀도, 가독성을 유지해야 한다.
---

## 3. 구조

핵심 파트:

- `root`: inline badge wrapper.
- `dot`: Dot Badge용 원형 red indicator.
- `label`: Number Badge용 count text 또는 `N` text.
- `outline`: Dot Badge 주변 optional edge stroke.

구현에서는 Dot Badge와 Number Badge를 discriminated type을 가진 하나의 컴포넌트로 노출하거나, 같은 token contract를 공유하는 두 subcomponent로 노출한다.
---

## 4. 컴포넌트 스타일링

Dot Badge는 circular red fill을 사용한다. `Outline=ON`은 outer stroke를 추가하고 렌더링 지름을 키운다. `Outline=OFF`는 inner dot size만 사용한다.

Number Badge는 16px 높이, red fill, white text, pill radius를 사용한다. `Type=Number`는 짧은 count label을 받는다. `Type=New`는 고정 `N` marker를 렌더링한다. Label content는 `+` 포함 4자로 제한한다.
---

## 5. 상태와 인터랙션

Badge는 presentational이다. hover, pressed, selected, focus state를 자체적으로 소유하지 않는다. parent icon, tab, navigation item, button이 interaction을 소유한다.

상태성 variant:

- `Mode=Default`는 활성 테마를 따른다.
- `Mode=Fixed`는 고정 다크 테마 색상 동작을 유지한다.
- `Outline=ON`은 dot이 배경에서 분리되어 보여야 할 때 사용한다.
- `Type=Number`는 count text를 표시한다.
- `Type=New`는 new marker를 표시한다.
---

## 6. 레이아웃과 반응형 규칙

Badge 위치는 parent가 결정한다. 컴포넌트 내부에 outer margin을 넣지 않는다. Dot Badge size는 `Small`, `Medium`, `Large`로 고정된다. Number Badge는 고정 16px 높이와 최소 16px 너비를 사용한다.

Badge를 icon 또는 avatar에 anchor할 때는 parent level에서 absolute positioning을 사용한다. parent가 명시적으로 공간을 예약하지 않는 한 Badge가 parent layout size에 영향을 주면 안 된다.
---

## 7. 권장/금지

DO:

- 숫자가 필요 없는 unread/new presence에는 Dot Badge를 사용한다.
- `1`, `99`, `999+` 같은 compact count에는 Number Badge를 사용한다.
- Number Badge content는 `+` 포함 4자로 제한한다.
- dot이 white, image, mixed background 위에 놓이면 `Outline=ON`을 사용한다.

DON'T:

- Badge 안에 긴 텍스트를 넣지 않는다.
- Badge 자체를 interactive하게 만들지 않는다.
- 임의의 dot size를 사용하지 않는다.
- Badge를 status chip, tag, toast message 대체재로 사용하지 않는다.
---

## 8. 에이전트 프롬프트 가이드

구현 코드를 생성할 때 사용할 프롬프트:

```text
구현 계약을 기준으로 Chord DS Badge를 만든다. Dot Badge는 Mode, Size, Outline을 지원한다. Number Badge는 Mode, Type=Number/New, Label을 지원한다. 고정 dimension, red semantic token, white text token을 사용하고 독립 interaction state는 만들지 않는다.
```

생성된 코드를 검토할 때 사용할 프롬프트:

```text
Badge가 Mode=Default/Fixed, Dot Size=Small/Medium/Large, Outline=ON/OFF, Number Type=Number/New, `+` 포함 최대 4자 label, 16px Number Badge 높이, 토큰화된 red/white/outline color를 지원하는지 확인한다.
```
