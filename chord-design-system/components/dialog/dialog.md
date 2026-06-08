# CDS / Components / Dialog

# [V2] Dialog

UX Flow에서 사용자의 동작을 멈추고 집중시켜야 하는 중요한 메시지와 함께 경고(Alerts), 확인(Confirm)이 필요한 경우 사용합니다.

## Principle

- 콘텐츠의 성격을 구분하여 다이얼로그 혹은 바텀 팝업/시트를 사용합니다.
- 사용자에게 중요한 메시지를 전달하고 그에 맞는 명확한 액션을 유도하기 위해 사용됩니다.

## Specification

### Properties

| Properties | Type | Description | Values |
| --- | --- | --- | --- |
| Mode | enum | Default를 선택하면 OS 테마 환경에 따라 변경되고, Fixed를 선택하면 OS 테마에 상관없이 다크 테마로 표시됩니다. | Default, Fixed |
| Show Title | boolean | Dialog의 Title 표시 여부를 설정합니다. ON 시 Title 텍스트를 입력합니다. 인스턴스 속성. | ON, OFF |
| Show Description | boolean | Dialog의 Description 표시 여부를 설정합니다. ON 시 Description 텍스트를 입력합니다. 인스턴스 속성. | ON, OFF |
| Show Icon | boolean | Dialog 상단 아이콘 표시 여부를 설정합니다. 인스턴스 속성. | ON, OFF |
| → size | enum | 아이콘 크기를 설정합니다. 인스턴스 속성. | medium |
| → em | boolean | 인스턴스 속성. | ON, OFF |
| → 24M | enum | 표시할 아이콘을 선택합니다. 인스턴스 속성. | (icon name) |
| Dialog Buttons > Type | enum | Dialog의 버튼 배치 방향을 설정합니다. 버튼 사이즈는 44로 고정됩니다. | Vertical, Horizontal |
| Dialog Buttons > Button 01 | boolean | 첫 번째 버튼 표시 여부를 설정합니다. 인스턴스 속성. | ON, OFF |
| Dialog Buttons > Button 02 | boolean | 두 번째 버튼 표시 여부를 설정합니다. 인스턴스 속성. | ON, OFF |
| Dialog Buttons > Button 03 | boolean | 세 번째 버튼 표시 여부를 설정합니다. 인스턴스 속성. | ON, OFF |
| Checkbox | boolean | Dialog 하단 Agreement 체크박스 및 텍스트 표시 여부를 설정합니다. | ON, OFF |

## Guide

### Dimensions

Dialog의 가로 폭은 고정이며, 세로 높이는 콘텐츠 양에 따라 가변됩니다.

| Part | Size |
| --- | --- |
| Dialog Width | 312px |
| Button Height | 44px |

### Padding

| 항목 | 값 |
| --- | --- |
| 상단 내부 패딩 | `system/size/padding/box/300` |
| Title ↔ Description 간격 | `system/size/padding/box/150` |
| Description ↔ Checkbox 간격 | `system/size/padding/box/300` |
| Checkbox ↔ Button 간격 | `system/size/padding/box/200` |
| 버튼 간 간격 | `system/size/padding/box/75` |
| 하단 내부 패딩 | `system/size/padding/box/200` |
| 좌우 내부 패딩 | `system/size/padding/box/200` |

### Text Style

Dialog 내 텍스트 영역별 스타일 및 최대 줄 수 규칙.

| 영역 | 텍스트 스타일 | Font Size | Line Height | 최대 줄 수 | 초과 처리 |
| --- | --- | --- | --- | --- | --- |
| Title | headline-s / system-700 | 19px | 25 | 3줄 | "..." |
| Description | body-m / system-400 | 16px | 22 | 5줄 | "..." |
| Agreement / Text | body-s / system-400 | 15px | 21 | 2줄 | "..." |

### Colors

#### Light/Dark Mode

| State | Part | Token | Light | Dark |
| --- | --- | --- | --- | --- |
| — | Title | `system/color/text/default` | #000000 | #FFFFFF |
| — | Description | `system/color/text/600a` | #000000CC | #FFFFFFCC |
| — | Checkbox 텍스트 | `system/color/text/400a` | #00000080 | #FFFFFF80 |

#### Fixed Mode

| State | Part | Token | Light | Dark |
| --- | --- | --- | --- | --- |
| — | Title | `system/fixed_color/text/default` | #FFFFFF | #FFFFFF |
| — | Description | `system/fixed_color/text/600a` | #FFFFFFCC | #FFFFFFCC |
| — | Checkbox 텍스트 | `system/fixed_color/text/400a` | #FFFFFF80 | #FFFFFF80 |

### Dialog Cases

버튼 수와 배치에 따른 Dialog 케이스 구성.

| 케이스 | 버튼 구성 | 비고 |
| --- | --- | --- |
| 버튼 1개 | Main Button Filled / 44 | 단순 확인 |
| 버튼 2개 | Main Button Filled / 44 + Outlined-Gray / 44 | Horizontal 배치 권장, 택1 |
| 버튼 3개 | Main Button Filled / 44 + Outlined-Gray / 44 + Ghost / 44 | Vertical 배치, 최대 3개 |

Android 가로 모드에서는 콘텐츠 영역이 스크롤 영역과 버튼 고정 영역으로 분리됩니다.

## Usage Do / Don't

### Text Overflow

**Do**

- 텍스트 영역별로 최대 줄 수가 정해져 있기 때문에, 정해진 글자 수를 넘어가면 "..." 처리해야 한다.

**Don't**

- 정해진 글자 수를 초과하는 텍스트는 표시되지 않기 때문에, 글자 수를 넘겨 작성하지 않아야 한다.

### Scrim Overlay

**Do**

- 배경 콘텐츠와 명확하게 분리해야 하기 때문에, Scrim Overlay의 Opacity 값은 50%를 사용해야 한다.

**Don't**

- Scrim Overlay의 Opacity는 고정값이기 때문에, 임의로 값을 변경하지 않아야 한다.

### Position

**Do**

- 사용자의 시선을 집중시켜야 하기 때문에, Dialog의 위치는 화면 정중앙에 배치해야 한다.

**Don't**

- Dialog의 위치는 고정되어 있기 때문에, 임의로 위치를 변경하지 않아야 한다.
