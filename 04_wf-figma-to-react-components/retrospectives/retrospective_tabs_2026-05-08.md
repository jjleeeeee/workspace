# [V2] Tabs Retrospective

Date: 2026-05-08

## Scope

- Implemented component: `Tabs`
- Figma node: `65172:10165` (component set, 16 valid variants)
- Source note: `src/figma/tabs.source.md`
- MCP reads: Console MCP `figma_get_component(65172:10165, enrich=true)` + Official MCP `get_design_context(66562:18181)`

## What Worked

- **유효 조합만 구현.** 36개 이론 조합 중 16개 유효 조합을 source note에 명확히 정리. 유효성 제약을 문서화해 소비자에게 가이드.
- **Style 기반 렌더 분기.** `style="bar"` → bar item 인라인 구현, `style="chip"` → 기존 `Chips` 컴포넌트 재사용. 중복 없이 깔끔하게 처리.
- **Chips 컴포넌트 재사용.** `state="filled-selected"` / `state="default"`로 Chip 탭 선택 상태 표현. 기존 DS 원자 그대로 활용.
- **data-attribute 패턴 4축 적용.** `data-mode`, `data-style`, `data-type`, `data-size` 4개 축을 CSS 셀렉터로 처리. 이전 컴포넌트에서 확립된 패턴 유지.
- **TDD 23 테스트 선작성.** root data-attribute, bar/chip 탭 선택 상태, expand button 가시성, bottom line 조건부 렌더링까지 계약 먼저 고정.
- **TypeScript `Object is possibly 'undefined'` 즉시 발견.** `NodeList` 인덱스 접근을 `Array.from()`으로 변환. typecheck가 테스트 코드 품질도 보장.
- **FigmaCompare 베이스라인 선캡처.** node 66562:18181 PNG 캡처 (2.9KB). Bar/Fixed/Default 기준 변형.

## What Needs Improvement

- **arrowDownXsmall 아이콘 미등록.** Figma scroll_more 아이콘이 chord-icons에 없어 `arrowDownMedium` (24px)으로 대체. Known Gap.
- **Gradient 페이드 오버레이 CSS 처리.** Figma에서는 `Gradient_color` 컴포넌트를 사용하지만 코드베이스에 없어 CSS linear-gradient로 처리. 정확한 토큰 매핑 미확인.
- **Type=Scrollable 스크롤 UX.** CSS `overflow-x: auto`만 적용. 모멘텀 스크롤, 스냅, 그라디언트 페이드 인디케이터 미구현.
- **Expand 타입 상태 관리.** 현재 Expand는 chips를 flex-wrap으로 펼치는 구조지만, Figma에서는 expand/collapse 토글 인터랙션이 있다. v1에서는 정적 상태만 구현.
- **chip fixed 탭 균등 너비.** 361px 고정 영역에 탭 수에 따른 균등 너비(`flex: 1 0 0`) 적용. 탭이 4개 이하일 때만 Figma 스펙과 일치.
- **Size=small (expand)과 Size=medium 구분.** 두 크기 간 시각적 차이가 Chips 컴포넌트에 위임되어 있어 Tabs 레벨에서 별도 검증 미실시.
- **FigmaCompare: Chip 변형 미캡처.** Bar/Fixed만 베이스라인. Chip/Fixed, Chip/Scrollable, Chip/Expand 별도 미캡처.
- **visual:baseline / visual:diff 미실행.** Known Gap.

## Workflow Notes

- `figma_get_component(enrich=true)` 1회로 16개 유효 변형, 4개 축, 토큰, 레이아웃, 합성 규칙 전체 확보.
- `get_design_context` 로 Bar/Fixed 시각 구조 확인 — `_atoms/Tabs` 내부 atom의 구체적 CSS (높이 44px, indicator 3px, 텍스트 15px Bold, gray-700 fallback) 파악.
- TypeScript 타입체크가 `NodeList` 인덱스 오류를 즉시 잡음. 테스트 코드에도 타입 안전성이 중요.
- 유효 조합 제약을 source note의 테이블로 명시 → 구현 중 잘못된 조합 시도 방지.

## Validation Result

- `npm test`: 350/350 passed (71 files)
- `npm run typecheck`: passed (no errors)
- `npm run build-storybook`: passed
- `visual:baseline` / `visual:diff`: 미실행 — Known Gap으로 기록.

## Known Gaps (v1)

- arrowDownXsmall 아이콘 chord-icons에 없음. arrowDownMedium으로 대체.
- Gradient_color 컴포넌트 미보유. CSS gradient로 대체.
- Type=Scrollable: 기본 overflow-x:auto만. 모멘텀/스냅/그라디언트 인디케이터 미구현.
- Type=Expand: 정적 flex-wrap만. 토글 인터랙션 미구현.
- Chip/Fixed 탭 5개 이상 시 균등 너비 spec 이탈 가능.
- Chip 변형 FigmaCompare 베이스라인 미캡처.
- visual:baseline / visual:diff 미실행.

## Lessons Promoted

- **없음 (신규 패턴 없음)** — 기존 지식 카드 패턴으로 충분히 커버:
  - data-attribute CSS 패턴 (기존)
  - FigmaCompare 베이스라인 선캡처 (기존)
  - DS 원자 재사용 (기존 slot/composition 패턴)
  - typecheck 실시간 계약 검증 (기존)

## Next Component

**Top Navigation** — 변형 32개, 높음 복잡도.
