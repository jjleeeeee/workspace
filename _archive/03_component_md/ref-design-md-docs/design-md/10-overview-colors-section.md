# Overview · Colors 섹션

브랜드 톤 + 색 팔레트 — 가장 먼저 쓰는 두 섹션

## Overview — 브랜드 톤을 말로 적어두는 자리

> **L99** This section is a holistic description of a product's look and feel. It defines the brand personality, target audience, and the emotional response the UI should evoke, such as whether it should feel playful or professional, dense or spacious.

**한국어:** Overview 섹션은 제품의 전체적인 분위기를 글로 묘사하는 자리예요. 브랜드 성격(playful vs professional), 주 사용자, UI가 주는 감정(dense = 밀도 높은 vs spacious = 여유 있는) 같은 축을 적어둬요.

이 섹션은 토큰이 없어요. 글만 있어요. 수치로 표현할 수 없는 "느낌"을 담는 자리라서요. AI가 구체 규칙이 없을 때 이 글을 근거로 방향을 잡아요. 예: 구체적인 radius 토큰이 없어도 Overview에 "건축적 단정함"이라고 적혀 있으면 AI는 작은 radius(4px 근처)를 택할 거예요.

## Colors — 필수는 primary 하나뿐

> **L105** At least the primary color palette must be defined, and additional color palettes may be defined as needed.

**한국어:** 색 섹션에서 꼭 정의해야 하는 건 `primary` 하나예요. 다른 팔레트(`secondary` 등)는 필요에 따라 추가로 정의해요.

"primary가 없으면?" 검사 도구가 `missing-primary` 경고를 내요(에러는 아님 — AI가 다른 색에서 추측해 채워 주거든요).

## 관습적인 4개 역할

**primary**  
주요 액션·강조. 제일 중요한 버튼, 주요 링크에.

**secondary**  
보조 액션·정보·내비게이션 강조에.

**tertiary**  
장식·특별 카테고리·배지에.

**neutral**  
배경·경계선·부가 텍스트에. 채도 낮은 색.

추가로 자주 쓰는 이름: `surface`(카드 배경), `on-surface`(카드 위 텍스트 색), `error`(에러 상태).

## 본문에 hex를 또 쓰는 관행

```markdown
- **Primary (#1A1C1E):** 헤드라인·본문에 쓰는 깊은 먹색.
- **Tertiary (#B8422E):** 선명한 흙빛 빨강. 주요 액션과 강조에만.
```

본문에도 `(#1A1C1E)`를 괄호로 박아둬요. 왜? AI가 "깊은 먹색 = primary = #1A1C1E"를 한눈에 매칭할 수 있게. 이 작은 중복이 AI 생성 품질을 크게 올려요.

## 대응하는 YAML 토큰

```yaml
colors:
  primary: "#1A1C1E"
  secondary: "#6C7278"
  tertiary: "#B8422E"
  neutral: "#F7F5F2"
```

## 핵심 인사이트

Overview는 "토큰이 닿지 않는 감성 질문"에 답을 주는 유일한 섹션이에요. "캐주얼하게? 고급스럽게?"처럼 숫자로 안 잡히는 방향을 여기에 적어둬요. Colors는 본문·토큰 둘 다에 hex를 노출해서 AI가 별명·공식 이름·실제 값을 쉽게 연결하도록 하고요.

## 체크리스트

- Overview에 토큰이 없는 이유를 설명할 수 있다
- Colors 섹션에서 `primary`만 필수인 이유를 안다
- 관습적 4개 역할(`primary`·`secondary`·`tertiary`·`neutral`)의 쓰임새를 구분한다
- 본문 설명에도 hex를 같이 적는 관행의 의도를 이해한다
