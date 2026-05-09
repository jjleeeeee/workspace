# Top Navigation Retrospective

Date: 2026-05-08

## Scope

- Implemented component: `TopNavigation`
- Figma node: `64450:39560` (component set, 32 variants)
- Source note: `src/figma/top-navigation.source.md`
- MCP reads: Console MCP `figma_get_component(64450:39560, enrich=true)` + Official MCP `get_design_context(64450:39561)`

## What Worked

- **Slot 패턴 일관 적용.** leadingSlot, trailingSlot, imageSlot, logoSlot 모두 ReactNode 슬롯으로 처리. 소비자가 ChordIcon, Avatar, SVG 어떤 것도 주입 가능.
- **textType로 레이아웃 분기.** isSearch, isLogo, isImg 플래그로 Search 영역 / Logo 영역 / Text 영역을 깔끔하게 분기. switch 없이 boolean 조합으로 처리.
- **`center` 타입 absolute 센터링.** `position: absolute; inset: 0; width: 100%; justify-content: center`로 타이틀 정중앙 배치. leading/trailing은 `position: relative; z-index: 1`로 위에 올려 겹침 방지.
- **data-attribute 패턴 3축 적용.** `data-mode`, `data-text-type`, `data-scroll-bg` 3개 축을 CSS 셀렉터로 처리. 기존 패턴 그대로 유지.
- **TDD 23 테스트 선작성.** root data-attribute, leading/trailing 가시성, search/logo/image 영역 렌더링, badge 조건부 렌더까지 계약 먼저 고정.
- **typecheck가 잘못된 아이콘명 즉시 발견.** `moreVerticalMedium`이 chord-icons에 없음을 typecheck가 즉시 잡음. → `closeMedium`으로 교체.
- **typecheck가 Avatar props 오류 즉시 발견.** `type` prop이 AvatarProps에 없음 → `avatarType` 또는 생략으로 수정.
- **FigmaCompare 베이스라인 선캡처.** node 64450:39561 PNG 캡처 (2.9KB). Center/Scroll Bg=Off/Default 기준 변형.
- **visual-registry 스키마 준수.** `comparisonScope` 허용값 `structure-only` 사용, `isParityGate: false` 명시.

## What Needs Improvement

- **`default` vs `left` 정확한 차이 미확인.** Figma 읽기에서 default/left가 동일하게 보여 둘 다 left-aligned로 처리. 실제 leading 유무 차이 등 추가 확인 필요.
- **Official badge 원자 미확인.** `BadgeDot`으로 임시 처리. 실제 Figma에서 어떤 원자인지 확인 필요 (Known Gap).
- **logo-svg / logo-svg-center 슬롯 크기 미검증.** 소비자가 SVG 제공 시 높이/너비 미지정. Figma에서 로고 영역 정확한 크기 미확인.
- **Search 컴포넌트 너비 297px 미적용.** `chord-top-navigation__search { flex: 1 }` 처리만 적용. Figma 스펙 297×36px 정확한 제약 미구현.
- **Marquee 타이틀 스크롤 인터랙션 미구현.** Figma에 Marquee 타입이 있지만 v1에서 제외.
- **FigmaCompare: default, left, search, img, img-text, logo-svg, logo-svg-center 변형 미캡처.** Center/Off만 베이스라인.
- **visual:baseline / visual:diff 미실행.** Known Gap.
- **`moreVerticalMedium` 아이콘 미등록.** chord-icons에 없어 `closeMedium`으로 대체. 실제 trailing more icon 필요 시 chord-icons 추가 필요.

## Workflow Notes

- `figma_get_component(enrich=true)` 1회로 32개 변형, 3개 축, 레이아웃, 토큰 전체 확보.
- `get_design_context`로 Center/Scroll Bg=Off 시각 구조 확인 — leading/trailing 40×40px, 타이틀 17px Bold, 서브타이틀 13px Regular 파악.
- typecheck가 stories 파일에서도 ChordIconName과 AvatarProps 오류를 즉시 잡음. 테스트 이전에도 타입 안전성 계약이 동작.
- visual-registry.test.ts가 `comparisonScope` 허용값을 검증하므로, "partial" 같은 임의 문자열 방지.

## Validation Result

- `npm test`: 376/376 passed (73 files)
- `npm run typecheck`: passed (no errors)
- `npm run build-storybook`: passed
- `visual:baseline` / `visual:diff`: 미실행 — Known Gap으로 기록.

## Known Gaps (v1)

- `default` vs `left` Text_Type 정확한 시각적 차이 미확인.
- Official badge atom 미확인. `BadgeDot` 임시 대체.
- `logo-svg` / `logo-svg-center` 슬롯 크기 미검증.
- Search 컴포넌트 297×36px 제약 미적용.
- Marquee 타이틀 인터랙션 미구현.
- Center/Off 외 Text_Type 변형 FigmaCompare 베이스라인 미캡처.
- visual:baseline / visual:diff 미실행.
- `moreVerticalMedium` 아이콘 chord-icons에 없음 (closeMedium 대체).

## Lessons Promoted

- **없음 (신규 패턴 없음)** — 기존 지식 카드 패턴으로 충분히 커버:
  - data-attribute CSS 패턴 (기존)
  - slot 패턴 (기존)
  - FigmaCompare 베이스라인 선캡처 (기존)
  - typecheck 실시간 계약 검증 (기존)
  - visual-registry 스키마 허용값 준수 (기존, 이번에 재확인)

## 전체 컴포넌트 구현 완료 요약

이번 세션에서 4개 남은 컴포넌트 모두 구현 완료:

| 컴포넌트 | 테스트 | 누적 total |
|---|---|---|
| Title Header | 이전 세션 | - |
| List_Item_Web | 324/324 | - |
| [V2] Tabs | 350/350 | - |
| Top Navigation | 376/376 | 376/376 |

Chord DS Figma → React 컴포넌트 변환 프로젝트의 모든 계획된 컴포넌트 구현이 완료되었습니다.
