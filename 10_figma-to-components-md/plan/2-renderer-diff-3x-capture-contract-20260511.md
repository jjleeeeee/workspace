# Renderer/Diff/3x — 캡처 계약 우선 보강 (Codex Option 1 + 2차 리뷰 반영)

## Context

`10_figma-to-components-md/plan/1-renderer-agent-spec-glimmering-galaxy.md` (이하 "원안")은 사용자가 본 3가지 증상 — (a) assets placeholder, (b) diff.png 단색 오버레이, (c) Figma 1x 캡처 — 을 각각 패치하는 구조. Codex 1차 adversarial review로 **2 blocker** (캡처 계약 부재, metric 계산 버그) 발견. 2차 review로 **추가 4 blocker + 3 high** 발견 — 모두 검증 통과:

| 발견 | 검증 결과 |
|------|----------|
| `orchestrator.md:47` — `fixture.meta.json` 존재 시 Phase 0.5 스킵 | 사실. fixture 부분 삭제 시 새 스키마가 안 돌아감 |
| `pixel_compare.py:94` — `compare_h = min(figma_h, rendered_h)` + crop | 사실. 84×90 vs 600×600 → 84×84로 잘려 우/하단 차이 묻힘. 3x 가도 동일 |
| `CLAUDE.md:21` 절대 불변 규칙 — "asset export 경로 절대 작성 금지" | 원안 `asset_file`/`icon_file` 필드는 정면 위반 |
| `design_md_harness.py` 실제 게이트 21개 vs CLAUDE.md 25개 주장 | 이미 불일치. 원안 "25→28" 수치도 틀림 |

목표: SSIM 점수와 diff.png가 "현실의 차이"와 일치하도록 만들고, 그 위에 SVG 인라인을 얹는다. 단, **shared spec 철학을 어기지 않고**, **fixture 재생성을 원자화**하고, **size mismatch는 숨기지 않는다**.

순서: **Pre-Phase (게이트 감사)** → A(계약) → B(metric) → C(REST 3x + refresh) → D(히트맵) → E(asset/SVG renderer manifest).

---

## Pre-Phase — 게이트 표 정합성 감사 (즉시)

목적: 이후 Phase에서 "게이트 N개 → M개"라고 정확히 말할 수 있도록 baseline을 잡는다.

작업:
1. `servers/design_md_harness.py`의 모든 `check_*` 함수 추출 → 실제 21개. 함수명과 게이트 ID 매핑표 작성
2. `CLAUDE.md` 게이트 표(25개 주장)와 실제 21개 대조 → 누락/추가 분류
3. CLAUDE.md 표를 실제 코드 기준으로 정렬 (게이트 추가 없이 사실관계만 정정)
4. baseline 확정 후 Phase A/B/C/D/E에서 추가될 게이트 수만큼만 갱신

산출물: `_workspace/audit/gate_baseline_20260511.md` (감사 결과)

---

## Phase A — 캡처 계약 고정

### A1. `fixture.meta.json` 스키마 v3
파일: `fixture/fixture.meta.json` + `harness/design-md-spec.md` (figma_screenshot 섹션)

`schema_version`: `"v2-representative"` → `"v3-capture-contract"` (스키마 변경 시 fixture 무조건 재생성).

```json
"figma_screenshot": {
  "source": "figma-rest",          // figma-rest | figma-mcp | manual
  "scale": 3,
  "css_width": 84,                 // figma 노드 absoluteBoundingBox 기준
  "css_height": 90,
  "raster_width": 252,             // 다운로드 PNG 실측
  "raster_height": 270,
  "export_bounds": {               // figma node absoluteRenderBounds (export 시 padding 포함)
    "x": 0, "y": 0, "width": 84, "height": 90
  },
  "node_id": "62973:7591",
  "captured_at": "..."
}
```

규칙:
- `raster_width == round(css_width × scale)` ± 1 (반올림 허용)
- 다운로드 PNG 실측 == `(raster_width, raster_height)` 일치 강제
- 불일치 시 fixture 게이트 FAIL

### A2. `playwright_capture.py`에 device_scale_factor 노출
파일: `servers/playwright_capture.py:38-43`

```python
parser.add_argument("--css-width", type=int, required=True)
parser.add_argument("--css-height", type=int, default=900)
parser.add_argument("--device-scale-factor", type=float, default=3.0)
...
context = browser.new_context(
    viewport={"width": args.css_width, "height": args.css_height},
    device_scale_factor=args.device_scale_factor,
)
```

기존 `--width` 인자는 제거(deprecation 경고 후 다음 PR에서 삭제). 대신 `--css-width`로 강제.

### A3. workflow 인자 분리
파일: `harness/workflow.md` Loop Step D (line 270-285), `.claude/agents/design_md_renderer.md`

renderer Task 인자:
```
css_width:  <fixture.meta.figma_screenshot.css_width>
css_height: <fixture.meta.figma_screenshot.css_height>  # 또는 viewport용 기본 900
device_scale_factor: 3
```

### A4. mask 좌표계 명시
파일: `servers/pixel_compare.py:43-59`, `fixture/image_mask.json`

`image_mask.json`에 메타 추가:
```json
{ "coord_space": "css", "regions": [...] }
```

`build_mask_from_json`의 변환 공식을 코드 주석으로 못 박음:
```python
# coord_space="css" 기준. raster 좌표계로 변환:
#   raster_x = (css_x - export_bounds.x) * scale
#   raster_y = (css_y - export_bounds.y) * scale
#   raster_w = css_w * scale
#   raster_h = css_h * scale
```

`compare_w/compare_h`는 raster 좌표계. `figma_w/figma_h` 인자는 더 이상 region별로 안 받음(메타에서 통일).

### A5. fixture 게이트 추가
파일: `servers/design_md_harness.py`

신규 게이트(Pre-Phase 감사 baseline 위에 +3):
- `representative-screenshot-scale`: `meta.figma_screenshot.scale == 3`
- `representative-screenshot-raster-matches`: 실제 PNG 크기 == `(raster_width, raster_height)`
- `representative-screenshot-css-defined`: `css_width/css_height` 정수 + 양수

CLAUDE.md 게이트 표는 Pre-Phase 결과 + 3개로 갱신 (정확한 절대 수치는 Pre-Phase 완료 후 확정).

---

## Phase B — diff metric 정확화

### B1. size mismatch는 FAIL이 기본 (Codex 2차 #3 반영)
파일: `servers/pixel_compare.py:84-95` (`normalize_images`)

현재 `compare_h = min(figma_h, rendered_h)` 자동 crop은 차이를 숨김. 변경:

```python
def normalize_images(figma, rendered, *, allow_resize=False, allow_crop=False):
    if figma.size != rendered.size:
        if not (allow_resize or allow_crop):
            raise SizeMismatchError(
                f"figma {figma.size} != rendered {rendered.size}. "
                "Use --allow-resize or --allow-crop to override."
            )
        # ... 기존 로직 (명시 옵션일 때만)
    return figma, rendered
```

CLI에 `--allow-resize`, `--allow-crop` 플래그 추가. 둘 다 없으면 mismatch 시 즉시 FAIL.

### B2. mask 적용은 mismatch 결과에만 (Codex 1차 #5)
파일: `servers/pixel_compare.py:192-214`

```python
# 1) 원본에서 픽셀 diff
ssim_naive, _ = compute_ssim(figma_img, rendered_img)             # 참고값 (마스크 미적용)
_, mismatch_mask = compute_pixel_diff(figma_img, rendered_img)

# 2) mask는 mismatch_mask에만 적용
effective_mask = ~image_mask
mismatch_in_effective = mismatch_mask & effective_mask
effective_px = int(effective_mask.sum())

# 3) 진짜 게이트 수치
mismatch_px = int(mismatch_in_effective.sum())
pixel_sim_effective = 1.0 - (mismatch_px / max(effective_px, 1))
```

`apply_mask`(line 64-72)는 **diff PNG 시각화 전용**으로만 호출.

### B3. SSIM은 참고값 강등 (Codex 2차 #4)
- 게이트는 `pixel_sim_effective ≥ THRESHOLD` (기존 0.85)로 변경
- `ssim_naive`는 `pixel_compare_result.json`에 정보 필드로만 노출
- `ssim_effective` 같은 합성 지표는 만들지 않음 (정의 모호)
- `harness/design-md-spec.md` Validation 섹션 + CLAUDE.md "통과 판정"도 동기화

### B4. 회귀 테스트
신규 `tests/pixel_compare_test.py`:
1. self-compare → `mismatch_px == 0`, `pixel_sim_effective == 1.0`
2. effective 영역에 흰 박스 합성 → `mismatch_px > 0`
3. mask 영역에만 흰 박스 합성 → `mismatch_px == 0`
4. size mismatch + 옵션 없음 → `SizeMismatchError`
5. size mismatch + `--allow-crop` → 통과 (기존 동작)

---

## Phase C — Figma REST 3x export + fixture refresh 원자화

### C1. `servers/figma_image_export.py` (NEW) — 2단계 호출
Codex 2차 #1 반영: REST `/v1/images`는 bounds 안 줌. 3개 데이터 소스 조합:

1. `GET /v1/files/:key/nodes?ids=:node_id` → `absoluteBoundingBox`(css_*) + `absoluteRenderBounds`(export_*)
2. `GET /v1/images/:key?ids=:node_id&scale=3&format=png` → render URL
3. 실제 PNG 다운로드 → PIL로 raster_width/height 실측

응답 JSON:
```json
{
  "path": "fixture/figma_screenshot.png",
  "node_id": "62973:7591",
  "scale": 3,
  "css_width": 84, "css_height": 90,
  "raster_width": 252, "raster_height": 270,
  "export_bounds": { "x": 0, "y": 0, "width": 84, "height": 90 },
  "source": "figma-rest"
}
```

에러 케이스 별도 처리:
- `FIGMA_API_TOKEN` 없음 → 명시적 `MissingTokenError`
- `images[node_id] == null` → `ImageRenderFailedError` (메시지에 32MP 한계 안내)
- HTTP 4xx/5xx → 3회 재시도 (exponential backoff), 그 후 `RestApiError`
- 다운로드 PNG 크기 ≠ scale × css size → `RasterSizeMismatchError`

### C2. `scripts/refresh_fixture.py` (NEW) — 원자적 entry point
Codex 2차 #2 반영: 부분 삭제 금지.

```bash
python3 scripts/refresh_fixture.py --component avatar --force --require-figma-api
```

동작 (전부 성공해야 commit, 하나라도 실패하면 rollback):
1. preflight (`scripts/preflight_sot.py --require-figma-api`)
2. fixture/ 전체를 `fixture.bak/`로 이동 (rollback용)
3. Phase 0.5 (컴포넌트 식별) 다시 수행 (figma_raw, expected_nodes 등)
4. Phase 0 (figma_image_export.py 호출 → fixture.meta.json + figma_screenshot.png)
5. image_mask.json 재생성 (figma_raw에서 image/icon 노드 추출 → css 좌표)
6. fixture.lock 재생성 (모든 fixture 파일 sha256)
7. 성공 시 `fixture.bak/` 삭제. 실패 시 `fixture.bak/`를 `fixture/`로 복원.

### C3. workflow Phase 0 교체
파일: `harness/workflow.md:98-130`

기존 MCP `get_screenshot` → `figma_image_export.py` 호출로 교체. 단, 사용자 호출 entry는 항상 `refresh_fixture.py`를 거치도록 안내.

### C4. preflight 분리 (Codex 1차 #7)
파일: `scripts/preflight_sot.py`

`FIGMA_API_TOKEN` 체크는 `--require-figma-api` 플래그가 있을 때만 강제. 평소엔 경고만. offline에서 metric 디버깅/diff 재계산 가능 유지.

---

## Phase D — diff.png 히트맵화 (B 완료 후)

### D1. `compute_pixel_diff` 반환값에 `max_diff_map` 추가
파일: `servers/pixel_compare.py:105-112`

```python
return {
    "mismatch_mask": mismatch,
    "max_diff_map": max_diff.astype(np.float32),  # ∈ [0, 1]
}
```

### D2. `generate_diff_image` 재작성
파일: `servers/pixel_compare.py:156-164`

- 베이스: figma 50% darken (rendered 아님 — figma가 ground truth이니)
- 히트맵 colormap (`max_diff_map` 기반):
  - 0.0–0.1: 투명
  - 0.1–0.3: green (80, 200, 80)
  - 0.3–0.6: yellow (240, 220, 60)
  - 0.6–1.0: red (230, 60, 60)
  - alpha = `min(220, 80 + diff*200)`
- mask 영역: **점선 사각형만** (raster 좌표). Phase A4 변환 공식 사용.

### D3. composite (옵션) — 원안 2-3 그대로

---

## Phase E — assets renderer manifest (A,B,C,D 완료 후)

**핵심 변경**: shared design.md엔 `asset_file` 같은 파일 경로 **금지** (CLAUDE.md:21 절대 불변 규칙 준수). renderer 측 manifest로 분리.

### E1. shared spec 필드 (design-md-spec.md)
`assets.<key>`:
```yaml
asset_kind: icon | image | logo | placeholder      # 의미만
asset_ref: "birthday_hat"                          # 컴포넌트 무관 키 (manifest lookup용)
colorable: true | false                            # gradient/mask 있으면 false 강제
applies_to: "Mode=Birthday"
```
파일 경로 일절 없음. `applies_to`, `size`, `color`(token)만 유지.

### E2. renderer manifest (NEW)
파일: `src/icons/manifest.json`

```json
{
  "schema": "renderer-asset-manifest/v1",
  "icons": {
    "birthday_hat": { "file": "ic_birthdayhat_medium.svg", "default_size": [16,16] },
    "default_thumbnail": { "file": "img_avatar_default_thumbnail.svg", "default_size": [40,40] }
  }
}
```

`asset_ref` → manifest 조회 → 실제 파일 경로 해석. shared spec 오염 없음.

### E3. SVG sanitizer 모듈 (Codex 2차 #8 반영)
신규 `harness/lib/svg_inline.py`:
- root `<svg>`만 width/height 재설정
- 모든 `id`, `url(#...)`, `xlink:href="#..."`, `<use href="#...">` 컴포넌트별 prefix
- 제거: `<script>`, `on*` 속성, `<foreignObject>`, 외부 `href` (`http://`, `https://`, `file://`), CSS `url(http...)`
- `<image href>` 외부 참조 차단 (data: URI만 허용)
- `colorable: true` + 단색 fill/stroke만 currentColor 치환 (gradient/mask 자동 검출 시 false 강제)
- `colorable` 기본값 false (안전 우선)

### E4. renderer 변경
파일: `.claude/agents/design_md_renderer.md` (line 109-114)

```
asset_ref 존재 → src/icons/manifest.json 조회 → file 경로 → SVG Read →
  harness/lib/svg_inline.py로 sanitize → HTML body에 인라인
asset_ref 누락 또는 manifest 미등록 → placeholder span 유지 + assets_inlined에 미포함
```

응답 JSON: `assets_inlined: ["birthday_hat", ...]`, `assets_skipped: ["unknown_ref"]`.

### E5. generator 보강
파일: `.claude/agents/design_md_generator.md`

- `assets` 작성 시 `asset_ref`(컴포넌트 키 형태) + `asset_kind` 채움
- `colorable` 자동 판정: figma_raw 노드에 gradient fill/mask 있으면 false 강제
- 매칭 실패 시 `source_gaps`에 사유 기록

### E6. 게이트
- `assets-ref-resolves`: `asset_ref`가 manifest에 등록돼 있으면 PASS
- `assets-ref-file-exists`: manifest의 file이 `src/icons/`에 실제 존재

---

## 변경 파일 요약

| 파일 | Phase | 변경 |
|------|-------|------|
| `_workspace/audit/gate_baseline_20260511.md` (NEW) | Pre | 게이트 감사 결과 |
| `CLAUDE.md` 게이트 표 | Pre, A5, E6 | 실제 코드 기준 정렬 + 신규 게이트 등록 |
| `fixture/fixture.meta.json` | A1 | schema_version v3 + scale/css/raster/export_bounds |
| `fixture/image_mask.json` | A4 | coord_space:"css" + 메타 래핑 |
| `servers/playwright_capture.py` | A2 | --css-width/--css-height/--device-scale-factor |
| `harness/workflow.md` (98-130, 270-285) | A3, C3 | 인자 분리 + figma_image_export 호출 |
| `harness/design-md-spec.md` | A1, B3, E1 | 스키마 동기화 + asset_ref 정의 |
| `servers/pixel_compare.py` | A4, B1, B2, D1, D2 | 좌표 변환, size FAIL, mask 순서, 히트맵 |
| `servers/design_md_harness.py` | A5, E6 | 신규 게이트 5종 |
| `servers/figma_image_export.py` (NEW) | C1 | 2단계 REST + PNG 실측 |
| `scripts/refresh_fixture.py` (NEW) | C2 | 원자적 fixture 재생성 |
| `scripts/preflight_sot.py` | C4 | --require-figma-api 분리 |
| `tests/pixel_compare_test.py` (NEW) | B4 | metric 회귀 5 케이스 |
| `harness/lib/svg_inline.py` (NEW) | E3 | SVG sanitizer (확장 범위) |
| `src/icons/manifest.json` (NEW) | E2 | renderer asset manifest |
| `.claude/agents/design_md_renderer.md` (109-114) | A3, E4 | css/raster 인자 + manifest 해석 |
| `.claude/agents/design_md_generator.md` | E5 | asset_ref/colorable 자동 판정 |

---

## Verification

**Pre-Phase**
0. `_workspace/audit/gate_baseline_20260511.md` 작성 + CLAUDE.md 게이트 표가 실제 21개와 정합

**Phase A**
1. `python3 servers/playwright_capture.py --css-width 84 --css-height 90 --device-scale-factor 3 ...` → PNG 252×270
2. `fixture.meta.json` validator: 새 필드 6개 + raster ≈ css × scale
3. `image_mask.json`이 `coord_space:"css"` 명시, debug 변환 PNG가 raster 좌표에 맞게 사각형 그림

**Phase B**
4. `pytest tests/pixel_compare_test.py` → 5 케이스 PASS
5. 기존 Avatar fixture로 재실행 → `pixel_sim_effective` 값이 마스크 면적과 무관하게 일관 (이전엔 마스크 클수록 ↑)

**Phase C**
6. `FIGMA_API_TOKEN` 설정 후 `python3 servers/figma_image_export.py --file-key ... --node-id ... --scale 3 --output /tmp/test.png` → 252×270 + 6필드 JSON
7. `python3 scripts/refresh_fixture.py --component avatar --force --require-figma-api` → 전체 fixture 원자적 갱신, 중간 실패 시 `fixture.bak/`에서 자동 복원
8. token 미설정 + `--require-figma-api` 없이 preflight → 경고만, PASS
9. token 미설정 + `--require-figma-api` → FAIL

**Phase D**
10. `_workspace/reviews/attempt_N/diff.png`가 회색 베이스 + green/yellow/red 점들 + mask 점선 사각형

**Phase E**
11. `src/icons/manifest.json` 존재 + `asset_ref:"birthday_hat"`이 정확한 파일로 해석
12. `render.html`에서 birthday hat gradient 살아있음, default thumbnail 인라인됨
13. 동일 SVG 2회 인라인 시 ID 충돌 없음 (브라우저 console 0 error)
14. shared design.md 어디에도 `.svg` 파일 경로 미등장 (CLAUDE.md:21 준수)

**최종 통합**
15. `python3 scripts/refresh_fixture.py --component avatar --force --require-figma-api && /figma-to-md <Avatar URL>` → `pixel_sim_effective ≥ 0.85` + 모든 게이트 PASS + 시각적으로 birthday hat/thumbnail 보임
