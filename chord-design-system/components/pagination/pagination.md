# CDS / Components / Pagination

# [V2] Pagination

한 화면에 담을 수 없는 여러 콘텐츠를 Dot 또는 List 형태로 분할하여 사용자의 현재 위치를 인지하고 탐색할 수 있도록 합니다.

## Principle

- 여러 개의 콘텐츠가 있음을 인지하기 어려운 경우 Pagination을 적용합니다.
- 사용성에 따라 Dot / List Pagination을 구분하여 사용합니다.
- Dot Pagination은 콘텐츠를 훑어보는 등 정확한 정보량 제공이 필요 없는 경우 사용합니다.
- List Pagination은 명확한 숫자로 사용자가 보고 있는 콘텐츠를 표시해야 하는 경우 사용합니다.
- List Pagination은 WEB 환경에서의 사용을 권장하며, 해상도에 따라 Large / Small 사이즈를 선택합니다.

## Specification

### Dot Properties

| Properties | Type | Description | Values |
| --- | --- | --- | --- |
| Mode | enum | Default를 선택하면 OS 테마 환경에 따라 변경되고, Fixed를 선택하면 OS 테마에 상관없이 다크테마로 보여집니다. | Default, Fixed |
| Pages | enum | 전체 페이지 수를 선택합니다. | 2, 3, 4, 5, 6+ |
| Selection | enum | 현재 페이지를 선택합니다. | 1, 2, 3, 4, 5, 6 |

> **예외 케이스:** Selection은 Pages 값을 초과할 수 없습니다 (Pages=2이면 Selection 1~2만 유효, Pages=3이면 1~3만 유효 등). Pages=6+는 Selection 1~6 모두 유효합니다. 총 40개 Variant.

### List Properties

| Properties | Type | Description | Values |
| --- | --- | --- | --- |
| Mode | enum | Default를 선택하면 OS 테마 환경에 따라 변경되고, Fixed를 선택하면 OS 테마에 상관없이 다크테마로 보여집니다. | Default, Fixed |
| Size | enum | 슬롯 크기를 선택합니다. 해상도에 따라 Large / Small 중 가시성 있는 사이즈를 사용합니다. | Large, Small |
| Pages | enum | 전체 페이지 수 패턴을 선택합니다. 8+ 는 Ellipsis 압축 형태를 사용합니다. | 2, 3, 4, 5, 6, 7, 8+ |

> **예외 케이스:** Mode, Size, Pages 모든 조합이 유효합니다. 총 28개 Variant.

## Guide

### Dimensions

**Pagination Dot**

| Part | Size |
| --- | --- |
| 컴포넌트 | 120 × 32px |
| 기본 Dot 프레임 | 8 × 8px |
| 기본 Dot (ellipse) | 6 × 6px |
| 축약 Dot (Ellipsis Mid) | 4 × 4px ellipse |
| 축약 Dot (Ellipsis End) | 2 × 2px ellipse |

### Size

**Pagination List**

| Size | Slot 크기 |
| --- | --- |
| Large | 40 × 40px |
| Small | 32 × 32px |

아이콘 영역: 16 × 16px (Prev / Next 버튼 공통).

### Padding

**Pagination Dot**

| 항목 | 값 |
| --- | --- |
| 상하 내부 패딩 | `system/size/padding/box/150` |
| Dot 간격 | `system/size/padding/box/75` |

**Pagination List**

| 항목 | 값 |
| --- | --- |
| 상하 내부 패딩 | `system/size/padding/box/200` |
| Slot 간격 | 0px |
| Ellipsis dot 간격 | `system/size/padding/box/25` |

### Colors

**Pagination Dot**

#### Light/Dark Mode

| State | Part | Token | Light | Dark |
| --- | --- | --- | --- | --- |
| Selected | Active dot fill | system/color/icon/default | #000000 | #FFFFFF |
| Selected | Active dot stroke | system/color/outline/default-reverse | #FFFFFF | #000000 |
| — | Inactive dot fill | system/color/icon/300a | #0000004D | #FFFFFF4D |
| — | Inactive dot stroke | system/color/outline/default-reverse-300a | #FFFFFF4D | #0000004D |

#### Fixed Mode

| State | Part | Token | Light | Dark |
| --- | --- | --- | --- | --- |
| Selected | Active dot fill | system/fixed_color/icon/default | #FFFFFF | #FFFFFF |
| Selected | Active dot stroke | system/fixed_color/outline/gray-300 | #3E3E3E | #3E3E3E |
| — | Inactive dot fill | system/fixed_color/icon/white-300a-same | #FFFFFF4D | #FFFFFF4D |
| — | Inactive dot stroke | system/fixed_color/outline/default-reverse-300a | #0000004D | #0000004D |

**Pagination List**

#### Light/Dark Mode

| State | Part | Token | Light | Dark |
| --- | --- | --- | --- | --- |
| Selected | Slot_Number 텍스트 | system/color/text/default | #000000 | #FFFFFF |
| — | Slot_Number 텍스트 | system/color/text/400a | #00000080 | #FFFFFF80 |
| — | Ellipsis dots | system/color/text/400a | #00000080 | #FFFFFF80 |
| Active | Prev / Next 아이콘 | system/color/icon/default | #000000 | #FFFFFF |
| Inactive | Prev / Next 아이콘 | system/color/icon/200a | #00000033 | #FFFFFF33 |

#### Fixed Mode

| State | Part | Token | Light | Dark |
| --- | --- | --- | --- | --- |
| Selected | Slot_Number 텍스트 | system/fixed_color/text/default | #FFFFFF | #FFFFFF |
| — | Slot_Number 텍스트 | system/fixed_color/text/400a | #FFFFFF80 | #FFFFFF80 |
| — | Ellipsis dots | system/fixed_color/icon/400a | #FFFFFF80 | #FFFFFF80 |
| Active | Prev / Next 아이콘 | system/fixed_color/icon/default | #FFFFFF | #FFFFFF |
| Inactive | Prev / Next 아이콘 | system/fixed_color/icon/200a | #FFFFFF33 | #FFFFFF33 |

## Usage Do / Don't

### 사용 맥락

Do

- 여러 개의 콘텐츠가 제공됨을 인지하기 어려운 경우, Pagination을 적용해야 한다.
- 콘텐츠를 훑어보는 등 정확한 정보량 제공이 필요 없는 경우, Dot Pagination을 사용해야 한다.
- 명확한 숫자로 사용자가 보고 있는 콘텐츠를 표시해야 하는 경우, List Pagination을 사용해야 한다.

Don't

- 여러 개의 콘텐츠가 제공됨을 인지할 수 있는 경우, Pagination 적용을 지양해야 한다.
- 과도한 정보량과 Pagination을 동시에 제공하지 않아야 한다.

### 노출 위치

Do

- 페이지 하단에 위치하도록 해야 한다.
- 콘텐츠 외부에 사용할 경우, 가시성 확보를 위해 Fixed 모드로 적용해야 한다.
- 콘텐츠 내부에 레이어링하여 사용할 경우, Default 모드로 적용해야 한다.

Don't

- 페이지 상단에 Pagination을 노출하지 않아야 한다.
- 콘텐츠 외부에 가시성이 부족한 Default 모드를 적용하지 않아야 한다.
- 콘텐츠 내부에 레이어링하여 사용할 경우, 가시성이 부족한 Fixed 모드 적용을 지양해야 한다.

### Dot 노출 규칙

Do

- 콘텐츠가 6개 이상일 경우, Dot 인터랙션(Ellipsis Dot)을 통해 현재 위치 인지를 도와야 한다.

Don't

- Dot을 5개 초과 노출하지 않아야 한다.

### List 최대 노출 개수

Do

- List Pagination은 최대 999페이지 콘텐츠까지 노출해야 한다.

Don't

- 999페이지를 초과하는 콘텐츠를 노출하지 않아야 한다.

## Interaction

Pagination의 페이지 변경에 따른 슬롯 표시 규칙.

### Dot Pagination

- 전체 2~5 Pages: 페이지 수만큼 기본 Dot을 순차적으로 노출합니다. Active Dot이 사용자의 탐색에 따라 이동합니다.
- 전체 6+ Pages: 최대 6개의 슬롯을 노출하며, Ellipsis Dot (Mid / End)으로 나머지를 축약합니다.

| 선택 위치 | 슬롯 표현 |
| --- | --- |
| [1] ~ [3] | 오른쪽 2개 슬롯이 Ellipsis Dot Mid, End로 표시됩니다. |
| [4] ~ [LastPage - 3] | 왼쪽 2개 슬롯이 Ellipsis Dot End, Mid로 표시되며 Active Dot은 4번 슬롯에 고정됩니다. |
| [LastPage - 2] ~ [LastPage] | 왼쪽 2개 슬롯이 Ellipsis Dot End, Mid로 표시됩니다. |

### List Pagination

이전/다음 버튼과 최대 7개의 숫자 및 Ellipsis 슬롯을 기준으로 동작합니다. 전체 페이지 수와 현재 활성 페이지에 따라 슬롯 내용이 변경됩니다.

| 페이지 수 | 동작 |
| --- | --- |
| 2~7페이지 | Ellipsis 없이 모든 페이지 번호를 순차적으로 노출합니다. |
| 8페이지 | [1]~[4] 선택 시 6번째 슬롯에만 Ellipsis 표시. [5]~[LastPage] 선택 시 2번째 슬롯에 Ellipsis 표시. |
| 9+ 페이지 | [1]~[4]: 6번째 슬롯에만 Ellipsis. [5]~[LastPage-4]: 2번째와 6번째 슬롯에 Ellipsis. [LastPage-3]~[LastPage]: 2번째 슬롯에만 Ellipsis. |
