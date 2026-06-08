# log-04 — gradients/shadows Figma 실측값 추가

**Date:** 2026-05-26c  
**Summary:** Figma effect style 직접 추출 → shadows CSS 값, gradients stop 토큰 참조 추가

## 변경 내용

### shadows
6개 토큰에 Light 모드 CSS `box-shadow` 값 추가. `tokens/size.json` 미등록 — raw 값이 유일 SoT.

| 토큰 | 값 |
|---|---|
| `shadow-xs-2` | `0px 4px 8px 0px rgba(0,0,0,0.06)` |
| `shadow-xs-1` | `0px 2px 12px 0px rgba(0,0,0,0.08)` |
| `shadow-xs-3` | `0px 1px 0px 0px #F2F3F7, 0px 2px 12px 0px rgba(0,0,0,0.08)` |
| `shadow-s`    | `0px 2px 20px -2px rgba(0,0,0,0.08)` |
| `shadow-m`    | `0px 2px 28px -4px rgba(0,0,0,0.12)` |
| `shadow-lg`   | `0px 6px 28px 0px rgba(0,0,0,0.10)` |

### gradients
5개 토큰 구조 변경 (`stops:` + `direction:` + `context:`).  
stop 색은 `color.json` 토큰 참조로 교체 (`{colors.roles-brand-mint}` 등).

| 토큰 | stops | direction |
|---|---|---|
| `moment-gra` | `{colors.roles-brand-mint}` → `{colors.roles-brand-gra-purple}` | 135deg |
| `membership-gra` | `{colors.roles-membership-summer-blue}` → `{colors.roles-membership-violet}` | 180deg |
| `integrated-membership-light-gra` | `#1BBD49` → `{colors.roles-membership-cornflower-blue}` → `#A74EFF` | 126deg (5% 41% 70%) |
| `integrated-membership-dark-gra` | (동일, TODO: dark variant 별도 확인) | 126deg |
| `membership-digital-gra` | `{colors.roles-membership-daisy-yellow}` → `{colors.roles-membership-spring-green}` | 180deg |

## TODO
- `#1BBD49`, `#A74EFF` — color.json 토큰 미매칭. 토큰화 필요.
- `integrated-membership-dark-gra` — Figma에 style 1개만 확인됨. dark variant 별도 정의 여부 확인 필요.

### §Spectrum Gradient 본문 SoT 수정
- 기존: `color.json — Gradient/* 항목` (잘못됨, 해당 항목 없음)
- 수정: `frontmatter gradients: 블록` (합성값·컨텍스트) + `color.json` (stop 색 토큰)
