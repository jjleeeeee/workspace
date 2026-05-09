# 2026-04-23 — 1차 · 컬러 토큰 REST 추출 및 분리 출력

> 상위 문서: [../../TF_Splint_1.md](../../TF_Splint_1.md)
> 이전 사이클: [../2026-04-21/2026-04-21_8차_전체토큰_fixture_생성.md](../2026-04-21/2026-04-21_8차_전체토큰_fixture_생성.md)

**목표:** Figma REST API로 Chord DS Variables를 재추출해 `color`, `size`, `typography` 토큰 카탈로그를 분리 출력한다. Color Catalog는 `base/color/*`를 LLM/DSL 노출 대상에서 제외하고, `system/color/*` 및 `system/fixed_color/*`를 최종 hex로 flatten한다.

## 사용 도구/방법

- Figma REST API: `GET /v1/files/{file_key}/variables/local`
- fileKey: `DWEduE6GfxYMlyxKPNJ8jA`
- 인증: `FIGMA_ACCESS_TOKEN`
- Node 임시 변환 스크립트: `/tmp/create-token-output.mjs`
- Node 임시 검증 스크립트: `/tmp/validate-token-output.mjs`
- figma-console MCP: `figma_get_variables(format=filtered, resolveAliases=true)`
- 비교 대상 스키마:
  - `cds-catalogs/schemes/tokens.v1.json`
  - `/Users/jj.iee/Desktop/WTF/schemas/tokens.v1.json`
  - `/Users/jj.iee/ClickTF/cds-catalogs/schemes/tokens.v1.json`

## 진행 과정

### Turn 1 — 기존 스프린트 문서 파악

- `cds-catalogs/00_splint`의 목적과 기록 구조를 확인했다.
- `TF_Splint_1.md`는 DS-MCP Sprint #1의 목표, A/B 측정, Token/Component Catalog 방향을 담고 있었다.
- `기록로그`는 날짜별 폴더와 `YYYY-MM-DD_N차_주제.md` 파일명 패턴으로 관리되고 있었다.

### Turn 2 — 사용자 작업 범위 확정

- 사용자가 이번에 해야 할 일을 다음으로 정리했다.
  - 토큰 카탈로그 작성
  - 컬러, 타이포그래피, 사이즈 개별 파일 작성
  - SameColor, FixedColor 등은 DSL로 다시 렌더링되므로 지금은 시급도 낮음
- 이에 따라 이번 작업의 목표를 "정리 이슈 해결"이 아니라 "LLM/DSL 입력용 토큰 카탈로그 분리 출력"으로 좁혔다.

### Turn 3 — Color Catalog 정책 결정

- 사용자가 `base/color`를 쓰지 않고 `system`에 hex로 변환할 수 있는지 물었다.
- 결정:
  - `base/color/*`는 출력에서 제외
  - `system/color/*`, `system/fixed_color/*`만 Color Catalog에 포함
  - `values.{mode}.raw`에는 최종 hex
  - `values.{mode}.aliasOf`는 `null`
- 이유:
  - DSL/LLM은 primitive base보다 semantic system token을 참조하는 것이 더 안정적이다.
  - SameColor, FixedColor 정리는 후속 과제로 남겨도 현재 렌더링 목적에는 영향이 작다.

### Turn 4 — Figma REST API 가능 여부 검증

- REST API 호출을 시도했다.
- 결과:
  - endpoint: `https://api.figma.com/v1/files/DWEduE6GfxYMlyxKPNJ8jA/variables/local`
  - status: `200`
  - `variableCollections`: 11
  - `variables`: 955
- 결론:
  - Figma Desktop Bridge나 console MCP 없이도 REST API로 Variables를 가져올 수 있었다.
  - 대규모 추출은 console MCP보다 REST API가 안정적인 원천으로 판단됐다.

### Turn 5 — `01_tokenOutput`에 3개 draft 생성

- 출력 위치: `cds-catalogs/01_tokenOutput`
- 생성 파일:
  - `tokens.color.v0.1-draft.json`
  - `tokens.size.v0.1-draft.json`
  - `tokens.typography.v0.1-draft.json`
- 1차 생성 결과:
  - color: 409 tokens
  - size: 66 tokens
  - typography: 71 tokens
- 주요 변환 규칙:
  - `name` → `id`: `token:` + dot path
  - `_`는 `-`로 치환
  - mode 정규화: `iOS`→`ios`, `AOS`→`aos`, `WEB`→`web`, `Mode 1`→`mode-1`
  - COLOR → `color`
  - FLOAT + weight 계열 → `number`
  - 그 외 FLOAT → `dimension`
  - STRING → `string`
  - `platformCode.web`은 Figma에 없으면 name 기반 kebab-case 파생

### Turn 6 — dangling color 발견 및 제외

- Color output 검증 중 hex로 resolve되지 않은 값 1개가 발견됐다.
- 대상:
  - `system/color/roles/brand-green`
  - id: `VariableID:1258:60662`
- REST 원본 상태:
  - `deletedButReferenced: true`
  - light alias target: `VariableID:7602:99996`
  - dark alias target: `VariableID:7606:100151`
  - 두 alias target 모두 REST local variables 응답 안에서 resolve 불가
- 처리:
  - 최종 Color Catalog에서는 제외
  - catalog-level diagnostics에 `alias:dangling`으로 기록
- 보정 후 결과:
  - color: 408 tokens
  - size: 66 tokens
  - typography: 71 tokens

### Turn 7 — schema 동기화

- 사용자가 다음 스키마들과 현재 workspace 스키마가 같은지 확인 요청했다.
  - `/Users/jj.iee/ClickTF/cds-catalogs/schemes/tokens.v1.json`
  - `/Users/jj.iee/Desktop/WTF/schemas/tokens.v1.json`
- 확인 결과:
  - ClickTF와 WTF의 `tokens.v1.json`은 동일했다.
  - workspace의 `cds-catalogs/schemes/tokens.v1.json`만 달랐다.
- 차이:
  - workspace 기존 패턴: `^token:[a-z0-9]+(\\.[a-z0-9_-]+)*$`
  - WTF/ClickTF 패턴: `^token:[a-z0-9][a-z0-9_-]*(\\.[a-z0-9_-]+)*$`
- 적용:
  - workspace 스키마를 WTF/ClickTF 버전으로 동기화
  - 동기화 후 SHA256:
    - `cc85e4ae990a607ef9059356309bb334ca0cb2057632cb0b374af8439d538ae1`
- 영향:
  - draft JSON 파일은 자동 변경되지 않았다.
  - 변경된 것은 검증 기준뿐이다.

### Turn 8 — 새 schema 기준 검증

- repo에 AJV dependency가 없어 임시 Node 검증 스크립트로 `tokens.v1.json` 핵심 제약을 확인했다.
- 1차 검증 실패:
  - color에서 Figma scope `ALL_FILLS`가 `all-fills`로 들어가 schema enum에 걸림
- 해결:
  - 변환 매핑에 `ALL_FILLS -> all` 추가
  - 3개 output 파일 재생성
- 최종 검증 결과:

| 파일 | tokens | modes | error |
|---|---:|---|---:|
| `tokens.color.v0.1-draft.json` | 408 | light, dark | 0 |
| `tokens.size.v0.1-draft.json` | 66 | light, dark | 0 |
| `tokens.typography.v0.1-draft.json` | 71 | ios, aos, web, mode-1 | 0 |

추가 확인:

| 항목 | 결과 |
|---|---:|
| Color 내 `base.color` count | 0 |
| Color non-hex value count | 0 |
| Color `aliasOf !== null` count | 0 |
| Color `all-fills` usage count | 0 |

### Turn 9 — console MCP 교차 검증

- figma-console MCP smoke test:
  - `system/color/button/default` 단일 조회 성공
  - console MCP resolve 값과 draft 값 일치
- 샘플 비교 결과:

| token | console MCP | draft | 결과 |
|---|---|---|---|
| `system/color/button/default` | light `#00CBD5`, dark `#01D5DF` | 동일 | match |
| `system/color/text/primary` | light `#00B8C1`, dark `#01D5DF` | 동일 | match |
| `system/fixed_color/roles/primary` | light/dark `#01D5DF` | 동일 | match |
| `system/size/padding/box/50` | light/dark `4` | 동일 | match |
| `system/size/radius/box/75` | light/dark `6` | 동일 | match |
| `system/size/button-height/xlarge` | light/dark `52` | 동일 | match |
| `TYPO_tokens font_family/title` | iOS `WeGothicSans`, AOS `Roboto`, WEB `Pretendard` | 동일 | match |
| `TYPO_circular_tokens font_family/title` | `CircularXX TT` | 동일 | match |

`system/color/roles/brand-green`은 console MCP 단독 조회에서도 `variables: []`로 반환됐다. 따라서 REST의 `deletedButReferenced` 흔적을 draft에서 제외한 판단은 유지한다.

### Turn 10 — draft 파일명 및 v1.0 승격 판단

사용자가 `01_tokenOutput`의 파일명에서 `draft`를 제거하고 버전을 `1.0`으로 맞춰도 되는지 질문했다.

확인 결과 현재 파일명은 `tokens.*.v0.1-draft.json`이고, JSON 내부에서는 `source.stageLabel`만 `v0.1-draft`로 표시되어 있다. `source.version`의 `0.4.10`은 Figma 원천의 DS version token 값으로 보이므로 산출물 버전 승격과는 분리해서 유지하는 것이 맞다.

권장안은 다음과 같다.

- 파일명: `tokens.color.v1.0.json`, `tokens.size.v1.0.json`, `tokens.typography.v1.0.json`
- 내부 stage label: `source.stageLabel: "v1.0"`
- 원천 버전: `source.version: "0.4.10"` 유지

단, 변환 스크립트가 아직 `/tmp` 임시 파일인 상태라 반복 재생성까지 고려하면 스크립트 영구화 전에는 `v1.0`이 "현재 검증된 snapshot"이라는 의미가 된다.

### Turn 11 — tokenOutput 파일 v1.0 적용

사용자가 다음 행동 진행을 요청했다.

적용 내용:

- `source.stageLabel`을 `v0.1-draft`에서 `v1.0`으로 변경
- 파일명을 `tokens.*.v0.1-draft.json`에서 `tokens.*.v1.0.json`으로 변경
- `source.version: "0.4.10"`은 Figma 원천 DS version으로 판단해 유지
- 기록로그의 현재 산출물 표기를 v1.0 파일명으로 갱신

검증 결과:

| 파일 | tokens | modes | errorCount |
|---|---:|---|---:|
| `tokens.color.v1.0.json` | 408 | light, dark | 0 |
| `tokens.size.v1.0.json` | 66 | light, dark | 0 |
| `tokens.typography.v1.0.json` | 71 | ios, aos, web, mode-1 | 0 |

### Turn 12 — 컬러 토큰 추출 운영가이드 문서화

사용자가 지금까지 진행한 컬러 토큰 추출 방식을 A-Z로 문서화하고, 나중에 Skill로 만들어 반복 작업하고 싶다고 요청했다.

처리:

- 별도 운영가이드 문서 생성
- REST 추출 원칙, 입력/출력, collection 선택, color 필터링, alias resolve, hex flatten, unresolved token 제외, schema 검증, console MCP 교차 검증, 실패 패턴을 절차화
- 나중에 Codex Skill로 승격할 때의 권장 폴더 구조와 script/reference 분리 방향 기록

산출물:

- `00_splint/운영가이드/컬러토큰_추출_운영가이드.md`

### Turn 13 — 운영가이드와 실행 기록 분리

사용자가 방금 정리한 운영가이드는 날짜별 기록 md와 분리하는 편이 좋지 않겠냐고 제안했다.

결정:

- 운영가이드는 반복 실행과 Skill 승격의 기준 문서이므로 날짜별 기록로그에서 분리한다.
- 실행 기록은 `기록로그/YYYY-MM-DD/*`에 유지한다.
- 반복 절차 문서는 `00_splint/운영가이드/*`에 둔다.

처리:

- `2026-04-23_2차_컬러토큰_추출_운영가이드.md`를 `00_splint/운영가이드/컬러토큰_추출_운영가이드.md`로 이동
- 운영가이드 내부의 상위 문서/기준 실행 기록 상대 링크 수정
- 이 실행 기록에는 새 문서 경로만 링크로 남김

## 발견/결과

### 생성된 토큰 카탈로그

| 파일 | collection | 포함 정책 | tokens |
|---|---|---|---:|
| `01_tokenOutput/tokens.color.v1.0.json` | WDS_tokens | `system/color/*`, `system/fixed_color/*`, hex flatten | 408 |
| `01_tokenOutput/tokens.size.v1.0.json` | WDS_tokens | `system/size/*` | 66 |
| `01_tokenOutput/tokens.typography.v1.0.json` | TYPO_tokens + TYPO_circular_tokens | typography 관련 STRING/FLOAT | 71 |

### Color Catalog 정책 결과

- `base/color/*`는 최종 output에 없음.
- 모든 color value는 hex string이다.
- 모든 color value의 `aliasOf`는 `null`이다.
- `system/color/roles/brand-green`은 정상 토큰이 아니라 REST의 deleted reference로 판단되어 제외됐다.

### Schema 결과

- `cds-catalogs/schemes/tokens.v1.json`은 WTF/ClickTF 버전과 동일하게 동기화됐다.
- 동기화된 스키마 기준으로 3개 output 파일 검증 error `0`.

## 실패 및 원인

1. **인라인 Node 실행 실패**
   - 원인: zsh가 template string/backtick과 `$defs`를 먼저 해석
   - 해결: `/tmp/create-token-output.mjs`, `/tmp/validate-token-output.mjs` 임시 스크립트로 분리

2. **sandbox DNS 실패**
   - 증상: `getaddrinfo ENOTFOUND api.figma.com`
   - 원인: sandbox 네트워크 제한
   - 해결: Figma REST 호출은 승인된 escalated command로 실행

3. **dangling color token**
   - 대상: `system/color/roles/brand-green`
   - 원인: REST 응답에는 `deletedButReferenced: true`로 남았지만 alias target이 local variables에 없음
   - 해결: output에서 제외하고 diagnostics 기록

4. **schema enum 실패**
   - 원인: Figma scope `ALL_FILLS`를 `all-fills`로 변환
   - 해결: `ALL_FILLS -> all` 매핑 추가 후 재생성

## 해결 방법

- 대규모 토큰 원천은 Figma REST API를 사용한다.
- console MCP는 전체 재추출이 아니라 핵심 샘플 교차 검증에 사용한다.
- `base/color/*`는 resolve 과정에서는 쓰되, Color Catalog output에는 노출하지 않는다.
- 삭제 참조 또는 resolve 불가능한 color token은 output에서 제외하고 diagnostics로 남긴다.
- `tokens.v1.json`은 WTF/ClickTF의 완화된 id pattern으로 동기화한다.

## 다음 사이클 이슈

1. **전체 전수 비교 옵션**
   - 지금은 핵심 샘플 검증만 완료.
   - 필요하면 REST output 전체와 console MCP 전체를 페이지 단위로 비교한다.

2. **diagnostics 정책 결정**
   - `system/color/roles/brand-green` 같은 deleted reference를 diagnostics에 유지할지, 완전히 숨길지 결정 필요.

3. **변환 스크립트 영구화**
   - 현재 변환/검증 스크립트는 `/tmp` 임시 파일.
   - 반복 작업이 필요하면 repo script로 승격 검토.

4. **SameColor / FixedColor 후속 정리**
   - 지금은 DSL 재렌더링 우선으로 미룸.
   - 추후 color foundation 정리 시 반영.

## 산출물

- `cds-catalogs/01_tokenOutput/tokens.color.v1.0.json`
- `cds-catalogs/01_tokenOutput/tokens.size.v1.0.json`
- `cds-catalogs/01_tokenOutput/tokens.typography.v1.0.json`
- `cds-catalogs/schemes/tokens.v1.json`
- 이 기록 파일
