# Plan v2: HIG/Android 사용성·접근성 리뷰 워크플로우

> v1 → v2: Codex adversarial review 2회 결과 반영.
> 핵심 변경: 4-state 판정, Figma 도구 fallback, 출처/버전 메타, 충돌-safe 저장, 공용 Skill 위치 확정, 플랜 사본 정리.

## Context

iOS/Android 둘 다 지원하는 서비스의 디자인 산출물을 **HIG (Apple Human Interface Guidelines)** 와 **Material Design (Android)** 기준으로 정적 검토할 워크플로우. 디자이너 본인이 직접 돌리기도 하고, AI Persona (`07_ai-persona/`) 가 자동으로 돌리기도 함.

- 결과물: 체크리스트 (Pass / Fail / N/A / Needs Evidence)
- 입력: Figma URL 또는 스크린샷 (둘 다)
- 범위: 접근성 + 사용성 섹션 분리
- 원칙: **정적 검증 가능 항목만 자동 판정**, 런타임/코드 필요 항목은 `Needs Evidence` 분리

## 폴더 구조

```
private-folder/12_usability-review/
├── .claude/
│   └── skills/
│       └── usability-review/             # 프로젝트 로컬 Skill (이 폴더에서만 사용)
│           ├── SKILL.md
│           ├── checklists/
│           │   ├── ios-accessibility.md
│           │   ├── ios-usability.md
│           │   ├── android-accessibility.md
│           │   └── android-usability.md
│           ├── templates/
│           │   └── report-template.md
│           └── references/
│               ├── hig-summary.md
│               └── material-summary.md
├── assets/                                   # 원본 자료 (스크린샷/영상)
│   └── <screen-name>/
│       ├── light.png
│       ├── dark.png
│       └── a11y.mp4
├── plans/
│   └── 260611-usability-review-workflow.md  ← 이 파일 (원본)
└── reviews/                                 # 리뷰 결과물만
    └── YYYYMMDD-HHMM-<screen-slug>/
        └── result.md
```

## SKILL.md 워크플로우

### 1. 입력
- Figma URL **또는** 스크린샷 경로 (둘 다 가능)
- 화면 이름 + 1-2줄 설명
- 플랫폼: iOS / Android / Both (default: Both)

### 2. 시각 정보 추출 (Figma 도구 fallback)

```
if Figma URL:
    figma-official MCP 사용 가능: get_design_context + get_screenshot
    elif figma-console MCP:       figma_get_component_image + figma_take_screenshot
    elif Framelink MCP:           get_figma_data + download_figma_images
    else:                         사용자에게 스크린샷 첨부 요청

if 스크린샷:
    Read 도구로 이미지 로드
```

특정 도구명 하드코딩 금지. 환경 차이 흡수.

### 3. 체크리스트 — 4-state 판정

플랫폼 × 카테고리 최대 4섹션 순회:
iOS Accessibility → iOS Usability → Android Accessibility → Android Usability

| 판정 | 조건 |
|---|---|
| **Pass** | 정적 입력으로 검증됨 |
| **Fail** | 위반 확인 — 1줄 근거 + 측정값 필수 |
| **N/A** | 화면에 해당 요소 없음 (예: 모달 없으면 모달 체크 N/A) |
| **Needs Evidence** | 정적 입력으로 검증 불가 — 필요한 증거 1줄 명시 |

**Needs Evidence 기본 항목** (스크린샷/Figma 으로 판단 불가):
- VoiceOver 레이블, TalkBack contentDescription (→ 접근성 트리 또는 코드)
- Dynamic Type 동작 (→ 런타임 캡처)
- 시스템 백버튼 동작 (→ 런타임)
- 포커스 순서 (→ 런타임)
- 다크 모드 토글 동작 (→ 런타임, 단 Figma에 다크 화면 있으면 Pass)

**Summary 통계 규칙:**
- Pass rate = Pass / (Pass + Fail) — N/A, Needs Evidence 제외
- Needs Evidence 별도 카운트, 절대 N/A와 합산 금지

### 4. 체크리스트 항목 스키마

각 MD 항목 필드:

```
- rule_id: ios-a11y-touch-target
  title: 터치 타겟 44×44pt 이상
  verifiable_from: screenshot        # screenshot | figma | video | runtime | code
  severity: critical                 # critical | major | minor
  judgment_criteria: 모든 인터랙티브 요소의 hit area가 44×44pt 이상
  source_url: https://developer.apple.com/design/human-interface-guidelines/accessibility
  source_checked_date: 2026-06-11
```

### 5. 결과 출력

경로: `reviews/YYYYMMDD-HHMM-<screen-slug>/result.md`
- slug = 화면 이름 소문자, 공백→`-`, 비ASCII 제거
- 동일 경로 존재 시 `--overwrite` 플래그 없으면 에러 (이력 보존)

```markdown
# Review: <screen-name>
Date: YYYY-MM-DD HH:MM
Input: <figma-url or image-path>
Platforms: iOS, Android
Tools used: <사용된 Figma MCP 명시>

## iOS — Accessibility
- [x] (ios-a11y-touch-target) 터치 타겟 44×44pt — Pass
- [ ] (ios-a11y-contrast) 색상 대비 WCAG AA — Fail: #999/#fff = 2.8:1 (목표 4.5:1)
- [?] (ios-a11y-voiceover-label) VoiceOver 레이블 — Needs Evidence: 접근성 트리 확인 필요

## iOS — Usability
...

## Android — Accessibility
...

## Android — Usability
...

## Summary
- iOS: Pass 8 / Fail 2 / N/A 1 / Needs Evidence 4
- Android: Pass 7 / Fail 3 / N/A 0 / Needs Evidence 4
- Critical fails: 2
- 자동 판정 비율: (Pass+Fail) / 전체 = 65%
```

## 체크리스트 항목 시드

### iOS Accessibility
| rule_id | 판정 기준 | verifiable_from | severity | source |
|---|---|---|---|---|
| ios-a11y-touch-target | 44×44pt hit area | screenshot | critical | [HIG Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility) |
| ios-a11y-contrast | WCAG AA (4.5:1 본문, 3:1 큰 텍스트) | screenshot/figma | critical | [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/#contrast-minimum) |
| ios-a11y-color-only | 색상만으로 상태 구분 금지 | screenshot | major | [HIG Color](https://developer.apple.com/design/human-interface-guidelines/color) |
| ios-a11y-voiceover-label | VoiceOver 접근성 레이블 | runtime/code | major | HIG Accessibility |
| ios-a11y-dynamic-type | Dynamic Type 확대 시 레이아웃 유지 | runtime | major | [HIG Typography](https://developer.apple.com/design/human-interface-guidelines/typography) |

### iOS Usability
| rule_id | 판정 기준 | verifiable_from | severity | source |
|---|---|---|---|---|
| ios-ux-nav-pattern | 탭바/네비바 표준 패턴 | screenshot | major | [HIG Nav Bars](https://developer.apple.com/design/human-interface-guidelines/navigation-bars) |
| ios-ux-system-component | 시스템 컴포넌트 적절 사용 | figma | minor | HIG |
| ios-ux-state-feedback | 로딩/에러/빈 상태 피드백 | screenshot | major | HIG |
| ios-ux-modal-sheet | 모달/시트 사용 적절성 | screenshot | minor | [HIG Sheets](https://developer.apple.com/design/human-interface-guidelines/sheets) |
| ios-ux-gesture-back | 스와이프 뒤로가기 동작 | runtime | major | HIG |

### Android Accessibility
| rule_id | 판정 기준 | verifiable_from | severity | source |
|---|---|---|---|---|
| and-a11y-touch-target | 48×48dp touch target | screenshot | critical | [Material Touch](https://m3.material.io/foundations/designing/structure) |
| and-a11y-contrast | WCAG AA | screenshot/figma | critical | WCAG 2.1 |
| and-a11y-talkback | contentDescription 존재 | code | major | [Material A11y](https://m3.material.io/foundations/accessibility/overview) |
| and-a11y-text-sp | sp 단위 사용, 텍스트 크기 확대 대응 | runtime | major | Material |
| and-a11y-focus-indicator | 포커스 인디케이터 표시 | runtime | major | Material |

### Android Usability
| rule_id | 판정 기준 | verifiable_from | severity | source |
|---|---|---|---|---|
| and-ux-material-comp | Material 컴포넌트 적절 사용 | figma | minor | [Material Components](https://m3.material.io/components) |
| and-ux-nav-pattern | Bottom Nav / Nav Drawer / Tabs 패턴 | screenshot | major | Material |
| and-ux-fab | FAB 사용 목적 적절성 | screenshot | minor | [Material FAB](https://m3.material.io/components/floating-action-button) |
| and-ux-system-back | 시스템 백버튼 동작 | runtime | major | Material |
| and-ux-dark-mode | 다크 모드 대응 (Figma에 둘 다 있으면 Pass) | figma | minor | Material |

## AI Persona 연동

`07_ai-persona/` 위버스 퍼소나가 동일 Skill 호출. SKILL.md 두 모드:
- **인간 모드**: 한 섹션씩 진행, 모호하면 질문 1개
- **AI 모드** (`--auto`): 질문 없이 전 섹션 자동 판정. 모호 = `Needs Evidence` (N/A 금지)

## 구축 단계

1. `workspace/.claude/skills/usability-review/SKILL.md` — fallback + 4-state 규칙
2. 4개 checklist MD — 스키마 필드 완전히 채움
3. `templates/report-template.md`
4. `references/hig-summary.md`, `material-summary.md` — source_url + checked-date 포함
5. 샘플 Figma URL + PNG 각 1건 dry-run → 포맷 보정
6. AI Persona 연동 가이드
7. 플랜 사본 정리: `.claude/plans/enumerated-drifting-garden.md` 삭제

## 검증 기준 (dry-run 완료 조건)

1. Figma URL → `reviews/` 결과 생성 + Tools used 기록
2. PNG → 동일 포맷 결과
3. 같은 화면 재실행 → 충돌 에러 (or `--overwrite` 통과)
4. AI 모드 → `voiceover-label`, `talkback-content-desc` 항목이 Needs Evidence 분류
5. source_url 클릭 → 공식 페이지 도달

## v1 → v2 변경 요약

| # | Codex 지적 | 반영 내용 |
|---|---|---|
| 1 | 공용 Skill 위치 모호 | 프로젝트 로컬 `.claude/skills/` — 이 폴더에서만 사용 |
| 2 | Figma 도구명 하드코딩 | fallback 규칙 (MCP 우선순위 명시) |
| 3 | 자동판정 N/A 함정 | 4-state + Needs Evidence, 통계 분리 |
| 4 | 출처/버전 미고정 | 항목 스키마에 source_url + checked_date |
| 5 | 경로 충돌 | YYYYMMDD-HHMM-slug + overwrite 가드 |
| 6 | 플랜 사본 2개 | 이 파일 1개만 원본 |
