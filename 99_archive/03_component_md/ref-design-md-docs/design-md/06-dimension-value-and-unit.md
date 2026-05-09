# 길이(Dimension) 값과 단위

px · em · rem 이 세 개만 허용해요

색 다음으로 자주 쓰는 값이 길이예요 — 폰트 크기·간격·radius 같은 숫자들. DESIGN.md는 여기서도 단위를 딱 세 개로 좁혔어요.

> **L74** Dimension: A dimension value is a string with a unit suffix. Valid units are: `px`, `em`, `rem`.

**한국어:** 길이 값은 반드시 숫자 + 단위 형태의 문자열이어야 해요. 허용되는 단위는 `px`, `em`, `rem` 세 개뿐. 다른 건 안 받아요.

## 쳐낸 단위들 — 그리고 그 이유

- `%`(퍼센트) — 무엇에 대한 퍼센트인지가 부모에 따라 달라져요. 토큰에 박아두기에 너무 떠다님.
- `vw`·`vh`·`dvh`(뷰포트 단위) — 화면 크기에 딸려 움직여요. "버튼 패딩 8vw" 같은 건 말이 안 되죠.
- `pt`·`in`·`cm`(인쇄 단위) — 종이용. 디지털 UI에는 거의 안 써요.
- `ch`·`ex`(문자 기준) — 폰트가 바뀌면 같이 바뀌어요. 재현성이 떨어져서 뺐어요.

## 살려둔 3개 — 각자 언제 쓸까

**px (고정 픽셀)**  
항상 같은 크기. 아이콘 크기·1px 보더·고정 패딩에 적합.

**em (부모 폰트 크기 기준)**  
부모 글자 크기에 비례. 자간(`letterSpacing`) 같은 타이포 세부에 유용.

**rem (루트 폰트 크기 기준)**  
문서 루트에 비례. 사용자가 브라우저 글자를 키우면 UI 전체가 같이 커져요(접근성에 좋음).

## 예외 하나 — lineHeight는 단위 없는 숫자도 OK

> **L67** `lineHeight` (Dimension | number) - Accepts either a Dimension (e.g., `24px`, `1.5rem`) or a unitless number (e.g., `1.6`). A unitless number represents a multiplier of the element's fontSize, which is the recommended CSS practice.

**한국어:** 줄간격(`lineHeight`)은 단위가 있는 길이(`24px`, `1.5rem`)를 써도 되지만, 단위 없는 숫자(`1.6`)도 받아요. 단위 없는 숫자는 "글자 크기의 몇 배"라는 뜻이에요. CSS 표준 권장 방식을 그대로 따라간 거예요.

`spacing`도 같은 이유로 "길이 또는 단위 없는 숫자"를 받아요 (예: `grid-columns: 12` 같은 열 개수는 단위가 필요 없으니까요).

## 실제 예시들 — 세 단위가 각자 자리 잡은 모습

```yaml
# Paws & Paths — 간격은 px
spacing:
  base: 8px
  gutter: 16px

# Totality Festival — radius는 rem
rounded:
  sm: 0.125rem
  lg: 0.5rem

# Heritage — 자간은 em, 줄간격은 단위 없는 숫자
typography:
  h1:
    letterSpacing: -0.02em
    lineHeight: 1.1
```

## 핵심 인사이트

CSS에는 길이 단위가 10개도 넘지만, DESIGN.md는 디자이너·개발자가 이미 공통으로 쓰는 3개만 남겼어요. 결과적으로 AI가 헛값을 내기 어려워지고, Tailwind·토큰 포맷으로 변환하기도 깔끔해져요. "자주 쓰는 좋은 것만 남긴다"는 절제가 포맷의 깔끔함을 만들어요.

## 체크리스트

- 허용되는 단위 3개(`px`·`em`·`rem`)를 떠올릴 수 있다
- 각 단위를 언제 쓰면 좋은지 한 줄씩 설명할 수 있다
- 왜 `%`·`vw`가 빠졌는지 이유를 말할 수 있다
- `lineHeight`가 단위 없는 숫자를 받는 이유를 안다
