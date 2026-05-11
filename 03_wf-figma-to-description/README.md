# Figma to Description

이 폴더는 Figma Component Description YAML을 최신화하고 검증하기 위한 작업실이다.

Figma Component Description이 유일한 스펙 SoT이며, 이 워크플로우는 파생
`{component}.md` 산출물을 만들지 않는다.

## Start Here

1. `docs/AI_RULES.md`에서 이 폴더의 공통 AI 작업 규칙을 확인한다.
2. `AGENTS.md` 또는 `CLAUDE.md`는 사용하는 도구의 얇은 어댑터로만 확인한다.
3. `PLAYBOOK.md`에서 전체 계약과 gate를 확인한다.
4. `workflow/README.md`의 step table에 따라 필요한 상세 문서를 읽는다.
5. 필요한 경우 `refs/figma-component-keys/`와 `refs/markitdown-output/`를 보충 입력으로 확인한다.
6. 작성한 YAML을 `draft-descriptions/<component>.description.yaml`에 저장한다.
7. validator로 draft YAML을 확인한다.
8. legacy `descriptionMarkdown` 길이를 기록하고 clear한 뒤 Figma plain Description에 저장한다.
9. Description readback을 HTML entity decode 기준으로 검증하고 `descriptionMarkdown` 0자를 확인한다.
10. 결정 또는 동작 변경이 있으면 `history/figma-description-history.md`에 짧게 기록한다.

## Quick Check

validator가 정상 동작하는지 확인:

```bash
node tools/validate-component-description.mjs examples/valid-description.yaml
```

의도적으로 실패하는 샘플 확인:

```bash
node tools/validate-component-description.mjs examples/invalid-description.yaml
```

실제 Description YAML을 파일로 저장해 확인할 때:

```bash
node tools/validate-component-description.mjs draft-descriptions/<component>.description.yaml
```

## Folder Map

| Path | Role |
| --- | --- |
| `docs/AI_RULES.md` | Claude Code와 Codex가 공유하는 공통 AI 작업 규칙 |
| `AGENTS.md` | Codex용 얇은 어댑터 |
| `CLAUDE.md` | Claude Code용 얇은 어댑터 |
| `PLAYBOOK.md` | 짧은 workflow 계약서와 진입점 |
| `workflow/` | 실행 순서, YAML schema, write/readback, 검증, 예외 대응 상세 문서 |
| `draft-descriptions/` | Figma에 쓰기 전 검증하는 임시 Description YAML |
| `bridge-descriptions/` | 플랫폼 중립 계약과 플랫폼별 구현 검증용 bridge YAML. Figma에 쓰지 않음 |
| `refs/` | 외부/과거 추출 reference 묶음 |
| `refs/figma-component-keys/` | component set key와 variant component key 스냅샷 |
| `refs/markitdown-output/` | Figma 스펙 프레임에서 추출한 보충 입력 |
| `history/figma-description-history.md` | 결정과 변경 이유 기록 |
| `retrospectives/` | 배치 실행 후 회고와 다음 개선점 기록 |
| `tools/` | Description YAML validator 위치 |
| `examples/` | validator 샘플 위치 |

## Draft Policy

`draft-descriptions/`는 Figma에 쓰기 전 검증용 YAML을 둔다.

- 파일명은 `<component>.description.yaml` 형식을 쓴다.
- 같은 컴포넌트 워크플로우를 다시 실행하면 같은 draft 파일을 최신 추출 결과로 덮어쓴다.
- draft 파일은 SoT가 아니다. 최신 스펙 SoT는 항상 Figma Component Description이다.
- 작업 완료 후 draft 파일은 참고용이며 최신성은 보장하지 않는다.

## Bridge Policy

`bridge-descriptions/`는 `draft-descriptions/`와 분리된 구현 검증용 YAML을 둔다.

- 파일명은 `<component>.bridge.yaml` 형식을 쓴다.
- bridge YAML은 Figma plain Description에 쓰지 않는다.
- bridge YAML은 source draft, Figma node identity, 플랫폼 중립
  `component_contract`, 플랫폼별 `platform_bindings`를 연결한다.
- React는 `platform_bindings.react` 아래에 04 source note mapping, visual
  registry mapping, parity scope를 둔다.
- Swift/Kotlin은 같은 `component_contract`를 재사용하고, 구현 전
  `platform_bindings.swift` / `platform_bindings.kotlin`에 별도 binding을
  추가한다.
- bridge YAML 검증은 `node tools/validate-component-description.mjs --mode=bridge
  bridge-descriptions/<component>.bridge.yaml`로 실행한다.

## Outputs

- Figma Component Description YAML
- Platform-neutral implementation bridge YAML
- Description readback 검증 결과
- history 기록 (결정 또는 동작 변경이 있을 때)

## Non-Outputs

- `{component}.md`
- Figma Description의 Markdown/rich text 변환본을 산출물로 관리하지 않음

## When to Update This README

매 작업마다 업데이트하지 않는다.

다음이 바뀔 때만 업데이트한다:

- 폴더의 목적이 바뀔 때
- 주요 파일이나 폴더 구조가 바뀔 때
- 산출물 또는 금지 산출물이 바뀔 때
- 첫 진입자가 따라야 할 순서가 바뀔 때

컴포넌트별 변경 이유는 README가 아니라 `history/figma-description-history.md`에 기록한다.
