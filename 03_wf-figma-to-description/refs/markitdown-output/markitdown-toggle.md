# CDS / Components / Toggle

# [Usage] Toggle (Switch)

Toggle은 스위치를 ON/OFF 하여 설정값을 즉시 변경하기 위해 사용하는 스위치 컴포넌트입니다.

## Context

Toggle은 사용자가 선택 즉시 상태를 바꾸는 설정에 사용해야 합니다. 플랫폼에 따라 iOS와 AOS 타입을 구분하고, Default, Enabled, Disabled 상태를 명확히 적용해야 합니다. 별도의 저장 버튼이나 확인 절차가 필요한 선택에는 Toggle을 사용하지 않아야 하며, 단일 동의나 확인에는 Checkbox를 사용해야 합니다.

## Principle

- 상태 변경 결과가 즉시 반영되어야 합니다.
- 플랫폼에 맞춰 iOS 또는 AOS 타입을 사용해야 합니다.
- ON/OFF와 Default, Enabled, Disabled 상태를 컬러와 위치로 명확히 구분해야 합니다.
- 설정 항목의 라벨은 Toggle이 무엇을 바꾸는지 설명해야 합니다.

## Usage Do / Don't

### Type

Do

- 플랫폼 맥락에 맞춰 iOS 또는 AOS 타입을 사용해야 합니다.

Don't

- 같은 플랫폼 화면 안에서 iOS와 AOS 타입을 임의로 섞지 않아야 합니다. (플랫폼 패턴 혼동)

### 즉시 변경

Do

- 사용자가 스위치를 조작하면 설정이 즉시 변경되어야 합니다.

Don't

- 별도 저장이 필요한 설정에 Toggle을 사용하지 않아야 합니다. (상태 반영 시점 혼동)

### Color

Do

- Toggle의 색상은 지정된 색상으로만 사용해야 합니다.

Don't

- Toggle을 커뮤니티 색상으로 변경하지 않아야 합니다. (상태 의미 혼동)

### Status

Do

- 설정의 조작 가능성에 따라 Default, Enabled, Disabled 상태를 구분해 노출해야 합니다.

Don't

- 조작할 수 없는 항목을 Enabled처럼 보이게 하지 않아야 합니다. (조작 가능성 오인)

### Label

Do

- Toggle이 바꾸는 설정을 라벨에서 명확히 설명해야 합니다.

Don't

- ON/OFF만 보고 의미를 추측하게 만들지 않아야 합니다. (설정 의미 불명확)
