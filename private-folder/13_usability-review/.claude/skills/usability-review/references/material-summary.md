# Material Design 3 핵심 룰 요약

source_checked_date: 2026-06-11
platform: Android

---

## Accessibility

| 룰 | 기준 | 출처 |
|---|---|---|
| 터치 타겟 | 48×48dp 이상 | [Structure — touch targets](https://m3.material.io/foundations/designing/structure#touch-targets) |
| 색상 대비 (본문) | 4.5:1 이상 (WCAG AA) | [Accessibility — color contrast](https://m3.material.io/foundations/accessibility/overview#color-contrast) |
| 색상 대비 (큰 텍스트/UI) | 3:1 이상 | [Accessibility — color contrast](https://m3.material.io/foundations/accessibility/overview#color-contrast) |
| TalkBack contentDescription | 텍스트 없는 요소에 필수, 장식용은 "" | [Screen readers](https://m3.material.io/foundations/accessibility/overview#screen-readers) |
| 텍스트 크기 단위 | sp 단위 사용 (dp 고정 금지) | [Structure — text scale](https://m3.material.io/foundations/designing/structure#text-scale) |
| 포커스 인디케이터 | 키보드/D-pad 탐색 시 시각적 표시 | [Keyboard navigation](https://m3.material.io/foundations/accessibility/overview#keyboard-navigation) |

## Navigation

| 룰 | 기준 | 출처 |
|---|---|---|
| Bottom Navigation | 3-5개 최상위 목적지, 하단 고정 | [Navigation bar](https://m3.material.io/components/navigation-bar/overview) |
| Navigation Drawer | 많은 목적지 또는 계층 구조 | [Navigation drawer](https://m3.material.io/components/navigation-drawer/overview) |
| Tabs | 동일 계층 콘텐츠 전환 | [Tabs](https://m3.material.io/components/tabs/overview) |
| 시스템 백버튼 | 스택 올바른 탐색, 데이터 유실 없음 | [Navigation principles](https://developer.android.com/guide/navigation/principles) |

## Motion / Transitions

### 5가지 패턴 요약

| 패턴 | 화면 관계 | 시각적 효과 | 출처 |
|---|---|---|---|
| Shared Axis X | 형제, 같은 레벨 (옆에 나란히) | 가로 슬라이드 + fade | [Transition patterns](https://m3.material.io/styles/motion/transitions/transition-patterns) |
| Shared Axis Y | 순차 단계 진행 | 세로 슬라이드 + fade | [Transition patterns](https://m3.material.io/styles/motion/transitions/transition-patterns) |
| Shared Axis Z | 계층 진입 (깊이 이동) | scale + fade — 들어갈수록 확대 | [Transition patterns](https://m3.material.io/styles/motion/transitions/transition-patterns) |
| Container Transform | 요소 → 상세 (시각적 연결 있음) | 카드/썸네일이 화면으로 morph | [Transition patterns](https://m3.material.io/styles/motion/transitions/transition-patterns) |
| Fade Through | 관계 약한 형제 (종류 다름) | fade out → fade in + slight scale | [Transition patterns](https://m3.material.io/styles/motion/transitions/transition-patterns) |

### 축(Axis) 개념

- **X = 가로축 = 좌우 평면 이동**: 화면들이 옆으로 나란히 놓여있는 관계. 탭 전환, 페이지네이션, carousel.
- **Y = 세로축 = 상하 평면 이동**: 화면들이 위에서 아래로 흐르는 순차 관계. wizard step, 결제 단계.
- **Z = 깊이축 = 안쪽으로 진입**: 화면들이 카드 더미처럼 쌓여있고 안쪽으로 들어가는 관계. drill-down, 메뉴 → 서브메뉴.

### 패턴 선택 의사결정 트리

1. 진입 요소와 다음 화면이 **시각적으로 연결**되는가? (카드/썸네일 → 상세)
   → **Container Transform**
2. 같은 레벨 형제 화면인가?
   - 콘텐츠 종류 **같음** (탭, carousel) → **Shared Axis X**
   - 콘텐츠 종류 **다름** (홈 ↔ 마이페이지) → **Fade Through**
3. 순차 단계 진행인가? (스텝 1 → 2)
   → **Shared Axis Y**
4. 계층 깊이 이동인가? (메뉴 → 서브메뉴, 시각적 연결 요소 없음)
   → **Shared Axis Z**

### 자주 보는 실수

| 잘못된 사용 | 올바른 패턴 | 이유 |
|---|---|---|
| 탭 전환에 Container Transform | Shared Axis X | 형제 관계, morph 할 단일 요소 없음 |
| 카드 상세 진입에 Shared Axis X | Container Transform | 시각적 연결 요소(카드) 있음 |
| wizard 다음 스텝에 Shared Axis X | Shared Axis Y | 순차 진행은 세로축(Y) 의미 |
| 홈 ↔ 마이페이지를 Shared Axis X | Fade Through | 종류 다른 형제 → fade |
| 모달을 Shared Axis X 로 등장 | 세로 슬라이드 (풀스크린 dialog) | 모달은 별도 컨텍스트 |

## Components

| 룰 | 기준 | 출처 |
|---|---|---|
| 버튼 위계 | Filled > Tonal > Outlined > Text 순 중요도 | [Buttons](https://m3.material.io/components/buttons/overview) |
| FAB | 가장 중요한 단일 동작 1개, 여러 개 금지 | [FAB](https://m3.material.io/components/floating-action-button/overview) |
| 카드 | Elevated / Filled / Outlined 역할 구분 | [Cards](https://m3.material.io/components/cards/overview) |

## Color / Dark Mode

| 룰 | 기준 | 출처 |
|---|---|---|
| Color Scheme | Material Color System — Primary, Secondary, Tertiary | [Color roles](https://m3.material.io/styles/color/roles) |
| 다크 모드 | 라이트/다크 모두 대비 AA 유지 | [Dynamic color](https://m3.material.io/styles/color/dynamic/overview) |
