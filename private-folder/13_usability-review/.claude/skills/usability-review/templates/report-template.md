# Review: {{screen-name}}

Date: {{YYYY-MM-DD HH:MM}}
Input: {{figma-url OR 이미지 경로}}
Platforms: {{iOS | Android | iOS, Android}}
Tools used: {{사용된 Figma MCP 이름 또는 "screenshot"}}

---

## iOS — Accessibility

- [x] (ios-a11y-touch-target) 터치 타겟 44×44pt — **Pass**
- [ ] (ios-a11y-contrast) 색상 대비 WCAG AA — **Fail**: {{측정값, 예: #999/#fff = 2.8:1, 목표 4.5:1}}
- [-] (ios-a11y-color-only) 색상에만 의존하지 않는 상태 표시 — **N/A**: {{이유}}
- [?] (ios-a11y-voiceover-label) VoiceOver 레이블 — **Needs Evidence**: {{필요한 증거}}
- [?] (ios-a11y-dynamic-type) Dynamic Type 대응 — **Needs Evidence**: {{필요한 증거}}

## iOS — Usability

- [x] (ios-ux-nav-pattern) 네비게이션 패턴 — **Pass**
- [x] (ios-ux-system-component) 시스템 컴포넌트 — **Pass**
- [ ] (ios-ux-state-feedback) 상태 피드백 — **Fail**: {{근거}}
- [-] (ios-ux-modal-sheet) 모달/시트 적절성 — **N/A**: {{이유}}
- [?] (ios-ux-gesture-back) 스와이프 뒤로가기 — **Needs Evidence**: {{필요한 증거}}

---

## Android — Accessibility

- [x] (and-a11y-touch-target) 터치 타겟 48×48dp — **Pass**
- [ ] (and-a11y-contrast) 색상 대비 WCAG AA — **Fail**: {{측정값}}
- [?] (and-a11y-talkback) TalkBack contentDescription — **Needs Evidence**: {{필요한 증거}}
- [?] (and-a11y-text-sp) 텍스트 sp 단위 + 확대 — **Needs Evidence**: {{필요한 증거}}
- [?] (and-a11y-focus-indicator) 포커스 인디케이터 — **Needs Evidence**: {{필요한 증거}}

## Android — Usability

- [x] (and-ux-material-component) Material 컴포넌트 — **Pass**
- [x] (and-ux-nav-pattern) 네비게이션 패턴 — **Pass**
- [-] (and-ux-fab) FAB 적절성 — **N/A**: {{이유}}
- [?] (and-ux-system-back) 시스템 백버튼 — **Needs Evidence**: {{필요한 증거}}
- [x] (and-ux-dark-mode) 다크 모드 대응 — **Pass**

---

## Summary

| 항목 | iOS | Android |
|---|---|---|
| Pass | X | X |
| Fail | X | X |
| N/A | X | X |
| Needs Evidence | X | X |
| **합계** | **X** | **X** |

- Critical fails: X
- 자동 판정 비율: (Pass+Fail) / 전체 = XX%

### Critical Fails
{{없으면 "없음"}}
- (rule_id) 항목명: {{1줄 요약}}

### Needs Evidence 목록
{{없으면 "없음"}}
- (rule_id) 항목명: {{필요한 증거 유형}}

---

## 판정 기호
- `[x]` Pass
- `[ ]` Fail
- `[-]` N/A (해당 없음)
- `[?]` Needs Evidence (정적 입력으로 판단 불가)
