# Chord DS Figma To React Components

이 폴더는 Figma에서 직접 읽은 Chord DS 컴포넌트를 React + Storybook으로
구현하고 검증하기 위한 작업실이다.

목표는 많이 만드는 것이 아니라, 한 컴포넌트씩 source note와 pixel diff를
남기며 신뢰 가능한 구현 기준을 만드는 것이다.

## Start Here

1. AI 도구는 `AGENTS.md` 또는 `CLAUDE.md`를 얇은 어댑터로만 읽고
   `docs/AI_RULES.md`의 Gate Matrix를 따른다.
2. `PLAYBOOK.md`에서 전체 계약과 gate 요약을 확인한다.
3. `rules/README.md`에서 반복 금지/판단 규칙을 확인한다.
4. `knowledge/README.md`에서 현재 작업 trigger에 맞는 학습 카드만 고른다.
5. `workflow/README.md`의 step table에 따라 필요한 상세 문서를 읽는다.
6. `index.md`에서는 대상 컴포넌트의 `nodeId`와 `componentKey`만 확인한다.
7. Framelink/Figma MCP와 Console MCP로 실제 Figma 정보를 다시 읽는다.
8. 구현 전에 `src/figma/<component>.source.md`를 작성한다.
9. 컴포넌트, 테스트, Storybook, Figma 기준 검증 view를 구현한다.
10. Completion Check의 전체 명령과 browser smoke를 실행한다.
11. workflow 결정은 `history/`, component 회고는 `retrospectives/`에 남긴다.

## Completion Check

```bash
npm test
npm run typecheck
npm run build-storybook
npm run visual:baseline
npm run visual:diff
npm run rules:audit
npm run knowledge:audit
```

Storybook 정적 서버:

```bash
python3 -m http.server 7008 -d storybook-static
```

확인 URL:

```text
http://127.0.0.1:7008/?path=/story/atoms-textbutton--playground
```

## Folder Map

| Path | Role |
| --- | --- |
| `docs/AI_RULES.md` | Claude Code와 Codex가 공유하는 공통 AI 작업 규칙 |
| `AGENTS.md` | Codex용 얇은 어댑터 |
| `CLAUDE.md` | Claude Code용 얇은 어댑터 |
| `PLAYBOOK.md` | 짧은 workflow 계약서와 진입점 |
| `rules/` | 반복 금지/판단 규칙 |
| `workflow/` | Figma read, source note, build loop, 검증, 예외 대응 상세 문서 |
| `src/figma/` | 구현 전 Figma source note |
| `src/figma/baselines/` | Figma visual 검증에 쓰는 로컬 기준 이미지 |
| `src/assets/icons/` | Figma icon library에서 export한 SVG 원본 |
| `src/assets/chord-icons.tsx` | `ChordIcon` registry와 icon metadata |
| `src/components/` | React 컴포넌트, CSS, tests, stories |
| `src/styles/generated/tokens.css` | token JSON에서 생성한 CSS variables |
| `tokens/` | color, size, typography token JSON |
| `history/` | workflow decision과 반복 규칙 변경 기록 |
| `retrospectives/` | 구현 회고와 다음 개선점 기록 |
| `.storybook/` | Storybook 설정 |
| `scripts/` | token build, visual diff, workflow rules audit 등 로컬 스크립트 |

## Build Policy

- 한 번에 전체 atom을 만들지 않는다.
- 한 컴포넌트씩 source note, 테스트, Storybook, visual diff를 끝까지 검증한 뒤
  다음 컴포넌트로 넘어간다.
- source note가 없으면 구현을 시작하지 않는다.
- Storybook Controls에는 Figma-facing props만 노출한다.
- 반복 규칙은 `rules/`에 두고, 자동 검출 가능한 항목은 `npm run rules:audit`로 확인한다.
- placeholder icon/loading asset은 반드시 source note와 회고에 gap으로 남긴다.
- mapped DS icon은 component에서 SVG를 직접 import하지 않고 `ChordIcon` registry를 통해 사용한다.
- Figma 기준 이미지는 만료될 수 있는 URL만 의존하지 않고 `src/figma/baselines/`에 로컬 baseline으로 저장한다.
- Figma 재현 완료 판정은 `FigmaCompare`가 아니라 1x layout size gate와 3x visual pixel diff로 한다.
- `src/styles/generated/tokens.css`는 `npm run tokens:build`로 재생성하는 파일이며, Storybook/Vite 진입에 필요하므로 token JSON 변경 시 함께 갱신한다.
- workflow 구조, source priority, 검증 기준 변경은 `history/`에 남긴다.

## Outputs

- React component implementation
- Storybook stories
- Figma source note
- unit/type/build/browser smoke result
- workflow decision history
- retrospective

## Non-Outputs

- variant detail markdown 기반 구현
- source note 없는 대량 컴포넌트 생성

## When to Update This README

매 컴포넌트마다 업데이트하지 않는다.

다음이 바뀔 때만 업데이트한다:

- 폴더 목적이 바뀔 때
- 주요 파일이나 폴더 구조가 바뀔 때
- 산출물 또는 금지 산출물이 바뀔 때
- 첫 진입자가 따라야 할 순서가 바뀔 때

workflow-level 판단은 `history/`, 컴포넌트별 판단과 실패 원인은 `retrospectives/`에 기록한다.
