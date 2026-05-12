# Renderer · Diff · 3x Screenshot 워크플로우 보강

## 원 요청 (사용자 원문)

> 1. renderer agent spec + design.md assets에 `icon_file` 필드 추가가 필요.
> 2. diff가 이렇게 나오면 안될듯. 내가 아는 픽셀 디프는 https://zenn.dev/saqoosha/articles/pencil-ai-design-with-claude-code 에 나오는 방식이었음 (픽셀 diff 히트맵 방식)
> 3. Figma 스크린샷도 3배수로 찍어야함.
>
> 이 내용을 반영하는데 워크플로우 수정이 필요한가?

첨부 이미지:
- Image #1 — 현재 `_workspace/outputs/diff.png`: 마스크 영역 전체에 단색 파란 사각형이 덮여 있어 차이 위치/강도 식별 불가.
- Image #2 — 현재 `_workspace/outputs/figma_screenshot.png`: 84×90 px(1배수) 자연 크기, 렌더 결과(3배수) 대비 픽셀 밀도 미달.

## Context

Avatar 컴포넌트 첫 루프(SSIM 0.9993, 20/20 정적 통과) 종료 직후, 사용자가 세 가지 후속 개선을 요청했다. 모두 "통과는 했지만 신뢰할 수 있는 비교가 아니다"라는 동일한 뿌리에서 나온다.

1. **assets 렌더 한계** — 현재 renderer는 `assets.<key>`를 회색 placeholder span으로만 그린다. `src/icons/`에 375개 SVG를 이미 가지고 있는데도 활용하지 못해, Figma의 실제 비주얼(birthday hat, default thumbnail, plus 아이콘 등)이 render에 빠진다. SSIM은 마스킹 덕분에 높게 나오지만 시각 검수는 의미가 없다.
2. **diff.png가 단색 파란 사각형** — `pixel_compare.generate_diff_image`가 마스크 영역(이미지·아이콘) 전체에 `[0,100,255,80]` 단일 색을 덮어버린다. 어디가 얼마나 어긋났는지 눈으로 못 본다. 사용자 레퍼런스([zenn.dev/saqoosha pencil-ai-design-with-claude-code](https://zenn.dev/saqoosha/articles/pencil-ai-design-with-claude-code))처럼 **차이 강도(green→yellow→red) 히트맵**이 필요하다.
3. **Figma 스크린샷 1배수** — `mcp__figma-official__get_screenshot`은 84×90 같은 natural size를 그대로 반환한다. render는 `deviceScaleFactor=3`로 찍히므로 SSIM 비교 시 한쪽이 흐릿한 상태로 정렬돼 정밀한 회귀를 잡지 못한다. Figma REST `/v1/images?scale=3`로 강제 3배 추출이 유일한 해법(`FIGMA_API_TOKEN` 필요).

세 변경 모두 fixture/spec/agent 레이어를 가로지르므로 한 번에 묶어 처리한다.

---

## Issue 1 — `assets.<key>.icon_file` 도입 + renderer SVG 인라인

**목적**: design.md가 `src/icons/<file>.svg`를 명시적으로 참조하고, renderer가 placeholder 대신 실제 SVG를 인라인 렌더하도록 한다.

### 1-1. spec 변경 — `harness/design-md-spec.md`

`assets.<key>` 항목에 선택 필드 추가:

```yaml
assets:
  birthday_hat:
    role: icon
    size: { width: 16px, height: 16px }
    color: { token: "token:system.color.icon.primary" }
    icon_file: "ic_birthdayhat_medium.svg"   # NEW — src/icons/ 기준 상대 경로
    applies_to: "Mode=Birthday"
```

규칙:
- `icon_file`은 `src/icons/` 디렉터리 안 파일명만 허용(절대 경로/`..` 금지).
- `role: icon` 또는 `role: image` 일 때만 유효. `role: emoji`는 적용 안 함.
- 누락 가능(=fallback placeholder). 누락 시 generator가 `source_gaps`에 기록.

### 1-2. generator 보강 — `.claude/agents/design_md_generator.md`

`assets` 작성 절차에 한 줄 추가: "vector/instance 자식이 가리키는 main component name을 `src/icons/index.json`(있으면) 또는 `src/icons/` 파일명 매칭으로 조회해 `icon_file`을 채운다. 매칭 실패 시 비워두고 `source_gaps`에 사유 기록."

### 1-3. renderer 변경 — `.claude/agents/design_md_renderer.md` (lines 109–114)

기존 placeholder span 규칙을 다음으로 교체:

```
role: "icon" 또는 "image" + icon_file 존재 →
  servers_root/../src/icons/<icon_file> Read →
  SVG 본문에서 width/height 속성을 frontmatter size 값으로 치환 →
  fill="currentColor" 또는 stroke 위치에 color 토큰 해석값 주입 →
  HTML body에 인라인 삽입 (외부 <img> 금지: 외부 의존성 금지 규칙 유지)

icon_file 누락 →
  기존 placeholder span (회색 사각형) 유지
```

검증: renderer 응답 JSON에 `assets_inlined: ["birthday_hat", "default_thumbnail"]` 필드 추가.

### 1-4. 정적 게이트 추가 (선택)

`servers/design_md_harness.py`에 `assets-icon-file-exists` 체크: `icon_file`이 채워졌으면 실제 파일이 `src/icons/`에 존재해야 PASS.

---

## Issue 2 — diff.png를 히트맵으로 교체

**목적**: 픽셀 차이의 **위치+강도**가 한눈에 보이는 시각 산출물 만들기. matplotlib 없이 numpy+PIL만으로 처리.

### 2-1. `compute_pixel_diff` 반환값 확장 — `servers/pixel_compare.py:105-112`

현재 max_diff(per-pixel intensity)를 버리고 boolean mismatch만 반환. 이를 다음으로 변경:

```python
return {
    "mismatch_mask": mismatch,          # 기존 bool array
    "max_diff_map": max_diff.astype(np.float32) / 255.0,  # NEW (H, W) ∈ [0,1]
    "score_ssim": ssim_score,
    ...
}
```

### 2-2. `generate_diff_image` 재작성 — `servers/pixel_compare.py:156-164`

블루 단색 오버레이 제거 후:

1. 베이스: `figma.png`를 50% 밝기로 darken(컨텍스트 유지).
2. 히트맵: `max_diff_map`을 다음 colormap으로 RGBA 변환
   - 0.0 ~ 0.1: 투명
   - 0.1 ~ 0.3: green `(80, 200, 80, alpha)`
   - 0.3 ~ 0.6: yellow `(240, 220, 60, alpha)`
   - 0.6 ~ 1.0: red `(230, 60, 60, alpha)`
   - alpha = `min(220, 80 + diff*200)` — 강도 비례
3. 마스크 영역(`image_mask`): 채우지 말고 **점선 테두리 사각형**만 그려 "여기는 비교 제외"임을 표시.
4. 결과를 `diff.png`로 저장.

### 2-3. 부가 산출물: `diff_composite.png` (옵션)

세로 3분할 합성 (Figma | Rendered | Heatmap) PNG를 같은 디렉터리에 추가 저장. QA 에이전트가 한 장으로 비교 가능.

### 2-4. 의존성

`numpy`, `Pillow`, `scikit-image` 모두 `servers/requirements.txt`에 이미 존재. 신규 의존성 0.

---

## Issue 3 — Figma 스크린샷 3배수 강제

**목적**: render(3x)와 Figma(3x)의 픽셀 밀도를 일치시켜 SSIM·diff 정밀도 확보.

### 3-1. 신규 모듈 — `servers/figma_image_export.py`

```python
# python3 servers/figma_image_export.py \
#   --file-key DWEduE6GfxYMlyxKPNJ8jA \
#   --node-id 62973:7591 \
#   --scale 3 \
#   --output fixture/figma_screenshot.png

# 동작:
# 1. FIGMA_API_TOKEN env 읽기 (없으면 명확한 에러로 종료)
# 2. GET https://api.figma.com/v1/images/{file_key}?ids={node_id}&scale=3&format=png
# 3. 응답의 images[node_id] URL을 다시 GET → bytes
# 4. PNG 검증 (PIL.Image.open으로 width/height 확인)
# 5. output 경로에 저장
# 6. stdout으로 {"path": ..., "width": W, "height": H, "scale": 3} JSON 출력
```

타임아웃·재시도(최대 3회, exponential backoff)·HTTP 오류 핸들링 포함.

### 3-2. workflow Phase 0 Step 2 교체 — `harness/workflow.md:98-109`

기존 `mcp__figma-official__get_screenshot` 호출을 다음으로 교체:

```
!python3 servers/figma_image_export.py \
  --file-key <fileKey> \
  --node-id <representative_node_id> \
  --scale 3 \
  --output fixture/figma_screenshot.png
```

`get_screenshot`은 **컴포넌트 식별 단계(Phase 0.5)** 미리보기 용도로만 남기고, fixture 본 캡처에서는 제거.

### 3-3. fixture.meta.json 스키마 확장 — `harness/workflow.md:113-130`

```json
{
  "schema_version": "v2-representative",
  "component": { ... },
  "figma_screenshot": {
    "kind": "representative_variant",
    "node_id": "62973:7591",
    "scale": 3,                     // NEW
    "width": 252,                   // NEW (3배 raster 폭)
    "height": 270,                  // NEW
    "captured_at": "..."
  }
}
```

### 3-4. design.md 스펙 동기화 — `harness/design-md-spec.md:294-310`

`figma_screenshot` 섹션에 `scale`, `width`, `height` 필드 추가 + "Figma 캡처는 항상 scale=3로 고정" 규칙 명시.

### 3-5. renderer viewport 조정 — `.claude/agents/design_md_renderer.md`

`figma_width` 인자를 **CSS px (Figma 원본 폭)** 으로 유지하되, Playwright 호출 시 `deviceScaleFactor=3`을 명시 — 이미 그렇게 동작하지만 코멘트로 못 박는다.

### 3-6. preflight 강화 — `scripts/preflight_sot.py`

`FIGMA_API_TOKEN` env 체크 추가. 없으면 즉시 fail + `.env` 작성 안내 문구 출력.

### 3-7. orchestrator 게이트 등록 — `harness/orchestrator.md:139` 부근

`representative-screenshot-scale` 게이트 추가: `fixture.meta.json.figma_screenshot.scale == 3`.

---

## 변경 파일 요약

| 파일 | 변경 |
|------|------|
| `harness/design-md-spec.md` | `assets.icon_file`, `figma_screenshot.scale/width/height` 필드 |
| `harness/workflow.md` (98–130) | Phase 0 Step 2 → `figma_image_export.py`, fixture.meta 템플릿 갱신 |
| `harness/orchestrator.md` (139) | 신규 게이트 2종 등록 |
| `.claude/agents/design_md_renderer.md` (109–114) | SVG 인라인 + deviceScaleFactor 명시 |
| `.claude/agents/design_md_generator.md` | `icon_file` 채움 규칙 |
| `servers/pixel_compare.py` (105–164) | max_diff_map 노출 + 히트맵 + composite |
| `servers/figma_image_export.py` (NEW) | REST API 3x export |
| `servers/design_md_harness.py` | `assets-icon-file-exists`, `representative-screenshot-scale` 게이트 |
| `scripts/preflight_sot.py` | `FIGMA_API_TOKEN` 체크 |
| `servers/requirements.txt` | 변경 없음 (의존성 0) |

기존 fixture(`fixture/figma_screenshot.png` 등)는 1x로 고정되어 있으므로 **Avatar fixture를 한 번 재생성**해야 한다 (`fixture/fixture.lock` 삭제 후 `/figma-to-md` 재실행). 본 plan 적용 후 즉시 검증 대상.

---

## Verification

1. `FIGMA_API_TOKEN` 환경 변수 설정 후 `python3 scripts/preflight_sot.py` → PASS.
2. `rm fixture/fixture.lock fixture/figma_screenshot.png && /figma-to-md <Avatar URL>` 재실행.
3. `fixture/figma_screenshot.png`이 252×270(또는 3x 비율) 인지 PIL로 확인.
4. `_workspace/reviews/attempt_1/diff.png`가 회색 베이스 위 green/yellow/red 점들로 표시되는지 육안 확인.
5. `_workspace/reviews/attempt_1/render.html`을 브라우저로 열어 birthday hat / default thumbnail SVG가 실제 렌더되는지 확인.
6. handoff JSON에 `assets_inlined`·`representative-screenshot-scale` 결과가 들어있는지 확인.
7. SSIM이 0.99대 유지(또는 합리적 변동) — 마스크 정확도가 올라가면 일시적으로 떨어질 수 있음. 0.85 게이트는 통과해야 함.
