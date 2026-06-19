# iOS Usability Checklist

source_checked_date: 2026-06-11
guideline: Apple Human Interface Guidelines

---

## Items

### ios-ux-nav-pattern
- title: 네비게이션 패턴 일관성
- severity: major
- verifiable_from: screenshot
- judgment_criteria: |
    탭바(Tab Bar): 5개 이하 최상위 목적지, 항상 하단 고정.
    네비게이션 바: 계층 이동 시 Back 버튼 또는 닫기 버튼 존재.
    모달/시트: 명확한 닫기 수단 (X 버튼 또는 스와이프) 존재.
    화면마다 다른 네비게이션 패턴 혼용 금지.
- source_url: https://developer.apple.com/design/human-interface-guidelines/tab-bars
- fail_example: "탭바 항목 7개 이상, 또는 Back 버튼 없는 계층 화면"

### ios-ux-system-component
- title: 시스템 컴포넌트 적절 사용
- severity: minor
- verifiable_from: figma, screenshot
- judgment_criteria: |
    UIKit/SwiftUI 표준 컴포넌트(Switch, Slider, Stepper, Picker 등) 와 유사한 역할을 하는 경우 커스텀보다 시스템 컴포넌트 우선.
    커스텀 컴포넌트라면 동작/모양이 시스템과 충분히 일관성 있는지 확인.
- source_url: https://developer.apple.com/design/human-interface-guidelines/components
- fail_example: "토글 스위치를 커스텀 버튼으로 구현, 시스템 Switch 패턴과 다른 동작"

### ios-ux-state-feedback
- title: 상태 피드백 (로딩/에러/빈 상태)
- severity: major
- verifiable_from: screenshot
- judgment_criteria: |
    로딩: 스피너 또는 스켈레톤 UI 존재.
    에러: 오류 메시지 + 재시도 수단 존재.
    빈 상태: 빈 화면 대신 안내 문구 또는 CTA 존재.
    Figma에 각 상태 프레임이 있는지로 판단.
- source_url: https://developer.apple.com/design/human-interface-guidelines/loading
- fail_example: "데이터 없을 때 빈 화면, 안내 없음"

### ios-ux-modal-sheet
- title: 모달/시트 사용 적절성
- severity: minor
- verifiable_from: screenshot
- judgment_criteria: |
    모달은 사용자 집중 필요 작업에만 사용 (확인, 간단한 입력 등).
    복잡한 탐색/계층이 필요한 경우 모달 금지, 네비게이션 푸시 사용.
    Sheet는 현재 컨텍스트에서 일시적 작업에 적합.
- source_url: https://developer.apple.com/design/human-interface-guidelines/sheets
- fail_example: "전체 설정 화면을 모달로 표시"

### ios-ux-gesture-back
- title: 스와이프 뒤로가기 동작 보장
- severity: major
- verifiable_from: runtime
- judgment_criteria: |
    네비게이션 스택에서 좌→우 스와이프로 뒤로가기 동작 가능.
    커스텀 제스처가 이를 방해하지 않는지 확인.
    런타임에서만 검증 가능 → Needs Evidence.
- source_url: https://developer.apple.com/design/human-interface-guidelines/gestures
- evidence_needed: "기기 또는 시뮬레이터에서 엣지 스와이프 뒤로가기 동작 확인"

### ios-ux-transition-match
- title: 화면 관계 ↔ 트랜지션 일치
- severity: major
- verifiable_from: video
- judgment_criteria: |
    Navigation bar push (계층 진입, drill-down): 가로 슬라이드. 진입 오른쪽→왼쪽, 이탈 왼쪽→오른쪽.
    Tab bar (최상위 형제 전환): 트랜지션 없음 (즉시 교체).
    Modal (별도 컨텍스트, 집중 필요 작업): 세로 슬라이드 (아래→위 진입), 닫기 수단(X 버튼 또는 swipe down) 필수.
    Sheet (현재 컨텍스트 유지 일시적 작업): 하단에서 위로 partial 등장, swipe down dismiss.
    화면 관계와 트랜지션 불일치 시 Fail.
    예: 형제 탭 간 이동을 modal 세로 슬라이드로 → Fail.
    예: 계층 drill-down 을 modal 로 → Fail.
    예: 복잡한 설정 화면을 sheet 으로 → Fail.
    영상 없으면 Needs Evidence.
- source_url: https://developer.apple.com/design/human-interface-guidelines/modality
- source_checked_date: 2026-06-11
- evidence_needed: "영상 또는 런타임에서 화면 진입/이탈 트랜지션 방향 확인"
