# 플랜: 05_chord-figma-mcp 전체 구현 로드맵

## Context

- 05_chord-figma-mcp는 03/04 워크플로우에서 공통으로 쓰는 Figma 데이터 도구를 통합한 MCP 서버
- 현재 상태: 폴더 구조와 6 Phase 로드맵은 잡혀있지만 **실제 코드는 거의 없음**
  - `figma-client.ts` (REST GET 헬퍼 4개): ✅ 구현됨
  - `src/index.ts`: 빈 MCP 서버 (TODO 주석만)
  - `src/tools/*.ts` (8개): 모두 `// TODO` 한 줄짜리 스텁
  - `node_modules`: 없음 (npm install 안 됨)
  - Phase 0 spike: 미실행
- 기존 `harness/workflow.md` 의 6 Phase 순서는 너무 직선적 — "8개 다 만들고 마지막에 등록"인데, **중간에 04_wf에서 실제 검증하는 단계가 없음**
- 재설계 목표: 빨리 "한 컴포넌트로 통하는지" 검증하고 그 결과로 나머지 다듬기

## 핵심 설계 결정

| 결정 | 이유 |
|------|------|
| **읽기 2개 만들면 즉시 04에서 통합 테스트** (Phase 3.5 신설) | 8개 다 만들고 나서 안 통하면 재작업 비용 큼. 작은 루프 먼저. |
| **Zod 스키마로 input/output 검증** | MCP는 LLM이 호출 — 잘못된 input이 들어와도 명확히 거절해야 함. unknown 타입은 디버깅 지옥. |
| **Phase 0 spike 확장**: PATCH뿐 아니라 GET /me, GET /file, GET /nodes 4개 다 검증 | 인증·읽기·쓰기 가능성을 한 번에 파악. 토큰 권한 문제 일찍 발견. |
| **각 도구마다 `_workspace/spike/<tool>.md`** 결과 기록 강제 | 도구가 실제 nodeId로 작동하는 증거. 회귀 검증용. |
| **쓰기 도구는 마지막**, Phase 0 결과가 "불가" 면 아예 빼고 figma-official MCP에 위임 명시 | 위험 격리. |

## 보안 게이트 (Codex 리뷰 반영, 차단 조건)

3가지는 코드 작성 전 차단 조건으로 다룬다 — 통과 못하면 다음 Phase 진행 금지.

| Gate | 적용 Phase | 차단 조건 |
|------|-----------|----------|
| **G1 파일 읽기 샌드박스** | Phase 5.2 (`check_source_note`) 구현 시 | LLM이 임의 로컬 경로(`/etc/`, `~/.ssh/`, `.env` 등)를 읽지 못하게 입력을 워크스페이스 상대 경로 또는 source-note ID로 제한. realpath 해석 + 절대경로/`..`/심볼릭링크 escape 거절. allow-list 디렉터리 외 거부. |
| **G2 Variables 쓰기 격리** | Phase 6 (`write_variable`) 구현 시 | (a) `FIGMA_WRITE_ENABLED=1` 환경변수가 없으면 `dryRun:false` 무시(경고 후 dryRun 강제). (b) `FIGMA_WRITE_ALLOWED_FILES=key1,key2` 화이트리스트 외 fileKey 거절. (c) Zod 기본값 dryRun=true. mock fetch 단위 테스트 통과 후 등록. (d) Variables는 reversible(이전 값 다시 쓰면 복원) — README에 명시. ETag/스냅샷/롤백은 솔로 환경 대비 오버엔지니어링이라 도입하지 않음. |
| **G3 PAT 비밀 관리** | Phase 3.5 + 기존 문서 정리 | `claude.json`에 `figd_...` 평문 입력 금지. 래퍼 스크립트가 OS Keychain 또는 gitignore된 `.env`에서 토큰 주입. **추가**: `05_chord-figma-mcp/CLAUDE.md` 등 기존 추적 문서의 `export FIGMA_ACCESS_TOKEN=figd_...` 예시도 같이 정리. 검증 게이트: `rg 'export FIGMA_ACCESS_TOKEN=.*figd_' 05_chord-figma-mcp/` 가 hit 0이어야 통과. README에 최소 권한 scope + 로테이션 절차 명시. |
| **G4 Spike 리포트 redaction** | Phase 3.5/4/6 spike 리포트 커밋 시 | `_workspace/spike/reports/` 커밋 전 redaction 강제. 별칭 매핑: fileKey → `<FILE_A>`, componentKey → `<COMP_A>`, nodeId → `<NODE_A>`, 토큰 값/이미지 URL/dev-resource URL 모두 마스킹(`<REDACTED_URL>`). 검증 게이트: `rg '(figd_|^[A-Za-z0-9]{22,}$\|figma\.com/(design\|file)/[A-Za-z0-9]+)' _workspace/spike/reports/` hit 0. raw 응답은 `_workspace/spike/raw/`(gitignore)에만 보관. |

## Phase 0 스파이크 결과 요약 (2026-05-10 확인)

| 엔드포인트 | 결과 | 결론 |
|-----------|------|------|
| `PATCH /v1/files/.../nodes/{id}` | 404 | description 쓰기 불가 |
| `PUT /v1/components/{key}` | 404 | description 쓰기 불가 |
| `POST /v1/files/.../variables` | ✅ 200 | 변수 생성/수정/삭제 가능 |
| `POST /v1/files/.../comments` | ✅ 200 | 댓글 쓰기/삭제 가능 |
| `POST /v1/dev_resources` | ✅ 200 | Storybook 링크 등록 가능 |

**write_description: REST 불가 → figma-official MCP `use_figma` 위임으로 확정**
**write_variable 신규 추가: Variables API (`POST /v1/files/.../variables`) 활용**

## 도구 구현 순서 (재배열, v2)

| 순서 | 도구 | 의존성 | 검증 산출물 |
|------|------|--------|-------------|
| 1 | `read_component` | figma-client `getNodes`, `getComponentMeta` | spike 결과 |
| 2 | `read_design_context` | figma-client `getNodes` | spike 결과 |
| **2.5** | **04에서 실제 컴포넌트 1개로 통합 테스트** | claude.json 등록 | 작동 보고서 |
| 3 | `get_component_image` | figma-client `getImageUrl` | spike 결과 |
| 4 | `get_tokens` | figma-client `getLocalVariables` | spike 결과 |
| 5 | `discover_nested_slots` | `read_component` 출력 | spike 결과 |
| 6 | `generate_source_note` | 1, 2, 3, 4, 5 결과 종합 | _workspace/outputs/ |
| 7 | `check_source_note` | 6의 출력 포맷 | spike 결과 |
| 8 | `write_variable` | figma-client Variables API | spike 결과 |
| — | ~~write_description~~ | **제거** — figma-official `use_figma` 위임 | README에 명시 |

---

## Phase 0 — 인증 + 읽기/쓰기 가능성 스파이크

**담당:** spike-tester 에이전트

### 사전 (G3 적용)
- PAT는 셸 환경변수로만 주입(평문 파일 저장 금지). 예: `~/.zshrc.local` 또는 1Password CLI(`op read`) 등 사용.
- `_workspace/spike/`는 `.gitignore`에 등록 — 응답 raw가 토큰/파일키 노출 가능.
```bash
export FIGMA_ACCESS_TOKEN=$(op read "op://Personal/figma-pat/credential")  # 예시
echo $FIGMA_ACCESS_TOKEN | head -c 5  # figd_ 확인
```

### 사전 준비 (G2 적용) — 쓰기 테스트 전용 일회용 파일
1. Chord DS와 **별도의 빈 Figma 파일** 생성 (예: "MCP Write Spike Sandbox").
2. 그 파일에 dummy 컴포넌트 1개를 만들고 `componentKey`/`nodeId` 기록.
3. `_workspace/spike/sandbox-target.md` 에 fileKey/nodeId/원래 description 백업.
4. **Chord DS의 fileKey는 쓰기 테스트 코드/명령에 절대 포함하지 않는다.** (grep으로 사전 검증)

### 테스트 4개 (모두 `_workspace/spike/rest-feasibility.md` 에 기록)
1. **인증 확인**: `GET /v1/me` → 200 + 사용자 이름 확인
2. **파일 읽기**: `GET /v1/files/{ChordDS_fileKey}` → 200 (읽기는 Chord DS 가능)
3. **노드 읽기**: `GET /v1/files/{ChordDS_fileKey}/nodes?ids={nodeId}` → 200, description 필드 존재 확인
4. **쓰기 시도** (sandbox 파일에만):
   - 절차: 원래 description 백업 → `PUT /v1/files/{Sandbox_fileKey}/components/{key}/description` body=`"mcp-spike-sentinel-<timestamp>"` → readback으로 sentinel 확인 → 원래 값 PUT으로 복원 → 다시 readback으로 복원 검증
   - 어떤 단계라도 실패하면 즉시 중단, 사용자에게 보고
   - 가설 2(`PATCH /v1/files/{Sandbox_fileKey}/nodes/{nodeId}`)도 동일 절차
   - 결과: 200 / 4xx / 405 중 무엇인지

### 결정 분기
- 4번이 200 + 복원 검증 통과 → Phase 8 (write_description) 자체 구현 가능. **단, 도구 입력에 fileKey allow-list(Chord DS 차단) 또는 사용자 승인 필수 적용**
- 4번이 4xx → Phase 8은 figma-official MCP `use_figma`에 위임하는 wrapper로 변경
- 4번이 405 → Phase 8 빼고, README에 "쓰기는 figma-official 사용" 명시
- 4번이 200이지만 복원 실패 → Phase 8 보류. 자체 구현 금지.

---

## Phase 1 — 프로젝트 세팅 완료

```bash
cd /Users/jj.iee/Desktop/workspace/05_chord-figma-mcp
npm install                  # @modelcontextprotocol/sdk + dev deps
npm install zod              # 입력 스키마 검증용 추가
npm run build                # tsc 통과 확인
npm run inspect              # MCP Inspector 연결 확인 (빈 도구 목록이라도 OK)
```

**산출물:** `node_modules/`, `dist/index.js` 생성 확인.

---

## Phase 2 — figma-client.ts 강화

현재 `figma-client.ts`는 GET 헬퍼 4개만 있고 다음이 부족:

### 추가 사항
1. **에러 클래스 분리**
   ```ts
   export class FigmaAuthError extends Error {}      // 401, 403
   export class FigmaNotFoundError extends Error {}  // 404
   export class FigmaRateLimitError extends Error {} // 429
   ```
2. **Rate limit 재시도** (간단한 exponential backoff, 최대 3회)
3. **응답 타입** — Figma API 핵심 필드만 인터페이스로 정의 (전체는 `unknown`이어도 됨)
   ```ts
   export interface FigmaNode { id: string; name: string; type: string; description?: string; ... }
   ```

4. **Variables 쓰기 헬퍼 추가**
   ```ts
   export async function postVariables(fileKey: string, payload: VariablesPayload): Promise<VariablesResponse>
   ```
   - `VariablesPayload`: `variableCollections?`, `variableModes?`, `variables?`, `variableModeValues?` 배열
   - `VariablesResponse`: `{ status, error, meta: { tempIdToRealId } }`

**산출물:** 기존 함수 시그니처는 유지하되 반환 타입 강화. error class + retry + postVariables 추가. 각 오류 경로는 mock fetch 단위 테스트 필수 (spike 대체 불가).

---

## Phase 3 — 읽기 도구 2개 (read_component, read_design_context)

### 공통 도구 모듈 템플릿
```ts
// src/tools/_template.ts
import { z } from "zod";
export const inputSchema = z.object({ ... });
export const definition = { name, description, inputSchema };
export async function handler(input: z.infer<typeof inputSchema>) { ... }
```

### 3.1 read_component
- 입력: `fileKey: string, componentKey: string`
- 동작: `getComponentMeta` + `getNodes` 호출 → 통합된 컴포넌트 정보 반환
- 출력: `{ key, name, description, nodeId, properties[], variants[] }`

### 3.2 read_design_context
- 입력: `fileKey: string, nodeId: string, depth?: number`
- 동작: `getNodes` 호출 후 트리 평탄화 → 디자인 구조 마크다운으로 변환
- 출력: `{ markdown: string, raw: object }`

### 3.3 src/index.ts 등록
- 두 도구를 tools 배열에 등록
- `npm run build && npm run inspect` 로 Inspector에서 호출 테스트

---

## Phase 3.5 — 04_wf 통합 검증 (Critical Gate)

**5개 도구 다 만들기 전에 여기서 멈추고 실제 사용성 확인.**

### 작업
1. **G3 적용 — 토큰 평문 등록 금지.** 래퍼 스크립트 + claude.json 분리:
   ```bash
   # 05_chord-figma-mcp/bin/start.sh (gitignore 등록, chmod +x)
   #!/bin/bash
   export FIGMA_ACCESS_TOKEN=$(op read "op://Personal/figma-pat/credential")
   # 또는: source "$HOME/.config/chord-figma/.env"  (.env는 600 권한, gitignore)
   exec node /Users/jj.iee/Desktop/workspace/05_chord-figma-mcp/dist/index.js
   ```
   ```json
   // ~/.claude/claude.json — env에 토큰 평문 X, command만 가리킨다
   { "mcpServers": { "chord-figma": { "command": "/Users/jj.iee/Desktop/workspace/05_chord-figma-mcp/bin/start.sh" } } }
   ```
   - README에 최소 권한 scope(file_read, optionally file_write) 및 로테이션 절차 명시
2. Claude Code 재시작
3. 04_wf에서 작은 컴포넌트 1개(예: Avatar) 골라서 `read_component` + `read_design_context` 만 써서 source note 작성 시도
4. 결과를 `_workspace/spike/integration-04wf.md` 에 기록:
   - 잘 작동한 부분
   - 부족한 부분 (필드 누락, 출력 포맷 문제 등)
   - 다음 도구에 반영할 개선점

### Gate 통과 조건
- read_component, read_design_context로 받은 정보만으로 source note의 axes/props/description 채우기 가능

**미통과 시:** Phase 3로 돌아가 도구 출력 포맷 수정.

---

## Phase 4 — 나머지 읽기 도구 3개

Phase 3.5 피드백 반영하여:
- `get_component_image` (이미지 URL 가져오기)
- `get_tokens` (로컬 토큰/변수)
- `discover_nested_slots` (read_component 결과에서 nested 컴포넌트 자동 탐지)

각 도구마다 `_workspace/spike/<tool>.md` 에 실제 nodeId 테스트 결과 기록.

---

## Phase 5 — 워크플로우 도구 2개

### 5.1 generate_source_note
- 입력: `fileKey, nodeId`
- 내부: read_component + read_design_context + get_tokens + get_component_image + discover_nested_slots **모두 호출**
- 출력: source note contract 에 맞는 마크다운 (04_wf의 `workflow/source-note-contract.md` 참조)

### 5.2 check_source_note (G1 적용 — 파일 읽기 샌드박스)
- 입력: `workspace: "03_wf" | "04_wf"`, `relativePath: string` (예: `src/figma/avatar.source.md`)
  - 절대 경로/`path: string` 으로 받지 않는다. LLM이 `/etc/passwd`나 `~/.ssh/id_rsa`를 요청해도 스키마에서 거절.
- 동작:
  1. `workspace` enum → 사전 정의된 ALLOWED_ROOTS 매핑 (예: `04_wf` → `/Users/jj.iee/Desktop/workspace/04_wf-figma-to-react-components/src/figma`)
  2. `path.resolve(root, relativePath)` 후 `fs.realpath` 적용 → 결과가 ALLOWED_ROOT 하위인지 검증 (심볼릭링크 escape 차단)
  3. 확장자 `.md` 만 허용. 파일 크기 상한(예: 256KB) 강제.
  4. 통과 시에만 read → 필수 섹션/Known Gaps 검증
- 출력: `{ valid: boolean, missing: string[], warnings: string[] }`
- Zod 스키마 예시:
  ```ts
  const inputSchema = z.object({
    workspace: z.enum(["03_wf", "04_wf"]),
    relativePath: z.string()
      .max(256)
      .refine(p => !p.startsWith("/") && !p.includes(".."), "absolute or traversal path forbidden")
      .refine(p => p.endsWith(".md"), "only .md allowed"),
  });
  ```
- 게이트: 위 검증 코드 단위 테스트가 모두 통과해야 도구를 `index.ts` 에 등록한다 (악성 입력 거절 케이스 포함).

---

## Phase 6 — write_variable (Variables API 쓰기 도구)

Phase 0 스파이크에서 확인: `POST /v1/files/{key}/variables` 200 ✅

### description 쓰기 위임 (README 명시)
- REST API로 노드/컴포넌트 description 수정 불가 (404 확인).
- description 쓰기는 **figma-official MCP `use_figma`** 를 직접 사용할 것.
- 이 MCP는 description 수정 기능을 제공하지 않으며 제공할 계획도 없음.

### write_variable 스펙 (G2 보안 적용)
- **목적**: Chord DS 디자인 토큰 값을 REST로 직접 수정 (token migration, bulk update 등)
- 입력:
  ```ts
  const inputSchema = z.object({
    fileKey: z.string(),
    dryRun: z.boolean().default(true),
    variableModeValues: z.array(z.object({
      variableId: z.string(),
      modeId: z.string(),
      value: z.union([z.string(), z.number(), z.boolean(), z.object({
        r: z.number(), g: z.number(), b: z.number(), a: z.number()
      })]),
    })),
  });
  ```
- 동작 (G2 강제 순서):
  1. **env gate**: `process.env.FIGMA_WRITE_ENABLED === '1'` 검사. 없으면 `dryRun:false` 입력이 와도 강제로 dryRun 모드로 변환 + 경고 메시지 포함
  2. **fileKey allowlist**: `process.env.FIGMA_WRITE_ALLOWED_FILES`(콤마 구분) 파싱. 입력 fileKey가 목록에 없으면 거절(에러). 환경변수 자체가 없으면 모든 쓰기 거절
  3. `dryRun: true` (또는 강제된 경우) → 실제 API 호출 없이 요청 payload + 환경 게이트 상태 반환
  4. `dryRun: false` (env gate 통과) → `POST /v1/files/{key}/variables` 호출 (자동 재시도 없음)
  5. 응답의 `tempIdToRealId` + 변경 카운트 검증
  6. `_workspace/spike/reports/write-variable-log.md` 에 redacted 로그 기록 (G4 적용)
- 출력: `{ dryRun: boolean, envGated: boolean, applied: number, payload: object, warning?: string }`
- 게이트: env gate + allowlist + dryRun 기본값 + mock fetch 단위 테스트(거절 케이스 포함) 통과 후 index.ts 등록
- 회복: Variables는 reversible. 실수 시 이전 값을 같은 도구로 다시 쓰면 복원됨. README에 명시.

---

## Phase 7 — 03_wf, 04_wf 양쪽 통합

1. 03_wf 워크플로우에서 `generate_source_note` + 기존 description YAML 작성 절차 통합
2. 04_wf에서 source note 작성 단계를 chord-figma-mcp 호출로 일원화
3. 기존 figma-console / framelink / figma-official 사용처 점검 — 어떤 작업이 여전히 그 MCP 필요한지 정리
4. 결과: `_workspace/outputs/integration-summary.md`

---

## 검증 방법

### Phase 단위
- 각 Phase 끝에 `_workspace/spike/<phase>.md` 에 결과 기록 — 다음 Phase 시작 전 사용자 검토
- Phase 3.5 Gate가 가장 중요 — 여기서 막히면 도구 설계 다시

### 최종
- 04_wf에서 source note 1개를 chord-figma-mcp 만으로 작성해서 기존 workflow 통과
- `npm run inspect` 로 8개(또는 7개) 도구 모두 호출 가능 확인

---

## 위험 / 주의사항

| 위험 | 완화 |
|------|------|
| **LLM 통한 임의 파일 읽기 (G1)** | `check_source_note` 입력 스키마 + realpath 샌드박스 + 단위 테스트 |
| **write_variable로 Chord DS 토큰 손상 (G2)** | env gate(`FIGMA_WRITE_ENABLED=1`) + fileKey allowlist(`FIGMA_WRITE_ALLOWED_FILES`) + dryRun 기본값 + mock 단위 테스트 |
| **PAT 평문 노출 (G3)** | 래퍼 스크립트 + Keychain/.env(gitignore) + 기존 docs(CLAUDE.md 등) `figd_` 예시 정리 + grep 검증 |
| **Spike 리포트 메타데이터 유출 (G4)** | redaction 스키마 + 별칭 매핑 + 커밋 전 grep 검증 |
| Figma API rate limit (60 req/min) | figma-client.ts에 재시도 + Phase 5의 generate_source_note는 캐시 고려 |
| Personal Access Token 권한 부족 (특히 쓰기) | Phase 0에서 일찍 발견 |
| 04_wf 통합 시 출력 포맷 불일치 | Phase 3.5 Gate에서 발견 |
| MCP SDK 버전 호환성 | `npm run inspect` 로 Phase 1에서 확인 |
| Claude Code 재시작 필요한 변경 | 각 Phase 끝에 명시 |

---

## 실행 순서 요약

```
Phase 0 ✅ → Phase 1 (npm install) → Phase 2 (client 강화)
  → Phase 3 (read 2개) → Phase 3.5 (Gate ★) 
  → Phase 4 (read 3개) → Phase 5 (workflow 2개)
  → Phase 6 (write_variable) → Phase 7 (통합)
```

**Phase 3.5는 필수 게이트**. 통과 못하면 도구 설계 되돌아가야 함.

---

## 실행 워크플로우 (Chunk-based, Opus + Codex 협업)

### 역할 분담

| 역할 | 담당 | 도구 |
|------|------|------|
| **기획 / 의사결정 / 검토** | Opus (this) | 직접 |
| **설계 제안** | Codex | `Agent(codex:codex-rescue)` |
| **구현** | Codex | `Agent(codex:codex-rescue)` |
| **자체 검증** | Opus | Read, Bash (테스트 실행) |
| **코드 리뷰** | Codex | `/codex:review` (chunk마다) |
| **적대적 리뷰** | Codex | `/codex:adversarial-review` (Phase 경계에서만) |

### Chunk당 7-스텝 루프

```
[1] 기획 (Opus)
    - chunk 범위 정의: 어떤 파일, 어떤 함수, 수용 기준
    - 적용 게이트(G1~G4) 명시
    - 자체검증 명령 정의 (예: npm test 특정 파일)
        ↓
[2] 설계 제안 (Codex via codex-rescue)
    - 인터페이스/시그니처/타입 제안
    - 구현 안 함, 코드 스니펫만
        ↓
[3] 설계 검토 (Opus)
    - 수용 기준 부합 여부
    - 게이트 위반 여부
    - 승인 또는 수정 요청 → 통과 시 [4]
        ↓
[4] 구현 (Codex via codex-rescue)
    - [3]에서 승인된 설계대로 구현
    - 단위 테스트 동시 작성 (TDD)
        ↓
[5] 자체 검증 (Opus)
    - diff 읽기, 수용 기준 대조
    - npm test / typecheck 실행
    - 통과 시 [6], 실패 시 [4]로 복귀
        ↓
[6] /codex:review (Codex)
    - chunk 단위 표준 리뷰
    - 결과 → Opus가 분류: Critical / Major / Minor / Skip
        ↓
[7] 수정 + 다음 chunk
    - Critical/Major: 즉시 [4]로 복귀
    - Minor: 노트만 남기고 진행
    - Skip: 다음 chunk로
```

### 적대적 리뷰 시점

`/codex:adversarial-review`는 **Phase 경계에서만** 실행 (chunk마다 X):
- Phase 2 끝 (figma-client.ts 강화 완료 시점)
- Phase 3 끝 (read 2개 완료 시점, **Phase 3.5 진입 직전**)
- Phase 5 끝 (workflow 도구 완료 시점)
- Phase 6 끝 (write_variable 완료 시점)

### Chunk 분해 (Phase 1 ~ Phase 3)

| Chunk | Phase | 범위 | 수용 기준 | Codex 사용 |
|-------|-------|------|----------|-----------|
| ~~**C1.1**~~ ✅ | 1 | npm install + zod 추가 + build | `node_modules/`, `dist/index.js` 생성, `npm run build` 0 에러 | ❌ (단순 명령) |
| ~~**C2.1**~~ ✅ | 2 | error 클래스 3개 (`FigmaAuthError`, `FigmaNotFoundError`, `FigmaRateLimitError`) | export 됨, 단위 테스트 (instanceof, status code) | ✅ 설계+구현 |
| **C2.2** | 2 | rate limit 재시도 (exponential backoff, max 3회) | 429 mock에서 3회 시도 후 throw, 200 mock에서 1회 성공 | ✅ 설계+구현 |
| **C2.3** | 2 | `FigmaNode`, `FigmaComponent` 타입 인터페이스 | 4개 GET 헬퍼 반환 타입 강화, tsc 통과 | ✅ 설계+구현 |
| **C2.4** | 2 | `postVariables` 헬퍼 + `VariablesPayload`/`VariablesResponse` 타입 | mock fetch 단위 테스트 (성공/auth fail/network fail 거절) | ✅ 설계+구현 |
| **— 적대적 리뷰 1회 —** | 2 끝 | figma-client.ts 전체 | Codex가 OK 또는 차단 이슈 0 | `/codex:adversarial-review` |
| **C3.1** | 3 | `read_component` 도구 (Zod input + handler + 등록) | inspector에서 호출 → 실제 fileKey/componentKey로 결과 반환 | ✅ 설계+구현 |
| **C3.2** | 3 | `read_design_context` 도구 (depth 기본값 2, 최대 5, 64KB 상한) | inspector에서 호출 → markdown 반환, 큰 노드에서 truncation 경고 | ✅ 설계+구현 |
| **— 적대적 리뷰 1회 —** | 3 끝 | 도구 2개 + index.ts | 차단 이슈 0 | `/codex:adversarial-review` |
| **C3.5.1** | 3.5 | 래퍼 스크립트 (`bin/start.sh`) + claude.json 정리 (G3) | grep 검증 hit 0, claude.json 평문 토큰 X | ❌ (수동) |
| **C3.5.2** | 3.5 | 04_wf에서 1개 컴포넌트 통합 테스트 | source note axes/props/description 채워짐 | ❌ (수동, Opus 주도) |

**Phase 4 이후는 Phase 3.5 결과 보고 chunk 재정의** (read 도구 출력 포맷 수정 가능성).

### 첫 chunk: C1.1

```bash
cd /Users/jj.iee/Desktop/workspace/05_chord-figma-mcp
npm install
npm install zod
npm run build
```

수용 기준:
- `node_modules/` 존재
- `dist/index.js` 생성
- tsc 에러 0
- `npm run inspect` 실행 시 빈 도구 목록이라도 Inspector 연결됨

C1.1는 단순 명령이므로 Codex 설계/구현 단계 생략. Opus가 직접 실행 → 결과 보고 → C2.1로.

### 검증 / 수정 루프 종료 조건

- 한 chunk에서 [4]→[5]→[4] 루프가 **3회 초과** 시 → Opus가 chunk 분해 재검토 (너무 큼)
- `/codex:review`가 Critical 이슈를 **2회 연속** 같은 부분에 지적하면 → 설계로 [2] 복귀
