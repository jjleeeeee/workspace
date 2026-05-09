---
name: dsl-harness
description: "Figma URL → DSL 생성 → QA 평가 → 플랫폼 코드 생성까지 전체 오케스트레이션 (최대 3회 DSL 반복/수정). 예: /dsl-harness https://figma.com/design/..."
---

Figma URL `$ARGUMENTS` 를 받아 **DSL 생성 → QA 평가 → 플랫폼 코드 생성**까지 전체 파이프라인을 실행한다.

## 실행 흐름

### 준비

0. **매니페스트 로드 (필수)**

   **Step 0-a: 플랫폼 사전 감지** (탐색 경로 결정용)

   현재 작업 디렉터리에서 아래 파일 존재 여부로 플랫폼을 사전 판별한다.

   | 플랫폼 | 판별 파일 |
   |--------|----------|
   | `ios` | `Package.swift`, `*.podspec`, `Podfile` 중 하나 이상 |
   | `android` | `build.gradle` 또는 `build.gradle.kts` |
   | `web` | `package.json` |

   복수 감지 시 우선순위: `ios` > `android` > `web`. 감지 불가면 세 경로를 모두 탐색.

   **Step 0-b: ds-manifest.json 탐색**

   아래 순서로 탐색한다. 처음 찾은 파일을 사용하며, 복수 매칭 시 첫 번째 항목을 사용한다.

   1. `./ds-manifest.json` — 현재 작업 디렉터리
   2. 플랫폼별 외부 의존성 위치:
      - **ios**: `.build/checkouts/*/ds-manifest.json` → `Packages/*/ds-manifest.json`
      - **android**: `**/ds-manifest.json` (`build/`, `.gradle/`, `.idea/` 디렉터리 제외)
      - **web**: `node_modules/@weverse/*/ds-manifest.json` → `node_modules/*/ds-manifest.json`
      - **감지 불가**: 위 세 플랫폼 경로를 모두 순서대로 탐색

   탐색은 `Bash` 도구(`find` 또는 glob)를 사용해 실제로 실행한다.

   **찾은 경우**: JSON 파싱 후 `manifest` 변수에 저장 (platform, componentOutputDir 포함). 발견 경로를 출력한다.

   **찾지 못한 경우**: 아래 오류 메시지를 출력하고 **이후 모든 단계(figma_fetch_design, Phase 1, Phase 2)를 실행하지 않고 즉시 종료**한다.

   ```
   ❌ ds-manifest.json을 찾을 수 없습니다.

   탐색한 경로:
   - ./ds-manifest.json
   - (플랫폼별 외부 의존성 경로를 실제 탐색한 경로로 나열)

   DS 모듈에 ds-manifest.json이 포함되어 있는지 확인하거나,
   DS 모듈 루트에서 /ds-manifest 명령을 실행해 생성하세요.
   ```

1. **`figma_fetch_design("$ARGUMENTS")`** 호출 — Figma 원본 데이터 수집
2. **`ds_list(manifest=<manifest>)`** 호출 — 사용 가능한 DS 컴포넌트·토큰 목록 확인
3. **`ds_dsl_schema()`** 호출 — DSL 스킴 로드

### Phase 1: DSL 생성 루프 (최대 3회)

각 시도(attempt 1~3)마다 아래를 순서대로 실행한다:

#### Step A: DSL 생성

`figma_fetch_design` 결과와 `ds_list`, `ds_get(ids, manifest=<manifest>)`, `ds_dsl_schema` 를 사용해 DSL을 생성한다.  
이전 시도가 있다면 QA 에이전트의 `fix_hints`를 반영해 수정한다.

생성한 DSL을 임시 파일로 저장:
```
!echo '<DSL JSON>' > /tmp/dsl_attempt_N.json
```

figma_fetch_design 결과도 임시 저장 (첫 시도에만):
```
!echo '<figma_raw JSON>' > /tmp/figma_raw.json
```

#### Step B: 구조적 하네스 평가

```
!uv run --script ${CLAUDE_PLUGIN_ROOT}/servers/dsl_harness.py /tmp/figma_raw.json /tmp/dsl_attempt_N.json
```

출력된 JSON에서 `score`, `pass`, `issues`, `platform_notes` 를 읽는다.

#### Step C: QA 에이전트 평가

구조적 점수가 60점 이상이면 QA 에이전트를 호출해 플랫폼별 드로잉 가능성을 심층 평가한다.  
`dsl-qa` 에이전트에게 다음을 전달:
- `figma_raw`: figma_fetch_design 응답
- `dsl_output`: 현재 생성한 DSL

QA 에이전트 출력에서 `score`, `fix_hints`, `platform_notes`를 읽는다.

#### Step D: 결과 판정

- **최종 점수**: 구조적 점수와 QA 에이전트 점수의 평균
- **PASS** (≥ 80): Phase 1 루프 종료 → Phase 2로 진행
- **FAIL** (< 80) + 시도 횟수 < 3: `fix_hints`를 반영해 Step A로 돌아감
- **FAIL** + 시도 횟수 = 3: Phase 1 루프 종료 → **경고 포함하여** Phase 2로 진행 (best-effort)

---

### Phase 2: 최종 DSL 저장 및 코드 생성

#### Step E: 최종 DSL 안정적 저장

Phase 1에서 확정된 DSL을 현재 작업 디렉터리에 저장한다.

컴포넌트 이름 결정 (kebab-case):
- DSL root의 `nodes[]` 중 첫 번째 노드의 `catalog.id` → kebab-case 그대로 사용 (예: `text-button`)
- `catalog.id`가 없으면 DSL root의 `name` 또는 Figma 노드명을 kebab-case로 변환
- 최종 폴백: `component`

저장 경로 (기존 samples 컨벤션과 동일):
```
<현재작업디렉터리>/<kebab-name>.dsl.json
```

예:
```
!echo '<최종 DSL JSON>' > ./text-button.dsl.json
```

> 코드 파일명은 PascalCase + WDS prefix (`WDSTextButton.swift` 등)로 별도 처리 — `dsl_to_code` 스킬이 담당.

#### Step F: 플랫폼 결정

우선순위:
1. DSL root의 `platform` 필드
2. DSL root의 `dsManifest.platform`
3. `manifest.platform` (0단계에서 로드한 ds-manifest.json)
4. 현재 디렉터리에 `Package.swift` 존재 → `ios`, `build.gradle` → `android`, `package.json` → `web`
5. 결정 불가 → 사용자에게 플랫폼 선택 요청

#### Step G: dsl_to_code 스킬 인라인 실행

`Read` 도구로 아래 파일들을 순서대로 로드한다:

1. `${CLAUDE_PLUGIN_ROOT}/skills/dsl_to_code/SKILL.md` — 공통 변환 규칙 및 워크플로우
2. 플랫폼에 따라:
   - `ios` → `${CLAUDE_PLUGIN_ROOT}/skills/dsl_to_code/SWIFTUI.md`
   - `android` → `${CLAUDE_PLUGIN_ROOT}/skills/dsl_to_code/COMPOSE.md`
   - `web` → `${CLAUDE_PLUGIN_ROOT}/skills/dsl_to_code/WEB.md`

로드 완료 후 **SKILL.md에 정의된 전체 워크플로우(Step 0~5)**를 다음 입력으로 실행한다:
- DSL 파일 경로: Step E에서 저장한 `<component-name>.dsl.json`
- 출력 디렉터리: DSL 파일과 같은 디렉터리 (현재 작업 디렉터리)
- 플랫폼: Step F에서 결정한 플랫폼
- manifest: 0단계에서 로드한 manifest (또는 null)

> Phase 1이 FAIL로 종료된 경우: 코드 생성 전에 "⚠️ DSL QA 점수 미달 (XX/100) — best-effort로 코드 생성을 진행합니다. 미해결 이슈: ..." 경고를 출력한다.

---

## 최종 출력

```
## DSL Harness 결과

### Phase 1: DSL 생성
- 시도 횟수: N/3
- DSL 점수: XX/100 (PASS/FAIL)
- 저장 위치: ./<ComponentName>.dsl.json

### Phase 2: 코드 생성 (<플랫폼>)
- 시도: N/3
- 결과: PASS ✅ | FAIL ❌

| 평가 항목 | 결과 | 비고 |
|----------|------|------|
| Lint | ✅/❌/SKIP | ... |
| Build | ✅/❌/N/A | ... |
| Static Check | ✅/❌ | 토큰 N/N, 레이아웃 N/N |
| Screenshot | ✅/❌/SKIP | ... |

### 생성 파일
- `./<ComponentName>.<ext>`

### 플랫폼 평가 (DSL QA)
- iOS: ...
- Android: ...
- Web: ...

### 미해결 이슈 (FAIL 시)
- ...
```
