# CDS / Components / Badge

# [V2] Badge

배지는 탐색 항목 및 아이콘에 대한 알림, 카운트 또는 상태 정보를 표시합니다.

## Principle

- 배지는 라벨이나 숫자를 포함할 수 있습니다.
- Number Badge의 라벨 내용은 "+"를 포함하여 최대 4자로 제한합니다.
- Dot Badge는 알림 또는 상태의 존재 여부만 전달할 때 사용합니다. 정확한 카운트가 필요한 경우 Number Badge를 사용합니다.
- Default 모드는 OS 테마에 따라 색상이 변경되며, Fixed 모드는 OS 테마에 관계없이 고정 다크 색상을 유지합니다.

## Specification

### Dot Badge Properties

| Properties | Type | Description | Values |
| --- | --- | --- | --- |
| Mode | enum | Default를 선택하면 OS테마 환경에 따라 변경되고, Fixed를 선택하면 OS 테마 환경에 상관없이 다크테마로 보여집니다. | Default, Fixed |
| Size | enum | Dot Badge의 사이즈를 정의합니다. | Small, Medium, Large |
| Outline | boolean | Dot Badge의 Outline 사용 여부를 정의합니다. | ON, OFF |

### Number Badge Properties

| Properties | Type | Description | Values |
| --- | --- | --- | --- |
| Mode | enum | Default를 선택하면 OS테마 환경에 따라 변경되고, Fixed를 선택하면 OS 테마 환경에 상관없이 다크테마로 보여집니다. | Default, Fixed |
| Type | enum | Number Badge의 타입을 정의합니다. | Number, New |
| Label | text | Number Badge 라벨을 입력할 수 있습니다. 인스턴스 속성. | (예: "Typing") |

## Guide

### Dimensions

Dot Badge와 Number Badge는 Size 축이 다르므로 별도로 기술합니다.

**Dot Badge**

| Size | Outline OFF | Outline ON |
| --- | --- | --- |
| Small | 4 × 4px | 6 × 6px |
| Medium | 6 × 6px | 8 × 8px |
| Large | 8 × 8px | 12 × 12px |

Outline ON 시 스트로크 두께: Small·Medium = 1px, Large = 2px. Radius = pill (100).

**Number Badge**

| Type | Size |
| --- | --- |
| Number | 39 × 16px |
| New | 16 × 16px |

Radius = 20. Number 라벨은 최대 4자("999+"). New 라벨은 "N" 고정.

### Padding

**Dot Badge**

패딩 없음.

**Number Badge**

| Type | 항목 | 값 |
| --- | --- | --- |
| Number | 좌우 내부 패딩 | `system/size/padding/box/50` |
| New | 좌우 내부 패딩 | 없음 |

### Colors

#### Light/Dark Mode

**Dot Badge**

| State | Part | Token | Light | Dark |
| --- | --- | --- | --- | --- |
| — | Fill (Mode=Default) | `system/color/status/danger-red` | #FE5B58 | #FE5B58 |
| — | Stroke (Mode=Default, Outline=ON) | `system/color/outline/default-reverse` | #FFFFFF | #000000 |

**Number Badge**

| State | Part | Token | Light | Dark |
| --- | --- | --- | --- | --- |
| — | Fill (Mode=Default) | `system/color/roles/negative` | #FE5B58 | #FE5B58 |
| — | Label (Mode=Default) | `system/color/text/white-same` | #FFFFFF | #FFFFFF |

#### Fixed Mode

**Dot Badge**

| State | Part | Token | Light | Dark |
| --- | --- | --- | --- | --- |
| — | Fill | `system/fixed_color/status/danger-red` | #FE5B58 | #FE5B58 |
| — | Stroke (Outline=ON) | `system/fixed_color/outline/default-reverse` | #000000 | #000000 |

**Number Badge**

| State | Part | Token | Light | Dark |
| --- | --- | --- | --- | --- |
| — | Fill | `system/fixed_color/roles/negative` | #FE5B58 | #FE5B58 |
| — | Label | `system/fixed_color/text/white-same` | #FFFFFF | #FFFFFF |

## Usage Do / Don't

### Badge 종류 선택

**Do**

- 알림의 존재 여부만 전달할 때는 Dot Badge를 사용해야 한다.
- 정확한 카운트 정보가 필요한 경우 Number Badge를 사용해야 한다.

**Don't**

- Dot Badge로 숫자 카운트를 대체하지 않아야 한다.

### 라벨 길이

**Do**

- Number Badge 라벨은 "+"를 포함하여 최대 4자 이내로 유지해야 한다. (예: "999+")

**Don't**

- 라벨 가독성이 저하되기 때문에, 5자 이상의 숫자나 텍스트를 Number Badge에 직접 표시하지 않아야 한다.

### 모드 선택

**Do**

- OS 테마 환경에 맞게 표시하려면 Default 모드를 사용해야 한다.
- 테마와 관계없이 항상 다크 색상으로 유지해야 하는 경우 Fixed 모드를 사용해야 한다.

**Don't**

- OS 테마 환경을 고려하지 않고 Fixed 모드를 임의로 사용하지 않아야 한다.

## Component

Badge는 Dot Badge와 Number Badge 두 가지 컴포넌트로 구성됩니다.

- Dot Badge: 상태 알림을 점 형태로 표시합니다.
- Number Badge: 숫자 또는 "New" 텍스트로 알림 카운트를 표시합니다.
