---
component:
  name: "CheckBox"
  description: "CheckBox는 사용자가 0개부터 전체까지 자유롭게 중복 선택할 수 있어야 하는 맥락에서 사용한다. 복수 선택 목록, 약관 동의, 필터 선택, 이어보기 선택 등이 대표적인 사용 사례다."
  status: "stable"
  version: "1.0"
source:
  figma_file: "Chord Design System"
  file_key: "DWEduE6GfxYMlyxKPNJ8jA"
  component_set:
    name: "[V2] Checkbox"
    node_id: "60365:40276"
    key: ""
  usage_source:
    file_key: ""
    node_id: ""
props:
  "Mode":
    type: "\"Default\" \\"
    default: "\"Fixed\""
    description: "\"Default\""
    required: false
  "Type":
    type: "\"Circle\" \\"
    default: "\"Square\""
    description: "\"Circle\""
    required: false
  "Status":
    type: "\"Default\" \\"
    default: "\"Enabled\" \\"
    description: "\"Disabled\""
    required: false
  "onChange":
    type: "function"
    default: "optional"
    description: "Status 변경 시 호출. Disabled일 때 무시됨."
    required: false
  "label":
    type: "ReactNode"
    default: "optional"
    description: "체크박스 우측 레이블. 터치 영역에 포함됨."
    required: false
variants:
  axes:
    "Mode":
      - "Default"
      - "Fixed"
    "Type":
      - "Circle"
      - "Square"
    "Status":
      - "Default"
      - "Disabled"
      - "Enabled"
  component_props:
    _none: {}
  count:
    figma_console: 12
    figma_rest: 12
  constraints:
    - summary: |
        Figma component set의 axis `60365:40276` (`[V2] Checkbox`):
        
        | Axis | 값 |
        | --- | --- |
        | `Mode` | `Default`, `Fixed` |
        | `Type` | `Circle`, `Square` |
        | `Status` | `Default`, `Enabled`, `Disabled` |
        
        Variant 개수:
        
        | 출처 | 개수 |
        | --- | ---: |
        | Figma REST | 12 |
        | figma-console/analyze | 12 |
        
        메모:
        
        - `Type=Square`는 List Item 내부 전용이며 추후 Figma에서 삭제 예정. 신규 구현에서 사용하지 않는다.
        - CheckBox 컴포넌트 자체는 선택 상태를 보유하지 않음. `Status` prop은 controlled 방식으로 주입.
        
        ---
states:
  _summary: |
    | Status | Applies To | Behavior |
    | --- | --- | --- |
    | `Default` | Circle, Square | 미선택. 빈 outline 표시. 탭/클릭 시 `Enabled`로 전환. |
    | `Enabled` | Circle, Square | 선택됨. Primary fill + 체크 아이콘 표시. |
    | `Disabled` | Circle, Square | 비활성. 반투명 fill. 포인터·키보드 이벤트 차단. `aria-disabled="true"` 또는 `disabled` 속성 적용. |
    
    Mode 동작:
    
    | Mode | Token 세트 |
    | --- | --- |
    | `Default` | `system/color/*` |
    | `Fixed` | `system/fixed_color/*` |
    
    ---
tokens:
  token_1:
    default: "system/color/roles/primary"
    fixed: ""
    fallback: ""
  token_2:
    default: "system/fixed_color/roles/primary"
    fixed: ""
    fallback: ""
  token_3:
    default: "system/color/outline/default-200a"
    fixed: ""
    fallback: ""
  token_4:
    default: "system/fixed_color/outline/default-200a"
    fixed: ""
    fallback: ""
  token_5:
    default: "system/color/surface/default-reverse-100a"
    fixed: ""
    fallback: ""
  token_6:
    default: "system/fixed_color/surface/default-reverse-100a"
    fixed: ""
    fallback: ""
  token_7:
    default: "system/color/icon/default-reverse"
    fixed: ""
    fallback: ""
  token_8:
    default: "system/fixed_color/icon/default-reverse"
    fixed: ""
    fallback: ""
  token_9:
    default: "system/color/icon/200a"
    fixed: ""
    fallback: ""
  token_10:
    default: "system/fixed_color/icon/200a"
    fixed: ""
    fallback: ""
  token_11:
    default: "system/size/radius/box/75"
    fixed: ""
    fallback: ""
layout:
  sizes:
    []
  spacing:
    - summary: |
        | Property | Value |
        | --- | --- |
        | Checkbox size | 24×24px |
        | Inner box (visible) | 22×22px (1px margin each side, stroke inside) |
        | Stroke weight | 1px |
        | Circle border-radius | `rounded/full` (ELLIPSE) |
        | Square border-radius | `system/size/radius/box/75` = 6px |
        | Checkbox ↔ Label gap | 6px |
        | Touch/click target | Checkbox + Label 전체 영역 |
        
        ---
  radius:
    - role: "shape"
      token: ""
  responsive_rules:
    - summary: |
        CheckBox는 크기가 24×24px로 고정된다. 크기를 임의로 변경하지 않는다.
        
        레이블 텍스트와의 간격은 6px. CheckBox와 레이블을 수평으로 배치하고, 터치 및 클릭 영역은 두 요소를 모두 포함하는 넓은 영역으로 설정한다. 좁은 터치 영역(체크박스만)은 사용자 불편을 유발한다.
        
        복수 항목 목록에서는 각 항목을 동일한 수직 간격으로 배치한다. 상위-하위 계층 구조가 있을 경우 하위 항목은 들여쓰기로 구분하고 `ic_check_xsmall` 아이콘을 사용한다.
        
        ---
accessibility:
  summary: |
    - **Role**: `checkbox` (native `<input type="checkbox">` 또는 `role="checkbox"`)
    - **Label**: `aria-label` 또는 연결된 `<label>` 요소. 레이블 텍스트가 있으면 `htmlFor` / `aria-labelledby` 사용.
    - **Keyboard**: `Space`로 선택/해제. Tab으로 포커스 이동.
    - **Disabled**: `disabled` 속성 또는 `aria-disabled="true"`. 포인터 및 키보드 이벤트 차단.
    - **Indeterminate**: 상위-하위 구조에서 일부만 선택된 경우 `aria-checked="mixed"` 사용 고려.
    - **Contrast**: WCAG AA (4.5:1) 이상 유지.
    
    ---
rules:
  do:
    - "복수 선택이 필요한 목록에는 CheckBox를 사용한다."
    - "단일 항목이더라도 동의/승인이 필요하면 CheckBox를 사용한다."
    - "`Circle` 타입을 기본으로 사용한다. `Square`는 List Item 내부에서만 사용한다."
    - "터치/클릭 영역을 체크박스 + 텍스트 전체로 설정한다."
    - "상위 체크박스 상태 변경 시 모든 하위 항목에 즉시 반영한다."
    - "`Default` 상태는 빈 원/사각형 outline으로 표현한다."
  dont:
    - "복수 선택이 가능한 상황에서 Radio Button을 사용하지 않는다."
    - "단일 선택만 가능한 상황에서 CheckBox를 사용하지 않는다."
    - "`Default` 상태에 회색 체크 아이콘을 넣지 않는다 (V1 스타일 사용 금지)."
    - "신규 화면에서 `Square` 타입을 사용하지 않는다 (추후 삭제 예정)."
    - "체크박스 크기를 24px 외 임의 값으로 조정하지 않는다."
    - "터치 영역을 체크박스 단독(24×24px)으로 제한하지 않는다."
notes:
  source_notes: |
    - **Component set node ID**: `60365:40276`
    - **Component set name**: `[V2] Checkbox`
    - **Figma file**: `DWEduE6GfxYMlyxKPNJ8jA` (Chord Design System)
    - **Usage file**: `6pHGdaJh3L8Z1Ew8AxIV85` (Chord_Usage), node `819:36201`
    - `Type=Square`는 Figma에서 추후 삭제 예정. REST API와 figma-console 모두 현재는 12 variants 반환.
    - 체크마크 아이콘은 24px icon slot (`ic_check_medium`) 사용. 아이콘 슬롯은 `icon_area` 컴포넌트 세트(`10219:79404`)에서 참조.
    - 하위 항목 체크마크: `ic_check_xsmall` (16px) 사용.
  source_gaps: []
  deprecated: []
---

# CheckBox
---

> CheckBox는 사용자가 0개부터 전체까지 자유롭게 중복 선택할 수 있어야 하는 맥락에서 사용한다. 복수 선택 목록, 약관 동의, 필터 선택, 이어보기 선택 등이 대표적인 사용 사례다.
---

## 1. 역할과 사용

CheckBox는 사용자가 0개부터 전체까지 자유롭게 중복 선택할 수 있어야 하는 맥락에서 사용한다. 복수 선택 목록, 약관 동의, 필터 선택, 이어보기 선택 등이 대표적인 사용 사례다.

단일 항목이더라도 사용자의 승인 또는 동의 여부를 명시적으로 받아야 할 때는 CheckBox를 사용한다. 약관 동의 화면의 개별 항목이 이에 해당한다.

`Circle`이 기본 타입이다. `Square`는 List Item 내부 맥락 전용으로, 추후 삭제 예정이므로 신규 화면에서는 `Circle`만 사용한다.

복수 선택이 가능한 상황에서 Radio Button을 사용하지 않는다. 단일 선택만 허용할 때는 RadioButton을 사용한다.

---
---

## 2. 시각적 성격

CheckBox는 작고 조용한 선택 지시자다. 24×24px 크기로 고정되며, 텍스트 레이블과 함께 묶여 하나의 선택 가능한 단위를 이룬다.

`Default`(미선택) 상태는 속이 빈 원(Circle) 또는 사각형(Square)으로 표시되며, 배경보다 낮은 대비의 outline으로 존재감을 최소화한다. `Enabled`(선택됨) 상태에서는 Primary 컬러 배경에 흰색 체크마크가 채워져 명확하게 선택 상태를 강조한다.

터치 및 클릭 영역은 CheckBox 단독이 아닌 체크박스 + 텍스트 전체 영역을 포함하도록 구성한다.

---
---

## 3. 구조

핵심 파트:

- `root`: 24×24px 고정 크기 래퍼. 터치 영역은 레이블 텍스트까지 포함한 넓은 영역으로 구성.
- `box`: 실제 선택 상태를 표현하는 시각 요소. Circle 타입은 ELLIPSE(full round), Square 타입은 rounded rect(6px radius).
- `check icon`: `Status=Enabled`일 때 box 내부에 나타나는 체크마크. 24px 아이콘 슬롯 사용.
- `label` *(external)*: CheckBox 오른쪽에 배치되는 텍스트. 6px gap으로 연결. 컴포넌트 내부에 포함되지 않으며 소비자가 레이아웃으로 구성.

하위 항목 리스트를 표현할 때는 `ic_check_xsmall`을 사용하여 시각적 계층을 구분한다. 상위 항목 상태 변화는 모든 하위 항목에 즉시 반영된다.

---
---

## 4. 컴포넌트 스타일링

**Circle (기본 타입)**

- `Default`: 빈 ELLIPSE, stroke `system/color/outline/default-200a` (1px inside)
- `Enabled`: Primary 배경(`system/color/roles/primary`) + 흰색 체크아이콘(`system/color/icon/default-reverse`)
- `Disabled`: 반투명 배경(`system/color/surface/default-reverse-100a`) + 흐린 stroke + 흐린 체크아이콘(`system/color/icon/200a`)

**Square (List Item 전용)**

- Circle과 동일한 상태별 색상 처리
- box가 ELLIPSE 대신 6px radius rounded rect를 사용
- Fixed mode에서는 동일 구조로 `system/fixed_color/*` 토큰 사용

`Default` 상태의 빈 박스에 회색 체크 아이콘을 넣는 V1 스타일은 사용하지 않는다.

---
---

## 5. 상태와 인터랙션

| Status | Visual | Behavior |
| --- | --- | --- |
| `Default` | 빈 원/사각형, 얇은 outline | 미선택 상태. 사용자가 탭/클릭하면 `Enabled`로 전환. |
| `Enabled` | Primary fill + 흰색 체크 | 선택된 상태. 탭/클릭하면 `Default`로 전환. |
| `Disabled` | 반투명 fill + 흐린 outline | 선택 불가 상태. 포인터 및 키보드 이벤트 차단. |

Mode 동작:

| Mode | 동작 |
| --- | --- |
| `Default` | OS 테마에 따라 `system/color/*` 토큰 적용 |
| `Fixed` | 항상 다크 테마. `system/fixed_color/*` 토큰 적용 |

CheckBox 자체는 선택 상태를 소유하지 않는다. 선택 상태는 부모 컴포넌트나 폼 상태 관리에서 제어하며, `Status` prop으로 주입한다.

---
---

## 6. 레이아웃과 반응형 규칙

CheckBox는 크기가 24×24px로 고정된다. 크기를 임의로 변경하지 않는다.

레이블 텍스트와의 간격은 6px. CheckBox와 레이블을 수평으로 배치하고, 터치 및 클릭 영역은 두 요소를 모두 포함하는 넓은 영역으로 설정한다. 좁은 터치 영역(체크박스만)은 사용자 불편을 유발한다.

복수 항목 목록에서는 각 항목을 동일한 수직 간격으로 배치한다. 상위-하위 계층 구조가 있을 경우 하위 항목은 들여쓰기로 구분하고 `ic_check_xsmall` 아이콘을 사용한다.

---
---

## 7. 권장/금지

DO:

- 복수 선택이 필요한 목록에는 CheckBox를 사용한다.
- 단일 항목이더라도 동의/승인이 필요하면 CheckBox를 사용한다.
- `Circle` 타입을 기본으로 사용한다. `Square`는 List Item 내부에서만 사용한다.
- 터치/클릭 영역을 체크박스 + 텍스트 전체로 설정한다.
- 상위 체크박스 상태 변경 시 모든 하위 항목에 즉시 반영한다.
- `Default` 상태는 빈 원/사각형 outline으로 표현한다.

DON'T:

- 복수 선택이 가능한 상황에서 Radio Button을 사용하지 않는다.
- 단일 선택만 가능한 상황에서 CheckBox를 사용하지 않는다.
- `Default` 상태에 회색 체크 아이콘을 넣지 않는다 (V1 스타일 사용 금지).
- 신규 화면에서 `Square` 타입을 사용하지 않는다 (추후 삭제 예정).
- 체크박스 크기를 24px 외 임의 값으로 조정하지 않는다.
- 터치 영역을 체크박스 단독(24×24px)으로 제한하지 않는다.

---
---

## 8. 에이전트 프롬프트 가이드

사용자가 목록에서 0개 이상 항목을 선택해야 하거나, 단일 명시적 동의/승인이 필요할 때 `CheckBox`를 사용한다.

신규 화면에서는 항상 `Type=Circle`을 사용한다. `Type=Square`는 기존 List Item 맥락 전용이며 deprecated 상태다.

touch/click target은 항상 checkbox와 label text를 모두 포함하도록 설정한다. interaction을 24×24px checkbox 단독으로 제한하지 않는다.

`CheckBox` 목록을 만들 때는 각 항목을 row로 배치하고 checkbox는 왼쪽, label text는 오른쪽에 둔다. 둘 사이 gap은 6px로 유지하고 row 간 vertical spacing을 일관되게 둔다.

`Default`(unchecked) 상태 안에 gray check icon을 넣지 않는다. 빈 outlined circle/square만 사용한다.

parent CheckBox가 child item을 제어할 때는 상태 변경이 모든 child에 즉시 전파되도록 한다.

---
