# Plan: 04 → 03 지침 이동 검토

## Context

`04_wf-figma-to-react-components`의 일부 지침이 Figma 데이터 읽기/해석에 관한
것으로, 이는 `03_wf-figma-to-description`의 도메인과 겹친다.

현재 구조의 문제:
- 04의 rules/에 토큰 해석, 폰트 분류, 네스티드 컴포넌트 발견 절차가 있음
- 03이 이 해석 결과를 YAML에 담아야 하는데, 03에는 해당 판단 기준이 없음
- 결과적으로 03이 작성한 Description YAML이 04가 필요로 하는 정보를 빠뜨릴 수 있음

핵심 의존 관계: 04의 source priority #2가 "Console MCP component description"
→ 03이 Figma Description에 쓴 YAML을 04가 우선 소스로 읽음.
03 YAML이 불완전하면 04는 직접 Figma를 재읽어야 함.

---

## 이동 대상 분석

### 03으로 이동이 적합한 것 (Figma 해석 판단 기준)

| 출처 (04) | 내용 | 이동 이유 |
|---|---|---|
| `rules/token-font-pixel.md` → Fonts 섹션 | `actual-font`, `system-alias`, `token-alias`, `unknown` 분류 체계 | 03 YAML schema에 폰트 섹션이 없음. 분류 결과를 YAML에 담아야 04가 재읽기 불필요 |
| `rules/token-font-pixel.md` → Text Behavior | textAutoResize, overflow, truncation 판단 금지 조건 | 03 YAML에 `text_behavior` 섹션은 있으나 "언제 채우는가" 기준이 부재 |
| `rules/nested-composition.md` → 핵심 규칙 | API만 보고 slot 타입을 확정하지 말 것 | 이 판단이 03의 `composition.uses` 정확도를 결정함 |
| `workflow/figma-source-read.md` → Unpromoted Nested Instance Swap 발견 절차 | child variant depth≥3 읽기로 slot componentSetId 추적 | 03 Step 2에 이 절차 없음 → composition.uses 미완성 위험 |
| `workflow/figma-source-read.md` → Representative Variant Rule | default만 읽지 않고 disabled/color constraint/radius 차이 포함 | 03 Step 2가 variant count만 읽으면 토큰이 누락될 수 있음 |

### 04에 남아야 하는 것 (React 구현 판단 기준)

| 내용 | 이유 |
|---|---|
| `rules/token-font-pixel.md` → alpha token CSS opacity 금지 | CSS implementation rule |
| `rules/token-font-pixel.md` → Pixel Priority (size mismatch는 renderer noise 아님) | CSS/layout implementation rule |
| `rules/asset-classification.md` → ChordIcon 사용, SVG color 보존 | React-specific |
| `rules/nested-composition.md` → CSS scale() 금지, props 매핑 | React-specific |
| `workflow/figma-source-read.md` → MCP 호출 코드, fileKey, depth 파라미터 | 04 구현 환경 특화 |
| 전체 `component-build-loop.md`, `storybook-validation.md` | React/Storybook 구현 전용 |

---

## 권장 실행 방식

### 옵션 A: 03 YAML 스키마 + workflow 보강 (추천)

- 03의 `workflow/description-yaml-schema.md`에 `typography` 섹션 추가
  (font_family, classification: actual-font | system-alias | token-alias | unknown)
- 03의 `workflow/README.md` Step 2에 "Representative Variant Rule" 기준 추가
  (minimum candidates: default, disabled/loading, color constraint variant, visual style variant, radius variant, fixed sample)
- 03의 `workflow/README.md` Step 2에 "Unpromoted Instance Swap 발견 절차" 추가
  (depth≥3 child read → componentSetId 추적)
- 04의 해당 규칙에 "→ 결과는 03 Description YAML에 기록됨" 메모 추가 (중복 삭제는 아님)

**장점**: 03 YAML이 충분히 풍부해져 04가 재읽기를 줄일 수 있음  
**단점**: 03 workflow가 길어짐, 단기 작업량 있음

### 옵션 B: 04에서 참조 링크만 추가

- 04 rules에 "이 판단 기준의 결과는 03 Description YAML에 기록됨" 링크만 추가
- 03은 변경하지 않음

**장점**: 변경 최소화  
**단점**: 근본 문제(03 YAML이 폰트 분류를 안 담음) 미해결

---

## 검증

- 옵션 A 완료 후: 기존 badge, button 등 컴포넌트의 03 YAML에 typography 섹션이
  자연스럽게 채워지는지 시뮬레이션
- 04 `figma-source-read.md`의 Representative Variant Rule과 03의 Step 2가
  동일한 판단 기준을 참조하는지 확인
- `draft-descriptions/` 파일 하나를 열어 font, text_behavior, composition.uses가
  실제로 완성된 형태인지 점검

---

## 영향 파일

| 파일 | 변경 유형 |
|---|---|
| `03_wf.../workflow/description-yaml-schema.md` | `typography` 섹션 추가 |
| `03_wf.../workflow/README.md` | Step 2에 Representative Variant Rule + Instance Swap 절차 추가 |
| `03_wf.../PLAYBOOK.md` | Done Criteria에 typography 체크 추가 (선택) |
| `04_wf.../rules/token-font-pixel.md` | Fonts 섹션에 "→ 03 Description YAML typography에 기록" 메모 추가 |
| `04_wf.../workflow/figma-source-read.md` | Representative/Instance Swap 절차에 "→ 03 Step 2 참조" 메모 추가 |
