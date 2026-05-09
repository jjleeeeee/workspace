# Codex 워크플로우 vs 기존 워크플로우 — Chips 비교 실험

## Context

`chips.md`는 `component-md-extract` 스킬(Claude 단독)로 이미 생성되어 있다. 이번 실험 목표는 `08_codex_workflow_simulation_20260426.md`에 정의된 **Claude + Codex 분업 워크플로우**를 실제 적용해 `chips_codex.md`를 새로 생성하고, 두 문서의 품질을 비교하는 것이다.

비교 관점: 섹션 완성도, Contract 정확도(토큰/픽셀값), 하네스 점수, 작성 방식 차이.

---

## 전제 — 이미 확보된 Fixtures

Chips fixtures는 이미 생성되어 있으므로 Figma 재호출 불필요.

| 파일 | 내용 |
|------|------|
| `harness/fixtures/chips/variants.json` | figma-console 기반, 100개 변형, Boolean props 포함 |
| `harness/fixtures/chips/variants_rest.json` | REST 독립 검증용 |
| `harness/fixtures/chips/tokens.json` | 16개 컬러 토큰 (Default/Fixed 각 8개) |
| `harness/fixtures/chips/sizes.json` | Small=32px, Medium=36px |
| `components/chips.md` | 기존 Claude 단독 생성 문서 (비교 기준) |

---

## 실행 계획

### Step 1 — Claude: Stitch 섹션(1~8) 초안 작성

fixtures만 참조해 판단이 필요한 섹션을 작성한다. Figma MCP 재호출 없이 진행.

작성 대상:
- `## 1. Role & Usage`
- `## 2. Visual Character`
- `## 3. Anatomy`
- `## 4. Component Styling`
- `## 5. States & Interactions`
- `## 6. Layout & Responsive Rules`
- `## 7. Do's and Don'ts`
- `## 8. Agent Prompt Guide`

출력: `components/chips_codex.md` (Stitch만 채워진 상태)

### Step 2 — Codex: Contract 섹션(9) 생성

Claude Code 내에서 `/codex:rescue`로 위임:

```
harness/fixtures/chips/variants.json, tokens.json, sizes.json을 읽고
components/TEMPLATE.md의 Contract 섹션 형식에 맞춰
Chips의 다음 섹션을 작성해줘:

1. Public API / Props 테이블 (Mode, Size, Type, State, Radius, Marquee, Badge, Badge_Number)
2. Variant Constraints 표 (axes + variantCount 교차 검증)
3. State Matrix (State × 배경/텍스트/아웃라인 × Default/Fixed 모드)
4. Token Mapping (Role × Default token × Fixed token — 16개 토큰 전부)
5. Layout Contract (Size × Height/Touch/PaddingH/Gap/BorderRadius ON/OFF)
6. Accessibility 항목
7. Figma Source Notes

참고 형식: components/checkbox.md의 ## 9. Implementation Contract 섹션
출력: components/chips_codex.md의 ## 9. Implementation Contract 섹션으로 append
```

### Step 3 — Claude: 병합 + 검토

- Codex 결과를 chips_codex.md에 병합
- Token 16개 / Size 픽셀값 / Variant count 사실값 교차 확인
- Stitch 품질 검토 (기존 chips.md와 표현 비교)

### Step 4 — 하네스 검증

```bash
bash harness/eval.sh components/chips_codex.md
```

목표: 6/6 PASS, 100/100

실패 시 → Codex에 실패 항목 전달해 픽스 위임 (최대 2회)

### Step 5 — 비교 분석

두 문서를 아래 기준으로 비교해 결과를 `log/09_chips_codex_comparison_20260426.md`에 기록한다.

| 비교 항목 | chips.md | chips_codex.md |
|-----------|----------|----------------|
| 하네스 점수 | ? | ? |
| Token 정확도 | ? | ? |
| Stitch 서술 품질 | ? | ? |
| Contract 완성도 | ? | ? |
| 총 작업 흐름 | Claude 단독 | Claude + Codex 분업 |

---

## 핵심 파일

| 파일 | 역할 |
|------|------|
| `components/chips.md` | 비교 기준 (Claude 단독) |
| `components/chips_codex.md` | 새로 생성할 비교 대상 |
| `harness/fixtures/chips/*.json` | 사실값 소스 |
| `components/TEMPLATE.md` | 섹션 구조 참고 |
| `components/checkbox.md` | Contract 형식 참고 |
| `harness/eval.sh` | 검증 스크립트 |
| `log/09_chips_codex_comparison_20260426.md` | 비교 결과 기록 |

---

## 검증 방법

1. `bash harness/eval.sh components/chips_codex.md` → 6/6 PASS
2. Token 16개가 chips_codex.md에 모두 등장하는지 확인
3. Size 픽셀값(32/36)이 sizes.json과 일치하는지 확인
4. chips.md vs chips_codex.md 섹션별 비교 후 log 작성
