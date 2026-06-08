# figma-impl

Figma 디자인을 **Web(React) · iOS(SwiftUI) · AOS(Compose)** 세 플랫폼의 코드로 변환하는 Claude Code 플러그인.  
단일 패스 구현 대신 **분석 → 구현 → QA 자동화**의 T0~T6 오케스트레이션 하네스를 따른다.

---

## 목적

| 문제 | 해결 |
|------|------|
| Figma를 보고 직접 코딩 시 DS 토큰 누락·하드코딩이 잦음 | 토큰 Prefetch + Static Check로 CSS/Swift/Compose 토큰 사용률 자동 검증 |
| 플랫폼별 구현 규칙이 산발적 | platform_web / platform_ios / platform_aos SKILL로 규칙을 중앙화 |
| 분석 없이 구현 → 갭 발견 후 재작업 | T1 병렬 분석(design_analyst + mock_state_planner) 완료 전 코드 수정 금지 |
| 구현 후 QA 누락 | T4 ui_qa 에이전트가 스크린샷 + Figma 대비 delta를 자동 보고 |

---

## 사용 방법

### 1. UI 생성 (메인 커맨드)

```
/impl <figma-url> [--platform=web|ios|aos] [--feature=<name>] [--skip-tokens]
```

| 인자 | 필수 | 설명 |
|------|------|------|
| `<figma-url>` | ✅ | Figma 디자인 URL (node-id 포함 권장) |
| `--platform` | 선택 | `web` · `ios` · `aos`. 생략 시 T0에서 확인 |
| `--feature` | 선택 | 기능명. 생략 시 Figma 파일명에서 추출 |
| `--skip-tokens` | 선택 | 토큰 파일이 이미 존재할 때 Prefetch 생략 |

**예시**

```
/impl https://figma.com/design/ABC123/GlobalHome?node-id=1:2 --platform=web
/impl https://figma.com/design/ABC123/Profile --platform=ios --feature=profile
/impl https://figma.com/design/ABC123/Feed --platform=aos --skip-tokens
```

### 2. DS 토큰 사전 준비 (web 플랫폼 전용)

```
/impl-tokens [--platform=web|ios|android] [--output=<path>] [--force]
```

`/impl` 실행 시 web 플랫폼이면 T0.5에서 자동 호출된다.  
토큰 파일이 없는 신규 프로젝트에서 수동으로 먼저 실행할 수도 있다.

| 인자 | 설명 |
|------|------|
| `--platform` | 생략 시 `package.json` / `Package.swift` / `build.gradle` 파일로 자동 감지 |
| `--output` | 기본값 외 다른 경로에 생성할 때 지정 |
| `--force` | 이미 존재하는 토큰 파일 덮어쓰기 |

---

## T0~T6 오케스트레이션 워크플로우

```
T0   Intake              — 플랫폼 감지 + handoff note 작성
T0.5 Token Prefetch      — (web 전용) wds-tokens.css 생성·확인
T1   Parallel Discovery  — design_analyst  ┐ 병렬
                          mock_state_planner ┘
T2   Merge & Gate        — 산출물 병합 + 충돌·갭 확인
T3   Implementation      — 플랫폼별 구현 에이전트 실행
T4   Visual QA           — ui_qa 스크린샷 + Figma delta
T5   Fix Loop            — needs-fix 시 T3+T4 반복 (최대 3회)
T6   Final Report        — 결과 요약 출력
```

> **핵심 원칙**: T1 서브에이전트 두 개가 완료되기 전까지 코드 수정 금지.

---

## 에이전트 구성

| 에이전트 | 역할 | 쓰기 범위 |
|---------|------|----------|
| `design_analyst` | Figma 노드·토큰·갭 분석 | `implementation_brief.md`, `gap_report.md` 만 생성 |
| `mock_state_planner` | 시각 상태 매트릭스 설계 | `scenario_matrix.md` 만 생성 |
| `web_ui_implementor` | React TSX + CSS Module 구현, 하네스 실행 | `src/components/<feature>/` |
| `ios_ui_implementor` | SwiftUI/UIKit 구현 | 해당 Feature 파일 |
| `aos_ui_implementor` | Jetpack Compose 구현 | 해당 Feature 파일 |
| `ui_qa` | 스크린샷 캡처 + Figma 대조 | `qa_report.md`, screenshots/ 만 생성 |

---

## 평가 하네스 (web 전용 자동화)

`web_ui_implementor`는 코드를 생성한 뒤 최대 **3 사이클** 평가 루프를 자동 실행한다.

| 평가 항목 | 기준 | FAIL 시 |
|---------|------|---------|
| Lint | Prettier 오류 없음 | fix_hints → 재생성 |
| Build | `tsc --noEmit` exit 0 | fix_hints 최우선 반영 |
| Static Check — Token | `var(--wds-*)` 사용률 ≥ 95% | 하드코딩 토큰 교체 |
| Static Check — Layout | `expectedLayout` 일치율 ≥ 90% | 레이아웃 수정 |
| Screenshot | Chrome headless PNG 저장 성공 | SKIP 처리 + 사유 기록 |

3회 후에도 FAIL이 남으면 베스트 시도 결과와 미해결 이슈를 함께 보고한다.

---

## 산출물 경로

```
docs/design-brief/<feature>/by-figma/
├── implementation_brief.md   # Figma 분석 + DS 갭
├── gap_report.md             # 토큰·컴포넌트·에셋 갭 목록
├── scenario_matrix.md        # mock state 목록 + fixture 제안
├── harness.json              # 평가 기준 정의 (web)
├── harness_result_1.json     # 1차 평가 결과
├── harness_result_N.json     # N차 평가 결과
├── qa_report.md              # QA 최종 보고
└── screenshots/
    ├── qa_empty.png
    ├── qa_5items.png
    └── ...

src/
└── tokens/
    └── wds-tokens.css        # DS 토큰 (web, impl-tokens 생성)
```

---

## 플랫폼별 QA 도구

| 플랫폼 | 스크린샷 | 시퀀스 QA |
|--------|---------|----------|
| Web | Chrome headless `--screenshot` | URL param / state prop으로 상태 주입 |
| iOS | XcodeBuildMCP `screenshot` | `swipe` · `tap` (ui-automation 활성화 시) |
| AOS | `adb shell screencap` + `adb pull` | ADB 인터랙션 |

---

## QA 판정 기준

| 판정 | 조건 |
|------|------|
| `pass` ✅ | 스크린샷 성공 + Figma 대비 큰 차이 없음 |
| `needs-fix` ⚠️ | 레이아웃·색상·여백 등 시각 차이 발견 |
| `blocked` 🚫 | PRD/Figma 충돌로 판정 불가 — 사용자 결정 먼저 |

`blocked` 상태에서는 Fix Loop 진행 불가. 사용자가 충돌 우선순위를 결정해야 재개된다.

---

## Source Conflict 처리 규칙

PRD · Figma · 기존 코드가 user-visible behavior에서 충돌하면:

1. `implementation_brief.md`에 `source conflict` 항목으로 분리 기록
2. 에이전트가 임의로 한쪽 선택 금지
3. 충돌과 무관한 범위만 선행 구현, 충돌 지점은 보류
4. QA에서 `blocked + prd-design-conflict` 판정 → 사용자 결정 요청

---

## 전제 조건

- **Figma MCP** 연결 (get_design_context, get_screenshot)
- **GitHub 인증** — web 플랫폼 토큰 fetch 시 `gh auth login` 필요
- **iOS**: XcodeBuildMCP 설치 + scheme·simulator 설정
- **AOS**: ADB 연결 + Gradle 빌드 환경
- **Web QA**: Google Chrome 설치 (headless 스크린샷용, 없으면 SKIP)

---

## 자주 발생하는 오류

| 증상 | 원인 | 해결 |
|------|------|------|
| `⚠️ GitHub 인증 필요` | gh auth 미설정 | `! gh auth login` 실행 |
| 토큰 파일이 빈 CSS | cds-catalogs `catalogs/tokens/` 디렉터리 비어있음 | 레포 상태 확인 |
| Screenshot SKIP | Chrome 없음 | Chrome 설치 또는 결과 무시 |
| Fix Loop 3회 후 FAIL | 복잡한 레이아웃 갭 | `gap_report.md`의 갭 항목 수동 확인 |

---

## 파일 구조

```
plugins/figma-impl/
├── .claude-plugin/
│   └── plugin.json
├── commands/
│   ├── impl.md               # /impl 커맨드
│   └── impl-tokens.md        # /impl-tokens 커맨드
├── skills/
│   ├── figma_impl_orchestration/SKILL.md  # T0~T6 오케스트레이터 규칙
│   ├── platform_web/SKILL.md               # Web 플랫폼 sub-rule
│   ├── platform_ios/SKILL.md               # iOS 플랫폼 sub-rule
│   └── platform_aos/SKILL.md               # AOS 플랫폼 sub-rule
└── agents/
    ├── design_analyst.md
    ├── mock_state_planner.md
    ├── web_ui_implementor.md
    ├── ios_ui_implementor.md
    ├── aos_ui_implementor.md
    └── ui_qa.md
```
