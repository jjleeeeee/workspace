# design-md-harness

Figma 컴포넌트 URL을 입력받아 `design.md`를 자동 생성하고, **생성-평가 반복 루프**(최대 5회)로 품질을 고도화하는 플러그인.

## 사용법

```
/design-md-harness https://www.figma.com/design/<fileKey>/...?node-id=<nodeId>
```

원하는 디렉토리에서 실행하면 해당 위치에 산출물이 생성됩니다.

## 산출물

| 파일 | 설명 |
|------|------|
| `${COMPONENT_NAME}.md` | 최종 design.md (확장 스펙) |
| `figma_screenshot.png` | Figma 원본 스크린샷 |
| `render_screenshot.png` | 최종 HTML 렌더링 스크린샷 |
| `fixture/` | Figma raw 데이터 (SHA256 고정, readonly) |
| `.harness/` | 루프별 평가 결과 및 handoff 로그 |

## 평가 파이프라인

각 루프마다 아래 체크를 순서대로 실행합니다.

### 정적 체크 (design_md_harness.py)

| 체크 ID | 설명 |
|---------|------|
| `text-coverage` | Figma TEXT 노드 값이 design.md에 모두 존재하는지 |
| `color-coverage` | Figma 색상 fills가 YAML colors에 정의됐는지 |
| `typography-coverage` | Figma 타이포그래피 스타일이 YAML typography에 정의됐는지 |
| `component-coverage` | Figma INSTANCE 노드가 YAML components에 정의됐는지 |
| `layout-coverage` | Figma auto-layout이 layout.axis/kind에 반영됐는지 |
| `token-colors` | raw hex 직접 사용 없이 CDS 토큰 참조하는지 |
| `token-typography` | typography 항목에 `fromCds` 필드가 있는지 |
| `broken-ref` | `{colors.xxx}`, `{typography.xxx}` 참조가 유효한지 |
| `missing-sections` | Overview/Colors/Typography/Layout/Components 섹션 존재 여부 |
| `section-order` | google-labs design.md 섹션 순서 준수 여부 |

### 시각 비교 (pixel_compare.py)

- Figma 스크린샷 vs HTML 렌더링 SSIM 비교 (목표: ≥ 0.85)
- diff.png 생성 (붉은 영역 = 불일치)

> **주의**: Figma MCP `get_screenshot`을 사용해야 정확한 SSIM 비교가 가능합니다.  
> Figma REST API `images` 엔드포인트는 전체 문서 페이지를 반환하므로 SSIM이 낮게 측정됩니다.

## 하네스 제약사항

- `fixture/` 디렉토리: Phase 0에서 1회 생성 후 SHA256 해시로 readonly 강제 (`fixture.lock`)
- 각 루프: `.harness/handoff_N.json`으로 수정 로그 및 통과 항목 기록
- **회귀 방지**: 이전 루프 통과 항목이 재실패하면 `[REGRESSION]` 태그 삽입. 연속 2회 회귀 시 즉시 종료
- 최대 5회 루프

## design.md 스펙

google-labs/design.md 기반 + Weverse CDS 확장:

```yaml
---
version: "alpha"
name: component-name
description: 컴포넌트 설명

colors:
  primary: "{cds: system.color.button.default}"   # CDS 토큰 참조

typography:
  label:
    fontFamily: Pretendard
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.4
    fromCds: "typography.label.medium"             # CDS 타이포그래피 경로 (필수)

components:
  my-component:
    layout:
      kind: stack         # stack | frame | overlay
      axis: horizontal    # horizontal | vertical
      spacing: "{spacing.sm}"
      padding:
        top: "{spacing.sm}"
        right: "{spacing.md}"
        bottom: "{spacing.sm}"
        left: "{spacing.md}"
      alignment:
        main: center
        cross: center
    children:
      - type: icon
        size: 20px
        color: "{colors.primary}"
      - type: text
        value: "레이블"
        typography: "{typography.label}"
---

## Overview
## Colors
## Typography
## Layout
## Components
## Do's and Don'ts
```

## 의존성

첫 실행 시 자동 설치:
- `pyyaml`, `Pillow`, `scikit-image`, `numpy`
- `playwright` + Chromium headless

## 환경 변수

| 변수 | 설명 |
|------|------|
| `FIGMA_TOKEN` | Figma REST API 토큰 (Figma MCP 미사용 시 필요) |

## 플러그인 구조

```
plugins/design-md-harness/
├── .claude-plugin/
│   └── plugin.json
├── commands/
│   └── design-md-harness.md     # /design-md-harness 슬래시 커맨드
├── agents/
│   ├── design_md_generator.md   # design.md 생성 에이전트
│   ├── design_md_renderer.md    # HTML 렌더링 에이전트
│   └── design_md_qa.md          # 시각 QA 에이전트
└── servers/
    ├── design_md_harness.py     # 정적 평가 엔진 (10개 체크)
    ├── pixel_compare.py         # SSIM pixel diff 비교
    ├── playwright_capture.py    # Headless 스크린샷 캡처
    ├── figma_mcp_adapter.py     # Figma MCP JSX → figma_raw.json 변환
    ├── setup.py                 # 의존성 자동 설치
    └── requirements.txt
```
