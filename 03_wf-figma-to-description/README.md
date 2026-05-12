# Figma to Description

이 폴더는 Figma Component Description YAML을 작성하고 검증하기 위한 하네스 작업실이다.

`_workspace/outputs/draft-descriptions/*.description.yaml`이 유일한 스펙 SoT이며,
이 워크플로우는 파생 `{component}.md` 산출물을 만들지 않는다.

## Start Here

1. `CLAUDE.md`에서 규칙, 허용/금지, Source Priority를 확인한다.
2. `harness/orchestrator.md`에서 에이전트 팀 구조와 작업 흐름을 확인한다.
3. `harness/workflow.md`의 step table에 따라 단계별 상세 문서를 읽는다.
4. 필요한 경우 `refs/figma-component-keys/`와 `refs/markitdown-output/`를 보충 입력으로 확인한다.
5. 작성한 YAML을 `_workspace/outputs/draft-descriptions/<component>.description.yaml`에 저장한다.
6. 필요 시 `scripts/enrich_tokens.py`, `scripts/enrich_typography.py`로 resolved 값을 채운다.
7. validator로 YAML을 확인한다.
8. 결정 또는 동작 변경이 있으면 `_workspace/reviews/history/figma-description-history.md`에 기록한다.

## Quick Check

validator가 정상 동작하는지 확인:

```bash
node tools/validate-component-description.mjs harness/examples/valid-description.yaml
```

의도적으로 실패하는 샘플 확인:

```bash
node tools/validate-component-description.mjs harness/examples/invalid-description.yaml
```

실제 Description YAML 확인:

```bash
node tools/validate-component-description.mjs \
  _workspace/outputs/draft-descriptions/<component>.description.yaml
```

## Folder Map

| Path | Role |
| --- | --- |
| `CLAUDE.md` | 프로젝트 규칙집 (허용/금지/Source Priority) |
| `harness/` | 작업 흐름, 스키마, 예외, 검증 체크리스트 |
| `harness/workflow.md` | 전체 실행 흐름 + 단계별 판단 기준 |
| `harness/orchestrator.md` | 에이전트 팀 운영 지침 |
| `harness/schema.md` | Description YAML 스키마 |
| `harness/examples/` | validator 샘플 |
| `.claude/agents/` | 역할별 에이전트 정의 |
| `.claude/skills/` | 반복 작업 스킬 (validate, enrich, fill-gap, record-history) |
| `_workspace/outputs/draft-descriptions/` | SoT 컴포넌트 Description YAML |
| `_workspace/reviews/history/` | 결정과 변경 이유 기록 |
| `_workspace/reviews/retrospectives/` | 배치 실행 후 회고 |
| `_workspace/drafts/` | 진행 중 임시 파일 |
| `scripts/` | YAML 보강 스크립트 |
| `refs/figma-component-keys/` | component set key + variant key 스냅샷 |
| `refs/markitdown-output/` | Figma 스펙 프레임 보충 입력 |
| `tools/` | Description YAML validator |

## Outputs

- `_workspace/outputs/draft-descriptions/<component>.description.yaml` (SoT)
- `_workspace/reviews/history/` 기록 (결정 또는 동작 변경이 있을 때)

## Non-Outputs

- `{component}.md`
- Figma plain `description` / `descriptionMarkdown` 쓰기 결과 (폐기됨)
- `bridge-descriptions/*.bridge.yaml` (폐기됨)
