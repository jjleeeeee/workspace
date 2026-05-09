# Changelog

[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) 형식 / [Semantic Versioning](https://semver.org/spec/v2.0.0.html) 0.x 라인.

## [0.10.5] - 2026-04-27

### Removed
- `dsl_harness._figma_response_instances` legacy `components[]` 폴백 제거. `nodes[]` 트리만 인지. v2 전환 완료 후 backward-compat 코드 청소.

## [0.10.4] - 2026-04-27

### Changed
- `figma_fetch_design()` 반환을 평탄 `components[]`에서 **`nodes[]` 루트 트리**로 변경. 노드 `type`은 FRAME / TEXT / INSTANCE / GROUP / IMAGE(이미지 fill RECTANGLE), 원본 Figma 타입은 `figmaType`. `frame` 요약은 `figmaType` 필드 사용. 헬퍼 `_design_node_type`/`_extract_bound_variables`/`_apply_layout_and_style`/`_build_design_subtree` 분리.
- `docs/harness-guide.md` 플랫폼 체크포인트 표를 v2 필드명으로 정렬(`layout.kind/axis`, `layout.size`, `style.fills/strokes/effects`, TokenRef → `WDSTheme.*`).

### Fixed
- `dsl_harness.py` — `nodes[]` 또는 레거시 `components[]` 모두에서 INSTANCE 수집; layout 오류 메시지를 kind/axis 기준으로 수정; fill 검사는 `style.fills` 기준; `_catalog_has_visible_text`로 catalog.props·slots(ref/text) 기반 텍스트 검사 보강.
- `ds_token_lint.py` — 전역 재귀가 `catalog.variant/props/state/id`, `name`, `text.value`, `source/metadata/coordinateSystem`, `note`/`asset.alt`/`asset.kind` 등 비-토큰 경로를 false positive로 잡던 문제 해결(경로 기반 제외 목록 `_LINT_EXCLUDED_PATH_SEGMENTS` 추가).

### Audit
- v1 잔존 문구 grep 결과 `dsl_v1.json` 파일과 CHANGELOG/SKILL.md 내 deprecation 주석을 제외하면 전무. samples 6종 JSON 유효성 + 갱신된 lint 통과(error 0).

## [0.10.3] - 2026-04-27

### Changed
- `servers/cds_ds_server.py` `figma_fetch_design()` 출력을 v2 컨벤션으로 정규화. 각 INSTANCE 항목이 `layout.{kind,axis,spacing,padding,alignment,size,frame?,positioning?}`, `style.{fills,strokes,effects,opacity?,cornerRadius?}`, `text.{value}` 구조를 직접 가짐. 토큰 바인딩은 `token:dotted.path` (slashed `system/color/...` → dotted `system.color....`) 자동 변환. SOLID 색상은 `hardcoded:#RRGGBB`. LLM이 raw 응답을 v2로 매핑하는 단계 제거.

### Fixed
- `cds_ds_server.py` 모듈 독스트링 — `ds_dsl_schema` v2로 정정.
- `README.md`, `docs/harness-guide.md`, `agents/dsl_qa_agent.md` — DSL v1·`missing_ds_mapping` 잔존 문구를 v2 기준으로 정리. `figma_fetch_design` 반환 예시도 v2 정규화 출력으로 갱신.
- `commands/figma-to-dsl.md` — `ds_dsl_schema()` 참조 섹션에 `fields` 추가.
- `servers/dsl_harness.py` — v2 `catalog.slots`(`ref`/`text`)·`catalog.props` 반영한 텍스트 완성도 검사; boundVariables 시 `asset`/`catalog` 내 TokenRef 인정. v2 정규화된 `figma.layout.size` 직접 매칭(이전 `fc.width`/`fc.height` 평탄 키 제거).
- `servers/ds_token_lint.py` — 모든 문자열 재귀 검사(필드명 누락으로 raw 색 놓치던 문제 수정); 제안 메시지의 `token:` 경로에서 `$` 제거; 디렉터리 스캔에 `*.dsl.json` 포함·중복 제거.

## [0.10.2] - 2026-04-27

### Changed
- `samples/text-button/text-button.dsl.json` v2 형식으로 재작성 (트리 `nodes[]`, Catalog axes 6축, 슬롯 매핑, TokenRef 4종).
- `samples/card/card.dsl.json` v2 형식으로 재작성 (헤더+카드 트리, gradient/shadow, 텍스트 스타일 토큰).
- `samples/bottom-popup/bottom-popup.dsl.json` v2 형식으로 재작성 (drag-handle/navigation/content/button-area 트리, gradient overlay, sticky 버튼).
- `samples/bottom-popup/atoms/{checkbox,text-field,top-navigation}/*.dsl.json` 3개 v2 형식으로 재작성.

### Notes
- atom DSL 부가 메타(`props` enum, `color_tokens`, `sizing_tokens`, `visual_rules`, `anatomy`, `ai_notes`)는 v2 schema 외 컴포넌트 spec 정보로 그대로 보존.
- 토큰 참조는 `$system/color/...` 슬래시 형식 → `token:system.color....` dotted id 형식으로 일괄 전환.

## [0.10.1] - 2026-04-27

### Changed
- `skills/dsl_to_code/SKILL.md` v2 입력 스킴 명시. TokenRef 4종 처리, SizePolicy 변환, harness `expected*` 필드 v2 형태로 갱신.
- `skills/dsl_to_code/SWIFTUI.md` `token:` → `WDS.Color.*`, `Layout.kind/axis` → `HStack/VStack/ZStack/ScrollView`, SizePolicy → `.frame(maxWidth: .infinity)/.fixedSize`.
- `skills/dsl_to_code/COMPOSE.md` `token:` → `WDSTheme.color.*`, `Layout.kind/axis` → `Row/Column/Box`, Modifier 매핑.
- `skills/dsl_to_code/WEB.md` `token:` → CSS `var(--wds-*)`, `Layout.kind/axis` → flexbox/position, SizePolicy → CSS.
- `servers/dsl_harness.py` v2 `nodes[]` 트리 재귀 탐색, catalog 유무 기반 커버리지, Figma layout/size → v2 SizePolicy/Layout.kind 매칭, TokenRef prefix 4종 인지.
- `servers/ds_token_lint.py` `'token:'/'textStyle:'/'hardcoded:'/'unresolved:'` prefix 분기. `nodes[]` 재귀 탐색으로 style/text/asset 안의 모든 TokenRef 위치 검사.

### Added
- `.gitignore` 첫 생성 (`__pycache__/`, 에디터·OS 산물).

## [0.10.0] - 2026-04-27

### Changed (BREAKING)
- `commands/figma-to-dsl.md` 본문 v2 형식으로 전면 재작성. v1 패턴(평탄 `components[]`, `$color.*` 토큰 참조, `fill_container`/`fit_content` 문자열) → v2(트리 `nodes[]`, `catalog`/`style`/`text`/`asset` 분리, `token:dotted.path` 4종, `SizePolicy` 객체).
- 노드 타입 결정표(FRAME/INSTANCE/TEXT/RECTANGLE/GROUP → Node.type), Catalog 매핑(axes byte-exact 보존), TokenRef 4종, Layout/Style/Text/Asset 필드 매핑 규칙 명시.
- 검증 단계 추가: enums 대조, axes byte-exact 대조, token id 매칭.

### Migration
- v1 DSL JSON을 소비하던 외부 시스템은 v2 변환 필요. `dsl_v1.json` 파일 자체는 보존(legacy 참조용).

## [0.9.0] - 2026-04-27

### Added
- `servers/dsl_v2.json` 신규 추가 — Confluence DSL Schema 문서 기반.
- v2는 트리형 `nodes[]`, `Catalog`/`Layout`/`Style`/`Text`/`Asset` 분리 구조.
- `rules` 섹션: `type_selection`, `catalog_mapping`, `variant_resolution`, `slot_assignment`, `token_reference_syntax`, `required_fields`, `omission_policy`.
- `examples` 5종: textbutton 변환, leading-icon slot, 토큰 폴백, auto-layout stack, gradient+shadow.
- `enums` 22개 유니온 명시.

### Changed
- `servers/cds_ds_server.py` `ds_dsl_schema()` MCP 도구가 `dsl_v2.json` 로드 (`dsl_v1.json`에서 변경).
- `commands/figma-to-dsl.md` description, 6단계 안내 v2로 갱신.
- `README.md` `/figma-to-dsl` 설명 v2로 갱신.

### Notes
- v2 토큰 참조 4종: `token:`/`textStyle:`/`hardcoded:`/`unresolved:`.
- `Catalog.variant`는 cds-catalogs axes 값 byte-exact 보존(공백·괄호·한국어 그대로).
- `CatalogProps`/`CatalogSlots`는 표준 키 + 카탈로그-정의 키 병기. 카탈로그 정의가 ground truth.

## [0.8.0] - 2026-04-26

### Added
- `dsl-to-code` skill 추가 — DSL → SwiftUI/Compose/Web 코드 자동 변환 + 4종 평가 하네스(Lint/Build/Static Check/Screenshot) 최대 3 사이클.

## [0.7.0]

### Added
- `/ds-manifest` 커맨드 — DS module 탐색 후 ds-manifest.json 생성·업데이트.

## [0.6.0]

### Added
- DS 모듈 매니페스트 시스템.

## [0.5.0]

### Added
- `/figma-to-dsl` 커맨드, 토큰 lint, 샘플 3종.

## [0.1.0]

### Added
- 초기 cds-ds MCP 서버 플러그인 (cds-catalogs 카탈로그 fetch).
