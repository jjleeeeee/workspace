# CDS / Components / Button

# [V3] Button

사용자가 선택이나 행동을 할 수 있게 합니다.

## Principle

- 화면 하단이나 콘텐츠 위에 노출되며 사용자의 작업을 수행합니다.
- 사용자가 직관적으로 보기 편하고 찾기 쉬워야 합니다.
- 화면 균형을 고려하고 중요도에 알맞은 버튼 크기를 사용합니다.
- 터치 영역을 고려하여 만듭니다.

## Specification

### Properties

| Properties | Type | Description | Values |
| --- | --- | --- | --- |
| Type | enum | 버튼 형태를 정의합니다. | Filled, Outlined-color, Outlined-gray, Ghost |
| Mode | enum | Default를 선택하면 OS테마 환경에 따라 변경되고, Fixed를 선택하면 OS 테마 환경에 상관없이 다크테마로 보여집니다. | Default, Fixed |
| Size | enum | 버튼의 크기를 정의합니다. | XLarge, Large, Medium, Small, XSmall, XXSmall |
| Button_Color | enum | 버튼의 컬러 조합을 정의합니다. Filled·Outlined-color는 Default·Black 모두 지원하고, Outlined-gray·Ghost는 Default만 지원합니다. | Default, Black |
| State | enum | 버튼의 상태값을 정의합니다. | Enabled, Pressed, Loading, Disabled |
| Radius | enum | 버튼의 모서리 값을 정의합니다. | Square, Rounded |
| Option Leading | boolean | 버튼 왼쪽 아이콘을 사용하거나, 숨겨둘 수 있습니다. | On, Off |
| Option Trailing | boolean | 버튼 오른쪽 아이콘을 사용하거나, 숨겨둘 수 있습니다. | On, Off |

### Speciality Button

화면 하단에서 노출되며, 부모 화면의 content area 안에서 가로 영역을 채우는 버튼입니다.

- Speciality Button은 `XLarge` 버튼으로 사용합니다.
- 화면 좌우 margin은 버튼 컴포넌트가 직접 결정하지 않습니다. 화면 또는 부모 컨테이너의 layout guide를 따릅니다.
- 스크린 하단 safe-area 또는 navigation area로부터 `system/size/padding/box/200` 간격을 둡니다.

| Platform / Mode | Screen Example | Button Instance | Width Rule | Layout Rule |
| --- | --- | --- | --- | --- |
| iOS: Light/Dark | 393 x 852 | Text Button / Filled / XLarge(52) | content area를 채움 | 하단 safe area로부터 `system/size/padding/box/200` |
| iOS: Fixed | 393 x 852 | Text Button / Filled / XLarge(52) | content area를 채움 | 하단 safe area로부터 `system/size/padding/box/200` |
| Android: Light/Dark | 360 x 760 | Text Button / Filled / XLarge(52) | content area를 채움 | 하단 navigation area로부터 `system/size/padding/box/200` |
| Android: Fixed | 360 x 760 | Text Button / Filled / XLarge(52) | content area를 채움 | 하단 navigation area로부터 `system/size/padding/box/200` |

## Guide

### Size

| Size | Height |
| --- | --- |
| XLarge | 52px |
| Large | 44px |
| Medium | 40px |
| Small | 36px |
| XSmall | 32px |
| XXSmall | 24px |

### Padding

| Size | Button Height | 좌우 내부 패딩 | Leading ↔ 버튼명 간격 | 버튼명 ↔ Trailing 간격 |
| --- | --- | --- | --- | --- |
| XLarge | `system/size/button-height/xlarge` | `system/size/padding/box/300` | `system/size/padding/box/50` | `system/size/padding/box/75` |
| Large | `system/size/button-height/large` | `system/size/padding/box/250` | `system/size/padding/box/50` | `system/size/padding/box/75` |
| Medium | `system/size/button-height/medium` | `system/size/padding/box/200` | `system/size/padding/box/50` | `system/size/padding/box/75` |
| Small | `system/size/button-height/small` | `system/size/padding/box/200` | `system/size/padding/box/50` | `system/size/padding/box/75` |
| XSmall | `system/size/button-height/xsmall` | `system/size/padding/box/150` | `system/size/padding/box/50` | `system/size/padding/box/50` |
| XXSmall | `system/size/button-height/xxsmall` | `system/size/padding/box/100` | `system/size/padding/box/50` | `system/size/padding/box/50` |

- 버튼의 width는 flexible하게 동작하며, 콘텐츠 크기 또는 부모 컨테이너 너비에 따라 `hug` 또는 `fill`로 사용합니다.

### Padding System: Icon

| Button Size | Button Height Token | Icon Area Token | Notes |
| --- | --- | --- | --- |
| XLarge(52) | `system/size/button-height/xlarge` | `system/size/icon/24mquad` | Icon Button의 24x24 inner area |
| Medium(40) | `system/size/button-height/medium` | `system/size/icon/20mquad` | Icon Button의 20x20 inner area |
| Small(36) | `system/size/button-height/small` | `system/size/icon/16mquad` | Icon Button의 16x16 inner area |

### Icon

#### Icon Size Scale

| Size Group | Button Size | Leading Icon | Trailing 반각 (`Trailing_en`) | Trailing 전각 (`Trailing_em`) |
| --- | --- | --- | --- | --- |
| Large | XLarge, Large | 24 | 8*16 | 16*16 |
| Medium | Medium | 20 | 6*12 | 12*12 |
| Compact | Small, XSmall | 16 | 6*12 | 12*12 |
| Small | XXSmall | 16 | 5*10 | 10*10 |

#### Trailing Type Rules

- `Trailing_en`은 반각 trailing icon입니다. chevron, arrow처럼 가로 폭이 좁은 아이콘에 사용합니다.
- `Trailing_em`은 전각 trailing icon입니다. 정방형 아이콘 또는 더 넓은 affordance가 필요한 아이콘에 사용합니다.
- 같은 size group 안에서는 trailing icon size를 동일하게 유지합니다.
- Button height가 달라도 같은 group에 속하면 trailing icon scale은 바꾸지 않습니다.

### Pressed / Hover

Hover와 Press는 버튼 위에 overlay를 얹어 상태 변화를 표현합니다. 배경 맥락에 따라 밝은 overlay와 어두운 overlay를 구분해서 사용합니다.

| Context | Example Button | Overlay Token | Overlay Role |
| --- | --- | --- | --- |
| Color | Filled Primary | `system/color/surface/default-reverse-50a` | 컬러 배경 위의 어두운 overlay |
| Black | Filled Black | `system/color/surface/default-reverse-50a` | 검정 배경 위의 밝은 overlay |
| White | Outlined / White surface | `system/color/surface/default-50a` | 흰색 또는 밝은 배경 위의 어두운 overlay |

- Hover와 Press는 동일한 overlay token을 사용합니다.
- Overlay는 버튼의 기존 fill, stroke, label 색상을 대체하지 않고 위에 얹는 상태 레이어로 사용합니다.
- token의 실제 light/dark 값은 `tokens/color.json`을 기준으로 확인합니다.

### Colors

#### Light/Dark Mode

| Type | Part | Role | Token | Light | Dark |
| --- | --- | --- | --- | --- | --- |
| Filled (Default) | container | fill | `system/color/button/default` | #00CBD5 | #01D5DF |
| Filled (Black) | container | fill | `system/color/button/black` | #000000 | #FFFFFF |
| Outlined-gray | container | stroke | `system/color/button/outlined_gray` | #DEDEDE | #333333 |
| Ghost | container | fill | `system/color/button/ghost` | #FFFFFF00 | #FFFFFF00 |
| Disabled | container | fill or stroke | `system/color/button/disabled` | #0000001A | #FFFFFF1A |
| Default | label | text fill | `system/color/text/default` | #000000 | #FFFFFF |
| Reverse | label | text fill | `system/color/text/default-reverse` | #FFFFFF | #000000 |
| Disabled | label | text fill | `system/color/text/200a` | #00000033 | #FFFFFF33 |

#### Fixed Mode

| Type | Part | Role | Token | Light | Dark |
| --- | --- | --- | --- | --- | --- |
| Filled (Default) | container | fill | `system/fixed_color/button/default` | #01D5DF | #01D5DF |
| Filled (Black) | container | fill | `system/fixed_color/button/white` | #FFFFFF | #FFFFFF |
| Outlined-gray | container | stroke | `system/fixed_color/button/outlined_gray` | #333333 | #333333 |
| Disabled | container | fill or stroke | `system/fixed_color/button/disabled` | #FFFFFF1A | #FFFFFF1A |
| Default | label | text fill | `system/fixed_color/text/default` | #FFFFFF | #FFFFFF |
| Reverse | label | text fill | `system/fixed_color/text/default-reverse` | #000000 | #000000 |
| Disabled | label | text fill | `system/fixed_color/text/200a` | #FFFFFF33 | #FFFFFF33 |

## Usage Do / Don't

### Color

Do

- 기본 버튼 컬러는 `Primary Mint`를 우선 사용해야 한다.
- 서비스 또는 커뮤니티 맥락이 명확할 때만 Community color를 사용할 수 있다.

Don't

- 색상 위계가 무너지기 때문에, 이유 없이 별도 컬러를 적용하지 않아야 한다.
- 관리 복잡도가 증가하기 때문에, WDS에 없는 컬러를 공통 variant처럼 사용하지 않아야 한다.

### Label Typography

Do

- 버튼 크기별 Label spec을 그대로 사용해야 한다.

Don't

- 일관성이 깨지기 때문에, Label size나 font-weight를 임의로 조정하지 않아야 한다.

### Label Length & Layout

Do

- 짧고 간결한 Label은 Horizontal Type을 사용해야 한다.
- 긴 Label이나 다국어 Label은 Vertical Type을 사용해야 한다.

Don't

- 가독성이 저하되기 때문에, 긴 Label을 Horizontal Type에 강제로 넣지 않아야 한다.
- 의미 손실이 발생하기 때문에, 말줄임으로 핵심 action이 사라지는 Label을 사용하지 않아야 한다.

### Dual Button

Do

- Horizontal Type에서는 기본 작업 버튼을 우측에 배치해야 한다.
- Secondary button은 `Outlined_gray` 타입을 사용해야 한다.

Don't

- 예측 가능성이 깨지기 때문에, 기본 작업 버튼 위치를 임의로 변경하지 않아야 한다.
- 위계 혼란이 발생하기 때문에, Secondary button에 Filled 타입을 사용하지 않아야 한다.

### Triple Button

Do

- Triple Button은 Vertical Type으로 사용해야 한다.
- Third button은 `Ghost` 타입을 사용해야 한다.

Don't

- 공간이 압축되기 때문에, Horizontal Type에 버튼을 추가해 3버튼처럼 사용하지 않아야 한다.
- 위계 혼란이 발생하기 때문에, 세 액션을 같은 강조도로 배치하지 않아야 한다.

### State

Do

- 필수 정보가 모두 입력된 뒤에만 주요 버튼을 활성화해야 한다.
- Disabled 상태에서는 버튼을 눌러도 반응하지 않아야 한다.

Don't

- 오조작이 발생하기 때문에, 필수 정보가 입력되지 않은 상태에서 버튼을 활성화하지 않아야 한다.
- 중복 실행이 발생하기 때문에, Loading 중에 중복 요청이 발생하도록 두지 않아야 한다.

## Character Count

버튼명은 1줄로 노출합니다.

- 1줄을 초과하면 말줄임 표시 `...`를 사용합니다.
- 글자수는 언어, 디바이스 너비, 버튼 좌우 여백에 따라 달라집니다.
- Speciality Button 기준 버튼 좌우 여백은 `system/size/padding/box/300`을 사용합니다.

| 기준 | 값 / 예시 | 설명 |
| --- | --- | --- |
| Minimum width | 320 | 최소 너비 기준 |
| Default width | 393 | 기본 너비 기준 |
| Button horizontal padding | `system/size/padding/box/300` | Speciality Button 좌우 여백 |
| 기본 글자수 예시 | 일이삼사오육칠팔구십일이삼사오육 | 1줄로 노출 가능한 한국어 예시 |
| 글자수 초과 예시 | 일이삼사오육칠팔구십일이삼사오육칠팔구십일 | 말줄임 처리 대상 |
| 한국어 기준 | 띄어쓰기 포함 약 26자 | 언어와 화면 너비에 따라 달라질 수 있음 |
| 영문 대문자 기준 | `WWWWWWWWWWWWWW` | `W` 기준 최대 14자까지 노출 |

## Button Group Layout

### Dual Button

주요 액션과 보조 액션이 함께 노출되는 경우 Vertical 또는 Horizontal 두 가지 정렬로 사용할 수 있습니다.

| Layout | Primary Button | Secondary Button | Button Gap | Width Rule |
| --- | --- | --- | --- | --- |
| Vertical | 상단 / Filled | 하단 / Outlined_gray | `system/size/padding/box/75` | 부모 콘텐츠 영역을 채움 |
| Horizontal | 우측 / Filled | 좌측 / Outlined_gray | `system/size/padding/box/100` | 부모 콘텐츠 영역을 채움 |

| Measurement | Token |
| --- | --- |
| Vertical button gap | `system/size/padding/box/75` |
| Horizontal button gap | `system/size/padding/box/100` |

- Vertical Type의 경우 기본 작업 버튼을 상단에, 보조 작업 버튼을 하단에 배치합니다.
- Horizontal Type의 경우 기본 작업 버튼을 우측에, 보조 작업 버튼을 좌측에 배치합니다.
- Secondary button은 `Outlined_gray` 타입을 사용합니다.
- 두 버튼은 같은 button group 안에서 하나의 action pair로 취급합니다.
- Dual Button group의 좌우/하단 여백은 버튼 컴포넌트가 직접 결정하지 않습니다. 화면 또는 부모 컨테이너의 content area를 따르고, 버튼 묶음은 그 영역을 채웁니다.
- 화면 하단에 배치되는 Dual Button group은 Speciality Button과 동일하게 safe-area 또는 navigation area로부터 `system/size/padding/box/200` 간격을 둡니다.

### Triple Button

세 개의 버튼이 함께 노출되는 경우 Vertical Type에서만 사용합니다.

| Layout | Primary Button | Secondary Button | Third Button | Button Gap | Width Rule |
| --- | --- | --- | --- | --- | --- |
| Vertical only | 최상단 / Filled | 중간 / Outlined_gray | 최하단 / Ghost | `system/size/padding/box/75` | 부모 콘텐츠 영역을 채움 |

| Measurement | Token |
| --- | --- |
| Vertical button gap | `system/size/padding/box/75` |

- Triple Button은 Horizontal Type으로 사용하지 않습니다.
- Primary button은 최상단에 배치합니다.
- Secondary button은 중간에 배치하며 `Outlined_gray` 타입을 사용합니다.
- Third button은 최하단에 배치하며 `Ghost` 타입을 사용합니다.
- 세 버튼은 같은 button group 안에서 하나의 action set으로 취급합니다.
- Triple Button group의 좌우/하단 여백은 버튼 컴포넌트가 직접 결정하지 않습니다. 화면 또는 부모 컨테이너의 content area를 따르고, 버튼 묶음은 그 영역을 채웁니다.
- 화면 하단에 배치되는 Triple Button group은 Speciality Button과 동일하게 safe-area 또는 navigation area로부터 `system/size/padding/box/200` 간격을 둡니다.

## Types

### 버튼 타입 요약

| Type |
| --- |
| Filled Button |
| Outlined Button (Color) |
| Outlined Button (Gray) |
| Ghost button |
| Icon button |

### 아이콘 및 상태 표시가 붙은 타입 예시

아이콘이나 상태 표시가 붙어도 버튼 내부 콘텐츠 묶음은 버튼 중앙에 정렬합니다. Label만 중앙에 두고 아이콘을 별도로 가장자리에 붙이지 않습니다.

| Example | Added Element | Alignment Rule |
| --- | --- | --- |
| Membership | Leading membership icon | Icon + label 묶음을 버튼 중앙에 정렬 |
| Artist Shop | Leading icon | Icon + label 묶음을 버튼 중앙에 정렬 |

- Leading icon은 label 앞에 붙지만, 버튼 전체 정렬 기준은 `icon + label` 묶음입니다.
- 버튼이 fixed width 또는 fill width로 늘어나도 콘텐츠 묶음은 중앙 정렬을 유지합니다.

## Color & Custom Button Policy

Default 이외의 컬러가 필요한 경우 커뮤니티 컬러를 활용합니다.
커뮤니티 컬러 버튼은 WDS 버튼이 아니며, 공통 Foundation을 기반으로 만든 custom button으로 분류합니다.

### WDS vs Custom Button

| Case | Color Source | Classification | Rule |
| --- | --- | --- | --- |
| WDS Button | Button component의 지정 컬러 | WDS 버튼 | Text Button component의 color property로 선택 가능한 컬러만 WDS 버튼으로 본다 |
| Community Color Button | Community color | Custom button | 버튼 지정 컬러로 정의되지 않았으므로 WDS 버튼으로 보지 않는다 |

- Community color button은 버튼의 공통 구조, 크기, radius, padding 같은 Foundation 규칙만 따른다.
- Community color를 사용하더라도 Text Button의 지정 color property에 없는 색상은 WDS 버튼 variant로 추가하지 않는다.
- 커뮤니티 전용 컬러가 필요한 경우 component variant 확장보다 서비스 맥락의 custom button으로 관리한다.
