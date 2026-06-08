# CDS / Components / Chips

# [V2] Chips

여러 선택 옵션 중 1개를 선택하여 해당 결과 값을 노출할 때 사용합니다.

## Principle

- Filter 역할과 Tabs에서 사용됩니다.
- 이미지는 아바타의 속성을 가져가지 않고, 이미지로만 사용됩니다.
- Tabs 역할을 하는 chips에서 텍스트는 Small 사이즈만 사용할 수 있습니다.
- Filter 역할을 하는 chips에서 텍스트는 Small 사이즈를 사용할 수 있습니다.
- 이미지는 Medium 사이즈에서만 사용할 수 있습니다.

## Specification

### Properties

| Properties | Type | Description | Values |
| --- | --- | --- | --- |
| Mode | enum | Default를 선택하면 OS테마 환경에 따라 변경되고, Fixed를 선택하면 OS 테마 환경에 상관없이 다크테마로 보여집니다. | Default, Fixed |
| Size | enum | Chip의 크기를 정의합니다. | Small, Medium |
| Type | enum | Chips의 타입을 정의합니다. 이미지는 Medium 사이즈에서만 사용할 수 있습니다. | Text, Icon, Image (Only Medium) |
| State | enum | Chip의 상태값을 정의합니다. | Enabled, Filled_Selected, Outlined_Selected, Filled_Disabled, Outlined_Disabled |
| Radius | boolean | 버튼의 모서리 값을 정의합니다. | ON, OFF |
| Badge | boolean | Dot type badge를 사용할 수 있습니다. 인스턴스 속성. | ON, OFF |
| Badge_Number | boolean | 우측에 Number badge를 사용할 수 있습니다. 인스턴스 속성. | ON, OFF |
| Marquee | boolean | Chip내 텍스트가 길 경우 사용할 수 있습니다. 인스턴스 속성. | ON, OFF |
| [Text] Mode | enum | 텍스트의 Default를 선택하면 OS테마 환경에 따라 변경되고, Fixed를 선택하면 OS 테마 환경에 상관없이 다크테마로 보여집니다. | Default, Fixed |
| [Text] Type | enum | 텍스트의 타입을 정의합니다. 아티스트명이 들어갈 때는 Artist로 사용합니다. | Default, Artist |
| [Text] State | enum | 텍스트의 상태값을 정의합니다. | Enabled, Filled_Selected, Outlined_Selected, Disabled |

## Guide

### Size

| Size   | Height | Radius |
| ------ | ------ | ------ |
| Medium | 36     | 8      |
| Small  | 32     | 8      |

### Padding

| Size | Type | 좌 내부 패딩 | 우 내부 패딩 | Inner Gap |
| --- | --- | --- | --- | --- |
| Medium | Text | `system/size/padding/box/150` | `system/size/padding/box/150` | `system/size/padding/box/50` |
| Medium | Icon/Dot | `system/size/padding/box/150` | `system/size/padding/box/150` | `system/size/padding/box/50` |
| Medium | Image (Only Medium) | `system/size/padding/box/75` | `system/size/padding/box/150` | `system/size/padding/box/50` |
| Small | Text | `system/size/padding/box/150` | `system/size/padding/box/150` | `system/size/padding/box/50` |
| Small | Icon/Dot | `system/size/padding/box/150` | `system/size/padding/box/150` | `system/size/padding/box/50` |

- Chip의 max-width는 190이며, 초과 시 `...` 처리합니다.
- Marquee는 Small 사이즈에서만 사용하며, 아티스트명 또는 법적 이슈가 있는 경우에만 사용합니다.
- Marquee의 Gradient는 width 24px로 Chip의 Fill값에 맞춰 0%에서 100%로 Linear효과로 노출됩니다.

### Text Type

| 텍스트 종류 | 폰트     |
| ---------- | -------- |
| 일반 텍스트 | System   |
| 아티스트명  | Circular |

### Colors

#### Light/Dark Mode

| State              | Part   | Token                                       | Light      | Dark       |
| ------------------ | ------ | ------------------------------------------- | ---------- | ---------- |
| Enabled            | 테두리 | `system/color/outline/default-100a`         | `#0000001A` | `#FFFFFF1A` |
| Enabled            | 아이콘 | `system/color/icon/default`                 | `#000000`  | `#FFFFFF`  |
| Enabled            | 텍스트 | `system/color/text/default`                 | `#000000`  | `#FFFFFF`  |
| Enabled            | 이미지 | 투명도 100%                                  | —          | —          |
| Outlined_Selected  | 테두리 | `system/color/button/default`               | `#00CBD5`  | `#01D5DF`  |
| Outlined_Selected  | 아이콘 | `system/color/icon/primary`                 | `#00B8C1`  | `#01D5DF`  |
| Outlined_Selected  | 텍스트 | `system/color/text/primary`                 | `#00B8C1`  | `#01D5DF`  |
| Outlined_Selected  | 이미지 | 투명도 100%                                  | —          | —          |
| Outlined_Selected (커뮤니티) | 테두리 | `system/color/outline/default`        | `#000000`  | `#FFFFFF`  |
| Outlined_Selected (커뮤니티) | 아이콘 | `system/color/icon/default`           | `#000000`  | `#FFFFFF`  |
| Outlined_Selected (커뮤니티) | 텍스트 | `system/color/text/default`           | `#000000`  | `#FFFFFF`  |
| Outlined_Selected (커뮤니티) | 이미지 | 투명도 100%                            | —          | —          |
| Outlined_Disabled  | 테두리 | `system/color/outline/default-100a`         | `#0000001A` | `#FFFFFF1A` |
| Outlined_Disabled  | 아이콘 | `system/color/icon/200a`                    | `#00000033` | `#FFFFFF33` |
| Outlined_Disabled  | 텍스트 | `system/color/text/200a`                    | `#00000033` | `#FFFFFF33` |
| Outlined_Disabled  | 이미지 | 투명도 20%                                   | —          | —          |
| Filled_Selected    | 배경   | `system/color/button/default`               | `#00CBD5`  | `#01D5DF`  |
| Filled_Selected    | 아이콘 | `system/color/icon/default-reverse`         | `#FFFFFF`  | `#000000`  |
| Filled_Selected    | 텍스트 | `system/color/text/default-reverse`         | `#FFFFFF`  | `#000000`  |
| Filled_Selected    | 이미지 | 투명도 100%                                  | —          | —          |
| Filled_Selected (커뮤니티) | 배경   | `system/color/surface/default-reverse` | `#000000`  | `#FFFFFF`  |
| Filled_Selected (커뮤니티) | 아이콘 | `system/color/icon/default-reverse`    | `#FFFFFF`  | `#000000`  |
| Filled_Selected (커뮤니티) | 텍스트 | `system/color/text/default-reverse`    | `#FFFFFF`  | `#000000`  |
| Filled_Selected (커뮤니티) | 이미지 | 투명도 100%                             | —          | —          |
| Filled_Disabled    | 배경   | `system/color/surface/default-reverse-100a` | `#0000001A` | `#FFFFFF1A` |
| Filled_Disabled    | 아이콘 | `system/color/icon/200a`                    | `#00000033` | `#FFFFFF33` |
| Filled_Disabled    | 텍스트 | `system/color/text/200a`                    | `#00000033` | `#FFFFFF33` |
| Filled_Disabled    | 이미지 | 투명도 20%                                   | —          | —          |

#### Fixed Mode

| State              | Part   | Token                                             | Light      | Dark       |
| ------------------ | ------ | ------------------------------------------------- | ---------- | ---------- |
| Enabled            | 테두리 | `system/fixed_color/outline/default-100a`         | `#FFFFFF1A` | `#FFFFFF1A` |
| Enabled            | 아이콘 | `system/fixed_color/icon/default`                 | `#FFFFFF`  | `#FFFFFF`  |
| Enabled            | 텍스트 | `system/fixed_color/text/default`                 | `#FFFFFF`  | `#FFFFFF`  |
| Outlined_Selected  | 테두리 | `system/fixed_color/button/default`               | `#01D5DF`  | `#01D5DF`  |
| Outlined_Selected  | 아이콘 | `system/fixed_color/icon/primary`                 | `#01D5DF`  | `#01D5DF`  |
| Outlined_Selected  | 텍스트 | `system/fixed_color/text/primary`                 | `#01D5DF`  | `#01D5DF`  |
| Outlined_Selected (커뮤니티) | 테두리 | `system/fixed_color/outline/default`        | `#FFFFFF`  | `#FFFFFF`  |
| Outlined_Selected (커뮤니티) | 아이콘 | `system/fixed_color/icon/default`           | `#FFFFFF`  | `#FFFFFF`  |
| Outlined_Selected (커뮤니티) | 텍스트 | `system/fixed_color/text/default`           | `#FFFFFF`  | `#FFFFFF`  |
| Outlined_Disabled  | 테두리 | `system/fixed_color/outline/default-100a`         | `#FFFFFF1A` | `#FFFFFF1A` |
| Outlined_Disabled  | 아이콘 | `system/fixed_color/icon/200a`                    | `#FFFFFF33` | `#FFFFFF33` |
| Outlined_Disabled  | 텍스트 | `system/fixed_color/text/200a`                    | `#FFFFFF33` | `#FFFFFF33` |
| Filled_Selected    | 배경   | `system/fixed_color/button/default`               | `#01D5DF`  | `#01D5DF`  |
| Filled_Selected    | 아이콘 | `system/fixed_color/icon/default`                 | `#FFFFFF`  | `#FFFFFF`  |
| Filled_Selected    | 텍스트 | `system/fixed_color/text/default`                 | `#FFFFFF`  | `#FFFFFF`  |
| Filled_Selected (커뮤니티) | 배경   | `system/fixed_color/surface/default-reverse` | `#FFFFFF`  | `#FFFFFF`  |
| Filled_Selected (커뮤니티) | 아이콘 | `system/fixed_color/icon/default-reverse`    | `#000000`  | `#000000`  |
| Filled_Selected (커뮤니티) | 텍스트 | `system/fixed_color/text/default-reverse`    | `#000000`  | `#000000`  |
| Filled_Disabled    | 배경   | `system/fixed_color/surface/default-reverse-100a` | `#FFFFFF1A` | `#FFFFFF1A` |
| Filled_Disabled    | 아이콘 | `system/fixed_color/icon/200a`                    | `#FFFFFF33` | `#FFFFFF33` |
| Filled_Disabled    | 텍스트 | `system/fixed_color/text/200a`                    | `#FFFFFF33` | `#FFFFFF33` |

- 이미지 타입은 아바타 속성 없이 이미지로만 사용합니다.
- Leading 영역에는 Icon, Image가 활용되며, Trailing 영역에는 Number, Dot이 포함됩니다.
- Leading 및 Trailing 영역의 사이즈를 임의로 변경하지 마세요.

## Usage Do / Don't

### Option Chips

Do

- 다수의 옵션 중 선택 결과를 명확하게 전달해야 하기 때문에, Option Chips은 단일 또는 다중 선택이 가능하도록 사용해야 한다.
- Chips이 1개만 노출되더라도 사용자가 선택·적용 상태를 인지할 수 있어야 하기 때문에, 선택된 옵션은 항상 화면에 노출해야 한다.

Don't

- 좌우 스크롤은 사용자가 전체 옵션을 파악하기 어렵게 만들기 때문에, Option Chips이 페이지 너비를 초과할 경우 줄바꿈을 사용해야 한다.

### Tabs Chips

Do

- 탭 전환은 Chips 컴포넌트의 선택 상태를 기반으로 동작해야 하기 때문에, Tabs에 사용되는 컴포넌트는 Chips를 기준으로 사용해야 한다.
- 즉각적인 피드백이 탭 UX의 핵심이기 때문에, Chips 클릭 시 하단 페이지가 즉각적으로 이동해야 한다.

Don't

- 선택지가 하나뿐이면 필터의 의미가 없기 때문에, Filter Chip이 1개일 경우 노출하지 않아야 한다.

### 커뮤니티 컬러

Do

- 커뮤니티 고유의 아이덴티티를 일관되게 표현해야 하기 때문에, 커뮤니티 내에서는 커뮤니티 컬러를 사용해야 한다.
- 다크모드에서 커뮤니티 컬러가 반전되면 브랜드 색상이 훼손되기 때문에, 칩 내 텍스트 및 아이콘 색상은 `fixed_color`를 사용해야 한다.
