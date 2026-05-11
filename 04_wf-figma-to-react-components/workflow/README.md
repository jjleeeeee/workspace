---
type: WorkflowGuide
status: Draft
version: 1.0
updated: 2026-05-08
---

# Workflow Guide

이 문서는 `04_wf-figma-to-react-components`에서 Figma 기반 React component를 한 개씩
구현할 때 따르는 실행 순서다. 루트 `PLAYBOOK.md`는 운영 계약서, `rules/`는
반복 정책, `knowledge/`는 재사용 학습 카드, 이 문서는 상세 절차의 허브다.

## Execution Contract

- 현재 도구 어댑터(`AGENTS.md` 또는 `CLAUDE.md`)는 `docs/AI_RULES.md`로
  라우팅하는 얇은 진입점이다.
- 공유 gate matrix는 `docs/AI_RULES.md`를 기준으로 하고, 이 문서는 단계별
  실행 절차만 상세화한다.
- `README.md`, `PLAYBOOK.md`, `rules/README.md`, `knowledge/README.md`를 읽는다.
- 현재 작업 trigger와 맞는 `knowledge/*.md`만 골라 읽는다.
- source note 없이 implementation을 시작하지 않는다.
- Storybook build만으로 완료하지 않고 browser smoke와 visual review까지 확인한다.
- workflow decision은 `history/`, component-specific learning은 `retrospectives/`,
  reusable lesson은 `knowledge/`에 기록한다.

## Step Table

| Step | Action | Output | Required detail |
| --- | --- | --- | --- |
| 1 | target component의 node id/key 확인 | Figma entrypoint | 이 문서, `../rules/figma-source-priority.md` |
| 2 | Figma MCP와 Console MCP로 source read | axes, props, layout, tokens, image | `figma-source-read.md` |
| 3 | source note 작성 | `src/figma/<component>.source.md` | `source-note-contract.md`, `icon-asset-registry.md`, `../rules/*.md` |
| 4 | tests, component, CSS, Storybook 구현 | `src/components/<Component>/` | `component-build-loop.md`, `../rules/*.md` |
| 5 | test/type/build/browser smoke/visual review | 검증 결과와 gaps | `validation-checklist.md`, `../rules/storybook-validation.md` |
| 6 | React Code Connect 검증/발행 | Dev Mode snippet | `code-connect.md` |
| 7 | 결정/회고/학습 기록 | `history/`, `retrospectives/`, `knowledge/` | 이 문서, `../knowledge/README.md` |

## Step 1. Target Component 확인

- `../design-cds-docs/99_ref/ref-figma-component-keys/chord-ds/index.md`에서
  component name, node id, component key만 확인한다.
- variant detail markdown 파일은 읽지 않는다.
- target package는 항상 `04_wf-figma-to-react-components`다.

## Step 2. Figma Source Read

- Framelink/Figma MCP로 component properties, variant axes, representative
  child node context를 읽는다.
- Console MCP로 component description, enriched metadata, visual image를 보강한다.
- 대표 variant는 default만 고르지 않고 visual/state/radius/mode risk를 기준으로 고른다.
- 자세한 기준은 `figma-source-read.md`를 따른다.

## Step 3. Source Note 저장

- 구현 전에 `src/figma/<component>.source.md`를 만든다.
- source note에는 MCP calls, description, axes-to-props mapping, constraints,
  tokens, layout, representative node, visual reference, placeholder 범위,
  `Known Gaps`가 있어야 한다.
- asset source가 없으면 placeholder를 production처럼 숨기지 않는다.
- icon asset이 있으면 `workflow/icon-asset-registry.md` 기준으로
  `chord-icons` registry hit/miss를 먼저 확인한다.

## Step 4. Component Build

- prop/state contract test를 먼저 작성한다.
- component public props는 Figma-facing 축과 component property를 우선한다.
- native prop과 충돌하면 public prop을 분리하고 Storybook Controls에서는 숨긴다.
- local token JSON에서 생성한 CSS variables를 우선 사용한다.
- mapped DS icon은 SVG를 직접 import하지 않고 `ChordIcon name="..."`으로 사용한다.
- Storybook에는 `Playground`, variant/state view, `FigmaCompare`를 둔다.

## Step 5. Validation

필수 검증:

```bash
npm test
npm run typecheck
npm run build-storybook
npm run visual:baseline
npm run visual:diff
npm run rules:audit
npm run knowledge:audit
```

browser smoke:

```bash
python3 -m http.server 7008 -d storybook-static
```

- target story가 렌더되어야 한다.
- component console error가 없어야 한다.
- `FigmaCompare` 또는 local baseline으로 Figma 기준 visual review가 가능해야 한다.

## Step 6. 기록

- `history/`: workflow decision, 반복 규칙, 폴더 구조 변경, 검증 정책 변경
- `retrospectives/`: component implementation 회고, 다음 component에 가져갈 learning
- `knowledge/`: retrospective에서 증류한 재사용 가능한 learning card
