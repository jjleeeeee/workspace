---
name: design-md-harness
description: "Figma 컴포넌트 URL을 입력받아 design.md를 생성하고 생성-평가 반복 루프(최대 5회)를 통해 품질을 고도화. 산출물: ${COMPONENT_NAME}.md, figma_screenshot.png, render_screenshot.png"
---

## 사전 준비

```
!python3 ${CLAUDE_PLUGIN_ROOT}/servers/setup.py
```

위 명령이 완료될 때까지 대기. 실패 시 중단.

---

## Phase 0.5: DS 컴포넌트 스펙 추출 및 사용자 확인

**스킵 조건**: `fixture/component_spec.json` 이미 존재 시 전체 Phase 0.5 스킵.

### 0.5.1 Figma 설계 데이터 수집 (메모리 보관)

Figma MCP `get_design_context` 호출:
```
fileKey: <추출한 fileKey>
nodeId: <추출한 nodeId>
```
응답을 컨텍스트(메모리)에 보관. **파일 저장 금지** (Phase 0 Step 1에서 재사용).

### 0.5.2 컴포넌트 스펙 추출

응답 JSON에서 LLM이 직접 분석:

- **실제 컴포넌트 인스턴스 식별**
  - `type == INSTANCE` 노드 수집
  - `mainComponent.name`이 `Header`, `Title`, `Subtitle`, `Contents`, `Component`, `row`, `Properties` 등 문서 구조 패턴 → `doc_structure_node_ids_to_exclude`로 분류
  - 나머지 INSTANCE 노드 → 실제 컴포넌트 인스턴스로 분류, `component_instance_ids`에 기록

- **variant matrix 구성**
  - 인스턴스 `name`의 `Property=Value, Property=Value` 패턴 파싱
  - 동일 mainComponent끼리 묶어 sub_component 구성

- **property 설명 추출**
  - TEXT 노드 중 property 설명 문장 → 해당 property의 `description` 필드
  - `·` bullet 패턴 TEXT 노드 → `characteristics` / `exceptions`

### 0.5.3 스펙 마크다운 출력 및 확인 요청

대화창에 다음 형식으로 출력:

```
## 추출된 컴포넌트 스펙

**컴포넌트명**: <ComponentName>

### 서브 컴포넌트

#### <sub-component-name>
| Property | Values |
|----------|--------|
| <Prop>   | <Val1> \| <Val2> |

**설명:**
- <Prop>: <description>

### 제약사항
- <characteristic>

---
**이 스펙으로 design.md를 생성하시겠습니까?**
계속하려면 확인, 수정이 필요하면 변경 내용을 직접 입력, 중단하려면 취소라고 말씀해 주세요.
```

### 0.5.4 사용자 응답 처리

| 응답 | 처리 |
|------|------|
| 예 / 확인 / 진행 / yes | → 0.5.5로 |
| 수정 내용 직접 입력 | → 스펙 업데이트 후 0.5.3으로 재출력 (루프) |
| 취소 / 중단 / no / 종료 | → 즉시 종료, fixture 파일 미생성 |

### 0.5.5 component_spec.json 저장

`fixture/` 디렉토리 생성 후 저장:

```json
{
  "component_name": "<ComponentName>",
  "figma_url": "<FIGMA_URL>",
  "confirmed_by_user": true,
  "sub_components": [
    {
      "name": "<sub-component-kebab>",
      "properties": [
        {
          "name": "<PropName>",
          "values": ["<Val1>", "<Val2>"],
          "description": "<설명>"
        }
      ],
      "component_instance_ids": ["<nodeId1>", "<nodeId2>"]
    }
  ],
  "characteristics": ["<제약사항>"],
  "exceptions": [],
  "doc_structure_node_ids_to_exclude": ["<docNodeId1>", "<docNodeId2>"]
}
```

→ `fixture/component_spec.json` 저장

---

## Phase 0: Fixture Setup (1회, 이후 readonly)

### 입력 파싱

`$ARGUMENTS`에서 Figma URL을 추출:
- 예: `https://www.figma.com/design/<fileKey>/...?node-id=<nodeId>`
- `fileKey`와 `nodeId` 분리 (`-` → `:` 변환)

컴포넌트명 결정:
- Figma 메타데이터에서 컴포넌트명 추출
- 파일명용: PascalCase → kebab-case (예: `TextButton.md`)

### fixture/ 디렉토리 생성 및 데이터 수집

작업 디렉토리 기준 `fixture/` 생성.

**이미 `fixture/fixture.lock`이 존재하면 Phase 0 생략 — 기존 fixture 재사용.**

1. **Figma 설계 데이터 필터링 및 저장**

   Phase 0.5에서 메모리에 보관한 `get_design_context` JSX 응답을 `.tmp/design_context.jsx`에 저장:

   ```
   !mkdir -p .tmp
   ```
   (Phase 0.5 get_design_context 응답의 JSX/코드 부분을 `.tmp/design_context.jsx` 파일로 Write)

   `figma_mcp_adapter.py`로 JSX → figma_raw.json 변환 (component_spec.json 기준 필터링 포함):

   ```
   !python3 ${CLAUDE_PLUGIN_ROOT}/servers/figma_mcp_adapter.py \
     --jsx-input .tmp/design_context.jsx \
     --keep-ids-json fixture/component_spec.json \
     --output fixture/figma_raw.json
   ```

   → `fixture/figma_raw.json` 저장

   **효과**: `component_instance_ids`에 해당하는 컴포넌트 노드만 포함. "Properties", "Mode", "ON", "OFF" 등 문서 구조 TEXT 노드 제거 → text-coverage 오염 방지.

2. **Figma 변수 정의 수집**

   Figma MCP `get_variable_defs` 호출 (같은 fileKey):
   → `fixture/figma_variables.json` 저장

3. **Figma 스크린샷 캡처**

   Figma MCP `get_screenshot` 호출:
   ```
   fileKey: <fileKey>
   nodeId: <nodeId>
   ```

   MCP 응답에서 이미지 URL(S3 임시 URL) 추출 후 저장:
   ```
   !python3 -c "
   import urllib.request
   urllib.request.urlretrieve('<MCP_IMAGE_URL>', 'fixture/figma_screenshot.png')
   print('Saved figma_screenshot.png')
   "
   ```
   → `fixture/figma_screenshot.png` 저장

4. **CDS 토큰 카탈로그 fetch**

   GitHub API로 `weversecorp/cds-catalogs` 토큰 파일 목록 및 내용 fetch:
   - `https://api.github.com/repos/weversecorp/cds-catalogs/contents/catalogs/tokens`
   - 각 JSON 파일의 `tokens[]` 배열 수집
   - `{ path: "system.color.button.default", raw: { light: "#3D5AFE", dark: "#6E8BFF" } }` 형태로 정규화
   → `fixture/cds_tokens.json` 저장

5. **token_map.json 생성 (R4)**

   `fixture/figma_variables.json` + `fixture/cds_tokens.json` 기반:

   ```python
   # 정규화 매핑 규칙
   # Figma variable: "Color/Button/Default" → "color.button.default" (소문자, / → .)
   # CDS path: "system.color.button.default"
   # 매칭: cds_path.endswith(figma_normalized) 또는 유사도 기반 후보
   ```

   출력 형식:
   ```json
   {
     "mapped": {
       "system/color/button/default": "system.color.button.default"
     },
     "unmapped": [],
     "cds_values": {
       "system.color.button.default": "#3D5AFE"
     }
   }
   ```
   > `figma_var_id_to_cds` 필드 불필요 — figma_mcp_adapter가 VAR_NAME 형식으로 출력하며,
   > `design_md_harness.py`가 `name.replace("/", ".")` 직접 변환으로 처리함.

   → `fixture/token_map.json` 저장

6. **expected_nodes.json + image_mask.json 생성**

   `fixture/figma_raw.json` 트리 순회:

   `expected_nodes.json`:
   ```json
   {
     "text_nodes": [{ "id": "n1", "value": "버튼", "type": "TEXT" }],
     "color_tokens": ["system.color.button.default"],
     "typography_tokens": ["typography.label.medium"],
     "instance_components": [{ "name": "Icon", "mainComponent": "icon" }],
     "auto_layout_nodes": [{ "name": "Button", "axis": "horizontal" }]
   }
   ```

   `image_mask.json` (IMAGE fill 가진 노드의 좌표):
   ```json
   [
     { "id": "n5", "name": "thumbnail", "x": 0, "y": 0, "width": 48, "height": 48,
       "figma_w": 375, "figma_h": 200 }
   ]
   ```
   → 저장

7. **fixture.lock 생성**

   ```python
   import hashlib, json
   from pathlib import Path

   files = ["figma_raw.json", "figma_variables.json", "figma_screenshot.png",
            "cds_tokens.json", "token_map.json", "expected_nodes.json", "image_mask.json",
            "component_spec.json"]
   hashes = {}
   for f in files:
       p = Path("fixture") / f
       if p.exists():
           hashes[f] = hashlib.sha256(p.read_bytes()).hexdigest()
   Path("fixture/fixture.lock").write_text(json.dumps(hashes, indent=2))
   Path("fixture/fixture.json").write_text(json.dumps({
       "component_name": "<COMPONENT_NAME>",
       "figma_url": "<FIGMA_URL>",
       "files": list(hashes.keys())
   }, indent=2, ensure_ascii=False))
   ```

---

## Loop (최대 5회)

각 루프 시작 시 **fixture.lock 검증**:
```
!python3 -c "
import hashlib, json
from pathlib import Path
lock = json.loads(Path('fixture/fixture.lock').read_text())
for f, expected in lock.items():
    actual = hashlib.sha256(Path('fixture/' + f).read_bytes()).hexdigest()
    assert actual == expected, f'fixture 변조 감지: {f}'
print('fixture 검증 통과')
"
```
실패 시 즉시 중단.

---

### Step A: design.md 생성/수정

`design_md_generator` 에이전트 호출:

```
Task:
  figma_raw_path: fixture/figma_raw.json
  component_spec_path: fixture/component_spec.json
  token_map_path: fixture/token_map.json
  component_name: <COMPONENT_NAME>
  output_path: <COMPONENT_NAME>.md
  attempt: <N>
  handoff_path: .harness/handoff_<N-1>.json  # N>1일 때만
```

---

### Step B: 정적 평가

```
!python3 ${CLAUDE_PLUGIN_ROOT}/servers/design_md_harness.py \
  --figma-raw fixture/figma_raw.json \
  --token-map fixture/token_map.json \
  --design-md <COMPONENT_NAME>.md \
  --output .harness/attempt_<N>/harness_result.json \
  --handoff .harness/handoff_<N-1>.json
```

결과 `harness_result.json` 읽기:
- `all_pass`: true/false
- `checks[]`: 각 체크 결과
- `fix_hints[]`: 수정 지시사항
- `terminate_for_regression`: true면 즉시 루프 종료

**`terminate_for_regression: true`이면 루프 종료 → 회귀 보고서 출력.**

---

### Step C: 회귀 확인

`harness_result.json`의 `regression_detected_this_loop`가 비어있지 않으면:
- fix_hints에 `[REGRESSION]` 태그가 삽입되어 있음
- `terminate_for_regression`이 false이면 다음 루프에서 수정 시도 (최우선)
- true이면 즉시 종료

---

### Step D: HTML 렌더링 및 스크린샷

`design_md_renderer` 에이전트 호출:

```
Task:
  design_md_path: <COMPONENT_NAME>.md
  output_html_path: .harness/attempt_<N>/render.html
  output_screenshot_path: .harness/attempt_<N>/render_screenshot.png
  figma_width: <fixture의 Figma 스크린샷 폭, 기본 375>
  plugin_root: ${CLAUDE_PLUGIN_ROOT}
```

---

### Step E: Pixel Diff 실행

```
!python3 ${CLAUDE_PLUGIN_ROOT}/servers/pixel_compare.py \
  --figma fixture/figma_screenshot.png \
  --rendered .harness/attempt_<N>/render_screenshot.png \
  --output .harness/attempt_<N>/pixel_compare_result.json \
  --diff-png .harness/attempt_<N>/diff.png \
  --sample-name <COMPONENT_NAME> \
  --match-figma-width \
  --mask-json fixture/image_mask.json
```

---

### Step F: 시각 QA

`design_md_qa` 에이전트 호출:

```
Task:
  figma_screenshot_path: fixture/figma_screenshot.png
  render_screenshot_path: .harness/attempt_<N>/render_screenshot.png
  diff_png_path: .harness/attempt_<N>/diff.png
  pixel_compare_result_path: .harness/attempt_<N>/pixel_compare_result.json
  design_md_path: <COMPONENT_NAME>.md
  handoff_path: .harness/handoff_<N-1>.json
```

---

### Step G: handoff_N.json 저장

harness_result.json + pixel_compare_result.json + qa 결과 병합:

```json
{
  "loop": <N>,
  "verified_pass": [정적 체크 중 pass인 check.id 목록],
  "remaining_issues": [fail 항목들의 { id, message, fix_hint }],
  "fix_log": ["loop <N>: <수정 내용 요약>"],
  "ssim": <pixel_compare_result.score_ssim>,
  "pixel_pass": <pixel_compare_result.pass>,
  "regression_streak": <harness_result.regression_streak>,
  "regression_detected_this_loop": <harness_result.regression_detected_this_loop>,
  "static_all_pass": <harness_result.all_pass>,
  "visual_fix_hints": <qa 에이전트의 fix_hints>
}
```

→ `.harness/handoff_<N>.json` 저장

---

### Step H: 통과 판정

```
all_pass = harness_result.all_pass AND pixel_compare_result.pass

if all_pass:
  → PASS → 루프 종료
elif N < 5 AND NOT terminate_for_regression:
  → 다음 루프 진행
else:
  → FAIL 보고서 출력 → 종료
```

---

## 최종 산출물 정리

### PASS 시

```
!cp fixture/figma_screenshot.png figma_screenshot.png
!cp .harness/attempt_<last_N>/render_screenshot.png render_screenshot.png
```

산출물:
- `<COMPONENT_NAME>.md` — 최종 design.md
- `figma_screenshot.png` — Figma 원본
- `render_screenshot.png` — 최종 렌더링

`.harness/final_report.md` 생성:
```markdown
# <COMPONENT_NAME> design.md 생성 완료

- 상태: PASS
- 루프 횟수: <N>회
- 최종 SSIM: <score>
- 통과 체크: <X>/<total>건

## 최종 파일
- `<COMPONENT_NAME>.md`
- `figma_screenshot.png`
- `render_screenshot.png`
```

### FAIL 시

`.harness/final_report.md` 생성:
```markdown
# <COMPONENT_NAME> design.md 생성 실패

- 상태: FAIL (5회 루프 초과 또는 회귀 감지)
- 최종 SSIM: <score>
- 미통과 체크: <목록>

## 미해결 이슈
<remaining_issues 목록>

## 최종 handoff
`.harness/handoff_<N>.json` 참조
```

---

## 진행 상황 안내

각 루프마다 다음 형식으로 진행 상황 출력:

```
[loop 1/5] Step B 정적 평가 중...
  ✓ text-coverage
  ✗ token-colors: raw hex 2건
  ✗ missing-sections: Layout 누락
[loop 1/5] SSIM: 0.71 (목표: 0.85)
[loop 2/5] fix_hints 반영 중...
```
