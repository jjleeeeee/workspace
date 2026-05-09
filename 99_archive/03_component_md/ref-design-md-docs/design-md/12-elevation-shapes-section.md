# Elevation · Shapes 섹션

깊이와 모서리 — 평면을 입체로, 각을 부드럽게

## Elevation & Depth — "어떻게 깊이를 표현할지"의 선언

> **L236** This section describes how visual hierarchy is conveyed based on the design style. If elevation is used, it defines the required styling (spread, blur, color). For flat designs, this section explains the alternative methods used to convey visual hierarchy (e.g., borders, color contrast).

**한국어:** 이 섹션은 "위아래 위계(카드가 배경보다 떠 보이는 느낌)를 어떻게 표현할지"를 설명해요. 그림자를 쓴다면 번짐·블러·색을 정의하고, 그림자 없는 플랫 디자인이라면 어떻게 대신 위계를 만들지(경계선, 색 대비 등)를 설명해요.

이 섹션은 토큰이 없어요. 대신 글로 전략을 선언해요. "톤 레이어 사용", "그림자 대신 보더로 위계" 같은 식.

## 세 가지 대표 전략 (실제 예시에서)

**Drop Shadow (그림자)**  
Paws & Paths: 확산 그림자에 주조색(오렌지) 약간 섞어 "더러운 회색" 피함.

**Tonal Layers (톤 차이)**  
Heritage: 배경 톤을 살짝 다르게 해서 카드가 "떠 있는" 느낌.

**Glassmorphism (유리)**  
Atmospheric / Totality: 반투명 + `backdrop-filter: blur`로 유리판 효과.

그 밖에: 완전 플랫(보더만) · iOS 스타일 블러 · 모서리 강조 등 프로젝트마다 자유.

## Shapes — 모서리 곡률 토큰

> **L266** The rounded section defines the design tokens for rounded corners used in buttons, cards, and other rectangular shapes.

**한국어:** `rounded` 섹션은 버튼·카드 같은 사각형 요소의 모서리 둥글기 토큰을 정의해요.

관습적인 스케일은 `sm` · `md` · `lg` · `xl` · `full`. `full: 9999px`는 완전 동그란 알약(pill) 버튼이나 프로필 아바타용이에요.

## DEFAULT 키 — Tailwind와의 연결 고리

```yaml
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem      # ← Tailwind의 "rounded" 유틸리티에 매핑
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
```

`DEFAULT` 키는 Tailwind 전통. 내보내기(`export`)로 Tailwind 설정을 만들 때 `rounded-DEFAULT` 대신 그냥 `rounded`로 쓰도록 매핑하려는 장치예요.

## 모양 하나가 브랜드 톤을 바꿔요

| radius 크기 | 느낌 |
|-------------|------|
| 4px 근처 작은 radius | 건축적 단정함 — 기술·고급 |
| 12~16px | Rounded — 친근·부드러움 |
| `full` (9999px) | Pill — 다이내믹·캐주얼 |

그래서 Do's and Don'ts에서 "둥근 모서리와 각진 모서리를 같은 화면에 섞지 말 것"을 자주 권해요. 톤이 찢어지거든요.

## 핵심 인사이트

두 섹션 다 "값 하나가 아니라 접근법을 선언한다"는 공통점이 있어요. Elevation은 토큰 없이 어떻게 깊이를 낼지 전략을 글로 정하고, Shapes는 작은 스케일 6개로 전체 브랜드 인상을 바꿔요. 디자인 시스템이 갖고 있는 태도가 드러나는 자리예요.

## 체크리스트

- Elevation의 3가지 대표 전략(그림자 / 톤 레이어 / 글래스)을 구분한다
- `rounded` 스케일의 관습적 이름을 안다
- `DEFAULT` 키가 왜 있는지 설명할 수 있다
- radius 크기가 브랜드 톤에 주는 영향을 이해한다
