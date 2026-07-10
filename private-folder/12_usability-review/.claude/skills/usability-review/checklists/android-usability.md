# Android Usability Checklist

source_checked_date: 2026-06-11
guideline: Material Design 3

---

## Items

### and-ux-material-component
- title: Material 컴포넌트 적절 사용
- severity: minor
- verifiable_from: figma, screenshot
- judgment_criteria: |
    버튼: Filled / Tonal / Outlined / Text 버튼 역할에 맞게 사용.
    카드: Elevated / Filled / Outlined 구분.
    커스텀 컴포넌트라면 Material 스펙과 일관성 있는 스타일 확인.
- source_url: https://m3.material.io/components
- fail_example: "기본 작업 버튼에 Text button 사용 (Filled 버튼이 적합)"

### and-ux-nav-pattern
- title: 네비게이션 패턴 (Bottom Nav / Nav Drawer / Tabs)
- severity: major
- verifiable_from: screenshot
- judgment_criteria: |
    Bottom Navigation: 최상위 목적지 3-5개, 항상 하단 고정.
    Navigation Drawer: 많은 목적지 또는 계층 구조.
    Tabs: 동일 계층 콘텐츠 전환.
    세 가지 혼용 금지 (Bottom Nav + Tabs 동시 사용은 맥락에 따라 허용).
- source_url: https://m3.material.io/components/navigation-bar/overview
- fail_example: "Bottom Nav 항목 6개 이상"

### and-ux-fab
- title: FAB 사용 목적 적절성
- severity: minor
- verifiable_from: screenshot
- judgment_criteria: |
    FAB은 화면의 가장 중요한 단일 동작 1개에만 사용.
    여러 FAB 금지 (Extended FAB 1개 또는 FAB 1개).
    부차적 동작에는 다른 버튼 타입 사용.
- source_url: https://m3.material.io/components/floating-action-button/overview
- fail_example: "FAB 2개 동시 표시"

### and-ux-system-back
- title: 시스템 백버튼 / 제스처 뒤로가기 동작
- severity: major
- verifiable_from: runtime
- judgment_criteria: |
    시스템 백 제스처(스와이프) 또는 백버튼이 화면 스택을 올바르게 탐색.
    다이얼로그/모달 닫기, 화면 종료 시 데이터 유실 없음.
    런타임 검증 필요 → Needs Evidence.
- source_url: https://developer.android.com/guide/navigation/principles
- evidence_needed: "기기에서 백 제스처 및 백버튼 동작 확인"

### and-ux-dark-mode
- title: 다크 모드 대응
- severity: minor
- verifiable_from: figma
- judgment_criteria: |
    Figma에 라이트/다크 모드 프레임이 둘 다 존재하면 Pass.
    라이트 프레임만 있으면 Needs Evidence (런타임 확인 필요).
    다크 모드에서도 색상 대비 AA 이상 유지.
- source_url: https://m3.material.io/styles/color/dynamic/overview
- evidence_needed: "기기에서 다크 모드 전환 후 화면 캡처 (Figma 다크 프레임 없는 경우)"

### and-ux-motion-match
- title: M3 motion 패턴 일치
- severity: major
- verifiable_from: video
- judgment_criteria: |
    Shared Axis X (가로 슬라이드 + fade): 형제 관계, 같은 종류 콘텐츠 (탭, carousel, pagination). X = 화면들이 좌우로 나란히 배치된 관계.
    Shared Axis Y (세로 슬라이드 + fade): 순차 단계 진행 (wizard step, 결제 진행). Y = 화면들이 위아래로 흐르는 관계.
    Shared Axis Z (scale + fade): 계층 깊이 진입, 시각적 연결 요소 없을 때. Z = 카드 더미처럼 쌓여있고 안쪽으로 들어가는 관계.
    Container Transform: 카드/썸네일 등 진입 요소 자체가 다음 화면으로 morph. 시각적 연결 있을 때.
    Fade Through: 관계 약한 형제 (Bottom Nav 의 완전히 다른 섹션 — 홈 ↔ 마이페이지).
    풀스크린 dialog: 세로 슬라이드.
    잘못된 매핑 시 Fail.
    예: 탭 전환에 Container Transform (형제 관계인데 morph 시도) → Fail.
    예: 카드 상세 진입에 Shared Axis X (시각적 연결 있는데 단순 슬라이드) → Fail.
    예: wizard 다음 스텝에 Shared Axis X (순차 진행은 Y축) → Fail.
    영상 없으면 Needs Evidence.
- source_url: https://m3.material.io/styles/motion/transitions/transition-patterns
- source_checked_date: 2026-06-11
- evidence_needed: "영상에서 화면 전환 모션 캡처 (전환 시작/중간/끝 프레임)"
