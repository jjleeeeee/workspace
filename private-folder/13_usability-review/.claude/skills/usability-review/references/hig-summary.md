# HIG (Human Interface Guidelines) 핵심 룰 요약

source_checked_date: 2026-06-11
platform: iOS, iPadOS

---

## Accessibility

| 룰 | 기준 | 출처 |
|---|---|---|
| 터치 타겟 | 44×44pt 이상 | [Buttons and controls](https://developer.apple.com/design/human-interface-guidelines/accessibility#Buttons-and-controls) |
| 색상 대비 (본문) | 4.5:1 이상 (WCAG AA) | [WCAG 2.1 SC 1.4.3](https://www.w3.org/WAI/WCAG21/quickref/#contrast-minimum) |
| 색상 대비 (큰 텍스트) | 3:1 이상 (18pt+ 또는 bold 14pt+) | [WCAG 2.1 SC 1.4.3](https://www.w3.org/WAI/WCAG21/quickref/#contrast-minimum) |
| 색상 의존 금지 | 색상 외 보조 수단 병행 | [Color and effects](https://developer.apple.com/design/human-interface-guidelines/color#Color-and-effects) |
| VoiceOver 레이블 | 모든 인터랙티브 요소에 accessibilityLabel | [Labels](https://developer.apple.com/design/human-interface-guidelines/accessibility#Labels) |
| Dynamic Type | UIFont.preferredFont 또는 scaledFont 사용, AX5 대응 | [Dynamic Type sizes](https://developer.apple.com/design/human-interface-guidelines/typography#Dynamic-Type-sizes) |

## Navigation

| 룰 | 기준 | 출처 |
|---|---|---|
| Tab Bar | 최상위 목적지 최대 5개, 하단 고정 | [Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars) |
| Navigation Bar | 계층 이동 시 Back 버튼 필수 | [Navigation bars](https://developer.apple.com/design/human-interface-guidelines/navigation-bars) |
| Modal | 집중 필요 단순 작업만, 항상 닫기 수단 존재 | [Modality](https://developer.apple.com/design/human-interface-guidelines/modality) |
| Sheet | 일시적 작업, 스와이프로 닫기 가능 | [Sheets](https://developer.apple.com/design/human-interface-guidelines/sheets) |

## Motion / Transitions

### 컴포넌트별 화면 관계 ↔ 트랜지션 매핑

| 컴포넌트 | 표현하는 화면 관계 | 기본 트랜지션 | 출처 |
|---|---|---|---|
| Navigation bar (push/pop) | 계층 진입 — drill-down, 안으로 들어가는 이동 | 가로 슬라이드 (진입 오른쪽→왼쪽, 이탈 왼쪽→오른쪽) | [Navigation bars](https://developer.apple.com/design/human-interface-guidelines/navigation-bars) |
| Tab bar | 형제 관계 — 최상위 평면 전환 | 트랜지션 없음 (즉시 교체) | [Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars) |
| Sidebar (iPadOS) | 형제 관계 — 평면 전환 | 트랜지션 없음 | [Sidebars](https://developer.apple.com/design/human-interface-guidelines/sidebars) |
| Modal (full-screen) | 별도 컨텍스트 — 집중 필요 작업 | 아래→위 풀스크린 슬라이드, 닫기 수단 필수 | [Modality](https://developer.apple.com/design/human-interface-guidelines/modality) |
| Sheet | 일시적 작업 — 현재 컨텍스트 위에 부분 표시 | 하단에서 위로 partial 등장, swipe down dismiss | [Sheets](https://developer.apple.com/design/human-interface-guidelines/sheets) |
| Popover (iPadOS) | 임시 정보 — 특정 요소에서 호출 | 화살표로 호출 요소 가리키며 등장 | [Popovers](https://developer.apple.com/design/human-interface-guidelines/popovers) |

### 화면 관계 → 컴포넌트/트랜지션 선택

1. **계층 진입 (목록 → 상세, 메뉴 → 서브메뉴)?**
   → Navigation bar push, 가로 슬라이드
2. **최상위 형제 전환 (메인 섹션 간)?**
   → Tab bar, 트랜지션 없음
3. **별도 컨텍스트, 집중 필요한 작업 (긴 폼, 풀스크린)?**
   → Modal, 세로 슬라이드
4. **현재 컨텍스트 유지하며 잠깐 작업 (옵션 선택, 공유)?**
   → Sheet, 하단에서 partial 등장

### 자주 보는 실수

| 잘못된 사용 | 올바른 선택 | 이유 |
|---|---|---|
| 형제 탭 전환을 modal 풀스크린으로 | Tab bar | 형제 관계는 평면 전환 |
| 긴 설정 화면을 sheet 으로 | Modal 또는 push | 복잡한 작업은 별도 컨텍스트 필요 |
| 계층 drill-down 을 modal 로 | Navigation bar push | drill-down 은 가로 슬라이드가 표준 |
| Modal 에 닫기 수단 없음 | 닫기 버튼 또는 swipe 추가 | HIG Modality 닫기 수단 필수 |

## Gestures

| 룰 | 기준 | 출처 |
|---|---|---|
| 뒤로가기 스와이프 | 좌→우 엣지 스와이프, 네비게이션 스택 pop | [Gestures](https://developer.apple.com/design/human-interface-guidelines/gestures) |

## Components

| 룰 | 기준 | 출처 |
|---|---|---|
| 시스템 컴포넌트 우선 | 커스텀 전에 UIKit/SwiftUI 표준 컴포넌트 검토 | [Components](https://developer.apple.com/design/human-interface-guidelines/components) |

## States

| 룰 | 기준 | 출처 |
|---|---|---|
| 로딩 상태 | 스피너 또는 스켈레톤 UI 제공 | [Loading](https://developer.apple.com/design/human-interface-guidelines/loading) |
| 빈 상태 | 안내 문구 + CTA 제공 | [Empty states](https://developer.apple.com/design/human-interface-guidelines/empty-states) |
