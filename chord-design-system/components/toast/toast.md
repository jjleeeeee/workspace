# CDS / Components / Toast

# [V2] Toast

사용자가 수행한 작업에 대한 피드백을 제공하며, 일정 시간이 지나면 자동으로 사라지는 시스템 상태 알림 컴포넌트

## Principle

- 오류, 완료, 진행상태 메세지와 같은 시스템 상태 알림 텍스트를 제공합니다.
- 아이콘이나 버튼은 사용하지 않습니다.
- 일정 시간이 지나면 자동으로 사라집니다. 기본 노출 시간은 3초이며 텍스트 줄 수에 따라 다르게 설정됩니다.
- 간결한 문장으로 메세지를 전달하여 사용자 흐름을 방해하지 않아야 합니다.

## Specification

### Properties

| Properties | Type | Description | Values |
| --- | --- | --- | --- |
| Mode | enum | 토스트의 테마 모드를 정의합니다. Default는 OS 테마에 따라 변경되고, Fixed는 OS 테마에 상관없이 다크테마로 표시됩니다. | Default, Fixed |
| Label | text | 토스트에 표시할 상태 메세지 텍스트입니다. | (예: "Translate it into the following language.") |

## Guide

### Dimensions

| Part | Size |
| --- | --- |
| Container (sample) | 293 × 42px |

- 컨테이너 너비는 텍스트 길이에 맞게 늘어납니다 (Hug Contents).
- 모바일 최대 너비: Screen Width − 좌/우 마진 10px
- 태블릿/PC 최대 너비: 410px
- 최대 너비 도달 시 자동 줄바꿈. 320 해상도 기준 최대 2줄까지 표시되며 초과 시 말줄임 처리됩니다.

### Padding

| 항목 | 값 |
| --- | --- |
| 상하 내부 패딩 | `system/size/padding/box/150` |
| 좌우 내부 패딩 | Flexible (최대 `system/size/padding/box/200`) |
| 좌우 외부 패딩 | 10px |
| Toast ↔ Bottom Navigation 간격 | `system/size/padding/box/250` |

- Container Radius: `system/size/radius/box/100`
- 텍스트는 중앙정렬로 노출됩니다.

### Colors

#### Light/Dark Mode

| State | Part | Role | Token | Light | Dark |
| --- | --- | --- | --- | --- | --- |
| — | Container | Fill (opacity 80%) | `system/color/surface/default-reverse-600a-unequal` | #000000CC | #333333 |
| — | Label | Text | `system/fixed_color/text/default` | #FFFFFF | #FFFFFF |

#### Fixed Mode

| State | Part | Role | Token | Light | Dark |
| --- | --- | --- | --- | --- | --- |
| — | Container | Fill | `system/fixed_color/surface/gray-200` | #333333 | #333333 |
| — | Label | Text | `system/fixed_color/text/default` | #FFFFFF | #FFFFFF |

- Typography: `body-xs/system-400` (WeGothicSans 14px / Regular / Line Height 18px)

## Usage Do / Don't

### 노출 위치

Do

- 사용자 흐름을 방해하지 않기 위해, 화면 하단에서 노출되며 일정 시간이 지난 후 자동으로 사라져야 한다.

Don't

- 팝업처럼 사용자 행동을 차단하면 토스트 본래 목적에 어긋나기 때문에, 사용자 액션을 막는 방식으로 사용하지 않아야 한다.

### 노출 요소

Do

- 메세지를 빠르게 전달하기 위해, 텍스트만으로 간결하게 정보를 전달해야 한다.

Don't

- 토스트는 텍스트 전용 컴포넌트이기 때문에, 아이콘이나 버튼을 사용하지 않아야 한다.

### 너비와 줄바꿈

Do

- 레이아웃 규칙을 따르기 위해, 텍스트가 길어져 최대 너비에 도달할 경우 자동으로 줄바꿈해야 한다.

Don't

- 시각적 정합성을 유지해야 하기 때문에, 최대 너비에 도달하지 않은 채 임의로 줄바꿈을 적용하지 않아야 한다.
- 레이아웃 규칙을 벗어나기 때문에, 토스트 너비가 최대 너비를 초과하지 않아야 한다.

### 텍스트 정렬

Do

- 토스트의 기본 레이아웃 규칙에 따라, 텍스트는 중앙정렬로 입력해야 한다.

Don't

- 토스트 텍스트는 중앙정렬이 원칙이기 때문에, 좌측 또는 우측 정렬로 입력하지 않아야 한다.

## Interaction

플랫폼별 노출 시간과 전환 애니메이션 정의.

### Transition 공통

- In: 화면 하단 영역 밖에서 위쪽 (Y축 기준)으로 이동하며, opacity가 0%에서 100%로 변경되어 나타납니다.
- Out: 노출된 위치에서 아래쪽 (Y축 기준)으로 화면 하단 영역 밖까지 이동하며, opacity가 100%에서 0%로 변경되어 사라집니다.
- Placement: 모든 콘텐츠의 최상단 레이어 (Z축)에 위치합니다. 단, 홈 인디케이터나 GNB가 있을 경우 그 영역 뒤에서 등장합니다.

### iOS

| Transition | Property | Values |
| --- | --- | --- |
| In | iOS system | — |
| Display (22자 이하) | Duration | 3000ms (3sec) |
| Display (22자 이상) | Duration | 4000ms (4sec) |
| Out | iOS system | — |

- Transition은 iOS 시스템 정의를 따릅니다.
- 기본 노출 시간은 3sec (In/Out 시간 제외).
- 필요 시 작업자 판단에 따라 10sec 이내로 설정 가능합니다. (가이드 작업 시 별도 표기 필요)

### Android

| Transition | Property | Values |
| --- | --- | --- |
| In | Android system | — |
| Display (15자 이하) | Duration | 2000ms (Short, 2sec) |
| Display (16자 이상) | Duration | 3500ms (Long, 3.5sec) |
| Out | Android system | — |

- Transition은 Android 시스템 정의를 따릅니다.
- 기본 노출 시간은 Short(2sec). 텍스트 수가 늘어나면 Long(3.5sec)으로 변경됩니다.
- 필요 시 작업자 판단에 따라 Short/Long으로 설정 가능합니다. (가이드 작업 시 별도 표기 필요)

### Web

| Transition | Property | Values |
| --- | --- | --- |
| In | motion | Ease Out 400ms (0.4sec) |
| Display | Duration | 3500ms (3.5sec) |
| Out | motion | Ease In 200ms (0.2sec) |

- WEB 노출 시간은 텍스트 수와 관계없이 3.5초입니다.
- In/Out 애니메이션은 공통 디자인 규칙을 따릅니다.

### 반복 노출

**타 기능 실행으로 인한 반복 노출**

- 기존 토스트와 다른 성격의 새로운 알림이 발생했을 때의 인터랙션입니다.
- 다른 성격의 새로운 알림이 발생하면, 기존 토스트는 정해진 시간을 다 채우지 못하더라도 다음 토스트가 호출되는 순간 사라집니다.
- 기존 토스트는 위치 이동 없이 그 자리에서 opacity 0%로 투명해지며 사라집니다.

**동일 기능 실행으로 인한 반복 노출**

- 사용자가 같은 동작을 여러 번 반복하여 동일한 토스트가 계속 호출될 때의 인터랙션입니다.
- 노출시간이 끝나기 전 동일한 동작을 여러 번 반복할 경우, 새로운 토스트를 별도 생성하지 않고 현재 노출된 위치에서 노출 시간만 다시 카운팅합니다.
- 마지막 호출 기준으로 카운트가 끝나면, 화면 아래 방향(Y축 기준)으로 사라지며 종료됩니다.
