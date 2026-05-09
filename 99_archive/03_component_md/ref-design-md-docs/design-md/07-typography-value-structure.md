# 폰트(Typography) 값 구조

하나의 텍스트 스타일을 이루는 7개 속성

타이포 토큰 하나는 "h1은 어떻게 생겼나?"를 7개 속성으로 묘사해요. CSS의 폰트 관련 속성은 30개가 넘는데, 그중 7개만 엄선해서 표준 형태로 박아 뒀어요.

> **L64** Typography token properties
>
> - `fontFamily` (string)
> - `fontSize` (Dimension)
> - `fontWeight` (number)
> - `lineHeight` (Dimension | number)
> - `letterSpacing` (Dimension)
> - `fontFeature` (string)
> - `fontVariation` (string)

**한국어:** 타이포 토큰 하나에 담을 수 있는 속성 목록이에요.

① `fontFamily` 폰트 이름 — ② `fontSize` 글자 크기 — ③ `fontWeight` 굵기(숫자, 예: 400·700) — ④ `lineHeight` 줄간격 — ⑤ `letterSpacing` 자간 — ⑥ `fontFeature` 폰트 기능(합자·숫자 모양 등) — ⑦ `fontVariation` 가변 폰트 세팅.

## 왜 7개만 남겼을까 — 빠진 것들과 그 이유

**들어온 것**  
폰트의 본질(어떤 폰트, 얼마나 크게, 얼마나 굵게, 줄간격·자간, 폰트 고유 기능)만.

**빠진 것 (의도적)**  
`color`(색)·`textDecoration`(밑줄)·`textTransform`(대소문자)·`fontStyle`(기울임)·`textShadow`(글자 그림자).

빠진 항목들은 다른 곳에서 책임지도록 역할을 나눈 거예요.

- 색은 `colors` 토큰이 담당해요. 여기 둘 이유 없음.
- 대소문자 변환(UPPERCASE)·밑줄·그림자는 "이 컴포넌트에서만" 쓰는 경우가 많아서 컴포넌트 토큰이나 본문 설명에서 다뤄요.

결과적으로 타이포 토큰 하나가 재사용 가능한 텍스트 스타일 프리셋이 돼요. "h1"은 항상 같은 폰트·크기·굵기를 쓰고, 어디 놓이느냐에 따라 색·대소문자만 달라지는 식.

## 고급 두 개 — 가변 폰트 지원

**fontFeature / fontVariation**

`fontFeature`는 폰트 기능 설정이에요. 예: 같은 폰트에서 숫자를 표 모양(`tnum`)으로 바꾸거나 합자(`liga`)를 켜는 식.

`fontVariation`은 가변 폰트(variable font, 한 파일 안에 여러 굵기·너비가 들어있는 폰트)의 축을 조정해요. 예: `'wght' 450`, `'wdth' 105`.

초보 디자인 시스템은 잘 안 쓰지만, 스펙은 최신 폰트 기법을 무시하지 않고 담아 뒀어요.

## fontWeight의 작은 함정 — 문자열도 받아요

> **L66** `fontWeight` (number) - A numeric font weight value (e.g., `400`, `700`). In YAML, this may be expressed as either a bare number or a quoted string; both are equivalent.

**한국어:** `fontWeight`는 숫자 값(400·700 등)이에요. YAML에서는 `700`(숫자 그대로)과 `"700"`(따옴표로 감싼 문자열) 둘 다 써도 돼요. 의미는 같아요.

YAML에서 따옴표 규칙이 헷갈려 실수를 자주 하기 때문에, 둘 다 받아서 실수 가능성을 줄인 거예요. 실제 예시 파일들은 대부분 `fontWeight: "700"`처럼 따옴표 버전을 써요.

## 이름 붙이기 관습 — 강제는 아니에요

스펙은 타이포 토큰 이름을 강제하지 않지만, 팀마다 비슷한 관습을 써요.

- 용도 카테고리: `headline`·`display`·`body`·`label`·`caption`·`title`
- 크기 단계: `-lg`·`-md`·`-sm`
- 합치면: `headline-lg`, `body-md`, `label-sm`

레벨 개수는 보통 9~15개가 현실적이에요. 너무 적으면 위계가 모자라고, 너무 많으면 디자이너·AI가 선택에 헤매요.

## 실제 예시 (Heritage)

```yaml
typography:
  h1:
    fontFamily: Public Sans
    fontSize: 48px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -0.02em
  body-md:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.1em
```

세 개 레벨만 보여도 위계가 잡혀요. h1은 크고 자간 좁게, 본문은 줄간격 여유, 라벨은 자간 넓게 — 각각 맡은 역할이 달라요.

## 핵심 인사이트

타이포 토큰은 "폰트의 본질만 담는다"는 절제의 결과예요. 색·장식·대소문자 같은 장소 따라 다른 것은 다른 토큰·컴포넌트에 맡기고, 타이포 자체는 어디서든 꺼내 쓸 수 있는 프리셋으로. 이렇게 나누면 폰트를 교체해도 연쇄 수정이 덜해져요.

## 체크리스트

- 타이포 토큰 안의 7개 속성 역할을 떠올릴 수 있다
- 색·밑줄·대소문자가 왜 Typography에서 빠졌는지 설명할 수 있다
- `fontWeight`가 숫자·문자열 둘 다 받는 이유를 안다
- 이름 관습(카테고리-사이즈)과 레벨 개수 9~15개 감을 기억한다
