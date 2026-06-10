# Workflow

컬러 토큰 추출 작업은 아래 순서로 진행한다.

| Step | Action | Command / Reference |
| --- | --- | --- |
| 1 | preflight 확인 | `FIGMA_ACCESS_TOKEN`, `outputs/current/`, `outputs/raw/` |
| 2 | 변환 로직 테스트 | `node tools/extract-figma-color-tokens.test.mjs` |
| 3 | Figma REST 추출 | `node tools/extract-figma-color-tokens.mjs --raw-output outputs/raw/figma.variables.local.<YYYY-MM-DD>.json` |
| 4 | catalog 검증 | `node tools/validate-token-catalogs.mjs --input-dir ../chord-design-system/tokens` |
| 5 | 이전 snapshot diff | `diff -u <previous-color-snapshot> ../chord-design-system/tokens/color.json` |
| 6 | canonical output 확인 | `../chord-design-system/tokens/` |
| 7 | history 기록 | `history/` |

## Detailed Docs

- `color-token-extraction-guide.md`: REST fetch, collection 선택, color filter,
  alias resolve, diagnostics 정책
- `validation-checklist.md`: output 검증 기준
- `exceptions.md`: REST 실패, token 누락, dangling alias 등 예외 처리

## Canonical Output

최종 산출물 대상:

```text
../chord-design-system/tokens/
```

반영 전 확인:

- validation pass
- 기존 대비 token added/removed/changed 확인
- 변경 이유 설명 가능
