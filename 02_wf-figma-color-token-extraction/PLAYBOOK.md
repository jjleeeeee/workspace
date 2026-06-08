---
type: Playbook
status: Active
version: 1.0
date: 2026-05-06
project: "Figma Color Token Extraction"
owner: 디자인 시스템 담당자
related:
  - "AGENTS.md"
  - "workflow/README.md"
  - "history/2026-04-23_color-token-rest-extraction.md"
---

# Figma Color Token Extraction Playbook

이 문서는 `02_wf-figma-color-token-extraction` 작업실의 **짧은 실행 계약서**다. 상세 추출
정책, 검증 기준, 예외 처리는 `workflow/` 아래 문서에서 관리한다.

## 1. 목적

Figma Variables REST API에서 Chord DS color token catalog를 재생성한다.

- REST API를 대량 추출의 기준 원천으로 사용한다.
- final output은 color catalog 하나만 관리한다.
- `base/color/*`는 resolve 재료로만 사용한다.
- `system/color/*`, `system/fixed_color/*`는 최종 hex로 flatten한다.

## 2. 필수 읽기 순서

1. `AGENTS.md`
2. `README.md`
3. 이 문서
4. `workflow/README.md`
5. `workflow/color-token-extraction-guide.md`
6. `workflow/validation-checklist.md`
7. 필요 시 `history/`

## 3. Source Priority

1. 현재 사용자 요청
2. 현재 Figma REST `variables/local` 응답
3. `workflow/color-token-extraction-guide.md`
4. 기존 `history/`
5. 이전 snapshot
6. 추론

## 4. 금지 계약

- size/typography catalog를 이 폴더의 output으로 만들지 않는다.
- DSL, component compare, HTML demo 작업을 이 폴더에서 이어가지 않는다.
- `base/color/*`를 final output에 포함하지 않는다.
- unresolved color를 final `tokens` 배열에 남기지 않는다.
- diff 리뷰 없이 canonical token catalog를 덮어쓰지 않는다.

## 5. 전체 흐름

| Step | 목적 | 필수 참조 |
| --- | --- | --- |
| 1. Preflight | `FIGMA_ACCESS_TOKEN`, output 경로, 이전 snapshot 확인 | `workflow/README.md` |
| 2. Extract | Figma REST `variables/local` 호출 및 color catalog 생성 | `workflow/color-token-extraction-guide.md` |
| 3. Validate | JSON/checklist 검증 | `workflow/validation-checklist.md` |
| 4. Diff Review | 이전 snapshot 또는 canonical과 변경점 확인 | `workflow/README.md` |
| 5. Sync | 요청받은 경우 canonical catalog에 반영 | `workflow/README.md` |
| 6. History | 원천 상태 변화나 정책 변경 기록 | `history/` |

## 6. Commands

회귀 테스트:

```bash
node tools/extract-figma-color-tokens.test.mjs
```

새 추출:

```bash
node tools/extract-figma-color-tokens.mjs \
  --output-dir outputs/current \
  --raw-output outputs/raw/figma.variables.local.<YYYY-MM-DD>.json
```

검증:

```bash
node tools/validate-token-catalogs.mjs --input-dir ../chord-design-system/tokens
```

이전 기준과 diff:

```bash
diff -u <previous-color-snapshot> ../chord-design-system/tokens/color.json
```

## 7. Done Criteria

- `../chord-design-system/tokens/{color,size,typography,typography.semantic}.json`이 생성됐다.
- validation `errorCount`가 `0`이다.
- token count, added/removed/changed id를 확인했다.
- `base/color` output count, non-hex count, non-null alias count가 모두 `0`이다.
- `system/color/roles/brand-green` 처리 판단이 유지 또는 갱신됐다.
- 최종 산출물이 `../chord-design-system/tokens/`에만 반영됐다.
