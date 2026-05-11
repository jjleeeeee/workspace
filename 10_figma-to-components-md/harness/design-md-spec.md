# shared-component-spec/v1 — design.md 스펙

Figma URL → 플랫폼 중립 공유 spec 자동 생성 하네스의 산출물 스펙.
`design_md_generator` 에이전트와 `design_md_harness.py`가 이 스펙을 기준으로 동작한다.

이 스펙은 **Layer 1 전용** — Figma에서 단독으로 추출 가능한 플랫폼 중립 정보만 포함.
React `Code Mapping`, CSS 결정, asset export 경로, baseline PNG 경로, visual-registry 항목은 여기에 없다.
이들은 각 플랫폼의 binding 파일(`platform_bindings.react/swift/kotlin`)에서 다룬다.

---

## 03 / 04 스키마 매핑

| 03 description.yaml (component_contract) | 이 스펙의 frontmatter 경로 |
|---|---|
| `component_contract.name` | `component.name` |
| `component_contract.figma_name` | `component.figma_name` |
| `component_contract.description` | `component.description` |
| `component_contract.axes` | `axes` |
| `component_contract.variants` | `variants.count` + `variants.formula` |
| `component_contract.props` | `props` |
| `component_contract.tokens` | `tokens` |
| `component_contract.typography` | `typography` |
| `component_contract.assets` | `assets` |
| `component_contract.composition.uses` | `composition.uses` |

| 04 source.md 섹션 | 이 스펙에서의 처리 |
|---|---|
| Sizing Interpretation Notes (Figma 원본 측정값) | `sizing.<part>.figma_intrinsic` / `figma_constraint` |
| Sizing Interpretation Notes (CSS 결정) | **제외** — platform-specific |
| Token vs Rendered Pixel Notes (측정값) | `tokens.<key>.rendered_pixel_observed` (선택) |
| Token vs Rendered Pixel Notes (CSS 처리) | **제외** — platform-specific |
| Nested Atom Mapping (관계) | `composition.uses` |
| Nested Atom Mapping (React import) | **제외** — platform-specific |
| Alpha Token Notes / Font Mapping Notes (분류) | `typography.<role>.classification` |
| Alpha Token Notes / Font Mapping Notes (CSS fallback) | **제외** — platform-specific |
| Code Mapping 섹션 전체 | **제외** — platform-specific |

---

## YAML Frontmatter 전체 구조

```yaml
---
schema: "shared-component-spec/v1"

component:
  name: "<kebab-case>"                        # src/figma-component-keys/variant-keys/<name>.md 파일명과 일치
  figma_name: "<Figma 컴포넌트 정확명>"        # index.md Component 컬럼과 일치
  description: "<한 줄>"
  figma_file: "DWEduE6GfxYMlyxKPNJ8jA"       # index.md 상단 file key
  node_id: "<component_set_node_id>"           # index.md Node ID 컬럼
  component_set_key: "<component_set_key>"     # index.md Component Set Key 컬럼
  level: "Atom | Molecule"                     # index.md Level 컬럼 (advisory — 게이트 기준 아님)
  last_synced: "<YYYY-MM-DD>"                  # index.md Last checked 날짜

# 토큰 카탈로그 핀 — sha256이 invalidation의 진짜 SoT, version은 사람용 메타
token_catalog:
  color: { file: "src/tokens/tokens.color.v1.0.json", version: "0.4.10" }
  typography: { file: "src/tokens/tokens.typography.v1.0.json", version: "0.4.10" }
  size: { file: "src/tokens/tokens.size.v1.0.json", version: "0.4.10" }
  render_mode:
    color: "light"        # 시각 게이트(HTML 렌더) 전용 모드. spec 자체는 mode-agnostic.
    typography: "web"     # Swift는 ios, Kotlin은 aos로 자체 해석

axes:
  <AxisName>: ["<value1>", "<value2>"]

variants:
  count: <n>
  formula: "<Axis1(n1) x Axis2(n2)>"
  constraints:
    - "<유효/무효 조합 설명>"
  registry:
    # variant-keys/<component>.md 표를 그대로 흡수. node_id와 key가 검증 SoT.
    - { variant: "<name>", node_id: "<id>", key: "<component_key>" }
  representative:
    variant: "<대표 variant 이름>"     # axes 기본값 조합 우선, 없으면 첫 variant
    node_id: "<id>"
    rationale: "<왜 이 variant가 대표인지>"

props:
  <PropName>:
    type: '"<v1>" | "<v2>"'
    default: '"<default>"'
    description: "<설명>"

# 토큰 참조는 id 기반이 권장 (name은 중복 위험 — typography에서 31개 중복 확인됨)
tokens:
  <token_key>:
    part: "<part_name>"
    role: "fill | stroke"
    applies_to: "<Status=Default>"             # axes/props 도메인의 predicate
    default: "token:system.color.button.black"  # src/tokens/*.json id 필드
    fixed: "token:system.fixed_color.white"     # 동일
    rendered_pixel_observed: "<선택, #hex>"    # Figma 렌더 측정값 (중립 증거)

typography:
  <text_role>:
    font_family: "<Figma fontFamily>"
    classification: "actual-font | system-alias | token-alias | unknown"
    system_fallback: "<...>"
    token_fallback: "token:typography.web.body.text-style-100"  # tokens.typography.v1.0.json id
    note: "<선택>"

assets:
  <asset_key>:
    part: "<...>"
    role: "icon | image | logo | badge | emoji"
    source: "<DS asset key 또는 Figma node id>"
    applies_to: "<...>"
    size: "<WxHpx>"
    semantic_rule: "<...>"

composition:
  uses:
    # 03 bridge-descriptions/<comp>.bridge.yaml의 component_contract.composition.uses와 정합 필요
    # 없으면 source_gaps에 "composition: not-yet-validated" 기록
    - component: "<nested DS 컴포넌트 kebab-name>"
      node_id: "<...>"
      role: "<...>"
      usage_condition: "<...>"

layout:
  component_size: "<WxHpx>"
  part_spacing:
    "<a>__to__<b>":
      default: { token: "<token_key>", value: "<Npx>" }
      variants:
        - when: "<Status=...>"
          token: "<token_key>"
          value: "<Npx>"

# 04 Sizing Interpretation의 platform-neutral 부분 흡수
# CSS 결정은 포함하지 않음 — Figma 원본 측정값만
sizing:
  <part_name>:
    figma_intrinsic: "<WxHpx>"
    figma_constraint: "FIXED | HUG | FILL"
    note: "<선택>"

text_behavior:
  <text_role>:
    text_auto_resize: "NONE | WIDTH_AND_HEIGHT | HEIGHT | TRUNCATE"
    overflow_policy: "clip | truncate | scroll | unknown"

implementation_order:
  - "<플랫폼 중립 구현 순서 1>"
  - "<플랫폼 중립 구현 순서 2>"

implementation_coverage:
  axes: "<complete | partial | deferred>"
  props: "<complete | partial | deferred>"
  assets: "<complete | partial | deferred>"
  layout: "<complete | partial | deferred>"
  exclusions: "<제외 사유>"

rules:
  do: ["<...>"]
  dont: ["<...>"]

# 렌더링 파이프라인 단축 토큰 (HTML 렌더러 전용)
# 위 tokens/typography/sizing에서 파생된 값. 편의 목적으로만 사용.
colors:
  <name>: "token:system.color.xxx"
spacing:
  <name>: "<Npx>"
rounded:
  <name>: "<Npx>"

source_gaps:
  - { part: "<...>", reason: "<...>" }
---
```

---

## Markdown Body 필수 섹션 (순서 엄수)

```markdown
## Overview
컴포넌트 목적·맥락 (03 description + 보충 narrative).

## Source Reads
실제 수행된 MCP 호출 목록.
- `mcp__figma-console__figma_get_component_for_development_deep(nodeId=...)`
- `mcp__figma-official__get_design_context(nodeId=...)`

## Figma Identity
| Field | Value |
| --- | --- |
| Figma file | DWEduE6GfxYMlyxKPNJ8jA |
| Node ID | ... |
| Component Set Key | ... |
| Last synced | ... |

## Variant Axes
- `<Axis>: [<v1>, <v2>, ...]`
- Variant formula: `Axis1(n) x Axis2(m) = N variants`
- Representative: `<variant name>` (rationale)

## Figma Props
- `<PropName>` (`"<type>"`): description. Default: `"<default>"`

## Layout
component_size, part_spacing 의도 설명. sizing 원본 측정값 내러티브.

## Asset Notes
각 asset의 part, role, source(node_id), semantic_rule.

## Text Behavior Notes
각 text role의 textAutoResize / overflow_policy 설명.

## Implementation Order
플랫폼 중립 구현 순서 narrative.

## Do's and Don'ts
- ✅ ...
- ❌ ...

## Known Gaps
- 확인 못한 값과 그 이유 (source_gaps 매핑).
```

---

## 토큰 참조 규칙

### 권장: id 기반 참조
```yaml
tokens:
  bg:
    default: "token:system.color.button.black"   # ✅ id — unique, 검증 가능
```

### 허용: legacy name 참조 (ambiguity 게이트 통과 시에만)
```yaml
colors:
  primary: "{cds: system/color/button/black}"   # ⚠️ name 중복 없을 때만
```
`tokens-name-not-ambiguous` 게이트가 name → id 매핑에서 복수 id를 감지하면 FAIL.

### 금지: raw hex
```yaml
colors:
  primary: "#3D5AFE"   # ❌ — token-colors 게이트 FAIL
```

---

## 정적 평가 게이트 (현행)

| ID | 실패 조건 |
|----|-----------|
| `text-coverage` | Figma TEXT가 body에 없음 |
| `color-coverage` | Figma 색상이 YAML colors에 없음 |
| `typography-coverage` | Figma textStyle이 YAML typography에 없음 |
| `component-coverage` | Figma INSTANCE가 YAML에 없음 |
| `layout-coverage` | auto-layout 노드의 layout.kind/axis 미정의 |
| `token-colors` | YAML colors에 raw hex 사용 |
| `token-typography` | typography 항목에 token_fallback 없음 |
| `broken-ref` | `{colors.X}` 등 참조가 YAML에 없음 |
| `missing-sections` | 11개 필수 섹션 누락 |
| `section-order` | 섹션 순서 위반 |
| `variants-registry-matches-source-of-truth` | variants.registry ↔ src/figma-component-keys set 불일치 |
| `component-identity-matches-index` | frontmatter 식별자가 index.md와 불일치 |
| `representative-variant-defined` | representative.variant + node_id 미존재 |
| `fixture-schema-version` | fixture.meta.json schema_version ≠ "v2-representative" |
| `representative-screenshot-matches-spec` | fixture 스크린샷 node_id ≠ spec representative node_id |
| `tokens-id-resolves` | tokens 참조 id가 src/tokens/*.json에 미존재 |
| `tokens-id-has-mode-value` | id가 render_mode에서 값 없음 |
| `tokens-name-not-ambiguous` | {cds: name}이 복수 id에 매핑 |
| `token-catalog-sha256-matches` | src/tokens/*.json sha256 ≠ fixture 핀 |
| `typography-id-resolves` | typography token_fallback id 미존재 |
| `composition-matches-bridge` | composition.uses ↔ 03 bridge yaml 불일치 |
| `component-keys-sha256-matches` | index.md/variant-keys sha256 ≠ fixture 핀 |
| `implementation-coverage-fields` | implementation_coverage 필드 비어있음 |
| `rules-non-empty` | rules.do 또는 dont가 비어있음 |
| `composition-uses-blacklist` | composition.uses에 vector/icon_area 등록 |

시각 게이트: SSIM ≥ 0.85 (`servers/pixel_compare.py`)

### 통과 판정
```
PASS = 정적 all_pass AND pixel_compare.pass (SSIM ≥ 0.85)
```

---

## representative_variant 선정 규칙

1. axes 기본값 조합에 해당하는 variant (예: `Mode=Default, Type=Circle, Size=Medium`)
2. 없으면 `variants.registry`의 첫 번째 항목
3. `fixture.meta.json.figma_screenshot.node_id`와 반드시 일치해야 `representative-screenshot-matches-spec` 게이트 통과

---

## fixture 스키마 요건

```json
// fixture/fixture.meta.json
{
  "schema_version": "v2-representative",
  "figma_screenshot": {
    "kind": "representative_variant",
    "node_id": "<representative variant node_id>",
    "captured_at": "<ISO8601>"
  }
}
```

```json
// fixture/token_snapshot.json
[
  { "file": "src/tokens/tokens.color.v1.0.json", "version": "0.4.10", "sha256": "<hash>" },
  { "file": "src/tokens/tokens.typography.v1.0.json", "version": "0.4.10", "sha256": "<hash>" },
  { "file": "src/tokens/tokens.size.v1.0.json", "version": "0.4.10", "sha256": "<hash>" }
]
```

```json
// fixture/component_keys_snapshot.json
{
  "index": { "file": "src/figma-component-keys/index.md", "sha256": "<hash>" },
  "variant_keys": { "file": "src/figma-component-keys/variant-keys/<comp>.md", "sha256": "<hash>" }
}
```
