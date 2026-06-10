# 변경 이력

Weverse Claude Code Plugin Marketplace의 모든 주요 변경사항을 기록합니다.

## [Unreleased]

### Planned
- 사내 Confluence 검색 플러그인
- iOS 개발 Best Practices skill
- API 키 자동 검증 hook

## [cds-ds 0.8.0] - 2026-04-24

### Added
- **`dsl-to-code` Auto-activating Skill** — DSL JSON → 플랫폼 코드(SwiftUI/Compose/Web) 변환 + 자동 평가 하네스
  - `skills/dsl_to_code/SKILL.md` — 공통 변환 규칙 + 5단계 워크플로우 오케스트레이션
    - Step 0: 사전 조건 확인 (DSL 파일, 출력 디렉터리, ds-manifest.json 로드)
    - Step 1: 플랫폼 감지 + 플랫폼 특화 MD 선택적 로드 (Read 도구 사용)
    - Step 2: 평가 하네스 사전 확정 (`harness.json`) — 코드 생성 전에 기준 잠금 (확증 편향 방지)
    - Step 3: 코드 생성 (이전 `fix_hints` 반영)
    - Step 4: 4종 평가 (Lint, Build, Static Check, Screenshot)
    - Step 5: PASS/FAIL 판정 + 최대 3 사이클 반복 개선
  - `skills/dsl_to_code/SWIFTUI.md` — iOS SwiftUI 특화 규칙
    - WDS 토큰 API 매핑 (Color.asColor, .wdsTextStyle(), WDS.Size.*, .wdsShadow())
    - 레이아웃: HStack/VStack/ZStack, Sizing: .frame(maxWidth:.infinity)/.fixedSize()
    - Lint: `swiftlint lint --strict`, Build: XcodeBuildMCP / xcodebuild, Screenshot: XcodeBuildMCP
  - `skills/dsl_to_code/COMPOSE.md` — Android Jetpack Compose 특화 규칙
    - WDS 토큰 API 매핑 (WDSTheme.color.*, WDSTheme.typography.*, WDSTheme.size.*)
    - 레이아웃: Row/Column/Box, Sizing: fillMaxWidth()/wrapContentSize()
    - Lint: `ktlint`, Build: `./gradlew assembleDebug`, Screenshot: Paparazzi
  - `skills/dsl_to_code/WEB.md` — Web HTML/CSS 특화 규칙
    - CSS 변수 매핑 (`var(--wds-color-*)`, `var(--wds-size-*)`)
    - 레이아웃: flexbox, Sizing: width:100%/fit-content
    - Lint: prettier+stylelint, Screenshot: Headless Chrome
    - **주의**: Headless Chrome 최소 CSS viewport 500px (--window-size=390,800 무시)

### Notes
- `dsl-to-code`는 slash command가 아닌 **auto-activating skill** — trigger 매칭 시 자동 활성화
- trigger: "dsl to code, DSL → 코드, DSL을 구현, implement DSL, DSL 구현"
- 플랫폼 특화 MD는 SKILL.md와 같은 디렉터리에 있으며 Claude가 Step 1에서 `Read`로 선택 로드

---

## [cds-ds 0.7.0] - 2026-04-24

### Added
- `/ds-manifest` Slash Command — DS module 탐색 → `ds-manifest.json` 생성·업데이트
  - 플랫폼 자동 감지 (iOS: `Package.swift`/`Podfile`, Android: `build.gradle`, Web: `package.json`)
  - 플랫폼별 파일 탐색 패턴 (Swift `WDS*` 타입, Kotlin Composable 호출, TS/TSX import)
  - cds-catalog 이름 매핑 (`WDSTextButton` → `textbutton` 등 kebab-case 정규화)
  - 신규 생성 및 업데이트 모드 지원 (기존 항목 보존, 새 항목 추가)

---

## [cds-ds 0.6.0] - 2026-04-24

### Added
- **DS 모듈 매니페스트 시스템** — 플랫폼별 사용 가능한 DS 자산 선언 지원
  - `servers/ds_manifest_schema.json` — `ds-manifest.json` 스킴 정의 (DS module 최상위 폴더 고정 배치)
  - `ds_manifest_schema()` MCP 도구 — 매니페스트 스킴 반환 (플랫폼 팀 작성 참조용)
  - `ds_list(manifest)` — manifest 전달 시 선언된 토큰·컴포넌트만 반환 (실제 카탈로그와 교집합)
  - `ds_get(ids, manifest)` — manifest 허용 목록 외 항목 missing 처리, 허용 항목은 cds-catalog에서 정의 fetch
  - DSL 출력에 `platform`, `dsManifest` 최상위 필드 추가 (매니페스트 사용 시)
- `/figma-to-dsl`, `/dsl-harness` — Step 0: DS module 루트의 `ds-manifest.json` 자동 로드

### Changed
- `ds_list`, `ds_get`: 기존 파라미터 없는 호출 동작 완전 유지 (하위 호환)

### Notes
- `ds-manifest.json` 소유: **플랫폼 팀(호출자)**. DS MCP는 스킴 공급 역할만 담당
- manifest = "무엇을 쓸 수 있다" / cds-catalog = "무엇이란 이런 속성을 가지고 있다"

---

## [cds-ds 0.5.0] - 2026-04-24

### Added
- **`samples/card/`** — Common Slot Card molecule (Web only)
  - `card.dsl.json` — DSL v1 명세 (Common_Slot: section-header + card(thumbnail·header·body·footer))
  - `web/index.html` — HTML + CSS 인터랙티브 데모 (3-iteration, 28/28 항목 통과)
  - `SPEC_AUDIT.md` — Figma 비교 감사 리포트 (JS 위치 검증 포함)

---

## [cds-ds 0.4.0] - 2026-04-24

### Added
- `samples/` 디렉터리 — Figma DS 컴포넌트 구현 샘플 (DSL + 3개 플랫폼 코드)
- **`samples/text-button/`** — WDS Text Button Atom (576 variants)
  - `text-button.dsl.json` — DSL v1 명세
  - `web/index.html` — HTML + CSS 인터랙티브 데모 (3-iteration, 24/24 항목 통과)
  - `ios/WDSTextButton.swift` — SwiftUI 컴포넌트 (21/22, Outlined_gray strokeBorder 잔여)
  - `android/WDSButton.kt` — Jetpack Compose 컴포넌트 (20/20)
  - `SPEC_AUDIT.md` — 플랫폼별 Figma 비교 감사 리포트
- **`samples/bottom-popup/`** — WDS Bottom Popup Molecule
  - `bottom-popup.dsl.json` — DSL v1 명세 (atoms: WDSTextField, WDSCheckbox, WDSTopNavigation)
  - `web/index.html` — 4개 variant 인터랙티브 데모 (Overflow×Checkbox 매트릭스, 스크림·애니메이션)
  - `ios/WDSBottomPopup.swift` — SwiftUI molecule (drag dismiss, spring animation)
  - `android/WDSBottomPopup.kt` — Jetpack Compose molecule (AnimatedVisibility, verticalScroll)
  - `SPEC_AUDIT.md` — 3-iteration Figma 비교 감사 리포트 (Web 30/30, iOS 20/20, Android 20/20)
  - **`atoms/text-field/`** — WDSTextField atom (DSL + Web/iOS/Android, counter in title row)
  - **`atoms/checkbox/`** — WDSCheckbox atom (DSL + Web/iOS/Android, circle/square type)
  - **`atoms/top-navigation/`** — WDSTopNavigation atom (DSL + Web/iOS/Android, title left-align)

### Fixed
- Bottom Popup: Close Button을 TopNavigation 내부 → 별도 행(40px, right-aligned)으로 분리 (Iter 2)
- TextField: counter 표시 위치를 footer → title row 우측으로 이동 (Iter 3, Figma 명세 준수)

---

## [cds-ds 0.3.0] - 2026-04-24

### Added
- `/ds-token-lint` Slash Command + `servers/ds_token_lint.py` — DSL JSON 토큰 참조 lint
  - `$` 없는 raw value (hex/px/폰트명)가 DS 토큰으로 존재하면 ERROR + 토큰 경로 제안
  - `$` 없는 raw value가 카탈로그에도 없으면 ERROR (미등록 토큰 직접 사용)
  - `$` 로 시작하지만 `.` 구분자 없는 잘못된 형식 → ERROR
  - `$token.path` 가 cds-catalogs에 없으면 WARNING
  - 단일 파일 또는 디렉터리(`.`) 전체 검사 지원

### Changed
- `figma_fetch_design()`: `boundVariables` 해석을 hex 역방향 매핑 → **figmaKey 기반 직접 매핑**으로 전환
  - Figma Variables API `VariableID → key(figmaKey)` → cds-catalog `figmaKey` 체인으로 시멘틱 토큰 1:1 매핑
  - `_resolve_var_ref()` 헬퍼가 `figmaKey`, `tokenName`, `resolvedType` 반환
  - `source.variablesResolved` 필드 추가 (Variables API 성공 여부)
  - INSTANCE 자식 TEXT 노드 재귀 탐색으로 타이포그래피 BV(fontSize·fontWeight·lineHeight·fontFamily·textFills) 수집

## [cds-ds 0.2.0] - 2026-04-24

### Added
- `figma_fetch_design(url)` MCP 도구 — Figma URL에서 INSTANCE 컴포넌트 시멘틱 데이터 추출 (벡터/픽셀/이미지 제외)
- `ds_dsl_schema()` MCP 도구 — DSL v1 출력 스킴 정의 반환 (Claude 가 DSL 생성 시 참조)
- `/figma-to-dsl <figma-url>` Slash Command — Figma URL → Weverse DS DSL 자동 변환 파이프라인
  - `figma_fetch_design` → `ds_list` → `ds_get` → `ds_dsl_schema` 순서로 Claude 오케스트레이션
- `FIGMA_TOKEN` 환경변수 지원 — `.mcp.json` 및 `run.sh` 에 주입 로직 추가
- Figma 인증 트러블슈팅 가이드 (README.md)

## [1.0.0] - 2024-01-15

### Added
- 마켓플레이스 초기 구조 정의
- `marketplace.json` 스키마 정의
- 템플릿 플러그인 (`plugins/_template/`)
- 문서
  - README.md — 마켓플레이스 개요
  - CLAUDE.md — Claude Code 개발 가이드
  - docs/getting-started.md — 팀원 사용 가이드
  - docs/plugin-development.md — 플러그인 개발 가이드
  - docs/marketplace-registration.md — 마켓플레이스 등록 가이드
  - CONTRIBUTING.md — 기여 가이드
  - CHANGELOG.md — 변경 이력 (본 파일)
- GitHub 리포지토리 구조
  - `.claude-plugin/marketplace.json` — 마켓플레이스 선언
  - `plugins/` — 플러그인 디렉터리
  - `docs/` — 상세 문서

### Documentation
- 플러그인 구조 설명
- Slash commands 작성 방법
- Auto-activating skills 개발 가이드
- Hooks 이벤트 핸들러 구현
- Agents 정의 방법
- MCP servers 통합 방법

## 사전 릴리스

### 개발 준비 (2024-01-14)
- 마켓플레이스 구조 및 요구사항 분석
- 팀원 온보딩 가이드 작성
- 템플릿 플러그인 설계

---

## 릴리스 노트 작성 방법

새 플러그인 추가 또는 마켓플레이스 업데이트 시:

```markdown
### Added
- 새로운 기능 또는 플러그인

### Changed
- 기존 기능 변경

### Fixed
- 버그 수정

### Deprecated
- 더 이상 권장되지 않는 기능

### Removed
- 제거된 기능
```

## 버전 명명

[Semantic Versioning](https://semver.org/) 사용:

- **MAJOR**: Breaking changes (호환되지 않는 변경)
- **MINOR**: Backward-compatible 새 기능
- **PATCH**: Backward-compatible 버그 수정

예: `1.2.3` = Major.Minor.Patch

## 마켓플레이스 업데이트 규칙

### 새 플러그인 추가
- MINOR 버전 증가 (`1.0.0` → `1.1.0`)
- CHANGELOG.md 업데이트

### 플러그인 버그 수정
- PATCH 버전 증가 (`1.1.0` → `1.1.1`)
- 해당 플러그인 버전도 증가

### 마켓플레이스 메타데이터 변경
- MINOR 버전 증가
- 상세 설명 추가

### Breaking change
- MAJOR 버전 증가 (`1.x.x` → `2.0.0`)
- 예: 플러그인 구조 변경, 필수 필드 추가 등

## 타임라인

| 버전 | 날짜 | 주요 변경 |
|------|------|---------|
| cds-ds 0.3.0 | 2026-04-24 | figmaKey 기반 토큰 매핑, /ds-token-lint 명령 추가 |
| cds-ds 0.2.0 | 2026-04-24 | Figma → DSL 변환 플로우 (figma_fetch_design, ds_dsl_schema, /figma-to-dsl) |
| 1.0.0 | 2024-01-15 | 초기 릴리스 |

---

최신 업데이트: 2024-01-15
