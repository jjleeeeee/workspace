---
type: Playbook
status: Draft
version: 1.2
updated: 2026-05-08
workflow_name: "Chord DS Figma 기반 React 컴포넌트 구축"
target_package: "04_wf-figma-to-react-components"
---

# Chord DS Figma To React Components Playbook

이 문서는 `04_wf-figma-to-react-components` 작업실의 짧은 운영 계약서다.
공통 gate matrix는 `docs/AI_RULES.md`, 세부 정책은 `rules/`, 절차는
`workflow/`에서 관리한다.

## 1. 목적

Figma에서 직접 읽은 Chord DS 컴포넌트를 React + TypeScript + Storybook으로
구현하고 검증한다.

- 많이 만드는 것이 아니라 한 컴포넌트씩 신뢰 가능한 기준을 만든다.
- 구현 전에 source note를 작성한다.
- Storybook build만으로 완료하지 않고 browser smoke와 pixel diff까지 본다.

## 2. 필수 읽기 순서

1. 현재 도구 어댑터: `AGENTS.md` 또는 `CLAUDE.md`
2. `docs/AI_RULES.md`
3. `README.md`
4. 이 문서
5. `rules/README.md`
6. `knowledge/README.md`
7. `workflow/README.md`
8. 현재 단계에서 필요한 `rules/*.md`, `workflow/*.md`, `knowledge/*.md`
9. target component의 `src/figma/<component>.source.md`
10. 관련 `src/components/<Component>/` 파일
11. component family나 workflow를 바꿀 때 `retrospectives/`와 `history/`

## 3. Source Priority

1. 사용자 요청과 현재 목표
2. Console MCP component description과 enriched metadata
3. Framelink/Figma MCP child node design context
4. Figma screenshot 또는 component image
5. local token JSON
6. existing source note
7. browser smoke와 visual review 결과
8. LLM inference

확인되지 않은 값은 구현에 조용히 흡수하지 않고 source note의 `Known Gaps`에
기록한다. 세부 기준은 `rules/figma-source-priority.md`를 따른다.

## 4. 금지 계약

반복 금지/판단 규칙은 `rules/`에 둔다. 특히 아래는 매번 적용한다.

- source note 없이 component implementation을 시작하지 않는다.
- variant detail markdown 파일을 source of truth로 사용하지 않는다.
- 확인되지 않은 visual/spec 값을 추정하지 않는다.
- Storybook Controls에 native/internal props를 노출하지 않는다.
- asset-backed visual을 text, emoji, CSS drawing으로 조용히 대체하지 않는다.
- icon mapping 전 asset classification을 먼저 한다.
- no-image/empty fallback asset은 consumer `src` sample이 아니라 component
  fallback state로 구현한다.
- nested DS atom은 CSS로 scale하지 않고 public props로 조합한다.
- tests만 통과했다고 완료로 판단하지 않는다.

## 5. 전체 흐름

| Step | 목적 | 필수 참조 |
| --- | --- | --- |
| 1. Target 확인 | component node id와 component key 확인 | `workflow/README.md`, `rules/figma-source-priority.md` |
| 2. Figma source read | axes, props, token, layout, visual reference 확보 | `workflow/figma-source-read.md` |
| 3. Source note 작성 | 구현 근거와 Known Gaps 기록 | `workflow/source-note-contract.md`, `rules/*.md` |
| 4. Component build | tests, React/CSS, Storybook, FigmaCompare 구현 | `workflow/component-build-loop.md` |
| 5. 검증/기록 | test/type/build/browser smoke/pixel diff/history/knowledge 기록 | `workflow/validation-checklist.md`, `knowledge/README.md` |

## 6. Step Gate

### Step 1. Target

- `../design-cds-docs/99_ref/ref-figma-component-keys/chord-ds/index.md`는
  node id와 component key 주소록으로만 사용한다.
- variant detail markdown 파일은 구현 근거로 읽지 않는다.

### Step 2. Figma Source Read

- component set 전체 context가 크면 representative child node를 좁혀 읽는다.
- representative node는 default만 고르지 않고 risk 기준으로 고른다.
- Console MCP와 Framelink 값이 충돌하면 source note에 충돌을 기록한다.
- required parent/representative MCP read 실패 또는 Desktop Bridge disconnected는
  중단하고 사용자에게 재연결/재시도를 요청한다.
- nested component read만 실패한 경우는 source note에
  `nested-read-failed:<component-name>`과 `deferred` coverage를 기록하고
  full parity gate로 보고하지 않는다.

### Step 3. Source Note

- 구현 전에 `src/figma/<component>.source.md`를 작성한다.
- Figma axes와 code props mapping, constraints, token mapping, layout,
  asset classification, visual reference, `Known Gaps`를 기록한다.
- 새로 만들거나 수정하는 source note는 필수 섹션을 채우거나 명시적으로 `N/A`를
  남긴다.

### Step 4. Component Build

- tests로 prop/state contract를 먼저 고정한다.
- CSS는 local token variables를 우선 사용한다.
- mapped DS icon은 `ChordIcon name="..."`으로 렌더한다.
- Storybook Controls는 Figma-facing props만 노출한다.
- `FigmaCompare`는 수동 확인용이고 완료 판정은 visual diff gate가 담당한다.

### Step 5. Validation And History

- `npm test`, `npm run typecheck`, `npm run build-storybook`,
  `npm run visual:baseline`, `npm run visual:diff`, `npm run rules:audit`,
  `npm run knowledge:audit`를 실행한다.
- Storybook을 browser smoke로 확인하고 component console error가 없는지 본다.
- visual registry의 `comparisonScope`와 `isParityGate`가 source note coverage와
  맞는지 확인한다.
- 자동 검출 가능한 정책은 `npm run rules:audit`로 확인한다.
- 회고에서 반복 가능한 학습은 `knowledge/`로 승격하고 `npm run knowledge:audit`로 확인한다.
- workflow decision이나 반복 규칙 변경은 `history/`에 기록한다.
- component별 회고는 `retrospectives/`에 기록한다.

## 7. Done Criteria

- source note가 있고 MCP read 목록과 Known Gaps가 기록되어 있다.
- Figma description과 variant axes가 public props로 mapping되어 있다.
- Storybook Controls는 Figma-facing props만 노출한다.
- asset gaps와 fallback/placeholder 상태가 source note와 Storybook docs에 명시되어 있다.
- partial/deferred coverage는 non-gating visual scope로 표시되고 full parity로
  보고하지 않는다.
- unit test, typecheck, Storybook build, visual baseline/diff, rules audit,
  knowledge audit, browser smoke가 통과한다.
- workflow decision은 `history/`, component learning은 `retrospectives/`,
  reusable lesson은 `knowledge/`에 기록됐다.

## 8. 상세 문서

- `rules/README.md`: 반복 정책과 금지 해석의 진입점
- `knowledge/README.md`: 회고에서 증류한 재사용 학습 카드의 진입점
- `workflow/README.md`: 실행 순서와 단계별 참조 문서
- `workflow/figma-source-read.md`: Figma MCP/Console read와 representative node 기준
- `workflow/source-note-contract.md`: source note 필수 내용과 asset gap 기록
- `workflow/icon-asset-registry.md`: 전체 icon export와 `ChordIcon` registry 관리
- `workflow/component-build-loop.md`: TDD, tokens, Storybook, FigmaCompare 구현 기준
- `workflow/validation-checklist.md`: test/type/build/browser smoke/visual review gate
- `workflow/exceptions.md`: MCP 실패, screenshot 만료, asset gap, port 충돌 대응
