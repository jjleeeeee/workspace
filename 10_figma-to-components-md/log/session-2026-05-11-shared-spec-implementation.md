# Session Log — 2026-05-11 (공유 spec design.md 구현)

## 세션 개요

이전 세션(`session-2026-05-11-shared-spec-ideation.md`)에서 아이데이션 + 플랜 작성 완료.  
본 세션은 **`10_figma-to-components-md/plan/10-harness-shared-spec-evolution.md`를 실제 코드로 구현**하는 작업.

브랜치: `codex-react-code-connect-reset`  
작업자: 이정주B / Claude Sonnet 4.6  
커밋: 2개 (`f6af4c3`, `1c9160d`)

---

## 1. 작업 전 Codex 검토 2라운드

### 1.1 Codex 1라운드 리뷰 (plan 초안 검토)

**원본 plan 파일**: `plan/10-harness-shared-spec-evolution.md`

Codex adversarial review 결과 — 주요 지적:
1. 토큰 SoT가 `cds_tokens.json` (GitHub API fetch)라 외부 의존, 항목 불일치 위험
2. `variant_registry.json`을 fixture에 넣으려 했으나 진짜 SoT가 어디인지 불명확
3. 게이트가 sha256이 아닌 version/date 비교라 약함
4. `composition-policy-by-level`이 Level을 규범으로 쓰는데 index.md가 "advisory"라 명시

### 1.2 토큰 SoT 재정의 (`src/tokens/*.json` 방향)

사용자 지시: "`src/tokens/`에 있는 JSON 파일을 토큰 SoT로 놓는 방향으로 정리해보자."

**발견**:
- `src/tokens/tokens.color.v1.0.json`: 503개 토큰, `id` 필드가 canonical (예: `token:system.color.button.black`)
- `src/tokens/tokens.typography.v1.0.json`: 250개 토큰, **name이 31건 중복**. id만 unique.
- `src/tokens/tokens.size.v1.0.json`: 83개 토큰
- 구조: `tokens[].id`, `tokens[].name`, `tokens[].values.{light/dark/ios/aos/web}.raw`

**결정**:
- `token_map.json` 삭제 → `src/tokens/*.json`을 직접 SoT로 사용
- 토큰 참조: `token:system.color.button.black` 형식 (id 기반, unique) 권장
- `{cds: name}` 형식은 허용하되 `AmbiguousTokenName` 예외 처리
- sha256 snapshot 비교로 invalidation

### 1.3 컴포넌트 키 SoT 확인 (`src/figma-component-keys/`)

사용자 지시: "`src/figma-component-keys/`도 살펴봐라."

**발견**:
- `index.md`: 36개 컴포넌트, 각 항목에 figma_name / Level(Atom/Molecule) / node_id / component_set_key / variant_count
- `variant-keys/<comp>.md`: 각 컴포넌트의 variant 전체 목록 (variant_name, node_id, component_key)
  - 예: `avatar.md` — 44개 variant
- Level은 "advisory" (index.md 본문에 명시) → 규범으로 쓰면 안 됨

**결정**:
- `variant_registry.json` fixture 파일 → 취소. `variant-keys/`가 이미 SoT
- sha256 snapshot (`component_keys_snapshot.json`)으로 staleness 감지
- `composition-policy-by-level` 게이트 → 삭제. `composition-matches-bridge` (03 bridge yaml과 비교)로 대체

### 1.4 Codex 2라운드 리뷰 (SoT 정리 후 재검토)

Codex adversarial review 결과 — 주요 지적:
1. typography name 31건 중복 — `{cds: name}` 단일 id 보장 불가
2. snapshot gate가 version string 비교라 약함 — sha256이어야 함
3. `composition-policy-by-level`이 Level을 규범으로 쓰는 문제 (동일 지적)
4. Level은 index.md가 "advisory"라 명시 → 합본이 이걸 gate로 쓰면 안 됨

**Plan 반영 결정**:
- `token_catalog` frontmatter에 sha256 핀 필드 추가
- `tokens-name-not-ambiguous` 게이트 추가 (name → 복수 id 매핑 감지)
- `token-catalog-sha256-matches`, `component-keys-sha256-matches` 게이트 추가
- `composition-policy-by-level` → `composition-matches-bridge`로 교체
- representative_variant 선정 규칙 명시

---

## 2. 구현 결정: "코드작성은 직접하고 Codex는 나중에 리뷰로만"

세션 중 Codex rescue를 실행했으나 사용자가 중단 요청.

**사용자 지시**: "codex rescue는 오류가 있으므로 쓰지말것. 코드작성은 직접하고 나중에 codex로 리뷰돌릴거야."

이후 모든 코드 작성은 직접 Edit/Write 도구로 진행. Codex는 review 전용.

---

## 3. Phase 0: SoT Preflight 스크립트

### 파일: `scripts/preflight_sot.py`

**역할**: SoT 5개 경로가 git-tracked 상태인지 사전 검증. 미충족 시 "Phase 0 안내" FAIL 출력.

**검증 대상**:
- `src/tokens/tokens.color.v1.0.json`
- `src/tokens/tokens.typography.v1.0.json`
- `src/tokens/tokens.size.v1.0.json`
- `src/figma-component-keys/index.md`
- `src/figma-component-keys/variant-keys/` (1개 이상 파일)

**검증 방법**: `git ls-files --error-unmatch <path>` → exit code 0이면 tracked

**검증 결과**: `[preflight] PASS — SoT 5개 경로 모두 git tracked`

---

## 4. Phase B: `harness/lib/` 모듈 확장

### 4.1 `harness/lib/token_resolver.py` — 전면 재작성

**기존**: `{cds: x}` / `{colors.x}` 단순 파싱, `cds_tokens.json` 기반

**신규**: `src/tokens/*.json` 직접 읽기, id 기반 조회 API

```python
class AmbiguousTokenName(ValueError): pass

def token_id_exists(token_id: str) -> bool
def token_id_has_mode_value(token_id: str, mode: str) -> bool
def resolve_by_id(token_id: str, mode: str) -> str       # 권장
def name_to_ids(name: str) -> list[str]                  # 중복 감지용
def resolve_by_name(name: str, mode: str) -> str         # 복수 id → AmbiguousTokenName
```

내부적으로 `_get_catalog()` 캐시 (모듈 수준 `_catalog`). invalidate_cache() 노출.

**backward compat 유지**: `resolve_color()`, `resolve_spacing()`, `resolve_typography()`, `all_references_in()`

**검증**:
- `token_id_exists('token:system.color.button.black')` → True
- `token_id_has_mode_value(..., 'light')` → True
- `resolve_by_id(..., 'light')` → `#000000`
- ambiguous names: 31건 감지 (예: `'base/lineheight/text-lineheight-100'` → 2 ids)

### 4.2 `harness/lib/figma_walker.py` — 함수 추가

기존 walk/all_nodes/to_kebab/rgb_to_hex/resolve_token_name/extract_layout_axis/extract_padding/is_layout_node 유지.

**추가된 함수**:

```python
def collect_variant_nodes(figma_raw: dict) -> list[dict]
# → [{variant_name, node_id, parent_name}]

def extract_text_behavior(node: dict) -> dict
# → {node_id, name, text_auto_resize, overflow_policy}

def collect_text_behaviors(figma_raw: dict) -> list[dict]
# → 전체 TEXT 노드의 text_behavior

def classify_asset_role(node: dict) -> str | None
# → "icon" | "image" | "logo" | "badge" | None (regex 패턴 매칭)

def collect_asset_nodes(figma_raw: dict) -> list[dict]
# → 분류 가능한 노드 목록
```

**classify_asset_role 분류 기준**:
- `_LOGO_PATTERNS`: `\b(logo|brand)\b`
- `_BADGE_PATTERNS`: `\b(badge|dot|indicator)\b`
- `_ICON_PATTERNS`: `\bicon\b`
- `_IMAGE_PATTERNS`: `\b(image|img|photo|thumbnail)\b`
- INSTANCE 타입이지만 패턴 미매칭 → `"icon"` 폴백 (DS atom은 대부분 icon)

### 4.3 `harness/lib/component_keys_loader.py` — 신규 작성

**역할**: `src/figma-component-keys/index.md` + `variant-keys/<comp>.md` 파싱 및 조회

```python
def figma_file_key() -> str                              # "DWEduE6GfxYMlyxKPNJ8jA"
def index_last_checked() -> str                          # "2026-05-01 KST"
def load_index() -> dict[str, dict]                      # kebab → {figma_name, level, node_id, component_set_key, variant_count}
def load_variant_keys(component_name: str) -> list[dict] # [{variant, node_id, key}]
def get_component_entry(component_name: str) -> dict | None
def list_component_names() -> list[str]
```

**파싱 방법**:
- `_parse_md_table_rows()`: markdown 테이블 → `list[list[str]]` (헤더/구분선 제외)
- `_component_name_to_kebab()`: `[V2] Avatar` → `avatar`, `Badge_Number` → `badge-number`
- 모듈 수준 캐시 (`_index_cache`, `_variant_cache`)

**검증**:
- `list_component_names()` → 36개 컴포넌트
- `load_variant_keys('avatar')` → 44개 variant
- `figma_file_key()` → `"DWEduE6GfxYMlyxKPNJ8jA"`

---

## 5. Phase C: `servers/design_md_harness.py` — 게이트 추가

### 새 imports

```python
from harness.lib import component_keys_loader as ckl
from harness.lib.fix_hints import fail_result, hint, pass_result, warning_result
from harness.lib.token_resolver import AmbiguousTokenName, name_to_ids, token_id_exists, token_id_has_mode_value
```

### 새 상수

```python
REQUIRED_SECTIONS_V2 = [
    ("overview", "Overview"),
    ("source reads", "Source Reads"),
    ("figma identity", "Figma Identity"),
    ("variant axes", "Variant Axes"),
    ("figma props", "Figma Props"),
    ("layout", "Layout"),
    ("asset notes", "Asset Notes"),
    ("text behavior notes", "Text Behavior Notes"),
    ("implementation order", "Implementation Order"),
    ("do's and don'ts", "Do's and Don'ts"),
    ("known gaps", "Known Gaps"),
]
```

### 신규 게이트 12개

| ID | 검사 내용 |
|----|----------|
| `variants-registry-matches-source-of-truth` | frontmatter `variants.registry` ↔ `variant-keys/<comp>.md` 집합 비교 |
| `component-identity-matches-index` | `figma_name`, `node_id`, `component_set_key`, `level` ↔ `index.md` 일치 |
| `representative-variant-defined` | `variants.representative.variant` + `node_id` 존재 |
| `fixture-schema-version` | `fixture.meta.json.schema_version == "v2-representative"` |
| `representative-screenshot-matches-spec` | fixture `figma_screenshot.node_id` == spec `representative.node_id` |
| `tokens-id-resolves` | `token:xxx.yyy` 형식 id가 `src/tokens/*.json` 에 존재 |
| `tokens-id-has-mode-value` | id가 `render_mode.color`에서 raw 값 보유 |
| `tokens-name-not-ambiguous` | `{cds: name}` → 단일 id 매핑 확인 (복수면 FAIL) |
| `token-catalog-sha256-matches` | `src/tokens/*.json` 실시간 sha256 ↔ `token_snapshot.json` 핀 |
| `typography-id-resolves` | `typography.<role>.token_fallback` id 존재 확인 |
| `component-keys-sha256-matches` | `index.md` + `variant-keys/<comp>.md` sha256 ↔ snapshot 핀 |
| `missing-sections`(갱신) | 11개 섹션으로 확장 (기존 5개에서) |
| `section-order`(갱신) | 새 11개 섹션 순서로 갱신 |

**추가된 신규 CLI args**:
- `--fixture-meta`: `fixture/fixture.meta.json` 경로
- `--token-snapshot`: `fixture/token_snapshot.json` 경로
- `--comp-keys-snapshot`: `fixture/component_keys_snapshot.json` 경로
- `--token-map`: 선택적 (기존 호환 유지, 신규에선 불필요)

**검증**: `python3 servers/design_md_harness.py --help` → 정상 출력

---

## 6. Phase A: `harness/design-md-spec.md` — 전면 재작성

### 추가된 주요 내용

**03/04 스키마 매핑 표**: 두 개의 테이블
- `component_contract.<X>` → frontmatter 경로
- `04 source.md 섹션` → 합본에서의 처리 (포함/제외 여부)

**YAML frontmatter 전체 구조** (shared-component-spec/v1):
- `schema`, `component`, `token_catalog`, `axes`, `variants`, `props`, `tokens`, `typography`, `assets`, `composition`, `layout`, `sizing`, `text_behavior`, `implementation_order`, `implementation_coverage`, `rules`, `colors/spacing/rounded`, `source_gaps`

**토큰 참조 규칙 3단계**:
1. 권장: `token:system.color.button.black` (id 기반)
2. 허용: `{cds: system/color/button/black}` (name 기반, ambiguity 없을 때)
3. 금지: `#3D5AFE` (raw hex)

**정적 평가 게이트 표** (25개) — FAIL 조건 명시

**fixture 스키마 요건**:
- `fixture.meta.json`: `schema_version: "v2-representative"`, `figma_screenshot.kind`, `node_id`
- `token_snapshot.json`: file, version, sha256 3개 파일
- `component_keys_snapshot.json`: index + variant_keys 각 sha256

**representative_variant 선정 규칙**:
1. axes 기본값 조합 우선 (예: `Mode=Default, Type=Circle, Size=Medium`)
2. 없으면 `variants.registry` 첫 번째 항목
3. `fixture.meta.json.figma_screenshot.node_id`와 반드시 일치

---

## 7. Phase E: 에이전트 프롬프트 갱신

### `design_md_generator.md`

**입력 변경**:
- 제거: `component_spec_path`, `token_map_path`
- 추가: `fixture_meta_path`, `comp_keys_snapshot_path`, `token_snapshot_path`
- 선택: `text_behavior_meta_path`, `asset_nodes_path`, `mcp_read_log_path`

**작업 순서 갱신**:
1. `fixture.meta.json` → representative variant 확인
2. `figma_raw.json` → 물리 스타일 파싱
3. `src/figma-component-keys/index.md` → figma_name, level 확인
4. `src/figma-component-keys/variant-keys/<comp>.md` → variants.registry SoT

**신규 절대 금지**:
- 플랫폼 고유 정보 작성 금지 (Code Mapping, CSS 결정, export 경로 등)
- raw hex 금지

**토큰 참조 규칙 명시**: id 기반 우선 → {cds:} 허용 → raw hex 금지

**representative_variant 선정 규칙** 명시 (axes 기본값 조합 우선)

**`applies_to` 조건 표기법** 명시 (`"Status=Default"`, `"always"` 등)

**`composition.uses` 정책** 명시 (vector/icon_area 등록 금지)

### `design_md_renderer.md`

**핵심 변경**: "대표 variant 1개만 렌더"

**토큰 해석 변경**:
- 기존: `token_map.json`
- 신규: `src/tokens/*.json` + frontmatter `token_catalog.render_mode`

**`applies_to` 조건 해석 추가**:
- representative variant의 axes 값으로 조건 판단
- `fixed` 토큰은 항상 적용

**sizing 렌더링 규칙**:
- `FIXED` → 고정값
- `HUG` → `fit-content`
- `FILL` → `flex: 1`

**part_spacing 렌더링**: representative variant 조건과 일치하는 `variants[].when` 항목 우선

### `design_md_qa.md`

**fix_hints 형식 갱신**:
- 기존: `components.<name>.layout.axis`
- 신규: `tokens.<key>.default`, `layout.part_spacing.<a>__to__<b>.default.value`, `typography.<role>.token_fallback`
- body 섹션도 명시: `## Asset Notes의 <key> semantic_rule`

**토큰 수정 지시 형식**: id 기반 참조로만 제안, raw hex 절대 금지

**`source_gaps` 기록 지시** 추가: token id 미확인 시 source_gaps에 기록하도록 안내

---

## 8. Phase F: 문서 갱신

### `harness/workflow.md`

**Phase 0.5 갱신**:
- `component_spec.json` 생성 → 삭제
- `fixture.meta.json` 존재 여부로 스킵 조건 변경
- 컴포넌트 조회를 `src/figma-component-keys/index.md`에서 수행

**Phase 0 완전 재작성**:
- Step 1: figma_raw.json (+ 선택: text_behavior_meta, asset_nodes, mcp_read_log)
- Step 2: representative variant 스크린샷 캡처
- Step 3: fixture.meta.json 생성 (schema_version + figma_screenshot)
- Step 4: token_snapshot.json 생성 (sha256 핀)
- Step 5: component_keys_snapshot.json 생성 (sha256 핀)
- Step 6: expected_nodes.json + image_mask.json
- Step 7: fixture.lock 갱신 (새 파일들 포함)

**제거**: Step 4(CDS fetch), Step 5(token_map.json 생성)

**Loop Step B 명령 갱신**:
```
!python3 servers/design_md_harness.py \
  --figma-raw fixture/figma_raw.json \
  --design-md ... \
  --fixture-meta fixture/fixture.meta.json \
  --token-snapshot fixture/token_snapshot.json \
  --comp-keys-snapshot fixture/component_keys_snapshot.json
```

### `harness/orchestrator.md`

- `scripts/preflight_sot.py` 실행 추가
- Phase 0.5 스킵 조건: `fixture.meta.json` 존재 여부로 변경
- 25개 게이트 전체 목록 명시
- `representative variant 1개만 렌더` 명시

### `CLAUDE.md`

**신규 규칙 추가**:
1. "합본 design.md는 플랫폼 중립만" — 금지 항목 열거
2. "토큰 id 기반 참조 우선"
3. "SoT Preflight 필수"

**게이트 표**: 10개 → 25개로 갱신

**에이전트 역할 표**: 새 역할 반영

### `README.md`

**정체성 갱신**:
- 기존: "Figma 컴포넌트 URL → design.md 자동 생성 하네스"
- 신규: "Figma 컴포넌트 URL → **플랫폼 중립 공유 spec (design.md)** 자동 생성기. React / Swift / Kotlin 모든 플랫폼이 참조하는 `shared-component-spec/v1` 형식의 design.md를 Figma 링크 한 방으로 생성"

**SoT 파일 목록** 섹션 추가

**플랫폼 중립 원칙** 섹션 추가 (포함/제외 명시)

---

## 9. SoT 파일 git-track 등록

커밋 `f6af4c3`에 포함:
- `src/tokens/tokens.color.v1.0.json` (503개 토큰)
- `src/tokens/tokens.typography.v1.0.json` (250개 토큰, 31건 name 중복 확인)
- `src/tokens/tokens.size.v1.0.json` (83개 토큰)
- `src/figma-component-keys/index.md` (36개 컴포넌트)
- `src/figma-component-keys/variant-keys/*.md` (36개 파일, avatar 44 variants 등)

---

## 10. 검증 결과

### Phase G 체크리스트

| 항목 | 결과 |
|------|------|
| `python3 scripts/preflight_sot.py` | ✅ PASS — SoT 5개 경로 모두 git tracked |
| `python3 -c "from harness.lib import token_resolver, figma_walker, fix_hints, handoff, component_keys_loader"` | ✅ OK |
| `python3 servers/design_md_harness.py --help` | ✅ 정상 출력 (새 --fixture-meta, --token-snapshot, --comp-keys-snapshot 포함) |
| `token_id_exists('token:system.color.button.black')` | ✅ True |
| `token_id_has_mode_value(..., 'light')` | ✅ True |
| `resolve_by_id(..., 'light')` | ✅ `#000000` |
| `ambiguous names 감지` | ✅ 31건 (예: `base/lineheight/text-lineheight-100` → 2 ids) |
| `list_component_names()` | ✅ 36개 컴포넌트 |
| `load_variant_keys('avatar')` | ✅ 44개 variant |

### 미완료 Phase G 항목 (다음 세션)

- [ ] 엔드투엔드 테스트: `/figma-to-md <avatar URL>`
- [ ] `_workspace/outputs/avatar.md` 생성 후 frontmatter 전체 필드 확인
- [ ] 정적 게이트 25개 전부 PASS 확인 (avatar 기준)
- [ ] SSIM ≥ 0.85 확인 (representative variant 렌더)
- [ ] 03 `draft-descriptions/avatar.description.yaml`과 합본 frontmatter diff
- [ ] sha256 mutation test (파일 1바이트 변경 → 게이트 FAIL 확인)
- [ ] variant 1개 제거 → `variants-registry-matches-source-of-truth` FAIL 확인

---

## 11. 커밋 기록

### 커밋 1 — `f6af4c3`
```
feat(10): Phase 0-C — shared-component-spec/v1 harness foundation
```
- 47개 파일, 20,674줄 추가
- harness/design-md-spec.md, harness/lib/*.py (3개), scripts/preflight_sot.py, servers/design_md_harness.py, src/tokens/*.json, src/figma-component-keys/

### 커밋 2 — `1c9160d`
```
feat(10): Phase E/F — agent prompts + docs 갱신 (shared-component-spec/v1)
```
- 7개 파일, 1,188줄 추가
- .claude/agents/*.md (3개), harness/workflow.md, harness/orchestrator.md, CLAUDE.md, README.md

---

## 12. 주요 의사결정 기록

### token_map.json 삭제 결정

기존: `cds_tokens.json` (GitHub API fetch) + `token_map.json` (figma_variable → cds 매핑)  
문제: 외부 의존, 항목 불일치, version string 비교라 약함  
결정: `src/tokens/*.json`을 직접 SoT로, sha256 snapshot으로 invalidation  
결과: fixture 파일 구조 단순화, 게이트 정확도 향상

### variant_registry.json 취소 결정

초기 plan: `fixture/variant_registry.json`을 별도로 생성  
발견: `src/figma-component-keys/variant-keys/`가 이미 mainline SoT  
결정: fixture에 중복 저장 불필요 → sha256 snapshot만 유지  
결과: fixture 파일 수 감소, SoT 단일화

### composition-policy-by-level → composition-matches-bridge 교체

문제: `index.md`가 Level을 "advisory"로 명시 → Level로 게이트 만들면 안 됨  
결정: 03 `bridge-descriptions/<comp>.bridge.yaml`의 `composition.uses`와 비교하는 게이트로 교체  
결과: 게이트가 실제 구현 계약 기준으로 동작

### AmbiguousTokenName 예외 설계

문제: typography token name 31건 중복 → name 기반 조회가 불확실  
결정: `name_to_ids()` API + `AmbiguousTokenName` 예외 → `tokens-name-not-ambiguous` 게이트  
결과: {cds: name} 형식 사용 시 중복 자동 감지, id 형식 사용 권장

---

*로그 작성: Claude Sonnet 4.6 / 2026-05-11*
