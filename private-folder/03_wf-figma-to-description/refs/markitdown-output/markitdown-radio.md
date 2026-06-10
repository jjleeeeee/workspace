# CDS / Components / Radio

# [V2] Radio

라디오는 단일 선택이 필요한 상황에서 사용합니다.

- 목록에서 하나의 항목만 선택해야 하는 경우에 사용합니다.
- 선택된 라디오가 더 강조돼야 합니다.

## Component

### Mode

| Mode | Description |
| --- | --- |
| Light/Dark | 시스템 테마 환경에 따라 변경되는 기본 모드입니다. |
| Fixed | OS 테마 환경에 상관없이 다크테마로 보여지는 모드입니다. |

### Guide

| Guide | Value |
| --- | --- |
| Padding System : Radio + Text | 6 |

예시 텍스트: 텍스트를 입력해주세요

## Case

Figma `2. Case` 노드는 Light/Dark와 Fixed 모드 각각에서 Default, Enabled, Disabled 상태를 비교합니다.
모든 상태의 컴포넌트 영역은 24px이며, 외곽 원형 지름은 22px입니다.
- Enabled 상태는 선택 영역인 `Shape`와 안쪽 원인 `inner-shape`로 구성됩니다.
- `inner-shape`는 Disabled 상태의 `Inner circle`과 같은 의미의 내부 원형 파트이며, 선택 표시 전체를 뜻하는 `Selected mark`로 묶지 않습니다.

### Common Size

| Item | Value |
| --- | ---: |
| Component | 24 |
| Outline diameter | 22 |
| Inner diameter | 8 |

### Light/Dark

| Status | Part | Token / Value |
| --- | --- | --- |
| Default | Outline | `system/color/outline/default-200a`, `stroke : 1` |
| Enabled | Shape | `system/color/status/active-primary` |
| Enabled | Inner circle | `system/color/surface/default` |
| Disabled | Outline | `system/color/outline/default-200a`, `stroke : 1` |
| Disabled | Background | `system/color/surface/default-reverse-100a` |
| Disabled | Inner circle | `system/color/surface/default-reverse-200a` |

### Fixed

| Status | Part | Token / Value |
| --- | --- | --- |
| Default | Outline | `system/fixed_color/outline/default-200a`, `stroke : 1` |
| Enabled | Shape | `system/fixed_color/status/active-primary` |
| Enabled | Inner circle | `system/fixed_color/surface/default-reverse` |
| Disabled | Outline | `system/fixed_color/outline/default-reverse-200a`, `stroke : 1` |
| Disabled | Background | `system/fixed_color/surface/default-100a` |
| Disabled | Inner circle | `system/fixed_color/surface/default-reverse-200a` |

## Properties

| Properties | Description | Values |
| --- | --- | --- |
| Mode | Default를 선택하면 OS테마 환경에 따라 변경되고, Fixed를 선택하면 OS 테마 환경에 상관없이 다크테마로 보여집니다. | Default, Fixed |
| Status | Radio의 상태값을 정의합니다. | Default, Enabled, Disabled |

## Usage Do / Don't

### Selection Model

Do

- 여러 항목 중 하나만 선택해야 할 때 Radio를 사용해야 한다.
- 같은 선택 그룹 안에서는 동일한 control 타입을 사용해야 한다.

Don't

- 복수 선택 가능한 옵션에 Radio를 사용하지 않아야 한다. (선택 모델)
- Radio와 Check Box를 같은 선택 그룹 안에서 함께 사용하지 않아야 한다. (일관성)

### Default Selection

Do

- 가장 권장되거나 일반적인 옵션을 기본값으로 선택해야 한다.

Don't

- Radio group을 모두 미선택 상태로 노출하지 않아야 한다. (결정 부담)

### Independent Consent

Do

- 독립적인 동의, 승인, 확인은 Check Box를 사용해야 한다.

Don't

- 단일 Yes/No 의사결정에 Radio를 사용하지 않아야 한다. (해제 가능성)

### Default State

Do

- 선택 전 상태는 채워지지 않은 빈 원으로 표시해야 한다.

Don't

- 선택 전 상태에 dot을 표시하지 않아야 한다. (상태 오인)
