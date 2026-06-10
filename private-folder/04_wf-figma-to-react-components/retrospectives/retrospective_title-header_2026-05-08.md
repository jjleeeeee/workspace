# Title Header Retrospective

Date: 2026-05-08

## Scope

- Implemented component: `TitleHeader`
- Figma node: `64450:27844` (component set, 4 variants)
- Source note: `src/figma/title-header.source.md`
- MCP reads: Console MCP `figma_get_component(64450:27844, enrich=true)` + `get_design_context(64450:28044)`

## What Worked

- **변형 축이 단순했다.** `Mode(2) × Align(2) = 4` 변형. `data-mode`/`data-align` CSS 셀렉터로 깔끔하게 처리됐다.
- **중첩 DS 컴포넌트를 슬롯으로 처리.** Avatar, icon_area, Tag, atoms/trailing 등 Figma 내부 원자들을 복제하지 않고 `leadingSlot`, `trailingSlot`, `badge1Slot` 등 `ReactNode` 슬롯으로 노출. 구현 가능 범위와 Figma 사양 경계를 명확하게 구분했다.
- **FigmaCompare 베이스라인 사전 캡처.** 이전 DropdownBox 회고의 교훈을 즉시 적용했다. 구현 완료 전에 `get_screenshot`으로 baseline PNG를 캡처하고 stories에 바로 연결했다.
- **TDD 30 테스트 선작성.** mode/align/visibility/slot 조합을 먼저 계약으로 고정한 뒤 구현. RED → GREEN 흐름 정상 통과.
- **Storybook Controls 계약 테스트.** 텍스트 레이블(titleLabel, subTitleLabel, trailingLabel)과 슬롯 props가 Controls에 노출되지 않도록 자동 검증.

## What Needs Improvement

- **Badge 슬롯 기본 아이콘 없음.** `badge1Slot`, `badge2Slot`, `subBadgeSlot` 기본값이 없어 Storybook Playground에서 badge 그룹이 빈 영역으로 표시된다. 어느 ChordIcon 이름이 Figma badge_1/badge_2에 매핑되는지 라이브 Figma에서 추가 확인이 필요하다.
- **Leading 슬롯 기본 placeholder 없음.** showLeading=true인데 `leadingSlot`이 없으면 Leading 영역이 비어 보인다. DropdownBox의 arrowDown 아이콘처럼, 실제 배치 상황에서는 반드시 슬롯을 채워야 한다는 점을 문서화해야 한다.
- **Center align 타이틀 중앙 정렬 검증 미진.** CSS에서 `align-items: center`로 처리했지만, Figma의 Center align 변형을 FigmaCompare에서 별도로 비교하지 않았다. Left 기본 변형만 베이스라인으로 캡처됐다.

## Workflow Notes

- `figma_get_component(enrich=true)` 한 번으로 axes, props, tokens, layout, assets, composition 전체를 확보. 별도 추가 reads 없이 소스 노트 작성 완료.
- `Avatar` props 이름이 `type`이 아니라 `avatarType`인 점을 stories 작성 시 TypeScript 오류로 발견했다. 타입체크가 실시간 계약 역할을 했다.
- Storybook Aligns 스토리에서 `Avatar`를 `leadingSlot`으로 전달해 중첩 구성 예시를 제공했다.

## Validation Result

- `npm test`: 293/293 passed (67 files)
- `npm run typecheck`: passed (no errors)
- `npm run build-storybook`: passed
- `visual:baseline` / `visual:diff`: 미실행 — Known Gap으로 기록.

## Known Gaps (v1)

- badge1Slot/badge2Slot/subBadgeSlot에 기본 아이콘 없음. 각 badge slot이 어떤 Figma icon_area 인스턴스에 대응하는지 미확인.
- Leading 슬롯 기본 placeholder 없음. showLeading=true 시 비어 있음.
- Center align FigmaCompare 별도 베이스라인 미캡처.
- Marquee (스크롤 오버플로우 애니메이션) 미구현.
- Multiple 모드(Tag, Membership gradient) — multipleSlot/multipleSubTitleSlot으로 deferred.
- visual:baseline / visual:diff 미실행.

## Lessons Promoted

- **없음 (신규 패턴 없음)** — 이번 구현에서 새로운 반복 가능한 레슨은 발생하지 않았다. FigmaCompare 베이스라인 선캡처(이전 회고 반영), chord-icons 사전 확인(badge 슬롯이 slot으로 처리돼 registry 이슈 불발)은 이미 knowledge에 기록된 항목이다.

## Next Component

**List_Item_Web** — 변형 12개, 중간 복잡도.
