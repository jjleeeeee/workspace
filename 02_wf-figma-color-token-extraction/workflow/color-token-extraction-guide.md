# 컬러 토큰 추출 운영가이드

> 최초 기준 실행 기록: [../history/2026-04-23_color-token-rest-extraction.md](../history/2026-04-23_color-token-rest-extraction.md)  
> archived Sprint 문맥: [../../99_archive/02_design-dev-test_legacy/00_splint](../../99_archive/02_design-dev-test_legacy/00_splint)

**목표:** Figma Variables에서 Chord DS color token을 반복 추출할 때 같은 판단을 재현할 수 있도록 A-Z 절차를 정리한다. 나중에 Codex Skill로 승격할 때 이 문서를 원천 reference로 쓴다.

## 1. 추출 원칙

### 추천안

Figma REST API를 대량 추출의 기준 원천으로 사용하고, figma-console MCP는 핵심 샘플 교차 검증에만 사용한다.

트레이드오프:

- REST API는 대량 추출과 자동화에 안정적이다.
- 단, sandbox 환경에서는 네트워크 승인이 필요할 수 있다.
- Figma 화면/console MCP와 완전히 같은 뷰를 보장하지 않으므로, 삭제 참조 같은 예외는 별도 판단이 필요하다.

### 대안

figma-console MCP만으로 Variables를 조회한다.

트레이드오프:

- 현재 Figma 화면 기준 확인에는 직관적이다.
- 하지만 대량 조회가 불안정할 수 있고, 전체 955개 Variables를 반복 추출하기에는 REST보다 작업 재현성이 낮다.

## 2. 입력과 출력

### 입력

| 항목 | 값 |
|---|---|
| Figma fileKey | `DWEduE6GfxYMlyxKPNJ8jA` |
| REST endpoint | `GET https://api.figma.com/v1/files/{file_key}/variables/local` |
| 인증 | `FIGMA_ACCESS_TOKEN` |
| 대상 collection | `WDS_tokens` |
| 대상 type | `COLOR` |
| 대상 name prefix | `system/color/`, `system/fixed_color/` |
| 제외 prefix | `base/color/` |
| schema | `../cds-catalogs/schemes/tokens.v1.json` |

### 출력

| 항목 | 값 |
|---|---|
| 출력 폴더 | `outputs/current` |
| 출력 파일 | `tokens.color.v1.0.json` |
| modes | `light`, `dark` |
| values | 최종 resolved hex |
| aliasOf | `null` |
| 현재 기준 token 수 | `408` |

## 3. 전체 절차

### Step 1 — REST 데이터 가져오기

`FIGMA_ACCESS_TOKEN`이 있는 환경에서 Variables local endpoint를 호출한다.

검증 기준:

- HTTP status가 `200`이어야 한다.
- 현재 기준 응답 규모는 `variableCollections: 11`, `variables: 955`였다.
- 응답의 핵심 데이터는 `data.meta.variableCollections`, `data.meta.variables`에 있다.

### Step 2 — collection 선택

`variableCollections`에서 name이 `WDS_tokens`인 collection을 찾는다.

주의:

- 같은 name의 collection이 여러 개 있을 수 있으므로 `variableIds.length`가 가장 큰 collection을 primary로 선택한다.
- 현재 color, size의 기준 collection은 `WDS_tokens` primary collection이다.

### Step 3 — lookup map 만들기

반복 resolve를 위해 다음 map을 만든다.

- `variableById`: `variable.id -> variable`
- `collectionById`: `collection.id -> collection`
- `modeNameByCollectionId`: `collection.id -> modeId/name map`

mode name은 다음처럼 정규화한다.

| Figma mode name | output mode |
|---|---|
| `Light` | `light` |
| `Dark` | `dark` |
| `iOS` | `ios` |
| `AOS` | `aos` |
| `WEB` | `web` |
| `Mode 1` | `mode-1` |

Color Catalog에서는 `light`, `dark`만 사용한다.

### Step 4 — color 변수 필터링

`WDS_tokens` 안에서 아래 조건을 모두 만족하는 variable만 후보로 둔다.

```text
resolvedType === "COLOR"
name startsWith "system/color/" OR "system/fixed_color/"
```

명시적으로 제외하는 것:

```text
base/color/*
```

이 정책의 이유:

- DSL/LLM 렌더링은 primitive base token보다 semantic system token을 쓰는 편이 안정적이다.
- `base/color/*`는 alias resolve 과정의 내부 재료로만 쓰고, 최종 catalog에는 노출하지 않는다.
- SameColor, FixedColor 정리는 후속으로 미룬다. 현재는 system token을 최종 hex로 flatten하기 때문이다.

### Step 5 — alias를 최종 값으로 resolve

각 variable의 mode별 value를 읽는다.

값이 직접 RGBA라면 바로 hex로 바꾼다. 값이 alias라면 `VARIABLE_ALIAS.id`를 따라가서 최종 RGBA까지 재귀 resolve한다.

resolve 규칙:

- alias target이 있으면 같은 modeId 기준으로 계속 따라간다.
- target variable에 해당 mode 값이 없으면 첫 번째 값을 fallback으로 쓴다.
- alias target이 REST 응답에 없으면 dangling으로 본다.
- 순환 alias를 만나면 dangling으로 본다.
- output의 `values.{mode}.aliasOf`는 항상 `null`로 둔다.

### Step 6 — RGBA를 hex로 변환

RGBA channel은 `0..1` float로 오므로 `Math.round(channel * 255)` 방식으로 byte로 변환한다.

출력 규칙:

- alpha가 `0.999` 이상이면 `#RRGGBB`
- alpha가 `0.999` 미만이면 `#RRGGBBAA`
- hex는 uppercase

예시:

```json
{
  "light": {
    "raw": "#00CBD5",
    "aliasOf": null
  },
  "dark": {
    "raw": "#01D5DF",
    "aliasOf": null
  }
}
```

### Step 7 — token id와 metadata 만들기

id는 source name을 기반으로 만든다.

변환 규칙:

```text
system/color/button/default
-> token:system.color.button.default

system/fixed_color/roles/primary
-> token:system.fixed-color.roles.primary
```

세부 규칙:

- prefix는 `token:`
- `/`는 `.`
- `_`는 `-`
- 소문자화
- schema pattern: `^token:[a-z0-9][a-z0-9_-]*(\\.[a-z0-9_-]+)*$`

token shape:

```json
{
  "id": "token:system.color.button.default",
  "name": "system/color/button/default",
  "type": "color",
  "values": {
    "light": { "raw": "#00CBD5", "aliasOf": null },
    "dark": { "raw": "#01D5DF", "aliasOf": null }
  },
  "usage": ["all"],
  "platformCode": {
    "ios": "buttonDefault",
    "android": "buttonDefault",
    "web": "button-default"
  },
  "description": null,
  "hidden": false,
  "figmaKey": "f6f160cc8dd289ae1a5b2a2ef37e362b110bd4cb",
  "diagnostics": ["documentation:missing"]
}
```

### Step 8 — usage scope 정규화

Figma scope는 schema enum에 맞게 변환한다.

중요 매핑:

| Figma scope | output usage |
|---|---|
| `ALL_SCOPES` | `all` |
| `ALL_FILLS` | `all` |
| `SHAPE_FILL` | `shape-fill` |
| `TEXT_FILL` | `text-fill` |
| `STROKE_COLOR` | `stroke` |
| `EFFECT_COLOR` | `effect` |

실패 사례:

- `ALL_FILLS`를 기계적으로 `all-fills`로 바꾸면 schema enum 검증에 실패한다.
- 따라서 `ALL_FILLS -> all`은 명시 매핑으로 유지해야 한다.

### Step 9 — unresolved color 제외

Color Catalog는 모든 값이 최종 hex여야 한다.

따라서 하나라도 mode value가 hex가 아니면 최종 `tokens` 배열에서 제외한다. 대신 catalog-level diagnostics에 남긴다.

현재 확인된 예외:

```text
system/color/roles/brand-green
id: VariableID:1258:60662
REST 상태: deletedButReferenced: true
alias target: VariableID:7602:99996, VariableID:7606:100151
처리: output 제외, diagnostics에 alias:dangling 기록
```

console MCP 단독 조회에서도 `system/color/roles/brand-green`은 `variables: []`였다. 따라서 정상 current token으로 보지 않는다.

### Step 10 — catalog source 작성

catalog의 `source`는 다음 의미로 작성한다.

| field | 의미 |
|---|---|
| `origin` | `figma:Chord Design System` |
| `fileKey` | Figma fileKey |
| `collection` | `WDS_tokens` |
| `version` | Figma 원천의 `base/wds_version` 값 |
| `freshness` | 추출 시각 ISO string |
| `coverage.total` | 최종 output token 수 |
| `coverage.documented` | description 있는 token 수 |
| `coverage.hidden` | hidden token 수 |
| `stageLabel` | 산출물 단계. 현재는 `v1.0` |

주의:

- `source.version: "0.4.10"`은 산출물 버전이 아니라 Figma 원천 DS version이다.
- 산출물 버전은 파일명과 `source.stageLabel`로 관리한다.

## 4. 검증 체크리스트

추출 후 반드시 확인한다.

| 체크 | 기대값 |
|---|---:|
| `tokens.color.v1.0.json` JSON parse | pass |
| schema 핵심 제약 | errorCount `0` |
| token 수 | `408` |
| modes | `light`, `dark` |
| `base/color` 포함 수 | `0` |
| non-hex color value 수 | `0` |
| `aliasOf !== null` 수 | `0` |
| invalid usage 수 | `0` |
| `all-fills` usage 수 | `0` |

샘플 값도 같이 확인한다.

| token | light | dark |
|---|---|---|
| `token:system.color.button.default` | `#00CBD5` | `#01D5DF` |
| `token:system.color.text.primary` | `#00B8C1` | `#01D5DF` |
| `token:system.fixed-color.roles.primary` | `#01D5DF` | `#01D5DF` |

## 5. console MCP 교차 검증

REST output 생성 후, 전체를 console MCP로 다시 뽑기보다 핵심 샘플만 비교한다.

권장 샘플:

- `system/color/button/default`
- `system/color/text/primary`
- `system/fixed_color/roles/primary`
- 예외 확인용 `system/color/roles/brand-green`

판단 기준:

- 정상 샘플은 REST output과 console MCP resolved value가 같아야 한다.
- `brand-green`처럼 console MCP가 빈 결과를 반환하면 current token이 아니라 삭제 참조로 본다.

## 6. 실패 패턴과 처리

| 실패 | 원인 | 처리 |
|---|---|---|
| REST DNS 실패 | sandbox 네트워크 제한 | escalated command로 REST 호출 |
| `FIGMA_ACCESS_TOKEN` 없음 | 인증 환경 누락 | env 설정 후 재시도 |
| schema usage enum 실패 | `ALL_FILLS -> all-fills` 오변환 | `ALL_FILLS -> all` 명시 매핑 |
| non-hex color 발견 | alias target 누락 또는 순환 | output 제외 + `alias:dangling` diagnostics |
| source version 혼동 | DS 원천 버전과 산출물 버전 혼동 | `source.version` 유지, `stageLabel`만 변경 |

## 7. 결과물 기준

현재 기준 color output은 다음 상태를 만족해야 한다.

```text
file: outputs/current/tokens.color.v1.0.json
collection: WDS_tokens
tokens: 408
modes: light, dark
base/color output: 0
value format: #RRGGBB or #RRGGBBAA
aliasOf: null
stageLabel: v1.0
source.version: 0.4.10
```

## 8. 현재 repo 스크립트

현재 이 폴더에는 운영가이드 기준의 실행 스크립트가 영구화되어 있다.

```text
tools/
├── extract-figma-color-tokens.mjs
├── extract-figma-color-tokens.test.mjs
└── validate-color-token-catalog.mjs
```

실행 순서:

1. `node tools/extract-figma-color-tokens.test.mjs`
2. `node tools/extract-figma-color-tokens.mjs --output-dir outputs/current --raw-output outputs/raw/figma.variables.local.<YYYY-MM-DD>.json`
3. `node tools/validate-color-token-catalog.mjs --input-dir outputs/current`
4. 이전 snapshot 또는 canonical catalog와 diff 확인

## 9. 다음 반복 작업 순서

1. Figma REST API로 `variables/local` 재호출
2. `WDS_tokens` primary collection 선택
3. `system/color/*`, `system/fixed_color/*`만 필터링
4. alias를 최종 hex로 flatten
5. unresolved color 제외 및 diagnostics 기록
6. `tokens.color.v1.0.json` 또는 새 stageLabel 파일로 저장
7. `tools/validate-color-token-catalog.mjs`로 검증
8. console MCP 샘플 교차 검증
9. 중요한 원천 변화는 `history/`에 기록

## 10. 보류 항목

- SameColor / FixedColor naming cleanup
- `system/color/roles/brand-green` diagnostics 유지 여부
