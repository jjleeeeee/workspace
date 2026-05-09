# Typography · Layout 섹션

폰트 위계와 간격 시스템

## Typography — 레벨 9~15개가 현실적

> **L146** Most design systems have 9 - 15 typography levels. The design system may prescribe a role for each typography level.

**한국어:** 대부분의 디자인 시스템은 9~15개의 타이포 레벨을 가져요. 각 레벨마다 역할을 정해 두는 게 좋아요(예: `headline-lg`는 페이지 최상단 타이틀용).

레벨이 너무 적으면 위계가 모자라고, 너무 많으면 디자이너·AI가 어느 걸 쓸지 헤매요. 9~15가 현실적 중간값.

## 폰트 조합 — 한 개? 두 개?

3개 공식 예시를 보면 팀마다 전략이 달라요.

| 예시 | 폰트 전략 | 이유 |
|------|-----------|------|
| Atmospheric Glass | Inter 단일 | 배경이 이미 화려해서 폰트는 한 가지로 절제 |
| Paws & Paths | Plus Jakarta Sans 단일 | 친근함 강조 |
| Heritage | Public Sans(본문·헤드라인) + Space Grotesk(라벨·숫자) | 서사 + 기술 |
| Totality Festival | Space Grotesk(헤드라인) + Inter(본문) | 시네마틱 + 가독성 |

단일 폰트는 일관성, 이중 폰트는 역할 분리. 둘 다 정답이에요.

## Layout — 그리드 고정 vs 유동

> **L197** Many design systems follow a grid-based layout. Others, like Liquid Glass, use margins, safe areas, and dynamic padding.

**한국어:** 많은 디자인 시스템이 그리드 기반 레이아웃(12열 같은 고정 그리드)을 써요. Apple의 Liquid Glass 같은 다른 접근은 여백·안전 영역·동적 패딩을 써요. 둘 다 유효.

토큰은 `spacing` 묶음에 넣어요. 가장 흔한 관습은 8px 기준 스케일(4·8·16·24·32·64…).

## spacing 토큰 — 스케일 + 도메인 이름 섞기

```yaml
spacing:
  base: 16px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 32px
  xl: 64px
  gutter: 24px      # ← 도메인 이름
  margin: 32px      # ← 도메인 이름
```

스케일 이름(`xs`~`xl`)과 역할 이름(`gutter`·`margin`)을 같이 둬요. 검사 도구는 이름을 막지 않아요.

## 단위 없는 숫자도 허용 — 왜?

`spacing`은 Dimension(`16px`)뿐 아니라 단위 없는 숫자도 받아요. 예: `grid-columns: 12`(열 개수), `max-line-length: 75`(한 줄 최대 글자 수). 이런 값은 단위가 붙으면 오히려 이상해요. 스펙이 이걸 배려해서 타입을 넓혔어요.

## 핵심 인사이트

Typography·Layout은 "값은 엄격하게(숫자+단위), 이름은 자유롭게(도메인 네이밍 OK)"라는 이중 원칙을 따라요. `xs`~`xl`은 권장일 뿐 `container-padding`·`card-gap` 같은 의미 이름이 오히려 읽기 쉬울 때가 많아요. 예시들이 이 패턴을 그대로 보여줘요.

## 체크리스트

- 타이포 레벨의 권장 개수(9~15)를 안다
- 단일 폰트 vs 이중 폰트 전략의 대표 예시를 하나 이상 떠올릴 수 있다
- `spacing`이 단위 없는 숫자를 받는 이유를 안다
- 스케일 이름과 도메인 이름을 섞어 쓰는 관행을 이해한다
