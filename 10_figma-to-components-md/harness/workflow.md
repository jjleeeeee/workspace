# 워크플로우 절차

오케스트레이터(`orchestrator.md`)가 이 파일을 읽어 단계별 절차를 실행한다.

스펙 기준: `harness/design-md-spec.md` (shared-component-spec/v1)
토큰 SoT: `src/tokens/tokens.{color,typography,size}.v1.0.json`
컴포넌트 키 SoT: `src/figma-component-keys/index.md` + `variant-keys/<comp>.md`

---

## 시작 전: SoT Preflight 검증

```
!python3 scripts/preflight_sot.py
```

실패 시 즉시 중단 (git-tracked 파일 필요 — Phase 0 안내).

---

## Phase 0.5: 컴포넌트 식별 및 사용자 확인

**스킵 조건**: `fixture/fixture.meta.json` 이미 존재 시 전체 Phase 0.5 스킵.

### 0.5.1 Figma URL 파싱 + 컴포넌트 조회

```
$ARGUMENTS → fileKey + nodeId 추출 (- → : 변환)
```

`src/figma-component-keys/index.md`에서 nodeId로 컴포넌트 조회:
- 일치 항목 있음 → figma_name, level, component_set_key 확인
- 일치 항목 없음 → 사용자에게 컴포넌트명 직접 입력 요청

### 0.5.2 Figma 설계 데이터 수집 (메모리 보관)

Figma MCP `get_design_context` 호출:
```
fileKey: <fileKey>
nodeId: <nodeId>
```
응답을 컨텍스트(메모리)에 보관. **파일 저장 금지** (Phase 0 Step 1에서 재사용).

### 0.5.3 컴포넌트 정보 출력 및 확인 요청

대화창에 출력:
```
## 컴포넌트 식별 결과

**컴포넌트명**: <figma_name>  (kebab: <kebab-name>)
**레벨**: <Atom | Molecule>
**Variant 수**: <variant_count>  (src/figma-component-keys/variant-keys/<comp>.md 참조)
**대표 variant 후보**: <axes 기본값 조합>  (예: Mode=Default, Size=Medium)

---
이 컴포넌트로 design.md를 생성하시겠습니까?
계속하려면 확인, 중단하려면 취소.
```

### 0.5.4 사용자 응답 처리

| 응답 | 처리 |
|------|------|
| 예 / 확인 / 진행 | → Phase 0으로 |
| 취소 / 중단 | → 즉시 종료 |

---

## Phase 0: Fixture Setup (1회, 이후 readonly)

**스킵 조건**: `fixture/fixture.lock` 이미 존재 시 Phase 0 생략 — 기존 fixture 재사용.

### 입력

- `fileKey`: Figma file key
- `nodeId`: 컴포넌트 set node id
- `kebab_name`: kebab-case 컴포넌트명 (예: `avatar`)

### Step 1. figma_raw.json 생성

Phase 0.5에서 메모리에 보관한 `get_design_context` 응답을 `.tmp/design_context.jsx`에 저장:
```
!mkdir -p .tmp
```

`figma_mcp_adapter.py`로 JSX → figma_raw.json 변환:
```
!python3 servers/figma_mcp_adapter.py \
  --jsx-input .tmp/design_context.jsx \
  --output fixture/figma_raw.json
```

`figma_mcp_adapter.py`는 다음도 함께 생성 (가능한 경우):
- `fixture/text_behavior_meta.json` — TEXT 노드의 textAutoResize/overflow 데이터
- `fixture/asset_nodes.json` — icon/image/logo/badge 분류 노드
- `fixture/mcp_read_log.json` — 수행한 MCP 호출 목록

### Step 2. representative variant 스크린샷 캡처

`src/figma-component-keys/variant-keys/<kebab_name>.md`에서 대표 variant 선정:
1. axes 기본값 조합 (예: `Mode=Default, Size=Medium`) → 해당 node_id
2. 없으면 첫 번째 항목 node_id

Figma MCP `get_screenshot` 호출 (대표 variant node_id):
```
fileKey: <fileKey>
nodeId: <representative_node_id>
```
→ `fixture/figma_screenshot.png` 저장

### Step 3. fixture.meta.json 생성

```json
{
  "schema_version": "v2-representative",
  "component": {
    "name": "<kebab-name>",
    "figma_name": "<figma_name>",
    "figma_file": "<fileKey>",
    "node_id": "<component_set_node_id>",
    "component_set_key": "<component_set_key>",
    "level": "<Atom | Molecule>"
  },
  "figma_screenshot": {
    "kind": "representative_variant",
    "node_id": "<representative_variant_node_id>",
    "captured_at": "<ISO8601>"
  }
}
```
→ `fixture/fixture.meta.json` 저장

### Step 4. token_snapshot.json 생성

`src/tokens/` 3개 파일의 sha256 핀:
```python
import hashlib, json
from pathlib import Path

files = [
    ("src/tokens/tokens.color.v1.0.json", "0.4.10"),
    ("src/tokens/tokens.typography.v1.0.json", "0.4.10"),
    ("src/tokens/tokens.size.v1.0.json", "0.4.10"),
]
snapshot = []
for fpath, version in files:
    sha = hashlib.sha256(Path(fpath).read_bytes()).hexdigest()
    snapshot.append({"file": fpath, "version": version, "sha256": sha})
Path("fixture/token_snapshot.json").write_text(json.dumps(snapshot, indent=2))
```
→ `fixture/token_snapshot.json` 저장

### Step 5. component_keys_snapshot.json 생성

```python
import hashlib, json
from pathlib import Path

kebab = "<kebab_name>"
index_path = f"src/figma-component-keys/index.md"
variant_path = f"src/figma-component-keys/variant-keys/{kebab}.md"

snapshot = {
    "index": {
        "file": index_path,
        "sha256": hashlib.sha256(Path(index_path).read_bytes()).hexdigest()
    },
    "variant_keys": {
        "file": variant_path,
        "sha256": hashlib.sha256(Path(variant_path).read_bytes()).hexdigest()
    }
}
Path("fixture/component_keys_snapshot.json").write_text(json.dumps(snapshot, indent=2))
```
→ `fixture/component_keys_snapshot.json` 저장

### Step 6. expected_nodes.json + image_mask.json + asset_nodes.json + representative_overlays.json 생성

`fixture/figma_raw.json` 트리 순회 (figma_walker 활용):

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
[{ "id": "n5", "name": "thumbnail", "x": 0, "y": 0, "width": 48, "height": 48,
   "figma_w": 375, "figma_h": 200 }]
```

`asset_nodes.json` (icon/image/logo/badge 노드 + visible/bbox 포함):
```python
from harness.lib.figma_walker import collect_asset_nodes
import json
from pathlib import Path

figma_raw = json.loads(Path("fixture/figma_raw.json").read_text())
nodes = collect_asset_nodes(figma_raw)
Path("fixture/asset_nodes.json").write_text(json.dumps(nodes, indent=2))
```

`representative_overlays.json` (representative variant 서브트리의 visible 오버레이):
```python
from harness.lib.figma_walker import collect_visible_overlays
import json
from pathlib import Path

figma_raw = json.loads(Path("fixture/figma_raw.json").read_text())
fixture_meta = json.loads(Path("fixture/fixture.meta.json").read_text())
rep_node_id = fixture_meta["figma_screenshot"]["node_id"]
overlays = collect_visible_overlays(figma_raw, rep_node_id)
Path("fixture/representative_overlays.json").write_text(json.dumps(overlays, indent=2))
```

### Step 7. fixture.lock 생성

```python
import hashlib, json
from pathlib import Path

files = [
    "figma_raw.json", "figma_screenshot.png",
    "fixture.meta.json", "token_snapshot.json", "component_keys_snapshot.json",
    "expected_nodes.json", "image_mask.json",
    "asset_nodes.json", "representative_overlays.json"
]
# 선택적 파일 (존재 시만 포함)
optional = ["text_behavior_meta.json", "mcp_read_log.json"]

hashes = {}
for f in files + optional:
    p = Path("fixture") / f
    if p.exists():
        hashes[f] = hashlib.sha256(p.read_bytes()).hexdigest()
Path("fixture/fixture.lock").write_text(json.dumps(hashes, indent=2))
```

---

## Loop Step A: design.md 생성/수정

`design_md_generator` 에이전트 호출:

```
Task:
  figma_raw_path: fixture/figma_raw.json
  fixture_meta_path: fixture/fixture.meta.json
  comp_keys_snapshot_path: fixture/component_keys_snapshot.json
  token_snapshot_path: fixture/token_snapshot.json
  component_name: <kebab_name>
  output_path: _workspace/drafts/attempt_<N>/<COMPONENT_NAME>.md
  attempt: <N>
  handoff_path: _workspace/reviews/handoff_<N-1>.json  # N>1일 때만
```

선택 입력 (존재 시 전달):
```
  text_behavior_meta_path: fixture/text_behavior_meta.json
  asset_nodes_path: fixture/asset_nodes.json
  mcp_read_log_path: fixture/mcp_read_log.json
```

---

## Loop Step B: 정적 평가

```
!python3 servers/design_md_harness.py \
  --figma-raw fixture/figma_raw.json \
  --design-md _workspace/drafts/attempt_<N>/<COMPONENT_NAME>.md \
  --output _workspace/reviews/attempt_<N>/harness_result.json \
  --handoff _workspace/reviews/handoff_<N-1>.json \
  --fixture-meta fixture/fixture.meta.json \
  --token-snapshot fixture/token_snapshot.json \
  --comp-keys-snapshot fixture/component_keys_snapshot.json
```

---

## Loop Step C: 회귀 확인

`harness_result.json`의 `regression_detected_this_loop`가 비어있지 않으면:
- fix_hints에 `[REGRESSION]` 태그 삽입됨
- `terminate_for_regression: false` → 다음 루프에서 최우선 수정
- `terminate_for_regression: true` → 즉시 종료

---

## Loop Step D: HTML 렌더링 및 스크린샷

`design_md_renderer` 에이전트 호출:

```
Task:
  design_md_path: _workspace/drafts/attempt_<N>/<COMPONENT_NAME>.md
  output_html_path: _workspace/reviews/attempt_<N>/render.html
  output_screenshot_path: _workspace/reviews/attempt_<N>/render_screenshot.png
  figma_width: <fixture 기준 Figma 스크린샷 폭, 기본 375>
  servers_root: servers/
```

렌더러는 `variants.representative` 단 1개만 렌더.

---

## Loop Step E: Pixel Diff

```
!python3 servers/pixel_compare.py \
  --figma fixture/figma_screenshot.png \
  --rendered _workspace/reviews/attempt_<N>/render_screenshot.png \
  --output _workspace/reviews/attempt_<N>/pixel_compare_result.json \
  --diff-png _workspace/reviews/attempt_<N>/diff.png \
  --sample-name <COMPONENT_NAME> \
  --match-figma-width \
  --mask-json fixture/image_mask.json \
  --fixture-meta fixture/fixture.meta.json
```

---

## Loop Step F: 시각 QA

`design_md_qa` 에이전트 호출:

```
Task:
  figma_screenshot_path: fixture/figma_screenshot.png
  render_screenshot_path: _workspace/reviews/attempt_<N>/render_screenshot.png
  diff_png_path: _workspace/reviews/attempt_<N>/diff.png
  pixel_compare_result_path: _workspace/reviews/attempt_<N>/pixel_compare_result.json
  design_md_path: _workspace/drafts/attempt_<N>/<COMPONENT_NAME>.md
  handoff_path: _workspace/reviews/handoff_<N-1>.json
```

QA fix_hints는 frontmatter 경로(`tokens.<key>.default`, `typography.<role>.token_fallback` 등)와
body 섹션(`## Asset Notes`, `## Text Behavior Notes` 등) 양쪽을 포함.

---

## Loop Step G: handoff_N.json 저장

harness_result + pixel_compare_result + qa 결과 병합:

```json
{
  "loop": <N>,
  "verified_pass": ["정적 통과 check.id 목록"],
  "remaining_issues": [{ "id": "...", "message": "...", "fix_hint": "..." }],
  "fix_log": ["loop <N>: <수정 내용 요약>"],
  "ssim": <score_ssim>,
  "pixel_pass": <pass>,
  "regression_streak": {},
  "regression_detected_this_loop": [],
  "static_all_pass": <all_pass>,
  "visual_fix_hints": ["<qa 에이전트 fix_hints>"]
}
```

→ `_workspace/reviews/handoff_<N>.json` 저장

---

## Loop Step H: 통과 판정

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
!cp fixture/figma_screenshot.png _workspace/outputs/figma_screenshot.png
!cp _workspace/drafts/attempt_<last_N>/<COMPONENT_NAME>.md _workspace/outputs/<COMPONENT_NAME>.md
!cp _workspace/reviews/attempt_<last_N>/render_screenshot.png _workspace/outputs/render_screenshot.png
```

`_workspace/outputs/final_report.md` 생성:
```markdown
# <COMPONENT_NAME> design.md 생성 완료

- 상태: PASS
- 루프 횟수: <N>회
- 최종 SSIM: <score>
- 통과 체크: <X>/<total>건
- 대표 variant: <representative_variant>

## 최종 파일
- `_workspace/outputs/<COMPONENT_NAME>.md`
- `_workspace/outputs/figma_screenshot.png`
- `_workspace/outputs/render_screenshot.png`
```

### FAIL 시

`_workspace/outputs/final_report.md` 생성:
```markdown
# <COMPONENT_NAME> design.md 생성 실패

- 상태: FAIL (5회 루프 초과 또는 회귀 감지)
- 최종 SSIM: <score>
- 미통과 체크: <목록>

## 미해결 이슈
<remaining_issues 목록>

## 최종 handoff
`_workspace/reviews/handoff_<N>.json` 참조
```
