---
name: usability-review
description: HIG/Android Material Design 기준 정적 사용성·접근성 리뷰. Figma URL 또는 스크린샷 입력 → 4-state 체크리스트 출력 (Pass/Fail/N/A/Needs Evidence). iOS + Android 동시 지원.
---

# Usability & Accessibility Review

## 언제 사용하나
- Figma 화면 또는 스크린샷을 HIG / Material Design 기준으로 검토할 때
- 핸드오프 전 접근성·사용성 체크가 필요할 때
- AI Persona (`--auto`) 가 자동 리뷰 결과를 만들 때

## 실행 방법

```
/usability-review
  [figma-url OR assets/<screen>/file.png]
  [화면 이름]
  [플랫폼: ios | android | both]  ← 생략 시 both
  [--auto]                         ← AI 모드 (질문 없이 전 섹션 자동 판정)
  [--overwrite]                    ← 같은 날짜/화면 재실행 시 덮어쓰기 허용
```

자료 준비: 스크린샷/영상은 `assets/<화면명>/` 에 먼저 넣어두고 경로 전달.

---

## 워크플로우

### Step 1 — 입력 파악

다음을 확인:
1. 입력 소스 (Figma URL / 스크린샷 경로 / 없으면 요청)
2. 화면 이름 (없으면 요청)
3. 플랫폼 (없으면 `both` 기본)

### Step 2 — 시각 정보 추출

**Figma URL 입력 시 — 도구 우선순위 순서대로 시도:**

```
1. figma-official MCP: get_design_context + get_screenshot
2. figma-console MCP:  figma_get_file_data + figma_take_screenshot
3. Framelink MCP:      get_figma_data + download_figma_images
4. 없으면:             사용자에게 스크린샷 첨부 요청
```

사용한 도구명을 result.md `Tools used:` 필드에 기록.

**스크린샷 입력 시:** Read 도구로 이미지 로드.

**영상 입력 시 (video verifiable 항목 검증용):**
```
ffmpeg -i <video_path> -vf "fps=0.5,scale=390:-1" assets/<screen>/frames/frame-%03d.png
```
추출 후 프레임 폴더 경로를 입력으로 사용. 영상 직접 Read 불가.

### Step 3 — 체크리스트 실행

플랫폼 선택에 따라 해당 섹션만 실행:

| 플랫폼 | 실행 섹션 |
|---|---|
| ios | iOS Accessibility → iOS Usability |
| android | Android Accessibility → Android Usability |
| both | iOS Accessibility → iOS Usability → Android Accessibility → Android Usability |

각 섹션의 항목 정의: `checklists/` 폴더 참조.

**4-state 판정 규칙:**

| 판정 | 조건 |
|---|---|
| `[x] Pass` | 정적 입력으로 검증 완료 |
| `[ ] Fail` | 위반 확인 — **1줄 근거 + 측정값 필수** |
| `[-] N/A` | 해당 화면에 요소 자체가 없음 |
| `[?] Needs Evidence` | 정적 입력으로 판단 불가 — **필요한 증거 1줄 명시 필수** |

**Needs Evidence 기본 항목 (스크린샷/Figma 로 판단 불가):**
- VoiceOver 레이블 / TalkBack contentDescription → 접근성 트리 또는 코드
- Dynamic Type 대응 → 런타임 캡처 (텍스트 크기 확대 시)
- 시스템 백버튼 동작 → 런타임
- 포커스 순서 → 런타임
- 다크 모드 토글 동작 → 런타임 (단, Figma에 다크 화면 프레임이 있으면 Pass 가능)

**`--auto` 모드:** 모호한 항목은 절대 N/A 처리하지 말 것. 반드시 `Needs Evidence` 로 분류.

### Step 4 — 결과 저장

경로 생성 규칙:
- `reviews/YYYYMMDD-HHMM-<screen-slug>/result.md`
- slug = 화면 이름 소문자, 공백→`-`, 비ASCII 제거, 특수문자 제거
- 동일 경로 이미 존재 + `--overwrite` 없으면 → **에러 출력 후 중단** (이력 보존)

**입력 자료 위치:** 스크린샷/영상 등 원본 자료는 `assets/` 폴더에 화면 이름으로 정리. 리뷰 실행 시 경로 참조:
```
assets/
├── login/
│   ├── login-light.png
│   ├── login-dark.png
│   └── login-a11y.mp4
└── home/
    └── home-light.png
```

결과 포맷: `templates/report-template.md` 참조.

### Step 5 — Summary 출력

```
## Summary
- iOS: Pass X / Fail X / N/A X / Needs Evidence X
- Android: Pass X / Fail X / N/A X / Needs Evidence X
- Critical fails: X
- 자동 판정 비율: (Pass+Fail) / 전체 = XX%
```

**통계 규칙:**
- Pass rate = Pass / (Pass + Fail) — N/A, Needs Evidence 제외
- Needs Evidence 는 N/A 와 절대 합산하지 않음

---

## 인간 모드 vs AI 모드

**인간 모드 (기본):**
- 한 섹션씩 결과 출력
- 모호한 항목이 있으면 질문 1개

**AI 모드 (`--auto`):**
- 질문 없이 전 섹션 자동 판정
- 모호 = `Needs Evidence` 처리
- 모든 완료 후 result.md 저장 + 경로 출력

---

## 파일 구조 참조

```
.claude/skills/usability-review/
├── SKILL.md                   ← 이 파일
├── checklists/
│   ├── ios-accessibility.md
│   ├── ios-usability.md
│   ├── android-accessibility.md
│   └── android-usability.md
├── templates/
│   └── report-template.md
└── references/
    ├── hig-summary.md
    └── material-summary.md
```
