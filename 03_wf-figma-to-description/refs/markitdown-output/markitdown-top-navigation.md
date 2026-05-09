# CDS / Components / Top Navigation

# [Usage] Top Navigation

Top Navigation은 페이지 이동이 가능한 아이콘을 제공하고 현재 페이지의 제목을 노출하기 위해 화면 상단에 사용하는 탐색 컴포넌트입니다.

## Context

Top Navigation은 뒤로가기, 닫기, 공유, 검색처럼 현재 화면의 맥락과 직접 연결된 탐색 또는 액션을 제공할 때 사용해야 합니다. Default, Left, Center, Img, Img+Text, Logo Svg, Search 타입 중 화면 목적에 맞는 구성을 선택해야 합니다. Bottom Navigation이 앱의 주요 영역 이동을 담당한다면, Top Navigation은 현재 페이지 안에서 사용자가 어디에 있고 무엇을 할 수 있는지 알려야 합니다.

## Principle

- 높이는 48px로 고정해 탐색 영역의 위치와 조작 가능성을 유지해야 합니다.
- Leading, Trailing 아이콘을 활용해 다른 페이지로 이동할 수 있어야 합니다.
- 아이콘은 Leading, Trailing 합쳐 4개까지만 노출해야 합니다.
- 스크롤 중에도 탐색 영역의 가독성과 조작 가능성을 보장해야 합니다.

## Usage Do / Don't

### Icon

Do

- Leading과 Trailing을 합쳐 아이콘은 최대 4개까지 노출해야 합니다.
- SVG 중앙 정렬 타입에서는 Leading과 Trailing을 최대 1개씩만 노출해야 합니다.

Don't

- SVG 중앙 정렬 타입에서 Trailing 아이콘을 2개 이상 사용하지 않아야 합니다. (조작 위계 혼동)
- 기능을 예측하기 어려운 커스텀 아이콘을 사용하지 않아야 합니다. (기능 인지 저하)

### 고정 영역

Do

- 스크롤 시 Navigation의 가독성을 유지하기 위해 BG 컬러를 적용해야 합니다.

Don't

- 콘텐츠가 Navigation 아래로 비쳐 제목이나 아이콘을 읽기 어렵게 만들지 않아야 합니다. (가독성 저하)

### OS 위치

Do

- OS 사용성에 맞는 위치에 닫기, 뒤로가기, 액션 아이콘을 배치해야 합니다.

Don't

- Android와 iOS의 관습과 다른 위치에 주요 이동 아이콘을 배치하지 않아야 합니다. (조작 예측 실패)

### 긴 타이틀

Do

- 아티스트명이나 타이틀이 최대 너비보다 길 경우 Marquee를 사용해야 합니다.

Don't

- 중요한 이름을 말줄임으로 잘라내지 않아야 합니다. (식별 정보 손실)

### Logo

Do

- 이미지와 로고는 최대 너비 180px 안에서 사용해야 합니다.

Don't

- 로고를 180px보다 크게 노출하지 않아야 합니다. (레이아웃 침범)
- Android에서 PNG 또는 SVG가 좌측에 노출될 때 닫기 버튼을 함께 제공하지 않아야 합니다. (OS 사용성 충돌)

### Title

Do

- 현재 페이지를 대표하는 짧은 제목을 노출해야 합니다.

Don't

- 본문 설명이나 부가 정보를 타이틀 영역에 넣지 않아야 합니다. (정보 위계 혼동)
