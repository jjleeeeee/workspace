# CDS / Components / Avatar Group

# Avatar Group

Avatar Group은 여러 Avatar를 한 묶음으로 표시하고, 필요 시 LIVE 상태나 5+ overflow 상태를 함께 표현하는 내부 조합 컴포넌트입니다.

## Principle

- **Avatar Group은 컴포넌트가 아닌 타이틀 헤더의 속성으로써 사용합니다. (디자인 개별 사용금지)** — Figma 원칙 원문
- 여러 사용자를 좁은 영역에 표시해야 할 때 Count 값으로 노출 개수를 제어합니다.
- LIVE 상태가 필요한 경우 Tile alignment에서만 Live Tag를 사용합니다.
- Count가 5+일 때는 내부 overflow count indicator를 유지합니다.
- Avatar 자체의 이미지, shape, ring 등 세부 규칙은 `[V2] Avatar` 컴포넌트 규칙을 따릅니다.

## Specification

### Properties

| Properties | Type | Description | Values |
| --- | --- | --- | --- |
| Shape | enum | Avatar Group의 모양을 결정합니다. | Circle, Squircle |
| Alignment | enum | Avatar Group의 정렬 방식을 결정합니다. | Tile, Horizontal |
| Count | enum | Avatar Group에 노출되는 avatar 개수를 결정합니다. | 1, 2, 3, 4, 5+ |
| Show Live Tag | boolean | 아바타 그룹에 라이브 태그를 노출합니다. Tile alignment에서만 유효. 인스턴스 속성. | ON, OFF |

## Guide

상세 치수 및 색상은 아래 확장 섹션을 참조합니다.

- Layout — Tile/Horizontal 별 컴포넌트 사이즈
- Grid Type — Shape × Alignment × Count 조합별 내부 Avatar 사이즈
- Color — Live Tag, Overflow count, Badge_Dot 토큰
- Size Tokens — 내부 패딩 및 반경 토큰

### Size

| Alignment | Count | Component size (Live Tag ON) | Component size (Live Tag OFF) |
| --- | --- | --- | --- |
| Tile | 1~5+ | 38 x 46 | 38 x 38 |
| Horizontal | 1 | — | 26 x 26 |
| Horizontal | 2 | — | 40 x 26 |
| Horizontal | 3 | — | 54 x 26 |
| Horizontal | 4, 5+ | — | 68 x 26 |

### Padding

Live Tag 내부 및 Avatar Group 내부 간격 토큰.

| Part | 속성 | Token | Resolved |
| --- | --- | --- | --- |
| Live Tag | Horizontal padding | system/size/padding/box/50 | 4px |
| Live Tag | Vertical padding | system/size/padding/box/25 | 2px |
| Live Tag | Border radius | system/size/radius/box/50 | 4px |
| Live Tag | Border width | — | 2px (hardcoded) |
| Avatar Group | Inner gap | system/size/padding/box/negative-100 | 0px |

### Colors

| Part | Role | Token | Resolved | Note |
| --- | --- | --- | --- | --- |
| Live Tag | Fill | `system/fixed_color/status/danger-red` | #FE5B58 | fixed — 다크모드 무관 |
| Live Tag | Stroke | `system/fixed_color/outline/default` | #FFFFFF | fixed — 다크모드 무관 |
| Live Tag text | Text fill | `system/fixed_color/text/default` | #FFFFFF | fixed — 다크모드 무관 |
| Overflow count text | Text fill | `system/fixed_color/text/default` | #FFFFFF | fixed — 다크모드 무관 |
| Badge Dot | Fill | `system/color/status/danger-red` | #FE5B58 | non-fixed, `fixed_color`와 경로 다름 |
| Badge Dot | Stroke | `system/color/outline/default-reverse` | #FFFFFF | non-fixed, `fixed_color`와 경로 다름 |

## Usage Do / Don't

### 사용 범위

Do

- Title Header 안에서 대상을 식별해야 할 때 Avatar Group을 사용해야 한다.
- 여러 identity 또는 live identity status를 compact하게 표현해야 할 때 Avatar Group을 사용해야 한다.

Don't

- Figma에 표시된 "디자인 개별 사용금지" 규칙이 있기 때문에, Avatar Group을 단독 컴포넌트처럼 사용하지 않아야 한다.
- 식별 의미가 약화되기 때문에, Avatar Group을 장식 목적의 avatar 묶음으로 사용하지 않아야 한다.

### Variant

Do

- Figma에 존재하는 11개 live variant 안에서 Shape, Alignment, Count 조합을 선택해야 한다.
- Squircle은 현재 `Alignment=Tile`, `Count=1` 조합만 사용해야 한다.

Don't

- Figma 미지원 variant이기 때문에, Squircle + Horizontal 또는 Squircle + Count 2 이상 조합을 임의로 만들지 않아야 한다.

### Live Tag

Do

- LIVE 라벨이 필요한 경우 Tile alignment에서 Live Tag를 사용해야 한다.

Don't

- Horizontal alignment에서 Live Tag를 임의로 추가하지 않아야 한다.
- 컴포넌트 계약이 훼손되기 때문에, LIVE 텍스트를 외부 텍스트 레이어로 대체하지 않아야 한다.

### Count 5+

Do

- Count가 5+일 때는 Avatar Group 내부의 overflow count indicator를 사용해야 한다.

Don't

- 5+ indicator를 임의의 Badge_Number나 별도 텍스트로 바꾸지 않아야 한다.

## Variant Availability

| Shape | Alignment | Count | Status |
| --- | --- | --- | --- |
| Circle | Tile | 1, 2, 3, 4, 5+ | Available |
| Circle | Horizontal | 1, 2, 3, 4, 5+ | Available |
| Squircle | Tile | 1 | Available |
| Squircle | Horizontal | - | Not available |
| Squircle | Tile | 2, 3, 4, 5+ | Not available |

## Grid Type

Figma 문서의 Grid Type 매트릭스는 Shape × Alignment × Count 조합별 내부 아바타 사이즈를 시각적으로 정의합니다.

| # | Shape | Alignment | Count | 내부 Avatar 사이즈 |
| --- | --- | --- | --- | --- |
| 1 | Squircle | Tile | 1 | xsmall |
| 2 | Circle | Tile | 2 | xsmall |
| 3 | Circle | Tile | 3 | xxxsmall |
| 4 | Circle | Tile | 4 | Tiny |
| 5 | Circle | Tile | 5+ | Tiny |
| 6 | Circle | Horizontal | 1 | xxxsmall |
| 7 | Circle | Horizontal | 2 | xxxsmall |
| 8 | Circle | Horizontal | 3 | xxxsmall |
| 9 | Circle | Horizontal | 4 | xxxsmall |
| 10 | Circle | Horizontal | 5+ | xxxsmall |

**사이즈 토큰 해석:**
- `xsmall`: 단일(Count=1) Tile 또는 두 아바타가 겹치는 Count=2 Tile에 사용
- `xxxsmall`: 3인 이상 Tile 또는 Horizontal 전 Count에 사용하는 중간 사이즈 (약 26px 기준)
- `Tiny`: Count 4 이상 Tile에 사용하는 최소 사이즈 (약 22px 기준)

> Source: Figma node `73596:6512` (Grid Type 영역)

## Layout

### Tile

Tile은 avatar group 영역 아래에 Live Tag를 함께 배치하는 형태입니다.

- Live Tag=ON: Avatar 영역(38px) + Live Tag(16px) - 겹침(8px) = 46px
- `-8px`는 Live Tag가 Avatar 영역 하단에 8px 올라붙는 수직 겹침값

| Count | Component size (Live Tag ON) | Component size (Live Tag OFF) | Avatar area | Note |
| --- | --- | --- | --- | --- |
| 1 | 38 x 46 | 38 x 38 | 38 x 38 | Circle 또는 Squircle 사용 가능 |
| 2 | 38 x 46 | 38 x 38 | 38 x 38 | Circle only |
| 3 | 38 x 46 | 38 x 38 | 38 x 38 | Circle only |
| 4 | 38 x 46 | 38 x 38 | 38 x 38 | Circle only |
| 5+ | 38 x 46 | 38 x 38 | 38 x 38 | Circle only, overflow count indicator 포함 |

### Horizontal

Horizontal은 26px 높이 안에서 avatar를 가로로 겹쳐 배치하는 형태입니다. Live Tag는 포함하지 않습니다.

| Count | Component size | Note |
| --- | --- | --- |
| 1 | 26 x 26 | Circle only |
| 2 | 40 x 26 | Circle only |
| 3 | 54 x 26 | Circle only |
| 4 | 68 x 26 | Circle only |
| 5+ | 68 x 26 | Circle only, 네 번째 slot에 overflow count indicator 포함 |

## Masking

### 적용 조건

| Alignment | Count | 마스킹 적용 | 방향 |
| --- | --- | --- | --- |
| Tile | 1 | 없음 | — |
| Tile | 2, 3, 4, 5+ | 있음 | 수직 겹침 |
| Horizontal | 1 | 없음 | — |
| Horizontal | 2, 3, 4, 5+ | 있음 | 수평 겹침 |
| Squircle | 1 (only) | 없음 | — |

### 마스크 구조

- 마스크 컨테이너: `26 x 26`
- 실제 마스크 클리핑 영역: `24 x 24` (`mask-position: 3px 3px` → 3px inset)
- 마스크 형태: SVG cutout — 뒤에 오는 아바타가 앞 아바타 경계에서 잘려 보이는 구조
- Avatar shape(원형 경계선)을 부모에서 새로 그리지 않고, nested `[V2] Avatar` + mask 구조를 그대로 유지해야 함

> Source: Figma spec node `73666:32298`, 코드 `mask-position-[3px_3px]` 확인

## Color

| Part | Role | Token | Resolved | Note |
| --- | --- | --- | --- | --- |
| Live Tag | Fill | `system/fixed_color/status/danger-red` | #FE5B58 | fixed — 다크모드 무관 |
| Live Tag | Stroke | `system/fixed_color/outline/default` | #FFFFFF | fixed — 다크모드 무관 |
| Live Tag text | Text fill | `system/fixed_color/text/default` | #FFFFFF | fixed — 다크모드 무관 |
| Overflow count text | Text fill | `system/fixed_color/text/default` | #FFFFFF | fixed — 다크모드 무관 |
| Badge Dot | Fill | `system/color/status/danger-red` | #FE5B58 | non-fixed, `fixed_color`와 경로 다름 |
| Badge Dot | Stroke | `system/color/outline/default-reverse` | #FFFFFF | non-fixed, `fixed_color`와 경로 다름 |

## Typography

| Part | Token | Resolved | Note |
| --- | --- | --- | --- |
| Live Tag / overflow count | `caption-xs/system-700` | 10px / Bold / lh 13px / ls 0 | `font_family/body` (WeGothicSans:Bold), `base/text_size/text-25`, `base/lineheight/text-lineheight-25` |

## Size Tokens

| Part | Token | Resolved |
| --- | --- | --- |
| Live Tag horizontal padding | `system/size/padding/box/50` | 4px |
| Live Tag vertical padding | `system/size/padding/box/25` | 2px |
| Live Tag border radius | `system/size/radius/box/50` | 4px |
| Live Tag border width | — | 2px (hardcoded) |
| Avatar Group 내부 gap | `system/size/padding/box/negative-100` | 0px |

## Composition

| Child component | Role | Usage |
| --- | --- | --- |
| `[V2] Avatar` | Individual avatar visual | 모든 Avatar Group variant 내부 avatar 표현 |
| Live Tag | Status badge | `Alignment=Tile`, `Show Live Tag=ON`에서 LIVE 상태 표시 |
| Overflow count indicator | Count badge | `Count=5+`에서 추가 identity 표시 |

### [V2] Avatar 노출 하위 속성

Figma에서 Avatar Group 선택 시 `[V2] Avatar` 하위 속성이 함께 노출됩니다.

| Sub-property | Type | Note |
| --- | --- | --- |
| Mode | Variant | Default 고정 |
| Type | Variant | Shape prop 연동 (Squircle / Circle) |
| Size | Variant | XSmall 기준 |
| Badge Dot | Boolean | Avatar Group 레벨에서 제어 가능 |

## Implementation Notes

- Shape, Alignment, Count를 먼저 해석해 Figma에 존재하는 live variant를 선택합니다.
- `Live Tag`는 variant axis가 아니라 boolean component property입니다.
- `Live Tag`는 Tile alignment에서만 지원되는 것으로 취급합니다.
- `[V2] Avatar`의 내부 축, 이미지 레이아웃, ring 규칙은 Avatar Group 문서로 복사하지 않습니다.
- Squircle + Horizontal 또는 Squircle multi-count variant가 필요하면 Figma source 업데이트를 먼저 확인해야 합니다.

## Source Notes

- Figma file: `DWEduE6GfxYMlyxKPNJ8jA`
- Component set node ID: `73587:6404`
- Component set key: `6ad2e4b184997b01a86fa87e803387200dcca643`
- Live variant count: 11
- Related registry: `refs/figma-component-keys/variant-keys/avatar-group.md`
