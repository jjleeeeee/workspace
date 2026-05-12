# 하네스 구조 마이그레이션 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `03_wf-figma-to-description`를 Claude Code 하네스 패턴(CLAUDE.md + .claude/agents/ + .claude/skills/ + harness/ + _workspace/)으로 완전히 재구성한다.

**Architecture:** 폴더 이동/삭제 → 새 파일 생성(agents, skills) → CLAUDE.md 재작성 → 참조 경로 업데이트 → 검증 순으로 진행. git mv를 사용해 히스토리를 보존한다.

**Tech Stack:** bash (git mv, mkdir), YAML, Markdown

---

## 전후 구조 대조표

```
현재                              →  목표
──────────────────────────────────────────────────────────
CLAUDE.md                        →  CLAUDE.md (재작성 — 규칙 직접 내장)
AGENTS.md                        →  .claude/agents/*.md 로 분리 후 삭제
docs/AI_RULES.md                 →  CLAUDE.md에 흡수 후 docs/ 삭제
PLAYBOOK.md                      →  harness/workflow.md에 흡수 후 삭제
workflow/README.md               →  harness/workflow.md (병합)
workflow/description-yaml-schema.md → harness/schema.md
workflow/exceptions.md           →  harness/exceptions.md
workflow/validation-checklist.md →  harness/validation-checklist.md
workflow/figma-write-readback.md →  harness/figma-write-readback.md
draft-descriptions/              →  _workspace/outputs/
history/                         →  _workspace/reviews/history/
retrospectives/                  →  _workspace/reviews/retrospectives/
plan/                            →  .claude/plans/ (이미 있음, plan/ 삭제)
examples/                        →  harness/examples/
refs/                            →  refs/ (그대로 — 참조 입력 데이터)
scripts/                         →  scripts/ (그대로)
tools/                           →  tools/ (그대로)
README.md                        →  README.md (경로만 업데이트)
```

---

## 역할 설계 (에이전트 & 스킬)

### 에이전트 정의 (.claude/agents/)

| 파일 | 역할 | 핵심 제약 |
|------|------|-----------|
| `figma-reader.md` | Figma MCP로 컴포넌트 구조·토큰·variants 읽기 | 부모 에이전트 전용. 서브에이전트 사용 금지 |
| `yaml-drafter.md` | description YAML 초안 작성 및 gap 해소 | Figma 데이터 없이 추론으로 값 채우기 금지 |
| `enricher.md` | enrich_tokens.py, enrich_typography.py 실행 | 서브에이전트 사용 가능 |
| `validator.md` | validate-component-description.mjs 실행 및 리포트 | 서브에이전트 사용 가능 |

### 스킬 정의 (.claude/skills/)

| 파일 | 역할 |
|------|------|
| `enrich-component.md` | 한 컴포넌트에 enrich 스크립트 2종 실행 절차 |
| `validate-component.md` | validator 실행 → 결과 해석 → 수정 절차 |
| `fill-gap.md` | source_gaps 1개 항목 해소 표준 절차 |
| `record-history.md` | history.md 항목 추가 표준 절차 |

---

## Task 0: 플랜 파일을 plan/ 폴더에 저장

**Files:** `plan/2026-05-12-harness-migration.md`

- [ ] plan/ 폴더가 없으면 생성

```bash
mkdir -p plan
```

- [ ] 플랜 파일 복사

```bash
cp .claude/plans/hidden-napping-whistle.md plan/2026-05-12-harness-migration.md
```

- [ ] 커밋

```bash
git add plan/2026-05-12-harness-migration.md
git commit -m "docs: save harness migration plan to plan/"
```

---

## Task 1: _workspace 폴더 생성

**Files:** `_workspace/outputs/`, `_workspace/drafts/`, `_workspace/reviews/`

- [ ] 폴더 생성

```bash
mkdir -p _workspace/outputs _workspace/drafts _workspace/reviews/history _workspace/reviews/retrospectives
```

- [ ] .gitkeep 추가 (빈 폴더 추적)

```bash
touch _workspace/drafts/.gitkeep
```

---

## Task 2: draft-descriptions/ → _workspace/outputs/

**Files:** `draft-descriptions/*.yaml` → `_workspace/outputs/`

- [ ] 37개 YAML 파일 이동 (git mv로 히스토리 보존)

```bash
git mv draft-descriptions _workspace/outputs/draft-descriptions
```

> 폴더 이름은 `draft-descriptions`를 유지하되 위치만 `_workspace/outputs/` 아래로 이동.
> 결과: `_workspace/outputs/draft-descriptions/*.description.yaml`

- [ ] 커밋

```bash
git add -A
git commit -m "refactor(harness): move draft-descriptions → _workspace/outputs/"
```

---

## Task 3: history/ + retrospectives/ → _workspace/reviews/

**Files:** `history/` → `_workspace/reviews/history/`, `retrospectives/` → `_workspace/reviews/retrospectives/`

- [ ] 이동

```bash
git mv history/* _workspace/reviews/history/
git mv retrospectives/* _workspace/reviews/retrospectives/
rmdir history retrospectives
```

- [ ] 커밋

```bash
git add -A
git commit -m "refactor(harness): move history + retrospectives → _workspace/reviews/"
```

---

## Task 4: workflow/ → harness/ (폴더 이름 변경)

**Files:** `workflow/` → `harness/`

- [ ] 폴더 이름 변경

```bash
git mv workflow harness
```

- [ ] PLAYBOOK.md 내용을 harness/workflow.md 상단에 병합

`harness/workflow.md` 파일을 열어 `PLAYBOOK.md`의 "단계 요약 표" 부분을 도입부에 추가한다. 형식:

```markdown
# Workflow — Figma Description 작성 절차

> 이 파일은 하네스의 핵심 작업 흐름을 정의한다.
> PLAYBOOK(단계 요약) + 상세 절차를 통합한 단일 참조 문서.

## 빠른 참조 (구 PLAYBOOK)

[PLAYBOOK.md 내용 이식]

## 상세 절차

[기존 workflow/README.md 내용 이식]
```

- [ ] workflow/description-yaml-schema.md → harness/schema.md로 이름 변경

```bash
git mv harness/description-yaml-schema.md harness/schema.md
```

- [ ] harness/orchestrator.md 신규 작성 (내용은 Task 8에서)

- [ ] PLAYBOOK.md 삭제

```bash
git rm PLAYBOOK.md
```

- [ ] 커밋

```bash
git add -A
git commit -m "refactor(harness): workflow/ → harness/, merge PLAYBOOK into harness/workflow.md"
```

---

## Task 5: examples/ → harness/examples/

**Files:** `examples/` → `harness/examples/`

- [ ] 이동

```bash
git mv examples harness/examples
```

- [ ] 커밋

```bash
git add -A
git commit -m "refactor(harness): move examples → harness/examples/"
```

---

## Task 6: plan/ 정리

**Files:** `plan/` → `.claude/plans/`로 합산 후 `plan/` 삭제

- [ ] plan/ 아래 파일을 .claude/plans/로 이동

```bash
git mv plan/2026-05-12-source-gaps-spec-notes-enrichment.md .claude/plans/
rmdir plan
```

- [ ] 커밋

```bash
git add -A
git commit -m "refactor(harness): merge plan/ → .claude/plans/"
```

---

## Task 7: .claude/agents/ 생성 및 에이전트 파일 작성

**Files:** `.claude/agents/figma-reader.md`, `yaml-drafter.md`, `enricher.md`, `validator.md`

- [ ] 폴더 생성

```bash
mkdir -p .claude/agents
```

- [ ] `.claude/agents/figma-reader.md` 작성

```markdown
---
name: figma-reader
description: Figma MCP로 컴포넌트 구조·토큰·variants·레이아웃을 읽는 에이전트.
  부모 에이전트 전용이며 서브에이전트에서 호출 금지.
---

## 역할
Figma MCP (Framelink + figma-console)를 사용해 컴포넌트 데이터를 읽고
yaml-drafter가 사용할 수 있는 형태로 정리한다.

## 허용 도구
- mcp__Framelink_Figma_MCP__get_figma_data
- mcp__figma-console__figma_get_component
- mcp__figma-console__figma_get_variables
- refs/figma-component-keys/index.md 읽기

## 제약
- 이 에이전트는 부모 에이전트(주 세션)만 사용 가능.
- 서브에이전트는 Figma MCP 도구를 사용할 수 없다.
- 추론으로 값을 채우지 않는다. 확인 불가 값은 source_gaps에 기록.

## 출력 형식
컴포넌트 이름, nodeId, variants, props, 토큰 바인딩 목록을 구조화된 텍스트로 반환.
```

- [ ] `.claude/agents/yaml-drafter.md` 작성

```markdown
---
name: yaml-drafter
description: figma-reader 출력을 바탕으로 description YAML을 작성하거나
  기존 YAML의 source_gaps를 해소하는 에이전트.
---

## 역할
`_workspace/outputs/draft-descriptions/` 아래에 YAML 파일을 생성하거나 수정한다.

## 출력 경로
`_workspace/outputs/draft-descriptions/<component>.description.yaml`

## 규칙
- Figma 데이터로 확인된 값만 필드에 기입.
- 확인 불가 값은 `source_gaps`에 reason과 함께 기록.
- `bridge-descriptions/` 파일 생성 금지 (deprecated).
- Figma description 필드에 직접 쓰기 금지 (deprecated).
- 자식 컴포넌트 내부 상세를 부모 YAML에 복사하지 않고 composition.uses로 참조.

## 스키마 참조
`harness/schema.md`
```

- [ ] `.claude/agents/enricher.md` 작성

```markdown
---
name: enricher
description: enrich_tokens.py, enrich_typography.py를 실행해 YAML에
  resolved token 값과 typography 데이터를 보강하는 에이전트.
---

## 역할
서브에이전트로 실행 가능. 스크립트만 실행하며 YAML 구조를 직접 수정하지 않는다.

## 실행 명령

```bash
python scripts/enrich_tokens.py _workspace/outputs/draft-descriptions/<component>.description.yaml
python scripts/enrich_typography.py _workspace/outputs/draft-descriptions/<component>.description.yaml
```

## 실행 조건
- yaml-drafter가 YAML을 저장한 이후에만 실행.
- validator 통과 전에 실행해도 무방.
```

- [ ] `.claude/agents/validator.md` 작성

```markdown
---
name: validator
description: validate-component-description.mjs를 실행하고 결과를 리포트하는 에이전트.
---

## 역할
서브에이전트로 실행 가능. YAML 파일을 validator에 통과시키고 오류/경고를 정리해 반환.

## 실행 명령

```bash
node tools/validate-component-description.mjs \
  _workspace/outputs/draft-descriptions/<component>.description.yaml
```

## 합격 기준
오류(error) 0개. 경고(warning)는 기록하되 진행 가능.

## 실패 처리
오류 발생 시 yaml-drafter에게 오류 목록과 줄 번호를 전달하고 수정 요청.
```

- [ ] 커밋

```bash
git add .claude/agents/
git commit -m "feat(harness): add .claude/agents/ — figma-reader, yaml-drafter, enricher, validator"
```

---

## Task 8: .claude/skills/ 생성 및 스킬 파일 작성

**Files:** `.claude/skills/enrich-component.md`, `validate-component.md`, `fill-gap.md`, `record-history.md`

- [ ] 폴더 생성

```bash
mkdir -p .claude/skills
```

- [ ] `.claude/skills/validate-component.md` 작성

```markdown
---
name: validate-component
description: 컴포넌트 YAML 1개에 대해 validator를 실행하고 결과를 해석하는 반복 작업 스킬.
---

## 사용 시점
YAML을 저장한 직후, 커밋 전.

## 절차

1. validator 실행:
   ```bash
   node tools/validate-component-description.mjs \
     _workspace/outputs/draft-descriptions/<component>.description.yaml
   ```
2. 오류 있으면 → yaml-drafter에게 목록 전달 후 수정, 재실행.
3. 경고만 있으면 → 경고 내용을 source_gaps 또는 spec_notes에 기록 후 진행.
4. 오류 없음 → 통과. 다음 단계 진행.
```

- [ ] `.claude/skills/enrich-component.md` 작성

```markdown
---
name: enrich-component
description: 컴포넌트 YAML에 token 및 typography 데이터를 보강하는 반복 작업 스킬.
---

## 사용 시점
yaml-drafter가 YAML 초안을 저장한 후, validator 실행 전 또는 후.

## 절차

1. 토큰 보강:
   ```bash
   python scripts/enrich_tokens.py \
     _workspace/outputs/draft-descriptions/<component>.description.yaml
   ```
2. 타이포그래피 보강:
   ```bash
   python scripts/enrich_typography.py \
     _workspace/outputs/draft-descriptions/<component>.description.yaml
   ```
3. 변경 사항 확인 후 validate-component 스킬 실행.
```

- [ ] `.claude/skills/fill-gap.md` 작성

```markdown
---
name: fill-gap
description: source_gaps 항목 1개를 해소하는 표준 절차 스킬.
---

## 사용 시점
source_gaps 항목이 남아 있을 때 컴포넌트별로 호출.

## 절차

1. 해당 gap 항목 확인 (item 텍스트, 이유).
2. figma-reader로 관련 Figma 데이터 읽기 시도.
3. 확인 가능한 경우:
   - YAML 해당 필드에 값 기입.
   - source_gaps 항목 제거.
4. 확인 불가한 경우:
   - source_gaps 항목에 추가:
     ```yaml
     confirmed: true
     reason: "<이유 — 예: Lottie asset stored outside Figma file>"
     ```
5. validate-component 스킬 실행.
```

- [ ] `.claude/skills/record-history.md` 작성

```markdown
---
name: record-history
description: 결정·정책 변경 사항을 history 파일에 기록하는 반복 작업 스킬.
---

## 사용 시점
컴포넌트 작업 중 결정이나 정책이 바뀐 경우 커밋 직전.

## 절차

1. `_workspace/reviews/history/figma-description-history.md` 파일 열기.
2. 파일 맨 아래에 항목 추가:
   ```markdown
   ## YYYY-MM-DD — <component 이름>
   - <변경 내용>
   - <이유 또는 근거>
   ```
3. 저장 후 커밋에 포함.

## 기록 기준
- 정책 변경 (예: 특정 필드를 더 이상 채우지 않기로 결정)
- 예외 처리 (예: 특정 컴포넌트에 표준 절차 외 규칙 적용)
- source_gaps confirmed 처리 이유가 새로운 패턴일 때
```

- [ ] 커밋

```bash
git add .claude/skills/
git commit -m "feat(harness): add .claude/skills/ — 4 recurring task manuals"
```

---

## Task 9: harness/orchestrator.md 작성

**Files:** `harness/orchestrator.md`

- [ ] 파일 작성

```markdown
# Orchestrator — Claude 에이전트 운영 지침

## 이 프로젝트에서 Claude는 어떤 팀처럼 일하는가

```
[부모 에이전트 — 오케스트레이터]
  │
  ├─► figma-reader (MCP 직접 소유, 직렬 실행)
  │
  ├─► yaml-drafter (로컬 파일 작업)
  │
  ├─► enricher (서브에이전트 가능)
  │
  └─► validator (서브에이전트 가능)
```

## 실행 원칙

1. **Figma MCP는 부모 에이전트 전용.** figma-reader 역할은 서브에이전트에 위임 불가.
2. **로컬 파일 작업은 서브에이전트 가능.** enricher, validator는 병렬 실행 허용.
3. **YAML 저장 경로:** `_workspace/outputs/draft-descriptions/<component>.description.yaml`
4. **Validator 통과 없이 커밋 금지.**
5. **추론으로 값 채우기 금지.** 확인 불가 값은 source_gaps에 기록.

## 표준 1컴포넌트 처리 흐름

```
figma-reader: Figma 데이터 읽기
     ↓
yaml-drafter: YAML 작성/수정 + fill-gap 스킬
     ↓
enricher: enrich-component 스킬
     ↓
validator: validate-component 스킬 (통과 필수)
     ↓
커밋
     ↓
record-history 스킬 (결정 변경 시)
```

## 작업 우선순위 큐

Gap + spec_notes 둘 다 부족한 컴포넌트 우선:
1. tag, tooltip (gap 있음 + notes 0개)
2. loading-circular, loading-dot, snackbar, toast, title-header, text-fields,
   pagination-dot-v2, skeleton, avatar-group, dropdown-box, search (gap 2~3개)
3. thumbnail, icon-button, avatar, bottom-navigation, list-item-native, list-item-web (gap 1개)
4. toggle-switch, badge-dot, badge-number, checkbox, radio, scrim-overlay,
   scrollbar, text-button (notes만 얇음)

## Exit 조건

- 모든 source_gaps: 비어 있거나 `confirmed: true + reason` 명시
- 모든 대상 컴포넌트 spec_notes ≥ 2개
```

- [ ] 커밋

```bash
git add harness/orchestrator.md
git commit -m "feat(harness): add orchestrator.md — agent team operation guide"
```

---

## Task 10: CLAUDE.md 재작성

**Files:** `CLAUDE.md` (규칙을 직접 내장, docs/AI_RULES.md 흡수)

- [ ] 현재 CLAUDE.md와 docs/AI_RULES.md를 읽고 아래 구조로 통합 작성

```markdown
# CLAUDE.md — Figma Description 하네스 규칙집

## 미션
Figma 컴포넌트 → `_workspace/outputs/draft-descriptions/*.description.yaml` (SoT)

## 읽기 순서
1. `harness/workflow.md` — 전체 흐름
2. `harness/orchestrator.md` — 에이전트 운영
3. `harness/schema.md` — YAML 스키마
4. `refs/figma-component-keys/index.md` — 컴포넌트 키 (필요 시)
5. `refs/markitdown-output/<component>.md` — 보조 참조 (필요 시)

## 허용
- `_workspace/outputs/draft-descriptions/*.description.yaml` 수정
- validator 실행
- enrich 스크립트 실행
- `_workspace/reviews/history/` 에 기록 추가
- refs/, harness/ 읽기
- 서브에이전트: 로컬 파일 작업, validator, enricher 역할에 한해 사용

## 금지
- Figma description 필드 직접 쓰기 (deprecated 2026-05-12)
- `bridge-descriptions/` 생성/수정 (deprecated 2026-05-12)
- 확인되지 않은 값 추론으로 YAML 필드 채우기
- 자식 컴포넌트 상세를 부모 YAML에 복사 (composition.uses로 참조)
- 서브에이전트의 Figma MCP 사용 (부모 에이전트 전용)

## 소스 우선순위
1. 사용자 지시
2. Figma 라이브 데이터
3. refs/figma-component-keys/
4. refs/markitdown-output/
5. 기존 history
6. LLM 추론 (최하위 — 확인 불가 시 source_gaps 기록)

## Done 기준
- YAML 저장 완료
- validator 통과
- 결정 변경 시 history 기록
```

- [ ] docs/AI_RULES.md 및 docs/ 폴더 삭제

```bash
git rm -r docs/
```

- [ ] AGENTS.md 삭제 (.claude/agents/ 로 대체됨)

```bash
git rm AGENTS.md
```

- [ ] 커밋

```bash
git add CLAUDE.md
git commit -m "refactor(harness): rewrite CLAUDE.md — inline rules, remove docs/AI_RULES.md + AGENTS.md"
```

---

## Task 11: AI_RULES.md 참조 경로 업데이트

기존 파일들 중 `docs/AI_RULES.md`, `draft-descriptions/`, `workflow/`, `history/` 경로를 참조하는 파일들의 경로를 업데이트한다.

**Files:** `README.md`, `harness/workflow.md`, `harness/orchestrator.md`, `harness/exceptions.md`

- [ ] 구 경로 참조 일괄 확인

```bash
grep -r "docs/AI_RULES" . --include="*.md" -l
grep -r "draft-descriptions/" . --include="*.md" -l
grep -r "workflow/" . --include="*.md" -l | grep -v "^./harness"
grep -r "history/" . --include="*.md" -l | grep -v "_workspace"
```

- [ ] 발견된 파일마다 경로 수정

| 구 경로 | 신 경로 |
|---------|---------|
| `docs/AI_RULES.md` | `CLAUDE.md` |
| `draft-descriptions/` | `_workspace/outputs/draft-descriptions/` |
| `workflow/` | `harness/` |
| `history/` | `_workspace/reviews/history/` |
| `retrospectives/` | `_workspace/reviews/retrospectives/` |

- [ ] validator 실행 경로 확인 (tools/ 경로는 변경 없음)

```bash
grep -r "validate-component-description" . --include="*.md" -l
```

- [ ] 커밋

```bash
git add -A
git commit -m "refactor(harness): update internal path references to new structure"
```

---

## Task 12: 최종 구조 검증

- [ ] 최종 폴더 구조 확인

```bash
find . -not -path './.git/*' -not -name '.DS_Store' | sort
```

예상 결과:
```
.
├── CLAUDE.md
├── README.md
├── .claude/
│   ├── agents/
│   │   ├── enricher.md
│   │   ├── figma-reader.md
│   │   ├── validator.md
│   │   └── yaml-drafter.md
│   ├── plans/
│   │   └── *.md
│   └── skills/
│       ├── enrich-component.md
│       ├── fill-gap.md
│       ├── record-history.md
│       └── validate-component.md
├── harness/
│   ├── examples/
│   ├── exceptions.md
│   ├── figma-write-readback.md
│   ├── orchestrator.md
│   ├── schema.md
│   ├── validation-checklist.md
│   └── workflow.md
├── refs/
│   ├── figma-component-keys/
│   └── markitdown-output/
├── scripts/
├── tools/
└── _workspace/
    ├── drafts/
    ├── outputs/
    │   └── draft-descriptions/ (37 YAML)
    └── reviews/
        ├── history/
        └── retrospectives/
```

- [ ] validator가 새 경로에서 정상 작동 확인

```bash
node tools/validate-component-description.mjs \
  _workspace/outputs/draft-descriptions/avatar.description.yaml
```

- [ ] enrich 스크립트 경로 확인 (내부 하드코딩 경로 없는지)

```bash
grep -n "draft-descriptions" scripts/enrich_tokens.py scripts/enrich_typography.py
```

경로 하드코딩이 있으면 인자로 받도록 수정 또는 경로 변수 업데이트.

- [ ] 최종 커밋

```bash
git add -A
git commit -m "refactor(harness): complete harness structure migration"
```

---

## 완료 기준

- [ ] `find . | sort` 결과가 예상 구조와 일치
- [ ] `node tools/validate-component-description.mjs` 새 경로에서 정상 실행
- [ ] `grep -r "docs/AI_RULES" . --include="*.md"` 결과 없음
- [ ] `grep -r "draft-descriptions/" . --include="*.md" | grep -v "_workspace"` 결과 없음
- [ ] `.claude/agents/` 4개, `.claude/skills/` 4개 파일 존재
