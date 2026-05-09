# Figma Color Token Extraction

이 폴더는 Chord DS Figma Variables에서 **color token catalog만** 재추출하고
검증하기 위한 작업실이다.

대상은 `system/color/*`, `system/fixed_color/*`이며, `base/color/*`는 alias
resolve 재료로만 사용하고 최종 output에는 노출하지 않는다.

## Start Here

1. `docs/AI_RULES.md`에서 이 폴더의 공통 AI 작업 규칙을 확인한다.
2. `AGENTS.md` 또는 `CLAUDE.md`는 사용하는 도구의 얇은 어댑터로만 확인한다.
3. `PLAYBOOK.md`에서 전체 계약과 gate를 확인한다.
4. `workflow/README.md`의 step table에 따라 필요한 상세 문서를 읽는다.
5. Figma REST `variables/local` 응답으로 color catalog를 재생성한다.
6. `tools/validate-color-token-catalog.mjs`로 검증한다.
7. 기존 snapshot 또는 canonical catalog와 diff를 확인한다.
8. 반영 판단과 원천 변경은 `history/`에 짧게 기록한다.

## Quick Check

변환 로직 회귀 테스트:

```bash
node tools/extract-figma-color-tokens.test.mjs
```

현재 color output 검증:

```bash
node tools/validate-color-token-catalog.mjs --input-dir outputs/current
```

Figma REST에서 새로 추출:

```bash
node tools/extract-figma-color-tokens.mjs \
  --output-dir outputs/current \
  --raw-output outputs/raw/figma.variables.local.<YYYY-MM-DD>.json
```

## Folder Map

| Path | Role |
| --- | --- |
| `docs/AI_RULES.md` | Claude Code와 Codex가 공유하는 공통 AI 작업 규칙 |
| `AGENTS.md` | Codex용 얇은 어댑터 |
| `CLAUDE.md` | Claude Code용 얇은 어댑터 |
| `PLAYBOOK.md` | 컬러 토큰 추출 실행 계약서 |
| `workflow/` | 추출 정책, 검증 기준, 예외 대응 상세 문서 |
| `tools/` | Figma REST 추출, catalog 검증, 회귀 테스트 스크립트 |
| `outputs/current/` | 최신 color token output |
| `outputs/previous-2026-04-23/` | 2026-04-23 기준 이전 color snapshot |
| `outputs/raw/` | Figma REST `variables/local` raw snapshot |
| `history/` | 실행 기록과 판단 변경 로그 |
| `refs/` | 보충 reference와 archived 위치 안내 |

## Outputs

- `outputs/current/tokens.color.v1.0.json`
- 선택적 raw snapshot: `outputs/raw/figma.variables.local.<YYYY-MM-DD>.json`
- 필요 시 canonical 반영 대상:
  `../cds-catalogs/catalogs/tokens/tokens.color.v1.0.json`

## Non-Outputs

- size token catalog
- typography token catalog
- DSL harness
- component implementation
- HTML visual demo

관련 없는 이전 작업물은 `../99_archive/02_design-dev-test_legacy/`에 둔다.

## When to Update This README

매 추출마다 업데이트하지 않는다.

다음이 바뀔 때만 업데이트한다:

- 폴더 목적이 바뀔 때
- 주요 파일이나 폴더 구조가 바뀔 때
- 산출물 또는 금지 산출물이 바뀔 때
- 첫 진입자가 따라야 할 순서가 바뀔 때
