# Review: 로그인 화면

Date: 2026-06-11 15:10
Input: none (mock dry-run — 화면 설명만 사용)
Platforms: iOS, Android
Tools used: none (no Figma URL / screenshot 제공 없음)

> **주의:** 시각 입력 없는 mock 리뷰. screenshot/figma verifiable 항목은 모두 Needs Evidence 처리. 실제 리뷰 시 Figma URL 또는 스크린샷 필요.

화면 설명: 이메일 + 비밀번호 입력 필드, 로그인 버튼, 소셜 로그인 버튼 2개 (카카오, 애플 추정), 하단 탭바 없음.

---

## iOS — Accessibility

- [?] (ios-a11y-touch-target) 터치 타겟 44×44pt 이상 — **Needs Evidence**: 소셜 로그인 버튼 hit area 측정 필요. 스크린샷 또는 Figma 레이어 크기 확인.
- [?] (ios-a11y-contrast) 색상 대비 WCAG AA — **Needs Evidence**: 플레이스홀더 텍스트 및 버튼 텍스트 색상값 측정 필요. Figma 또는 스크린샷 색상 피커 확인.
- [?] (ios-a11y-color-only) 색상에만 의존하지 않는 상태 표시 — **Needs Evidence**: 이메일/비밀번호 입력 오류 상태 UI 확인 필요. 오류 텍스트 또는 아이콘 병행 여부 스크린샷 확인.
- [?] (ios-a11y-voiceover-label) VoiceOver 접근성 레이블 — **Needs Evidence**: 소셜 로그인 버튼(아이콘) accessibilityLabel 코드 또는 접근성 트리 확인.
- [?] (ios-a11y-dynamic-type) Dynamic Type 텍스트 크기 확대 대응 — **Needs Evidence**: 시뮬레이터 AX5 설정 후 입력 필드/버튼 레이아웃 깨짐 확인.

## iOS — Usability

- [-] (ios-ux-nav-pattern) 네비게이션 패턴 — **N/A**: 로그인 화면은 앱 루트 또는 모달 진입점. 탭바 없음이 올바른 패턴.
- [?] (ios-ux-system-component) 시스템 컴포넌트 — **Needs Evidence**: 이메일/비밀번호 필드가 UITextField 또는 커스텀인지 Figma/코드 확인.
- [?] (ios-ux-state-feedback) 상태 피드백 (로딩/에러/빈 상태) — **Needs Evidence**: 로그인 버튼 탭 후 로딩 스피너 존재 여부, 로그인 실패 에러 상태 Figma 프레임 확인.
- [-] (ios-ux-modal-sheet) 모달/시트 적절성 — **N/A**: 로그인 화면 자체가 모달/시트를 사용하지 않음.
- [?] (ios-ux-gesture-back) 스와이프 뒤로가기 — **Needs Evidence**: 로그인 화면이 네비게이션 스택으로 push된 경우 엣지 스와이프 동작 런타임 확인.

---

## Android — Accessibility

- [?] (and-a11y-touch-target) 터치 타겟 48×48dp 이상 — **Needs Evidence**: 소셜 로그인 버튼 touch target dp 측정 필요. Figma 또는 스크린샷 확인.
- [?] (and-a11y-contrast) 색상 대비 WCAG AA — **Needs Evidence**: iOS와 동일. 색상값 측정 필요.
- [?] (and-a11y-talkback) TalkBack contentDescription — **Needs Evidence**: 소셜 로그인 아이콘 버튼 contentDescription 레이아웃 XML 또는 Compose 파라미터 확인.
- [?] (and-a11y-text-sp) 텍스트 크기 sp 단위 + 확대 대응 — **Needs Evidence**: 코드에서 sp 단위 사용 확인, 폰트 크기 200% 설정 후 런타임 캡처.
- [?] (and-a11y-focus-indicator) 포커스 인디케이터 — **Needs Evidence**: 외부 키보드 D-pad 탐색 시 입력 필드 → 버튼 포커스 이동 런타임 확인.

## Android — Usability

- [?] (and-ux-material-component) Material 컴포넌트 — **Needs Evidence**: 로그인 버튼 타입 (Filled 권장) 및 입력 필드 (OutlinedTextField 권장) Figma 확인.
- [-] (and-ux-nav-pattern) 네비게이션 패턴 — **N/A**: 로그인 화면에 Bottom Nav / Nav Drawer 불필요.
- [-] (and-ux-fab) FAB 적절성 — **N/A**: 로그인 화면에 FAB 없는 것이 올바른 패턴.
- [?] (and-ux-system-back) 시스템 백버튼 — **Needs Evidence**: 로그인 화면이 백 제스처로 닫히는지 (앱 종료 또는 온보딩 복귀) 런타임 확인.
- [?] (and-ux-dark-mode) 다크 모드 대응 — **Needs Evidence**: Figma에 다크 모드 로그인 프레임 없음. 기기 다크 모드 전환 후 색상 대비 캡처.

---

## Summary

| 항목 | iOS | Android |
|---|---|---|
| Pass | 0 | 0 |
| Fail | 0 | 0 |
| N/A | 3 | 2 |
| Needs Evidence | 7 | 8 |
| **합계** | **10** | **10** |

- Critical fails: 0
- 자동 판정 비율: (Pass+Fail) / (Pass+Fail+N/A+Needs Evidence) = 0% ← **시각 입력 없음에 기인. 실제 리뷰 시 ~40-60% 예상.**

### Critical Fails
없음 (시각 입력 없어 판정 불가)

### Needs Evidence 목록

**공통 (iOS + Android)**
- (a11y-touch-target) 소셜 로그인 버튼 hit area: Figma 레이어 크기 또는 스크린샷
- (a11y-contrast) 플레이스홀더/버튼 텍스트 색상 대비: Figma 색상값
- (a11y-voiceover/talkback) 소셜 버튼 접근성 레이블: 코드 확인
- (ux-state-feedback) 로딩/에러 상태: Figma 상태 프레임
- (ux-dark-mode) 다크 모드 프레임: Figma 또는 런타임

---

## 판정 기호
- `[x]` Pass
- `[ ]` Fail
- `[-]` N/A (해당 없음)
- `[?]` Needs Evidence (정적 입력으로 판단 불가)
