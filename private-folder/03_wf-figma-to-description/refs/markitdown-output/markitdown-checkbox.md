# CDS / Components / Check Box

# [V2] Check Box

체크박스는 사용자에게 특정 내용을 확인받는 상황에서 사용합니다.

- 여러 옵션을 선택할 수 있는 경우 사용합니다.
- 선택된 체크박스가 더 강조돼야 합니다.
- 기본 체크박스는 Circle입니다.
- Square Check Box는 List Item에서 사용합니다.

## Component

### Mode

| Mode | Description |
| --- | --- |
| Light/Dark | 시스템 테마 환경에 따라 변경되는 기본 모드입니다. |
| Fixed | OS 테마 환경에 상관없이 다크테마로 보여지는 모드입니다. |

### Guide

| Guide | Value |
| --- | --- |
| Padding System : Check Box + Text | 6 |
| Padding System : Check Mark + Text | 6 |

예시 텍스트: 텍스트를 입력해주세요

## Properties

| Properties | Description | Values |
| --- | --- | --- |
| Mode | Default를 선택하면 OS테마 환경에 따라 변경되고, Fixed를 선택하면 OS 테마 환경에 상관없이 다크테마로 보여집니다. | Default, Fixed |
| Type | 체크박스의 형태를 정의합니다. | Circle, Square |
| Status | 체크박스의 상태값을 정의합니다. | Default, Enabled, Disabled |

## Usage Do / Don't

### Selection Model

Do

- 여러 항목을 0개부터 전체까지 선택할 수 있을 때 Check Box를 사용해야 한다.
- 단일 항목의 동의, 승인, 확인에는 Check Box를 사용해야 한다.

Don't

- 여러 옵션 중 하나만 고르는 선택에 Check Box를 사용하지 않아야 한다. (선택 모델)
- 독립적으로 해제 가능한 Yes/No 결정을 Radio로 대체하지 않아야 한다. (해제 가능성)

### Shape

Do

- 기본 Check Box는 Circle 타입을 사용해야 한다.
- Square 타입은 List Item처럼 지정된 맥락에서만 사용해야 한다.

Don't

- Square와 Circle을 같은 선택 그룹 안에서 임의로 혼용하지 않아야 한다. (일관성)

### Selected State

Do

- 선택된 항목은 Enabled 상태로 명확하게 강조해야 한다.
- 하위 리스트의 체크 표시는 `ic_check_xsmall`을 사용해야 한다.

Don't

- Default 상태에 회색 check icon을 노출하지 않아야 한다. (상태 오인)
- 상위 항목의 상태와 하위 항목의 상태를 불일치하게 두지 않아야 한다. (계층 혼란)
