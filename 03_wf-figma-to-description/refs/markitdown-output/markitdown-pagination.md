# CDS / Components / Pagination

# [Usage] Pagination

Pagination은 한 화면에 담을 수 없는 여러 개의 콘텐츠를 효율적으로 분할하여, 사용자가 현재 위치를 탐색하고 이동을 제어하기 위해 사용하는 탐색 컴포넌트입니다.

## Context

Pagination은 여러 개의 콘텐츠가 있음을 사용자가 인지하기 어렵거나, 콘텐츠가 여러 페이지로 나뉘어 현재 위치와 이동 가능한 범위를 보여줘야 할 때 사용해야 합니다. 사용성에 따라 Dot Pagination과 List Pagination을 구분해야 하며, 콘텐츠를 훑어보는 등 정확한 정보량 제공이 필요 없는 경우에는 Dot Pagination을 사용해야 합니다. 명확한 숫자로 사용자가 보고 있는 콘텐츠를 표시해야 하는 경우에는 List Pagination을 사용해야 하며, WEB 환경에서 사용을 권장합니다. List Pagination에서 8개 이상의 페이지가 적용될 경우 축약된 형태를 사용해야 하고, 최대 999 페이지까지 노출할 수 있습니다.

## Principle

- 여러 개의 콘텐츠가 있음을 인지하기 어려운 경우 Pagination을 적용해야 합니다.
- 사용성에 따라 Dot Pagination과 List Pagination을 구분하여 사용해야 합니다.
- List Pagination은 페이지 수가 많을 때 Slot과 Ellipsis로 이동 범위를 압축해야 합니다.
- WEB 환경에서는 해상도에 따라 Large와 Small 사이즈를 적용해 가시성을 확보해야 합니다.

## Usage Do / Don't

### 적용 기준

Do

- 여러 콘텐츠가 제공됨을 사용자가 인지하기 어려운 경우 Pagination을 적용해야 합니다.

Don't

- 한 화면에서 충분히 탐색 가능한 콘텐츠에 Pagination을 추가하지 않아야 합니다. (불필요한 조작 증가)

### Dot Pagination

Do

- 콘텐츠를 훑어보는 등 정확한 정보량 제공이 필요 없는 경우 Dot Pagination을 사용해야 합니다.

Don't

- 특정 페이지 번호 이동이 필요한 목록에 Dot Pagination만 사용하지 않아야 합니다. (탐색 제어 부족)

### List Pagination

Do

- 명확한 숫자로 사용자가 보고 있는 콘텐츠를 표시해야 하는 경우 List Pagination을 사용해야 합니다.

Don't

- 정확한 페이지 위치와 이동 제어가 필요한 WEB 목록에 Dot Pagination만 사용하지 않아야 합니다. (현재 위치 파악 부족)

### List Pagination - 축약

Do

- 8개 이상의 페이지가 적용될 경우 Slot과 Ellipsis로 축약된 형태를 사용해야 합니다.

Don't

- 모든 페이지 번호를 한 줄에 과도하게 노출하지 않아야 합니다. (가독성 저하)

### List Pagination - 배치

Do

- List Pagination은 목록 하단에 노출해야 합니다.

Don't

- List Pagination을 페이지 상단에 노출하지 않아야 합니다. (탐색 흐름 역전)

### List Pagination - Size

Do

- WEB 환경에서는 해상도에 따라 Large와 Small 사이즈를 적용해 가시성을 확보해야 합니다.

Don't

- 좁은 해상도에서 Large 사이즈를 고정해 콘텐츠 영역을 침범하지 않아야 합니다. (레이아웃 압박)
