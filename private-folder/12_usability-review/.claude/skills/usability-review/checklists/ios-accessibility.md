# iOS Accessibility Checklist

source_checked_date: 2026-06-11
guideline: Apple Human Interface Guidelines — Accessibility

---

## Items

### ios-a11y-touch-target
- title: 터치 타겟 44×44pt 이상
- severity: critical
- verifiable_from: screenshot
- judgment_criteria: |
    모든 버튼, 링크, 탭 등 인터랙티브 요소의 hit area가 44×44pt 이상.
    아이콘이 작아도 투명 padding으로 hit area 확보했으면 Pass.
    측정 불가한 경우 Figma 레이어 크기 기준.
- source_url: https://developer.apple.com/design/human-interface-guidelines/accessibility#Buttons-and-controls
- fail_example: "아이콘 버튼 크기 28×28pt, hit area 확장 없음"

### ios-a11y-contrast
- title: 색상 대비 WCAG AA
- severity: critical
- verifiable_from: screenshot, figma
- judgment_criteria: |
    본문 텍스트: 4.5:1 이상 (18pt 미만 또는 bold 14pt 미만)
    큰 텍스트: 3:1 이상 (18pt 이상 또는 bold 14pt 이상)
    UI 컴포넌트/아이콘: 3:1 이상
    Figma 색상값 확인 후 대비 계산.
- source_url: https://www.w3.org/WAI/WCAG21/quickref/#contrast-minimum
- fail_example: "본문 텍스트 #999999 on #ffffff = 2.85:1 (목표 4.5:1)"

### ios-a11y-color-only
- title: 색상에만 의존하지 않는 상태 표시
- severity: major
- verifiable_from: screenshot
- judgment_criteria: |
    오류, 성공, 경고 등 상태를 색상만으로 구분하지 않음.
    아이콘, 텍스트, 패턴 등 보조 수단 병행 사용 확인.
- source_url: https://developer.apple.com/design/human-interface-guidelines/color#Color-and-effects
- fail_example: "입력 필드 오류를 빨간 테두리 색상만으로 표시, 텍스트/아이콘 없음"

### ios-a11y-voiceover-label
- title: VoiceOver 접근성 레이블
- severity: major
- verifiable_from: runtime, code
- judgment_criteria: |
    모든 인터랙티브 요소에 의미 있는 accessibilityLabel 존재.
    아이콘-only 버튼은 동작을 설명하는 레이블 필수.
    Figma/스크린샷으로는 판단 불가 → Needs Evidence.
- source_url: https://developer.apple.com/design/human-interface-guidelines/accessibility#Labels
- evidence_needed: "접근성 트리 또는 SwiftUI/UIKit 코드에서 accessibilityLabel 확인"

### ios-a11y-dynamic-type
- title: Dynamic Type 텍스트 크기 확대 대응
- severity: major
- verifiable_from: runtime
- judgment_criteria: |
    가장 큰 접근성 텍스트 크기(AX5)에서 텍스트 잘림/겹침 없음.
    고정 폰트 크기 사용 금지, UIFont.preferredFont 또는 Dynamic Type 지원 확인.
    런타임 시뮬레이터로만 검증 가능 → Needs Evidence.
- source_url: https://developer.apple.com/design/human-interface-guidelines/typography#Dynamic-Type-sizes
- evidence_needed: "시뮬레이터에서 AX5 텍스트 크기 설정 후 스크린샷"
