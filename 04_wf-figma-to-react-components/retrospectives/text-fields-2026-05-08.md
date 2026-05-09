---
component: TextFields
date: 2026-05-08
status: partial-ready
---

# TextFields Retrospective

## Summary

- 20 variants (Mode × Lines × Status) 구현 완료.
- 218 tests / typecheck / Storybook build / visual diff 모두 통과.
- Visual match rate: 97.7% (threshold 12% 이내).

## Key Decisions

1. **Nested Input 컴포넌트 deferred:** Input 컴포넌트 세트(`62030:25118`)는 아직 구현되지 않음.
   native `<input>` / `<textarea>`로 대체. trailing controls (clear, eye, timer, button) scope 제외.

2. **Guide Message 컴포넌트 deferred:** Guide Message 컴포넌트 세트(`62030:25179`)는 아직 구현되지 않음.
   빈 `<div>` placeholder로 대체. status별 색상 토큰만 CSS에 준비됨.

3. **Fixed mode border-radius:** variant_shell spec에 `radius_fixed_single: 0` 명시.
   Mode=Fixed는 border-radius 0 적용. Multiple line Fixed 동일 처리.

4. **Scrollbar mode 매핑:** Mode=Default → `Scrollbar mode="default"`, Mode=Fixed → `mode="fixed-white"`.
   scrollbar_thumb 토큰 `system/fixed_color/surface/default-reverse-200a`가 fixed-white에 해당.

5. **Alpha token 정책 준수:** `--cds-system-color-text-400a` 등 alpha token은 CSS opacity 없이 단독 사용.

## Known Gaps

- `Input` nested 컴포넌트 미구현 → trailing controls, country code 내용 없음.
- `Guide Message` nested 컴포넌트 미구현 → 상태별 guide text 없음.
- `Text Button`, `Hidden` trailing controls deferred.
- country code prefix 내용 (국기 이모지 + 전화번호 코드) 미구현.
- caret, timer 색상은 interactive state에서만 확인 가능 — CSS token만 준비됨.

## Next

- **Dropdown_Box** — TextFields가 선행 조건이었으므로 다음 대상.
  (`../design-cds-docs/99_ref/ref-figma-component-keys/chord-ds/index.md`에서 nodeId 확인 필요)

## Lessons Promoted

- Knowledge: [Partial Coverage Labeling](../knowledge/component-complexity/partial-coverage-labeling.md)
- Promotion: `reused`
- Reason: TextFields intentionally deferred nested Input and Guide Message coverage while keeping the component status partial-ready.

- Knowledge: [Token vs Rendered Pixel](../knowledge/visual-validation/token-vs-rendered-pixel.md)
- Promotion: `reused`
- Reason: Alpha token handling stayed token-first and avoided extra opacity.
