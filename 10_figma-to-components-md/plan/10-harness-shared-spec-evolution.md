# 10번 하네스 진화 — Figma 링크 → 플랫폼 중립 "공유 spec design.md" 자동 생성

## Context

현재 워크스페이스에는 두 개의 컴포넌트 spec 산출물이 분리되어 있다.

- **03_wf-figma-to-description** → `draft-descriptions/*.description.yaml` (검증 후 Figma Component Description에 기록되는 플랫폼 중립 SoT)
- **04_wf-figma-to-react-components** → `src/figma/*.source.md` (React 구현 전 evidence + 구현 결정 기록, React 의존)

이 둘은 **Figma Description 필드를 매개로 한 간접 연결**만 갖는다. 04 워크플로 contract상 03이 적은 description YAML을 강제로 우선 활용하지 않으므로, 같은 정보를 04 에이전트가 다시 추론하는 중복이 발생한다. Swift/Kotlin 파이프라인은 아직 미존재이지만 03 bridge 스키마가 이미 `platform_bindings.swift/kotlin` 자리를 비워두고 있다.

사용자가 원하는 것: **하나의 Figma 링크만 입력하면, 03 YAML의 component_contract 수준 정보 + 04 source.md의 *플랫폼 중립* 섹션을 통합한 단일 design.md를 자동 생성**. 이 합본은 03/04를 대체하지 않고 **별개의 "공유 spec" 카테고리**로서 React/Swift/Kotlin 모든 플랫폼이 참조하는 공통 입력이 된다.

도구: 이미 "Figma URL → design.md" 자동화 기반(생성-평가 루프 5회, fixture lock, 정적 게이트, 픽셀 비교)을 갖춘 `10_figma-to-components-md/` 하네스를 진화시킨다.

핵심 결정 (사용자 합의):
1. **Scope**: Layer 1만 — 100% 플랫폼 중립, Figma 단독으로 추출 가능한 정보만
2. **Position**: 03/04와 별개의 신규 카테고리 ("공유 spec")
3. **Tool**: 10번 하네스 진화 (신규 도구 신설 X)
4. **Storage**: `10_figma-to-components-md/_workspace/outputs/`
5. **Visual gate**: `representative_variant` 1개를 spec에 명시 → 그것만 HTML 렌더 + SSIM 비교 (시각 검증 가치 유지)

---

## 컴포넌트 키 레지스트리 SoT 규약

`src/figma-component-keys/index.md` + `src/figma-component-keys/variant-keys/<component>.md`를 **컴포넌트/변형 식별자의 유일 SoT**로 격상한다.

- **이유**: 이 파일들은 이미 mainline tracked, Figma file key + 모든 component set의 (Name, Level, Node ID, Component Set Key, Variant Count), 그리고 각 set의 전체 variant 표(Variant 이름, Node ID, Variant Component Key)를 가진다. Codex Finding 1이 요구한 "set-equality 검증의 SoT"가 fixture가 아닌 여기다. fixture에 `variant_registry.json`을 또 두면 두 곳이 어긋난다.
- **읽기 전용**: harness/agents는 이 파일들을 수정하지 않는다. 갱신은 외부 파이프라인(Figma readback) 책임. 단, harness는 staleness(`Last checked` 날짜)를 경고로 출력할 수 있다.
- **fixture에서의 처리**:
  - `fixture/variant_registry.json` (Phase B에서 신설하려던 것) **취소** — 대신 `fixture/component_keys_snapshot.json`에 `{ index_sha256, variant_keys_sha256 }`만 핀.
  - 이후 `src/figma-component-keys/`가 갱신되면 fixture invalidate.
- **frontmatter에서의 참조**:
  - `component.figma_name`, `component.node_id`, `component.component_set_key`는 index.md 행에서 그대로 가져옴 (재추론 금지).
  - `variants.registry`는 `variant-keys/<comp>.md`의 표를 그대로 흡수.
  - frontmatter에 `component.level: "Atom" | "Molecule"` 필드 추가 (index.md `Level` 컬럼에서 가져옴).

---

## 토큰 SoT 규약

`src/tokens/tokens.{color,typography,size}.v1.0.json`을 **유일한 토큰 SoT**로 격상한다.

- **이유**: 이 파일들은 이미 versioned(`stageLabel: "v1.0"`), multi-mode(color는 light/dark, typography는 ios/aos/web), `platformCode` 포함, `source.fileKey`로 Figma와 연결되어 있다. fixture에 별도 `token_map.json`을 두면 (a) 두 파일이 어긋날 수 있고 (b) Codex Finding 3-a가 지적한 "토큰 path 검증" 의 정답이 fixture가 아닌 이 파일이다.
- **읽기 전용**: harness/agents는 `src/tokens/*.json`을 수정하지 않는다. 갱신은 외부 파이프라인(Figma → tokens.json export) 책임.
- **fixture에서의 처리**:
  - 기존 `fixture/token_map.json`은 **제거**. fixture는 컴포넌트별 1회 캡처고, 토큰 카탈로그는 파일 단위(전역)이므로 별개 위치가 옳다.
  - 대신 `fixture/token_snapshot.json` 신설: 해당 컴포넌트 fixture 캡처 시점의 `src/tokens/*.json` SHA256 + version만 기록. 이후 토큰 파일이 바뀌면 fixture invalidate.
- **frontmatter에서의 참조 (Codex 2차 Finding 2 반영)**:
  - 토큰 참조는 **`id` 기반**이 정답. tokens.json의 `name` 필드는 중복이 존재함이 확인됨 (예: `base/lineheight/text-lineheight-100`이 서로 다른 `id`로 여러 개 존재). name-only resolver는 silent하게 잘못된 토큰을 resolve할 수 있음.
  - 정식 표기: `token:system.color.button.black` (tokens.json의 `id` 필드 그대로)
  - legacy `{cds: system/color/button/black}` form은 편의 표기로만 허용. resolver가 name → id로 lookup하되 **하나의 name이 복수 id에 매핑되면 ambiguity error로 FAIL**. 모호하면 유저가 직접 `id`로 작성해야 함.
  - frontmatter 상단에 토큰 카탈로그 핀 추가 (sha256이 invalidation의 진짜 SoT, version/date는 metadata):
    ```yaml
    token_catalog:
      color: { file: "src/tokens/tokens.color.v1.0.json", version: "0.4.10" }      # version은 사람용
      typography: { file: "src/tokens/tokens.typography.v1.0.json", version: "0.4.10" }
      size: { file: "src/tokens/tokens.size.v1.0.json", version: "0.4.10" }
      render_mode:
        color: "light"        # 시각 게이트 렌더 시 사용할 모드
        typography: "web"     # HTML 렌더이므로 web 모드
    ```
  - 같은 버전·모드를 Swift/Kotlin 파이프라인이 자체 모드로 재해석할 수 있도록 `render_mode`는 시각 게이트용으로만 사용한다고 명시(spec 자체는 mode-agnostic).

---

## 스펙 설계 — 합본 design.md 형식

### 형식 골격
04 source.md와 동일한 **YAML frontmatter + Markdown body 하이브리드** 채택. frontmatter에는 03 component_contract 흡수, body에는 04 source.md의 platform-neutral 섹션 흡수.

### YAML frontmatter (03 component_contract 흡수)

```yaml
---
schema: "shared-component-spec/v1"
component:
  name: "<kebab-case>"                       # variant-keys/<name>.md 파일명과 일치
  figma_name: "<Figma 컴포넌트 정확명>"      # index.md의 Component 컬럼과 일치
  description: "<한 줄>"
  figma_file: "<file_key>"                   # index.md 상단 `Figma file:` 값
  node_id: "<component_set_node_id>"         # index.md Node ID 컬럼
  component_set_key: "<component_set_key>"   # index.md Component Set Key 컬럼
  level: "Atom | Molecule"                   # index.md Level 컬럼 — composition 정책에 사용
  last_synced: "<YYYY-MM-DD>"                # index.md `Last checked` 날짜

axes:
  <AxisName>: ["<value1>", ...]

variants:
  count: <n>
  formula: "<Axis1(n1) x Axis2(n2)>"
  constraints:
    - "<유효/무효 조합>"
  registry:
    - { variant: "<name>", node_id: "<id>", key: "<component_key>" }
  representative:
    variant: "<대표 variant 이름>"
    node_id: "<id>"
    rationale: "<왜 이 variant가 대표인지>"

props:
  <PropName>:
    type: '"<v1>" | "<v2>"'
    default: '"<default>"'
    description: "<설명>"

tokens:
  <token_key>:
    part: "<part_name>"
    role: "fill | stroke"
    applies_to: "<Status=...>"               # axes/props 도메인의 predicate
    default: "token:system.color.button.black"  # src/tokens/tokens.color.v1.0.json의 id (name 아님 — 중복 위험)
    fixed: "token:system.fixed_color.white"     # 동일
    rendered_pixel_observed: "<선택, hex>"   # 04 Token vs Rendered Pixel의 neutral 측정값만

typography:
  <text_role>:
    font_family: "<Figma fontFamily>"
    classification: "actual-font | system-alias | token-alias | unknown"
    system_fallback: "<...>"
    token_fallback: "token:typography.web.body.text-style-100"  # tokens.typography.v1.0.json의 id
    note: "<...>"

assets:
  <asset_key>:
    part: "<...>"
    role: "icon | image | logo | badge | emoji"
    source: "<DS asset key or Figma node id>"
    applies_to: "<...>"
    size: "<WxHpx>"
    semantic_rule: "<...>"

composition:
  uses:
    - component: "<nested>"
      node_id: "<...>"
      role: "<...>"
      usage_condition: "<...>"

layout:
  component_size: "<WxHpx>"
  part_spacing:
    "<a>__to__<b>":
      default: { token: "<...>", value: "<Npx>" }
      variants:
        - when: "<...>"
          token: "<...>"
          value: "<Npx>"

# 04 Sizing Interpretation의 platform-neutral 부분 흡수 — 원본 측정값만, CSS 결정은 제외
sizing:
  <part_name>:
    figma_intrinsic: "<WxHpx>"          # Figma 노드의 실제 크기
    figma_constraint: "FIXED | HUG | FILL"
    note: "<선택, neutral한 의도 메모>"

text_behavior:
  <text_role>:
    text_auto_resize: "NONE | WIDTH_AND_HEIGHT | HEIGHT | TRUNCATE"
    overflow_policy: "<...>"

implementation_order:
  - "<플랫폼 중립 구현 순서>"

implementation_coverage:
  axes: "<...>"
  props: "<...>"
  assets: "<...>"
  layout: "<...>"
  exclusions: "<제외 사유>"

rules:
  do: ["<...>"]
  dont: ["<...>"]

# 렌더링 친화 토큰 단축 (10번 하네스의 기존 렌더링 파이프라인 유지를 위해)
colors:
  <name>: "{cds: system.color.xxx}"
spacing:
  <name>: "<Npx>"
rounded:
  <name>: "<Npx>"

source_gaps:
  - { part: "<...>", reason: "<...>" }
---
```

### Markdown body (04 source.md의 platform-neutral 섹션 흡수)

```markdown
## Overview
컴포넌트 목적·맥락 (03 description + 보충 narrative).

## Source Reads
실제 수행된 MCP 호출 목록 (figma_walker가 figma_raw에서 추출 + 사람이 보완).
- `mcp__figma-official__get_design_context(nodeId=...)`
- `mcp__Framelink_Figma_MCP__get_figma_data(...)`

## Figma Identity
| Field | Value |
| --- | --- |
| Figma file | ... |
| Node ID | ... |
| Component key | ... |
| Last synced | ... |

## Variant Axes
- `<Axis>: [<v1>, <v2>, ...]`
- Variant formula: ...
- Representative: `<variant name>` (rationale)

## Figma Props
- `<PropName>`: type, default, description

## Layout
- component_size, part_spacing 의도 설명

## Asset Notes
- 각 asset의 part, role, source(node_id), semantic_rule

## Text Behavior Notes
- 각 text role의 textAutoResize / overflow_policy

## Implementation Order
플랫폼 중립 구현 순서 narrative.

## Do's and Don'ts
- ✅ ...
- ❌ ...

## Known Gaps
- 확인 못한 값과 그 이유 (source_gaps 매핑)
```

> **04 섹션 재분류 원칙** (Codex Finding 4 반영):
> 04 source.md의 일부 섹션은 platform-neutral 증거와 platform-specific 결정이 한 섹션 안에 섞여 있다. 일괄 제외하면 neutral 증거가 함께 누락된다. 따라서 **각 섹션의 결정/매핑 파트만 제외**, **증거 파트는 frontmatter 또는 body로 흡수**한다.
>
> | 04 섹션 | 흡수(neutral) | 제외(platform-specific) |
> |---|---|---|
> | Sizing Interpretation Notes | Figma 원본 측정값/제약 → `frontmatter.sizing.<part>` | CSS sizing 결정, width/height 처리 코드 |
> | Token vs Rendered Pixel Notes | 측정된 픽셀 색상 → `frontmatter.tokens.<key>.rendered_pixel_observed` (선택) | CSS 처리 결정, alpha 합성 코드 |
> | Alpha Token Notes | 토큰 분류(이미 `typography.<role>.classification`에 있음) | CSS opacity 처리, fallback 체인 |
> | Font Mapping Notes | font-family 분류(이미 `typography.<role>.classification`에 있음) | CSS font-family ordering, web font 로드 |
> | Nested Atom Mapping | 어떤 nested DS 컴포넌트가 어느 part인지 → `frontmatter.composition.uses` | React import 경로, prop 매핑 |
>
> **완전 제외**: `Code Mapping`(섹션 전체가 React 코드), 실제 asset export 파일 경로, baseline png 경로, visual-registry 항목.

---

## 변경 범위

### Phase 0 — 구현 시작 전 SoT 정합 (Codex 2차 Finding 1)

**현재 상태**: `git status` 확인 결과 `src/tokens/`, `src/figma-component-keys/`, 본 plan 파일이 모두 untracked. 이 상태로 구현하면 CI/main에 SoT 파일이 없어 harness가 local-only가 된다.

**액션**:
1. 본 plan 파일을 branch에 commit.
2. `src/tokens/tokens.{color,typography,size}.v1.0.json` 3개를 branch에 commit.
3. `src/figma-component-keys/index.md` + `variant-keys/*.md` 전체를 branch에 commit.
4. CI preflight 추가 (`scripts/preflight_sot.py` 신설):
   - 위 3개 SoT 경로가 git tracked인지 검증
   - missing 또는 untracked면 즉시 FAIL
5. `harness/lib/component_keys_loader.py` / `token_resolver.py`가 SoT 파일을 못 찾으면 명확한 에러 메시지로 FAIL ("SoT not committed; see Phase 0").

**결과**: 외부 빌드/CI에서도 동일 SoT가 보장됨. 이 단계가 끝나야 Phase A로 진입.

### Phase A — 스펙 재정의

**`harness/design-md-spec.md` 전면 재작성**
- 위 frontmatter + body 합본 스펙을 단일 SoT로 명시
- `representative_variant` 선정 규칙: variants 중 axes 기본값 조합 우선, 없으면 첫 variant
- 03 schema와의 매핑 표 추가 (`component_contract.<X>` → `frontmatter.<X>`)
- 04 source-note-contract.md와의 매핑 표 추가 (어떤 섹션이 합본에 들어오고, 어떤 섹션은 React-only로 제외되는지 명시)
- 기존 "10개 정적 체크" 표는 새 게이트 표로 교체 (Phase C에서 정의)

### Phase B — fixture 확장

현재 fixture: `component_spec.json` + `figma_raw.json` + `token_map.json` + `figma_screenshot.png`
- 기존 정보로는 03 component_contract 수준의 풍부한 변형 정보 추출 불가
- `token_map.json`은 **삭제** (위 "토큰 SoT 규약" 참조). `src/tokens/*.json`이 SoT.

**`fixture/`에 추가**:
- ~~`variant_registry.json`~~ **취소** — `src/figma-component-keys/variant-keys/<comp>.md`가 SoT (위 "컴포넌트 키 레지스트리 SoT 규약" 참조). fixture에는 sha256 핀만.
- `text_behavior_meta.json` — 각 TEXT 노드의 `textAutoResize`, parent sizing, 관찰된 overflow 단서.
- `asset_nodes.json` — icon/image/logo/badge로 분류된 노드의 node_id, role, parent variant.
- `mcp_read_log.json` — 실제 수행한 MCP 호출 목록 (Source Reads 본문 생성용).

**fixture 메타 스키마 (Codex Finding 2 반영)**:
- `fixture/fixture.meta.json` 신설 — 다음 필드 필수:
  - `schema_version: "v2-representative"` (v1 fixture는 명시적으로 reject)
  - `figma_screenshot.kind: "representative_variant"` (component-set 전체 스크린샷 reject)
  - `figma_screenshot.node_id: "<representative variant의 node_id>"`
  - `figma_screenshot.captured_at: "<ISO8601>"`
- `fixture/token_snapshot.json` 신설 — 캡처 시점 토큰 SoT 핀:
  - `{ file: "src/tokens/tokens.color.v1.0.json", version: "0.4.10", sha256: "<hash>" }` × 3개 파일
- `fixture/component_keys_snapshot.json` 신설 — 캡처 시점 키 레지스트리 SoT 핀:
  - `{ index: { file: "src/figma-component-keys/index.md", sha256: "<hash>" }, variant_keys: { file: "src/figma-component-keys/variant-keys/<comp>.md", sha256: "<hash>" } }`
- `fixture.lock` SHA256 목록에 신규 3개 파일 + `fixture.meta.json` + `token_snapshot.json` + `component_keys_snapshot.json` 모두 포함.
- 기존 v1 fixture(`figma_screenshot.png`이 component-set 전체, `token_map.json` 존재)는 마이그레이션 스크립트 없이 **재캡처 필수**. 이는 회귀 방지용.

**`servers/figma_mcp_adapter.py` 갱신**:
- 위 3개 fixture 파일(`text_behavior_meta.json`, `asset_nodes.json`, `mcp_read_log.json`) + 메타 3종(`fixture.meta.json`, `token_snapshot.json`, `component_keys_snapshot.json`)을 함께 생성하도록 확장
- variant 목록은 MCP 호출 결과로 만들지 않고 `src/figma-component-keys/variant-keys/<comp>.md`를 파싱해 사용 (SoT 우선)
- 03 PLAYBOOK이 사용하는 Console MCP `figma_get_component_for_development_deep` 호출을 추가해 enriched metadata 수집

**`harness/lib/figma_walker.py` 갱신**:
- variant 노드 collection 함수 추가 (단, identity는 `component_keys_loader`가 SoT)
- TEXT 노드의 textAutoResize/parent layout 추출 함수 추가
- asset role 분류 함수 추가 (Figma INSTANCE의 mainComponent name pattern으로 icon/image/logo/badge 감지)

**`harness/lib/component_keys_loader.py` 신설**:
- `src/figma-component-keys/index.md` 파싱 → `{name → { figma_name, level, node_id, component_set_key, variant_count }}` dict
- `src/figma-component-keys/variant-keys/<comp>.md` 파싱 → `[{ variant, node_id, key }]` list
- `figma_file_key()` → index.md 상단의 file key 반환
- `index_last_checked()` → index.md 상단의 `Last checked` 날짜 반환 (staleness 경고용)

**`harness/lib/token_resolver.py` 갱신** (Codex 2차 Finding 2 반영):
- 입력을 fixture `token_map.json`에서 **`src/tokens/tokens.{color,typography,size}.v1.0.json`** 로 변경
- 모드 인자(`mode: "light" | "dark" | "web" | "ios" | "aos"`) 받도록 시그니처 변경
- 1차 lookup은 **`id` 기반** (`resolve_by_id(token_id, mode)`). id가 SoT의 unique key.
- 보조 lookup `resolve_by_name(name, kind)` 제공하되 한 name에 복수 id가 매핑되면 `AmbiguousTokenName` 예외 raise. ambiguity 발견 즉시 게이트가 FAIL되도록 사용.
- 검증 함수 노출: `token_id_exists(token_id, kind)`, `token_id_has_mode_value(token_id, mode)`. Phase C 게이트에서 사용.

### Phase C — 정적 평가 게이트 재설계

**`servers/design_md_harness.py` 갱신**: 기존 10개 게이트 일부 대체 + 새 게이트 추가

| ID | 현재 → 변경 |
|---|---|
| `text-coverage` | 유지 (Markdown body의 ## Asset Notes / ## Layout 등에서 검사) |
| `color-coverage` | 유지 |
| `typography-coverage` | 유지 |
| `component-coverage` | 유지 (composition.uses 체크로 확장) |
| `layout-coverage` | 유지 |
| `token-colors` | 유지 |
| `token-typography` | 유지 |
| `broken-ref` | 유지 |
| `missing-sections` | 새 필수 섹션 목록으로 갱신 (Overview/Source Reads/Figma Identity/Variant Axes/Figma Props/Layout/Asset Notes/Text Behavior Notes/Implementation Order/Do's and Don'ts/Known Gaps) |
| `section-order` | 위 순서로 갱신 |
| **신규** `variants-registry-matches-source-of-truth` | (Codex Finding 1, refined) variants.registry의 `(node_id, key)` set이 **`src/figma-component-keys/variant-keys/<comp>.md`** 와 정확히 일치. 단순 길이 체크 아님. 누락/중복/오타 모두 탐지 |
| **신규** `component-identity-matches-index` | frontmatter `component.{figma_name, node_id, component_set_key, level}`가 `src/figma-component-keys/index.md`의 해당 행과 정확히 일치 |
| ~~`composition-policy-by-level`~~ | (Codex 2차 Finding 4) **삭제**. index.md 본문이 직접 "Level은 내부 분류 참고값, 실제 조합은 live readback과 Description composition.uses로 확인하며 Level보다 우선"이라고 명시. Level을 hard FAIL로 쓰는 것은 SoT 자체가 금지. composition 검증은 아래 `composition-matches-bridge`로 대체 |
| **신규** `composition-matches-bridge` | (Codex 2차 Finding 4 대체안) frontmatter `composition.uses`가 03 워크플로의 `bridge-descriptions/<comp>.bridge.yaml`의 `component_contract.composition.uses`와 일치(있을 때). bridge 파일이 없으면 `source_gaps`에 `composition: not-yet-validated` 항목이 있는지만 검증. 즉 evidence 기반 |
| **신규** `component-keys-sha256-matches` | (Codex 2차 Finding 3) **현재** `src/figma-component-keys/index.md`와 `variant-keys/<comp>.md`의 sha256을 계산해 fixture `component_keys_snapshot.json`의 핀과 비교. 1바이트 변동만 있어도 FAIL → fixture 재캡처. last_synced/Last checked는 metadata로만 |
| **신규** `representative-variant-defined` | variants.representative.variant + node_id 존재 |
| **신규** `representative-screenshot-matches-spec` | (Codex Finding 2) `fixture.meta.json.figma_screenshot.node_id` == `frontmatter.variants.representative.node_id`. fixture가 옛 component-set 전체 스크린샷이면 FAIL |
| **신규** `tokens-id-resolves` | (Codex 1차 Finding 3-a + 2차 Finding 2) `tokens.<key>.default`/`fixed`가 **`src/tokens/tokens.{color,size}.v1.0.json`의 `id` 필드**에서 resolve됨. 미존재 id FAIL |
| **신규** `tokens-id-has-mode-value` | (Codex 2차 Finding 2) 위 토큰이 `token_catalog.render_mode`에 지정된 모드(예: `color="light"`)에서 실제 값(`values[mode].raw`)을 가짐. 모드 값 누락 시 FAIL |
| **신규** `typography-id-resolves` | `typography.<role>.token_fallback`이 `tokens.typography.v1.0.json`의 `id`에서 resolve됨 + `render_mode.typography`(예: `web`)에서 값 존재 |
| **신규** `tokens-name-not-ambiguous` | (Codex 2차 Finding 2) frontmatter에 legacy name form(`{cds: ...}`)을 사용한 경우, name이 SoT에서 unique한지 검증. 복수 id 매핑이면 FAIL 후 사용자가 직접 `id`로 재작성 요구 |
| **신규** `token-catalog-sha256-matches` | (Codex 2차 Finding 3) **현재** `src/tokens/*.json` 3개 파일의 sha256을 그때그때 계산해 fixture `token_snapshot.json`의 핀과 비교. 1바이트 변동만 있어도 FAIL → fixture 재캡처. version/date는 metadata로만 존재 |
| **신규** `tokens-applies-to-valid` | (Codex Finding 3-b) `applies_to` predicate를 frontmatter `axes`/`props` 도메인에 대해 파싱. 예: `"Status=Default"`의 `Status`가 axes 키에 없거나 `Default`가 axes 값에 없으면 FAIL |
| **신규** `implementation-coverage-fields` | implementation_coverage.{axes,props,assets,layout,exclusions} 모두 비어있지 않음 |
| **신규** `rules-non-empty` | rules.do와 rules.dont 모두 1개 이상 |
| **신규** `composition-uses-blacklist` | composition.uses에 low-level vector/icon_area 등록 안 됐는지 (블랙리스트 패턴) — `composition-policy-by-level`과 별개로 유지 |
| **신규** `fixture-schema-version` | (Codex Finding 2) `fixture.meta.json.schema_version == "v2-representative"`. v1이면 즉시 FAIL |

`harness/lib/fix_hints.py`에 신규 게이트의 fix_hint 메시지 템플릿 추가.

### Phase D — 시각 검증 (대표 variant만)

**`design_md_renderer` 에이전트 갱신**:
- frontmatter `variants.representative` 읽기
- 해당 variant 1개에 대해서만 HTML 변환 (현재 `components.children` 트리 렌더링 로직 재사용 가능)
- 렌더 시 `applies_to` 조건은 representative variant의 axes 값을 기준으로 해석 (예: `applies_to: "Status=Default"`이고 representative가 Default면 default 토큰 사용)
- 토큰 resolve는 **`src/tokens/*.json`을 직접 읽어** frontmatter `token_catalog.render_mode.{color,typography}`에 지정된 모드 값으로 resolve (color는 `light`, typography는 `web`이 기본). 기존 `token_resolver` 모듈을 src/tokens 직접 로드 방식으로 교체.

**`servers/pixel_compare.py`**: 변경 없음 (대표 variant 렌더 결과 vs Figma representative variant 스크린샷 비교)

**`fixture/figma_screenshot.png`**: representative variant 1개 스크린샷으로 한정. 기존 component-set 전체 스크린샷이면 Phase B에서 fixture 갱신 시 representative variant 스크린샷으로 교체. `fixture.meta.json`에 `kind`/`node_id` 메타를 함께 기록해 `representative-screenshot-matches-spec` 게이트가 검증한다.

**`design_md_qa` 에이전트 갱신**:
- diff 결과 → frontmatter의 어떤 YAML 경로(예: `tokens.<key>.default`, `layout.part_spacing.<a__to__b>.default.value`)를 수정해야 하는지로 fix_hints 출력
- 본문 Markdown 섹션 수정 지시 형식도 추가 (예: "## Asset Notes의 <key> semantic_rule 수정 필요")

### Phase E — generator/agent 프롬프트 갱신

**`.claude/agents/design_md_generator.md`**:
- 출력 스펙을 새 합본 design.md로 갱신 (frontmatter 03 component_contract 수준 + body 04 platform-neutral 섹션)
- 입력 fixture 목록 갱신 (variant_registry, text_behavior_meta, asset_nodes, mcp_read_log 추가)
- "React/HTML 코드 작성 금지" 유지 + "platform-specific binding 정보 작성 금지" 추가 (Code Mapping, CSS 결정 등)
- representative_variant 선정 규칙 명시 (axes 기본값 조합 우선)

**`.claude/agents/design_md_renderer.md`**:
- representative variant 1개만 렌더하는 절차 명시
- frontmatter `variants.representative` 읽기 → 해당 노드의 axes 값으로 `applies_to` 조건 해석

**`.claude/agents/design_md_qa.md`**:
- diff 결과를 새 frontmatter 경로 + body 섹션 둘 다로 사상하는 fix_hints 형식

### Phase F — 워크플로/오케스트레이터/CLAUDE.md 갱신

**`harness/workflow.md`**: Phase 0의 fixture 생성 단계에 신규 4개 파일 생성 추가, Loop의 generator 입력에 추가 fixture 명시

**`harness/orchestrator.md`**: 통과 판정 변경 없음 (`PASS = 정적 all_pass AND pixel.pass`), 단 정적 게이트 목록 갱신 반영

**`CLAUDE.md`**:
- 1번 룰 추가: "**합본 design.md는 플랫폼 중립만** — Code Mapping, CSS 결정, asset export 경로, baseline 경로 작성 금지"
- "평가 게이트" 표를 새 게이트 목록으로 교체
- "산출물 위치 규약" 표는 그대로 (`_workspace/outputs/<ComponentName>.md` 동일)

**`README.md`**: 정체성 갱신 — "공유 spec(design.md) 자동 생성기. React/Swift/Kotlin 모든 플랫폼이 참조하는 플랫폼 중립 SoT를 Figma 링크 한 방으로 생성."

### Phase G — 검증

**리팩터링 직후**:
1. `python3 -c "from harness.lib import token_resolver, figma_walker, component_keys_loader, fix_hints, handoff"` — import 정상
2. `python3 servers/design_md_harness.py --help` — CLI 동작
3. `python3 servers/figma_mcp_adapter.py --help` — 동일
3a. `python3 scripts/preflight_sot.py` — SoT 파일 tracked 검증 PASS

**엔드투엔드 (기준 케이스 1개, 예: avatar)**:
4. `/figma-to-md <Figma URL>` 실행
5. `_workspace/outputs/avatar.md`가 생성되고 frontmatter에 다음이 모두 채워졌는지:
   - `component`, `axes`, `variants.registry`, `variants.representative`, `props`, `tokens` (applies_to 포함), `typography`, `assets`, `composition`(있으면), `layout`, `sizing`, `text_behavior`, `implementation_order`, `implementation_coverage`, `rules`
6. body에 11개 섹션이 순서대로 존재
7. 정적 게이트 모두 PASS (특히 신규 `variants-registry-matches-source-of-truth`, `component-identity-matches-index`, `composition-matches-bridge`, `representative-screenshot-matches-spec`, `tokens-id-resolves`, `tokens-id-has-mode-value`, `tokens-name-not-ambiguous`, `tokens-applies-to-valid`, `token-catalog-sha256-matches`, `component-keys-sha256-matches`, `fixture-schema-version`), 픽셀 비교 SSIM ≥ 0.85

**대조 검증 (단일 컴포넌트)**:
8. 같은 컴포넌트의 03 `draft-descriptions/avatar.description.yaml`과 합본 design.md frontmatter를 diff. 의미 있는 정보 누락이 없으면 OK.
9. 같은 컴포넌트의 04 `src/figma/avatar.source.md`에서 *platform-neutral 섹션*만 발췌해 합본 body와 diff. 특히 Sizing Interpretation의 원본 측정값이 `frontmatter.sizing`에, Nested Atom 관계가 `frontmatter.composition.uses`에 흡수되었는지 확인.

**회귀 방지 검증 (Codex Finding 2)**:
10. v1 fixture(`fixture.meta.json` 없거나 `schema_version != "v2-representative"`)로 harness를 실행하면 `fixture-schema-version` 게이트가 즉시 FAIL하는지 확인.
11. fixture는 v2이지만 `fixture.meta.json.figma_screenshot.node_id`가 spec의 representative와 다르게 조작된 경우 `representative-screenshot-matches-spec`가 FAIL하는지 확인.

**SoT 정합 검증 (키 레지스트리 격상)**:
12. variants.registry의 행 하나를 임의로 변경(예: variant_component_key 한 글자 수정)하면 `variants-registry-matches-source-of-truth`가 FAIL하는지 확인.
13. (삭제) — `composition-policy-by-level` 게이트 자체가 제거됨. 대신 14번 참조.
14. (Codex 2차 Finding 4) 03 `bridge-descriptions/<comp>.bridge.yaml`의 `composition.uses`와 frontmatter `composition.uses`를 의도적으로 한 항목 어긋나게 만들면 `composition-matches-bridge`가 FAIL하는지 확인. bridge 파일이 없는 컴포넌트는 frontmatter `source_gaps`에 `composition: not-yet-validated`가 있어야 PASS.
15. (sha256 mutation test, Codex 2차 Finding 3) `src/figma-component-keys/index.md` 끝에 공백 1자만 추가하고 fixture 재캡처 없이 실행 → `component-keys-sha256-matches`가 FAIL하는지 확인.
16. (sha256 mutation test) `src/tokens/tokens.color.v1.0.json`의 한 토큰 raw 값을 한 글자 변경 → `token-catalog-sha256-matches`가 FAIL하는지 확인.

**토큰 ID 정합 검증 (Codex 2차 Finding 2)**:
17. frontmatter `tokens.<key>.default`에 존재하지 않는 id(`token:nonexistent.foo`)를 넣으면 `tokens-id-resolves`가 FAIL하는지 확인.
18. 존재하는 id이지만 `render_mode.color="dark"`인 상황에서 해당 토큰의 `values.dark`가 비어있으면 `tokens-id-has-mode-value`가 FAIL하는지 확인.
19. `{cds: base/lineheight/text-lineheight-100}` 같은 ambiguous name을 frontmatter에 넣으면 `tokens-name-not-ambiguous`가 FAIL하는지 확인 (typography에 동일 name + 다른 id가 실제로 존재함).

---

## 핵심 파일 경로

**갱신** (10_figma-to-components-md/ 하위):
- `harness/design-md-spec.md` — 전면 재작성 (Phase A)
- `harness/workflow.md`, `harness/orchestrator.md` — 새 fixture/게이트 반영 (Phase F)
- `harness/lib/figma_walker.py` — variant collection, text_behavior 추출, asset 분류 추가 (Phase B)
- `harness/lib/token_resolver.py` — src/tokens/*.json 직접 로드 + 모드 분기 (Phase B)
- `harness/lib/component_keys_loader.py` — **신설**, src/figma-component-keys 파싱 (Phase B)
- `harness/lib/fix_hints.py` — 신규 게이트 메시지 템플릿 (Phase C)
- `scripts/preflight_sot.py` — **신설**, SoT 파일 git tracked 검증 (Phase 0)
- `servers/figma_mcp_adapter.py` — 4개 신규 fixture 파일 생성 (Phase B)
- `servers/design_md_harness.py` — 게이트 추가/조정 (Phase C)
- `.claude/agents/design_md_generator.md` — 새 스펙 반영 (Phase E)
- `.claude/agents/design_md_renderer.md` — representative variant만 렌더 (Phase D, E)
- `.claude/agents/design_md_qa.md` — 새 frontmatter 경로 fix_hints (Phase E)
- `CLAUDE.md` — 새 룰/게이트 (Phase F)
- `README.md` — 정체성 갱신 (Phase F)

**참고용 원본** (read-only):
- `/Users/jj.iee/Desktop/workspace/03_wf-figma-to-description/workflow/description-yaml-schema.md` — component_contract 스키마
- `/Users/jj.iee/Desktop/workspace/03_wf-figma-to-description/PLAYBOOK.md` — fixture 수집에 필요한 MCP 호출 절차
- `/Users/jj.iee/Desktop/workspace/04_wf-figma-to-react-components/workflow/source-note-contract.md` — source.md 섹션 contract (어느 섹션이 platform-neutral인지 분류)
- `/Users/jj.iee/Desktop/workspace/04_wf-figma-to-react-components/src/figma/avatar.source.md` — 합본 body의 형식 참고

**토큰 SoT** (read-only, 외부 export 책임):
- `/Users/jj.iee/Desktop/workspace/10_figma-to-components-md/src/tokens/tokens.color.v1.0.json`
- `/Users/jj.iee/Desktop/workspace/10_figma-to-components-md/src/tokens/tokens.typography.v1.0.json`
- `/Users/jj.iee/Desktop/workspace/10_figma-to-components-md/src/tokens/tokens.size.v1.0.json`

**컴포넌트 키 레지스트리 SoT** (read-only, 외부 readback 책임):
- `/Users/jj.iee/Desktop/workspace/10_figma-to-components-md/src/figma-component-keys/index.md`
- `/Users/jj.iee/Desktop/workspace/10_figma-to-components-md/src/figma-component-keys/variant-keys/<component>.md`

---

## Out of Scope (Phase 2 후보)

- React platform binding 자동 생성 (현재 04 워크플로가 source.md 작성 시 합본을 우선 입력으로 활용하도록 contract 변경 — 04 측 작업)
- Swift/Kotlin sibling repo 신설 (`05_wf-figma-to-swift-components/`, `06_wf-figma-to-kotlin-components/`)
- 03 워크플로의 description.yaml과 합본의 동기화 (양방향) — 일단 합본은 신규 카테고리로만 운영
- Skills 분리 (10번 1주 운영 후 재평가)

---

## 메모

- 본 plan은 Plan mode가 지정한 `/Users/jj.iee/Desktop/workspace/.claude/plans/md-memoized-wand.md`에 우선 작성. 사용자 결정에 따라 본 프로젝트 저장본은 `10_figma-to-components-md/plan/`에만 둔다 (96_plan-compare 복사 안 함).
- 직전 plan 내용("10번 하네스 초기 리팩터링")은 본 task와 별개로 이미 구현 완료. 본 파일은 새 task로 overwrite됨.
- **2026-05-11 Codex adversarial review 반영**: 4개 high-priority finding 모두 수용.
  - Finding 1 → Phase C `variants-registry-matches-fixture` (set-equality)
  - Finding 2 → Phase B `fixture.meta.json` (schema_version + screenshot kind/node_id) + Phase C 신규 게이트 2개 (`fixture-schema-version`, `representative-screenshot-matches-spec`) + Phase G 회귀 방지 검증 2개
  - Finding 3 → Phase C `tokens-applies-to`를 `tokens-path-resolves` + `tokens-applies-to-valid` 두 게이트로 분리
  - Finding 4 → 스펙 frontmatter에 `sizing` 추가 + `tokens.<key>.rendered_pixel_observed` 추가 + 04 섹션 재분류 표로 "명시적 제외" 블록 교체
- **2026-05-11 토큰 SoT 격상**: `src/tokens/tokens.{color,typography,size}.v1.0.json`을 유일 토큰 SoT로 격상.
  - fixture `token_map.json` 제거 → `token_snapshot.json` (버전 핀)으로 대체
  - frontmatter `token_catalog` 핀 + `render_mode` 추가 (spec은 mode-agnostic, 시각 게이트 모드만 명시)
  - 신규 게이트 `tokens-path-resolves` (color/size), `typography-path-resolves`, `token-catalog-pinned`
  - `harness/lib/token_resolver.py` 입력 소스 src/tokens/*.json + 모드 분기로 변경
- **2026-05-11 컴포넌트 키 레지스트리 SoT 격상**: `src/figma-component-keys/{index.md, variant-keys/<comp>.md}`를 유일 식별자 SoT로 격상.
  - fixture `variant_registry.json` 신설 계획 **취소** → `component_keys_snapshot.json` (sha256 핀)으로 대체
  - frontmatter `component.level` 추가 (Atom/Molecule, **metadata only**)
  - 신규 게이트 `variants-registry-matches-source-of-truth`, `component-identity-matches-index`, `composition-matches-bridge`(아래 2차 review 반영), `component-keys-sha256-matches`(아래 2차 review 반영)
  - `harness/lib/component_keys_loader.py` 신설
- **2026-05-11 Codex 2차 adversarial review 반영**: 4개 finding 모두 수용.
  - Finding 1 → Phase 0 신설 (구현 시작 전 SoT/plan 파일 branch commit + CI preflight)
  - Finding 2 → 토큰 reference를 `name`에서 **`id` 기반**으로 변경. legacy name form은 ambiguity 검출 게이트(`tokens-name-not-ambiguous`)와 함께 보조 표기로만. 신규 게이트 `tokens-id-resolves`, `tokens-id-has-mode-value`, `typography-id-resolves`. token_resolver는 `resolve_by_id` primary, `resolve_by_name`은 ambiguity raise.
  - Finding 3 → snapshot 검증을 version/date에서 **sha256 비교**로 교체. `token-catalog-pinned` → `token-catalog-sha256-matches`, `component-keys-snapshot-pinned` → `component-keys-sha256-matches`. version/date는 metadata only. Phase G에 mutation test 2건 추가.
  - Finding 4 → `composition-policy-by-level` 게이트 **삭제**. index.md가 직접 "Level은 advisory, live readback이 우선"이라 명시했음. 대체로 `composition-matches-bridge` 신설 (03 bridge yaml과 정합 검증, 없으면 source_gaps에 명시).
