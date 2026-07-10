# Android Accessibility Checklist

source_checked_date: 2026-06-11
guideline: Material Design 3 — Accessibility

---

## Items

### and-a11y-touch-target
- title: 터치 타겟 48×48dp 이상
- severity: critical
- verifiable_from: screenshot
- judgment_criteria: |
    모든 인터랙티브 요소의 touch target이 48×48dp 이상.
    아이콘이 작아도 투명 padding으로 48×48dp 확보하면 Pass.
    Figma dp 단위 기준 측정.
- source_url: https://m3.material.io/foundations/designing/structure#touch-targets
- fail_example: "아이콘 버튼 24×24dp, padding 없음"

### and-a11y-contrast
- title: 색상 대비 WCAG AA
- severity: critical
- verifiable_from: screenshot, figma
- judgment_criteria: |
    본문 텍스트: 4.5:1 이상
    큰 텍스트 (18sp 이상 또는 bold 14sp 이상): 3:1 이상
    UI 컴포넌트/아이콘: 3:1 이상
    다크 모드가 있는 경우 양쪽 모두 확인.
- source_url: https://m3.material.io/foundations/accessibility/overview#color-contrast
- fail_example: "회색 플레이스홀더 텍스트 대비 2.1:1"

### and-a11y-talkback
- title: TalkBack contentDescription
- severity: major
- verifiable_from: code
- judgment_criteria: |
    아이콘-only, 이미지 등 텍스트 없는 인터랙티브 요소에 contentDescription 설정.
    장식용 이미지는 contentDescription="" (empty string) 설정.
    코드 또는 레이아웃 XML 확인 필요 → Needs Evidence.
- source_url: https://m3.material.io/foundations/accessibility/overview#screen-readers
- evidence_needed: "레이아웃 XML 또는 Compose의 contentDescription 파라미터 확인"

### and-a11y-text-sp
- title: 텍스트 크기 sp 단위 + 확대 대응
- severity: major
- verifiable_from: runtime
- judgment_criteria: |
    텍스트 크기 sp 단위 사용 (dp 고정 금지).
    시스템 폰트 크기 설정 200% 확대 시 텍스트 잘림/겹침 없음.
    런타임 검증 필요 → Needs Evidence.
- source_url: https://m3.material.io/foundations/designing/structure#text-scale
- evidence_needed: "시스템 폰트 크기 최대 설정 후 화면 캡처"

### and-a11y-focus-indicator
- title: 키보드/포커스 인디케이터
- severity: major
- verifiable_from: runtime
- judgment_criteria: |
    키보드 또는 D-pad 탐색 시 포커스된 요소가 시각적으로 명확히 표시.
    포커스 순서가 논리적 (좌→우, 상→하).
    런타임 검증 필요 → Needs Evidence.
- source_url: https://m3.material.io/foundations/accessibility/overview#keyboard-navigation
- evidence_needed: "외부 키보드 또는 D-pad 연결 후 포커스 이동 테스트"
