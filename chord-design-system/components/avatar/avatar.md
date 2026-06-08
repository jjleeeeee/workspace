# CDS / Components / Avatar

# [V2] Avatar

아바타는 사람과 서비스를 대표하는 이미지형 컴포넌트입니다.

## Principle

- 아바타는 콘텐츠의 성격과 사용자의 정체성 표현 목적에 따라 타입을 구분합니다.
- 레이아웃을 해치지 않도록 상황에 맞는 크기를 적용해 사용합니다.

## Specification

### Properties

| Properties | Type | Description | Values |
| --- | --- | --- | --- |
| Mode | enum | Default를 선택하면 OS테마 환경에 따라 변경되고, Fixed를 선택하면 OS 테마 환경에 상관없이 다크테마로 보여집니다. | Default, Fixed |
| Size | enum | 타입별로 다양한 크기로 제공되며 레이아웃 구성 요소에 맞춰 사용하도록 합니다. | XXXXLarge, XXXLarge, XXLarge, XLarge, Large, Medium, Small, XSmall, XXSmall, XXXSmall, Tiny |
| Emoji | boolean | Circle 타입. 모든 사이즈에 노출됩니다. 인스턴스 속성. | True, False |
| Birthday Hat | boolean | Circle 타입. 아바타 오른쪽 상단에 배치되며 생일 상태를 표시합니다. 모든 사이즈에 노출됩니다. 인스턴스 속성. | True, False |
| Moment Ring | enum | Circle 타입. Ring Case를 선택합니다. 모든 사이즈에 노출됩니다. 인스턴스 속성. | Default, Unread, Membership Only, Read |
| Badge Dot | boolean | Squircle 타입. 아바타 오른쪽 상단에 배치되며 업데이트 상태를 표시합니다. 모든 사이즈에 노출됩니다. 인스턴스 속성. | True, False |
| Host | boolean | Squircle 타입. 모든 사이즈에 노출됩니다. 인스턴스 속성. | True, False |

## Guide

### Size

- `Value`는 실제 Avatar 본체의 크기입니다.
- `Component size`는 Ring 옵션이 켜졌을 때 Ring stroke와 Avatar 사이 Gap까지 포함해 컴포넌트가 차지하는 전체 영역입니다.
- Ring stroke와 Gap 값은 확장 섹션 Ring > Size 표를 참조합니다.

| Size | Value | Component size |
| --- | --- | --- |
| XXXXLarge | 128 | 140 |
| XXXLarge | 96 | 108 |
| XXLarge | 72 | 84 |
| XLarge | 64 | 72 |
| Large | 56 | 64 |
| Medium | 48 | 56 |
| Small | 40 | 46 |
| XSmall | 32 | 38 |
| XXSmall | 24 | 30 |
| XXXSmall | 20 | 26 |
| Tiny | 16 | 22 |

### Padding

Avatar는 이미지 본체를 감싸는 컴포넌트로 내부 수평 padding이 없습니다. 외곽 여백은 Ring stroke와 Gap으로 구성됩니다.

| Part | 속성 | 값 |
| --- | --- | --- |
| Ring (XXXXLarge~XXLarge) | Stroke | 3px |
| Ring (XXXXLarge~XXLarge) | Gap | 3px |
| Ring (XLarge~Medium) | Stroke | 3px |
| Ring (XLarge~Medium) | Gap | 1px |
| Ring (Small~XXXSmall) | Stroke | 2px |
| Ring (Small~XXXSmall) | Gap | 1px |

### Colors

| Mode | Role | Token |
| --- | --- | --- |
| Light/Dark | Circle Outline | `system/color/outline/default-50a-2` |
| Fixed | Circle Outline | `system/fixed_color/outline/default-100a` |
| Light/Dark | Squircle Outline | `system/color/outline/default-reverse` |
| Fixed | Squircle Outline | `system/fixed_color/outline/default-reverse` |
| Light/Dark | Badge Dot fill | `system/color/status/danger-red` |
| Fixed | Badge Dot fill | `system/fixed_color/status/danger-red` |

상세 색상 토큰은 확장 섹션 Circle > Color, Squircle > Color, Ring > Color를 참조합니다.

## Usage Do / Don't

### Type

Do

- 개인 프로필이나 사용자 정체성 표현에는 Circle Avatar를 사용해야 한다.
- 그룹, 솔로 아티스트, 공식 커뮤니티 대표 이미지에는 Squircle Avatar를 사용해야 한다.

Don't

- 정체성 혼란을 방지하기 위해, 콘텐츠 목적이 다른 Avatar type을 임의로 혼용하지 않아야 한다.

### Size

Do

- 같은 리스트나 동일 계층 안에서는 동일한 Avatar size를 사용해야 한다.
- 레이아웃 밀도와 정보 위계에 맞는 size scale을 선택해야 한다.

Don't

- 레이아웃 흔들림을 방지하기 위해, 동일한 정보 계층 안에서 Avatar size를 섞어 사용하지 않아야 한다.

## Avatar Type

서비스 내에서 아바타는 콘텐츠의 성격과 사용자의 정체성 표현 목적에 따라 Circle, Squircle 타입으로 구분하여 사용합니다.

| Type | Component | Size | Description |
| --- | --- | --- | --- |
| Circle | Circle | XXXXLarge, XXXLarge, XXLarge, XLarge, Large, Medium, Small, XSmall, XXSmall, XXXSmall, Tiny | 아티스트/그룹/사용자 개인의 프로필용. 사용자 정체성을 표현하는 용도로 사용됩니다. |
| Squircle | Squircle | XXXXLarge, XXXLarge, XXLarge, XLarge, Large, Medium, Small, XSmall, XXSmall, XXXSmall, Tiny | 그룹/솔로 아티스트의 공식 커뮤니티의 대표 이미지이자 정체성 표현에 사용됩니다. |

## Component

### Light/Dark

| Size | Component size |
| --- | --- |
| XXXXLarge | 140 x 140 |
| XXXLarge | 108 x 108 |
| XXLarge | 84 x 84 |
| XLarge | 72 x 72 |
| Large | 64 x 64 |
| Medium | 56 x 56 |
| Small | 46 x 46 |
| XSmall | 38 x 38 |
| XXSmall | 30 x 30 |
| XXXSmall | 26 x 26 |
| Tiny | 22 x 22 |

### Fixed

| Size | Component size |
| --- | --- |
| XXXXLarge | 140 x 140 |
| XXXLarge | 108 x 108 |
| XXLarge | 84 x 84 |
| XLarge | 72 x 72 |
| Large | 64 x 64 |
| Medium | 56 x 56 |
| Small | 46 x 46 |
| XSmall | 38 x 38 |
| XXSmall | 30 x 30 |
| XXXSmall | 26 x 26 |
| Tiny | 22 x 22 |

## Circle

### Color

이 Color 섹션은 Circle 아바타가 배경 위에 올라갔을 때 적용되는 외곽선 토큰을 Mode별로 비교합니다.
Figma 예시는 `Circle / XXLarge` 아바타에 `Moment_Ring`, `Emoji`, `Birthday_Hat`이 함께 노출된 상태이며, 이미지 영역은 72px, 컴포넌트 전체는 84px 기준으로 표시됩니다.

- `Light/Dark`는 시스템 테마에 따라 바뀌는 `system/color/*` 토큰을 사용합니다.
- `Fixed`는 OS 테마와 무관하게 고정된 다크 테마 표현을 위해 `system/fixed_color/*` 토큰을 사용합니다.
- `Outline`은 아바타와 배경을 분리하는 외곽선입니다.

| Mode | Outline |
| --- | --- |
| Light/Dark | `system/color/outline/default-50a-2` |
| Fixed | `system/fixed_color/outline/default-100a` |

### Size

- `Value`는 실제 Avatar 본체의 크기입니다.
- `Component size`는 Ring 옵션이 켜졌을 때 Ring stroke와 Avatar 사이 Gap까지 포함해 컴포넌트가 차지하는 전체 영역입니다.
- Ring stroke와 Gap 값은 아래 Ring > Size 표를 따릅니다.

| Size | Value | Component size |
| --- | --- | --- |
| XXXXLarge | 128 | 140 |
| XXXLarge | 96 | 108 |
| XXLarge | 72 | 84 |
| XLarge | 64 | 72 |
| Large | 56 | 64 |
| Medium | 48 | 56 |
| Small | 40 | 46 |
| XSmall | 32 | 38 |
| XXSmall | 24 | 30 |
| XXXSmall | 20 | 26 |
| Tiny | 16 | 22 |

## Birthday Hat

Birthday Hat은 Circle 아바타 오른쪽 상단에 배치됩니다. 모든 사이즈에 노출됩니다.

| Size | Value |
| --- | --- |
| XXXXLarge | 40 |
| XXXLarge | 32 |
| XXLarge | 24 |
| XLarge | 24 |
| Large | 24 |
| Medium | 20 |
| Small | 20 |
| XSmall | 16 |
| XXSmall | 12 |
| XXXSmall | 10 |
| Tiny | 10 |

## Emoji

Emoji는 아바타 오른쪽 하단에 배치됩니다. 모든 사이즈에 노출됩니다.
Emoji에는 예시 기준 `shadow-lg` 효과가 적용됩니다.

### Color

- `Fill`은 Emoji 뒤에 깔리는 배경면입니다.

| Mode | Fill |
| --- | --- |
| Light/Dark | `system/color/surface/default-4` |
| Fixed | `system/fixed_color/surface/default-4` |

### Size

| Size | Emoji frame (px) | Typography |
| --- | --- | --- |
| XXXXLarge | 38 | `headline-s/system-800` |
| XXXLarge | 32 | `body-lg/system-700` |
| XXLarge | 24 | `caption-m/system-400` |
| XLarge | 24 | `caption-m/system-400` |
| Large | 24 | `caption-m/system-400` |
| Medium | 24 | `caption-m/system-400` |

- Small 이하(Small, XSmall, XXSmall, XXXSmall, Tiny)에는 Emoji 미지원.

## Ring

Default, Unread, Membership, Read 4가지 케이스로 제공됩니다.

### Color

- Unread와 Read는 color token을 사용합니다.
- Membership만 token이 아닌 Figma paint style gradient를 사용합니다.

| Mode | Unread | Membership | Read |
| --- | --- | --- | --- |
| Light/Dark | `system/color/roles/primary` | Figma paint style: `integrated-membership-gra` | `system/color/outline/gray-200` |
| Fixed | `system/fixed_color/roles/primary` | Figma paint style: `integrated-membership-gra` | `system/fixed_color/outline/gray-200` |

#### Membership gradient detail

- Membership Ring은 Figma 기준 `Moment_Ring`의 `strokes[0]`에 적용된 `GRADIENT_LINEAR` 값입니다.
- `integrated-membership-gra`는 토큰이 아니라 Figma paint style로 관리되는 gradient입니다.
- 구현 시 `gradient/integrated-membership-gra` 같은 토큰 경로를 찾지 않고, 아래 angle과 stop 값을 직접 사용합니다.

| Property | Value |
| --- | --- |
| Type | `linear-gradient` |
| Angle | `353.88deg` |

| Stop | Position | Color token |
| --- | --- | --- |
| 1 | `0%` | `system/color/roles/membership-malachite-green` |
| 2 | `43%` | `system/color/roles/membership-cornflower-blue` |
| 3 | `77%` | `system/color/roles/membership-lavender` |

> Figma 정밀 재현이 필요한 경우 `gradientTransform` 참조:
> `[[0.7684494853, 0.5588471889, -0.1627408862], [-0.0824003071, 0.1141824573, 0.4778847098]]`

### Size

| Size group | Ring | Gap |
| --- | --- | --- |
| XXXXLarge, XXXLarge, XXLarge | 3 | 3 |
| XLarge, Large, Medium | 3 | 1 |
| Small, XSmall, XXSmall, XXXSmall | 2 | 1 |

### Placeholder

Placeholder는 이미지입니다.

| Mode | Value |
| --- | --- |
| Light/Dark | Place holder |
| Fixed | Place holder |

## Squircle

### Shape

- Squircle은 단순 `border-radius`로 만든 Rounded Rectangle이 아닙니다.
- Squircle 외형은 Figma의 `asset/squircle-mask`를 기준으로 합니다.
- 구현 시 `asset/squircle-mask`를 SVG mask, clip-path, 또는 mask asset으로 사용해 재현합니다.
- Size별 Squircle은 동일한 mask shape를 각 `Value` 크기에 맞게 비율 스케일해 사용합니다.
- 일반 `border-radius` 값으로 임의 대체하지 않습니다.

### Color

이 Color 섹션은 Squircle 아바타에서 기본 이미지 영역, Badge_Dot, Host 오버레이가 함께 표시될 때 쓰이는 외곽선과 상태 색상 토큰을 Mode별로 비교합니다.
Figma 예시는 `Squircle / XXLarge` 아바타에 `Badge_Dot`과 `Host`가 함께 노출된 상태이며, 이미지 영역은 72px, 컴포넌트 전체는 84px 기준으로 표시됩니다.

- `Light/Dark`는 시스템 테마에 따라 바뀌는 `system/color/*` 토큰을 사용합니다.
- `Fixed`는 OS 테마와 무관하게 고정된 다크 테마 표현을 위해 `system/fixed_color/*` 토큰을 사용합니다.
- `Outline / default-50a-2`와 `Outline / default-100a`는 Squircle 아바타 본체 외곽선을 구분하는 값입니다.
- `Outline / default-reverse`는 Badge_Dot이 이미지 위에서 분리되어 보이도록 감싸는 외곽선입니다.
- `Dot / danger-red`는 업데이트 상태를 표시하는 Badge_Dot의 채움 색상입니다.
- `Outline / surface/default`는 Host 오버레이가 배경과 겹칠 때 경계를 만드는 표면색 기반 외곽선입니다.

| Mode | Token type | Token |
| --- | --- | --- |
| Light/Dark | Outline | `system/color/outline/default-reverse` |
| Fixed | Outline | `system/fixed_color/outline/default-reverse` |
| Light/Dark | Dot | `system/color/status/danger-red` |
| Fixed | Dot | `system/fixed_color/status/danger-red` |
| Light/Dark | Outline | `system/color/outline/default-50a-2` |
| Fixed | Outline | `system/fixed_color/outline/default-100a` |
| Light/Dark | Outline | `system/color/surface/default` |
| Fixed | Outline | `system/fixed_color/surface/default` |

### Size

- `Value`는 Squircle 내부 Avatar 영역의 크기입니다.
- `Component size`는 실제 Squircle 컴포넌트가 차지하는 전체 영역입니다.
- Squircle에는 Ring 노출 값이 별도로 없으며, Dot과 Host는 Squircle에 속한 옵션 속성입니다.

| Size | Value | Component size |
| --- | --- | --- |
| XXXXLarge | 128 | 140 |
| XXXLarge | 96 | 108 |
| XXLarge | 72 | 84 |
| XLarge | 64 | 72 |
| Large | 56 | 64 |
| Medium | 48 | 56 |
| Small | 40 | 46 |
| XSmall | 32 | 38 |
| XXSmall | 24 | 30 |
| XXXSmall | 20 | 26 |
| Tiny | 16 | 22 |

## Host

Host는 아바타 오른쪽 하단에 배치됩니다. 모든 사이즈에 노출됩니다.

| Type | Size | Host badge (px) | Gap (px) |
| --- | --- | --- | --- |
| Squircle | XXXXLarge | 40 | 3 |
| Squircle | XXXLarge | 32 | 3 |
| Squircle | XXLarge | 24 | 3 |
| Squircle | XLarge | 24 | 3 |
| Squircle | Large | 24 | 3 |
| Squircle | Medium | 24 | 3 |

- Host badge: 부모 아바타 우측 하단에 표시되는 미니 아바타 이미지 영역 크기.
- Gap: 부모 아바타 외곽선 ↔ Host badge 외곽선 사이의 간격.

## Badge Dot

Badge Dot은 아바타 오른쪽 상단에 배치되며, 업데이트 상태를 표시합니다. 모든 사이즈에 노출됩니다.

| Type | Size | Stroke | Dot |
| --- | --- | --- | --- |
| Squircle | XXXXLarge | 4 | 24 |
| Squircle | XXXLarge | 4 | 22 |
| Squircle | XXLarge | 4 | 16 |
| Squircle | XLarge | 4 | 12 |
| Squircle | Large | 3 | 12 |
| Squircle | Medium | 3 | 12 |
| Squircle | Small | 2 | 8 |
| Squircle | XSmall | 2 | 8 |
| Squircle | XXSmall | 2 | 6 |
| Squircle | XXXSmall | 2 | 6 |
| Squircle | Tiny | 2 | 4 |

### Placeholder

| Mode | Value |
| --- | --- |
| Light/Dark | Place holder |
| Fixed | Place holder |

## Implementation Assets

| Asset | File key | Node ID | Usage |
| --- | --- | --- | --- |
| `asset/squircle-mask` | `DWEduE6GfxYMlyxKPNJ8jA` | `80800:54100` | Squircle 외형을 재현하기 위한 원본 mask asset입니다. |
| `placeholder image` | `DWEduE6GfxYMlyxKPNJ8jA` | `21853:48857` | Avatar 이미지가 없을 때 사용하는 기본 이미지 asset입니다. |
