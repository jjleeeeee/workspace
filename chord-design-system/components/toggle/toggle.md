# CDS / Components / Toggle

# [V2] Toggle Switch

설정값을 ON/OFF로 즉시 변경하는 플랫폼별 스위치 컨트롤입니다.

## Principle

- 설정이 변경된 즉시 적용되어야 할 때 Toggle을 사용합니다.
- iOS / AOS 플랫폼 환경에 맞는 OS 변형을 선택합니다.
- 변경되는 설정이 무엇인지 설명하는 레이블과 함께 사용합니다.
- 별도의 저장 또는 확인 단계가 필요한 경우에는 사용하지 않습니다.

## Specification

### Properties

| Properties | Type | Description | Values |
| --- | --- | --- | --- |
| Mode | enum | Default를 선택하면 OS 테마 환경에 따라 변경되고, Fixed를 선택하면 OS 테마에 상관없이 다크테마로 보여집니다. | Default, Fixed |
| OS | enum | 플랫폼별 Track과 Thumb 형태를 선택합니다. | iOS, AOS |
| Size | enum | 스위치의 전체 크기를 선택합니다. | Medium, Small |
| Status | enum | 스위치의 상태를 선택합니다. Default는 OFF, Enabled는 ON, Disabled는 비활성 OFF입니다. | Default, Enabled, Disabled |

> **예외 케이스:** Mode, OS, Size, Status 모든 조합이 유효합니다. 총 24개 Variant.

## Guide

### Dimensions

**iOS**

| Size | Track | Thumb | Thumb Inset | Radius |
| --- | --- | --- | --- | --- |
| Medium | 52 × 32px | 28 × 28px | 2px | 100px |
| Small | 32 × 20px | 16 × 16px | 2px | 100px |

**AOS**

| Size | Track | Thumb | Thumb Inset | Radius |
| --- | --- | --- | --- | --- |
| Medium | 52 × 32px | 24 × 24px | 4px | 100px |
| Small | 34 × 20px | 14 × 14px | 3px | 62.5px |

Thumb 위치: Default·Disabled → 왼쪽, Enabled → 오른쪽.

### Colors

**Track**

#### Light/Dark Mode

| State | Part | Token | Light | Dark |
| --- | --- | --- | --- | --- |
| Default | Track | system/color/surface/gray-200 | #DCDEE4 | #333333 |
| Enabled | Track | system/color/status/active-primary | #00CBD5 | #01D5DF |
| Disabled | Track | system/color/status/inactive-gray | #DCDEE4 | #3E3E3E |

#### Fixed Mode

| State | Part | Token | Light | Dark |
| --- | --- | --- | --- | --- |
| Default | Track | system/fixed_color/surface/gray-200 | #333333 | #333333 |
| Enabled | Track | system/fixed_color/status/active-primary | #01D5DF | #01D5DF |
| Disabled | Track | system/fixed_color/status/inactive-gray | #3E3E3E | #3E3E3E |

**Thumb**

Thumb 토큰은 Mode에 관계없이 동일합니다.

| State | Part | Token | Light | Dark |
| --- | --- | --- | --- | --- |
| Default, Enabled | Thumb | system/fixed_color/surface/default-reverse | #FFFFFF | #FFFFFF |
| Disabled | Thumb | system/fixed_color/surface/default-reverse-300a | #FFFFFF4D | #FFFFFF4D |

## Usage Do / Don't

### 사용 맥락

Do

- 설정이 토글 즉시 적용되는 경우 Toggle을 사용해야 한다.
- 변경되는 설정이 무엇인지 설명하는 레이블과 함께 사용해야 한다.

Don't

- 별도의 저장 또는 확인 단계가 필요한 경우 Toggle을 사용하지 않아야 한다.
- 단일 동의나 확인에는 Toggle 대신 Checkbox를 사용해야 한다.

### OS 선택

Do

- 플랫폼 환경에 맞는 OS 변형(iOS / AOS)을 사용해야 한다.

Don't

- 하나의 플랫폼 화면 안에서 iOS와 AOS Toggle을 혼용하지 않아야 한다.

### 컬러

Don't

- 정의된 토큰 외의 커스텀 컬러로 Toggle을 변경하지 않아야 한다.
