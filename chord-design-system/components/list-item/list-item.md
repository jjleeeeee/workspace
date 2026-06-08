
# CDS / Components / List Item

# [V2] List Item

정보를 수직으로 나열하여 사용자가 특정 항목을 쉽게 찾고, 상호작용할 수 있도록 도와주는 UI 구성 요소입니다.

## Principle

- Item들과 타이틀의 일관된 정렬로 가독성을 확보합니다. 멀티 라인인 경우 상단 정렬을 반드시 유지합니다.
- 제목, 설명, 가격 등 동일한 종류의 정보를 제공하여 비교하기 쉽도록 구성합니다.
- 선택된 항목은 선택되지 않은 항목보다 더 강조돼야 합니다.

## Specification

### Properties

#### Base

| Properties | Type | Description | Values |
| --- | --- | --- | --- |
| Mode | enum | Default를 선택하면 OS 테마 환경에 따라 변경되고, Fixed를 선택하면 OS 테마 환경에 상관없이 다크테마로 보여집니다. | Default, Fixed |
| Size | enum | List Item 컴포넌트의 사이즈를 정의합니다. | Medium, Small |
| State | enum | 컴포넌트의 상태값에 따라 선택할 수 있습니다. | Default, Hover(Pressed), Disabled |
| Show Leading | boolean | Leading 영역의 속성을 노출하거나 숨겨둘 수 있습니다. 인스턴스 속성. | ON, OFF |
| Show Trailing | boolean | Trailing 영역의 속성을 노출하거나 숨겨둘 수 있습니다. 인스턴스 속성. | ON, OFF |
| Show Divider | boolean | 디바이더를 노출하거나 숨길 수 있습니다. 인스턴스 속성. | ON, OFF |

> **예외 케이스:** Web 컴포넌트에는 Alignment 축 추가 (Center 고정). 총 12개 Variant (Native) / 12개 Variant (Web).

#### Leading

| Properties | Type | Description | Values |
| --- | --- | --- | --- |
| Type | enum | Leading 영역의 속성을 선택합니다. | Avatar, Checkbox, Icon, Image, Radio |
| [Avatar] Type | enum | 아바타의 타입을 정할 수 있습니다. | Circle, Squircle |
| [Avatar] Size | enum | 아바타의 크기를 정할 수 있습니다. XXSmall(24)부터 XLarge(64)까지 사용합니다. | XXSmall 24, XSmall 32, Small 40, Medium 48, Large 56, XLarge 64 |
| [Checkbox] Mode | enum | Default는 OS 테마 환경에 따라 변경되고, Fixed는 다크테마로 고정됩니다. | Default, Fixed |
| [Checkbox] Size | enum | Checkbox의 사이즈를 선택합니다. | medium (24) |
| [Checkbox] Type | enum | Checkbox의 타입을 선택합니다. | Box, Circle |
| [Checkbox] State | enum | Checkbox의 상태를 선택합니다. | ON, Disabled, OFF |
| [Icon] Size | enum | 아이콘의 사이즈를 고를 수 있습니다. 24×24 고정. | medium 24 |
| [Icon] em | boolean | 아이콘의 em 여부를 선택합니다. 인스턴스 속성. | ON, OFF |
| [Image] Size | enum | 이미지의 사이즈 타입을 선택합니다. | Square (1:1 비율), Rectangle (16:9 비율) |

#### Content — Title

| Properties | Type | Description | Values |
| --- | --- | --- | --- |
| Mode | enum | Default는 OS 테마 환경에 따라 변경되고, Fixed는 다크테마로 고정됩니다. | Default, Fixed |
| Weight | enum | 타이틀의 Weight 값을 선택할 수 있습니다. | body-m/700 (Bold), body-m/400 (Regular) |
| Font-color | enum | 타이틀의 컬러를 선택할 수 있습니다. | Default, Primary, Red |
| Trailing Icon | boolean | 아이콘 노출 여부를 선택할 수 있습니다. 멤버십 아이콘 포함, 16px. 인스턴스 속성. | ON, OFF |
| Show Badge | boolean | New Dot 노출 여부를 선택할 수 있습니다. 인스턴스 속성. | ON, OFF |

#### Content — Body

| Properties | Type | Description | Values |
| --- | --- | --- | --- |
| Mode | enum | Default는 OS 테마 환경에 따라 변경되고, Fixed는 다크테마로 고정됩니다. | Default, Fixed |
| Text Weight | enum | Body Text의 굵기를 설정할 수 있습니다. | body-xs/700 (Bold), body-xs/400 (Regular) |
| Text Color | enum | Body Text의 컬러를 설정할 수 있습니다. | Default, Primary |
| Leading Icon | boolean | 아이콘 노출 여부를 선택할 수 있습니다. 12px. 인스턴스 속성. | ON, OFF |

#### Trailing

| Properties | Type | Description | Values |
| --- | --- | --- | --- |
| Mode | enum | Default는 OS 테마 환경에 따라 변경되고, Fixed는 다크테마로 고정됩니다. | Default, Fixed |
| Type | enum | Trailing 위치에 노출할 요소를 선택합니다. | Icon Button, Main Button, Number Badge, Radio, Detail, Toggle |
| [Detail] Text Color | enum | 텍스트 컬러를 선택합니다. | Default, Primary |
| [Radio] State | enum | Radio의 상태를 선택합니다. | Default, Enabled, Disabled |
| [Toggle] State | enum | Toggle의 상태를 선택합니다. | Default, Enabled, Disabled |

#### Divider

| Properties | Type | Description | Values |
| --- | --- | --- | --- |
| Size | enum | Divider의 굵기(높이값)을 선택합니다. | Small, Large |

## Guide

### Size

| Size | Min Height |
| --- | --- |
| Medium | 48px |
| Small | 36px |

- 세로 패딩: 상하 최소 2px.
- 싱글 라인: 수직 중앙정렬. 멀티 라인: 상단정렬.

**Thumbnail 사이즈**

| Size | Square | Rectangular |
| --- | --- | --- |
| Medium | 56 × 56px | 88 × 156px |
| Small | 44 × 44px | 56 × 100px |

- Rectangular는 16:9 비율입니다.

### Padding

| Size | 상하 패딩 |
| --- | --- |
| Medium | 12px |
| Small | 6px |

| 항목 | 값 |
| --- | --- |
| 좌우 외부 패딩 | 16px |
| Leading ↔ Content 간격 | 12px |
| Content ↔ Trailing 간격 | 12px |
| 수평 Inner Gap | 4px |
| Title ↔ Body Text 수직 간격 | 2px |

- Leading 영역 아이콘 사이즈: 24 × 24px 고정.
- Body Text Leading 아이콘 사이즈: 12 × 12px 고정.

### Text Style

| 영역 | 스타일 | Font Size | Weight |
| --- | --- | --- | --- |
| Title (Bold) | body-m / system-700 | 16px | 700 |
| Title (Regular) | body-m / system-400 | 16px | 400 |
| Body Text (Bold) | body-xs / system-700 | 13px | 700 |
| Body Text (Regular) | body-xs / system-400 | 13px | 400 |
| Detail | body-xs / system-500 | 13px | 500 |

### Colors

#### Light/Dark Mode

| State | Part | Token | Light | Dark |
| --- | --- | --- | --- | --- |
| Default | Title | system/color/text/default | #000000 | #FFFFFF |
| Primary | Title | system/color/text/primary | #00B8C1 | #01D5DF |
| Red | Title | system/color/text/red-accent | #FF1744 | #FF1744 |
| Default | Body Text | system/color/text/400a | #00000080 | #FFFFFF80 |
| Primary | Body Text | system/color/text/primary | #00B8C1 | #01D5DF |
| Default | Icon (Leading) | system/color/icon/default | #000000 | #FFFFFF |
| Primary | Icon (Leading) | system/color/icon/primary | #00B8C1 | #01D5DF |
| Default | Detail (text) | system/color/text/default | #000000 | #FFFFFF |
| Primary | Detail (text) | system/color/text/primary | #00B8C1 | #01D5DF |
| Default | Detail (icon) | system/color/icon/default | #000000 | #FFFFFF |
| Primary | Detail (icon) | system/color/icon/primary | #00B8C1 | #01D5DF |
| — | Divider | system/color/outline/default-50a-2 | #0000000A | #FFFFFF1A |

- State 열은 Font-color / Text Color Property 값을 나타냅니다 (컴포넌트 상호작용 State와 별개).

#### Fixed Mode

| State | Part | Token | Light | Dark |
| --- | --- | --- | --- | --- |
| Default | Title | system/fixed_color/text/default | #FFFFFF | #FFFFFF |
| Primary | Title | system/fixed_color/text/primary | #01D5DF | #01D5DF |
| Red | Title | system/fixed_color/text/red-accent | #FF1744 | #FF1744 |
| Default | Body Text | system/fixed_color/text/400a | #FFFFFF80 | #FFFFFF80 |
| Primary | Body Text | system/fixed_color/text/primary | #01D5DF | #01D5DF |
| Default | Icon (Leading) | system/fixed_color/icon/default | #FFFFFF | #FFFFFF |
| Primary | Icon (Leading) | system/fixed_color/icon/primary | #01D5DF | #01D5DF |
| Default | Detail (text) | system/fixed_color/text/default | #FFFFFF | #FFFFFF |
| Primary | Detail (text) | system/fixed_color/text/primary | #01D5DF | #01D5DF |
| Default | Detail (icon) | system/fixed_color/icon/default | #FFFFFF | #FFFFFF |
| Primary | Detail (icon) | system/fixed_color/icon/primary | #01D5DF | #01D5DF |
| — | Divider | system/fixed_color/outline/default-100a | #FFFFFF1A | #FFFFFF1A |

- State 열은 Font-color / Text Color Property 값을 나타냅니다 (컴포넌트 상호작용 State와 별개).

## Usage Do / Don't

### Pressed

Do

- Pressed 효과는 기본 형태(Leading = Basic/Icon/Avatar/Image, Trailing = Detail)일 때만 제공되기 때문에, 해당 조건에서만 Pressed 상태를 사용해야 한다.
- 멀티 라인에서 모든 콘텐츠의 가독성을 유지해야 하기 때문에, 멀티 라인 List Item은 상단정렬로 배치해야 한다.

Don't

- Leading이 Checkbox 또는 Radio인 경우 터치 영역이 해당 컨트롤로 한정되기 때문에, List Item 전체에 Pressed 효과를 적용하지 않아야 한다.
- Trailing에 Detail 이외의 요소(Icon Button, Main Button, Number Badge, Radio, Toggle)가 있는 경우, List Item 전체에 Pressed 효과를 적용하지 않아야 한다.

## Interaction

List Item의 Pressed 및 Remove 인터랙션 정의.

### Pressed — iOS

| 항목 | 값 |
| --- | --- |
| 적용 방식 | Scale Down |
| 기본 크기 | 100% |
| Pressed 크기 | 97% |
| Transition | iOS system 정의를 따릅니다. |

### Pressed — Android

| 항목 | 값 |
| --- | --- |
| 적용 방식 | Ripple Effect |
| Transition | Android system 정의를 따릅니다. |

### Remove (Swipe Action)

- Swipe Action은 선택적으로 제공합니다.
- 삭제 버튼 영역 너비: 74px 고정.
