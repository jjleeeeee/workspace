# figma-to-components-md

Figma 컴포넌트 URL → **플랫폼 중립 공유 spec (`design.md`)** 자동 생성기.

React / Swift / Kotlin 모든 플랫폼이 참조하는 `shared-component-spec/v1` 형식의 design.md를
Figma 링크 한 방으로 생성한다. 생성-평가 루프(최대 5회)로 정적 게이트(25개) + 픽셀 비교(SSIM ≥ 0.85)를 통과한 최종 spec을 산출한다.

## 사용법

```
/figma-to-md https://www.figma.com/design/<fileKey>/...?node-id=<nodeId>
```

원하는 디렉토리에서 실행. 산출물은 `_workspace/outputs/` 하위에 생성된다.

## 구조

```
.claude/
  agents/         — 역할별 AI 에이전트 (generator / renderer / qa)
  commands/       — /figma-to-md 슬래시 커맨드 오케스트레이터
harness/
  workflow.md     — Phase 0.5 / 0 / Loop 단계별 절차
  orchestrator.md — 단계 호출 순서 + 통과 판정 로직 + 게이트 목록
  design-md-spec.md — shared-component-spec/v1 YAML 스키마 + 토큰 참조 규칙
  lib/            — Python 공통 모듈 (SSOT)
scripts/
  preflight_sot.py — SoT 파일 git-tracked 상태 검증
servers/          — 정적 평가·픽셀 비교·스크린샷 Python 스크립트
src/
  tokens/         — 토큰 SoT (tokens.{color,typography,size}.v1.0.json)
  figma-component-keys/ — 컴포넌트 키 SoT (index.md + variant-keys/)
_workspace/
  drafts/         — 루프별 design.md 초안
  reviews/        — 평가 결과 + handoff
  outputs/        — 최종 산출물 (PASS 시)
fixture/          — Figma raw 데이터 (SHA256 고정, readonly)
```

## 산출물

| 위치 | 설명 |
|------|------|
| `_workspace/outputs/<ComponentName>.md` | 최종 shared-component-spec/v1 design.md |
| `_workspace/outputs/figma_screenshot.png` | 대표 variant Figma 스크린샷 |
| `_workspace/outputs/render_screenshot.png` | 대표 variant HTML 렌더링 |
| `_workspace/outputs/final_report.md` | PASS/FAIL 최종 보고서 |
| `fixture/` | Figma raw 데이터 (SHA256 lock) |

## SoT 파일

이 하네스는 아래 파일이 git-tracked 상태일 때만 동작한다 (`scripts/preflight_sot.py` 검증):

- `src/tokens/tokens.color.v1.0.json`
- `src/tokens/tokens.typography.v1.0.json`
- `src/tokens/tokens.size.v1.0.json`
- `src/figma-component-keys/index.md`
- `src/figma-component-keys/variant-keys/` (1개 이상)

## 의존성

첫 실행 시 자동 설치:
```
!python3 servers/setup.py
```

- `pyyaml`, `Pillow`, `scikit-image`, `numpy`
- `playwright` + Chromium headless

## 플랫폼 중립 원칙

`shared-component-spec/v1` design.md는 **Layer 1 전용**:
- ✅ 포함: Figma 구조, 토큰 참조(id 기반), variant 정보, 레이아웃 측정값, 타이포그래피 분류
- ❌ 제외: Code Mapping, CSS 결정, asset export 경로, baseline PNG, visual-registry

React/Swift/Kotlin 플랫폼별 세부 결정은 각자의 platform binding 파일에서 다룬다.
