# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 저장소 개요

**Chord Design System**은 Weverse 생태계의 기반 디자인 언어다. 음악적 "화음(Chord)" 개념에서 영감을 받아 디자인·개발·팬·아티스트를 연결한다. 현재 상태는 **alpha (v3)** — 토큰 JSON, 브랜드 스펙 문서(DESIGN.md), 컴포넌트 디렉터리 골격만 존재하며 빌드 시스템이나 패키지가 없다.

## 구조

```
chord-design-system/
├── DESIGN.md              # 브랜드·시스템 전체 스펙 (AI 브리핑 문서, YAML frontmatter 포함)
├── tokens/
│   ├── color.json         # 408 color 토큰 (light/dark 양 모드)
│   ├── size.json          # 66 토큰 (radius, padding, margin, button-height, shadow)
│   └── typography.json    # 71 토큰 (fontSize/lineHeight/fontWeight, 3-platform)
├── components/            # 컴포넌트별 서브디렉터리 (현재 파일 없음)
│   ├── button/            # button.md 예정
│   ├── avatar/            # avatar.md 예정
│   └── badge/             # badge.md 예정
└── assets/                # SVG 아이콘 (16px·24px·64px 그리드)
```

## 토큰 시스템

### Source of Truth (SoT)

모든 디자인 결정의 최종 근거는 `tokens/` 아래 JSON 파일이다. `DESIGN.md` frontmatter의 curated 목록은 스냅샷이므로 정확한 키와 값은 반드시 JSON에서 확인한다.

- `color.json` — `system/color/*` (light/dark 자동 전환) + `system/fixed_color/*` (모드 무관 고정값)
- `size.json` — `radius/box/*`, `radius/thumb/*`, `padding/box/*`, `padding/thumb/*`, `margin/screen/*`, `size shadow/*`
- `typography.json` — `fontSize/*`, `lineHeight/*`, `fontWeight/*` 원자 토큰 (ios/aos/web 3-platform)

### 토큰 네이밍 규칙

JSON 키 `system/color/{category}/{name}` → 호명 시 `{category}-{name}` (예: `system/color/text/default` → `text-default`).

## 핵심 구현 규칙 (AI Implementation Rules)

이 규칙들은 `DESIGN.md` frontmatter `ai-implementation-rules`에 정의되어 있으며, 위반 시 시스템 일관성이 깨진다.

1. **token-first** — 모든 시각 속성(color·spacing·radius·shadow·typography·border)은 토큰 키로 호명. hex·px·CSS 값 하드코딩 금지. 토큰명을 모르면 SoT JSON에서 찾는다 (추정 금지).

2. **library-first** — 아이콘·divider·dot·chevron 포함 모든 시각 요소는 라이브러리 컴포넌트 인스턴스로 만든다. vector/shape 직접 작성 금지.

3. **alpha-suffix-overlay-only** — `-{n}a` 접미사 토큰(`-50a`, `-100a` 등)은 n% alpha 오버레이 전용. 페이지 background·카드 surface·primary 텍스트 등 솔리드 면에 절대 사용 금지.

4. **fixed-color-immersive-only** — `system/fixed_color/*`는 미디어 플레이어·항상 다크인 immersive surface 전용. 일반 UI(페이지·카드·App Bar·GNB·시트·바텀 내비게이션)에 사용 금지. 일반 UI는 `system/color/*` 사용.

5. **page-title-hierarchy** — 페이지 최상위 타이틀은 `title` 또는 `headline` 카테고리(weight 800)만. 큰 페이지 타이틀 → `title-m-800` (28px), 표준 페이지/모달 → `headline-m-800` (20px), 섹션 헤더 → `headline-s-800` (18px).

6. **dark-mode** — 모든 색상은 light/dark 쌍. JSON에서 양쪽 모드를 반드시 확인.

7. **ios-offset** — iOS fontSize는 Android/Web 대비 항상 +1pt 적용.

8. **sot-is-json** — curated frontmatter에 없는 토큰이 필요하면 반드시 SoT JSON을 열어 정확한 키를 확인. "비슷해 보이는 이름"으로 추정 호명 금지.

## 색상 사용 원칙

- **일반 UI surface** → `system/color/*` (light/dark 자동 전환)
- **솔리드 면 베이스** → alpha 없는 토큰 (`surface-default`, `text-default`)
- **오버레이** → alpha suffix 토큰 (`outline-default-50a` 등)
- **immersive/미디어 플레이어** → `system/fixed_color/*`
- **Primary CTA** → 한 화면당 1개 (`roles-primary` filled)
- **Spectrum Gradient** → 매핑된 기능 컨텍스트(모먼트 링: `moment-gra`, FC 멤버십: `membership-gra` 등)에서만. 장식·분위기·placeholder 용도 금지.

## Typography 원칙

| 카테고리 | 용도 | weight |
|---|---|---|
| `title` | 페이지·온보딩 대형 제목 | 800 전용 |
| `headline` | 섹션 헤더·카드 서브헤딩 | 800 전용 |
| `body` | 본문·리스트·입력 필드 | 400/500/600/700 |
| `caption` | 메타데이터·태그·배지 | 400/500/700 |

- iOS: 모든 fontSize에 +1pt 적용
- 영문 헤더·라벨(브랜드명, 섹션 헤더): **CircularXX TT (weight 900)**
- `body`/`caption` → `font_family/body`, `headline`/`title` → `font_family/title`

## Spacing 원칙

- `padding/box/*` — 버튼·카드·인풋 등 기능을 가진 면 안의 여백
- `padding/thumb/*` — 사진·영상 콘텐츠 면 안의 여백
- `margin/screen/*` — 화면 좌우 외부 마진
  - display 화면 (홈·피드·라이브·커머스 등): `margin-screen-125` (10px)
  - end 화면 (설정·약관·폼 등): `margin-screen-200` (16px)

## Radius (Shapes) 원칙

- `radius/box/*` — 인터랙티브 면 (버튼·카드·모달)
- `radius/thumb/*` — 콘텐츠 미디어 면 (같은 16px이라도 box와 의미 분리)
- pill — 아바타·chip·badge·ghost 버튼 (현재 SoT 미등록, 임시 100px 사용)
- 포함 위계: 모달·바텀시트(`box-300`) ⊃ 표준 카드(`box-200`) ⊃ 카드 안 카드(`box-100`) ⊃ 작은 라벨(`box-50`)

## Elevation (Shadow) 원칙

- Light: shadow 6단계로 elevation 표현 (`shadow-xs-2` → `shadow-lg`)
- Dark: surface 4단계로 우선 표현 (**Lighter is Higher**), shadow는 보조
- shadow를 inline px 값으로 하드코딩 금지

## Motion 원칙

| Easing | Duration | 사용 |
|---|---|---|
| Ease Out `cubic-bezier(0.3,1,0.72,1)` | 400ms (Slow) | 등장·확대·나타남 |
| Ease In Out `cubic-bezier(0.65,0,0.35,1)` | 300ms (Standard) | 화면 내 이동·반복 |
| Ease In `cubic-bezier(0.32,0,0.7,0)` | 200ms (Fast) | 퇴장·축소·사라짐 |

- 플랫폼 시스템 정의가 있으면 무조건 따름
- Easing은 정해진 Duration과 1:1 묶음 사용. 임의 조합 금지.

## 컴포넌트 문서 참조

컴포넌트 상세 스펙(variant × state 매트릭스, prop API, 플랫폼별 구현 코드)은 각 컴포넌트 `.md` 파일에서 관리한다:
- `components/button/button.md` — 6 variants × 4 states
- `components/avatar/avatar.md` — 11 sizes, Circle/Squircle, Ring/Badge
- `components/badge/badge.md` — Badge_Dot (3 sizes) + Badge_Number
