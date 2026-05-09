# DTCG · Tailwind · Figma와의 관계

기존 생태계와 양방향으로 연결된 포맷

DESIGN.md는 갑자기 튀어나온 포맷이 아니에요. 디자인 토큰 업계에 이미 있던 아이디어를 계승하고, 주요 도구들과 연결되도록 설계됐어요.

> **L12** The system that we use to describe design tokens is inspired by the Design Token JSON spec. Specifically, we adopt the concept of typed token groups (colors, typography, spacing) and the {path.to.token} reference syntax for cross-referencing values.

**한국어:** DESIGN.md의 토큰 체계는 W3C의 Design Token JSON 스펙(DTCG)에서 영감을 받았어요. 특히 타입별 토큰 묶음(`colors`·`typography`·`spacing` 등)과 참조 문법 `{path.to.token}`은 DTCG 방식을 그대로 가져왔어요.

## DTCG가 뭐예요?

DTCG(Design Tokens Community Group)는 W3C 산하 그룹이에요. 디자인 토큰을 어떻게 JSON으로 표현할지 업계 표준을 만들어요. Figma·Adobe·Salesforce 같은 회사들이 참여해요.

## DTCG와 공통점

- 타입별 토큰 묶음 (`colors` · `typography` · `spacing` 등)
- 참조 문법 `{path.to.token}` (DTCG에서는 "alias"라고 부름)
- Dimension · Color · Typography 같은 값 타입 체계

## DTCG와 차이점

| 비교 항목 | DTCG | DESIGN.md |
|-----------|------|-----------|
| 파일 형식 | JSON | YAML + 마크다운 |
| 설명·근거 | `$description` 한 줄 정도 | 마크다운 본문으로 풍부한 설명 |
| 엄격함 | 토큰마다 `$type`을 써야 함 | 그룹 위치로 타입을 추론 |
| 컴포넌트 | 평평한 토큰 나열에 가까움 | 컴포넌트 단위 묶음 지원 |

## Tailwind와는 어떻게 연결될까

대부분의 웹 프론트엔드가 Tailwind를 써요. `export --format tailwind`로 아래처럼 매핑돼요.

| DESIGN.md | Tailwind |
|-----------|----------|
| `colors.xxx` | `theme.colors.xxx` |
| `typography.xxx` | `theme.fontSize`·`theme.fontFamily` 조합 |
| `rounded.xxx` | `theme.borderRadius.xxx` |
| `spacing.xxx` | `theme.spacing.xxx` |
| `components` | 제외 (Tailwind의 유틸리티 조합 철학 존중) |

## DESIGN.md가 "허브"인 이유

변환 시 정보 손실 방향:

| 변환 방향 | 결과 |
|-----------|------|
| DESIGN.md → DTCG | 컴포넌트·토큰 다 살아남, 본문 설명만 빠짐 |
| DESIGN.md → Tailwind | 본문 + 컴포넌트 토큰 빠짐 |
| DTCG → DESIGN.md | 본문이 비어 있는 뼈대만의 DESIGN.md |
| Tailwind → DESIGN.md | 컴포넌트·본문 둘 다 없음 (가장 빈약) |

DESIGN.md가 가장 풍부한 원본이에요. 건강한 파이프라인은 DESIGN.md를 진짜 원본(single source of truth)으로 삼고, Tailwind 설정·Figma 변수는 거기서 자동 생성해서 파생물로 두는 방식이에요.

## Figma와는?

DTCG를 경유해서 간접적으로 연결돼요. Figma Variables → DTCG 플러그인 → DESIGN.md import의 흐름이 가능해요. 반대 방향도 가능. 다만 실시간 양방향 동기화는 아직 없어요(alpha 단계의 한계).

## 핵심 인사이트

새 포맷이 성공하려면 기존 생태계를 거부하지 않고 이어받아야 해요. DESIGN.md는 DTCG에서 아이디어를 가져오고, Tailwind로 바로 내보낼 수 있고, Figma와는 DTCG 경유로 이어져요. "이 새 포맷 쓰면 기존 도구 못 쓰게 됨"이라는 저항을 처음부터 없앴어요. 스펙의 성공 = 생태계에서의 위치라는 교훈이에요.

## 체크리스트

- DTCG가 뭔지, DESIGN.md와 공유하는 개념을 안다
- DESIGN.md와 DTCG의 차이 4가지를 떠올릴 수 있다
- Tailwind 변환이 컴포넌트를 제외하는 이유를 다시 설명할 수 있다
- 변환 방향에 따라 정보가 얼마나 남는지 비교할 수 있다
