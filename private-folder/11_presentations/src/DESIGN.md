---
version: alpha (26-04-30) — v3 frontmatter rule expansion
name: Chord Design System
description: >
  Weverse 생태계의 기반 디자인 언어. 음악적 "화음(Chord)" 개념에서 영감을 받아
  디자인, 개발, 팬, 아티스트를 연결한다. 이 파일은 AI용 브랜드 브리핑 문서로,
  YAML은 시스템 스냅샷, 본문은 판단 가이드, 정확한 값은 sources JSON을 참조한다.

# ──────────────────────────────────────────
# v3 변경점 (vs v2)
#   본문 Don't에만 있던 *치명적 룰*을 frontmatter로 승격.
#   v2 산출물 분석에서 발견된 6개 위반 패턴(-100a 솔리드 사용, fixed_color UI 사용,
#   shadow/spacing 인라인 px, 페이지 타이틀 위계 붕괴, curated 외 토큰 추정 호명)을
#   직접 차단하는 4개 신규 룰 + 2개 강화 룰로 추가했다.
#   본문(Brand & Style 이하)은 v2와 동일.
# ──────────────────────────────────────────

# ──────────────────────────────────────────
# ai-implementation-rules
#   AI가 이 디자인 시스템으로 UI를 생성할 때 *반드시* 따라야 하는 규칙.
#   frontmatter만 읽고도 핵심 제약을 인지할 수 있도록 여기에 모아둔다.
#   각 룰은 단발 실수가 아니라 시스템 일관성을 깨는 패턴을 차단한다.
# ──────────────────────────────────────────
ai-implementation-rules:
  library-first: 모든 시각 요소(아이콘·divider·dot·chevron 포함)는 라이브러리 컴포넌트 인스턴스로 만든다. vector/shape 직접 작성 금지.

  token-first: >
    모든 시각 속성(color·spacing·radius·shadow·typography·border)은 토큰 키로 호명한다.
    hex·px·CSS 값을 raw로 하드코딩하지 않는다.
    위반 예시: `gap-[12px]`, `padding:16px`, `drop-shadow:0 6 28 0 rgba(0,0,0,.1)`,
    `color:#000000`, `border-radius:8px`, `font-size:15px` — 모두 토큰명으로 치환해야 한다
    (각각 `padding-box-150`, `padding-box-200`, `shadow-lg`, `text-default`, `box-100`, `body-m-500` 등).
    토큰명을 모르면 SoT JSON에서 찾는다 (추정 금지 — `sot-is-json` 참조).

  alpha-suffix-overlay-only: >
    `-{n}a` 접미사 토큰(`-50a`, `-100a`, `-200a`, `-400a` 등)은 *n% alpha 오버레이* 전용.
    페이지 background·카드 surface·primary 텍스트 등 *솔리드 면*의 베이스로 절대 사용 금지.
    위반 예시:
      ❌ 페이지 background에 `surface-default-100a` 호명 (사실상 10% 흰색 = 거의 투명한 화면)
      ❌ 본문 텍스트 색에 `text-default-400a` 호명 (40% 알파 = 위계가 회색 톤으로 무너짐)
    솔리드 페이지·카드 베이스는 alpha 없는 토큰(`surface-default`, `text-default`)을 쓴다.
    카드 위 미세 구분선·hover overlay 같은 *위에 얹는* 자리에만 alpha suffix를 쓴다.

  fixed-color-immersive-only: >
    `system/fixed_color/*` 패밀리는 *모드 무관 항상-다크 컨텍스트* 전용
    (미디어 플레이어·이머시브 영상·항상 검정인 immersive surface).
    페이지·카드·App Bar·GNB·시트·바텀 내비게이션 등 *일반 UI surface*에 절대 사용 금지 —
    Light 모드인데 검정으로 렌더되어 모드 분기 자체가 깨진다.
    일반 UI는 `system/color/*` 패밀리를 쓴다 (자동 light/dark 분기 적용됨).
    위반 예시:
      ❌ Light 화면 App Bar에 `fixed_color/surface/default` (검정 바가 흰 화면 위에 박힘)
      ❌ GNB 텍스트에 `fixed_color/text/gray-800` (모드 무관 회색 — light 모드에서도 그대로)

  page-title-hierarchy: >
    페이지 최상위 타이틀은 `title` 또는 `headline` 카테고리(weight 800)를 호명한다.
    body·caption 카테고리를 페이지 타이틀로 사용 금지.
    기준:
      - 큰 페이지 타이틀(홈·온보딩·hero) → `title-m-800` (28px)
      - 표준 페이지/모달 타이틀 → `headline-m-800` (20px)
      - 작은 섹션 헤더 → `headline-s-800` (18px)
    위반 예시:
      ❌ 페이지 타이틀 "커뮤니티"를 `body-lg-700` (16px)로 호명 — 본문 텍스트 위계와 같아져 페이지 진입 신호가 사라짐.

  sot-is-json: >
    YAML curated는 *시스템 스냅샷*이다 (color 18 / typography 12 / radius 8 / spacing 13).
    curated에 없는 토큰이 필요하면 *반드시* sources의 JSON을 직접 읽어 정확한 키와 값을 확인한다 —
    "비슷해 보이는 이름"으로 추정 호명 금지.
    위반 예시:
      ❌ 보조 텍스트에 `text/400a` 호명 (curated에 없음 — `text-gray-600`이 정답)
      ❌ App Bar GNB 회색에 `fixed_color/text/gray-800` (curated에 없음 — 일반 UI는 system/color/text/gray-* 사용)
    curated에 없는데 추정 호명이 자주 일어나면 *해당 토큰을 curated로 승격*하거나 SoT를 직접 인용한다.

  dark-mode: 모든 색상은 light/dark 쌍이다. JSON에서 양쪽 모드를 반드시 확인한다.

  ios-offset: iOS fontSize는 Android/Web 대비 항상 +1pt를 적용한다.
  # 디자인 판단 규칙 (primary 남용 금지, 0px 코너 금지 등)은 본문 Do's and Don'ts에 기술한다.

# 아래 frontmatter는 시스템 스냅샷 (curated subset).
# curated에 없는 토큰이 필요하면 반드시 sources의 JSON을 읽어서 확인할 것.
sources:
  color: tokens/color.json           # 408 tokens, light/dark
  size: tokens/size.json              # 66 tokens (radius, padding, margin, button-height)
  typography: tokens/typography.json   # 71 tokens (default 3-platform + circular)
  icons: assets/                                        # SVG assets — 16px (270), 24px (342), 64px (25)
  components:
    button: components/button/button.md                       # 6 variants × 4 states, prop API, 3-platform code
    avatar: components/avatar/avatar.md                       # 11 sizes, Circle/Squircle, Ring/Badge/장식
    badge: components/badge/badge.md                         # Badge_Dot (3 sizes) + Badge_Number (count/N)

# ──────────────────────────────────────────
# colors  — sRGB hex only (#RRGGBB)
#   SoT: color.json (408 tokens)
#   아래는 curated 18개. 전체 목록은 SoT 참조.
#   키 네이밍: system/color/{category}/{name} → {category}-{name}
# ──────────────────────────────────────────
colors:
  # Roles
  roles-primary: "#00CBD5"                 # Brand Mint — CTA, 활성 상태
  roles-negative: "#FE5B58"                # 에러, 삭제
  roles-secondary-blue: "#5989FE"          # 서비스 컨텍스트 대표 (Jelly 등)
  # Text
  text-default: "#000000"                  # 기본 텍스트 (Light)
  text-default-reverse: "#FFFFFF"          # 반전 텍스트 (filled 버튼 위)
  text-primary: "#00B8C1"                  # 민트 텍스트 (링크, outlined 버튼)
  text-gray-600: "#666666"                 # 보조 텍스트 (ghost 버튼, 캡션)
  # Surface
  surface-default: "#FFFFFF"               # 기본 배경 (Light)
  surface-primary: "#DFFAFB"               # 민트 틴트 배경 (outlined pressed)
  # Outline
  outline-default-50a: "#0000000A"         # 카드·리스트 구분 (4% 저투명, "거의 안 보임" 의도)
  outline-gray-100: "#EBEDF2"              # 인풋·표준 테두리
  # Status
  status-hover-primary: "#00B8C1"          # filled-primary pressed
  status-active-gray-75: "#F2F3F7"         # ghost pressed
  # Button
  button-default: "#00CBD5"                # 버튼 기본 fill
  button-black: "#000000"                  # 블랙 버튼 fill
  button-disabled: "rgba(0,0,0,0.1)"      # 비활성 버튼
  button-hover: "rgba(0,0,0,0.04)"        # hover 오버레이
  button-ghost: "transparent"              # ghost 버튼

# ──────────────────────────────────────────
# gradients  — Spectrum Gradient 패밀리 (브랜드 메타포 "별빛")
#   SoT: color.json (Gradient/* 항목)
#   아래는 curated 5개. 각 토큰은 정해진 컨텍스트에서만 사용 (컨텍스트 외 호출 금지).
# ──────────────────────────────────────────
gradients:
  moment-gra: "brand-mint + brand-gra-purple"                                             # 모먼트 링 전용
  membership-gra: "membership-summer-blue + membership-violet"                            # FC Membership
  integrated-membership-light-gra: "membership-spring-green + membership-cornflower-blue + membership-violet"   # 통합 멤버십 (Light)
  integrated-membership-dark-gra: "membership-spring-green + membership-cornflower-blue + membership-violet-2"  # 통합 멤버십 (Dark)
  membership-digital-gra: "membership-daisy-yellow + membership-spring-green"             # Digital Membership

# ──────────────────────────────────────────
# typography  — fontSize / fontWeight / lineHeight
#   SoT: typography.json (71 tokens, 원자 단위)
#   아래는 생산 Figma 기준 curated 조합 12개.
#   Naming: <category>-<size>-<weight>  (e.g. body-s-400)
#   Values: Android/Web base. iOS는 모든 fontSize에 +1pt.
#   fontFamily 생략 — platform별 해석:
#     caption, body → font_family/body (Web: Pretendard, iOS: WeGothicSans, AOS: Roboto)
#     headline, title → font_family/title (동일)
#     영문 헤더·라벨 → CircularXX TT (weight 900)
# ──────────────────────────────────────────
typography:
  title-m-800:                             # SoT: text-700 / lh-700 — 페이지 타이틀
    fontSize: 28px
    fontWeight: 800
    lineHeight: 36px
  headline-m-800:                          # SoT: text-500 / lh-500 — 섹션 헤더
    fontSize: 20px
    fontWeight: 800
    lineHeight: 26px
  headline-s-800:                          # SoT: text-400 / lh-400 — 카드/서브헤딩
    fontSize: 18px
    fontWeight: 800
    lineHeight: 23px
  body-lg-700:                             # SoT: text-300 / lh-300 — 큰 본문, 영문 헤더 (Circular 변형 가능)
    fontSize: 16px
    fontWeight: 700
    lineHeight: 22px
  body-m-700:                              # SoT: text-200 / lh-200 — 강조 본문
    fontSize: 15px
    fontWeight: 700
    lineHeight: 21px
  body-m-500:                              # SoT: text-200 / lh-200 — 부가 강조 본문
    fontSize: 15px
    fontWeight: 500
    lineHeight: 21px
  body-s-400:                              # SoT: text-150 / lh-150 — 기본 소본문
    fontSize: 14px
    fontWeight: 400
    lineHeight: 18px
  body-s-500:                              # SoT: text-150 / lh-150 — 부가 강조
    fontSize: 14px
    fontWeight: 500
    lineHeight: 18px
  body-s-700:                              # SoT: text-150 / lh-150 — 강한 강조
    fontSize: 14px
    fontWeight: 700
    lineHeight: 18px
  body-xs-400:                             # SoT: text-100 / lh-100 — 작은 본문, 댓글
    fontSize: 13px
    fontWeight: 400
    lineHeight: 17px
  caption-m-400:                           # SoT: text-75 / lh-75 — 메타데이터
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
  caption-s-400:                           # SoT: text-50 / lh-50 — 작은 메타, 타임스탬프
    fontSize: 11px
    fontWeight: 400
    lineHeight: 14px

# ──────────────────────────────────────────
# rounded  — border-radius tokens
#   SoT: size.json → system/size/radius/box/*
#   아래는 curated 8개. pill(9999px)은 SoT 미등록 — TODO.
# ──────────────────────────────────────────
rounded:
  box-0: 0px                               # sharp (비인터랙티브 예외만)
  box-50: 4px                              # 작은 라벨·뱃지 (Live Tag 등)
  box-75: 6px                              # 버튼 기본 radius
  box-100: 8px                             # 인풋, 표준 인터랙티브
  box-150: 12px                            # 중간 컨테이너
  box-200: 16px                            # 카드, 미디어 썸네일
  box-250: 20px                            # 큰 카드
  box-300: 24px                            # 모달, 바텀시트
  # TODO: pill (9999px) — Figma WDS_tokens에 추가 후 반영

# ──────────────────────────────────────────
# icon  — icon size tokens
#   SoT: size.json → system/size/icon/*
#   아래는 curated 4개. 색상은 부모 컴포넌트의 textColor를 상속 (고정값 없음).
# ──────────────────────────────────────────
icon:
  16mquad: 16px                            # 인라인 텍스트 아이콘, checkmark-only
  20mquad: 20px                            # 소형 버튼 아이콘, badge 내부
  24mquad: 24px                            # DEFAULT — 버튼, 체크박스, 내비게이션
  32mquad: 32px                            # 카드 내 강조 아이콘

# ──────────────────────────────────────────
# spacing  — padding / margin / gap / height tokens
#   SoT: size.json → system/size/padding/box/*, margin/screen/*, button-height/*
#   아래는 curated 13개.
# ──────────────────────────────────────────
spacing:
  # padding-box (컴포넌트 내부 여백)
  padding-box-50: 4px                      # 최소 간격, 아이콘-텍스트 갭
  padding-box-75: 6px                      # chip 내부, 좁은 여백
  padding-box-100: 8px                     # 아이콘 갭, 소형 패딩
  padding-box-150: 12px                    # 버튼 paddingY
  padding-box-200: 16px                    # 표준 gutter, 카드 내부
  padding-box-250: 20px                    # 넓은 내부 여백
  padding-box-350: 28px                    # 섹션 간격
  # margin-screen (화면 좌우 마진 — display 화면 / end 화면 구분)
  margin-screen-0: 0px                     # 풀블리드
  margin-screen-125: 10px                  # display 화면 (콘텐츠 표시: 홈·더보기·피드·라이브·Shop·커머스 등)
  margin-screen-200: 16px                  # end 화면 (액션·상세·폼: 설정·약관·입력 등)
  margin-screen-250: 20px                  # 태블릿 마진
  # button-height
  button-height-small: 36px                # 소형 버튼
  button-height-medium: 40px               # 기본 버튼

# ──────────────────────────────────────────
# shadows  — drop-shadow tokens (iOS/PC 기준)
#   SoT: size.json → size shadow/* (base variables) + Figma 정의 페이지
#   AOS는 별도 base variable이며 사용 시 토큰 호명만 하면 자동 분기.
#   값 표기: Y=offset-y, B=blur, S=spread, O=opacity
# ──────────────────────────────────────────
shadows:
  shadow-xs-2: "Y:4 B:8 O:6%"                # 작은 강조 (라벨·작은 버튼)
  shadow-xs-1: "Y:2 B:12 O:8%"               # 미세 그림자 (GNB 등)
  shadow-xs-3: "Y:1 gray-75 + Y:2 B:12 O:8%" # 1px 보더 + 미세 그림자 결합
  shadow-s: "Y:2 B:20 S:-2 O:8%"             # 작은 카드
  shadow-m: "Y:2 B:28 S:-4 O:12%"            # 큰 컨테이너
  shadow-lg: "Y:6 B:28 O:10%"                # 표준 카드

# ──────────────────────────────────────────
# components  — flat keys, variant = suffix
#   변형에는 바뀌는 속성만 기술 (나머지는 base에서 상속).
#   loading 상태: pressed와 동일 외형 + spinner — 본문 설명 참조.
#   Skipped variants (filled-black, outlined-gray 등): components/button/button.md 참조.
# ──────────────────────────────────────────
components:
  # --- Button: Filled Primary ---
  button-filled-primary:
    backgroundColor: "{colors.roles-primary}"
    textColor: "{colors.text-default-reverse}"
    padding: "{spacing.padding-box-150} {spacing.padding-box-200}"
    rounded: "{rounded.box-75}"
    height: "{spacing.button-height-medium}"
  button-filled-primary-pressed:
    backgroundColor: "{colors.status-hover-primary}"
  button-filled-primary-disabled:
    opacity: 0.4

  # --- Button: Outlined Color Primary ---
  button-outlined-color-primary:
    backgroundColor: transparent
    textColor: "{colors.text-primary}"
    border: "1px solid {colors.roles-primary}"
    padding: "{spacing.padding-box-150} {spacing.padding-box-200}"
    rounded: "{rounded.box-75}"
    height: "{spacing.button-height-medium}"
  button-outlined-color-primary-pressed:
    backgroundColor: "{colors.surface-primary}"
  button-outlined-color-primary-disabled:
    opacity: 0.4

  # --- Button: Ghost ---
  button-ghost:
    backgroundColor: "{colors.button-ghost}"
    textColor: "{colors.text-gray-600}"
    padding: "{spacing.padding-box-150} {spacing.padding-box-200}"
    rounded: full                          # Ghost: 항상 pill — SoT pill 등록 후 참조로 전환
    height: "{spacing.button-height-medium}"
  button-ghost-pressed:
    backgroundColor: "{colors.status-active-gray-75}"
  button-ghost-disabled:
    opacity: 0.4

  # --- Card ---
  card:
    backgroundColor: "{colors.surface-default}"
    rounded: "{rounded.box-200}"
    padding: "{spacing.padding-box-200}"

  # --- Chip ---
  chip:
    backgroundColor: "{colors.surface-default-gray-50}"
    textColor: "{colors.text-primary}"
    rounded: full                          # pill
    padding: "{spacing.padding-box-75} {spacing.padding-box-150}"
  chip-active:
    backgroundColor: "{colors.roles-primary}"
    textColor: "{colors.text-default-reverse}"
---

## Brand & Style

위버스(Weverse)는 전 세계 팬과 아티스트가 언어·지역 제약 없이 연결되는 **글로벌 팬덤 플랫폼**이다. UI는 결코 주연이 되지 않으며, 콘텐츠와 팬의 목소리를 비추는 **무대(Stage)이자 조력자**로만 존재한다.

- **Mood:** Immersive Connecting Universe
- **Metaphor:** 무대(Stage) · 우주(Universe) · 별빛(에너지) — 일상 UI는 테마 기본 서피스(`{colors.surface-default}`)를 무대로 두고, 그 위에서 팬의 열정(`Spectrum Gradient`)이 별빛처럼 빛나며 `New Mint`(`{colors.roles-primary}`)의 신호로 아티스트와 팬을 연결한다.
  - *Light 모드:* 흰 무대로 콘텐츠 대비를 최대화해 아티스트–팬 연결과 열정을 돋보이게 한다. Elevation은 **shadow 6단계**로 표현.
  - *Dark 모드:* 디바이스 베젤과 동일한 검정으로 화면 경계를 지워 엣지-투-엣지 몰입을 만든다. Elevation은 **surface 4단계** (Lighter is Higher)로 표현 — 그림자가 잘 안 보이는 환경에서 surface 톤이 깊이를 대신한다.
  - *Deep Navy(깊은 우주):* 브랜드 키비주얼·로고·프로모션 비주얼 전용 메타포 색. **UI 서피스·텍스트·아이콘·보더 어디에도 절대 사용하지 않는다** — 브랜드 메타포 색과 UI 색의 영역 분리.
- **Core Values:** 네 가치가 시스템 전반에 시각적으로 발현된다.
  - *Connection(연결):* `{colors.roles-primary}` 액센트 — 한 화면당 Primary CTA 1개로 절제.
  - *Passion(열정):* `Spectrum Gradient` — 정해진 기능 컨텍스트(모먼트·멤버십)에서만 발현되는 별빛, 분위기 도구가 아님.
  - *Discovery(발견):* 여백·타이포 위계·Hub-and-Spoke 진입점으로 표현 — 콘텐츠가 자연스럽게 다음으로 이끈다.
  - *Collective Joy(함께하는 즐거움):* 인터랙션·상태 변화·motion(Easing × Duration)으로 표현 — 보이지 않는 흐름이 함께 있음을 알린다.
세 원칙은 Colors / Spectrum Gradient / Typography / Layout / Elevation & Depth / Shapes / Motion & Transition / Components 전반에 반복 적용된다.

1. **Content-First & Focus** — 콘텐츠 몰입이 1순위. 서피스는 `{colors.surface-default}` 기본, 섹션 구분은 **여백과 타이포 위계**로 표현하고 저투명 `1px` outline(`outline-default-50a` 등)은 보조. 떠오름은 카드·모달·시트에만 elevation, 회색 fill·강한 보더는 사용하지 않는다. `{colors.roles-primary}` 액센트는 **한 화면당 Primary CTA 1개**.
2. **Personalized Connection & Flexibility** — 탐색 비용 최소화. **Hub-and-Spoke**(Hub: 글로벌 홈 / Spokes: 커뮤니티·라이브·커머스)로 분기하고, 모든 화면은 다음 여정 진입점을 **최소 1개** 노출하며 단방향 종착 화면을 만들지 않는다.
3. **Seamless Journey & Standardization** — 동일 경험 공유. **토큰·컴포넌트·레이아웃 룰**을 단일 디자인 언어로 통일하고, 지역·언어별 변형은 **번역 텍스트와 콘텐츠 데이터**에서만 허용한다. 시스템 토큰은 절대 분기시키지 않는다.

## Personas

페르소나는 시스템 결정의 *왜*를 떠받친다. Chord DS는 두 사용자 축을 가진다 — **팬은 무대 앞에서 콘텐츠를 보고 반응하고**, **아티스트는 무대 위에서 콘텐츠를 만들고 팬과 소통한다**. 두 축의 여정과 기대가 다르며, 이 차이가 시각 위계·진입점·정보 밀도 결정에 반영된다.

> 대표 페르소나로 **한국팬 1명**·**고연차 아티스트 1명**을 선정한다. 지역(한·일 등)·연차(저·고) 변형은 마이크로카피와 콘텐츠 데이터에서만 분기하며, **시스템 토큰은 분기하지 않는다** (Brand & Style §3 Seamless Journey & Standardization).

### 팬 (Fan) — 대표: 한국팬

- **역할:** 콘텐츠 소비 + 팬 활동 (moment·게시판·라이브·멤버십·커머스)
- **핵심 목표:** 좋아하는 아티스트와의 연결을 *일상 안에서* 유지한다 — 라이브·moment·게시글 업데이트를 놓치지 않고 빠르게 진입한다.
- **주요 여정:** 글로벌홈(Hub) → 커뮤니티·라이브·커머스(Spokes) → 콘텐츠 소비 → 반응(좋아요·댓글·moment 시청).
- **익숙한 UI 맥락:** 한국 모바일 앱 — 정보 밀도가 높고 빠른 탐색이 가능한 화면에 익숙하며, 시각 절제와 콘텐츠 우선 위계를 자연스럽게 받아들인다.

**시스템 결정에 미치는 영향:**
- **Content-First** — 콘텐츠가 화면의 주연이고, 일반 UI는 흰 무대 + 검정 텍스트 위계로 절제한다. `{colors.roles-primary}` 액센트는 *연결·진입·활성* 신호로만 사용 (한 화면 Primary CTA 1개 원칙).
- **Hub-and-Spoke 진입점 보장** — 모든 화면이 다음 여정의 진입점을 최소 1개 노출하며, 단방향 종착 화면을 만들지 않는다.
- **`moment-gra` = 라이브 ID** — 라이브 중인 아티스트 진입은 모먼트 링 외곽 `moment-gra`로 즉시 알아챌 수 있어야 한다 (분위기·장식 그라데이션 금지 — Spectrum Gradient §1:1 매핑 룰).
- **알림 신호 절제** — Badge_Dot / Badge_Number는 노출하되 *과하지 않게* 한다 — `{colors.roles-primary}`는 *연결* 신호이지 *알림*이 아니다.

### 아티스트 (Artist) — 대표: 고연차 아티스트

- **역할:** 콘텐츠 게시 + 팬 소통 (moment 업로드·라이브 송출·게시글·답글)
- **핵심 목표:** *진짜라고 느껴지는 소통*을 만든다 — 잘 다듬어진 콘텐츠와 일상적 moment 사이의 균형, 팬에게 가까이 다가가는 표현.
- **주요 여정:** 자신의 페이지(콘텐츠 허브) → 게시·라이브·moment 작성 → 팬 반응 확인 → 답글·moment 추가.
- **익숙한 UI 맥락:** 운영팀·매니저와 협업하는 워크플로우. 풍부한 콘텐츠 양·다양성(앨범·콘서트·컴백 사이클)을 가지며 자체 정체성·시각 코드가 이미 강하게 형성되어 있다.

**시스템 결정에 미치는 영향:**
- **아티스트 콘텐츠가 주연** — 아티스트 페이지·moment·라이브 surface는 시스템 색이 *콘텐츠를 가리지 않게* 절제한다. 아티스트 자체 시각 코드(앨범 아트·자체 컬러)는 *콘텐츠 레이어*로 표현되며, 시스템 토큰은 분기하지 않는다.
- **immersive 분리** — 라이브 시청·풀스크린 미디어처럼 *항상 다크인* 몰입 surface는 `system/fixed_color/*`을 사용한다. 일반 UI(아티스트 페이지·App Bar)는 `system/color/*`로 light/dark 자동 전환 (`fixed-color-immersive-only` 룰).
- **콘텐츠 다양성을 받는 위계** — 짧은 텍스트부터 장문, 단일 이미지부터 다중 미디어까지 한 페이지에 공존한다. 타이포 위계(`title`/`headline`/`body`/`caption`)와 카드 포함 위계(`box-200` ⊃ `box-100`)가 이 다양성을 일관되게 받는다.
- **Spectrum Gradient는 기능 식별자만** — 모먼트(`moment-gra`)·멤버십 진입 등 기능 ID로만 사용. 아티스트가 분위기 그라데이션을 원한다면 *콘텐츠 레이어*(앨범 아트·hero 이미지)에서 표현하며, 시스템 그라데이션을 호출하지 않는다.

### 두 페르소나의 관계 — 무대 위 / 무대 앞

팬과 아티스트는 *같은 무대*에 각자의 자리로 있다. 시스템은 두 축에 다른 토큰·다른 컴포넌트를 주지 않는다 — 단일 디자인 언어가 두 축을 함께 받친다. 두 축의 차이는 *기능 가용성*(작성·송출 vs 소비·반응)과 *콘텐츠 레이어*(아티스트 자체 시각 코드)에서만 나타나며, 시각 토큰·컴포넌트·레이아웃 룰은 공통이다 (Seamless Journey & Standardization).

## Colors

> **SoT:** [color.json](./tokens/color.json) — 408 tokens (246 color + 162 fixed_color), light/dark 모드. 위 frontmatter는 curated 18개. curated에 없는 색이 필요하면 반드시 SoT JSON을 열어 확인할 것.

### Palette Philosophy

콘텐츠 최우선의 무대 원칙에 따라, UI 팔레트는 **뉴트럴 베이스 + 단일 Connection 액센트 + 컨텍스트 컬러**의 3층 구조를 유지한다. 화려함은 콘텐츠(아티스트 미디어)와 멤버십 진입 같은 정해진 자리에서만 발현되며, 일반 UI는 검정·회색·흰색의 정보 위계로 구성된다.

- **Layer 1 — Neutral:** 흰 서피스 + 검정/회색 텍스트 위계. 화면의 90% 이상.
- **Layer 2 — Connection Accent:** `{colors.roles-primary}` (New Mint). 한 화면당 1~3 곳, **연결·활성·진입** 신호로만 사용.
- **Layer 3 — Context Color:** 멤버십 purple, Negative red 등 정해진 서비스 컨텍스트에서만 등장하며 일반 영역에 침범하지 않는다.

### Role Tokens

frontmatter `colors`의 curated 18개를 본문에서 다시 정의하지 않는다. 아래는 사용 규칙만 명시한다.

- **Surface** — `{colors.surface-default}`가 모든 화면의 베이스. `{colors.surface-primary}`(민트 틴트)는 outlined-primary pressed·칩 active 등 Connection 액센트가 면으로 필요한 자리에만. 회색 fill 서피스(`surface-default-gray-50`)는 섹션 구분·카드 배경에 사용하지 않으며, 섹션 구분은 여백·타이포 위계·저투명 outline으로 처리한다.
- **Text** — 3단계 위계: `{colors.text-default}`(본문·헤드라인) → `{colors.text-gray-600}`(보조·캡션·메타데이터) → `{colors.text-primary}`(링크·@mention 등 Connection 신호). 어두운 면 위 흰 텍스트는 `{colors.text-default-reverse}`. 본문 텍스트에 mint·purple·gradient는 사용하지 않는다. 더 옅은 회색 위계가 필요하면 SoT의 `text-gray-500` / `text-gray-400` 참조.
- **Outline** — `{colors.outline-default-50a}`(4% 저투명)는 카드·리스트 아이템 구분으로 거의 안 보일 정도가 의도다. `{colors.outline-gray-100}`은 인풋·표준 테두리. 100% 검정 보더가 절대적으로 필요한 경우(다크 모드 카드 윤곽 등)는 SoT의 `outline/default` 토큰을 사용한다.
- **Status** — `{colors.status-hover-primary}`는 `roles-primary`의 hover/pressed, `{colors.status-active-gray-75}`는 ghost 버튼 active. `{colors.roles-negative}`는 **유일한 빨강 신호**(에러·삭제·위험)이며, 다른 빨강을 도입하지 않는다.
- **Button** — 버튼 컬러 토큰(`button-default` / `button-black` / `button-disabled` / `button-hover` / `button-ghost`)의 사용 규칙과 위계는 본 섹션에서 다루지 않는다. [Components/Button](./components/button/button.md) 참조.

> **Spectrum Gradient는 색이 아니라 *기능 식별자*** 이므로 별도 섹션 `## Spectrum Gradient`에서 다룬다. Colors 섹션은 일반 색 토큰만 포함한다.

### Context Colors

멤버십·서비스 컨텍스트는 **자체 팔레트**를 가지며 일반 UI에 침범하지 않는다.

- **Membership** — `membership-violet` / `membership-summer-blue` / `membership-spring-green` 등. FC/Digital 멤버십 진입·뱃지·아바타 링에만 사용. SoT `system/color/roles/membership-*` 참조.
- **Service Context (Jelly 등)** — `{colors.roles-secondary-blue}` 및 `jelly-yellow` / `jelly-orange`. 해당 서비스 영역 내부에서만 사용한다.

### Light / Dark 전략

일반 UI 색은 `system/color/*` 패밀리를 쓰며 light/dark 자동 전환된다. `system/fixed_color/*` 패밀리는 **모드 무관 고정값**(미디어 플레이어·항상 다크인 immersive 컨텍스트 전용)이라 페이지·카드·App Bar 같은 일반 surface에 쓰지 않는다. 본문에서는 토큰 키만 호명하며 hex는 적지 않는다.

- **Light 모드:** 흰 무대로 콘텐츠 대비 최대화. 본문 텍스트는 진검정 위계.
- **Dark 모드:** 디바이스 베젤과 동일한 검정 베이스. **회색 그라데이션 배경은 사용하지 않으며**, elevation은 미세 outline과 `shadow-lg`로만 표현한다 (Lighter is Higher).
- 토큰 light/dark 쌍의 정확한 값은 SoT JSON 양쪽 모드를 모두 확인할 것 (`ai-implementation-rules.dark-mode`).

### Colors — Do & Don't

Do
- 흰 서피스 + 검정 텍스트 위계로 일반 화면을 구성한다.
- `{colors.roles-primary}` 액센트는 **연결·활성·진입** 신호에만 사용한다.
- Membership purple은 멤버십 컨텍스트, Negative red는 위험 신호에만 사용한다.
- 모든 색은 토큰 키로 호명한다 (hex 하드코딩 금지).

Don't
- 회색 fill 서피스(`surface-default-gray-50`)를 섹션 구분·카드 배경에 사용하지 않는다.
- 본문 텍스트·일반 아이콘에 mint·purple·gradient를 적용하지 않는다.
- 한 화면에 Primary CTA(`{colors.roles-primary}` filled)를 2개 이상 두지 않는다.
- Deep Navy를 UI 서피스·텍스트·아이콘·보더 어디에도 사용하지 않는다.
- alpha suffix 토큰(`*-50a` / `*-100a` 등 `-{n}a`는 n% alpha)은 저투명 오버레이용. 솔리드 화면·카드 베이스로 쓰지 않는다.

## Spectrum Gradient

> **SoT:** [color.json](./tokens/color.json) — `Gradient/*` 항목.

> **본질 — 색이 아니라 *기능 식별자*다.** 화면에서 Spectrum Gradient를 본 사용자는 즉시 *"이건 모먼트(혹은 멤버십)구나"* 를 알아채야 한다. 각 그라데이션은 정해진 기능 컨텍스트와 **1:1로 묶여** 있으며, 분위기 표현·장식·placeholder 용도로는 사용하지 않는다.

Brand & Style의 "별빛" 메타포를 시각으로 구현한 그라데이션 패밀리. 컨텍스트별 5개 토큰으로 구성된다. "별빛처럼 빛난다"는 메타포는 본 패밀리와 `{colors.roles-primary}` 액센트로만 구현하며, 장식적 `glow` · `blur` · 광택 · outer-glow 효과는 사용하지 않는다 (overlay backdrop 같은 기능적 blur는 예외).

### 1:1 매핑

| 토큰 | 사용 컨텍스트 (오직 이 자리) | 구성 |
|---|---|---|
| `moment-gra` | 모먼트 링 외곽 — 라이브 중인 아티스트 진입점 | `brand-mint` + `brand-gra-purple` |
| `membership-gra` | FC Membership 진입·hero | `membership-summer-blue` + `membership-violet` |
| `integrated-membership-light-gra` | 통합 멤버십 (Light) 아이콘·이미지 | `spring-green` → `cornflower-blue` → `violet` |
| `integrated-membership-dark-gra` | 통합 멤버십 (Dark) 아이콘·이미지 | `spring-green` → `cornflower-blue` → `violet-2` |
| `membership-digital-gra` | Digital Membership 진입·hero | `daisy-yellow` + `spring-green` |

각 토큰은 위 매핑된 자리에서만 등장한다. 같은 컬러감을 흉내낸 임의 그라데이션을 다른 자리에 만드는 것도 금지 — 시각 문법이 거짓말을 하게 된다 (사용자가 "이게 멤버십인가?"라고 잘못 신호를 읽음).

### 그라데이션과 콘텐츠의 관계

Spectrum Gradient의 *외곽*이 기능 ID라면, 그라데이션이 둘러싼 *안쪽*은 항상 단색 또는 **실제 콘텐츠**다.

- **모먼트 링** — 외곽 = `moment-gra`, 안쪽 = 아티스트 사진. 안쪽에 그라데이션 placeholder 금지 (모먼트는 떴는데 누구의 모먼트인지가 사라짐).
- **멤버십 hero** — 배경 = 매핑된 그라데이션, 위에 얹는 텍스트·아이콘 = 단색.

안쪽까지 그라데이션이면 *"기능 = ID + 주체 = 누구"* 라는 신호가 무너진다.

### Spectrum Gradient — Do & Don't

Do
- 위 매핑된 자리에서만 호출한다.
- 그라데이션이 둘러싼 안쪽은 단색 또는 실제 콘텐츠로 채운다.
- "별빛"은 토큰으로만 표현한다 (장식적 시각 효과 없이).

Don't
- 본문·CTA·상태 표시·일반 아이콘·일반 액센트에 호출하지 않는다.
- 비어 있는 콘텐츠 자리(아바타 placeholder, 게시글 이미지, 아티스트 커버 등)를 그라데이션으로 채우지 않는다 — neutral 단색 또는 `1px outline` 박스로 처리한다.
- 매핑되지 않은 자리에 Spectrum과 비슷한 컬러감의 임의 그라데이션(핑크-퍼플, 블루-그린 wash 등)을 만들지 않는다.
- 본문 텍스트 강조 수단으로 사용하지 않는다 (위계는 사이즈·굵기로만).

## Typography

> **SoT:** [typography.json](./tokens/typography.json) — 71 원자 토큰 (fontSize / lineHeight / fontWeight 별도), ios/aos/web 3-platform 모드. 위 frontmatter는 생산 Figma 기준 조합 스타일 12개. 목록에 없는 스타일 조합이 필요하면 SoT JSON에서 원자 토큰을 조합할 것.
> **참조:** [foundations/typography.md](./foundations/typography.md) — 전체 15개 스타일 매트릭스, weight 명칭, 플랫폼별 적용 코드 예시.

### Typography Philosophy

콘텐츠 최우선의 무대 원칙에 따라, 타이포는 **정보 위계의 기본 골격**이다. 위계는 색이 아닌 **사이즈·굵기·여백**으로 형성하며, 본문에서 색을 강조 수단으로 쓰지 않는다. Connection 신호인 `{colors.text-primary}` mint는 링크·@mention 등 인터랙션 요소에만 등장한다.

### 4 Categories

| 카테고리 | 용도 | 폰트 패밀리 | 사용 weight |
|---|---|---|---|
| **`title`** | 페이지·모달·온보딩 대형 제목 | `font_family/title` | 800(Heavy) 전용 |
| **`headline`** | 섹션 헤더·카드 서브헤딩 | `font_family/title` | 800(Heavy) 전용 |
| **`body`** | 본문·리스트·입력 필드 | `font_family/body` | 400/500/600/700 |
| **`caption`** | 메타데이터·태그·배지 | `font_family/body` | 400/500/700 |

frontmatter curated 12개는 이 4 카테고리에서 가장 자주 쓰이는 조합이다. 전체 스타일 매트릭스(15 스타일)와 weight 명칭(Regular/Medium/Semi Bold/Bold/Extra Bold)은 [foundations/typography.md](./foundations/typography.md) 참조.

### Platform Rules

- **iOS는 모든 fontSize에 +1pt 적용** — `body-m`이 Android/Web 15px이면 iOS 16pt. 누락하면 시각 위계가 무너진다 (`ai-implementation-rules.ios-offset`).
- **Font Family는 카테고리에 따라 자동 매핑**:
  - `body` / `caption` → `font_family/body` (iOS: WeGothicSans / Android: Roboto + Noto Sans KR / Web: Pretendard)
  - `headline` / `title` → `font_family/title` (동일 매핑)
- **영문 헤더·라벨** ("Weverse" 같은 브랜드명, "Now Artist"·"Moments" 같은 영문 섹션 헤더 등)은 **CircularXX TT (weight 900)** 사용. 일반 영문 본문은 카테고리별 패밀리를 따른다.

### 대표 페어링

- **페이지 헤더** — 제목 `{typography.title-m-800}` + 본문 `{typography.body-s-400}`
- **카드 / 서브섹션** — 제목 `{typography.headline-s-800}` + 본문 `{typography.body-s-400}`
- **영문 섹션 헤더** — `{typography.body-lg-700}` + CircularXX TT (예: "Now Artist", "Moments")
- **리스트 아이템** — 제목 `{typography.body-m-700}` + 메타 `{typography.caption-m-400}`
- **댓글 / 작은 본문** — 본문 `{typography.body-xs-400}` + 타임스탬프 `{typography.caption-s-400}`
- **강조 본문** — `{typography.body-s-700}` 또는 `{typography.body-m-500}` (같은 사이즈에서 weight만 강화)

### Typography — Do & Don't

Do
- 카테고리별 용도에 맞는 스타일을 선택한다 (title은 페이지, headline은 섹션, body는 본문, caption은 메타).
- 같은 스타일 내 weight 변화로 강조한다 (예: `body-s-400` → `body-s-700`).
- iOS는 반드시 +1pt 오프셋을 적용한다.
- `font_family/body`와 `font_family/title` 구분을 준수한다.

Don't
- 본문 텍스트에 mint·purple·gradient를 적용해 강조하지 않는다 (위계는 사이즈·굵기로만 표현).
- `headline`·`title`에 weight 800(Heavy) 외 다른 weight를 사용하지 않는다.
- `caption`에 `font_family/title`을 적용하지 않는다.
- iOS에서 Android/Web과 동일한 px 값을 사용하지 않는다 (1pt 오프셋 누락 = 위계 붕괴).
- 임의로 lineHeight를 변경하지 않는다 (토큰의 비율 시스템이 깨짐).

## Layout

> **SoT:** [size.json](./tokens/size.json) — spacing 관련 토큰 (`padding/box` 18단계, `padding/thumb` 별도 패밀리, `margin/screen` 4단계). 위 frontmatter는 curated 13개. `padding-box-25` (2px), `padding-box-400/500/600/800`, 음수 padding 등 curated 외 토큰은 SoT 직접 참조.

### Layout Philosophy

콘텐츠 최우선의 무대 원칙에 따라, **여백은 위계의 1순위 도구**다. 섹션 구분은 색·border·fill이 아니라 *spacing과 타이포 위계*로 만든다. 모든 여백 값은 토큰으로만 호명한다 (px 하드코딩 금지).

### 3 Categories — spacing은 "어디에 들어가는 여백인가"로 분리

| 카테고리 | 토큰 패밀리 | 의미 |
|---|---|---|
| **컴포넌트 내부 (Box)** | `padding/box/*` | 버튼·카드·인풋 등 *기능을 가진 면* 안의 여백. 인터랙티브 표면용. |
| **콘텐츠 미디어 (Thumb)** | `padding/thumb/*` | 사진·영상 같은 *콘텐츠 자체*가 들어가는 면 안의 여백. box와 분리. |
| **화면 좌우 마진 (Screen)** | `margin/screen/*` | 화면(혹은 콘텐츠 컨테이너)의 좌우 *외부* 여백. 페이지 레벨. |

**왜 box와 thumb이 분리되어 있는가** — Shapes의 box/thumb 분리와 같은 정신. *"내가 누른다"*(box)와 *"콘텐츠를 본다"*(thumb)는 서로 다른 시각 신호이며, 토큰 패밀리 레벨에서 분리되어 있다.

### Screen Margin — display 화면 vs end 화면

화면 좌우 마진은 **화면 종류**에 따라 두 모드로 나뉜다.

- **display 화면** (콘텐츠 표시 중심: 홈·더보기·피드·라이브·Shop·커머스 등) → `margin-screen-125` (10px)
- **end 화면** (액션·상세·폼 중심: 설정·약관·입력 등) → `margin-screen-200` (16px)

display는 콘텐츠가 가장자리까지 가까이 다가가 *무대*가 넓어지고, end는 사용자 액션이 화면 안쪽으로 *집중*된다. 콘텐츠 우선·액션 집중이라는 두 모드의 시각 표현이다.

### Responsive — 6단계 viewport

Chord DS는 6개 width를 지원한다.

| 그룹 | width 단계 |
|---|---|
| **APP** (모바일) | 320 / 360 / 393 |
| **Tablet** | 674 / 834 / 1003 |

각 width에서의 콘텐츠 너비 룰(❶ 카드 내 콘텐츠 / ❷ 카드 단위 / ❸ 별도 타입)은 별도 responsive 가이드로 위임한다 — TODO.

### Layout — Do & Don't

Do
- 모든 여백을 토큰으로 호명한다 (`padding-box-200` 등).
- 섹션 구분은 spacing과 타이포 위계로 만든다 (회색 fill 서피스나 강한 보더는 사용하지 않음).
- display 화면과 end 화면의 마진 룰을 구분해 적용한다 (10px / 16px).
- 콘텐츠 미디어 자리는 `padding/box`가 아니라 `padding/thumb`을 호출한다.

Don't
- spacing을 px로 하드코딩하지 않는다 (`px-[10px]` 등 — `margin-screen-125` 같은 토큰을 쓴다).
- display 화면에 16px, end 화면에 10px을 섞어 쓰지 않는다 (룰 불일치).
- 컴포넌트 내부 padding을 마진 토큰(`margin/screen/*`)으로 호출하지 않는다 (역도 마찬가지).
- 토큰 사이의 임의 값(7px, 14px 등)을 만들어 쓰지 않는다.

## Elevation & Depth

> **SoT:** Shadow base variables는 [size.json](./tokens/size.json)의 `size shadow/*`. Dark surface 단계는 [color.json](./tokens/color.json)의 `surface/default-*`. 단계별 시각 spec은 Figma [Chord DS — Drop Shadow](https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA/Chord-Design-System?node-id=6956-40762) 참조. 위 frontmatter는 curated 6개.

### Elevation Philosophy

콘텐츠 최우선의 무대 원칙에 따라, **떠오름은 의미가 있을 때만** 표현한다. 카드·모달·시트처럼 화면에서 분리되어야 하는 면만 elevation을 갖고, 일반 콘텐츠 영역은 평면을 유지한다. *모든 면에 그림자를 두면 무대가 사라진다*.

### Shadow Tokens — 6단계

shadow는 컴포넌트의 *물리적 크기*에 따라 단계가 분리된다.

**Box (Label, Button, 작은 Container) — 4단계:**

| 토큰 | 의미 |
|---|---|
| `shadow-xs-2` | 가장 작은 강조 (작은 라벨·버튼) |
| `shadow-xs-1` | 자주 쓰이는 미세 그림자 (GNB 등) |
| `shadow-xs-3` | 1px gray 라인 + 미세 그림자 결합 (보더 + 그림자 동시) |
| `shadow-s` | 중간 (작은 카드) |

**Box M/L/XL (큰 Container) — 2단계:**

| 토큰 | 의미 |
|---|---|
| `shadow-m` | 큰 컨테이너 |
| `shadow-lg` | **표준 카드** (글로벌홈/커뮤니티 게시글 카드 등) |

**플랫폼 별 분기** — 모든 토큰은 *iOS/PC vs AOS* 별도 base variable로 정의된다. AOS는 Figma 그림자가 다르게 렌더되어 별도 조정값을 갖는다. 사용 시 토큰 호명만 하면 시스템이 자동으로 플랫폼에 맞춰 적용한다.

### Light vs Dark — 비대칭 elevation

Light와 Dark는 elevation을 *다른 방식*으로 표현한다.

| | Light | Dark |
|---|---|---|
| **Surface** | `surface-default` (흰) 단일 베이스 | 4단계 (`default` → `-2` → `-3` → `-4`) |
| **Elevation 1순위** | shadow 6단계 | surface 톤 (**Lighter is Higher**) |
| **Outline 보조** | `outline-default-50a` (4% 검정) | `outline-default-50a` (5% 흰), `outline-default-100a/200a` 등 |

**Lighter is Higher** — Dark에선 검정 베이스에서 멀어질수록(높을수록) surface가 밝아진다. 그림자는 Dark에서도 사용하되 *보조*이고, 1순위는 surface 톤. 같은 토큰명(`surface-default`)도 모드 별로 의미가 약간 다르다 — Light에선 *유일한 베이스*, Dark에선 *4단계 중 가장 낮은 면*.

`default-4` 위에 더 쌓아야 할 때는 *역순*(`default-1` 등)으로 내려간다는 룰이 정의되어 있으나 거의 사용되지 않는다.

### Outline의 elevation 보조 역할

`outline-default-50a` (Light 4% 검정 / Dark 5% 흰)은 카드·리스트 아이템 구분의 *거의 안 보이는* 미세 신호다. shadow나 surface 톤만으로 면 분리가 부족할 때 보조로 사용한다. 자세한 outline 토큰 사용 룰은 [Colors](#colors) 참조.

### Blur

<!-- TODO: 현재 시스템에서 blur는 거의 사용되지 않음. overlay backdrop 같은 기능적 blur 룰, frosted glass 정책 등은 향후 사례가 쌓이면 정의. -->

### Elevation & Depth — Do & Don't

Do
- 분리되어야 하는 면(카드·모달·시트)에만 elevation을 표현한다.
- shadow는 컴포넌트 크기에 맞춰 단계를 선택한다 (작은 단위 = xs/s, 큰 컨테이너 = m/lg).
- Dark에서는 surface 4단계로 elevation을 우선 표현한다 (그림자는 보조).
- 토큰 호명만 한다 (시스템이 플랫폼 별로 자동 분기 적용).

Don't
- 일반 콘텐츠 영역에 그림자를 두지 않는다 (무대 원칙 위반).
- 회색 fill 서피스나 강한 보더로 elevation을 표현하지 않는다.
- shadow를 임의 px 값으로 하드코딩하지 않는다 (`drop-shadow: 0 6 14 ...` 같은 인라인 금지).
- 한 화면에 여러 elevation 단계를 무분별하게 섞어 사용하지 않는다 (위계 흐림).

## Shapes

> **SoT:** [size.json](./tokens/size.json) — radius 관련 토큰 (`radius/box` 9단계, `radius/thumb` 3단계). 위 frontmatter는 curated 8개. seek bar용 `box-25` (2px) 등 curated 외 토큰은 SoT 직접 참조.

### Shapes Philosophy

콘텐츠 최우선의 무대 원칙에 따라, radius는 **시각 위계의 보조 수단**이다. 위계의 1순위는 여백·타이포·레이아웃이며, radius는 *"이건 어떤 종류의 면인가"* 를 빠르게 식별하게 해준다. 임의로 깎지 않고 토큰으로만 호명한다 (hex 하드코딩 금지와 같은 정신).

### 3 Categories — radius는 "면의 종류"를 구분한다

| 카테고리 | 토큰 패밀리 | 의미 |
|---|---|---|
| **인터랙티브·표면 (Box)** | `radius/box/*` | 버튼·카드·모달 등 *기능을 가진 면*. 정적 위계용. |
| **콘텐츠 미디어 (Thumb)** | `radius/thumb/*` | 사진·영상 같은 *콘텐츠 자체*가 들어가는 면. box와 같은 16px이라도 의미가 분리된다. |
| **Capsule (Pill)** | `pill` (9999px) | 아바타·chip·badge·ghost 버튼 등 *완전 둥근 capsule*. 인터랙티브의 특수 형태. |

**왜 box와 thumb가 분리되어 있는가** — 같은 16px이라도 *"내가 누른다"*(box)와 *"콘텐츠를 본다"*(thumb)는 서로 다른 시각 신호다. 카드 안 미디어 썸네일은 `box-200`이 아니라 `thumb-200`을 호출해 *"이건 콘텐츠 영역"* 임을 코드 레벨에서 표시한다.

### 포함 위계 — 큰 면 ⊃ 작은 면

같은 카드 family라도, *카드 안의 카드는 한 단계 작은 radius* 를 쓴다. 이게 "이 면이 저 면 안에 포함된다"를 시각적으로 말해준다.

- **모달·바텀시트** (가장 큰 컨테이너) → `box-300` (24px)
- **표준 카드** → `box-200` (16px)  ← *대표: 글로벌홈/커뮤니티 게시글 카드 (Media Slot, Post Slot)*
- **카드 안 카드** (첨부 모듈, Merch 임베드 등) → `box-100` (8px)
- **작은 라벨·뱃지** (Live Tag 등) → `box-50` (4px)
- **가는 진행 막대** (seek bar 등) → `box-25` (2px)

이 위계는 *"한 단계씩 줄어든다"* 가 핵심이다. 카드 안 카드를 카드와 같은 radius로 두면 위계가 평탄해지고, 두 단계 이상 차이를 두면 어색하다.

### 인터랙티브 표준

| 자리 | 토큰 |
|---|---|
| 버튼 (filled / outlined) | `box-75` (6px) |
| 인풋·체크박스·표준 인터랙티브 | `box-100` (8px) |

작은 인터랙티브에 큰 radius(`box-200` 이상)를 적용하면 "표면"으로 읽혀 인터랙티브 신호가 약해진다.

### Pill — Capsule의 의미

`pill` (9999px)은 *"양 끝이 완전히 둥근 capsule"* 로, 아래 자리에서만 사용한다.

- **아바타** (원형) — 인물의 식별자
- **Chip** (필터·태그) — 인터랙티브 capsule
- **Badge_Dot / Badge_Number** — 표시·카운트
- **Ghost 버튼** — 면적 없는 인터랙티브의 capsule 형태

**SoT 미등록 — 임시 대응:** 현재 SoT(`size.json`)에 `pill` 토큰이 등록되어 있지 않아, 현장에서 `100px` 하드코딩으로 우회 중이다. WDS_tokens에 `radius/pill` 추가 후 일괄 토큰 호출로 전환할 것 (TODO).

### Avatar Shape — 별도 시스템

아바타는 `radius/box`도 `radius/thumb`도 아닌 **avatar 전용 모양 시스템**(Circle / Squircle)을 따른다. [components/avatar.md](./components/avatar/avatar.md) 참조.

### Shapes — Do & Don't

Do
- 토큰 키로만 호명한다 (hex·px 하드코딩 금지).
- 큰 면 ⊃ 작은 면의 포함 위계를 따른다 (한 단계씩 줄어듦).
- 콘텐츠 미디어는 `radius/thumb/*`, 인터랙티브 면은 `radius/box/*`로 분리해 호출한다.
- pill capsule(아바타·chip·badge·ghost 버튼)은 일관되게 100px (SoT pill 등록 후 토큰화).

Don't
- 인터랙티브 면에 `box-0` (sharp)을 사용하지 않는다.
- 카드 안 카드를 카드와 같은 radius로 두지 않는다 (위계 붕괴).
- 작은 인터랙티브(버튼·인풋)에 큰 radius(`box-200` 이상)를 적용하지 않는다.
- 콘텐츠 미디어에 `radius/box`를 호출하지 않는다 (의미 분리 위반).
- 임의 px 값(예: `rounded-[18px]`)으로 토큰 사이의 값을 만들지 않는다.

## Motion & Transition

> **SoT:** _motion 값은 SoT JSON에 토큰화되지 않는다._ 본 섹션의 Easing/Duration이 운영 기준이며, 시각 예시는 [Chord 인터렉션-트랜지션 Figma](https://www.figma.com/design/JuGnWTvXy1reeZqbH5Qhun/) 참조.

위버스의 motion은 Brand & Style의 **무대(Stage)** 원칙을 시간 차원으로 확장하며, 결코 주연이 되지 않고 콘텐츠 몰입을 끊지 않는 **보이지 않는 흐름**으로 존재한다. 모든 motion은 세 원칙으로 작동한다 — **Swift**는 보편적·예측 가능한 트랜지션으로 사용자의 목표 달성 속도를 높이고, **Fluid**는 플랫폼 확장성을 고려한 모듈형 흐름으로 끊김 없는 일관된 경험을 만들며, **Immersive**는 화면과 기능을 유기적으로 연결해 콘텐츠 몰입을 완성한다.

### Easing × Duration

> **시스템 우선** — 플랫폼(iOS/Android/Web)이 해당 인터랙션의 transition을 정의해 두었으면 **시스템 정의를 무조건 따른다**. 아래 값은 시스템에 정의되지 않은 경우의 기본값이다.

각 Easing은 정해진 Duration과 1:1로 묶어 사용한다. **여러 움직임이 동시에 적용될 경우, 동작의 영향을 가장 직접적으로 받는 요소에만 Easing과 Duration을 적용한다** — 다른 요소에 일괄 적용하면 화면이 산만해진다.

| 이름 | Duration | CubicBezier | 사용 영역 |
|---|---|---|---|
| **Ease Out** | Slow `400ms` | `cubic-bezier(0.3, 1, 0.72, 1)` | 화면·요소의 **등장·확대·새로운 변화·나타남** |
| **Ease In Out** | Standard `300ms` | `cubic-bezier(0.65, 0, 0.35, 1)` | **화면 내 요소의 움직임·반복적 움직임** |
| **Ease In** | Fast `200ms` | `cubic-bezier(0.32, 0, 0.7, 0)` | 화면·요소의 **퇴장·축소·사라짐** |

같은 종류의 전환(모달 등장, 시트 등장, 페이지 전환 등)은 항상 같은 Easing/Duration 쌍으로 통일한다 (Fluid 원칙).

### Motion — Do & Don't

Do
- 시스템(플랫폼)이 정의한 transition은 그대로 따른다.
- Easing은 정해진 Duration과 1:1 묶음으로 사용한다 (Ease Out + 400ms 등).
- Easing/Duration은 동작의 영향을 가장 직접적으로 받는 요소에만 적용한다.
- 같은 종류의 전환(모달 등장, 시트 등장, 페이지 전환)은 항상 같은 Easing/Duration 쌍으로 통일한다.

Don't
- motion이 콘텐츠 몰입을 끊거나 주연이 되도록 디자인하지 않는다.
- Easing과 Duration을 임의로 분리하지 않는다 (예: Ease Out + 200ms 같은 임의 조합).
- 한 화면의 여러 요소에 motion을 일괄 적용하지 않는다 (산만함).
- Easing의 `cubic-bezier` 값을 임의로 변형하지 않는다.
- 같은 종류의 전환을 화면마다 다른 Easing으로 구현하지 않는다 (Fluid 위반).

<!-- TODO: 대표 motion 패턴 카탈로그(modal-enter, sheet-up, page-transition, loading 등), 플랫폼별 구현 코드(CSS / SwiftUI / Jetpack Compose), prefers-reduced-motion 대응 룰은 별도 foundations/motion.md로 위임. -->

## Components

> **상세 스펙:** [button.md](./components/button/button.md) · [avatar.md](./components/avatar/avatar.md) · [badge.md](./components/badge/badge.md)
> 위 frontmatter는 curated 대표 컴포넌트(Button 3종, Card, Chip). 전체 variant × state 매트릭스, prop API, 플랫폼별 구현 코드는 각 컴포넌트 문서를 참조할 것.

<!-- TODO: 버튼 3-tier 위계, 상태 규칙, Chip, Card, FAB 설명 -->

## Do's and Don'ts

> 각 섹션(Colors / Spectrum Gradient / Typography / Layout / Elevation & Depth / Shapes / Motion)에 영역별 Do/Don't이 있다. 본 섹션은 **시스템 전체를 가로지르는 핵심 판단 룰**만 추린다.

Do
- **콘텐츠가 주연이 되도록 설계한다** — UI는 무대일 뿐, 면적·강조는 절제한다.
- **컨텍스트 룰을 엄격히 준수한다** — Spectrum Gradient는 매핑된 자리에서만, display/end 화면 마진 분리, `box`/`thumb` 패밀리 분리.
- **Light/Dark 양쪽**을 모두 검증한다 (elevation·outline·surface가 모드별로 비대칭으로 표현된다).
- **단일 디자인 언어**를 유지한다 — 커뮤니티·라이브·커머스의 변형은 콘텐츠 레이어에서만.
- 판단이 애매할 때는 **SoT JSON과 컴포넌트 문서를 직접 참조**한다 (curated frontmatter는 스냅샷일 뿐).

Don't
- 한 화면에 **Primary CTA(`{colors.roles-primary}` filled)를 2개 이상** 두지 않는다 — Connection 액센트는 절제.
- **Spectrum Gradient**를 분위기·장식·placeholder로 쓰지 않는다 — 매핑된 기능 컨텍스트(모먼트·멤버십)에서만.
- **Deep Navy**를 UI 서피스·텍스트·아이콘·보더 어디에도 사용하지 않는다 — 브랜드 메타포 색은 키비주얼·로고·프로모션 비주얼에서만.
- **회색 fill 서피스**나 강한 보더로 면을 구분하지 않는다 — 여백·타이포·미세 outline·shadow로만.
- **본문 텍스트에 색·gradient로 강조**하지 않는다 — 위계는 사이즈·굵기로만 표현.
