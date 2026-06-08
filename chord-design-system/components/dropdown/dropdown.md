# CDS / Components / Dropdown

# [V2] Dropdown

목록에서 단일 항목을 선택하는 UI 구성 요소입니다. 트리거 영역 탭 시 옵션 목록이 표시되며, 상태값에 따라 사용자에게 항목을 노출합니다.

## Principle

- 사용자에게 Dropdown 내에 정보가 담겨있는 항목을 제공해야 합니다.
- 사용자가 선택 및 액션을 했을 경우, 그에 따른 상태값과 항목으로 피드백해야 합니다.


## Specification

### Properties

| Properties | Type | Description | Values |
| --- | --- | --- | --- |
| Mode | enum | Default를 선택하면 OS 테마 환경에 따라 변경되고, Fixed를 선택하면 OS 테마에 상관없이 다크 테마로 표시됩니다. | Default, Fixed |
| State | enum | 드롭다운의 상태를 정의합니다. | Default, Pressed (Hover), Enabled_Down, Enabled_Up, Completed, Error, Disabled |
| Show Title | boolean | 드롭다운 타이틀 텍스트 표시 여부를 설정합니다. 인스턴스 속성. | ON, OFF |
| Show Guide | boolean | 가이드 문구 표시 여부를 설정합니다. 인스턴스 속성. | ON, OFF |
| Show Scrollbar | boolean | 드롭다운 상태가 Enabled_Down, Enabled_Up일때, 옵션 목록 스크롤바 표시 여부를 설정합니다. 인스턴스 속성. | ON, OFF |
| Show Badge_Dot | boolean | 필수 선택 항목인 경우 드롭다운 배지 점 표시 여부를 설정합니다. 인스턴스 속성. | ON, OFF |

## Guide

### Dimensions

| Part | Size |
| --- | --- |
| Box Height (Input, 최대 1줄) | 46px |
| List Item Max Height | 216px |
| Border Radius | 8px |

### Padding

| 항목 | 값 |
| --- | --- |
| Title 좌측 내부 패딩 | `system/size/padding/box/50` |
| Title 텍스트 ↔ Badge_Dot 간격 | `system/size/padding/box/25` |
| Title ↔ Input 간격 | `system/size/padding/box/75` |
| Input 상하 내부 패딩 | `system/size/padding/box/150` |
| Input ↔ Guide Message 간격 | `system/size/padding/box/75` |
| Input 좌우 외부 패딩 | `system/size/padding/box/200` |
| Input 좌측 내부 패딩 | `system/size/padding/box/200` |
| text ↔ 아이콘 간격 | `system/size/padding/box/100` |
| 아이콘 우측 내부 패딩 | `system/size/padding/box/200` |


### Text Style

| 영역 | 텍스트 스타일 | Font Size | Line Height |
| --- | --- | --- | --- |
| Title | body-xs / system-400 | 14px | 18 |
| Label (Input
 text) | body-m / system-400 | 16px | 22 |
| Guide Message | caption-m / system-400 | 13px | 17 |

### Colors

#### Light/Dark Mode

| State | Part | Token | Light | Dark |
| --- | --- | --- | --- | --- |
| Default, Completed | Container fill | 컬러 미노출 | 컬러 미노출 | 컬러 미노출 |
| Default, Completed | Container stroke | system/color/status/inactive-gray | #DCDEE4 | #3E3E3E |
| Enabled_Down, Enabled_Up | Container fill | system/color/status/focus-gray-400 | #ffffff | #282828 |
| Enabled_Down, Enabled_Up | Container stroke | system/color/status/focus-gray-400 | #AEB1B8 | #555555 |
| Error | Container stroke | system/color/status/danger-red | #FE5B58 | #FE5B58 |
| Disabled | Container fill | system/color/status/background-disabled | #F2F3F7 | #1F1F1F |
| Disabled | Container stroke | system/color/status/inactive-gray | #DCDEE4 | #3E3E3E |

List Item 영역 컬러는 List Item 컴포넌트 토큰을 따릅니다.

#### Fixed Mode

| State | Part | Token | Light | Dark |
| --- | --- | --- | --- | --- |
| Default, Completed | Container fill | 컬러 미노출 | 컬러 미노출 | 컬러 미노출 |
| Default, Completed | Container stroke | system/fixed_color/status/inactive-gray | #3E3E3E | #3E3E3E |
| Enabled_Down, Enabled_Up | Container fill | system/fixed_color/surface/default-4 | #282828 | #282828 |
| Enabled_Down, Enabled_Up | Container stroke | system/fixed_color/status/focus-gray-400 | #555555 | #555555 |
| Error | Container stroke | system/fixed_color/status/danger-red | #FE5B58 | #FE5B58 |
| Disabled | Container fill | system/fixed_color/status/background-disabled | #1F1F1F | #1F1F1F |
| Disabled | Container stroke | system/fixed_color/status/inactive-gray | #3E3E3E | #3E3E3E |
## Usage Do / Don't

### Color

**Do**

- 정해진 상태값이 있기 때문에, 항목 선택된 값은 해당 상태값으로 사용해야 한다.

**Don't**

- 고정된 값이기 때문에, 커뮤니티 색상으로 변경하지 않아야 한다.

### Position

**Do**

- 화면의 상단과 하단 비율에 따라 드롭다운 항목 노출 위치가 자동으로 변경되기 때문에, 위치 변경 동작을 허용해야 한다.

**Don't**

- 위치가 화면 비율에 따라 자동 결정되기 때문에, 임의로 노출 위치를 고정하지 않아야 한다.

## Dropdown_Ghost

해상도에 따라 노출 형태가 달라지는 간소화된 드롭다운 변형 타입.

- Mobile(APP): Bottom Popup 컴포넌트로 노출
- Desktop / Tablet: Menu 컴포넌트로 노출

### Colors

#### Light/Dark Mode

| State | Part | Token | Light | Dark |
| --- | --- | --- | --- | --- |
| — | 아이콘 | system/color/icon/gray-800 | #282828 | #DDDDDD |
| — | 텍스트 | system/color/text/gray-800 | #282828 | #DDDDDD |

#### Fixed Mode

| State | Part | Token | Light | Dark |
| --- | --- | --- | --- | --- |
| — | 아이콘 | system/fixed_color/icon/gray-800 | #DDDDDD | #DDDDDD |
| — | 텍스트 | system/fixed_color/text/gray-800 | #DDDDDD | #DDDDDD |

### Interaction

- Character Count: 최대 10글자
- Icon Rotation: 180°
- Transition: 0.25sec

## Transition

Dropdown_Box 옵션 목록 열림/닫힘 애니메이션 규칙.

| 항목 | 값 |
| --- | --- |
| Easing | Ease In & Out |
| Duration | 0.3sec |
| Icon Rotation | 180° |
| 옵션 리스트 | Ma






sking 영역 내 열림/닫힘 처리 |

옵션 항목의 높이값 차이와 무관하게 모든 경우 동일한 Duration으로 늘어납니다.