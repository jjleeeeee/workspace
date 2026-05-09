# cds-ds

Weverse 디자인 시스템 카탈로그(`weversecorp/cds-catalogs`)를 Claude Code 에이전트에 제공하는 MCP 서버.

## 목적

화면 · 컴포넌트 코드 생성 시, 에이전트가 **필요한 카탈로그만 on-demand 로 fetch** 하도록 한다.  
전체 카탈로그를 맥락에 미리 로드하지 않고, MCP 도구로 선택적 조회.  
`/figma-to-dsl` 명령으로 **Figma URL → DS DSL 자동 변환**,  
`/ds-token-lint` 명령으로 **DSL 파일의 토큰 참조 lint**,  
`/ds-manifest` 명령으로 **DS module 탐색 → `ds-manifest.json` 자동 생성·업데이트**,  
`dsl-to-code` skill로 **DSL → 플랫폼 코드 자동 변환 + 하네스 검증**도 지원한다.

## DS 모듈 매니페스트

### 개념

| 역할 | 파일 | 소유 |
|------|------|------|
| "무엇을 쓸 수 있다" | `ds-manifest.json` | 플랫폼 팀 (각 앱 레포) |
| "무엇이란 이런 속성을 가지고 있다" | cds-catalogs | DS 팀 |

`ds-manifest.json`은 플랫폼(iOS/Android/Web)이 현재 통합한 DS 토큰 컬렉션과 컴포넌트를 선언한다.  
**DS module 최상위 폴더에 고정 배치** (`<ds-module-root>/ds-manifest.json`).

```json
{
  "$schema": "cds-ds/manifest/v1",
  "platform": "ios",
  "tokens": ["tokens.color.v1.0", "tokens.size.v1.0", "tokens.typography.v1.0"],
  "components": ["textbutton"]
}
```

### 동작 방식

`/figma-to-dsl`, `/dsl-harness` 실행 시 DS module 루트의 `ds-manifest.json`을 자동으로 읽는다.  
매니페스트가 있으면 선언된 플랫폼의 토큰·컴포넌트 범위 안에서만 DSL을 생성한다.  
없으면 기존 동작 유지 (cds-catalogs 전체 카탈로그 사용).

---

## 제공 기능

### Auto-activating Skill

#### `dsl-to-code`

DSL JSON을 플랫폼 코드(SwiftUI/Compose/Web)로 변환하고 **평가 하네스**로 품질 검증한다.

**트리거**: `"dsl to code"`, `"DSL → 코드"`, `"DSL을 구현"`, `"implement DSL"`, `"DSL 구현"` 포함 메시지

```
"이 DSL을 SwiftUI로 구현해줘"
"samples/text-button/text-button.dsl.json을 Android Compose 코드로 만들어줘"
```

**워크플로우** (최대 3 사이클):

| Step | 내용 |
|------|------|
| 0 | 사전 조건 확인 (DSL 파일, 출력 디렉터리, ds-manifest.json) |
| 1 | 플랫폼 감지 + 특화 규칙 로드 (SWIFTUI.md / COMPOSE.md / WEB.md) |
| 2 | 평가 하네스 사전 확정 (`harness.json`) — **코드 생성 전에 기준 잠금** |
| 3 | 코드 생성 (fix_hints 반영) |
| 4 | 4종 평가 (Lint + Build + Static Check + Screenshot) |
| 5 | PASS → 완료 / FAIL → Step 3 반복 (최대 3회) |

**플랫폼별 특화 규칙**:
- iOS: `skills/dsl_to_code/SWIFTUI.md` — WDS.Color/Typography/Size API, HStack/VStack, swiftlint
- Android: `skills/dsl_to_code/COMPOSE.md` — WDSTheme.*, Row/Column/Box, ktlint
- Web: `skills/dsl_to_code/WEB.md` — CSS var(--wds-*), flexbox, prettier+headless Chrome

---

### Slash Command

#### `/ds-manifest`

현재 DS module을 탐색해 `ds-manifest.json`을 **생성하거나 업데이트**한다.

```
/ds-manifest          # 플랫폼 자동 감지
/ds-manifest ios      # 플랫폼 직접 지정
```

| 단계 | 동작 |
|------|------|
| 플랫폼 감지 | `Package.swift` → ios / `build.gradle` → android / `package.json` → web |
| 카탈로그 조회 | `ds_list()` — cds-catalog 전체 기준집합 로드 |
| 파일 탐색 | Swift `WDS*` 타입 / Kotlin Composable 호출 / TS import 패턴 |
| 이름 매핑 | `WDSTextButton` → `textbutton` 등 kebab-case 정규화 후 catalog 교집합 |
| 파일 작성 | 신규 생성 또는 기존 항목 보존하며 업데이트 |

#### `/figma-to-dsl <figma-url>`

Figma 화면 URL을 입력하면 Weverse DS DSL(cds-ds/dsl/v2)로 자동 변환한다.

```
/figma-to-dsl https://figma.com/design/{fileKey}/ScreenName?node-id=1-23
```

Claude가 자동으로 아래 순서를 실행한다:
1. `ds-manifest.json` 로드 (DS module 루트에 있으면 자동 적용)
2. `figma_fetch_design(url)` — Figma API로 노드 트리(`nodes[]`, FRAME/TEXT/INSTANCE/GROUP/IMAGE) 시멘틱 데이터 수집
3. `ds_list(manifest)` — 플랫폼 manifest 적용 카탈로그 목록 확인
4. `ds_get(matched_ids, manifest)` — 매핑된 컴포넌트·토큰 카탈로그 fetch
5. `ds_dsl_schema()` — DSL 출력 스킴 로드
6. DSL JSON 생성 및 코드블록 출력 (`platform`, `dsManifest` 필드 포함)

**출력 예시 (v2):**
```json
{
  "schemaVersion": "2.0.0",
  "metadata": { "generator": "cds-ds@<v>", "sourceFile": { "fileKey": "...", "nodeId": "..." } },
  "coordinateSystem": { "unit": "px", "origin": "topLeft", "scope": "relativeToParent", "scale": 1.0 },
  "platform": "ios",
  "nodes": [
    {
      "id": "n1",
      "type": "component",
      "name": "Buy",
      "catalog": {
        "id": "textbutton",
        "variant": { "Type": "Filled", "Size": "Large(44)" },
        "props": { "Button Text": "구매하기" },
        "slots": { "label": { "text": "구매하기" } }
      },
      "layout": {
        "kind": "box",
        "size": { "width": { "mode": "fill" }, "height": { "mode": "fixed", "value": 44 } },
        "padding": { "top": 12, "right": 16, "bottom": 12, "left": 16 }
      },
      "style": {
        "fills": [{ "type": "solid", "color": "token:system.color.button.default" }],
        "cornerRadius": 8
      }
    }
  ]
}
```

### MCP 도구

#### `ds_list(manifest?)`

`cds-catalogs` 레포의 카탈로그 목록 조회. `manifest` 전달 시 선언된 항목만 반환.

**반환**
```json
{
  "tokens":     ["tokens.color.v1.0", "tokens.size.v1.0", "tokens.typography.v1.0"],
  "components": ["textbutton", ...],
  "source":     { "repo": "weversecorp/cds-catalogs", "platform": "ios", "manifestUsed": true }
}
```

#### `ds_get(ids: string[], manifest?)`

지정한 카탈로그 fetch. `manifest` 전달 시 허용 목록 외 항목은 `missing` 처리.

**인자**
- `ids`: 카탈로그 이름 배열 (토큰 컬렉션 또는 컴포넌트)
  - 예) `["textbutton", "tokens.color.v1.0"]`

**반환**
```json
{
  "tokens":     { "tokens.color.v1.0": { /* ... */ } },
  "components": { "textbutton": { /* ... */ } },
  "missing":    []
}
```

**이름 해석 규칙**
1. `catalogs/tokens/{name}.json` → 토큰 컬렉션
2. `catalogs/atoms/{name}/` → 컴포넌트 (디렉터리 내 모든 .json)
3. 둘 다 없거나 manifest 허용 목록 외 항목이면 `missing` 에 추가

#### `ds_dsl_schema()`

DSL v2 출력 스킴 정의를 반환한다. Claude가 DSL 생성 시 이 스킴을 참조한다.

#### `ds_manifest_schema()`

`ds-manifest.json` 스킴 정의를 반환한다. 플랫폼 팀이 매니페스트 작성 시 참조한다.

#### `figma_fetch_design(url: string)`

Figma URL에서 node-id 루트의 **전체 서브트리**를 `nodes[]`로 반환한다 (FRAME, TEXT, INSTANCE, GROUP, IMAGE).  
layout·style·text는 DSL v2 컨벤션으로 정규화한다. 이미지 바이너리·벡터 기하는 제외한다.

**토큰 해석 체계 (figmaKey 기반):**

`boundVariables.*.id` (VariableID) → Figma Variables API `key` (figmaKey) → cds-catalog `figmaKey` 체인으로 DS 시멘틱 토큰을 1:1 매핑한다. hex 역방향 조회 방식 대비 모호성 없이 정확한 토큰 경로를 반환한다.

**반환 (v2 정규화 트리)**
```json
{
  "frame": { "id": "1:23", "name": "ProductDetail", "figmaType": "FRAME" },
  "nodes": [
    {
      "id": "1:23",
      "name": "ProductDetail",
      "type": "FRAME",
      "figmaType": "FRAME",
      "layout": { "kind": "stack", "axis": "vertical", "spacing": 16 },
      "children": [
        {
          "id": "5:67",
          "name": "Button/Primary/Medium",
          "type": "INSTANCE",
          "figmaType": "INSTANCE",
          "text": { "value": "구매하기" },
          "componentProperties": { "Type": "Filled" },
          "boundVariables": {
            "fills": [{ "figmaKey": "abc123", "tokenName": "system/color/button/default", "resolvedType": "COLOR" }]
          },
          "layout": {
            "kind": "stack", "axis": "horizontal",
            "spacing": 8,
            "padding": { "top": 12, "right": 16, "bottom": 12, "left": 16 },
            "alignment": { "main": "center", "cross": "center" },
            "size": { "width": { "mode": "hug" }, "height": { "mode": "fixed", "value": 40 } }
          },
          "style": {
            "fills": [{ "type": "solid", "color": "token:system.color.button.default" }],
            "cornerRadius": 8
          }
        }
      ]
    }
  ],
  "source": { "fileKey": "...", "nodeId": "1:23", "variablesResolved": true }
}
```

토큰 매칭은 `boundVariables.tokenName` (slashed) → `token:dotted.path` 자동 변환. 매칭 실패 SOLID 색상은 `hardcoded:#RRGGBB`로 표기.

#### `/ds-token-lint <file-or-dir>`

DSL JSON 파일의 토큰 참조를 cds-catalogs 기준으로 검사한다.

```
/ds-token-lint dsl_text_button.json    # 단일 파일
/ds-token-lint .                        # 디렉터리 내 dsl_*.json 전체
```

| 진단 수준 | 조건 |
|---------|------|
| ERROR | TokenRef prefix 없는 raw value(hex/px/폰트명) — `token:` 경로 제안 |
| ERROR | `token:<path>` 형식이지만 `.` 구분자 누락 |
| ERROR | `unresolved:<literal>` 값이 매칭 토큰 보유(교체 필요) 또는 미등록 |
| WARNING | `token:<path>` 가 cds-catalogs에 없는 경로 |
| WARNING | `hardcoded:<literal>` 값이 매칭 토큰 보유 (의도적 폴백이면 무시) |

## Samples

`samples/` — Figma DS 컴포넌트를 DSL + 3개 플랫폼(Web/iOS/Android)으로 구현한 레퍼런스 샘플 모음.

---

## 설치

### Claude Code 에서

1. `~/.claude/settings.json` 에 marketplace 등록 (한 번만):
   ```json
   {
     "extraKnownMarketplaces": {
       "weverse-marketplace": {
         "source": { "source": "github", "repo": "weversecompany/claude-plugins" }
       }
     }
   }
   ```

2. 플러그인 설치:
   ```
   /plugin install cds-ds@weverse-marketplace
   ```

3. 인증 설정 (아래 "인증" 섹션)

4. Claude Code 재시작 → `/mcp` 에서 `cds-ds` 확인

**의존성은 자동 설치됨**:
- 첫 실행 시 `run.sh` 가 `uv` 를 자동 설치
- `uv` 가 Python · `mcp` · `httpx` 를 격리 venv 에 자동 설치
- 첫 실행만 느림 (~30–60초), 이후 즉시

**전제 조건**: bash + 네트워크 (사내 기본 환경이면 충족)

## 인증

### GitHub (ds_list, ds_get, figma_fetch_design 공통)

`cds-catalogs` 레포가 private 이므로 GitHub 인증 필요.

**자동 설치 + 브라우저 인증** (수동 토큰 생성 불필요):

1. 플러그인 설치만 하면 `run.sh` 가 자동으로:
   - `uv` 설치 (없으면)
   - `gh` CLI 설치 (없으면, `~/.local/bin` 에 공식 바이너리 배포, sudo 불필요)
2. **최초 1회** 터미널에서 브라우저 로그인:
   ```bash
   gh auth login
   ```
   터미널 안내 따라 브라우저에서 device code 입력 → 완료.  
   토큰은 OS 키체인에 저장되고 MCP 서버가 자동 조회.

대안: `GITHUB_TOKEN` 또는 `GH_TOKEN` 환경변수에 PAT 저장 (gh CLI 없이도 동작).

### Figma (figma_fetch_design, /figma-to-dsl)

Figma Personal Access Token 이 필요하다. **fallback 없음** — 환경변수 필수.

1. Figma 앱 → 좌상단 프로필 → **Settings** → **Security** 탭
2. **Personal access tokens** → **Generate new token**
3. 발급된 토큰을 환경변수로 설정:
   ```bash
   # ~/.zshrc 또는 ~/.bashrc 에 추가
   export FIGMA_TOKEN=figd_xxxxxxxx
   ```
4. Claude Code 재시작

## 동작 확인

Claude Code `/mcp` 에서 `cds-ds` 가 `connected` 로 표시되면 정상.

```
# 카탈로그 조회 테스트
> "textbutton 컴포넌트 카탈로그 확인해줘"

# Figma → DSL 변환 테스트
/figma-to-dsl https://figma.com/design/{fileKey}/Screen?node-id=1-23
```

## 제약

- **캐싱 없음** — 매 호출마다 GitHub API 조회. 개인 rate limit 5,000 req/hour 범위 내 사용.
- **매핑은 Claude 주도** — Figma 컴포넌트 이름과 DS atom 이름의 매핑을 Claude가 판단. 이름이 크게 다르면 v2에서는 `catalog`를 생략하고 `type`을 `frame`/`group` 등으로 기술한다 (v1의 `missing_ds_mapping` 필드 없음).
- **단일 노드** — `figma_fetch_design` 은 URL의 node-id 하나만 처리. 여러 화면은 개별 호출.

## 로드맵

- [x] `figma_fetch_design` — Figma URL → 시멘틱 컴포넌트 추출 *(v0.2.0)*
- [x] `ds_dsl_schema` — DSL v2 스킴 정의 (`dsl_v2.json`) *(v0.2.0 이후 v2로 갱신)*
- [x] figmaKey 기반 토큰 매핑 — hex 역방향 조회 대체 *(v0.3.0)*
- [x] `/ds-token-lint` — DSL 파일 토큰 참조 lint *(v0.3.0)*
- [x] `samples/` — Figma → DSL → 3플랫폼 구현 레퍼런스 샘플 (Atom · Molecule) *(v0.4.0)*
- [x] DS 모듈 매니페스트 시스템 — `ds-manifest.json` 스킴 + `ds_manifest_schema()` + `ds_list/ds_get` manifest 필터 *(v0.6.0)*
- [x] `/ds-manifest` — DS module 탐색 → `ds-manifest.json` 자동 생성·업데이트 *(v0.7.0)*
- [x] `dsl-to-code` skill — DSL → SwiftUI/Compose/Web 코드 변환 + 4종 하네스 평가 (최대 3 사이클) *(v0.8.0)*
- [ ] TTL 캐시 (rate limit 완화)
- [ ] `ds_search` — 이름·설명 기반 카탈로그 검색
- [ ] `samples/` 추가 컴포넌트 (IconButton, Chip, Modal 등)

## 트러블슈팅

### `uv` 설치 실패
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
# 또는
brew install uv
```

### `/mcp` 에 cds-ds 가 안 보임
- `~/.claude/settings.json` 의 marketplace 등록 확인
- `/plugin list` 에 `cds-ds` 있는지 확인
- Claude Code 재시작

### 401 Unauthorized (GitHub)
- `GITHUB_TOKEN` 유효성 확인
- 토큰이 `weversecorp/cds-catalogs` 접근 권한 있는지 확인
- `gh auth status` 로 gh CLI 토큰 확인

### figma_fetch_design 오류

| 오류 | 원인 | 해결 |
|------|------|------|
| `FIGMA_TOKEN 미설정` | 환경변수 없음 | `export FIGMA_TOKEN=figd_xxx` 후 재시작 |
| `node-id 파라미터가 없습니다` | URL에 node-id 누락 | Figma에서 프레임 선택 후 'Copy link' 사용 |
| `403 Forbidden` | 토큰 권한 부족 | Figma 토큰 재발급 (파일 접근 권한 확인) |
| `404 Not Found` | 잘못된 node-id | URL에서 node-id 값 재확인 |
