# CDS / Components / Radio

# [V2] Radio

여러 항목 중 하나만 선택해야 하는 상황에서 사용하는 단일 선택 컨트롤.

## Principle

- 사용자가 목록 내에서 하나의 항목만 선택해야 하는 경우에 사용합니다.
- 여러 항목 중 가장 권장되거나 일반적인 옵션을 기본값으로 선택된 상태로 제공합니다.
- 라디오 버튼과 텍스트 간 Padding을 준수합니다.
- Enabled 상태에서 dot(점)을 노출하지 않습니다.

## Specification

### Properties

| Properties | Type | Description | Values |
| --- | --- | --- | --- |
| Mode | enum | Default를 선택하면 OS 테마 환경에 따라 변경되고, Fixed를 선택하면 OS 테마 환경에 상관없이 다크테마로 보여집니다. | Default, Fixed |
| State | enum | Radio의 상태값을 정의합니다. Enabled는 미선택, Selected는 선택, Disabled는 비활성입니다. | Enabled, Selected, Disabled |

## Guide

### Dimensions

Radio는 Size 축 없이 고정 사이즈로 제공됩니다.

| Part | Size |
| --- | --- |
| Component | 24 × 24px |
| Outline 지름 | 22px |
| Outline Stroke | 1px |
| Inner circle 지름 | 8px |

### Padding

| 항목 | 값 |
| --- | --- |
| Radio ↔ 텍스트 간격 | `system/size/padding/box/75` |

### Colors

#### Light/Dark Mode

| State | Part | Token | Light | Dark |
| --- | --- | --- | --- | --- |
| Enabled / Disabled | Outline stroke | `system/color/outline/default-200a` | #00000033 | #FFFFFF33 |
| Selected | Shape fill | `system/color/status/active-primary` | #00CBD5 | #01D5DF |
| Selected | Inner circle fill | `system/color/surface/default` | #FFFFFF | #000000 |
| Disabled | Outline fill | `system/color/surface/default-reverse-100a` | #0000001A | #FFFFFF1A |
| Disabled | Inner circle fill | `system/color/surface/default-reverse-200a` | #00000033 | #FFFFFF33 |

#### Fixed Mode

| State | Part | Token | Light | Dark |
| --- | --- | --- | --- | --- |
| Enabled / Disabled | Outline stroke | `system/fixed_color/outline/default-200a` | #FFFFFF33 | #FFFFFF33 |
| Selected | Shape fill | `system/fixed_color/status/active-primary` | #01D5DF | #01D5DF |
| Selected | Inner circle fill | `system/fixed_color/surface/default-reverse` | #FFFFFF | #FFFFFF |
| Disabled | Outline fill | `system/fixed_color/surface/default-reverse-100a` | #FFFFFF1A | #FFFFFF1A |
| Disabled | Inner circle fill | `system/fixed_color/surface/default-reverse-200a` | #FFFFFF33 | #FFFFFF33 |

## Usage Do / Don't

### Selection Model

**Do**

- 다수의 항목 중 정확히 하나만 선택해야 하는 단일 선택 상황이기 때문에, Radio를 사용해야 한다.
- 동일한 선택 그룹 내에서 동일한 컨트롤 타입을 사용해야 하기 때문에, 같은 그룹 안에서는 Radio만 사용해야 한다.

**Don't**

- 복수 선택이 가능한 옵션에서는 선택 모델이 다르기 때문에, Radio 대신 Check Box를 사용해야 한다.
- Radio와 Check Box는 선택 모델이 다르기 때문에, 같은 선택 그룹에서 Radio와 Check Box를 혼용하지 않아야 한다.

### Default Selection

**Do**

- 항상 하나의 항목이 기본값으로 선택되어 있어야 하기 때문에, Radio 그룹에서 모든 항목이 미선택된 상태로 노출하지 않아야 한다.
- 가장 권장되거나 일반적인 옵션을 기본값으로 설정해야 하기 때문에, 대표 옵션을 Selected 상태로 미리 선택해야 한다.

**Don't**

- 선택 방향을 안내하지 못하기 때문에, Radio 그룹의 모든 항목을 미선택 상태로 노출하지 않아야 한다.

### Selected State

**Do**

- 선택된 라디오가 더 강조돼야 하기 때문에, Selected 상태의 항목을 명확하게 시각적으로 강조해야 한다.
- 선택 전 상태는 사용자가 빈 원으로 인식해야 하기 때문에, Enabled 상태에서는 채워지지 않은 빈 원으로 표시해야 한다.

**Don't**

- 상태 오인을 방지하기 위해, Enabled 상태에 dot(점)을 노출하지 않아야 한다.
