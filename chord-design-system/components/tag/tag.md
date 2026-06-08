# CDS / Components / Tag

# Tag

콘텐츠의 속성, 카테고리, 상태를 짧은 키워드로 식별하는 정보 표시 컴포넌트

## Principle

- 태그 내 텍스트는 핵심 키워드 위주로 짧고 명확하게 유지합니다.
- 정의된 시스템 컬러 토큰만 사용하며, 임의 수정을 금지합니다.
- 동일 맥락 내에서는 태그 형태와 사이즈를 통일합니다.

## Specification

### Properties

| Properties | Type | Description | Values |
| --- | --- | --- | --- |
| Size | enum | Tag의 사이즈를 정의합니다. | Small, Medium |
| Type | enum | Tag의 타입을 정의합니다. | Fill, Line |
| Shape | enum | Tag의 모양을 정의합니다. | Squircle, Round |
| Color | enum | Tag의 컬러를 정의합니다. | Primary, Secondary-Blue, Secondary-Green, Secondary-Purple, Secondary-Pink, Gray, White, Red, Membership-Malachite-Green, Membership-Lavender, Membership-Cornflower-Blue, LIVE Red |
| Show Icon | boolean | Tag의 아이콘 노출 여부를 정의합니다. | On, Off |

> **예외 케이스:** LIVE Red는 Size=Small, Type=Fill, Shape=Squircle 조합에서만 존재합니다. 총 89개 Variant.

## Guide

### Size

| Size | Height | Squircle Radius | Round Radius |
| --- | --- | --- | --- |
| Small | 16px | 4px | 24px |
| Medium | 20px | 6px | 24px |

### Padding

| Size | 좌우 내부 패딩 | Inner Gap |
| --- | --- | --- |
| Small | `system/size/padding/box/50` | `system/size/padding/box/25` |
| Medium | `system/size/padding/box/75` | `system/size/padding/box/25` |

- Show Icon=Off 시 아이콘 영역과 2px gap이 함께 제거됩니다.
- 텍스트는 Short single-line 유지합니다.

### Colors

Tag는 모든 컬러가 `system/fixed_color` 토큰 기반입니다. Light/Dark 값이 동일합니다.

#### Color Token Map

| Color | Token | Light | Dark |
| --- | --- | --- | --- |
| Primary | `system/fixed_color/roles/primary` | `#01D5DF` | `#01D5DF` |
| Secondary-Blue | `system/fixed_color/roles/secondary-blue` | `#5989FE` | `#5989FE` |
| Secondary-Green | `system/fixed_color/roles/secondary-green` | `#00CC96` | `#00CC96` |
| Secondary-Purple | `system/fixed_color/roles/secondary-purple` | `#B864FA` | `#B864FA` |
| Secondary-Pink | `system/fixed_color/roles/secondary-pink` | `#F562C6` | `#F562C6` |
| Gray | `system/fixed_color/text/gray-500` | `#777777` | `#777777` |
| White | `system/fixed_color/text/default` | `#FFFFFF` | `#FFFFFF` |
| Red | `system/fixed_color/roles/negative` | `#FE5B58` | `#FE5B58` |
| LIVE Red | `system/fixed_color/roles/negative` | `#FE5B58` | `#FE5B58` |
| Membership-Malachite-Green | `system/fixed_color/roles/membership-malachite-green` | `#1BBD49` | `#1BBD49` |
| Membership-Lavender | `system/fixed_color/roles/membership-lavender` | `#A74EFF` | `#A74EFF` |
| Membership-Cornflower-Blue | `system/fixed_color/roles/membership-cornflower-blue` | `#36A3DF` | `#36A3DF` |

#### Type별 적용 규칙

| Type | Part | Token | Opacity |
| --- | --- | --- | --- |
| Fill | BG | Color Token (위 표) | 85% |
| Fill | Text | `system/fixed_color/text/default` (`#FFFFFF`) | 100% |
| Line | Stroke | Color Token (위 표) | 40% |
| Line | Text | Color Token (위 표) | 100% |

> **LIVE Red 예외:** Type=Fill BG opacity는 85%가 아닌 100%입니다.

## Usage Do / Don't

### 컬러 사용

Do

- `system/fixed_color/roles` 컬러는 단일 케이스만 사용해야 하기 때문에, 동일 맥락에서 컬러는 한 가지만 사용해야 한다.
- 임의 Gray 값은 DS 규격을 벗어나기 때문에, Gray는 `system/fixed_color/text/gray-500` 토큰만 사용해야 한다.

Don't

- 컬러를 두 가지 이상 혼용하면 시각적 계층이 무너지기 때문에, 동일 맥락에서 Tag 컬러를 두 가지 이상 혼용하지 않아야 한다.
- 불투명한 배경에서 텍스트 가시성을 보장해야 하기 때문에, 배경과 대비가 약해져 텍스트가 흐릿하게 보이지 않도록 해야 한다.

### 형태와 크기

Do

- 각 Shape의 일관성을 유지해야 하기 때문에, Squircle(Small 4px, Medium 6px)과 Round(24px) 지정 Radius 값을 사용해야 한다.
- 동일 맥락에서 시각적 통일성을 위해, 태그 형태(Type, Shape)와 사이즈를 통일해야 한다.

Don't

- 임의로 Radius 값을 조정하면 DS 규격을 벗어나기 때문에, Radius 값을 임의로 조정하지 않아야 한다.
- Small과 Medium을 동일 맥락에서 임의로 혼용하지 않아야 한다.

### 아이콘

Do

- DS 아이콘 에셋과의 정합성을 위해, 지정된 아이콘 크기 tiny(10px)를 사용해야 한다.

Don't

- 임의로 아이콘 크기를 조정하면 시각적 균형이 깨지기 때문에, 아이콘 크기를 임의로 조정하지 않아야 한다.
- Tag 아이콘 영역을 텍스트 콘텐츠로 대체하지 않아야 한다.

### 콘텐츠

Do

- 정보 과부하를 방지하기 위해, Tag 내 텍스트는 짧은 키워드로 유지해야 한다.

Don't

- 설명형 문장은 Tag의 역할과 맞지 않기 때문에, Tag 내에 문장 형태의 텍스트를 넣지 않아야 한다.
- Tag가 선택 가능한 옵션 역할을 해야 하는 경우 Chips를 사용해야 한다.
