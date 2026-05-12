# 플랜: 05_chord-figma-mcp 전체 구현 로드맵

## Context

- 05_chord-figma-mcp는 03/04 워크플로우에서 공통으로 쓰는 Figma 데이터 도구를 통합한 MCP 서버
- 현재 상태: 폴더 구조와 6 Phase 로드맵은 잡혀있지만 **실제 코드는 거의 없음**
  - `figma-client.ts` (REST GET 헬퍼 4개): ✅ 구현됨
  - `src/index.ts`: 빈 MCP 서버 (TODO 주석만)
  - `src/tools/*.ts` (8개): 모두 `// TODO` 한 줄짜리 스텁
  - `node_modules`: 없음 (npm install 안 됨)
  - Phase 0 spike: ✅ 완료 (2026-05-10)
- 재설계 목표: 빨리 "한 컴포넌트로 통하는지" 검증하고 그 결과로 나머지 다듬기

## 핵심 설계 결정

| 결정 | 이유 |
|------|------|
| **읽기 2개 만들면 즉시 04에서 통합 테스트** (Phase 3.5 신설) | 8개 다 만들고 나서 안 통하면 재작업 비용 큼. 작은 루프 먼저. |
| **Zod 스키마로 input/output 검증** | MCP는 LLM이 호출 — 잘못된 input이 들어와도 명확히 거절해야 함. |
| **description 쓰기 = figma-official 위임** | REST API 404 확인. Plugin API만 가능하므로 이 MCP 범위 밖. |
| **write_variable 신규 추가** | Variables API REST 200 확인. 디자인 토큰 bulk update 실용적. |

## 보안 게이트 (Codex 리뷰 3회 반영, 차단 조건)

| Gate | 적용 Phase | 차단 조건 |
|------|-----------|----------|
| **G1 파일 읽기 샌드박스** | Phase 5.2 (`check_source_note`) 구현 시 | LLM이 임의 로컬 경로를 읽지 못하게 workspace enum + relativePath만 허용. realpath 해석 + 절대경로/`..`/심볼릭링크 escape 거절. allow-list 디렉터리 외 거부. |
| **G2 Variables 쓰기 격리** | Phase 6 (`write_variable`) 구현 시 | (a) `FIGMA_WRITE_ENABLED=1` 없으면 `dryRun:false` 무시(강제 dryRun + 경고). (b) `FIGMA_WRITE_ALLOWED_FILES=key1,key2` 화이트리스트 외 fileKey 거절. (c) Zod 기본값 dryRun=true. mock fetch 단위 테스트 통과 후 등록. Variables는 reversible — README 명시. |
| **G3 PAT 비밀 관리** | Phase 3.5 + 기존 문서 정리 | `claude.json` 평문 금지. 래퍼 스크립트로 Keychain/.env 주입. **기존 docs(`05_chord-figma-mcp/CLAUDE.md` 등) `export FIGMA_ACCESS_TOKEN=figd_...` 예시 모두 정리**. 검증: `rg 'export FIGMA_ACCESS_TOKEN=.*figd_' 05_chord-figma-mcp/` hit 0. |
| **G4 Spike 리포트 redaction** | spike 리포트 커밋 시 | 별칭 매핑: fileKey→`<FILE_A>`, componentKey→`<COMP_A>`, nodeId→`<NODE_A>`, URL/토큰값→`<REDACTED_URL>`. 커밋 전 grep 검증. raw는 `_workspace/spike/raw/`(gitignore)에만 보관. |

## Phase 0 스파이크 결과 요약 (2026-05-10 확인)

| 엔드포인트 | 결과 | 결론 |
|-----------|------|------|
| `GET /v1/me` | ✅ 200 | 인증 OK |
| `GET /v1/files/{key}` | ✅ 200 | 파일 읽기 OK |
| `GET /v1/files/{key}/nodes` | ✅ 200 | 노드 읽기 OK |
| `PATCH /v1/files/.../nodes/{id}` | ❌ 404 | description 쓰기 불가 |
| `PUT /v1/components/{key}` | ❌ 404 | description 쓰기 불가 |
| `POST /v1/files/.../variables` | ✅ 200 | 변수 생성/수정/삭제 가능 |
| `POST /v1/files/.../comments` | ✅ 200 | 댓글 쓰기/삭제 가능 |
| `POST /v1/dev_resources` | ✅ 200 | Storybook 링크 등록 가능 |

**write_description: REST 불가 → figma-official MCP `use_figma` 위임 (README 명시)**
**write_variable 신규 추가: Variables API 활용**

## 도구 구현 순서 (v2)

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

## Phase 0 — 인증 + 읽기/쓰기 가능성 스파이크 ✅ 완료

2026-05-10 sandbox 파일(`<FILE_SANDBOX>`)로 확인 완료. 위 결과표 참조.

---

## Phase 1 — 프로젝트 세팅 완료

```bash
cd /Users/jj.iee/Desktop/workspace/05_chord-figma-mcp
npm install
npm install zod
npm run build
npm run inspect
```

**산출물:** `node_modules/`, `dist/index.js` 생성 확인.

---

## Phase 2 — figma-client.ts 강화

### 추가 사항
1. **에러 클래스 분리**: `FigmaAuthError` (401/403), `FigmaNotFoundError` (404), `FigmaRateLimitError` (429)
2. **Rate limit 재시도**: exponential backoff, 최대 3회
3. **응답 타입**: `FigmaNode { id, name, type, description? ... }`
4. **Variables 쓰기 헬퍼**:
   ```ts
   export async function postVariables(fileKey: string, payload: VariablesPayload): Promise<VariablesResponse>
   ```

**산출물:** 기존 함수 시그니처 유지 + error class + retry + postVariables. **각 오류 경로는 mock fetch 단위 테스트 필수** (spike 대체 불가).

---

## Phase 3 — 읽기 도구 2개 (read_component, read_design_context)

### 공통 도구 템플릿
```ts
import { z } from "zod";
export const inputSchema = z.object({ ... });
export const definition = { name, description, inputSchema };
export async function handler(input: z.infer<typeof inputSchema>) { ... }
```

### 3.1 read_component
- 입력: `fileKey: string, componentKey: string`
- 출력: `{ key, name, description, nodeId, properties[], variants[] }`

### 3.2 read_design_context
- 입력: `fileKey: string, nodeId: string, depth?: number` (기본값 2, 최대 5)
- 출력: `{ markdown: string }` (includeRaw 기본 false, 64KB 상한 + truncation 경고)

### 3.3 등록 + 빌드 테스트

---

## Phase 3.5 — 04_wf 통합 검증 (Critical Gate) ★

**G3 적용 — 래퍼 스크립트 방식으로 claude.json 등록:**
```bash
# bin/start.sh
#!/bin/bash
export FIGMA_ACCESS_TOKEN=$(op read "op://Personal/figma-pat/credential")
exec node /Users/jj.iee/Desktop/workspace/05_chord-figma-mcp/dist/index.js
```
```json
{ "mcpServers": { "chord-figma": { "command": ".../bin/start.sh" } } }
```

**G3 문서 정리 포함**: 기존 CLAUDE.md 등의 `figd_` 평문 예시 제거. grep 검증 통과 확인.

**게이트 통과 조건**: read_component + read_design_context만으로 source note axes/props/description 채우기 가능.
결과는 `_workspace/spike/reports/integration-04wf.md`에 redacted 형태로 기록 (G4 적용).

---

## Phase 4 — 나머지 읽기 도구 3개

- `get_component_image` (이미지 URL)
- `get_tokens` (로컬 변수/토큰)
- `discover_nested_slots` (nested 컴포넌트 자동 탐지)

각 도구: `_workspace/spike/reports/<tool>.md` (redacted, 커밋 대상).

---

## Phase 5 — 워크플로우 도구 2개

### 5.1 generate_source_note
- 입력: `fileKey, nodeId`
- 내부: 도구 1~5 모두 호출
- 출력: source note contract 마크다운 (04_wf `workflow/source-note-contract.md` 참조)

### 5.2 check_source_note (G1 적용)
- 입력: `workspace: "03_wf" | "04_wf"`, `relativePath: string`
- Zod: 절대경로/`..` 거절 + `.md` 전용 + 256자 이하
- 동작: ALLOWED_ROOTS 매핑 → realpath → 하위 검증 → 섹션 검증
- 출력: `{ valid: boolean, missing: string[], warnings: string[] }`
- 게이트: 악성 입력 거절 단위 테스트 통과 후 등록

---

## Phase 6 — write_variable (G2 적용)

### description 쓰기 위임
REST 불가 확인 → description 수정은 figma-official MCP `use_figma` 사용.

### write_variable 스펙
- 입력: `fileKey`, `dryRun: boolean = true`, `variableModeValues[]`
- G2 강제 순서:
  1. `FIGMA_WRITE_ENABLED=1` 없으면 → 강제 dryRun + 경고
  2. `FIGMA_WRITE_ALLOWED_FILES` 화이트리스트 검사 → 불일치 시 거절
  3. dryRun → payload만 반환
  4. 실제 쓰기 → `POST /v1/files/{key}/variables` (재시도 없음)
  5. `tempIdToRealId` 검증
  6. `_workspace/spike/reports/write-variable-log.md` redacted 기록
- 출력: `{ dryRun, envGated, applied, payload, warning? }`
- Variables는 reversible — 실수 시 이전 값 다시 쓰면 복원. README 명시.
- 게이트: env gate + allowlist + mock fetch 단위 테스트(거절 케이스 포함) 통과 후 등록

---

## Phase 7 — 03_wf, 04_wf 양쪽 통합

1. 03_wf: `generate_source_note` + 기존 description YAML 절차 통합
2. 04_wf: source note 작성을 chord-figma-mcp 호출로 일원화
3. 기존 figma-console/framelink/figma-official 사용처 점검
4. 결과: `_workspace/outputs/integration-summary.md`

---

## 위험 / 주의사항

| 위험 | 완화 |
|------|------|
| **LLM 통한 임의 파일 읽기 (G1)** | workspace enum + relativePath + realpath 샌드박스 + 단위 테스트 |
| **write_variable로 토큰 손상 (G2)** | env gate + fileKey allowlist + dryRun 기본값 + mock 단위 테스트 |
| **PAT 평문 노출 (G3)** | 래퍼 스크립트 + Keychain/.env + 기존 docs 정리 + grep 검증 |
| **Spike 리포트 메타데이터 유출 (G4)** | redaction 스키마 + 별칭 매핑 + 커밋 전 grep 검증 |
| figma-client 오류 경로 미검증 | mock fetch 단위 테스트 필수 (Phase 2 차단 조건) |
| read_design_context 출력 overflow | depth 상한(5) + 64KB 바이트 상한 + truncation 경고 |
| Figma API rate limit (60 req/min) | figma-client.ts 재시도 + generate_source_note 캐시 고려 |
| MCP SDK 버전 호환성 | `npm run inspect`로 Phase 1에서 확인 |

---

## 실행 순서 요약

```
Phase 0 ✅ → Phase 1 (npm install) → Phase 2 (client 강화 + 단위 테스트)
  → Phase 3 (read 2개) → Phase 3.5 (Gate ★)
  → Phase 4 (read 3개) → Phase 5 (workflow 2개)
  → Phase 6 (write_variable) → Phase 7 (통합)
```

**Phase 3.5는 필수 게이트.** 통과 못하면 도구 설계 되돌아가야 함.

---

## 실행 워크플로우 (Chunk-based, Opus + Codex 협업)

### 역할 분담

| 역할 | 담당 | 도구 |
|------|------|------|
| **기획 / 의사결정 / 검토** | Opus | 직접 |
| **설계 제안** | Codex | `Agent(codex:codex-rescue)` |
| **구현** | Codex | `Agent(codex:codex-rescue)` |
| **자체 검증** | Opus | Read, Bash (테스트 실행) |
| **코드 리뷰** | Codex | `/codex:review` (chunk마다) |
| **적대적 리뷰** | Codex | `/codex:adversarial-review` (Phase 경계에서만) |

### Chunk당 7-스텝 루프

```
[1] 기획 (Opus)         → chunk 범위, 수용 기준, 적용 게이트, 검증 명령 정의
[2] 설계 제안 (Codex)   → 인터페이스/타입만 제안, 구현 X
[3] 설계 검토 (Opus)    → 승인 또는 수정 요청
[4] 구현 (Codex)        → 승인 설계대로 + 단위 테스트 동시
[5] 자체 검증 (Opus)    → diff + npm test/typecheck → 통과 시 [6]
[6] /codex:review       → 표준 리뷰 → Critical/Major/Minor 분류
[7] 수정 + 다음 chunk
```

### 적대적 리뷰 시점

`/codex:adversarial-review`는 **Phase 경계에서만** 실행:
- Phase 2 끝 (figma-client.ts 강화 완료)
- Phase 3 끝 (read 2개 완료, Phase 3.5 진입 직전)
- Phase 5 끝 (workflow 도구 완료)
- Phase 6 끝 (write_variable 완료)

### Chunk 분해 (Phase 1 ~ Phase 3)

| Chunk | Phase | 범위 | 수용 기준 | Codex |
|-------|-------|------|----------|-------|
| **C1.1** | 1 | npm install + zod + build | `node_modules/`, `dist/index.js` 생성, build 0 에러 | ❌ |
| **C2.1** | 2 | error 클래스 3개 | export, instanceof/status 단위 테스트 | ✅ |
| **C2.2** | 2 | rate limit 재시도 (exp backoff, max 3회) | 429 mock 3회 시도 후 throw, 200 mock 1회 성공 | ✅ |
| **C2.3** | 2 | `FigmaNode`/`FigmaComponent` 타입 인터페이스 | GET 헬퍼 반환 타입 강화, tsc 통과 | ✅ |
| **C2.4** | 2 | `postVariables` + Variables 타입 | mock fetch 단위 테스트(성공/auth/network) | ✅ |
| **— adversarial review —** | 2 끝 | figma-client.ts 전체 | 차단 이슈 0 | adversarial |
| **C3.1** | 3 | `read_component` (Zod input + handler + 등록) | inspector에서 호출 → 결과 반환 | ✅ |
| **C3.2** | 3 | `read_design_context` (depth 2/max 5, 64KB) | inspector 호출, 큰 노드 truncation 경고 | ✅ |
| **— adversarial review —** | 3 끝 | 도구 2개 + index.ts | 차단 이슈 0 | adversarial |
| **C3.5.1** | 3.5 | 래퍼 스크립트 + claude.json (G3) | grep 검증 hit 0, 평문 토큰 X | ❌ |
| **C3.5.2** | 3.5 | 04_wf 컴포넌트 1개 통합 테스트 | source note axes/props/description 채워짐 | ❌ |

**Phase 4 이후는 Phase 3.5 결과 보고 chunk 재정의** (read 출력 포맷 수정 가능성).

### 첫 chunk: C1.1

```bash
cd /Users/jj.iee/Desktop/workspace/05_chord-figma-mcp
npm install
npm install zod
npm run build
```

수용 기준: `node_modules/` 존재, `dist/index.js` 생성, tsc 0 에러, `npm run inspect` 연결.
C1.1는 단순 명령이므로 Codex 설계/구현 단계 생략. Opus가 직접 실행.

### 루프 종료 조건

- 같은 chunk에서 [4]→[5]→[4] 루프 **3회 초과** → chunk 분해 재검토
- `/codex:review`가 Critical을 같은 부분에 **2회 연속** 지적 → 설계 [2]로 복귀
