# figma-to-components-md 하네스 규칙

## 목적

Figma URL → `shared-component-spec/v1` design.md 자동 생성. 생성-평가 루프(최대 5회)로 품질을 고도화한다.
React/Swift/Kotlin 모든 플랫폼이 참조하는 플랫폼 중립 공유 spec을 산출한다.

---

## 핵심 철학

- **생성-평가 루프**: design.md 생성 → 정적 평가(25개 게이트) → 픽셀 비교(대표 variant) → QA → 수정을 최대 5회 반복
- **회귀 방지**: 이전 루프에서 통과한 항목이 재실패하면 즉시 경고. 연속 2회 회귀 시 루프 강제 종료
- **fixture readonly**: Phase 0에서 1회 생성된 fixture 파일은 SHA256 hash로 잠금. 이후 수정 불가
- **SoT 우선**: 토큰은 `src/tokens/*.json`, 컴포넌트 키는 `src/figma-component-keys/` — 이 파일들이 git-tracked 상태이어야 함

---

## 절대 불변 규칙

1. **합본 design.md는 플랫폼 중립만** — Code Mapping, CSS 결정(font-family 우선순위, sizing CSS), asset export 경로, baseline PNG 경로, visual-registry 항목은 절대 작성 금지. 이들은 React/Swift/Kotlin 각자의 platform binding 파일에서 다룬다.
2. **토큰 id 기반 참조 우선** — `token:system.color.button.black` 형식. `{cds: name}` 허용(ambiguity 없을 때만), raw hex `#RRGGBB` 금지
3. **fixture/ 수정 금지** — `fixture/fixture.lock` 검증이 실패하면 루프를 즉시 중단
4. **회귀 연속 2회 → 즉시 종료** — `terminate_for_regression: true` 이면 루프를 멈추고 FAIL 보고서 출력
5. **design.md 작성 시 CDS 토큰 id 우선** — raw hex 보다 `token:<id>` 참조를 사용. 불확실 시 `source_gaps`에 기록
6. **HTML/React 코드 생성 금지** — generator/qa 에이전트는 design.md 수정 지시만 출력
7. **SoT Preflight 필수** — `python3 scripts/preflight_sot.py` 통과 전 fixture 생성 금지

---

## 산출물 위치 규약

| 단계 | 경로 |
|------|------|
| 루프별 design.md 초안 | `_workspace/drafts/attempt_<N>/<ComponentName>.md` |
| 정적 평가 결과 | `_workspace/reviews/attempt_<N>/harness_result.json` |
| 렌더링 HTML | `_workspace/reviews/attempt_<N>/render.html` |
| 렌더 스크린샷 | `_workspace/reviews/attempt_<N>/render_screenshot.png` |
| 픽셀 diff | `_workspace/reviews/attempt_<N>/diff.png` |
| 픽셀 비교 결과 | `_workspace/reviews/attempt_<N>/pixel_compare_result.json` |
| 루프 인계 | `_workspace/reviews/handoff_<N>.json` |
| 최종 산출물 (PASS) | `_workspace/outputs/<ComponentName>.md` 등 |

fixture 파일은 항상 `fixture/` 에 위치. `_workspace/` 와 절대 혼재 금지.

---

## 평가 게이트 (25개 정적 체크)

| ID | 설명 |
|----|------|
| `text-coverage` | Figma TEXT 노드가 body에 모두 있는지 |
| `color-coverage` | Figma 색상이 YAML colors에 정의됐는지 |
| `typography-coverage` | Figma 타이포그래피가 YAML typography에 정의됐는지 |
| `component-coverage` | Figma INSTANCE가 YAML composition에 정의됐는지 |
| `layout-coverage` | Figma auto-layout이 layout axis에 반영됐는지 |
| `token-colors` | raw hex 미사용, id/cds 토큰 참조하는지 |
| `token-typography` | typography 항목에 `fromCds` 있는지 |
| `broken-ref` | `{colors.xxx}`, `{spacing.xxx}` 참조가 유효한지 |
| `missing-sections` | 필수 섹션 존재 여부 |
| `section-order` | 섹션 순서 준수 여부 |
| `variants-registry-matches-source-of-truth` | variants.registry ↔ variant-keys SoT 정합 |
| `component-identity-matches-index` | frontmatter 식별자 ↔ index.md 정합 |
| `representative-variant-defined` | variants.representative.variant + node_id 존재 |
| `fixture-schema-version` | fixture.meta.json schema_version = v2-representative 또는 v3-capture-contract |
| `representative-screenshot-matches-spec` | fixture screenshot node_id = spec representative node_id |
| `representative-screenshot-scale` | fixture.meta.figma_screenshot.scale == 3 |
| `representative-screenshot-raster-matches` | PNG 실측 크기 == (raster_width, raster_height) |
| `representative-screenshot-css-defined` | css_width/css_height 정수 + 양수 |
| `tokens-id-resolves` | tokens 참조 id가 src/tokens/*.json에 존재 |
| `tokens-id-has-mode-value` | id가 render_mode에서 값 있음 |
| `tokens-name-not-ambiguous` | {cds: name}이 단일 id에만 매핑 |
| `token-catalog-sha256-matches` | src/tokens/*.json sha256 = snapshot 핀 |
| `component-keys-sha256-matches` | index.md/variant-keys sha256 = snapshot 핀 |
| `assets-ref-resolves` | asset_ref가 src/icons/manifest.json에 등록 |
| `assets-ref-file-exists` | manifest file이 src/icons/에 실제 존재 |

시각 게이트: `pixel_sim_effective ≥ 0.85` (`servers/pixel_compare.py`, representative variant만)
SSIM은 참고값으로만 JSON에 포함 (`score_ssim_naive`)

---

## 통과 판정

```
PASS = 정적 all_pass AND pixel_compare.pass (pixel_sim_effective ≥ 0.85)
```

- `pixel_sim_effective`: mask 영역 제외 후 실제 diff 픽셀 비율 기반 게이트 수치
- `score_ssim_naive`: 마스크 미적용 SSIM, 참고값으로만 JSON에 포함
- 정적 PASS 후에도 pixel_sim_effective 미달이면 루프를 계속 진행한다

---

## 에이전트 역할

| 에이전트 | 책임 |
|---------|------|
| `design_md_generator` | shared-component-spec/v1 design.md 생성/수정 (YAML + Markdown 본문) |
| `design_md_renderer` | design.md → HTML 변환 + Playwright 스크린샷 (representative variant만) |
| `design_md_qa` | 픽셀 diff 분석 → design.md 수정 지시 (frontmatter 경로 + body 섹션) |

---

## Python 공통 모듈 (harness/lib/)

서버 스크립트는 중복 로직 없이 이 모듈을 import해 사용한다:

| 모듈 | 책임 |
|------|------|
| `token_resolver` | id/name 기반 토큰 해석, AmbiguousTokenName 예외, src/tokens/*.json 캐시 |
| `component_keys_loader` | index.md + variant-keys/<comp>.md 파싱, 컴포넌트 키 조회 |
| `figma_walker` | figma_raw 노드 순회, variant/text_behavior/asset 수집, 레이아웃 추출 |
| `fix_hints` | fix_hints 포맷터, `[REGRESSION]` 태깅 |
| `handoff` | handoff_N.json 스키마 read/write |
