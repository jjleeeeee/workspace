# DropdownBox Retrospective

Date: 2026-05-08

## Scope

- Implemented component: `DropdownBox`
- Figma node: `60730:9605` (component set, 14 variants)
- Source note: `src/figma/dropdown-box.source.md`
- MCP reads: Console MCP `figma_get_component(60730:9605, enrich=true)` + `get_design_context(60730:9606)`

## What Worked

- **변형 축이 단순했다.** `Mode(2) × State(7) = 14` variants. CSS data-attribute selector 패턴(`[data-mode][data-state]`)으로 깔끔하게 커버됐고, 중첩 조합 수가 적어 token 누락 없이 첫 구현에서 통과했다.
- **`children` slot 설계.** ListItemNative 등 option 항목을 `children`으로 받고, open 상태(`enabled-down` / `enabled-up`)에서만 메뉴 패널을 렌더링. JSX 순서(input 앞/뒤)로 direction을 자연스럽게 처리했다.
- **`arrowDownFoldMedium` 아이콘 발견.** SVG 파일(`ic_arrow_down_fold_medium.svg`)이 `assets/icons/`에 이미 존재했지만 `chord-icons.tsx` 레지스트리에 미등록 상태였다. TDD 테스트에서 아이콘 이름이 렌더링되는지 검증하다가 발견해 즉시 등록했다.
- **TDD 흐름이 깔끔했다.** 29개 테스트를 먼저 작성하고 RED 확인 후 구현. title/guide/badgeDot/scrollbar/textLabel/arrow 각 슬롯과 state/mode 조합을 테스트가 계약으로 고정했다.
- **Storybook Controls 계약 테스트.** `DropdownBox.stories.test.ts`가 `argTypes` 키와 `controls.include`를 자동으로 검증하므로 내용 props(titleLabel/guideLabel/textLabel)가 controls에 노출되는 실수가 불가능해졌다.

## What Needs Improvement

- **FigmaCompare 베이스라인을 끝까지 미뤘다.** 스토리 작성 시 "Visual baseline not yet registered" 텍스트 플레이스홀더만 넣고 완료 보고를 했다가, 사용자가 Storybook을 직접 열어서 이미지가 없다는 것을 발견했다. 컴포넌트 마무리 전에 Figma 스크린샷 캡처 → `src/figma/baselines/` 저장 → FigmaCompare 스토리 연결까지 한 번에 해야 한다.
- **Scrollbar가 정적 렌더에서 항상 표시된다.** 현재 구현은 `showScrollbar=true`이면 오픈 상태의 메뉴 패널 하단에 `<Scrollbar />`를 항상 붙인다. 실제 사용 시 항목 수가 적으면 불필요하게 나타날 수 있다. Figma 원본이 "항목이 넘칠 때만" 표시하는지 확인하지 않았고 Known Gap으로 남겼다.
- **`chord-icons.tsx` 등록 누락을 사전에 잡지 못했다.** 아이콘 SVG 파일이 폴더에 있어도 레지스트리에 없으면 런타임에서 `undefined`가 렌더링된다. 새 컴포넌트 시작 전 "사용할 아이콘이 레지스트리에 있는지" 명시적으로 확인하는 체크 스텝이 없었다.

## Workflow Notes

- Console MCP Desktop Bridge 연결 상태에서 `figma_get_component(enrich=true)` 한 번으로 axes, tokens, layout 스펙을 충분히 확보했다. 별도 Framelink read 없이도 소스 노트 작성이 가능했다.
- `enabled-down` / `enabled-up` 상태에서 메뉴 방향이 JSX 배치로 결정되는 구조는 CSS position override 없이도 자연스럽다. 단, animation이 필요해지면 position absolute로 전환이 필요할 수 있다.

## Validation Result

- `npm test`: 259/259 passed (65 files)
- `npm run typecheck`: passed (no errors)
- `npm run build-storybook`: passed
- `visual:baseline` / `visual:diff`: 미실행 — Figma baseline PNG는 `get_screenshot`으로 캡처해 저장했으나 visual registry 등록 및 diff는 수행하지 않았다. Known Gap.

## Known Gaps (v1)

- Scrollbar는 open 상태에서 항상 렌더링됨. 항목 수에 따른 조건부 표시는 미구현.
- `completed` 상태의 시각적 처리(Figma에서 icon 변경 여부 등) 미확인. 현재는 border가 inactive-gray로 돌아오는 것만 확인.
- visual:baseline 등록 및 visual:diff parity gate 미통과. 추후 별도 실행 필요.
- Animation / transition (open/close, direction change) 미구현.

## Lessons Promoted

- [knowledge/visual-validation/figma-compare-baseline-required.md](../knowledge/visual-validation/figma-compare-baseline-required.md)
  - Promotion: **knowledge**
  - Reason: FigmaCompare 스토리에 베이스라인 이미지 없이 완료 보고 → 사용자가 직접 발견. 다음 컴포넌트부터 바로 적용 가능한 체크 포인트.

- [knowledge/assets/chord-icons-registry-verification.md](../knowledge/assets/chord-icons-registry-verification.md)
  - Promotion: **knowledge**
  - Reason: SVG 파일이 assets/icons에 있어도 chord-icons.tsx 레지스트리 미등록이면 ChordIcon이 아무것도 렌더링하지 않는다. 아이콘 사용 컴포넌트 착수 전 공통 체크 항목.

## Next Component

**List_Item_Web** 또는 **[V2] Tabs** — 복잡도 중간. 선택은 사용자와 확인.
