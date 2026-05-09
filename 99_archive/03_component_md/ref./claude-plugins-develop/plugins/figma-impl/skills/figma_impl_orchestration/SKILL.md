---
name: figma-impl-orchestration
description: "Figma 기반 멀티 플랫폼 UI 프로토타입 구현 워크플로우. T0~T6 오케스트레이션 — Analysis·Mock 병렬 서브에이전트 → (T0.5 Token Prefetch) → 구현 → 시뮬레이터/브라우저 QA. 서브에이전트 생략을 명시하지 않는 한 단일 패스 구현 금지."
trigger: "figma, generate ui, ui generate, /impl, figma-impl, figma to code, figma ui 생성"
---

# figma-impl-orchestration

Figma 기반 UI 프로토타입을 `오케스트레이터 + 좁은 역할의 서브에이전트`로 분리해서 수행하는 멀티 플랫폼 스킬이다.

w2/slave `.cursor/skills/design-prototype-orchestration/SKILL.md` 기반. iOS 전용에서 Web·iOS·AOS 멀티 플랫폼으로 확장.

## 오케스트레이터 필수 준수

아래는 **권장이 아니라 필수**다. 사용자가 **서브에이전트 생략**을 명시하지 않는 한, 메인 대화 한 번에 "분석 + mock + 구현 + QA"를 몰아서 하지 않는다.

1. **T1 이전에 앱/코드 소스 수정 금지**
   Analysis·Mock Data 산출물이 있기 전에 구현 단계로 넘어가지 않는다.

2. **병렬 발견(T1)은 서브에이전트로 실행**
   `design_analyst`와 `mock_state_planner`를 **동시에** 실행한다. Claude Code에서는 `Agent` 도구로 각각 별도 호출해 병렬 수행.

3. **구현(T3)은 Implementation 역할로 한정**
   UI 코드 변경은 플랫폼별 구현 에이전트에 맡긴다. 오케스트레이터가 직접 대량 편집하지 않는다.

4. **시각 QA(T4)는 QA 역할로 분리**
   빌드·실행·스크린샷·Figma 대조는 `ui_qa` 에이전트로 수행한다.

**시작 전 체크:** "T1 서브에이전트 두 개를 이미 띄웠는가?" → No면 구현 금지.

---

## 플랫폼 감지 (T0)

요청에서 플랫폼을 감지한다:

| 키워드 | 플랫폼 |
|---|---|
| `web`, `react`, `tsx`, `next`, `next.js` | `web` |
| `ios`, `swift`, `swiftui`, `xcode` | `ios` |
| `android`, `aos`, `compose`, `kotlin` | `aos` |

`--platform=<value>` 인자로 명시된 경우 우선.  
감지 불가 시 사용자에게 한 번만 짧게 확인: "어떤 플랫폼으로 생성할까요? (web / ios / aos)"

---

## 에이전트 매핑

| 단계 | web | ios | aos |
|------|-----|-----|-----|
| T1a Analysis | `design_analyst` | `design_analyst` | `design_analyst` |
| T1b Mock | `mock_state_planner` | `mock_state_planner` | `mock_state_planner` |
| T3 Implementation | `web_ui_implementor` | `ios_ui_implementor` | `aos_ui_implementor` |
| T4 QA | `ui_qa` (web mode) | `ui_qa` (ios mode) | `ui_qa` (aos mode) |

---

## 필수 입력

서브에이전트를 띄우기 전에 아래를 handoff note로 정리한다:

- Figma 링크 또는 node id
- 플랫폼 (web / ios / aos)
- PRD / spec 경로 (있으면)
- 기존 코드 경로 (있으면)
- QA 진입 경로:
  - web: `npm run dev` URL (기본 `localhost:5173`)
  - ios: scheme + simulator
  - aos: package + activity
- 검증할 visual state 목록: `empty`, `loading`, `error`, `1-item`, `5-items`, long text, scroll
- PRD와 Figma 충돌 시 우선순위 규칙 (있으면)

---

## 워크플로우

### T0. Intake

요청을 정리해서 handoff note를 만든다. 플랫폼 감지 + platform sub-rule 로드.

### T0.5. Token Prefetch (web 플랫폼 전용)

**web 플랫폼인 경우 T1 이전에 반드시 수행.**

1. `src/tokens/wds-tokens.css` 파일 존재 확인
2. 없으면 `/impl-tokens --platform=web` 실행 (또는 `web_ui_implementor` Step 0에서 자동 수행)
3. 완료 확인 후 T1 진행

iOS/AOS: WDS 모듈이 프레임워크에 포함되므로 이 단계 생략.

### T1. Parallel Discovery

아래 두 역할을 **병렬**로 수행한다:

- `design_analyst` — Figma 분석 (read-only), `implementation_brief.md` + `gap_report.md`
- `mock_state_planner` — visual state 설계, `scenario_matrix.md`

조건:
- 두 에이전트 모두 read-only analysis + artifact 생성만 수행
- write scope 겹치지 않음

### T2. Merge And Gate

두 산출물 합치고 아래 질문에 답할 수 있을 때만 다음 단계로 진행:

- 어떤 파일이 바뀔 가능성이 큰가
- 어떤 state를 로컬 mock으로 재현해야 하는가
- DS token/component 갭이 있는가
- QA entry route가 정의되어 있는가
- unresolved PRD/Figma conflict가 있는가

충돌이 남아 있고 user-visible behavior에 영향을 주면:
- 사용자에게 우선순위 확인 (한 번만)
- 충돌과 무관한 범위만 진행

### T3. Implementation

플랫폼별 구현 에이전트에 아래 입력을 주고 구현한다:

- `by-figma/implementation_brief.md`
- `by-figma/scenario_matrix.md`
- target files / directories
- unrelated cleanup 금지

모든 플랫폼: 좁은 write scope 로 구현. 자동 평가 루프는 T4 QA 단계에서 일괄 수행.

### T4. Visual QA

구현 완료 후 `ui_qa` 에이전트 실행. 모든 플랫폼에서 **자동화 완결 원칙**을 따른다.

#### 시뮬레이터/브라우저/디바이스 QA 자동화 (필수 — `manual-pending` 기본 금지)

**목표:** `qa_report.md` 에 빌드·실행·스크린샷·(필요 시) 시퀀스 근거 없이 `manual-pending` 만 남기지 않는다. 사람에게 "나중에 확인" 을 넘기기 전에 에이전트가 할 수 있는 자동화를 끝까지 수행한다.

1. **빌드·기동** — 플랫폼별 빌드 명령 + 시뮬레이터/브라우저/디바이스 기동까지 자동.
2. **스크린샷** — 시나리오마다 파일 경로를 남긴다 (`docs/design-brief/<feature>/by-figma/screenshots/`). `single-frame-qa` 라도 **최소 1장** 캡처 필수.
3. **Sequence (`sequence-qa`)** — 한 장의 초기 프레임만으로 끝내지 않는다. 계획한 상태마다 캡처. Primary 자동화 도구가 없으면 fallback 으로 동등 검증을 끝까지 시도한다.
4. **상태 전이 증명** — 전이 후 접근성 라벨 또는 UI 스냅샷으로 상태를 증명한다.
5. **Figma 대조** — Figma MCP `get_screenshot` / `get_design_context` 로 비교 대상 확보. 없으면 fileKey + nodeId + 캡처 PNG 경로 명시(캡처는 여전히 필수).
6. **`manual-pending` 허용 조건** — **기본 금지**. 물리 디바이스 전용, 계정·네트워크 등 에이전트 환경으로 재현 불가한 외부 의존이 있을 때만 쓰고, 막힌 이유를 한 줄로 적는다.

#### 플랫폼별 도구 매핑

| 단계 | iOS | Web | AOS |
|------|-----|-----|-----|
| 빌드·기동 | XcodeBuildMCP `build_run_sim` (또는 `xcodebuild` + `xcrun simctl launch`) | `npm run dev` 백그라운드 | `./gradlew assembleDebug` + `adb shell am start` |
| 스크린샷 | XcodeBuildMCP `screenshot` / `xcrun simctl io booted screenshot` | headless Chrome `--screenshot` | `adb shell screencap` + `adb pull` |
| Sequence 자동화 | `ui-automation` `swipe`/`tap`/`snapshot_ui`. **Fallback: AXe CLI** (`xcodebuildmcp` npm 패키지의 `bundled/axe`) | **Playwright** 또는 **Chrome DevTools Protocol** | `adb shell input swipe` / `input tap` / `input keyevent` |
| 상태 전이 증명 | `describe-ui` / 접근성 라벨 | DOM snapshot / `aria-*` / `data-testid` 어서션 | `adb shell uiautomator dump` content-desc |
| Figma 대조 | Figma MCP `get_screenshot` | (동일) | (동일) |

#### QA 모드

- `single-frame-qa`: 정적 화면 위주
- `sequence-qa`: carousel, tab, scroll, swipe 등 상태 전이가 디자인 검증에 필요한 경우. gesture-heavy screen 이면 sequence plan 을 먼저 작성한 뒤 실행.

### T5. Fix Loop

QA 결과가 `needs-fix`면 T3 + T4만 반복. 기존 T1 산출물 재사용.

`blocked` + `prd-design-conflict`이면 fix loop 진행 불가 — 사용자 결정 먼저.

### T6. Final Report

```
## UI 생성 완료 (by-figma)

- 플랫폼: <platform>
- 구현 내용: <요약>
- 검증한 상태: <state 목록>
- 스크린샷: <경로>
- Known gap: <있으면 목록>
- prototype-ready: yes / no
```

---

## Artifact 경로

```
docs/design-brief/<feature>/by-figma/implementation_brief.md
docs/design-brief/<feature>/by-figma/gap_report.md
docs/design-brief/<feature>/by-figma/scenario_matrix.md
docs/design-brief/<feature>/by-figma/qa_report.md
docs/design-brief/<feature>/by-figma/screenshots/
```

---

## Source Conflict 규칙

PRD, Figma, 디자인 가이드, 기존 구현이 충돌할 때:

- 분석 단계에서 `source conflict` 명시
- user-visible behavior에 영향 → decision gate
- QA에서 임의 pass/fail 판정 금지
- `qa_report.md`에 `blocked` + `prd-design-conflict` 기록

---

## QA 자동화 원칙 (manual-pending 기본 금지)

- `qa_report.md`에 **빌드 성공 + 스크린샷 경로** 없이 끝내지 않는다
- sequence-qa 화면은 초기 프레임 1장으로 통과 처리 금지
- Primary 자동화 도구가 없을 때 즉시 포기하지 않고 fallback (AXe / CDP / `adb input` 등) 으로 동등 검증 시도
- 에이전트 환경으로 재현 불가한 외부 의존이 있을 때만 `manual-pending` 허용, 사유 1줄 명시

---

## Common Mistakes

- 오케스트레이터가 서브에이전트 없이 단일 패스로 구현까지 끝냄 (최빈 위반)
- web 플랫폼에서 T0.5 Token Prefetch 생략 → 하드코딩 값으로 구현됨
- mock state 정의 전에 구현 시작
- PRD와 디자인 충돌 시 에이전트가 임의로 한쪽 선택
- sequence screen을 스크린샷 1장으로만 검증
- Primary 자동화 도구(XcodeBuildMCP `ui-automation`, Playwright, ADB) 가 없다고 즉시 `manual-pending` 처리 — fallback 으로 동등 검증을 끝까지 시도하지 않음
