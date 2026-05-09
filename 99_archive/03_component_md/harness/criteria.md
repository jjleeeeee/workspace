# Component MD 하네스 합격 기준

> 이 파일은 사람이 정의한 기준입니다. 에이전트가 임의로 완화해서는 안 됩니다.

**업데이트:** 2026-04-27  
**대상:** `components/{name}.md`  
**문서 포맷:** YAML contract + Markdown guidance

---

## 기준 방향

이 프로젝트의 컴포넌트 MD는 `components/{name}.md`가 곧 구현 입력 문서다. 별도 버전 접미사 파일은 유지하지 않는다.

문서는 DESIGN.md 원칙을 따른다.

| Layer | 목적 |
|---|---|
| YAML contract | 기계가 믿는 source-of-truth. props, variants, states, tokens, layout, source fact를 담는다. |
| Markdown guidance | 사람과 AI가 읽는 판단층. 사용 맥락, 시각 성격, 오용 방지, 생성 프롬프트를 담는다. |

YAML과 본문이 충돌하면 YAML이 이긴다. 본문은 계약값을 길게 반복하지 않고 이유와 사용 판단을 설명한다.

---

## 자동 검사 기준

| 검사 | 합격 기준 | 근거 |
|---|---|---|
| `DESIGN_SECTIONS` | YAML frontmatter + 필수 본문 섹션 8/8 존재 | 이중 구조 보장 |
| `AGENT_GUIDANCE` | 사용 맥락, 시각 설명, 상태, Do/Don't, Prompt Guide 포함 | AI 구현 지시 품질 하한선 |
| `CONTRACT_SCOPE` | YAML에 component, source, props, variants, states, tokens, layout, accessibility, rules 포함 | 코드 구현 계약 최소 범위 |
| `VARIANTS` | YAML contract에 fixture axes/componentProps 100% 등장 | 구현 API/variant 누락 방지 |
| `TOKENS` | YAML contract에 fixture token name 100% 등장 | token 기반 구현 유도 |
| `SIZES` | YAML contract에 fixture image/touch px값 100% 일치 | layout contract 정확도 |
| `SOURCES` | REST fixture가 console fixture의 부분집합이고 YAML contract에 등장 | Figma source 교차 검증 |

`VARIANTS`, `TOKENS`, `SIZES`, `SOURCES`는 Markdown 본문이 아니라 YAML frontmatter만 검사한다. 설명 영역에 우연히 나온 문자열로 통과하는 것을 막기 위해서다.

---

## 필수 구조

```md
---
component:
source:
props:
variants:
states:
tokens:
layout:
accessibility:
rules:
notes:
---

# Component

## 1. 역할과 사용
## 2. 시각적 성격
## 3. 구조
## 4. 컴포넌트 스타일링
## 5. 상태와 인터랙션
## 6. 레이아웃과 반응형 규칙
## 7. 권장/금지
## 8. 에이전트 프롬프트 가이드
```

YAML contract에는 최소한 다음 범위가 포함되어야 한다.

- component metadata
- Figma source metadata
- Public API / props
- Variant axes, counts, constraints
- State behavior
- Token mapping
- Layout sizes, spacing, radius, responsive rules
- Accessibility contract
- Do/Don't rules
- Source gaps, deprecated notes

---

## Fixture 기준

| 파일 | 기준 |
|---|---|
| `variants.json` | Figma component set axes, componentProps, variantCount의 기준 source |
| `variants_rest.json` | Figma REST API에서 얻은 독립 교차 검증 source |
| `tokens.json` | 구현에 필요한 token name lock |
| `sizes.json` | image/touch px contract lock |

`variants_rest.json`은 `variants.json`의 부분집합일 수 있다. Figma REST API가 미공개 variant를 누락할 수 있기 때문이다. 단, REST에만 존재하는 axis value는 mismatch로 본다.

---

## 최종 판정 기준

| 판정 | 기준 |
|---|---|
| PASS | 전체 check 기준 SCORE 95점 이상 |
| FAIL | SCORE 95점 미만 |

하네스 통과는 “문서가 구현에 필요한 최소 계약을 포함한다”는 뜻이다. 문서의 모든 의미 품질, 실제 컴포넌트 코드 품질, 시각적 완성도를 보장하지는 않는다.

---

## 수동 검토 항목

자동 하네스가 대신 판단하지 못하는 항목:

- Figma Usage 문서의 핵심 규칙이 Markdown guidance에 반영됐는가
- Do/Don't가 실제 제품 오용을 막는가
- State 설명이 코드 동작과 접근성으로 이어지는가
- Public API가 실제 구현 라이브러리의 관례와 맞는가
- Token fallback 값이 token 우선 원칙을 흐리지 않는가
- YAML과 본문이 충돌하지 않는가

---

## 현재 권장 운영

새 컴포넌트는 `components/{name}.md`를 canonical input으로 만든다. Usage source가 있는 컴포넌트는 해당 rule을 본문에 직접 반영하고, source fact는 YAML `source`와 `notes.source_gaps`에 남긴다.

추천안은 YAML contract를 단일 source-of-truth로 유지하는 방식이다. 트레이드오프는 기존 문서를 새 구조로 마이그레이션해야 한다는 점이다. 대안은 Markdown 계약 섹션을 mirror로 남기는 방식인데, 중복과 충돌 가능성이 커진다.
