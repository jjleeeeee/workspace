# CDS / Components / Chatting Fields

# [V2] Chatting Fields

사용자가 텍스트를 입력하거나 편집할 수 있는 UI 구성 요소입니다. 주로 DM, 고객센터, 리스닝파티, LIVE 등에서 채팅 환경에서 입력한 내용을 전송하는 상황에서 사용됩니다.

## Principle

- 사용자가 어떤 정보를 입력해야 하는지 이해할 수 있도록 라벨을 제공해야 합니다.
- 입력 중 오류가 발생하거나 유효성 검사가 필요한 경우, 사용자에게 즉각적인 피드백을 제공해야 합니다.
- 사용 컨텍스트(DM, 고객센터, Listening Party, LIVE)에 따라 적절한 Type과 Mode를 선택해야 합니다.

## Specification

### Properties

| Properties | Type | Description | Values |
| --- | --- | --- | --- |
| Mode | enum | OS 테마 연동 여부를 설정합니다. Default는 OS 테마에 따라 변경되고, Fixed는 OS 테마에 상관없이 다크 배경으로 표시됩니다. | Default, Fixed |
| Type | enum | 사용 컨텍스트를 정의합니다. DM에는 Fan/Artist 역할 구분이 있으며, Listening Party와 LIVE는 Fixed Mode에서만 사용됩니다. | DM, 고객센터, Listening Party, LIVE |
| State | enum | 채팅 필드의 입력 상태를 정의합니다. | Enabled, Focused, Typing, Entered, Disabled |
| Translation | boolean | 번역 아이콘 표시 여부. 인스턴스 속성. | On, Off |
| Left Icon | boolean | 좌측 아이콘 표시 여부. 최대 3개까지 표시 가능하며, Left Icon을 펼치고 숨길 수 있습니다. 인스턴스 속성. | On, Off |
| Save Button | boolean | 저장 버튼 표시 여부. 인스턴스 속성. | On, Off |
| Right Icon | boolean | 우측 아이콘 표시 여부. 최대 3개까지 표시 가능하며, Send Button이 나타나면 숨겨질 수 있습니다. 인스턴스 속성. | On, Off |
| Wing | boolean | Wing 아이콘 표시 여부. Left Icon과 동시에 존재할 수 없습니다. 좌측 아이콘 최대 2개 이상 노출 시 채팅 필드가 활성화 되면 노출됩니다. 인스턴스 속성. | On, Off |
| Icon Button | boolean | 아이콘 버튼 표시 여부. 인스턴스 속성. | On, Off |
| Icon | boolean | 아이콘 표시 여부. 인스턴스 속성. | On, Off |

## Guide

### Dimensions

Chatting Fields의 최대 높이값은 56px까지입니다. 최대 3줄까지 노출됩니다. 3줄 이상일 때 스크롤 시, 최상단 텍스트 위치 시 상단 패딩 6px, 최하단 텍스트 위치 시 하단 패딩 6px입니다. 최상단과 최하단이 아닌 스크롤 중에는 상하 패딩값은 노출되지 않습니다.

| Part | Size |
| --- | --- |
| Translation / Wing 터치 영역 | 20 × 32px |
| Left Icon 터치 영역 | 32 × 32px |
| Right Icon 터치 영역 | 32 × 32px |
| Save Button | 텍스트 길이에 따라 가변 (Flexible) |
| Border Radius | `system/size/radius/box/300` |

### Padding

| 항목 | 값 |
| --- | --- |
| 상하 외부 패딩 | `system/size/padding/box/100` |
| 좌우 외부 패딩 | `system/size/padding/box/200` |
| 상하 내부 패딩 (텍스트 기준) | `system/size/padding/box/100` |
| 상하 내부 패딩 (아이콘 기준) | `system/size/padding/box/75` |
| 좌우 내부 패딩 | `system/size/padding/box/200` |
| 아이콘 ↔ 텍스트 필드 간격 | `system/size/padding/box/100` |
| 요소 간 Inner Gap | `system/size/padding/box/100` |
| 내부 텍스트 영역 ↔ 아이콘 터치 영역 간격 | `system/size/padding/box/75` |
| 내부 아이콘 터치 영역 ↔ 아이콘 터치 영역 간격 | `system/size/padding/box/100` |

### Text Style

| 영역 | 텍스트 스타일 | Font Size | Line Height |
| --- | --- | --- | --- |
| 입력창 텍스트 | body-md / system-400 | 16px | 22 |
| Save Button | body-md / system-700 | 16px | 22 |

### Colors

#### Light/Dark Mode

| State | Part | Token | Light | Dark |
| --- | --- | --- | --- | --- |
| — | Translation 아이콘 | `system/color/icon/default` | #000000 | #FFFFFF |
| — | Left Icon | `system/color/icon/default` | #000000 | #FFFFFF |
| — | Wing 아이콘 | `system/color/icon/default` | #000000 | #FFFFFF |
| — | Icon | `system/color/icon/default` | #000000 | #FFFFFF |
| — | Right Icon | `system/color/icon/default` | #000000 | #FFFFFF |
| — | Save Button 텍스트 | `system/color/text/primary` | #00B8C1 | #01D5DF |
| — | Send Button | `system/color/button/default` | #00CBD5 | #01D5DF |
| — | Stroke (Enabled) | `system/color/status/focus-gray-400` | #AEB1B8 | #555555 |

Send Button의 컬러는 커뮤니티 색상(`system/color/button/default`)을 사용하며, 임의로 변경할 수 없습니다.

#### Fixed Mode

| State | Part | Token | Light | Dark |
| --- | --- | --- | --- | --- |
| — | Translation 아이콘 | `system/fixed_color/icon/default` | #FFFFFF | #FFFFFF |
| — | Left Icon | `system/fixed_color/icon/default` | #FFFFFF | #FFFFFF |
| — | Wing 아이콘 | `system/fixed_color/icon/default` | #FFFFFF | #FFFFFF |
| — | Icon | `system/fixed_color/icon/default` | #FFFFFF | #FFFFFF |
| — | Right Icon | `system/fixed_color/icon/default` | #FFFFFF | #FFFFFF |
| — | Save Button 텍스트 | `system/fixed_color/text/primary` | #01D5DF | #01D5DF |

Fixed Mode는 Listening Party, LIVE 컨텍스트에서 사용됩니다.

## Usage Do / Don't

### Send Button Color

**Do**

- 브랜드 일관성을 유지해야 하기 때문에, Send Button의 컬러는 (`system/color/button/default`)을 사용해야 한다.

**Don't**

- 고정된 값이기 때문에, Send Button의 컬러를 임의로 변경하지 않아야 한다.

### Stroke Color

**Do**

- 시스템 상태 피드백과 연결되어 있기 때문에, Enabled 상태의 stroke 컬러는 `system/color/status/focus-gray-400`을 사용해야 한다.

**Don't**

- stroke 컬러가 시스템 상태 피드백과 연결되어 있기 때문에, 다른 색상으로 변경하지 않아야 한다.

### Icon 사용

**Do**

- 아이콘 영역이 지정되어 있기 때문에, 지정된 아이콘을 TextField와 Right Icon 자리에 삽입해야 한다.

**Don't**

- Send Button 등장 시 Right Icon이 자동으로 사라지기 때문에, 두 요소가 동시에 표시되도록 설계하지 않아야 한다.

### Left Icon 제어

**Do**

- 컨텍스트에 따라 아이콘 노출을 제어할 수 있어야 하기 때문에, Left Icon을 필요에 따라 펼치고 숨기도록 설계해야 한다.

**Don't**

- Wing Icon과 Left Icon은 동시에 존재할 수 없기 때문에, 두 요소를 함께 사용하지 않아야 한다.

## Multi-line Behavior

입력 텍스트 줄 수에 따라 필드 높이가 유동적으로 변화하는 동작 규칙.

### 확장 규칙

| 상태 | 동작 |
| --- | --- |
| 1줄 | 기본 높이 유지, Border Radius `system/size/radius/box/300` 적용 |
| 2줄 | 필드 높이 자동 확장 |
| 3줄 이상 | 최대 3줄까지 확장 후 고정, 내부 스크롤 처리 |
| 최대 입력 | 100자 제한 |

### Transition

- Send Button은 입력 값이 있을 때 z값 최상위로 등장하며, 이때 TextField 너비가 줄어듭니다.
- Send Button 등장(In): Ease Out (Duration: 400ms), Opacity 0% → 100%
- Send Button 퇴장(Out): Ease In (Duration: 200ms), Opacity 100% → 0%
- Completed 상태를 유지한 채로 키보드가 내려옵니다.
- Text Field 클릭 시, Left Icon이 있을 경우 Left Icon이 Wing Icon으로 접히며 TextField가 늘어납니다.
- 2개 이상의 Left Icon은 Wing Icon으로 변경될 수 있으며, Wing Icon은 expand 역할을 합니다.
- Left Icon이 Wing Icon으로 변경될 때는 좌측 첫번째 아이콘 Position으로 Opacity 0%으로 변경됩니다.
- Wing Icon이 Left Icon으로 펼쳐질 때는 Left Icon 좌측 첫번째 아이콘 Position에서 각 Position으로 이동합니다.
- Text Field 클릭 시, Right Icon이 있을 경우 Right Icon을 밀어내며 TextField가 늘어납니다.
- Right Icon 중 가장 우측 요소의 위치는 고정이며, 각 아이콘 요소 Position 가장 우측으로 이동합니다. (Opacity: 100% → 0%)