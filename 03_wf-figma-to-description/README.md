# Figma to Description

이 폴더는 Figma Component Description YAML을 작성하고 검증하기 위한 작업실이다.

`draft-descriptions/*.description.yaml`이 유일한 스펙 SoT이며, 이 워크플로우는 파생
`{component}.md` 산출물을 만들지 않는다.

## Start Here

1. `docs/AI_RULES.md`에서 이 폴더의 공통 AI 작업 규칙을 확인한다.
2. `AGENTS.md` 또는 `CLAUDE.md`는 사용하는 도구의 얇은 어댑터로만 확인한다.
3. `PLAYBOOK.md`에서 전체 계약과 gate를 확인한다.
4. `workflow/README.md`의 step table에 따라 필요한 상세 문서를 읽는다.
5. 필요한 경우 `refs/figma-component-keys/`와 `refs/markitdown-output/`를 보충 입력으로 확인한다.
6. 작성한 YAML을 `draft-descriptions/<component>.description.yaml`에 저장한다.
7. 필요 시 `scripts/enrich_tokens.py`, `scripts/enrich_typography.py`로 resolved 값을 채운다.
8. validator로 YAML을 확인한다.
9. 결정 또는 동작 변경이 있으면 `history/figma-description-history.md`에 짧게 기록한다.

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
| `workflow/` | 실행 순서, YAML schema, 검증, 예외 대응 상세 문서 |
| `draft-descriptions/` | SoT 역할의 컴포넌트 Description YAML |
| `scripts/` | draft YAML 보강 스크립트 (enrich_tokens, enrich_typography, fix_baselines, pick_baseline_node) |
| `refs/` | 외부/과거 추출 reference 묶음 |
| `refs/figma-component-keys/` | component set key와 variant component key 스냅샷 |
| `refs/markitdown-output/` | Figma 스펙 프레임에서 추출한 보충 입력 |
| `history/figma-description-history.md` | 결정과 변경 이유 기록 |
| `retrospectives/` | 배치 실행 후 회고와 다음 개선점 기록 |
| `tools/` | Description YAML validator 위치 |
| `examples/` | validator 샘플 위치 |

## Description Policy

`draft-descriptions/`는 컴포넌트 스펙의 SoT YAML을 둔다.

- 파일명은 `<component>.description.yaml` 형식을 쓴다.
- 같은 컴포넌트 워크플로우를 다시 실행하면 같은 파일을 최신 추출 결과로 덮어쓴다.
- `draft-descriptions/*.description.yaml`이 유일한 스펙 SoT다(2026-05-12~).

## Scripts Policy

`scripts/`는 YAML resolved 값 보강 스크립트를 둔다.

- `enrich_tokens.py`: `cds-catalogs/` 색상 토큰으로 `resolved.{light,dark,web_var}` 채우기
- `enrich_typography.py`: typography 토큰 resolved 값 채우기
- `fix_baselines.py`: baseline node_id 주입
- `pick_baseline_node.py`: variant-keys에서 대표 baseline 선택
- 카탈로그가 갱신됐을 때 또는 신규 컴포넌트 추가 후 실행한다.
- 실행 결과는 `draft-descriptions/` 파일에 직접 반영된다.

## Outputs

- `draft-descriptions/<component>.description.yaml` (SoT)
- history 기록 (결정 또는 동작 변경이 있을 때)

## Non-Outputs

- `{component}.md`
- Figma plain `description` 또는 `descriptionMarkdown` 쓰기 결과(폐기됨)
- `bridge-descriptions/*.bridge.yaml`(폐기됨)

## When to Update This README

매 작업마다 업데이트하지 않는다.

다음이 바뀔 때만 업데이트한다:

- 폴더의 목적이 바뀔 때
- 주요 파일이나 폴더 구조가 바뀔 때
- 산출물 또는 금지 산출물이 바뀔 때
- 첫 진입자가 따라야 할 순서가 바뀔 때

컴포넌트별 변경 이유는 README가 아니라 `history/figma-description-history.md`에 기록한다.
