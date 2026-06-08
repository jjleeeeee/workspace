# CDS / Components / Check Box

# [V2] Check Box

단일 확인 또는 복수 항목 선택에 사용하는 선택 컨트롤.

## Principle

- 여러 옵션을 선택할 수 있는 경우 Check Box를 사용합니다.
- 기본 형태는 Circle이며, Square는 List Item 맥락에서만 사용합니다.
- 선택된 항목(Selected)은 명확하게 강조해야 합니다.
- Enabled 상태에서 check icon을 노출하지 않습니다.

## Specification

### Properties

| Properties | Type | Description | Values |
| --- | --- | --- | --- |
| Mode | enum | Default를 선택하면 OS테마 환경에 따라 변경되고, Fixed를 선택하면 OS 테마 환경에 상관없이 다크테마로 보여집니다. | Default, Fixed |
| Type | enum | 체크박스의 형태를 정의합니다. Circle은 기본형, Square는 List Item 맥락 전용입니다. | Circle, Square |
| State | enum | 체크박스의 상태값을 정의합니다. Enabled는 미선택, Selected는 선택, Disabled는 비활성입니다. | Enabled, Selected, Disabled |

## Guide

### Dimensions

Check Box는 Size 축 없이 고정 사이즈로 제공됩니다.

| Part | Size |
| --- | --- |
| Component | 24 × 24px |
| Box | 22 × 22px |
| Icon area | 16 × 16px |

### Padding

| 항목 | 값 |
| --- | --- |
| Check Box_circle ↔ 텍스트 간격 | `system/size/padding/box/75` |
| Check Box_square ↔ 텍스트 간격 | `system/size/padding/box/75` |

### Colors

#### Light/Dark Mode

| State | Part | Token | Light | Dark |
| --- | --- | --- | --- | --- |
| Enabled | Box stroke | `system/color/outline/default-200a` | #00000033 | #FFFFFF33 |
| Selected | BG fill | `system/color/roles/primary` | #00CBD5 | #01D5DF |
| Selected | Check icon | `system/color/icon/default-reverse` | #FFFFFF | #000000 |
| Disabled | BG fill | `system/color/surface/default-reverse-100a` | #0000001A | #FFFFFF1A |
| Disabled | Check icon | `system/color/icon/200a` | #00000033 | #FFFFFF33 |

#### Fixed Mode

| State | Part | Token | Light | Dark |
| --- | --- | --- | --- | --- |
| Enabled | Box stroke | `system/fixed_color/outline/default-200a` | #FFFFFF33 | #FFFFFF33 |
| Selected | BG fill | `system/fixed_color/roles/primary` | #01D5DF | #01D5DF |
| Selected | Check icon | `system/fixed_color/icon/default-reverse` | #000000 | #000000 |
| Disabled | BG fill | `system/fixed_color/surface/default-reverse-100a` | #FFFFFF1A | #FFFFFF1A |
| Disabled | Check icon | `system/fixed_color/icon/200a` | #FFFFFF33 | #FFFFFF33 |

- Selected, Disabled 상태에서만 check icon을 표시합니다. Enabled 상태에서는 노출 금지.
- Check icon 에셋: `24/em/ic_check_medium` (16 × 16px).

## Usage Do / Don't

### Selection Model

Do

- 사용자가 0개부터 전체까지 자유롭게 선택할 수 있어야 하기 때문에, 복수 선택이 가능한 경우 Check Box를 사용해야 한다.
- 단일 항목의 동의, 승인, 확인이 필요한 경우에도 Check Box를 사용해야 한다.

Don't

- 여러 옵션 중 하나만 고르는 선택은 선택 모델이 다르기 때문에, Check Box 대신 Radio를 사용해야 한다.
- 독립적으로 해제 가능한 Yes/No 결정에 Radio를 사용하지 않아야 한다.

### Shape

Do

- 기본 Check Box는 Circle 타입을 사용해야 한다.
- Square 타입은 List Item처럼 지정된 맥락에서만 사용해야 한다.

Don't

- 시각적 일관성이 깨지기 때문에, Square와 Circle을 같은 선택 그룹 안에서 임의로 혼용하지 않아야 한다.

### Selected State

Do

- 사용자가 선택 상태를 즉각 인지할 수 있어야 하기 때문에, Selected 상태로 선택된 항목을 명확하게 강조해야 한다.
- 하위 리스트의 체크 표시는 `ic_check_xsmall`을 사용해야 한다.

Don't

- 상태 오인을 방지하기 위해, Enabled 상태에 check icon을 노출하지 않아야 한다.
- 계층 혼란을 방지하기 위해, 상위 항목의 상태와 하위 항목의 상태를 불일치하게 두지 않아야 한다.
