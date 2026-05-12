# Figma Description History

이 문서는 Figma Component Description YAML을 바꾼 이유만 짧게 누적한다.

워크플로우 계약은 `PLAYBOOK.md`, 상세 절차는 `workflow/`에
유지하고, 이 파일에는 절차를 반복해서 적지 않는다.

## 기록 원칙

- Figma Description YAML의 구조, 의미, 검증 기준이 바뀐 경우에만 기록한다.
- 단순 오탈자, 문장 다듬기, 같은 의미의 표현 정리는 기록하지 않는다.
- 확인되지 않은 값은 결정처럼 쓰지 않고 `source_gaps` 또는 재검토 조건으로 남긴다.
- 각 항목은 5-10줄 안에서 끝낸다.

## Entry Template

```md
### YYYY-MM-DD / <component-or-workflow>

- 변경: <무엇을 바꿨는가>
- 이유: <왜 바꿨는가>
- 제외: <선택하지 않은 대안>
- 검증: <readback / validator / 수동 확인 결과>
- 재검토: <언제 다시 볼 것인가>
```

## History

### 2026-05-12 / figma-description-bulk-clear

- 변경: draft 기준 37개 Figma component/component set의 plain `description`과 legacy `descriptionMarkdown`을 모두 빈 문자열로 clear했다.
- 이유: 사용자가 전체 컴포넌트에 들어간 Description 삭제를 명시 승인했기 때문이다.
- 제외: 로컬 `draft-descriptions/*.description.yaml`, refs, validator, `{component}.md` 파생 문서는 건드리지 않았다.
- 검증: Figma official readback에서 37개 모두 `descriptionLength === 0`, `descriptionMarkdownLength === 0`을 확인했다.
- 재검토: Figma Description SoT를 다시 사용할지, 또는 로컬 draft/bridge 기반으로 재작성할지 결정할 때.

### 2026-05-09 / typography-schema-batch

- 변경: live Figma text node가 확인된 23개 Description에 top-level `typography` 섹션을 추가하고 Figma plain Description에 저장했다.
- 이유: schema에 `typography` 선택 섹션이 추가되어 `fontFamily`를 `actual-font`, `system-alias`, `token-alias`, `unknown`으로 분류해야 하기 때문이다.
- 제외: text node가 없는 14개 컴포넌트, 전체 구조 재추출, `{component}.md` 파생 문서, `descriptionMarkdown` 쓰기는 제외했다.
- 검증: typography-only live audit, 전체 draft validator PASS, Figma official readback에서 23개 모두 `typography`, `last_synced: "2026-05-09"`, `descriptionMarkdownLength === 0`을 확인했다.
- 재검토: typography가 필수 section이 되거나 `token-alias`/font fallback 규칙이 더 구체화될 때.

### 2026-05-08 / component-batch-live-audit

- 변경: 전체 37개 Description을 live Figma metadata와 대조했고, Title Header에는 `Multiple Title2`, `Multiple2` slot props를 추가했으며 Top Navigation에는 live raw `figma_property` 연결을 보강했다.
- 이유: Avatar 속성 변경 확인 이후 전체 component set을 한 번씩 audit해 stale prop 계약을 찾기 위해서다.
- 제외: count/key/axes 변경이 없는 35개 컴포넌트의 불필요한 rewrite, `{component}.md` 파생 문서, `descriptionMarkdown` 쓰기는 제외했다.
- 검증: semantic live audit, local validator, Figma official write/readback에서 변경 대상의 필수 섹션과 `descriptionMarkdownLength === 0`을 확인한다.
- 재검토: Figma componentPropertyDefinitions에 새 prop이 추가되거나 prop label/default가 다시 변경될 때.

### 2026-05-08 / avatar-badge-dot-default

- 변경: Avatar(`62973:7556`)의 `Badge_Dot` boolean prop 기본값을 `true`에서 `false`로 갱신했다.
- 이유: Figma live component property definition에서 `Badge_Dot#50828:36` default가 `false`로 확인됐고, 기존 draft/Description은 `true`로 남아 있었기 때문이다.
- 제외: Avatar variant registry, Avatar Group, `{component}.md` 파생 문서, `descriptionMarkdown` 쓰기는 제외했다.
- 검증: local validator와 Figma official readback에서 `Badge_Dot.default === "false"`, 44개 variants, `descriptionMarkdownLength === 0`을 확인한다.
- 재검토: Avatar optional badge props의 기본값이나 prop 이름이 다시 바뀔 때.

### 2026-05-08 / avatar-group

- 변경: Avatar Group(`73587:6404`) draft와 variant key registry를 추가하고 Figma plain Description에 저장했다.
- 이유: `Avatar Group (디자인 개별 사용금지)` component set 자체의 Description이 0자였고, Title Header leading avatar composition의 하위 계약이 빠져 있었기 때문이다.
- 제외: Title Header Description 재작성, `{component}.md` 파생 문서, `descriptionMarkdown` 쓰기는 제외했다.
- 검증: local validator PASS, Figma official readback PASS, 11개 registry, `Live_Tag` boolean prop, `source_gaps.field`, `descriptionMarkdownLength === 0`을 확인했다.
- 재검토: Figma에서 Squircle Horizontal 또는 Squircle multi-count Avatar Group variants가 추가될 때.

### 2026-05-08 / list-item-native-text-behavior-write

- 변경: List Item Native Figma plain Description을 top-level `text_behavior`가 포함된 최신 draft로 다시 저장했다.
- 이유: `spec_notes.text_behavior`를 top-level `text_behavior`로 통일한 로컬 draft를 Figma Description SoT에도 반영하기 위해서다.
- 제외: List Item Web과 다른 List Item 계열, `{component}.md` 파생 문서, `descriptionMarkdown` 쓰기는 제외했다.
- 검증: local validator PASS, Figma official readback에서 필수 섹션, 12개 registry, `text_behavior`, `inline_adornments`, `rendered-text-end`, `descriptionMarkdownLength === 0`을 확인했다.
- 재검토: List Item Web에도 같은 inline adornment/text flow 계약을 추가할 때.

### 2026-05-08 / text-behavior-normalization

- 변경: List Item Native draft의 `spec_notes.text_behavior`를 top-level `text_behavior`로 이동하고 checklist도 top-level 기준으로 통일했다.
- 이유: schema는 `text_behavior`를 선택 top-level section으로 설명하는데 실제 draft만 `spec_notes` 아래에 있어 작성 위치가 애매했기 때문이다.
- 제외: Figma plain Description write/readback과 다른 컴포넌트 draft 변경은 제외했다.
- 검증: List Item Native draft validator, 전체 draft validator, `spec_notes.text_behavior` 잔여 검색으로 확인한다.
- 재검토: 여러 컴포넌트에서 inline adornment 계약이 늘어나 `text_behavior` 전용 validator가 필요해질 때.

### 2026-05-05 / workflow-doc-consistency

- 변경: README 실행 순서, `spec_notes` 사용 정책, `source_gaps` readback 조건을 실제 draft/validator 기준에 맞췄다.
- 이유: 문서 분리 이후 `spec_notes`가 복합 컴포넌트 전용처럼 보이고, readback 샘플이 `source_gaps.field`를 놓칠 수 있었기 때문이다.
- 제외: draft YAML 본문, Figma Description, validator 동작 변경은 제외했다.
- 검증: 문서 검색, 전체 draft validator 36개 PASS, `source_gaps`와 `spec_notes` 사용 현황 대조로 확인한다.
- 재검토: `spec_notes`를 별도 source/readback 섹션으로 분리하거나 readback 검증 스크립트를 validator와 통합할 때.

### 2026-05-05 / folder-renumber

- 변경: 작업실 폴더를 `07_wf-figma-to-description`에서 `03_wf-figma-to-description`로 옮겼다.
- 이유: archived `03_component_md`를 `99_archive/`로 보내고, 현재 Figma Description workflow를 03번 작업실로 승격하기 위해서다.
- 제외: Description YAML, draft, refs, validator 동작은 변경하지 않았다.
- 검증: 새 폴더명 검색, validator sample PASS/FAIL, 기존 draft/ref/tool/history 경로 유지 확인.
- 재검토: workspace 번호 체계를 다시 정리할 때.

### 2026-05-05 / playbook-entrypoint

- 변경: workflow 진입점 파일명을 `PLAYBOOK.md`로 바꿔 폴더 공통 운영 문서 이름으로 사용할 수 있게 했다.
- 이유: `AGENTS.md`는 에이전트 강제 규칙, `README.md`는 폴더 소개, `PLAYBOOK.md`는 실제 운영 계약이라는 역할을 분리하기 위해서다.
- 제외: `AGENTS.md`에 전체 절차를 합치거나 `WORKFLOW.md`, `CONTRACT.md`, `RULEBOOK.md`를 쓰는 방식은 제외했다.
- 검증: `PLAYBOOK.md` 참조 검색, 이전 진입점 이름 잔여 검색, validator sample PASS/FAIL 확인.
- 재검토: 다른 작업 폴더에서도 같은 이름을 공통 패턴으로 쓰기 어려워질 때.

### 2026-05-05 / workflow-doc-split

- 변경: 709줄 단일 workflow 문서를 짧은 `PLAYBOOK.md` 진입점과 `workflow/` 상세 문서 5개로 분리했다.
- 이유: 실행 계약, YAML schema, Figma write/readback, 예외 대응, 검증 체크리스트가 한 파일에 섞여 읽기 부담이 커졌기 때문이다.
- 제외: `AGENTS.md`에 전체 절차를 합치거나 hook 자동화를 추가하는 방식은 제외했다.
- 검증: 새 workflow 링크 검색, validator sample PASS/FAIL 확인, draft/ref/tool/history 경로 유지 여부를 확인한다.
- 재검토: 단계별 문서가 다시 길어지거나 작업자가 read order를 자주 놓칠 때.

### 2026-05-04 / subagent-mcp-ownership

- 변경: subagent는 local reference/draft/validator만 맡고, live Figma MCP read/write는 parent agent가 직렬로 담당하도록 AGENTS 규칙을 추가했다.
- 이유: subagent 병렬 실행 뒤 Figma Console MCP 또는 Desktop Bridge transport가 닫히는 패턴을 줄이기 위해서다.
- 제외: `PLAYBOOK.md`에는 넣지 않았다. 로컬 실행 환경 안정성 규칙이지 Description 스펙 구조 규칙은 아니기 때문이다.
- 검증: AGENTS 문서 검색으로 subagent MCP 금지와 parent ownership 문구를 확인한다.
- 재검토: MCP/Bridge가 병렬 세션을 안정적으로 지원하거나 subagent별 독립 세션 분리가 가능해질 때.

### 2026-05-04 / description-markdown-policy

- 변경: legacy `descriptionMarkdown` clear 정책과 안전한 write 순서를 workflow, AGENTS, README에 문서화했다.
- 이유: `descriptionMarkdown`을 plain `description` write 후 clear하면 plain Description까지 비워질 수 있어, clear-first/write-second 순서를 고정하기 위해서다.
- 제외: Figma 실제 값 bulk cleanup, `{component}.md` 파생 문서, markdown SoT 운영은 제외했다.
- 검증: Molecule batch official readback에서 13개 모두 plain `description`과 `descriptionMarkdownLength === 0`을 확인했다.
- 재검토: Figma API가 `description`과 `descriptionMarkdown` 동기화 방식을 바꿀 때.

### 2026-05-04 / molecule-batch

- 변경: `Level=Molecule` 13개 컴포넌트 draft를 생성하고 Figma plain Description에 저장했다.
- 이유: Atom batch 이후 조합형 컴포넌트까지 Description SoT를 확장하고 `composition.uses` 운영 기준을 실제 배치에 적용하기 위해서다.
- 제외: `{component}.md` 파생 문서, bulk `descriptionMarkdown` cleanup, 하위 컴포넌트 상세 spec 복붙은 제외했다.
- 검증: 13개 draft validator PASS, official Figma readback 13/13 PASS, variant registry count와 필수 섹션을 HTML entity decode 후 확인했다.
- 재검토: Molecule Description이 과도하게 길어져 registry 축약 정책이나 diff 추적 도구가 필요해질 때.

### 2026-05-04 / atom-batch

- 변경: `Level=Atom` 22개 컴포넌트를 대상으로 draft 검증과 Figma Description readback을 배치 실행했다.
- 이유: Atom Description을 먼저 안정화해 이후 Molecule의 `composition.uses` 참조 기반을 만들기 위해서다.
- 제외: `{component}.md` 파생 문서 생성과 `descriptionMarkdown` 직접 쓰기는 제외했다.
- 검증: Atom draft 22개 validator PASS, Figma readback에서 22개 모두 필수 섹션과 plain `description`을 확인했다.
- 재검토: plain `description` assignment가 기존 nonzero `descriptionMarkdown`을 0자로 만드는 Figma side effect의 처리 방침을 정할 때.

### 2026-05-08 / text-flow-contract

- 변경: Description YAML에 선택 섹션 `text_behavior`를 추가하고, List Item Native draft에 Title/Body text resize와 Title Badge inline adornment 계약을 기록했다.
- 이유: Figma auto layout만으로는 wrapped title의 rendered text 끝에 Badge_Dot이 붙는 구현 의도를 충분히 전달하기 어렵기 때문이다.
- 선택: `Title Badge`는 full-width title container 끝 정렬이나 flex sibling이 아니라 rendered title text end를 따라가는 inline adornment로 기록한다.
- 제외: Figma plain Description write/readback은 이번 변경에서 제외하고, draft와 workflow 규칙만 갱신했다.
- 검증: List Item Native draft validator와 `text_behavior`, `textAutoResize`, `inline adornment`, `rendered end`, `row height` 검색으로 확인한다.
- 재검토: Figma description write 단계에서 readback이 section nesting을 깨거나, 다른 inline adornment 컴포넌트에서 별도 schema가 필요해질 때.

### 2026-05-04 / composition-uses

- 변경: 복합 컴포넌트 Description에 선택 섹션 `composition.uses`를 추가하는 규칙을 workflow와 AGENTS에 기록했다.
- 이유: Bottom Navigation, List Item, Title Header처럼 atom/child component 조합이 많은 컴포넌트에서 구현자가 기존 DS 컴포넌트 재사용 관계를 놓치지 않게 하기 위해서다.
- 제외: Atomic Design taxonomy와 하위 컴포넌트 상세 spec 복붙은 운영 부담과 중복을 늘리므로 제외했다.
- 검증: workflow 문서 검색과 기존 draft validator로 선택 섹션이 기존 YAML 호환성을 깨지 않는지 확인한다.
- 재검토: `composition.uses`가 과도하게 길어지거나 validator가 별도 schema 검증을 요구할 때.

### 2026-05-04 / refs

- 변경: reference 폴더를 `refs/markitdown-output/`, `refs/figma-component-keys/` 구조로 묶고 workflow 입력에 component key registry를 연결했다.
- 이유: 스펙 프레임 텍스트와 component key 스냅샷을 한 곳에 모아 루트 구조를 단순화하고 variant key 대조 비용을 줄이기 위해서다.
- 제외: Figma Description 본문 재작성과 `.DS_Store` 정리는 이번 변경에서 제외했다.
- 검증: 경로 잔여 검색, 새 `refs/` 파일 목록 확인, draft validator 재실행으로 확인했다.
- 재검토: registry 스냅샷이 live Figma와 자주 충돌하거나 diff 추적 도구가 필요해질 때.

### 2026-05-04 / badge-dot-badge-number

- 변경: Badge를 `Badge_Dot`과 `Badge_Number` 두 Description YAML로 분리해 생성하고 Figma component set `8451:112783`, `8451:113030`에 저장했다.
- 이유: Figma에서 Dot Badge와 Number Badge가 별도 component set으로 운영되어 각 SoT를 독립적으로 유지하기 위해서다.
- 제외: 단일 `badge.description.yaml`, `{component}.md` 파생 문서, `descriptionMarkdown` 쓰기는 제외했다.
- 검증: Desktop Bridge preflight, local validator PASS, Figma readback에서 필수 블록과 list 보존, `descriptionMarkdown` 0자 유지를 확인했다.
- 재검토: Badge 공통 규칙이 늘어나 두 Description 사이 중복 관리가 부담될 때.

### 2026-05-04 / avatar-checkbox-radio-text-button

- 변경: Avatar, Checkbox, Radio, Text Button Description YAML을 새 추출 결과로 교체했다.
- 이유: 기존 Description/descriptionMarkdown 복제본을 최신 Figma 구조와 markitdown 보충 기준으로 정리하기 위해서다.
- 제외: `{component}.md` 파생 문서 생성과 Text Button full 576 variant registry 확장은 제외했다.
- 검증: Desktop Bridge preflight, local validator PASS, Figma readback에서 필수 블록과 list 보존을 확인했다.
- 재검토: Figma `descriptionMarkdown` 초기화가 plain Description까지 비우는 현상이 재발할 때.

### 2026-05-04 / chips

- 변경: Chips(`[V2] Chips`) Description YAML을 생성하고 Figma component set `59869:78921`에 저장했다.
- 이유: `Mode`, `Size`, `Type`, `State`, `Radius` 5개 축과 `Badge`, `Badge_Number`, `Marquee` boolean prop을 Figma Description SoT로 최신화하기 위해서다.
- 제외: `{component}.md` 파생 문서 생성과 `descriptionMarkdown` 쓰기는 제외했다.
- 검증: Desktop Bridge preflight, local validator PASS, Figma readback에서 필수 블록과 list 보존을 확인했다.
- 재검토: full 100 variant registry를 Description 안에 전부 펼쳐야 할 정도로 코드 생성기가 세부 key를 요구할 때.

### 2026-05-04 / bottom-navigation

- 변경: Bottom Navigation(`App Bar`) Description YAML을 생성하고 Figma component set `13361:20295`에 저장했다.
- 이유: `Mode`, `OS`, `focus`, `Show_System`과 16개 variant registry를 Figma Description SoT로 최신화하기 위해서다.
- 제외: `{component}.md` 파생 문서 생성과 `descriptionMarkdown` 쓰기는 제외했다.
- 검증: Desktop Bridge preflight, local validator PASS, Figma readback에서 필수 블록과 list 보존을 확인했다.
- 재검토: Badge / number가 실제 노출 variant나 prop으로 제공될 때.

### 2026-05-04 / preflight-stop

- 변경: Desktop Bridge 또는 필수 MCP preflight 실패 시 draft 생성도 중단하도록 규칙을 강화했다.
- 이유: cloud context만으로 draft를 만들면 토큰 바인딩과 deep extraction 검증이 빠져 확인된 값만 쓴다는 원칙이 흐려지기 때문이다.
- 제외: 실패해도 cloud 데이터만으로 자동 draft를 만드는 방식은 제외했다.
- 검증: `AGENTS.md`와 workflow Step 1에 draft 생성 금지와 cloud-only 예외 조건을 명시했다.
- 재검토: 사용자가 특정 컴포넌트에 대해 명시적으로 degraded draft를 승인할 때.

### 2026-05-04 / draft-descriptions

- 변경: Figma에 쓰기 전 검증용 YAML 위치를 `draft-descriptions/<component>.description.yaml`로 정했다.
- 이유: `work/`보다 draft의 임시성과 Description 용도가 명확하고, validator를 Figma 쓰기 전에 실행하기 위해서다.
- 제외: `work/`와 `staged-descriptions/`는 의미가 덜 직관적이라 제외했다.
- 검증: README와 workflow에 draft 저장, validator 실행, Figma write 순서를 연결했다.
- 재검토: draft 파일이 장기 보관 문서처럼 오해될 때.

### 2026-05-04 / validator

- 변경: `tools/validate-component-description.mjs`와 valid/invalid example을 추가했다.
- 이유: Description YAML이 필수 섹션, coverage, rules, `source_gaps` 같은 최소 조건을 빠뜨리지 않게 하기 위해서다.
- 제외: 외부 YAML parser 의존성은 새 프로젝트 초기 운영을 가볍게 유지하기 위해 제외했다.
- 검증: valid example은 PASS, invalid example은 누락 필드와 `token: null` 오류로 FAIL한다.
- 재검토: YAML 문법 자체를 엄격히 파싱해야 하는 오류가 반복될 때.

### 2026-05-04 / workflow

- 변경: 이 작업실의 SoT를 Figma Component Description YAML로 고정하고, 파생 `{component}.md` 산출물을 만들지 않는 방향으로 정리했다.
- 이유: 스펙의 최신 위치를 Figma Description 하나로 유지해 운영 부담과 문서 충돌을 줄이기 위해서다.
- 제외: 컴포넌트별 Markdown 캐시를 별도 산출물로 생성하는 방식은 제외했다.
- 검증: `AGENTS.md`와 `PLAYBOOK.md`에서 Description-only 원칙을 확인한다.
- 재검토: Figma Description 길이 제한이나 검색성 문제가 실제 작업을 막을 때.
