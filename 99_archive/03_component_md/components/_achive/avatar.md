---
component:
  name: "Avatar"
  description: "Avatar는 사람, 아티스트, 호스트, 서비스 정체성을 이미지 중심으로 표현하는 컴포넌트다. 콘텐츠, 프로필, 댓글, 채팅, 라이브 순간이 \"누구\"에게 속하는지 빠르게 인식해야 할 때 사용한다."
  status: "stable"
  version: "1.0"
source:
  figma_file: "Chord Design System"
  file_key: "DWEduE6GfxYMlyxKPNJ8jA"
  component_set:
    name: "Avatar"
    node_id: "62973:7556"
    key: "33d955018e09fb10ab89cefc8f00f2662a2b0e39"
  usage_source:
    file_key: ""
    node_id: ""
props:
  "src":
    type: "string"
    default: "fallback이 없으면 필수"
    description: "Avatar 이미지 source."
    required: false
  "alt":
    type: "string"
    default: "\"\""
    description: "Avatar가 사람, 아티스트, 호스트, 서비스를 식별하면 필수."
    required: false
  "fallback":
    type: "string \\"
    default: "ReactNode"
    description: "선택"
    required: false
  "Mode":
    type: "\"Default\" \\"
    default: "\"Fixed\""
    description: "\"Default\""
    required: false
  "Type":
    type: "\"Circle\" \\"
    default: "\"Squircle\""
    description: "\"Circle\""
    required: false
  "Size":
    type: "\"Tiny\" \\"
    default: "\"XXXSmall\" \\"
    description: "\"XXSmall\" \\"
    required: false
  "Ring":
    type: "boolean"
    default: "true"
    description: "Circle 장식. Figma에서는 `Atoms / Avatar / Ring` 또는 `Atoms / Avatar / Moment_Ring`에 매핑된다."
    required: false
  "Birthday_Hat":
    type: "boolean"
    default: "true"
    description: "Circle 장식. top/right edge 근처에 배치된다."
    required: false
  "Emoji":
    type: "boolean"
    default: "true"
    description: "표현 맥락에 사용하는 Circle 장식."
    required: false
  "Badge_Dot":
    type: "boolean"
    default: "true"
    description: "unread/new/attention을 위한 Squircle 장식."
    required: false
  "Host":
    type: "boolean"
    default: "true"
    description: "host 또는 official presenter 상태를 위한 Squircle 장식."
    required: false
variants:
  axes:
    "Mode":
      - "Default"
      - "Fixed"
    "Type":
      - "Circle"
      - "Squircle"
    "Size":
      - "Tiny"
      - "XXXSmall"
      - "XXSmall"
      - "XSmall"
      - "Small"
      - "Medium"
      - "Large"
      - "XLarge"
      - "XXLarge"
      - "XXXLarge"
      - "XXXXLarge"
  component_props:
    "Ring":
      type: "boolean"
      default: "True"
    "Birthday_Hat":
      type: "boolean"
      default: "True"
    "Emoji":
      type: "boolean"
      default: "True"
    "Badge_Dot":
      type: "boolean"
      default: "True"
    "Host":
      type: "boolean"
      default: "True"
  count:
    figma_console: 44
    figma_rest: 44
  constraints:
    - summary: |
        Figma component set `62973:7556`의 axis:
        
        | Axis | 값 |
        | --- | --- |
        | `Mode` | `Default`, `Fixed` |
        | `Type` | `Circle`, `Squircle` |
        | `Size` | `Tiny`, `XXXSmall`, `XXSmall`, `XSmall`, `Small`, `Medium`, `Large`, `XLarge`, `XXLarge`, `XXXLarge`, `XXXXLarge` |
        
        Variant 개수:
        
        | 출처 | 개수 |
        | --- | ---: |
        | Framelink component set metadata | 44 |
        | node prefix `62973:`로 필터링한 Figma REST `/v1/files/{fileKey}/components` | 44 |
        
        전체 Cartesian 조합은 `2 Mode x 2 Type x 11 Size = 44`이다.
        
        Type별 장식 규칙:
        
        | Type | 지원 장식 |
        | --- | --- |
        | `Circle` | `Ring`, `Birthday_Hat`, `Emoji` |
        | `Squircle` | `Badge_Dot`, `Host` |
states:
  _summary: |
    | 상태 / 장식 | 적용 대상 | 동작 |
    | --- | --- | --- |
    | `Ring` | `Circle` | root square size를 바꾸지 않고 outer ring/moment layer를 추가한다. |
    | `Birthday_Hat` | `Circle` | top/right edge 근처에 hat icon을 배치한다. icon size는 `Size`에 따라 scale된다. |
    | `Emoji` | `Circle` | 지원되는 큰 size에서 lower/right edge 근처에 emoji를 배치한다. |
    | `Badge_Dot` | `Squircle` | top/right edge 근처에 red attention dot을 배치한다. |
    | `Host` | `Squircle` | lower/right edge 근처에 host indicator를 배치한다. |
    | Interactive hover/focus/pressed | Parent control | Avatar는 시각 요소로 남고, parent button/link가 focus ring과 pointer state를 소유한다. |
    | Disabled | Parent control | Avatar는 parent opacity를 상속할 수 있지만 자체 disabled variant는 정의하지 않는다. |
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
    default: "system/color/surface/red"
    fixed: ""
    fallback: ""
  token_4:
    default: "system/color/icon/default"
    fixed: ""
    fallback: ""
  token_5:
    default: "system/color/icon/default-reverse"
    fixed: ""
    fallback: ""
  token_6:
    default: "system/color/text/default"
    fixed: ""
    fallback: ""
  token_7:
    default: "system/color/text/gray-300"
    fixed: ""
    fallback: ""
  token_8:
    default: "system/fixed_color/icon/default"
    fixed: ""
    fallback: ""
  token_9:
    default: "system/fixed_color/text/gray-500"
    fixed: ""
    fallback: ""
  token_10:
    default: "system/fixed_color/outline/primary"
    fixed: ""
    fallback: ""
  token_11:
    default: "system/size/radius/box/250"
    fixed: ""
    fallback: ""
  token_12:
    default: "system/size/icon/24"
    fixed: ""
    fallback: ""
layout:
  sizes:
    - name: "XXXXLarge"
      image: "128px"
      touch: "140px"
    - name: "XXXLarge"
      image: "96px"
      touch: "108px"
    - name: "XXLarge"
      image: "72px"
      touch: "84px"
    - name: "XLarge"
      image: "64px"
      touch: "72px"
    - name: "Large"
      image: "56px"
      touch: "64px"
    - name: "Medium"
      image: "48px"
      touch: "56px"
    - name: "Small"
      image: "40px"
      touch: "46px"
    - name: "XSmall"
      image: "32px"
      touch: "38px"
    - name: "XXSmall"
      image: "24px"
      touch: "30px"
    - name: "XXXSmall"
      image: "21.67px"
      touch: "26px"
    - name: "Tiny"
      image: "16px"
      touch: "22px"
  spacing:
    - summary: |
        | Size | 이미지 | 터치 영역 |
        | --- | ---: | ---: |
        | XXXXLarge | 128px | 140px |
        | XXXLarge | 96px | 108px |
        | XXLarge | 72px | 84px |
        | XLarge | 64px | 72px |
        | Large | 56px | 64px |
        | Medium | 48px | 56px |
        | Small | 40px | 46px |
        | XSmall | 32px | 38px |
        | XXSmall | 24px | 30px |
        | XXXSmall | 21.67px | 26px |
        | Tiny | 16px | 22px |
        
        Circle image mask:
        
        - `border-radius: 9999px`를 사용한다.
        - 이미지는 root wrapper 안에서 중앙 정렬한다.
        - Ring wrapper는 전체 `Touch` size를 차지한다.
        
        Squircle image mask:
        
        - tokenized rounded-square radius를 사용한다. 가능하면 `system/size/radius/box/250`을 사용한다.
        - `Badge_Dot`과 `Host`는 root wrapper 안에 absolute positioning으로 배치한다.
  radius:
    - role: "shape"
      token: ""
  responsive_rules:
    - summary: |
        Avatar는 stretch로 fluid하게 반응하지 않는다. 반응형 처리는 size 선택의 문제다. dense surface에는 `Tiny`, `XXXSmall`, `XXSmall`, `XSmall`, `Small`을, profile row와 comment에는 `Medium` 또는 `Large`를, hero/profile surface에는 `XLarge`, `XXLarge`, `XXXLarge`, `XXXXLarge`를 사용한다.
        
        Wrapper는 square이며 aspect ratio `1:1`을 유지한다. Image content는 중앙 정렬한다. Edge decoration은 wrapper 안에 absolute positioning으로 배치한다. 주변 layout이 gap과 alignment를 책임진다.
        
        list, comment row, participant group, profile cluster 같은 반복 UI pattern 안에서는 하나의 Avatar size를 일관되게 사용한다. 로컬 콘텐츠에 맞추기 위해 가까운 Avatar size를 섞지 말고 parent layout을 변경한다.
accessibility:
  summary: |
    Avatar가 보이는 entity를 식별하면 의미 있는 `alt` 또는 accessible label을 전달한다. 주변 텍스트가 이미 entity 이름을 제공하면 중복 낭독을 피하기 위해 `alt=""`를 사용한다. 장식 요소는 assistive technology에서 숨기되, 제품에 중요한 상태를 전달한다면 parent control이나 명시적 label에 그 상태를 노출한다.
    
    클릭 가능한 Avatar는 keyboard focus, target size, role semantics를 제공하는 button 또는 link 안에 렌더링한다. Avatar 단독으로 interactive target을 만들지 않는다.
rules:
  do:
    - "개인 정체성 및 user profile context에는 `Circle`을 사용한다."
    - "콘텐츠, host, artist, service presence에 가까운 정체성에는 `Squircle`을 사용한다."
    - "콘텐츠 목적과 역할에 따라 Avatar type을 선택하고 해당 UI 안에서 type을 일관되게 유지한다."
    - "custom scaling 대신 가장 가까운 정의된 `Size` 값을 선택한다."
    - "같은 repeated layout 안에서는 하나의 Avatar size를 사용한다."
    - "이미지가 정체성을 전달하면 alt text 또는 accessible label을 제공한다."
    - "이미지 로드 실패 시 결정적 fallback을 사용한다."
  dont:
    - "Avatar를 임의 dimension으로 stretch하지 않는다."
    - "제품상 이유 없이 같은 semantic group 안에서 `Circle`과 `Squircle` type을 섞지 않는다."
    - "하나의 repeated pattern 안에서 Avatar size를 섞지 않는다."
    - "제품 의도 없이 충돌하는 ornament를 쌓지 않는다."
    - "Avatar를 generic icon 또는 thumbnail 용도로 사용하지 않는다."
    - "`Badge_Dot`, `Host`, `Emoji`, `Birthday_Hat`이 주요 얼굴을 가리지 않게 한다."
    - "token이 존재할 때 semantic color를 hard-code하지 않는다."
notes:
  source_notes: |
    | 출처 | 값 |
    | --- | --- |
    | 파일 | `Chord Design System` |
    | File key | `DWEduE6GfxYMlyxKPNJ8jA` |
    | 문서 프레임 | `62973:5571` / `[V2] Avatar` |
    | Component set | `62973:7556` / `[V2] Avatar` |
    | Component set key | `33d955018e09fb10ab89cefc8f00f2662a2b0e39` |
    | 설명 | `팬 및 아티스트 개인 프로필` |
    | Header 본문 | `아바타는 사람과 서비스를 대표하는 이미지형 컴포넌트입니다.` |
    | 원칙 | `아바타는 콘텐츠의 성격과 사용자의 정체성 표현 목적에 따라 타입을 구분합니다.` |
    | 원칙 | `레이아웃을 해치지 않도록 상황에 맞는 크기를 적용해 사용합니다.` |
    | Usage file | `Chord_Usage` / `6pHGdaJh3L8Z1Ew8AxIV85` |
    | Usage frame | `277:34924` / `Avatar` |
    | 사용 규칙 | 콘텐츠 목적과 역할에 맞는 type을 사용하고, 같은 semantic group 안에서 Avatar type을 섞지 않는다. |
    | 사용 규칙 | 반복 layout 안에서는 일관된 Avatar size를 사용하고, 가까운 size를 임의로 섞지 않는다. |
  source_gaps: []
  deprecated: []
---

# Avatar
---

> Avatar는 사람, 아티스트, 호스트, 서비스 정체성을 이미지 중심으로 표현하는 컴포넌트다. 콘텐츠, 프로필, 댓글, 채팅, 라이브 순간이 "누구"에게 속하는지 빠르게 인식해야 할 때 사용한다.
---

## 1. 역할과 사용

Avatar는 사람, 아티스트, 호스트, 서비스 정체성을 이미지 중심으로 표현하는 컴포넌트다. 콘텐츠, 프로필, 댓글, 채팅, 라이브 순간이 "누구"에게 속하는지 빠르게 인식해야 할 때 사용한다.

개인 또는 프로필 정체성에는 `Circle`을 사용한다. 콘텐츠, 아티스트 브랜딩, 호스트 presence, 서비스 소유 프로필 블록처럼 동작하는 정체성에는 `Squircle`을 사용한다. 크기는 임의로 scale 하지 않고 주변 layout density에 맞춰 선택한다. Figma 계약은 `Tiny`부터 `XXXXLarge`까지 고정 size step을 정의한다.

Usage 가이드는 Avatar type을 콘텐츠 성격과 정체성 표현 목적에 따라 구분한다. list, profile row, content area에서 Avatar type과 size를 정하면 같은 맥락 안에서는 일관되게 유지해 layout이 시각적으로 흔들리지 않게 한다.

Avatar를 일반 icon container, 장식용 이미지 crop, 독립 status badge, Card thumbnail 대체재로 사용하지 않는다.
---

## 2. 시각적 성격

Avatar는 compact하고 image-first이며 identity-focused한 인상을 가져야 한다. 기본 이미지 shape은 단순하고 조용하게 유지하고, optional ornament는 순간적 의미를 더한다. ring은 live/moment 상태를 강조하고, birthday hat은 축하 맥락을, emoji는 표현 맥락을, badge dot은 unread/attention을, host mark는 권위를 나타낸다.

시각 언어는 절제되어야 한다. profile image가 가장 중요한 요소로 남아야 하며, decoration은 얼굴이나 주요 subject를 가리지 않고 edge 또는 corner에 배치한다.
---

## 3. 구조

핵심 파트:

- `root`: size, positioning, hit target을 소유하는 고정 square wrapper.
- `image`: 내부 avatar media frame. `Circle`은 원형, `Squircle`은 rounded-square다.
- `Ring`: Circle avatar용 optional ring layer.
- `Birthday_Hat`: Circle avatar용 optional top-corner icon ornament.
- `Emoji`: Circle avatar용 선택 표현 corner ornament.
- `Badge_Dot`: Squircle avatar용 선택 attention dot.
- `Host`: Squircle avatar용 선택 host indicator.

컴포넌트는 소비자가 overlay를 직접 조합하게 하지 말고, 이 파트들을 props로 노출해야 한다.
---

## 4. 컴포넌트 스타일링

이미지는 항상 type shape에 맞게 clip된다. `Circle`은 완전한 원형 image mask를 사용한다. `Squircle`은 rounded-square image mask를 사용하고 bottom/corner badge를 가질 수 있다.

Avatar size는 고정이다. 임의 width/height 값을 사용하지 말고 `Size` prop을 정확한 contract table에 매핑한다. decoration size와 offset은 선택된 size에 연결된다. 큰 Circle avatar는 `Ring`, `Birthday_Hat`, `Emoji`를 지원하고, Squircle avatar는 `Badge_Dot`, `Host`를 지원한다.

semantic color 결정에는 design token을 사용한다. Badge와 outline color는 hard-coded value 대신 system token layer에 매핑하고, 추출된 visual fallback value는 문서용으로만 사용한다.
---

## 5. 상태와 인터랙션

Avatar 자체는 주로 presentational이다. 클릭 가능하면 parent interactive control이 hover, pressed, focus, disabled behavior를 소유한다. Avatar 컴포넌트는 accessible image labeling과 결정적 fallback rendering을 지원해야 한다.

상태성 장식:

- `Ring`: user 또는 content에 ring/moment state가 있을 때 표시한다.
- `Birthday_Hat`: birthday 또는 celebration state에 표시한다.
- `Emoji`: expressive reaction이 붙었을 때 표시한다.
- `Badge_Dot`: Squircle avatar에서 unread, new, attention state에 표시한다.
- `Host`: avatar가 host 또는 official presenter를 나타낼 때 표시한다.

제품 case가 명시적으로 요구하지 않는 한 모든 decoration을 한꺼번에 조합하지 않는다. 이미지는 계속 읽을 수 있어야 한다.
---

## 6. 레이아웃과 반응형 규칙

Avatar는 stretch로 fluid하게 반응하지 않는다. 반응형 처리는 size 선택의 문제다. dense surface에는 `Tiny`, `XXXSmall`, `XXSmall`, `XSmall`, `Small`을, profile row와 comment에는 `Medium` 또는 `Large`를, hero/profile surface에는 `XLarge`, `XXLarge`, `XXXLarge`, `XXXXLarge`를 사용한다.

Wrapper는 square이며 aspect ratio `1:1`을 유지한다. Image content는 중앙 정렬한다. Edge decoration은 wrapper 안에 absolute positioning으로 배치한다. 주변 layout이 gap과 alignment를 책임진다.

list, comment row, participant group, profile cluster 같은 반복 UI pattern 안에서는 하나의 Avatar size를 일관되게 사용한다. 로컬 콘텐츠에 맞추기 위해 가까운 Avatar size를 섞지 말고 parent layout을 변경한다.
---

## 7. 권장/금지

DO:

- 개인 정체성 및 user profile context에는 `Circle`을 사용한다.
- 콘텐츠, host, artist, service presence에 가까운 정체성에는 `Squircle`을 사용한다.
- 콘텐츠 목적과 역할에 따라 Avatar type을 선택하고 해당 UI 안에서 type을 일관되게 유지한다.
- custom scaling 대신 가장 가까운 정의된 `Size` 값을 선택한다.
- 같은 repeated layout 안에서는 하나의 Avatar size를 사용한다.
- 이미지가 정체성을 전달하면 alt text 또는 accessible label을 제공한다.
- 이미지 로드 실패 시 결정적 fallback을 사용한다.

DON'T:

- Avatar를 임의 dimension으로 stretch하지 않는다.
- 제품상 이유 없이 같은 semantic group 안에서 `Circle`과 `Squircle` type을 섞지 않는다.
- 하나의 repeated pattern 안에서 Avatar size를 섞지 않는다.
- 제품 의도 없이 충돌하는 ornament를 쌓지 않는다.
- Avatar를 generic icon 또는 thumbnail 용도로 사용하지 않는다.
- `Badge_Dot`, `Host`, `Emoji`, `Birthday_Hat`이 주요 얼굴을 가리지 않게 한다.
- token이 존재할 때 semantic color를 hard-code하지 않는다.
---

## 8. 에이전트 프롬프트 가이드

구현 코드를 생성할 때 사용할 프롬프트:

```text
구현 계약을 기준으로 Chord DS Avatar 컴포넌트를 만든다. square root, clipped image, Circle/Squircle shape variant, 고정 Size mapping, Mode 처리, boolean ornament props Ring, Birthday_Hat, Emoji, Badge_Dot, Host를 구현한다. decoration은 size에 따라 배치하고 임의 dimension을 허용하지 않는다.
```

생성된 코드를 검토할 때 사용할 프롬프트:

```text
Avatar가 Mode=Default/Fixed, Type=Circle/Squircle, Tiny부터 XXXXLarge까지 모든 Size, 다섯 boolean ornament props, 정확한 image/touch size, 토큰화된 color, accessible labeling, fallback rendering을 지원하는지 확인한다.
```
