---
component:
  name: "Chips"
  description: "Chips는 두 가지 역할로 사용한다. **Filter** 역할은 콘텐츠 목록을 카테고리별로 좁히는 필터 선택에 쓰인다. **Tabs** 역할은 클릭 시 즉각적으로 하단 페이지를 전환하는 탭 컨트롤이다."
  status: "stable"
  version: "1.0"
source:
  figma_file: "Chord Design System"
  file_key: ""
  component_set:
    name: "Chips"
    node_id: "59869:78921"
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
  "Size":
    type: "\"Small\" \\"
    default: "\"Medium\""
    description: "\"Medium\""
    required: false
  "Type":
    type: "\"Text\" \\"
    default: "\"Icon\" \\"
    description: "\"Image (Only Medium)\""
    required: false
  "State":
    type: "\"Default\" \\"
    default: "\"Filled_Selected\" \\"
    description: "\"Filled_Disabled\" \\"
    required: false
  "Radius":
    type: "\"ON\" \\"
    default: "\"OFF\""
    description: "\"OFF\""
    required: false
  "Marquee":
    type: "boolean"
    default: "false"
    description: "텍스트 수평 마키 스크롤. 아티스트명 전용"
    required: false
  "Badge":
    type: "boolean"
    default: "false"
    description: "우상단 점 배지 표시"
    required: false
  "Badge_Number":
    type: "boolean"
    default: "false"
    description: "우상단 숫자 배지 표시"
    required: false
variants:
  axes:
    "Mode":
      - "Default"
      - "Fixed"
    "Size":
      - "Small"
      - "Medium"
    "Type":
      - "Text"
      - "Icon"
      - "Image (Only Medium)"
    "State":
      - "Default"
      - "Filled_Disabled"
      - "Filled_Selected"
      - "Outlined_Disabled"
      - "Outlined_Selected"
    "Radius":
      - "OFF"
      - "ON"
  component_props:
    "Marquee":
      type: "boolean"
      default: "False"
    "Badge":
      type: "boolean"
      default: "False"
    "Badge_Number":
      type: "boolean"
      default: "False"
  count:
    figma_console: 100
    figma_rest: 100
  constraints:
    - summary: |
        Figma component set의 axis `59869:78921` (`[V2] Chips`):
        
        | Axis | 값 |
        | --- | --- |
        | `Mode` | `Default`, `Fixed` |
        | `Size` | `Small`, `Medium` |
        | `Type` | `Text`, `Icon`, `Image (Only Medium)` |
        | `State` | `Default`, `Filled_Selected`, `Filled_Disabled`, `Outlined_Selected`, `Outlined_Disabled` |
        | `Radius` | `ON`, `OFF` |
        
        Variant 개수:
        
        | 출처 | 개수 |
        | --- | ---: |
        | Figma REST | 100 |
        | figma-console/analyze | 100 |
        
        메모:
        
        - `Type=Image (Only Medium)`는 `Size=Medium`에만 존재. `Small`에서 Image 타입 없음.
        - `State=Filled_*`는 배경 채움 방식, `State=Outlined_*`는 아웃라인 강조 방식.
        - 같은 칩 그룹에서 두 가지 선택 스타일을 혼용하지 않는다.
        
        ---
states:
  _summary: |
    | State | 배경 | 텍스트 | 아웃라인 |
    | --- | --- | --- | --- |
    | `Default` | — | `system/color/text/default` | `system/color/button/outlined_gray` |
    | `Filled_Selected` | `system/color/surface/default-reverse` | `system/color/text/default-reverse` | — |
    | `Filled_Disabled` | `system/color/button/disabled` | `system/color/text/200a` | — |
    | `Outlined_Selected` | — | `system/color/text/primary` | `system/color/button/default` |
    | `Outlined_Disabled` | — | `system/color/text/200a` | `system/color/button/disabled` |
    
    Fixed mode는 동일 구조로 `system/fixed_color/*` 토큰을 사용한다.
    
    ---
tokens:
  token_1:
    default: "system/color/button/outlined_gray"
    fixed: ""
    fallback: ""
  token_2:
    default: "system/color/button/default"
    fixed: ""
    fallback: ""
  token_3:
    default: "system/color/button/disabled"
    fixed: ""
    fallback: ""
  token_4:
    default: "system/color/surface/default-reverse"
    fixed: ""
    fallback: ""
  token_5:
    default: "system/color/text/default"
    fixed: ""
    fallback: ""
  token_6:
    default: "system/color/text/default-reverse"
    fixed: ""
    fallback: ""
  token_7:
    default: "system/color/text/primary"
    fixed: ""
    fallback: ""
  token_8:
    default: "system/color/text/200a"
    fixed: ""
    fallback: ""
  token_9:
    default: "system/fixed_color/button/outlined_gray"
    fixed: ""
    fallback: ""
  token_10:
    default: "system/fixed_color/button/default"
    fixed: ""
    fallback: ""
  token_11:
    default: "system/fixed_color/button/disabled"
    fixed: ""
    fallback: ""
  token_12:
    default: "system/fixed_color/surface/default-reverse"
    fixed: ""
    fallback: ""
  token_13:
    default: "system/fixed_color/text/default"
    fixed: ""
    fallback: ""
  token_14:
    default: "system/fixed_color/text/default-reverse"
    fixed: ""
    fallback: ""
  token_15:
    default: "system/fixed_color/text/primary"
    fixed: ""
    fallback: ""
  token_16:
    default: "system/fixed_color/text/200a"
    fixed: ""
    fallback: ""
layout:
  sizes:
    - name: "Small"
      image: "32px"
      touch: "32px"
    - name: "Medium"
      image: "36px"
      touch: "36px"
  spacing:
    - summary: |
        | Size | Height | Touch target | Padding H | Gap (icon+text) | Border-radius (OFF) | Border-radius (ON) |
        | --- | --- | --- | --- | --- | --- | --- |
        | Small | 32px | 32px | 12px (`system/size/padding/box/150`) | 4px | 8px | 100px |
        | Medium | 36px | 36px | 12px (`system/size/padding/box/150`) | 4px | 8px | 100px |
        
        `Type=Image` 패딩: 6px (`system/size/padding/box/75`) — 이미지 좌측 공간 확보.
        
        최대 너비: 190px. 초과 시 텍스트 "…" 처리.
        
        ---
  radius:
    - role: "shape"
      token: ""
  responsive_rules:
    - summary: |
        `Small`(32px)은 Text·Icon 타입에 사용한다. `Medium`(36px)은 Image 타입이 포함될 경우에만 사용한다. 같은 Chip 그룹 내에서 두 사이즈를 혼용하지 않는다. 텍스트나 아이콘만 사용할 때 Medium 사이즈를 임의로 사용할 수 없다.
        
        Chip 너비는 내용에 따라 유동적(hug-content)이나 최대 190px을 초과하지 않는다. 너비 초과 시 텍스트를 "…"으로 잘라낸다.
        
        Option Chips가 화면 너비를 초과할 경우 줄바꿈으로 처리한다. 좌우 스크롤을 사용하지 않는다. Filter Chip이 1개뿐일 경우 노출하지 않는다.
        
        `Type=Image`는 `Medium` 전용이다. `Small` 그룹에 이미지 타입을 혼입하지 않는다.
        
        ---
accessibility:
  summary: |
    - **Role**: `option` 또는 `tab` (Filter/Tabs 맥락에 따라), 부모 `listbox` 또는 `tablist` 필요
    - **Label**: `aria-label` 또는 레이블 텍스트를 포함한 컨텐츠로 의미 전달
    - **Keyboard**: `Space` 또는 `Enter`로 선택/해제. Tab으로 그룹 포커스 이동. 그룹 내 이동은 `←` / `→`.
    - **Disabled**: `aria-disabled="true"`. 포인터 및 키보드 이벤트 차단.
    - **Selected**: `aria-selected="true"` (option) 또는 `aria-selected="true"` (tab) — 상태 반영 필수.
    - **Contrast**: WCAG AA (4.5:1) 이상 유지
    
    ---
rules:
  do:
    - "Text·Icon 타입은 `Small` 사이즈만 사용한다."
    - "Image 타입이 포함될 경우에만 `Medium` 사이즈를 사용한다."
    - "같은 Chip 그룹 내에서 선택 스타일(Filled vs Outlined)을 통일한다."
    - "텍스트가 190px을 넘으면 \"…\"으로 잘라낸다."
    - "`Marquee=true`는 아티스트 이름 등 법적 전문 표시가 필요한 경우에만 사용한다."
    - "`Type=Image`는 `Medium`에서만 사용하고, Avatar 속성 없이 이미지로만 사용한다."
    - "아티스트명 영역은 Text Type을 `Artist(Circular)`로 설정한다."
    - "Option Chips가 화면을 초과할 경우 줄바꿈으로 처리한다."
    - "Option Chips가 1개만 노출되더라도 선택/적용 상태를 사용자가 인지할 수 있도록 노출한다."
  dont:
    - "Text·Icon 타입에 `Medium` 사이즈를 사용하지 않는다."
    - "같은 Chip 그룹 안에서 `Small`과 `Medium`을 혼용하지 않는다."
    - "`Type=Image`를 `Small` 사이즈에 사용하지 않는다."
    - "같은 그룹에서 Filled 선택과 Outlined 선택을 혼용하지 않는다."
    - "배지(`Badge`, `Badge_Number`)를 동시에 두 개 이상 활성화하지 않는다."
    - "일반 텍스트 레이블에 `Marquee=true`를 임의로 사용하지 않는다."
    - "190px 초과 텍스트를 줄바꿈으로 처리하지 않는다 — 반드시 \"…\" 처리한다."
    - "아티스트명 영역에 Text Type을 `Default`로 설정하지 않는다."
    - "Option Chips 초과 시 좌우 스크롤을 사용하지 않는다."
    - "Filter Chip이 1개일 경우 노출하지 않는다."
notes:
  source_notes: |
    - **Component set node ID**: `59869:78921`
    - **Component set name**: `[V2] Chips`
    - **Figma file**: `DWEduE6GfxYMlyxKPNJ8jA` (Chord Design System)
    - `cornerRadius` 값(8px / 100px)은 Figma에서 토큰 바인딩 없이 하드코딩됨. 토큰으로 관리되지 않음.
    - `Type=Image (Only Medium)` 이름의 괄호 포함 값이 그대로 컴포넌트 이름에 포함되어 있음.
    - `system/color/roles/negative` 토큰은 아이콘 내부 guide 레이어에만 사용되며 실제 색상 역할이 아님.
  source_gaps: []
  deprecated: []
---

# Chips
---

> Chips는 두 가지 역할로 사용한다. **Filter** 역할은 콘텐츠 목록을 카테고리별로 좁히는 필터 선택에 쓰인다. **Tabs** 역할은 클릭 시 즉각적으로 하단 페이지를 전환하는 탭 컨트롤이다.
---

## 1. 역할과 사용

Chips는 두 가지 역할로 사용한다. **Filter** 역할은 콘텐츠 목록을 카테고리별로 좁히는 필터 선택에 쓰인다. **Tabs** 역할은 클릭 시 즉각적으로 하단 페이지를 전환하는 탭 컨트롤이다.

`Text`·`Icon` 타입은 `Small`(32px)만 사용한다. `Image` 타입이 포함될 경우에만 `Medium`(36px)을 사용한다. 텍스트나 아이콘만 사용할 경우 `Medium`을 임의로 사용할 수 없다. 같은 그룹 안에서 두 사이즈를 혼용하지 않는다.

`Type=Image`는 `Medium`에서만 사용 가능하다. `Small` 사이즈에는 이미지 타입이 존재하지 않는다. 이미지는 Avatar 속성 없이 이미지로만 사용하며, 아티스트 프로필 등 컨텍스트가 있는 경우에 한정한다.

아티스트명이 들어가는 칩은 Text Type을 `Artist(Circular)`로 변경하여 사용한다. 아티스트명 영역에 `Default` 텍스트 타입을 사용하면 안 된다.

텍스트가 길어 잘릴 경우 말줄임("…") 처리로 표시하고, 최대 너비는 190px이다. 아티스트 이름처럼 법적 문제가 있는 경우에만 `Marquee=true`로 스크롤 처리한다.

Filter Chip이 1개일 경우 노출하지 않는다. 커뮤니티 영역에서는 커뮤니티 컬러가 적용되며, 칩 내 텍스트·아이콘 색상은 `fixed_color`를 사용하여 다크모드에서 반전되지 않는다.

---
---

## 2. 시각적 성격

Chips는 콤팩트하고 수평 배치 중심이다. 높이 고정, 내부 텍스트 중심 정렬로 레이아웃 밀도를 유지한다.

`Default` 상태는 얇은 아웃라인만 표시되어 배경에 조용히 존재한다. `Filled_Selected` 상태에서는 대비가 높은 채움 배경이 적용되어 선택 상태를 시각적으로 강하게 표시한다. `Outlined_Selected`는 아웃라인 강조로 보다 가벼운 선택 표현이 필요할 때 사용한다.

`Radius=ON`(100px)은 완전한 필 모양으로 부드럽고 둥근 인상을 주고, `Radius=OFF`(8px)는 직사각형에 가까운 인상으로 더 격식있는 맥락에 쓰인다.

---
---

## 3. 구조

핵심 파트:

- `root`: 전체 Chip의 너비·높이·터치 영역을 소유하는 래퍼. 높이 고정(Small=32px, Medium=36px), 수평 패딩 12px.
- `label`: 칩 내부 텍스트. `_atoms/text` 인스턴스로 구성. `system/color/text/default` 토큰 적용.
- `icon` *(optional)*: `Type=Icon`일 때 좌측에 표시되는 아이콘 슬롯. label과 4px gap으로 연결.
- `image` *(optional)*: `Type=Image (Only Medium)`일 때 좌측에 표시되는 원형 이미지. Medium 전용, 패딩 6px.
- `Badge_Dot` *(optional)*: `Badge=true`일 때 칩 우상단에 나타나는 점 배지.
- `Badge_Number` *(optional)*: `Badge_Number=true`일 때 칩 우상단에 나타나는 숫자 배지.

---
---

## 4. 컴포넌트 스타일링

**Outlined / Default (기본 상태)**

배경 없음, 1px 아웃라인 `system/color/button/outlined_gray`. 텍스트 `system/color/text/default`. 미선택 상태에서 그룹 내 전체 옵션을 조용하게 표시한다.

**Filled_Selected (선택됨 — 채움)**

`system/color/surface/default-reverse` 배경으로 강한 대비를 형성한다. 텍스트는 `system/color/text/default-reverse`로 반전 적용. 아웃라인 없음.

**Outlined_Selected (선택됨 — 아웃라인)**

배경 없음, 아웃라인 `system/color/button/default`로 굵은 테두리 강조. 텍스트 `system/color/text/primary`. 아웃라인 선택 강조가 필요한 Tabs 맥락 등에서 사용.

**Filled_Disabled / Outlined_Disabled (비활성)**

Filled 비활성: `system/color/button/disabled` 배경, 텍스트 `system/color/text/200a`.
Outlined 비활성: `system/color/button/disabled` 아웃라인, 텍스트 `system/color/text/200a`.

`Fixed` Mode에서는 동일한 구조로 `system/fixed_color/*` 토큰 세트를 사용한다.

---
---

## 5. 상태와 인터랙션

| State | 시각 | 동작 |
| --- | --- | --- |
| `Default` | 아웃라인 gray, 텍스트 default | 미선택. 탭하면 선택 상태로 전환. |
| `Filled_Selected` | 채움 배경(dark reverse), 반전 텍스트 | 선택됨 (채움 스타일). 탭하면 `Default`로 전환. |
| `Outlined_Selected` | 강조 아웃라인, Primary 텍스트 | 선택됨 (아웃라인 스타일). 탭하면 `Default`로 전환. |
| `Filled_Disabled` | 채움 비활성 배경, 흐린 텍스트 | 선택 불가. 이벤트 차단. |
| `Outlined_Disabled` | 비활성 아웃라인, 흐린 텍스트 | 선택 불가. 이벤트 차단. |

Mode 동작:

| Mode | 동작 |
| --- | --- |
| `Default` | OS 테마에 따라 `system/color/*` 토큰 적용 |
| `Fixed` | 항상 다크 테마. `system/fixed_color/*` 토큰 적용 |

Radius 동작:

| Radius | 값 | 용도 |
| --- | --- | --- |
| `ON` | 100px (pill) | 부드럽고 둥근 칩 표현 |
| `OFF` | 8px | 더 격식 있는 직사각형 표현 |

Boolean props: `Marquee`, `Badge`, `Badge_Number` — 기본값 모두 `false`. 동시에 두 개 이상 배지를 활성화하지 않는다.

---
---

## 6. 레이아웃과 반응형 규칙

`Small`(32px)은 Text·Icon 타입에 사용한다. `Medium`(36px)은 Image 타입이 포함될 경우에만 사용한다. 같은 Chip 그룹 내에서 두 사이즈를 혼용하지 않는다. 텍스트나 아이콘만 사용할 때 Medium 사이즈를 임의로 사용할 수 없다.

Chip 너비는 내용에 따라 유동적(hug-content)이나 최대 190px을 초과하지 않는다. 너비 초과 시 텍스트를 "…"으로 잘라낸다.

Option Chips가 화면 너비를 초과할 경우 줄바꿈으로 처리한다. 좌우 스크롤을 사용하지 않는다. Filter Chip이 1개뿐일 경우 노출하지 않는다.

`Type=Image`는 `Medium` 전용이다. `Small` 그룹에 이미지 타입을 혼입하지 않는다.

---
---

## 7. 권장/금지

DO:

- Text·Icon 타입은 `Small` 사이즈만 사용한다.
- Image 타입이 포함될 경우에만 `Medium` 사이즈를 사용한다.
- 같은 Chip 그룹 내에서 선택 스타일(Filled vs Outlined)을 통일한다.
- 텍스트가 190px을 넘으면 "…"으로 잘라낸다.
- `Marquee=true`는 아티스트 이름 등 법적 전문 표시가 필요한 경우에만 사용한다.
- `Type=Image`는 `Medium`에서만 사용하고, Avatar 속성 없이 이미지로만 사용한다.
- 아티스트명 영역은 Text Type을 `Artist(Circular)`로 설정한다.
- Option Chips가 화면을 초과할 경우 줄바꿈으로 처리한다.
- Option Chips가 1개만 노출되더라도 선택/적용 상태를 사용자가 인지할 수 있도록 노출한다.

DON'T:

- Text·Icon 타입에 `Medium` 사이즈를 사용하지 않는다.
- 같은 Chip 그룹 안에서 `Small`과 `Medium`을 혼용하지 않는다.
- `Type=Image`를 `Small` 사이즈에 사용하지 않는다.
- 같은 그룹에서 Filled 선택과 Outlined 선택을 혼용하지 않는다.
- 배지(`Badge`, `Badge_Number`)를 동시에 두 개 이상 활성화하지 않는다.
- 일반 텍스트 레이블에 `Marquee=true`를 임의로 사용하지 않는다.
- 190px 초과 텍스트를 줄바꿈으로 처리하지 않는다 — 반드시 "…" 처리한다.
- 아티스트명 영역에 Text Type을 `Default`로 설정하지 않는다.
- Option Chips 초과 시 좌우 스크롤을 사용하지 않는다.
- Filter Chip이 1개일 경우 노출하지 않는다.

---
---

## 8. 에이전트 프롬프트 가이드

사용자가 카테고리별로 콘텐츠를 필터링하거나 tab-like view를 전환해야 할 때 `Chips`를 사용한다.

Text 또는 Icon type chip에는 항상 `Small`을 사용한다. chip에 image가 포함될 때만 `Medium`을 사용한다. 같은 group 안에서 size를 섞지 않는다.

하나의 Chip group 안에서는 selection style(Filled vs Outlined)을 항상 통일한다. 같은 group에서 `Filled_Selected`와 `Outlined_Selected`를 섞지 않는다.

`Type=Image`는 `Medium` size에서만 사용한다. image에는 Avatar 속성을 적용하지 않고 image로만 사용한다.

chip에 artist name이 포함되면 Text Type을 `Artist(Circular)`로 설정한다. artist name chip에는 Default text type을 사용하지 않는다.

chip width는 190px을 초과하지 않는다. 초과 시 "…"으로 truncate한다. artist name 또는 법적 scroll이 명시적으로 필요하지 않으면 `Marquee`를 활성화하지 않는다.

Option Chips가 화면 너비를 초과하면 line wrapping을 사용한다. horizontal scroll을 사용하지 않는다. option이 하나뿐이면 Filter Chips를 노출하지 않는다.

community context에서는 dark mode에서 chip color가 반전되지 않도록 `Fixed` mode를 사용한다.

---
