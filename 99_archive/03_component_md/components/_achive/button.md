---
component:
  name: "Button"
  description: "Button은 사용자의 행동을 실행하는 컴포넌트다. 명확한 affordance와 상태 피드백이 필요한 primary, secondary, destructive, confirmation, navigation-like, icon-only 액션에 사용한다."
  status: "stable"
  version: "1.0"
source:
  figma_file: "Chord Design System"
  file_key: ""
  component_set:
    name: "Button"
    node_id: "52753:39618"
    key: ""
  usage_source:
    file_key: ""
    node_id: ""
props:
  "children":
    type: "ReactNode"
    default: "icon-only가 아니면 필수"
    description: "버튼 레이블/콘텐츠."
    required: false
  "Mode":
    type: "\"Default\""
    default: "\"Fixed\""
    description: "\"Default\""
    required: false
  "Type":
    type: "\"Filled\""
    default: "\"Outlined\""
    description: "\"Outlined_color\""
    required: false
  "Size":
    type: "\"XXSmall(24)\""
    default: "\"XSmall(32)\""
    description: "\"Small(36)\""
    required: false
  "Button Color":
    type: "\"Default\""
    default: "\"Black\""
    description: "\"Default\""
    required: false
  "Status":
    type: "\"Default\""
    default: "\"Hover\""
    description: "\"Disabled\""
    required: false
  "Radius":
    type: "\"on\""
    default: "\"off\""
    description: "boolean"
    required: false
  "leadingIcon":
    type: "ReactNode"
    default: "optional"
    description: "레이블 앞 아이콘."
    required: false
  "trailingIcon":
    type: "ReactNode"
    default: "optional"
    description: "레이블 뒤 아이콘."
    required: false
  "fullWidth":
    type: "boolean"
    default: "false"
    description: "고정 높이를 유지하면서 root가 부모 너비를 채우게 한다."
    required: false
  "onClick":
    type: "function"
    default: "optional"
    description: "Disabled` 또는 `Loading`일 때는 무시한다."
    required: false
variants:
  axes:
    "Mode":
      - "Default"
      - "Fixed"
    "Type":
      - "Filled"
      - "Outlined"
      - "Outlined_color"
      - "Outlined_gray"
      - "Ghost"
    "Size":
      - "XXSmall(24)"
      - "XSmall(32)"
      - "Small(36)"
      - "Medium(40)"
      - "Large(44)"
      - "XLarge(52)"
    "Button Color":
      - "Default"
      - "Black"
    "Status":
      - "Default"
      - "Hover"
      - "Disabled"
      - "Loading"
    "Radius":
      - "on"
      - "off"
  component_props:
    "leadingIcon":
      type: "slot"
      default: ""
    "trailingIcon":
      type: "slot"
      default: ""
  count:
    figma_console: 768
    figma_rest: 768
  constraints:
    - summary: |
        Figma component set의 axis `Button_Type`:
        
        | Axis | 값 |
        | --- | --- |
        | `Mode` | `Default`, `Fixed` |
        | `Type` | `Filled`, `Outlined`, `Outlined_color`, `Outlined_gray`, `Ghost` |
        | `Size` | `XXSmall(24)`, `XSmall(32)`, `Small(36)`, `Medium(40)`, `Large(44)`, `XLarge(52)` |
        | `Button Color` | `Default`, `Black` |
        | `Status` | `Default`, `Hover`, `Disabled`, `Loading` |
        | `Radius` | `on`, `off` |
        
        Variant 개수:
        
        | 출처 | 개수 |
        | --- | ---: |
        | Figma REST component set `Button_Type` | 768 |
        | Framelink metadata for `Button_Type` | 768 |
        
        메모:
        
        - Figma 이름에는 일부 `Button Color` 값에 설명용 한국어 괄호가 포함되어 있다. 코드에서는 `Default`, `Black`으로 정규화한다.
        - Figma source note에서 `Button Color=Black`은 Gray Ghost에 적용하지 않는 것으로 표시되어 있다.
states:
  _summary: |
    | Status | 동작 |
    | --- | --- |
    | `Default` | 활성 상태이며 클릭 가능. |
    | `Hover` | 포인터 hover 시각 상태. 코드에서는 보통 public runtime prop이 아니라 CSS hover 스타일로 표현한다. 단, 시각 테스트용 prop은 예외다. |
    | `Disabled` | native `disabled`를 설정하고 포인터/키보드 활성화를 차단하며 disabled semantics를 노출한다. |
    | `Loading` | 중복 실행을 차단하고 spinner/loading affordance를 표시하며 `aria-busy=true`를 설정한다. |
    
    Mode 동작:
    
    | Mode | 동작 |
    | --- | --- |
    | `Default` | `system/color/*` 토큰을 사용하고 활성 테마를 따른다. |
    | `Fixed` | 안정적인 fixed-theme 렌더링을 위해 `system/fixed_color/*` 토큰을 사용한다. |
tokens:
  token_1:
    default: "system/color/surface/default"
    fixed: ""
    fallback: ""
  token_2:
    default: "system/color/surface/default-reverse"
    fixed: ""
    fallback: ""
  token_3:
    default: "system/color/roles/primary"
    fixed: ""
    fallback: ""
  token_4:
    default: "system/color/roles/negative"
    fixed: ""
    fallback: ""
  token_5:
    default: "system/color/text/default"
    fixed: ""
    fallback: ""
  token_6:
    default: "system/color/text/white-same"
    fixed: ""
    fallback: ""
  token_7:
    default: "system/color/icon/default"
    fixed: ""
    fallback: ""
  token_8:
    default: "system/color/outline/default"
    fixed: ""
    fallback: ""
  token_9:
    default: "system/color/outline/primary"
    fixed: ""
    fallback: ""
  token_10:
    default: "system/fixed_color/roles/primary"
    fixed: ""
    fallback: ""
  token_11:
    default: "system/fixed_color/text/white-same"
    fixed: ""
    fallback: ""
  token_12:
    default: "system/size/padding/box/200"
    fixed: ""
    fallback: ""
  token_13:
    default: "system/size/radius/box/250"
    fixed: ""
    fallback: ""
layout:
  sizes:
    - name: "XLarge(52)"
      image: "52px"
      touch: "52px"
    - name: "Large(44)"
      image: "44px"
      touch: "44px"
    - name: "Medium(40)"
      image: "40px"
      touch: "40px"
    - name: "Small(36)"
      image: "36px"
      touch: "36px"
    - name: "XSmall(32)"
      image: "32px"
      touch: "32px"
    - name: "XXSmall(24)"
      image: "24px"
      touch: "24px"
  spacing:
    - summary: |
        | Size | 이미지 | 터치 영역 |
        | --- | ---: | ---: |
        | XLarge(52) | 52px | 52px |
        | Large(44) | 44px | 44px |
        | Medium(40) | 40px | 40px |
        | Small(36) | 36px | 36px |
        | XSmall(32) | 32px | 32px |
        | XXSmall(24) | 24px | 24px |
        
        Root 레이아웃:
        
        - 높이는 `Size`에 의해 고정된다.
        - 너비는 콘텐츠에 맞게 hug 하거나 `fullWidth`를 통해 부모를 채울 수 있다.
        - 콘텐츠는 row 안에서 중앙 정렬한다.
        - 사이즈별 토큰화된 가로 padding을 사용한다.
        - `Radius=on`은 pill/rounded 처리, `Radius=off`는 square/low-radius 처리를 사용한다.
        
        사용 레이아웃:
        
        - 단일 하단 CTA: 해당 액션이 화면에서 가장 중요한 CTA이면 `XLarge(52)`와 16px 화면 좌우 margin을 사용한다.
        - 두 버튼 horizontal group: primary/default 액션은 오른쪽에 둔다.
        - 세 액션 group: vertical stacking을 사용한다.
        - 긴 레이블 또는 로컬라이즈 영향이 큰 레이블: 잘림과 좁은 horizontal spacing을 피하기 위해 vertical layout을 우선한다.
  radius:
    - role: "shape"
      token: ""
  responsive_rules:
    - summary: |
        Button 높이는 `Size`로 고정된다. Horizontal padding과 icon gap은 size token에서 가져와야 한다. 높이를 임의로 늘리지 않는다.
        
        반응형 layout에서는 scale 조정보다 의도적으로 size를 전환한다. Full-width 버튼은 동일한 내부 높이와 padding을 유지하면서 부모 또는 `block` prop에서 너비를 설정한다.
        
        단일 하단 CTA가 화면에서 가장 중요한 액션이라면 가장 큰 액션 처리를 사용한다. usage frame은 16px 좌우 safe margin과 `XLarge(52)` 높이를 가진 full-width 하단 button을 보여준다.
        
        두 버튼 group에서는 primary action을 오른쪽에 둔다. 세 개 이상의 액션은 horizontal group에 억지로 추가하지 말고 vertical stack을 우선한다. 레이블이 길거나 localization으로 텍스트가 늘어날 가능성이 있으면 vertical layout으로 전환한다.
accessibility:
  summary: |
    액션에는 native `button`으로 렌더링한다. 기본값은 `type="button"`을 사용한다. `Status=Disabled`이면 `disabled`를 설정하고, `Status=Loading`이면 활성화를 차단하며 `aria-busy=true`를 설정한다.
    
    Icon-only 버튼에는 accessible label이 필요하다. Loading 버튼은 screen reader가 어떤 액션이 진행 중인지 알 수 있도록 안정적인 accessible name을 유지해야 한다.
rules:
  do:
    - "액션에는 native `button` semantics를 사용한다."
    - "`Loading`에는 `aria-busy` 또는 disabled behavior를 사용한다."
    - "레이블은 간결하고 액션 중심으로 작성한다."
    - "`Radius`를 명시적으로 사용한다."
    - "size별 정확한 높이를 보존한다."
    - "두 버튼 horizontal group에서는 primary action을 오른쪽에 배치한다."
    - "세 액션, 긴 레이블, 로컬라이즈 영향이 큰 레이블에는 세로 button group을 사용한다."
    - "필수 정보가 완료될 때까지 버튼을 disabled 상태로 유지한다. disabled 버튼은 click/tap에 반응하지 않아야 한다."
  dont:
    - "Button을 정적 tag나 badge로 사용하지 않는다."
    - "`Disabled` 또는 `Loading` 상태에서 click handler가 실행되지 않게 한다."
    - "계약 밖의 size를 만들지 않는다."
    - "variant가 명시하지 않는 한 `Ghost` 스타일과 채워진 배경 토큰을 섞지 않는다."
    - "두 버튼 group에서 primary action 위치를 바꾸지 않는다."
    - "horizontal two-button pattern에 세 번째 text button을 추가하지 않는다."
    - "필수 form 또는 screen 정보가 완료되지 않았을 때 버튼을 활성화하지 않는다."
notes:
  source_notes: |
    | 출처 | 값 |
    | --- | --- |
    | 파일 | `Chord Design System` |
    | File key | `DWEduE6GfxYMlyxKPNJ8jA` |
    | 문서 프레임 | `52753:23657` / `Button_Type` |
    | Component set | `52753:39618` / `Text Button` |
    | REST set | `Button_Type` |
    | Types 섹션 | `Filled`, `Outlined_color`, `Outlined_gray`, `Ghost` |
    | Usage file | `Chord_Usage` / `6pHGdaJh3L8Z1Ew8AxIV85` |
    | Usage frame | `428:4854` / `Button` |
    | 사용 규칙 | Button은 화면 하단 근처 또는 콘텐츠 위에 나타나며, 찾기 쉽고 터치하기 쉬워야 한다. |
    | 사용 규칙 | usage 예시의 단일 하단 CTA는 16px horizontal margin과 `XLarge(52)` 높이를 사용한다. |
    | 사용 규칙 | 두 버튼 group에서는 primary action을 오른쪽에 두고, 세 액션 또는 긴/로컬라이즈된 레이블에는 vertical layout을 사용한다. |
  source_gaps: []
  deprecated: []
---

# Button
---

> Button은 사용자의 행동을 실행하는 컴포넌트다. 명확한 affordance와 상태 피드백이 필요한 primary, secondary, destructive, confirmation, navigation-like, icon-only 액션에 사용한다.
---

## 1. 역할과 사용

Button은 사용자의 행동을 실행하는 컴포넌트다. 명확한 affordance와 상태 피드백이 필요한 primary, secondary, destructive, confirmation, navigation-like, icon-only 액션에 사용한다.

강조도가 높은 액션에는 `Filled`, 중간 강조 액션에는 `Outlined` 또는 `Outlined_color`, 중립적인 보조 액션에는 `Outlined_gray`, 낮은 강조도의 맥락 액션에는 `Ghost`를 사용한다. 시스템 컬러 버튼은 `Button Color=Default`, 블랙 처리가 필요한 디자인은 `Button Color=Black`을 선택한다.

사용 용도는 사용자가 선택, 제출, 확인, 이동 같은 명확한 행동을 실행하게 하는 것이다.

Usage 가이드는 Button을 화면 하단 또는 콘텐츠 위에 배치되는 액션 컨트롤로 정의한다. 버튼은 찾기 쉬워야 하고 화면 안에서 시각적으로 균형이 맞아야 하며, 액션 중요도에 맞는 크기와 안정적인 터치 영역을 가져야 한다.

Button을 정적 레이블, 배지, 칩, 비액션 컨테이너로 사용하지 않는다.
---

## 2. 시각적 성격

Button은 직접적이고 compact하다. fill, outline, text contrast, state를 통해 액션 우선순위를 명확히 전달해야 한다. rounded 동작은 제품 맥락에서 추론하지 않고 `Radius=on/off`로 명시한다.

컴포넌트는 `Size`별 정확한 높이를 보존하고, 콘텐츠 중앙 정렬을 유지하며, disabled/loading 동작을 결정적으로 보여야 한다.
---

## 3. 구조

핵심 파트:

- `root`: 고정 높이와 radius를 가진 상호작용 가능한 button element.
- `content`: 텍스트와 선택 아이콘을 포함하는 중앙 정렬 row.
- `label`: 액션 텍스트.
- `leadingIcon`: 레이블 앞 선택 아이콘.
- `trailingIcon`: 레이블 뒤 선택 아이콘.
- `spinner`: 구현 정책에 따라 콘텐츠를 대체하거나 함께 표시되는 loading indicator.
---

## 4. 컴포넌트 스타일링

Button variant는 `Mode`, `Type`, `Size`, `Button Color`, `Status`, `Radius`로 정의된다. 높이는 `Size`에 의해 고정되고, 너비는 consumer layout에 따라 콘텐츠에 맞게 hug 하거나 container를 채울 수 있다.

`Radius=on`은 높이에 맞는 pill-style rounding을 사용한다. `Radius=off`는 Figma 컴포넌트의 square/low-radius 처리를 사용한다. `Status=Loading`은 반복 액션을 비활성화하고 loading affordance를 표시한다.
---

## 5. 상태와 인터랙션

지원 Status:

- `Default`: 일반 활성 버튼.
- `Hover`: pointer hover 또는 pressed-preview 시각 상태.
- `Disabled`: 상호작용할 수 없는 unavailable 상태.
- `Loading`: 액션 진행 중 상태이며 중복 실행을 방지한다.

Figma visual variant에 focus state가 열거되어 있지 않더라도 코드에서는 keyboard focus를 구현해야 한다. 프로젝트 focus-ring token 또는 accessible outline을 사용한다.
---

## 6. 레이아웃과 반응형 규칙

Button 높이는 `Size`로 고정된다. Horizontal padding과 icon gap은 size token에서 가져와야 한다. 높이를 임의로 늘리지 않는다.

반응형 layout에서는 scale 조정보다 의도적으로 size를 전환한다. Full-width 버튼은 동일한 내부 높이와 padding을 유지하면서 부모 또는 `block` prop에서 너비를 설정한다.

단일 하단 CTA가 화면에서 가장 중요한 액션이라면 가장 큰 액션 처리를 사용한다. usage frame은 16px 좌우 safe margin과 `XLarge(52)` 높이를 가진 full-width 하단 button을 보여준다.

두 버튼 group에서는 primary action을 오른쪽에 둔다. 세 개 이상의 액션은 horizontal group에 억지로 추가하지 말고 vertical stack을 우선한다. 레이블이 길거나 localization으로 텍스트가 늘어날 가능성이 있으면 vertical layout으로 전환한다.
---

## 7. 권장/금지

DO:

- 액션에는 native `button` semantics를 사용한다.
- `Loading`에는 `aria-busy` 또는 disabled behavior를 사용한다.
- 레이블은 간결하고 액션 중심으로 작성한다.
- `Radius`를 명시적으로 사용한다.
- size별 정확한 높이를 보존한다.
- 두 버튼 horizontal group에서는 primary action을 오른쪽에 배치한다.
- 세 액션, 긴 레이블, 로컬라이즈 영향이 큰 레이블에는 세로 button group을 사용한다.
- 필수 정보가 완료될 때까지 버튼을 disabled 상태로 유지한다. disabled 버튼은 click/tap에 반응하지 않아야 한다.

DON'T:

- Button을 정적 tag나 badge로 사용하지 않는다.
- `Disabled` 또는 `Loading` 상태에서 click handler가 실행되지 않게 한다.
- 계약 밖의 size를 만들지 않는다.
- variant가 명시하지 않는 한 `Ghost` 스타일과 채워진 배경 토큰을 섞지 않는다.
- 두 버튼 group에서 primary action 위치를 바꾸지 않는다.
- horizontal two-button pattern에 세 번째 text button을 추가하지 않는다.
- 필수 form 또는 screen 정보가 완료되지 않았을 때 버튼을 활성화하지 않는다.
---

## 8. 에이전트 프롬프트 가이드

구현 코드를 생성할 때 사용할 프롬프트:

```text
구현 계약을 기준으로 Chord DS Button을 만든다. Mode, Type, Size, Button Color, Status, Radius, 선택 아이콘, 로딩, 비활성, 정확한 높이 매핑, 토큰화된 색상 스타일, 키보드 포커스, native button semantics를 지원한다.
```

생성된 코드를 검토할 때 사용할 프롬프트:

```text
Button이 Type=Filled/Outlined/Outlined_color/Outlined_gray/Ghost, Size=XXSmall(24)부터 XLarge(52), Button Color=Default/Black, Status=Default/Hover/Disabled/Loading, Radius=on/off를 포함하고, Disabled 또는 Loading일 때 상호작용을 차단하는지 확인한다.
```
