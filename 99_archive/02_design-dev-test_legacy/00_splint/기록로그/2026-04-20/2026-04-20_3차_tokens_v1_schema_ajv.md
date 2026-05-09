# 2026-04-20 — 3차: Token Catalog Schema v1 JSON Schema 파일화 + ajv validate

> 상위 문서: [../figma_ds_structure_audit_260420.md](../figma_ds_structure_audit_260420.md)
> 이전 사이클: [2026-04-20_2차_WDS_tokens_샘플_스키마초안.md](2026-04-20_2차_WDS_tokens_샘플_스키마초안.md)

**목표:** 2차에서 도출한 Schema v1 초안을 실제 JSON Schema(Draft 2020-12) 파일로 굳히고, ajv로 긍정/부정 validate가 통과하는지 객관 검증.

## 사용 도구/방법

- **JSON Schema Draft 2020-12** (`$schema: https://json-schema.org/draft/2020-12/schema`)
- **ajv v8** + **ajv-formats** (date-time 등 format 검증)
- Node ESM 스크립트 (`scripts/validate-tokens.mjs`)
- 샘플 fixture: 2차에서 수집한 4개 토큰 (text/primary, surface/default, roles/primary, button/default)

## 진행 과정

1. `schemas/`, `fixtures/` 디렉토리 생성
2. `schemas/tokens.v1.json` 작성 — 2차 초안의 필드를 JSON Schema `$defs`로 분해
   - 루트: `source` / `modes` / `tokens` / `diagnostics`
   - `$defs`: `Source`, `Token`, `TokenType`, `ModeValue`, `UsageScope`, `Diagnostic`, `DiagnosticCode`
3. `fixtures/tokens.sample.json` 작성 — 2차 샘플 데이터를 v1 shape으로 변환
4. `npm i -D ajv ajv-formats`
5. `scripts/validate-tokens.mjs` 작성 — `Ajv2020` 사용, `allErrors: true`
6. **긍정 validate**: `tokens.sample.json` → PASS
7. **부정 validate**: `tokens.invalid.json` (일부러 `colour`, `LIGHT`, `not-a-date` 등 오타 심음) → 6개 오류 정확 탐지

## 발견/결과

### 스키마 핵심 제약

| 필드 | 제약 | 의도 |
|---|---|---|
| `modes[]` | `^[a-z][a-z0-9-]*$` | 소문자-케밥 강제, 플랫폼 모드(`ios`/`aos`/`web`)도 동일 규칙으로 수용 |
| `token.id` | `^token:[a-z0-9]+(\.[a-z0-9_-]+)*$` | Figma name `system/color/text/primary` → `token:system.color.text.primary` 변환 규칙 강제 |
| `token.type` | `color \| dimension \| number \| string` | Figma COLOR/FLOAT/STRING 매핑, FLOAT만 context별 dimension/number 분화 |
| `values.{mode}` | `additionalProperties: false`, 키는 `modes` 패턴 | 카탈로그 `modes` 외 키 차단 |
| `ModeValue.raw` | string \| number \| boolean | 색상 hex / 숫자(px) / 참/거짓 모두 수용 |
| `usage[]` | 17개 enum | Figma scopes 전 범위(SHAPE_FILL…TEXT_STYLE) 커버 |
| `diagnostics.code` | 9개 enum | `documentation:missing`, `duplicate-alias`, `platform-code:missing-web` 등 |

### 설계 결정 (2차 이후 확정)

1. **codeSyntax.WEB**: 스키마는 `ios/android/web` 세 키 모두 수용 (nullable). **파생 규칙은 스키마 바깥**(생성 파이프라인 책임) — 기본 kebab-case, override 가능. 스키마는 값이 오든 안 오든 validate만.
2. **FLOAT → dimension/number**: 이름 기반 파생 규칙도 **스키마 바깥**. 스키마는 `type` 값만 검증.
3. **hidden 토큰**: `hidden: true`로 포함 허용 (제외는 뷰 레이어 결정). `hidden-from-publishing` diagnostic으로 표기 가능.
4. **Diagnostic 구조**: 기록로그 2차는 문자열이었으나, 구조화(`{code, message, tokens[]}`) — 필터/집계에 유리.
5. **per-token diagnostics vs catalog diagnostics**: 둘 다 유지. per-token은 `DiagnosticCode` 문자열 배열, catalog-level은 객체 배열.

### 검증 산출물

- `schemas/tokens.v1.json` — 5.1KB, Draft 2020-12 유효
- `fixtures/tokens.sample.json` — 4토큰, validate PASS
- `fixtures/tokens.invalid.json` — negative fixture, 6/6 오류 탐지
- `scripts/validate-tokens.mjs` — CLI, exit code 1 on fail

### ajv negative 탐지 리스트 (증거)

```
/source/freshness  must match format "date-time"
/modes/0           must match pattern "^[a-z][a-z0-9-]*$"
/tokens/0/id       must match pattern "^token:[a-z0-9]+(\.[a-z0-9_-]+)*$"
/tokens/0/type     must be equal to one of the allowed values
/tokens/0/values   must NOT have additional properties (key "LIGHT")
/tokens/0/usage/0  must be equal to one of the allowed values
```

## 실패 및 원인

- 없음. 이번 사이클은 off-figma 작업(파일 작성 + ajv)이라 Bridge 이슈 부재.

## 해결 방법

- N/A

## 다음 사이클 이슈

1. **753개 전수 스캔** — `figma_get_variables`로 WDS_tokens 전체 덤프 → `fixtures/tokens.full.json` 초안 → 이 스키마로 validate (대규모 fail 지점이 나오면 스키마 보강)
2. **파생 파이프라인** — Figma raw → v1 shape 변환기 (`scripts/figma-to-tokens-v1.mjs`): name→id, scopes→usage, codeSyntax→platformCode, WEB 자동 파생
3. **description 공백 + 중복 alias 전수 통계** — 전수 스캔 데이터에 대해 diagnostics 자동 생성
4. **TYPO_tokens(iOS/AOS/WEB mode) fixture** — `modes: ["ios","aos","web"]`로 동일 스키마 수용되는지 검증
5. **npm script 등록** — `package.json`에 `"validate:tokens": "node scripts/validate-tokens.mjs"` 추가
6. **Component Catalog Schema v1 시작** — tokens 사이클과 동일 패턴 적용
