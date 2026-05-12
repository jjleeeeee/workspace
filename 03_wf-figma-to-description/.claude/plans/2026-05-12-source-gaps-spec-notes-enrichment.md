# Source Gaps & Spec Notes Enrichment — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 23개 컴포넌트의 모든 source_gaps를 resolve 또는 confirmed 처리하고, spec_notes를 컴포넌트당 2개 이상으로 보강한다.

**Architecture:** 컴포넌트별 순차 루프 — 현재 YAML 읽기 → Figma 라이브 읽기 → gap 해소/확인 → spec_notes 보강 → validator 통과 → 커밋. 부모 에이전트가 Figma MCP를 직렬로 소유하며, 서브에이전트는 로컬 파일 작업만 수행.

**Tech Stack:** Figma MCP (Framelink + figma-console), YAML, Node.js validator (`tools/validate-component-description.mjs`), Python enrich scripts (`scripts/enrich_tokens.py`, `scripts/enrich_typography.py`)

---

## 표준 컴포넌트 처리 절차 (Per-Component Procedure)

모든 Task에서 아래 절차를 동일하게 따른다.

- [ ] **P1. 현재 YAML 읽기**

```bash
cat _workspace/outputs/draft-descriptions/<component>.description.yaml
```

- [ ] **P2. Validator 베이스라인 실행**

```bash
node tools/validate-component-description.mjs _workspace/outputs/draft-descriptions/<component>.description.yaml
```

현재 상태 확인. 오류가 있으면 먼저 기록해 둔다.

- [ ] **P3. Figma 라이브 읽기 (부모 에이전트만)**

`refs/figma-component-keys/index.md`에서 해당 컴포넌트의 nodeId / fileKey 확인 후 Framelink MCP로 컴포넌트 데이터 읽기. 토큰 바인딩이 필요한 경우 figma-console MCP로 추가 읽기.

- [ ] **P4. Source gaps 처리**

각 gap 항목마다:
- Figma 데이터로 값 확인 가능 → 해당 필드 채우고 gap 항목 제거
- Figma 데이터로도 확인 불가 → gap 항목에 `confirmed: true` 와 `reason: <이유>` 추가

- [ ] **P5. Spec notes 보강**

현재 spec_notes 수 확인. 2개 미만이면 아래 중 해당하는 항목으로 보강:
- 사용 시 주의사항 (접근성, 다크모드, 반응형)
- 중첩 컴포넌트 위임 관계
- 런타임 동작 vs Figma 고정값 차이
- 예외 케이스 (특정 variant에서만 나타나는 동작)

- [ ] **P6. Validator 재실행 (반드시 통과)**

```bash
node tools/validate-component-description.mjs _workspace/outputs/draft-descriptions/<component>.description.yaml
```

통과하지 못하면 YAML 수정 후 재실행. 진행하지 않는다.

- [ ] **P7. Enrich 스크립트 실행 (토큰/타이포 필드 변경 시)**

```bash
python scripts/enrich_tokens.py _workspace/outputs/draft-descriptions/<component>.description.yaml
python scripts/enrich_typography.py _workspace/outputs/draft-descriptions/<component>.description.yaml
```

- [ ] **P8. 커밋**

```bash
git add _workspace/outputs/draft-descriptions/<component>.description.yaml
git commit -m "feat(desc): enrich <component> — gaps + spec_notes"
```

- [ ] **P9. History 기록 (결정·정책 변경 시)**

`_workspace/reviews/history/figma-description-history.md` 맨 아래에 추가:
```
## YYYY-MM-DD — <component>
- <변경 내용 및 이유>
```

---

## Exit 조건

아래 두 조건을 모두 충족하면 완료:
1. 모든 대상 컴포넌트의 `source_gaps`가 비어 있거나, 남은 gap 전부 `confirmed: true + reason` 명시
2. 모든 대상 컴포넌트의 `spec_notes` ≥ 2개

---

## Task 0: 플랜 파일 저장 ✅ (완료 — plan/ → .claude/plans/ 하네스 마이그레이션으로 처리됨)

---

## Priority 1 — Gap 있음 + spec_notes 0개

### Task 1: tag

**Files:** `_workspace/outputs/draft-descriptions/tag.description.yaml`

**Known gaps:**
- Nested icon null vectors (아이콘 벡터가 null로 표시되는 이유 불명)
- label prop sourcing (label prop이 텍스트 토큰으로 바인딩되는지 불명)

**Known thin notes:** 0개

표준 절차 P1~P9 적용. Figma에서 Tag 컴포넌트의 icon slot과 label text node 바인딩 확인에 집중.

---

### Task 2: tooltip

**Files:** `_workspace/outputs/draft-descriptions/tooltip.description.yaml`

**Known gaps:**
- Hidden guide rectangles (레이아웃 가이드용 사각형이 Figma에 숨겨져 있음, 목적 불명)

**Known thin notes:** 0개

표준 절차 P1~P9 적용. Figma에서 tooltip의 숨겨진 레이어 구조 확인. 가이드 rect가 디자인 전용이면 `confirmed: true, reason: design-only guide layer, no runtime equivalent`로 처리.

---

## Priority 2 — Gap 2~3개

### Task 3: loading-circular

**Files:** `_workspace/outputs/draft-descriptions/loading-circular.description.yaml`

**Known gaps:**
- Lottie animation asset key missing (에셋 키 미확인)
- Motion timing (애니메이션 타이밍 값 미확인)

표준 절차 P1~P9 적용. Figma에서 Lottie 플러그인 메타데이터 확인 시도. 에셋 키가 Figma에 없으면 `confirmed: true, reason: Lottie asset stored outside Figma file, requires separate asset registry`로 처리.

---

### Task 4: loading-dot

**Files:** `_workspace/outputs/draft-descriptions/loading-dot.description.yaml`

**Known gaps:**
- Lottie animation asset key missing

표준 절차 P1~P9 적용. Task 3과 동일한 Lottie 처리 패턴 적용.

---

### Task 5: snackbar

**Files:** `_workspace/outputs/draft-descriptions/snackbar.description.yaml`

**Known gaps:**
- Action properties not exposed (action 버튼 prop이 컴포넌트 프로퍼티로 노출 안 됨)
- Responsive layout gap (Figma 고정 폭 vs 런타임 반응형)

표준 절차 P1~P9 적용. action prop 노출 여부 Figma에서 직접 확인. 반응형 gap은 런타임 동작이므로 `confirmed: true, reason: runtime behavior, not expressible in static Figma`로 처리.

---

### Task 6: toast

**Files:** `_workspace/outputs/draft-descriptions/toast.description.yaml`

**Known gaps:**
- Hidden checkbox/icon internals (숨겨진 자식 레이어)
- Responsive layout gap

표준 절차 P1~P9 적용. 숨겨진 레이어 목적 확인. 반응형 gap은 snackbar와 동일 패턴.

---

### Task 7: title-header

**Files:** `_workspace/outputs/draft-descriptions/title-header.description.yaml`

**Known gaps:**
- Membership gradient internals (그라디언트 구현 세부 정보)
- Fixed subtitle tokens (서브타이틀 토큰 바인딩 불명)
- Slot content (슬롯 허용 콘텐츠 범위 불명)

표준 절차 P1~P9 적용. Figma에서 gradient fill 데이터와 subtitle text 노드 토큰 바인딩 직접 읽기. Slot은 Figma boolean/variant prop으로 정의된 경우 확인.

---

### Task 8: text-fields

**Files:** `_workspace/outputs/draft-descriptions/text-fields.description.yaml`

**Known gaps:**
- Nested Input controls delegated (Input 컴포넌트 내부를 설명에 포함하지 않음 — 정책적 결정)
- Guide Message variant structure 불명

표준 절차 P1~P9 적용. Input 위임은 `confirmed: true, reason: nested component — see input.description.yaml`로 처리. Guide Message variant Figma에서 직접 확인.

---

### Task 9: pagination-dot-v2

**Files:** `_workspace/outputs/draft-descriptions/pagination-dot-v2.description.yaml`

**Known gaps:**
- Fixed mode token naming ambiguity
- Unbound padding

표준 절차 P1~P9 적용. Figma에서 fixed mode variant의 토큰 바인딩 이름 직접 읽기. 패딩이 하드코딩이면 값을 명시하고 gap 제거.

---

### Task 10: skeleton

**Files:** `_workspace/outputs/draft-descriptions/skeleton.description.yaml`

**Known gaps:**
- Circle radius token unbound
- No usage guidance ref

표준 절차 P1~P9 적용. Figma에서 circle variant의 border-radius 토큰 바인딩 확인. usage guidance가 없으면 spec_notes에 직접 서술.

---

### Task 11: avatar-group

**Files:** `_workspace/outputs/draft-descriptions/avatar-group.description.yaml`

**Known gaps:**
- Squircle variant coverage (일부 alignment에서 미구현)
- Live Tag visibility

표준 절차 P1~P9 적용. Figma에서 Squircle × alignment 조합 variant 전체 확인. 미구현 조합이 있으면 `spec_notes`에 제약으로 기록.

---

### Task 12: dropdown-box

**Files:** `_workspace/outputs/draft-descriptions/dropdown-box.description.yaml`

**Known gaps:**
- Icon component set key
- Nested List_Item internals

표준 절차 P1~P9 적용. Figma에서 icon slot의 컴포넌트 키 확인. List_Item 내부는 정책상 위임 처리: `confirmed: true, reason: delegated to list-item-web.description.yaml`.

---

### Task 13: search

**Files:** `_workspace/outputs/draft-descriptions/search.description.yaml`

**Known gaps:**
- Legacy markdown description 미제거 흔적
- Icon component key

표준 절차 P1~P9 적용. YAML 내 legacy 잔재 정리. icon key Figma에서 직접 확인.

---

## Priority 3 — Gap 1개

### Task 14: thumbnail

**Files:** `_workspace/outputs/draft-descriptions/thumbnail.description.yaml`

**Known gaps:**
- Optional overlay icon asset sourcing

표준 절차 P1~P9 적용.

---

### Task 15: icon-button

**Files:** `_workspace/outputs/draft-descriptions/icon-button.description.yaml`

**Known gaps:**
- icon_area size discrepancy (markitdown: 24×24, Figma live: 20×20)

표준 절차 P1~P9 적용. Figma에서 실제 icon_area 크기를 직접 측정해 어느 값이 맞는지 확정.

---

### Task 16: avatar

**Files:** `_workspace/outputs/draft-descriptions/avatar.description.yaml`

**Known gaps:**
- Nested atoms detail level (어느 수준까지 nested atom을 설명해야 하는지)

표준 절차 P1~P9 적용. 정책 결정: 정책이 "nested atom은 composition.uses에만 기록"이면 `confirmed: true, reason: policy — nested atoms referenced via composition.uses only`.

---

### Task 17: bottom-navigation

**Files:** `_workspace/outputs/draft-descriptions/bottom-navigation.description.yaml`

**Known gaps:**
- Hidden badge visual (badge가 Figma에서 boolean으로 숨겨진 경우)

표준 절차 P1~P9 적용. Figma에서 badge boolean prop 직접 확인.

---

### Task 18: list-item-native

**Files:** `_workspace/outputs/draft-descriptions/list-item-native.description.yaml`

**Known gaps:**
- No matching markitdown usage ref

표준 절차 P1~P9 적용. markitdown ref가 없음은 `confirmed: true, reason: no markitdown reference file exists for this component`로 처리.

---

### Task 19: list-item-web

**Files:** `_workspace/outputs/draft-descriptions/list-item-web.description.yaml`

**Known gaps:**
- No matching markitdown usage ref

Task 18과 동일 처리.

---

## Priority 4 — Spec Notes만 얇음 (gaps 없음)

### Task 20: toggle-switch

**Files:** `_workspace/outputs/draft-descriptions/toggle-switch.description.yaml`

**Known thin notes:** 0개. gaps 없음.

P1~P2, P5, P6, P8 적용 (Figma 읽기 최소화). spec_notes에 추가할 내용:
- 접근성: checked/unchecked 상태 aria-checked 연동
- 애니메이션: thumb 이동 transition (Figma 고정 vs 런타임 easing)

---

### Task 21: badge-dot

**Files:** `_workspace/outputs/draft-descriptions/badge-dot.description.yaml`

P1~P2, P5, P6, P8 적용. spec_notes 보강: 사용 맥락 (언제 badge-dot vs badge-number를 선택하는지).

---

### Task 22: badge-number

**Files:** `_workspace/outputs/draft-descriptions/badge-number.description.yaml`

P1~P2, P5, P6, P8 적용. spec_notes 보강: 숫자 자릿수에 따른 크기 변화 동작.

---

### Task 23: checkbox

**Files:** `_workspace/outputs/draft-descriptions/checkbox.description.yaml`

P1~P2, P5, P6, P8 적용. spec_notes 보강: indeterminate 상태 처리, 그룹 내 사용 패턴.

---

### Task 24: radio

**Files:** `_workspace/outputs/draft-descriptions/radio.description.yaml`

P1~P2, P5, P6, P8 적용. spec_notes 보강: radio group 내 단독 사용 금지, 최소 2개 선택지 원칙.

---

### Task 25: scrim-overlay

**Files:** `_workspace/outputs/draft-descriptions/scrim-overlay.description.yaml`

P1~P2, P5, P6, P8 적용. spec_notes 보강: z-index 레이어링, 모달/드로어와의 조합 패턴.

---

### Task 26: scrollbar

**Files:** `_workspace/outputs/draft-descriptions/scrollbar.description.yaml`

P1~P2, P5, P6, P8 적용. spec_notes 보강: 자동 숨김 동작 (스크롤 중에만 표시), overflow 컨테이너와의 연동.

---

### Task 27: text-button

**Files:** `_workspace/outputs/draft-descriptions/text-button.description.yaml`

P1~P2, P5, P6, P8 적용. spec_notes 보강: icon-button과의 사용 기준 차이, 최소 터치 영역.

---

## Verification (전체 완료 확인)

모든 Task 완료 후:

```bash
# 모든 YAML validator 일괄 실행
for f in _workspace/outputs/draft-descriptions/*.description.yaml; do
  echo "=== $f ===" && node tools/validate-component-description.mjs "$f"
done
```

모든 파일 통과 확인. 통과 못한 파일은 해당 Task로 돌아가 수정.

```bash
# source_gaps 잔존 확인
grep -l "source_gaps:" _workspace/outputs/draft-descriptions/*.description.yaml | xargs grep -A5 "source_gaps:" | grep -v "confirmed: true" | grep "  -"
```

출력이 없으면 미처리 gap 없음 — 완료.
