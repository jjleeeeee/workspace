# Component MD 현재 방향 로그

**날짜:** 2026-04-25  
**업데이트:** 2026-04-26  
**결정:** `components/{name}.md`를 Stitch식 설명 + Implementation Contract 문서로 관리한다.

---

## 배경

기존 컴포넌트 MD는 Figma variant, token, size 누락을 잡는 데는 효과적이었다. 하지만 문서가 Figma 추출 요약표에 가까워서 AI가 화면이나 코드 컴포넌트를 만들 때 필요한 맥락이 부족했다.

현재 문서의 목표는 다음을 함께 제공하는 것이다.

- 컴포넌트가 어떤 상황에서 쓰이는지
- 시각적 톤과 사용 가이드가 충분한지
- 실제 구현 API와 variant 제약이 명확한지
- 접근성, 상태, layout contract가 코드로 옮기기 충분한지

---

## 문서 구조

각 컴포넌트 문서는 AI 생성 친화적인 Stitch식 설명과 Figma 사실 검증 가능한 구현 계약을 함께 가진다.

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

### Stitch식 설명 영역

- Role & Usage: 언제 쓰고 언제 쓰지 않는지
- Visual Character: 시각적 인상, 밀도, 강조 수준
- Anatomy: root, label, icon slot, badge, ring 등 실제 파트
- Styling/States/Layout: 화면 생성과 구현에 필요한 감각과 규칙
- Do's and Don'ts: AI가 흔히 저지르는 오용 방지
- Agent Prompt Guide: 재사용 가능한 생성 지시문

### Implementation Contract 영역

- Public API / Props
- Variant Constraints
- State Matrix
- Token Mapping
- Layout Contract
- Accessibility
- Figma Source Notes

이 영역은 fact 하네스가 읽는 기준 영역이다. variant/token/size/source 검증은 `## 9. Implementation Contract` 이후 내용에 대해서만 수행한다.

---

## 하네스 설계

하네스는 2트랙으로 동작한다.

| Track | 목적 | 검사 |
|---|---|---|
| Design Track | Stitch식 AI-readable 품질 | 필수 섹션, 사용 맥락, 시각 설명, Do/Don't, Prompt Guide |
| Contract Track | Figma 사실 검증 | variants, tokens, sizes, REST source 교차 검증 |

`eval.sh`는 `components/{name}.md`를 입력으로 받고, fixture는 `harness/fixtures/{name}/`를 사용한다.

---

## Source Isolation 규칙

컴포넌트 재추출 실험에서는 기존 동일 컴포넌트 문서와 fixture를 작성 전 참고하지 않는다.

- 작성 입력: 사용자가 넘기는 Figma URL에서 새로 추출한 데이터
- 작성 후 허용: source-gap review, regression risk 확인, harness loop
- 이유: 기존 요약본의 구조적 한계를 새 문서가 그대로 복제하는 것을 방지

---

## 순차 실행 기준

1. 사용자가 제공한 Figma URL만으로 `components/{name}.md` 생성
2. 독립 fixture 생성: variants, tokens, sizes, REST source
3. `bash harness/eval.sh components/{name}.md` 검증 루프 실행
4. Usage Figma가 있으면 사용 규칙을 설명 섹션과 source notes에 반영
5. `skills/component-md-extract/SKILL.md`를 canonical workflow로 유지

---

## 성공 기준

- `components/avatar.md`, `components/badge.md`, `components/button.md`가 모두 하네스 PASS
- 각 문서는 Design Track과 Contract Track 모두 PASS
- 새 스킬은 Claude와 Codex 모두 같은 절차를 따를 수 있음
- 문서는 화면 생성용 설명과 코드 구현용 계약을 분리해 읽을 수 있음
