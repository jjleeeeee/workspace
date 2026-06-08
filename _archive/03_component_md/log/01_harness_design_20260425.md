# 컴포넌트 MD 검증 하네스 설계 로그

**최초 작성:** 2026-04-25  
**업데이트:** 2026-04-26  
**대상:** `components/{name}.md`  
**결정:** 컴포넌트 MD는 Stitch식 설명 + Implementation Contract 포맷만 canonical로 관리한다.

---

## 배경

초기 하네스는 Figma 원본의 variant, token, size를 컴포넌트 MD가 빠뜨리지 않았는지 확인하기 위해 만들었다. 이후 문서 방향이 “AI가 바로 구현 입력으로 쓸 수 있는 컴포넌트 계약 문서”로 정리되면서, 하네스도 현재 포맷만 검사하도록 단순화했다.

현재 `components/avatar.md`, `components/badge.md`, `components/button.md`가 canonical 문서다. 별도 버전 접미사 파일은 유지하지 않는다.

---

## 현재 디렉토리 구조

```text
harness/
├── eval.sh
├── criteria.md
├── fixtures/
│   ├── avatar/
│   │   ├── variants.json
│   │   ├── variants_rest.json
│   │   ├── sizes.json
│   │   └── tokens.json
│   ├── badge/
│   │   ├── variants.json
│   │   ├── variants_rest.json
│   │   ├── sizes.json
│   │   └── tokens.json
│   └── button/
│       ├── variants.json
│       ├── variants_rest.json
│       ├── sizes.json
│       └── tokens.json
└── tests/
    ├── check_design_sections.py
    ├── check_agent_guidance.py
    ├── check_contract_scope.py
    ├── check_variants.py
    ├── check_tokens.py
    ├── check_sizes.py
    └── check_sources.py
```

---

## eval.sh 동작 방식

```bash
bash harness/eval.sh components/avatar.md
bash harness/eval.sh components/badge.md
bash harness/eval.sh components/button.md
```

판정 흐름:

1. 컴포넌트 이름 산출: `components/avatar.md` → `avatar`
2. fixture 폴더 선택: `harness/fixtures/{component}`
3. Design Track 실행: section, agent guidance, contract scope
4. Contract Track 실행: variants, tokens, sizes, sources
5. SCORE 95점 이상이면 PASS

---

## 검사 항목

| 검사 | 기준 |
|---|---|
| `DESIGN_SECTIONS` | Stitch식 9개 섹션 존재 |
| `AGENT_GUIDANCE` | 사용 맥락, 시각 설명, 상태, Do/Don't, Prompt Guide 포함 |
| `CONTRACT_SCOPE` | Public API, Variant Constraints, Tokens, Layout, Accessibility 포함 |
| `VARIANTS` | Implementation Contract 안에 Figma axes/componentProps 반영 |
| `TOKENS` | Implementation Contract 안에 token fixture 반영 |
| `SIZES` | Implementation Contract 안에 size fixture 반영 |
| `SOURCES` | REST와 console 독립 소스 교차 검증 |

`variants`, `tokens`, `sizes`, `sources`는 문서 전체가 아니라 `## 9. Implementation Contract` 이후만 검사한다. 설명 영역에 우연히 나온 문자열로 통과하는 것을 막기 위해서다.

---

## Fixture 원칙

| fixture | 주요 소스 | 역할 |
|---|---|---|
| `variants.json` | figma-console 또는 Framelink metadata | Figma component set axes, componentProps, variantCount |
| `variants_rest.json` | Figma REST `/v1/files/{fileKey}/components` | 독립 소스 교차 검증 |
| `tokens.json` | Figma variables / extracted design context | 구현에 필요한 token name lock |
| `sizes.json` | Figma node/layout 확인 | image/touch px 계약 |

REST API는 미공개 variant를 누락할 수 있으므로 `check_sources.py`는 `REST ⊆ console`을 기준으로 삼는다. REST 값이 console에 없는 경우는 mismatch로 본다.

---

## 필수 문서 섹션

```md
# Component

## 1. Role & Usage
## 2. Visual Character
## 3. Anatomy
## 4. Component Styling
## 5. States & Interactions
## 6. Layout & Responsive Rules
## 7. Do's and Don'ts
## 8. Agent Prompt Guide
## 9. Implementation Contract
```

`Implementation Contract`에는 최소한 다음 하위 범위가 있어야 한다.

- Public API / Props
- Variant Constraints
- State Matrix
- Token Mapping
- Layout Contract
- Accessibility
- Figma Source Notes

---

## 현재 검증 결과

2026-04-26 기준 실행 결과:

| 문서 | 결과 |
|---|---|
| `components/avatar.md` | 100/100 PASS |
| `components/badge.md` | 100/100 PASS |
| `components/button.md` | 100/100 PASS |

---

## 운영 원칙

1. 새 컴포넌트는 `components/{name}.md`로 작성한다.
2. 작성 전에는 기존 동일 컴포넌트 문서와 fixture를 참고하지 않는다.
3. 작성 후에만 source-gap review와 harness loop를 수행한다.
4. fixture는 문서와 다른 소스에서 만든다.
5. 하네스 통과는 “문자열 계약 충족”이지 구현 품질 전체 보증은 아니다.
6. 코드 구현 전에는 `Implementation Contract`를 우선 입력으로 사용한다.

---

## 다음 개선 후보

| 후보 | 추천도 | 이유 |
|---|---:|---|
| fixture 생성 스크립트 표준화 | 중간 | 수동 JSON 작성/수정 비용 감소 |
| Usage Figma source를 fixture로 별도 저장 | 중간 | 사용 규칙 누락을 자동으로 더 잘 잡을 수 있음 |
