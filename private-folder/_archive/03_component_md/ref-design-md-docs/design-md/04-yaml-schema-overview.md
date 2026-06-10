# YAML 스키마 한눈에 보기

최상위 키 6개가 전부예요

YAML 프론트매터(파일 맨 위의 토큰 영역)가 어떻게 생겼는지 통째로 봐요. 놀랍게도 최상위 키가 6개면 끝이에요.

> **L43** Schema overview

```yaml
version: <string>          # optional, current version: "alpha"
name: <string>
description: <string>      # optional
colors:
  <token-name>: <Color>
typography:
  <token-name>: <Typography>
rounded:
  <scale-level>: <Dimension>
spacing:
  <scale-level>: <Dimension | number>
components:
  <component-name>:
    <token-name>: <string|token reference>
```

**한국어:** YAML 영역에 올 수 있는 것들을 모두 적어둔 설계도예요. `<꺾쇠>`로 감싼 건 "여기에 너의 값을 넣어"라는 뜻(placeholder). `# optional`이 붙은 줄은 안 써도 되는 것, 그 외는 쓸 거면 이 구조를 따르라는 말이에요.

## 최상위 키 6개 뜯어보기

**version (선택)**  
지금은 `alpha`. 나중에 포맷이 바뀔 때를 대비한 버전 표기.

**name (필수)**  
디자인 시스템 이름. 예: "Heritage", "Paws & Paths".

**description (선택)**  
한 줄 요약. 넣어도 되고 빼도 됨.

**colors · typography · rounded · spacing · components**  
각각 토큰 묶음. 필요 없는 묶음은 통째로 생략해도 돼요.

## 본문 섹션은 8개, 토큰 묶음은 5개 — 왜 수가 다를까

뒤에서 보겠지만 본문은 Overview · Colors · Typography · Layout · Elevation · Shapes · Components · Do's and Don'ts 8개 섹션으로 써요. 그런데 토큰 묶음은 `colors` · `typography` · `rounded` · `spacing` · `components` 5개뿐이에요. 왜 일치를 안 시켰을까?

- Overview와 Do's and Don'ts는 숫자·값으로 표현할 게 없어요. 순수하게 글로만 설명하는 섹션.
- Elevation(입체감)·Shapes(모양)는 "그림자 대신 보더로 깊이를 표현해요" 같은 전략 설명이 주라서 토큰이 없어도 돼요. 필요한 값은 기존 `rounded`·`spacing`에 녹여 넣어요.

즉 모든 섹션이 토큰을 가질 필요는 없다는 설계예요. 글만 있는 섹션도 제 역할을 해요.

## 키 이름은 자유 — "스케일 레벨"은 그냥 관습

> **L60** The `<scale-level>` placeholder represents a named level in a sizing or spacing scale. Common level names include `xs`, `sm`, `md`, `lg`, `xl`, and `full`. Any descriptive string key is valid.

**한국어:** `<scale-level>`은 크기 단계 이름이 들어갈 자리예요. 보통 `xs`·`sm`·`md`·`lg`·`xl`·`full`을 쓰는 게 익숙하지만, 뜻이 통하는 이름이면 뭐든 써도 돼요. 규칙이 아니라 관습이에요.

실제 예시들을 보면 `gutter`·`margin-desktop`·`glass-padding`처럼 역할이 드러나는 이름을 쓰기도 해요. 검사 도구(린터)가 이걸 막지 않아요.

## 최소한의 DESIGN.md

```yaml
---
name: My First Design System
colors:
  primary: "#1A1C1E"
---
```

```markdown
## Colors
Primary color is deep ink.
```

이게 끝이에요. `name`과 `colors`만 있으면 검사 도구가 통과시켜요. 나머지는 필요할 때 채우면 돼요.

## 핵심 인사이트

DESIGN.md의 설계 묘미는 스펙이 얇다는 거예요. 최상위 키 6개는 고정, 그 안의 이름은 자유. 뼈대는 좁게, 살은 넓게 잡아두면 스펙은 안정적이면서도 다양한 프로젝트를 품을 수 있어요.

## 체크리스트

- 최상위 키 6개를 외우지 않고도 하나씩 짚어볼 수 있다
- 본문 섹션 8개와 토큰 묶음 5개의 수가 다른 이유를 설명할 수 있다
- 스케일 레벨 이름이 규칙이 아니라 관습이라는 점을 안다
