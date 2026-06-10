---
component:
  name: "{ComponentName}"
  description: "{한 줄 설명 — 컴포넌트의 핵심 역할과 주요 사용 맥락}"
  status: draft
  version: "1.0"
source:
  figma_file: "{Figma file name}"
  file_key: "{fileKey}"
  component_set:
    name: "{component set name}"
    node_id: "{nodeId}"
    key: "{componentSetKey}"
  usage_source:
    file_key: "{usageFileKey}"
    node_id: "{usageNodeId}"
props:
  "{PropName}":
    type: "{type}"
    default: "{default}"
    description: "{설명}"
    required: false
variants:
  axes:
    "{AxisName}":
      - "{value1}"
      - "{value2}"
  count:
    figma_console: "{n}"
    figma_rest: "{n}"
  constraints:
    - "{허용/불가 조합 또는 정규화 규칙}"
states:
  "{StateName}":
    applies_to: "{scope}"
    behavior: "{동작 설명}"
tokens:
  "{RoleName}":
    default: "system/color/{path}"
    fixed: "system/fixed_color/{path}"
    fallback: "{observed fallback value}"
layout:
  sizes:
    - name: "{SizeName}"
      image: "{n}px"
      touch: "{n}px"
  spacing:
    - role: "{spacing role}"
      value: "{n}px"
  radius:
    - role: "{radius role}"
      token: "system/size/radius/{path}"
  responsive_rules:
    - "{반응형/반복 패턴 규칙}"
accessibility:
  role: "{ARIA role 또는 native element}"
  label: "{접근성 레이블 처리 방법}"
  keyboard: "{키보드 동작}"
  aria: "{aria 속성 처리}"
  contrast: "WCAG AA (4.5:1) 이상 유지"
rules:
  do:
    - "{올바른 사용 예시}"
    - "{올바른 사용 예시}"
  dont:
    - "{잘못된 사용 예시}"
    - "{잘못된 사용 예시}"
notes:
  source_gaps:
    - "{Figma/REST/Usage source 간 차이 또는 누락}"
  deprecated:
    - "{deprecated prop/value가 있을 때만 작성}"
---

# {ComponentName}

> {한 줄 설명 — component.description과 같은 의미를 자연어로 반복해도 됨}

---

<!--
## TEMPLATE 사용 가이드

이 파일은 Chord Design System 컴포넌트 MD의 공통 구조 템플릿이다.
DESIGN.md 원칙처럼 상단 YAML은 기계가 믿는 계약층, 본문 Markdown은 사람과 AI가 읽는 판단층이다.

### 작성 원칙

- YAML: Figma source, props, variants, states, tokens, layout, accessibility, rules의 사실값.
- Markdown: 언제/왜/어떻게 쓸지에 대한 설명과 구현 판단.
- 충돌 시 YAML이 이긴다. 본문은 계약값을 길게 중복하지 않는다.
- hex 또는 px fallback은 관찰값 메모로만 남기고, 구현 기준은 token/source 값을 우선한다.

### 필수/선택 기준

- 모든 컴포넌트는 YAML frontmatter와 1–8번 본문 섹션을 가진다.
- Usage source가 없으면 usage_source는 비워두고 notes.source_gaps에 이유를 적는다.
- sizes가 정확히 없으면 layout.sizes를 비워두고 notes.source_gaps에 기록한다.
-->

---

## 1. 역할과 사용

<!--
- 언제 써야 하는지, 언제 쓰지 말아야 하는지.
- 비슷한 컴포넌트(Badge vs Tag, Button vs Link 등)와의 차이.
- 타입(Circle/Squircle, Filled/Outlined 등)을 고르는 기준.
- 같은 맥락에서 혼용하면 안 되는 일관성 규칙.
-->

{컴포넌트가 무엇을 대표하며 어떤 상황에서 사용하는지 서술.}

{타입 선택 기준을 서술.}

{쓰지 말아야 하는 경우를 서술.}

---

## 2. 시각적 성격

<!--
- 시각적 인상: compact/airy, flat/elevated, minimal/expressive 등.
- 강조 수준: 레이아웃에서 얼마나 주목을 받아야 하는지.
- 시각적 중심: 이미지/텍스트/아이콘 중 무엇이 지배적인지.
- 데코레이션이 있다면 데코레이션과 주 콘텐츠의 관계.
-->

{시각적 인상과 밀도를 서술.}

{강조 수준과 레이아웃 내 역할을 서술.}

---

## 3. 구조

<!--
- root: 크기·위치·터치 영역을 소유하는 래퍼.
- 주요 파트: 텍스트, 아이콘 슬롯, 이미지, 배지 등.
- 선택적 파트: 있을 때만 나타나는 파트.
- 파트 구성은 props로 제어해야 하며 소비자가 직접 조합하지 않도록 설명.
-->

핵심 파트:

- `root`: {래퍼 역할 설명}
- `{part}`: {파트 설명}
- `{optional part}` *(optional)*: {선택적 파트 설명}

---

## 4. 컴포넌트 스타일링

<!--
- 타입별(Filled, Outlined, Ghost 등) 시각적 차이와 색상 처리.
- 이미지/아이콘 클리핑 방식이 있다면 서술.
- 토큰 레이어 사용 방침: 하드코딩 금지, semantic token 사용.
- 크기/타입에 따라 달라지는 스타일 규칙.
-->

{타입별 스타일 특성 서술.}

{토큰 기반 색상 처리 방침 서술.}

---

## 5. 상태와 인터랙션

<!--
- 인터랙션 상태: Default / Hover / Focus / Pressed / Disabled / Loading.
- 데코레이션 상태: Ring, Badge, Emoji 등 Boolean 파트 상태.
- presentational 컴포넌트면 부모 컨트롤이 인터랙션을 소유한다고 명시.
- 접근성 관련 상태 처리(aria-busy, aria-disabled 등)를 간략히 언급.
-->

{상태 목록과 각 상태의 의미 서술.}

{상태 조합 금지 사항 또는 주의사항 서술.}

---

## 6. 레이아웃과 반응형 규칙

<!--
- 크기 선택 기준: 레이아웃 밀도 기반으로 사이즈를 고르는 방법.
- 반응형 처리: fluid stretch 허용 여부, 고정 크기인지.
- 내부 정렬: 세로 중앙, 가로 채우기 등.
- 반복 패턴 일관성: 리스트/그룹 안에서 혼용 금지 규칙.
-->

{크기 선택 기준 서술.}

{반응형 처리 방식 서술.}

{반복 패턴에서의 일관성 규칙 서술.}

---

## 7. 권장/금지

<!--
- Do: AI와 개발자가 올바르게 써야 하는 핵심 규칙.
- Don't: 흔한 오용 패턴과 그 이유.
- 컴포넌트의 디자인 의도를 깨는 사용 방식을 구체적으로 명시.
-->

DO:

- {올바른 사용 예시}
- {올바른 사용 예시}

DON'T:

- {잘못된 사용 예시}
- {잘못된 사용 예시}

---

## 8. 에이전트 프롬프트 가이드

<!--
- 이 컴포넌트를 생성하도록 AI에게 지시할 때 쓰는 재사용 가능한 문장.
- 핵심 제약(타입 선택 기준, 크기 규칙, 토큰 사용 등)을 직접 지시문으로 서술.
- 문체: "Use {ComponentName} when …", "Always …", "Never …"
-->

Use `{ComponentName}` when {사용 조건}.

Always {핵심 제약}.

Never {금지 사항}.

Generate `{ComponentName}` layouts with {배치 규칙}.
