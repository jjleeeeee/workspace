# Chord Design System

Weverse 생태계의 기반 디자인 언어. 음악적 "화음(Chord)" 개념에서 영감을 받아 디자인·개발·팬·아티스트를 연결한다.

> **상태:** Alpha (v0.4.10) — 토큰·브랜드 스펙 정의 단계. 컴포넌트 구현 진행 중.

---

## 저장소 구조

```
chord-design-system/
├── DESIGN.md                    # 브랜드·시스템 전체 스펙 (AI 브리핑 문서, YAML frontmatter 포함)
├── design-md-history/           # DESIGN.md 변경 이력 (log-NN-*.md)
├── tokens/
│   ├── color.json               # 408 color 토큰 (light / dark)
│   ├── size.json                # 66 토큰 — radius, padding, margin, button-height
│   ├── typography.json          # 71 토큰 — fontSize, lineHeight, fontWeight (iOS / AOS / Web)
│   └── typography.semantic.json # 63 시맨틱 토큰 — fontFamily 런타임 스택 + 플랫폼별 resolved 값
├── components/                  # 컴포넌트 스펙 문서 (Markdown)
└── assets/                      # SVG 아이콘 — 16px (270) · 24px (342) · 64px (25)
```

## 핵심 원칙

### 토큰 우선 (Token-First)

모든 시각 속성(색상·간격·반경·그림자·타이포그래피)은 **토큰 키로 호명**한다. hex·px·CSS 원시값 하드코딩은 시스템 일관성을 깨므로 금지한다.

- 정확한 키는 `tokens/` 아래 JSON이 **Source of Truth**다.
- `DESIGN.md` frontmatter의 curated 목록은 스냅샷 — 모르는 토큰은 JSON에서 직접 확인한다.

### 컨텐츠 우선 (Content-First)

UI는 무대다. 아티스트·팬의 콘텐츠가 주연이고 인터페이스는 조력자. 면적·강조는 절제하며, 한 화면당 Primary CTA는 1개.

### Light / Dark 양 모드

`system/color/*` 패밀리는 light/dark 자동 전환. `system/fixed_color/*`는 미디어 플레이어 등 항상-다크 immersive 컨텍스트 전용 — 일반 UI에 사용하지 않는다.

---

## 토큰 빠른 참조

> 정확한 값은 `tokens/` JSON이 **Source of Truth**. 아래는 대표 토큰 키만 — 값은 JSON 직접 확인.

### 대표 색상

| 역할 | 토큰 |
|---|---|
| Brand Mint (CTA·활성) | `roles-primary` |
| 에러·삭제 | `roles-negative` |
| 기본 텍스트 | `text-default` |
| 보조 텍스트 | `text-gray-600` |
| 기본 배경 | `surface-default` |

전체 408개 토큰 → [`tokens/color.json`](tokens/color.json)

### 대표 타이포그래피

| 토큰 | 용도 | size / weight / lh |
|---|---|---|
| `title-m-800` | 페이지 타이틀 | 28px / 800 / 36px |
| `headline-m-800` | 표준 페이지·모달 헤더 | 20px / 800 / 26px |
| `headline-s-800` | 섹션 헤더 | 18px / 800 / 23px |
| `body-m-700` | 강조 본문 | 15px / 700 / 21px |
| `body-s-400` | 기본 본문 | 14px / 400 / 18px |
| `caption-m-400` | 메타데이터 | 12px / 400 / 16px |

> iOS는 모든 fontSize에 +1pt 적용.

### 대표 간격

| 토큰 | 값 | 용도 |
|---|---|---|
| `padding-box-200` | 16px | 표준 gutter, 카드 내부 |
| `padding-box-150` | 12px | 버튼 paddingY |
| `margin-screen-125` | 10px | display 화면 좌우 마진 |
| `margin-screen-200` | 16px | end 화면 좌우 마진 |

### 대표 Radius

| 토큰 | 값 | 용도 |
|---|---|---|
| `box-300` | 24px | 모달·바텀시트 |
| `box-200` | 16px | 표준 카드 |
| `box-100` | 8px | 인풋·카드 안 카드 |
| `box-75` | 6px | 버튼 |

---

## 컴포넌트

각 컴포넌트의 variant × state 매트릭스, prop API, 플랫폼별 구현 코드는 `components/` 아래 `.md` 파일에서 관리한다.

| 컴포넌트 | 경로 |
|---|---|
| Avatar | `components/avatar/avatar.md` |
| Avatar Group | `components/avatar/avatar-group.md` |
| Badge | `components/badge/badge.md` |
| Button | `components/button/button.md` |
| Chatting Fields | `components/chatting-fields/chatting-fields.md` |
| Checkbox | `components/checkbox/checkbox.md` |
| Chips | `components/chips/chips.md` |
| Dialog | `components/dialog/dialog.md` |
| Dropdown | `components/dropdown/dropdown.md` |
| List Item | `components/list-item/list-item.md` |
| Pagination | `components/pagination/pagination.md` |
| Radio | `components/radio/radio.md` |
| Tag | `components/tag/tag.md` |
| Toast | `components/toast/toast.md` |
| Toggle | `components/toggle/toggle.md` |

---

## Spectrum Gradient

기능 식별자 — 정해진 컨텍스트 외 사용 금지.

| 토큰 | 사용 컨텍스트 |
|---|---|
| `moment-gra` | 모먼트 링 (라이브 아티스트 진입점) |
| `membership-gra` | FC Membership 진입·hero |
| `integrated-membership-light-gra` | 통합 멤버십 (Light) |
| `integrated-membership-dark-gra` | 통합 멤버십 (Dark) |
| `membership-digital-gra` | Digital Membership |

---

## 관련 문서

- [`DESIGN.md`](DESIGN.md) — 브랜드·색상·타이포·레이아웃·모션 전체 스펙 + AI 구현 룰 (frontmatter)
- [`design-md-history/`](design-md-history/) — DESIGN.md 변경 이력 로그
- [`CLAUDE.md`](CLAUDE.md) — AI 구현 규칙 및 가이드
- Figma: [Chord Design System](https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA/)
