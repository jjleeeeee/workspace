# design-md-harness → 10_figma-to-components-md 전면 구조 리팩터링

## Context

`claude-plugins/plugins/design-md-harness/` 는 Figma URL → design.md 자동 생성을 생성-평가 루프(최대 5회)로 구현한 도구다. 동작은 검증되었으나 **카드뉴스 "하네스 제작법" 권장 구조와 다음과 같은 갭**이 있다.

| 권장 (카드뉴스) | 현재 | 결과 |
|----------------|------|------|
| `CLAUDE.md` 규칙집 분리 | command 인라인에 모든 규칙 | 규칙 변경/재사용 어려움 |
| `harness/workflow.md`, `orchestrator.md` 분리 | 470줄짜리 단일 command | 가독성·유지보수 악화 |
| `_workspace/{drafts,reviews,outputs}` 표준 | `fixture/`, `.harness/attempt_N/` 만 | 의미 없는 평면 구조 |
| 횡단 관심사 SSOT | 토큰 해석·노드 순회·fix_hints가 3중 정의 | 일관성 깨짐 위험 |

이번 리팩터링의 목표는 **동작 변경 없이** 위 4개 갭을 메우는 것이다. 새 위치는 `/Users/jj.iee/Desktop/workspace/10_figma-to-components-md` (현재 빈 폴더). Skills 분리는 본 라운드 범위에서 제외 — 새 구조로 1주일 운용 후 재평가.

---

## 목표 구조

```
10_figma-to-components-md/
├── CLAUDE.md                          # 하네스 철학 + 불변 규칙
├── .claude/
│   ├── agents/
│   │   ├── design_md_generator.md
│   │   ├── design_md_renderer.md
│   │   └── design_md_qa.md
│   └── commands/
│       └── figma-to-md.md             # 슬림 오케스트레이터 (~80줄)
├── harness/
│   ├── workflow.md                    # Phase 0.5/0/Loop 단계별 절차
│   ├── orchestrator.md                # 단계 호출 순서 + 통과 판정
│   ├── design-md-spec.md              # design.md YAML 스키마 + CDS 규칙
│   └── lib/                           # SSOT (Python 공통 모듈)
│       ├── __init__.py
│       ├── token_resolver.py          # {cds:x}, {colors.x}, {spacing.x} 해석
│       ├── figma_walker.py            # figma_raw 노드 순회 + 의미 추출
│       ├── fix_hints.py               # fix_hints 포맷터 + 회귀 태깅
│       └── handoff.py                 # handoff 스키마 read/write
├── servers/
│   ├── design_md_harness.py           # check만, 공통 로직은 lib 사용
│   ├── figma_mcp_adapter.py           # 공통 walker 사용
│   ├── pixel_compare.py
│   ├── playwright_capture.py
│   ├── setup.py
│   └── requirements.txt
├── _workspace/                        # 산출물 표준 디렉토리
│   ├── drafts/                        # 루프별 design.md 초안
│   │   └── attempt_<N>/
│   │       └── <ComponentName>.md
│   ├── reviews/                       # 평가 결과 + handoff
│   │   └── attempt_<N>/
│   │       ├── harness_result.json
│   │       ├── pixel_compare_result.json
│   │       ├── render.html
│   │       ├── render_screenshot.png
│   │       └── diff.png
│   │   └── handoff_<N>.json
│   └── outputs/                       # 최종 산출물 (PASS 시)
│       ├── <ComponentName>.md
│       ├── figma_screenshot.png
│       ├── render_screenshot.png
│       └── final_report.md
├── fixture/                           # 기존 그대로 (readonly + lock)
└── README.md
```

핵심 변경:
- **`commands/`** → 80줄 오케스트레이터로 축소. 절차는 `harness/workflow.md` 참조.
- **`harness/lib/`** → 횡단 관심사 SSOT. 3중 정의 제거.
- **`_workspace/`** → drafts/reviews/outputs 시맨틱 분리. `.harness/attempt_N/` 폐지.
- **`fixture/`** → 위치·readonly·lock 정책 유지 (안전한 부분은 손대지 않음).

---

## 변경 전후 매핑

| 현재 위치 | 새 위치 | 변경 내용 |
|----------|---------|----------|
| `commands/design-md-harness.md` (470줄) | `.claude/commands/figma-to-md.md` (~80줄) + `harness/workflow.md` + `harness/orchestrator.md` | 규칙·절차·실행 분리 |
| `agents/design_md_generator.md` | `.claude/agents/design_md_generator.md` | 위치만 이동 (.claude/ 하위로) |
| `agents/design_md_renderer.md` | 동일 | 동일 |
| `agents/design_md_qa.md` | 동일 | 동일 |
| `servers/design_md_harness.py` (11개 check + IO 혼재) | `servers/design_md_harness.py` (check만) + `harness/lib/{token_resolver,figma_walker,fix_hints}.py` | 횡단 관심사 추출 |
| `servers/figma_mcp_adapter.py` | 동일 위치, `harness/lib/figma_walker` import | 노드 순회 중복 제거 |
| `servers/pixel_compare.py` | 동일 | 변경 없음 |
| `servers/playwright_capture.py` | 동일 | 변경 없음 |
| `servers/setup.py` | 동일 | 변경 없음 |
| (없음) | `CLAUDE.md` | 하네스 철학·불변 규칙 신설 |
| (없음) | `harness/design-md-spec.md` | YAML 스키마 명세 추출 |
| `.harness/attempt_N/` | `_workspace/reviews/attempt_N/` | 시맨틱 디렉토리 |
| `<ComponentName>.md` (루트) | `_workspace/drafts/attempt_N/` (작업 중) → `_workspace/outputs/` (최종) | 단계 분리 |
| `.harness/handoff_N.json` | `_workspace/reviews/handoff_N.json` | |
| `.harness/final_report.md` | `_workspace/outputs/final_report.md` | |

---

## 실행 단계

### Step 1: 골격 디렉토리 생성
- 위 트리의 빈 디렉토리 + `__init__.py` 생성
- `README.md` 신규 작성 (기존 README 핵심만 발췌, 새 구조 반영)

### Step 2: CLAUDE.md 신설
다음 항목을 발췌·집약:
- 하네스 철학: 생성-평가 루프, 회귀 방지, 5회 한도
- **불변 규칙**: `fixture/` readonly + lock 검증, 회귀 연속 2회 시 즉시 종료, 도큐먼트 구조 INSTANCE 제외
- 산출물 위치 규약: drafts/reviews/outputs 의미
- design.md 작성 시 CDS 토큰 우선 원칙

### Step 3: harness/ 분리
- `workflow.md` ← 기존 command의 Phase 0.5 / Phase 0 / Loop Step A~H 절차 그대로 이동
- `orchestrator.md` ← Phase 호출 순서, 통과 판정 로직, fixture lock 검증, 회귀 종료 분기
- `design-md-spec.md` ← 기존 README의 YAML 스키마 섹션 + CDS 토큰 참조 규약

### Step 4: 횡단 관심사 SSOT (`harness/lib/`)
조사 결과로 식별된 3중 정의 제거:

- **`token_resolver.py`** — `{cds:x}`, `{colors.x}`, `{typography.x}`, `{spacing.x}` 참조 해석 단일 구현. generator 프롬프트는 "lib/token_resolver의 규약을 따른다" 라고 짧게 참조.
- **`figma_walker.py`** — `_walk_figma`, `_to_kebab`, `boundVariables→token`, `layoutMode→axis`, `padding` 추출. `design_md_harness.py`와 `figma_mcp_adapter.py`가 import.
- **`fix_hints.py`** — fix_hints YAML 경로 포맷, `[REGRESSION]` 태깅, 표준 메시지 템플릿. 11개 check + qa 에이전트가 참조할 표준 스키마.
- **`handoff.py`** — handoff_N.json 스키마 read/write. verified_pass / remaining_issues / regression_streak 필드 정의.

### Step 5: servers/ 슬림화
- `design_md_harness.py` → `from harness.lib import token_resolver, figma_walker, fix_hints` 로 중복 로직 제거. check 함수 자체는 그대로.
- `figma_mcp_adapter.py` → `figma_walker` 사용.
- import 경로를 위해 `setup.py` 또는 `PYTHONPATH` 설정 검토 (또는 sys.path 조정).

### Step 6: commands/ 오케스트레이터 작성
`.claude/commands/figma-to-md.md` (~80줄):
- `$ARGUMENTS`에서 Figma URL 파싱
- `harness/workflow.md`, `harness/orchestrator.md` 참조 지시
- 산출물 경로는 `_workspace/{drafts,reviews,outputs}/` 규약 준수
- 실제 절차는 두 md 파일에 위임

### Step 7: agents/ 이전
3개 agent를 `.claude/agents/`로 이동. **프롬프트 본문 수정**:
- 입력/출력 경로를 새 `_workspace/` 구조에 맞게 변경
- 토큰 해석 규칙은 `harness/design-md-spec.md`와 `harness/lib/token_resolver.py` 참조로 단축
- handoff 스키마는 `harness/lib/handoff.py` 참조

### Step 8: _workspace/ 규약 문서화
`_workspace/README.md` 짧게 작성:
- `drafts/attempt_<N>/` — 루프 N의 design.md 초안
- `reviews/attempt_<N>/` — 평가 결과 (harness_result, pixel_compare, render)
- `reviews/handoff_<N>.json` — 다음 루프 인계
- `outputs/` — PASS 시 최종 복사본

---

## 핵심 파일 경로

읽기 (참고용 원본):
- `/Users/jj.iee/Desktop/workspace/claude-plugins/plugins/design-md-harness/commands/design-md-harness.md` — Phase 0.5/0/Loop 원본 절차
- `/Users/jj.iee/Desktop/workspace/claude-plugins/plugins/design-md-harness/README.md` — YAML 스키마 + 체크 목록
- `/Users/jj.iee/Desktop/workspace/claude-plugins/plugins/design-md-harness/agents/*.md` — 3개 agent 원본
- `/Users/jj.iee/Desktop/workspace/claude-plugins/plugins/design-md-harness/servers/design_md_harness.py` — `_walk_figma`, `_to_kebab`, 11개 check
- `/Users/jj.iee/Desktop/workspace/claude-plugins/plugins/design-md-harness/servers/figma_mcp_adapter.py` — `_build_nodes`, JSX 파서

신규 작성 (10_figma-to-components-md/ 하위):
- `CLAUDE.md`, `README.md`
- `harness/workflow.md`, `harness/orchestrator.md`, `harness/design-md-spec.md`
- `harness/lib/{__init__,token_resolver,figma_walker,fix_hints,handoff}.py`
- `.claude/commands/figma-to-md.md`
- `_workspace/README.md`

이전 + 수정:
- `.claude/agents/*.md` (3개)
- `servers/*.py` (5개) — 공통 lib import로 슬림화

---

## 검증

리팩터링 직후:
1. `python3 -c "from harness.lib import token_resolver, figma_walker, fix_hints, handoff"` — import 정상
2. `python3 servers/design_md_harness.py --help` — CLI 동작 확인
3. `python3 servers/figma_mcp_adapter.py --help` — 동일

엔드투엔드 검증 (기준 케이스 1개):
4. 임의 Figma 컴포넌트 URL로 `/figma-to-md <URL>` 실행
5. PASS 또는 FAIL 보고서까지 생성되는지 확인 — 동작 회귀 없으면 성공
6. `_workspace/outputs/<ComponentName>.md` 생성 확인
7. 산출물 위치가 새 규약(drafts/reviews/outputs)에 맞는지 확인

회귀 비교:
8. 같은 Figma URL을 기존 plugin과 새 구조로 각각 실행 → 최종 design.md를 diff. 의미 있는 차이 없으면 OK.

---

## Phase 2 (본 라운드 범위 외)

새 구조로 1주일 이상 운용 후 재평가:
- **Skills 분리 후보**: `figma-url-parsing` (LLM 매번 따르는 절차라 Skill 적합도 높음)
- 다른 횡단 관심사가 LLM 측에서 반복되면 그때 Skill로 추출
- `_workspace/` 사용 패턴이 정착되면 자동 정리 hook 검토
