---
type: Playbook
status: Active
version: 1.3
date: 2026-05-12
project: "Figma Description Workflow"
owner: 디자인 시스템 담당자
related:
  - "AGENTS.md"
  - "workflow/README.md"
  - "history/figma-description-history.md"
---

# Figma Description Playbook

이 문서는 `03_wf-figma-to-description` 작업실의 **짧은 실행 계약서**다.
상세 스키마, 예외 대응, 검증 체크리스트는 `workflow/` 아래 문서에서 관리한다.

## 1. 목적

Figma 컴포넌트의 구조, 토큰, layout, 구현 규칙을 읽어 Component
Description YAML을 작성하고 검증한다.

- `draft-descriptions/*.description.yaml`이 유일한 스펙 SoT다.
- Figma plain `description` 필드 쓰기는 폐기됐다(2026-05-12).
- bridge YAML 생성은 폐기됐다(2026-05-12).
- 이 워크플로우는 `{component}.md` 파생 산출물을 만들지 않는다.

## 2. 필수 읽기 순서

1. `AGENTS.md`
2. `README.md`
3. 이 문서
4. `workflow/README.md`
5. 현재 단계에서 필요한 `workflow/*.md`
6. 필요한 경우에만 `refs/figma-component-keys/`와
   `refs/markitdown-output/`

단계별 상세 문서는 `workflow/README.md`의 Step table을 따른다.
validation, Figma readback, history gate는 생략하지 않는다.

## 3. Source Priority

1. 사용자 제공 Do/Don't와 현재 요청 의도
2. 실제 Figma component data
3. `refs/figma-component-keys/` key registry snapshot
4. `refs/markitdown-output/` supplemental data
5. 기존 history
6. LLM inference

확인되지 않은 값은 임의로 채우지 않고 제외하거나 `source_gaps`에 기록한다.

## 4. 금지 계약

- Figma plain `description` 또는 `descriptionMarkdown`에 YAML을 쓰지 않는다.
  Figma write는 폐기됐다(2026-05-12).
- `bridge-descriptions/*.bridge.yaml`을 만들거나 갱신하지 않는다.
  bridge YAML은 폐기됐다(2026-05-12).
- `figma_set_description` 또는 `use_figma`로 Description 필드에 직접 쓰지 않는다.
- 확인되지 않은 값을 추측해서 YAML에 넣지 않는다.
  `source_gaps`에 기록한다.
- 하위 DS component의 axes, tokens, layout 상세를 parent Description에
  복붙하지 않는다. 확인된 조합 관계는 `composition.uses`에 기록한다.
- asset-backed visual을 text, emoji, CSS drawing으로 조용히 대체하지 않는다.
- `{component}.md` 파생 문서를 만들지 않는다.

## 5. 전체 흐름

| Step | 목적 | 필수 참조 |
| --- | --- | --- |
| 1. Preflight | 필수 MCP(Framelink, figma-console), target file 연결 확인 | `workflow/README.md`, `workflow/exceptions.md` |
| 2. Figma 구조 읽기 | axes, variants, node id, component key, layout 확보 | `workflow/README.md`, 필요 시 `workflow/exceptions.md` |
| 3. 토큰 바인딩 읽기 | figma-console로 part/token mapping 확보 | `workflow/README.md` |
| 4. 보충 입력 대조 | key registry와 markitdown reference를 optional로 대조 | `workflow/README.md` |
| 5. 스크립트 보강 | enrich_tokens / enrich_typography로 resolved 값 채우기 | `workflow/README.md`, `scripts/` |
| 6. Draft YAML 작성 | 확인된 데이터만 Description YAML로 구성 | `workflow/description-yaml-schema.md` |
| 7. 검증/기록 | validator 실행, source_gaps 기록, history 업데이트 | `workflow/validation-checklist.md` |

## 6. Step Gate

### Step 1. Preflight

- Framelink MCP, figma-console MCP availability를 확인한다.
- figma-console은 Desktop Bridge 연결과 target file 일치를 확인한다.
- 실패 시 자동 fallback하지 않는다. 어떤 작업이 막히는지 보고하고 중단한다.

### Step 2. Framelink로 구조 읽기

- Framelink MCP로 component set의 axes, variant count, node id,
  component key, layout 데이터를 읽는다.
- target 값과 local snapshot이 충돌하면 live Figma 값을 우선한다.

### Step 3. Token Binding 읽기

- figma-console로 각 part의 fill/stroke token binding을 읽는다.
- `token: null`은 직접 넣지 않고 `source_gaps`에 기록한다.

### Step 4. Supplemental Read

- `refs/figma-component-keys/`는 주소록/대조 snapshot으로만 사용한다.
- `refs/markitdown-output/<component>.md`는 존재할 때만 스펙 보충 입력으로 읽는다.
- markitdown 내용과 live extraction이 충돌하면 live extraction을 우선한다.

### Step 5. 스크립트 보강

- `scripts/enrich_tokens.py`로 색상 토큰 resolved 값(hex + web_var)을 채운다.
- `scripts/enrich_typography.py`로 typography resolved 값을 채운다.
- 카탈로그가 갱신됐을 때만 재실행한다. 보강 결과는 draft 파일에 직접 기록된다.

### Step 6. Draft YAML

- 스키마와 section 규칙은 `workflow/description-yaml-schema.md`를 따른다.
- `implementation_order`, `implementation_coverage`, `rules`는 모든 컴포넌트에 포함한다.
- 복합 컴포넌트에서만 `composition.uses`를 사용한다.
- `spec_notes`는 source, markitdown 보충 메모가 필요할 때 사용한다.

### Step 7. 검증/기록

- `node tools/validate-component-description.mjs draft-descriptions/<component>.description.yaml`를 실행한다.
- FAIL이면 YAML을 수정하고 재실행한다.
- 결정 또는 동작 변경이 있으면 `history/figma-description-history.md`에 기록한다.

## 7. Done Criteria

- `draft-descriptions/<component>.description.yaml`이 저장됐다.
- local validator가 통과했거나 warning/failure 이유를 기록했다.
- `source_gaps`가 있으면 미확인 이유가 명시되어 있다.
- 필요한 경우 history에 변경 이유, 제외한 선택지, 재검토 조건을 기록했다.
- `{component}.md` 파생 산출물을 만들지 않았다.

## 8. 상세 문서

- `workflow/README.md`: 실행 순서와 단계별 참조 문서
- `workflow/description-yaml-schema.md`: YAML schema와 section 규칙
- `workflow/validation-checklist.md`: validator와 완료 체크리스트
- `workflow/exceptions.md`: MCP 실패 및 복구 옵션
- `workflow/figma-write-readback.md`: ⚠️ 폐기됨(2026-05-12) — 참고용 보관

## 9. 토큰 카탈로그 참조

yaml `tokens` 블록의 `resolved` 값(hex + web_var)은 아래 카탈로그에서 파생한다.
카탈로그가 갱신되면 `scripts/enrich_tokens.py`, `scripts/enrich_typography.py`를 재실행한다.

| 카탈로그 | 경로 | freshness | 내용 |
|---|---|---|---|
| 색상 토큰 | `../../cds-catalogs/catalogs/tokens/tokens.color.v1.0.json` | 2026-05-12 | 408개 semantic color + resolved light/dark hex |
| 타이포 시맨틱 | `../../cds-catalogs/catalogs/tokens/tokens.typography.semantic.json` | 2026-05-12 | 63개 Figma text style → fontSize/fontFamily/fontWeight/lineHeight |
| 타이포 primitive | `../../cds-catalogs/catalogs/tokens/tokens.typography.v1.0.json` | 2026-05-12 | lineheight/text_size/text_weight 원시값 |

경로는 `03_wf-figma-to-description/` 기준 상대경로.
web_var 변환 규칙: `system/color/foo/bar` → `--cds-system-color-foo-bar` (`/`와 `_` 모두 `-`로).

### 재실행 스크립트 위치

```
03_wf-figma-to-description/scripts/
  enrich_tokens.py        # color token resolved 값 보강
  enrich_typography.py    # typography token resolved 값 보강
  fix_baselines.py        # baseline node_id 주입 (로컬 이미지 → node_id 전환용)
  pick_baseline_node.py   # variant-keys에서 대표 baseline 선택 로직
```
