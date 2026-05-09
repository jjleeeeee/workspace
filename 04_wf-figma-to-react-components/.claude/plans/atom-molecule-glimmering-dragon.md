# 남은 컴포넌트 현황 및 개발 워크플로우

## Memory 정리 결정 (2026-05-07)

- `feedback_read_docs_before_acting.md` → **전역 유지** (모든 문서화된 프로젝트에 적용되는 일반 원칙)
- 단, `"LLM 추론은 source priority 최하위(#8)다"` 문장의 `#8`은 이 프로젝트 전용 참조 → 일반 표현으로 수정 필요

---

## Context

프로젝트는 Figma Chord DS 컴포넌트를 React + Storybook으로 구현하는 워크플로우이며,
현재 35개 중 29개가 완전 구현, 1개(ListItemNative)가 부분 구현, **7개가 미구현** 상태다.

---

## 미구현 컴포넌트 (7개)

| 컴포넌트 | Node ID | 분류 | 의존성 |
|---------|---------|------|--------|
| Chips | 59869:78921 | **Atom** | 없음 |
| Text_Fields | 62030:25225 | **Atom** | 없음 |
| List_Item_Web | 69579:9043 | **Atom** | IconButton, Radio (이미 구현) |
| Dropdown_Box | 60730:9605 | **Molecule** | Text_Fields, Menu (Menu 이미 구현) |
| Tabs | 65172:10165 | **Molecule** | 없음 (내부 tab item은 독립) |
| Title Header | 64450:27844 | **Molecule** | TextButton, IconButton (이미 구현) |
| Top Navigation | 64450:39560 | **Molecule** | Title Header, IconButton 등 |

### 분류 근거

**Atoms** (단일 목적, 내부 중첩 없음 또는 이미 구현된 atom만 중첩):
- **Chips**: Tag와 유사한 단순 선택형 요소
- **Text_Fields**: 단일 입력 UI (label, hint, error 포함)
- **List_Item_Web**: Web 환경용 리스트 아이템 (Native 버전과 별개)

**Molecules** (여러 컴포넌트의 조합, 상태 조율 필요):
- **Dropdown_Box**: Text_Fields + Menu의 조합 → Text_Fields 선행 필요
- **Tabs**: Tab item 반복 + active indicator + 스크롤 조율
- **Title Header**: 제목 텍스트 + 버튼 그룹의 레이아웃
- **Top Navigation**: Title Header + 아이콘 버튼 + 기타 요소 조합

---

## 권장 개발 순서

### Phase 1 – Atoms (병렬 가능)
1. **Chips** — variant 수 많음(100+), 선행 의존 없음, 단독 시작 가능
2. **Text_Fields** — Dropdown_Box의 선행 조건, 우선 처리
3. **List_Item_Web** — ListItemNative와 구조 유사, 부분 구현 retrospective 활용

### Phase 2 – Molecules (Atom 완료 후)
4. **Title Header** — 의존 atom 모두 구현 완료
5. **Tabs** — 독립적이나 인터랙션 복잡도 있음
6. **Dropdown_Box** — Text_Fields + Menu 조합, Text_Fields 완료 후
7. **Top Navigation** — Title Header + 기타 완료 후 마지막

---

## 워크플로우 (기존 PLAYBOOK 준수)

각 컴포넌트마다 동일한 6단계를 적용한다:

```
1. index.md에서 nodeId/componentKey 확인
2. Figma MCP read (Framelink + Console MCP)
   ↳ MCP가 부족하면 → REST API fallback (아래 참조)
3. src/figma/<component>.source.md 작성
4. Tests → React/CSS → Storybook 구현
5. npm test + typecheck + build-storybook + visual:baseline + visual:diff
6. retrospective/knowledge/history 기록
```

---

## Figma 읽기: MCP vs REST API 결정 기준

**문서 위치:**
- 결정 기준: `knowledge/figma-reading/mcp-vs-rest-api.md`
- 절차: `workflow/figma-source-read.md`
- 실제 사례: `src/figma/rest-audits/list-item-native.rest.json`

### MCP 우선 (항상 먼저 시도)

```
get_context_for_code_connect(fileKey, nodeId)  ← component set 전체
get_design_context(fileKey, childNodeId)        ← representative variants 각각
figma_get_component(nodeId, format="metadata", enrich=true)  ← Console MCP
```

Component set이 너무 크면 child node를 좁혀서 반복 읽기 (재귀적 읽기의 핵심).

### REST API로 전환하는 시점

다음 중 하나라도 해당하면 REST API를 targeted audit으로 사용:
- MCP read가 nested module의 **property definitions**(axes, booleans, text props)를 충분히 노출하지 않을 때
- Component set이 **깊은 instance chain**(depth 4+)을 가질 때
- Default variant만 읽어서는 Leading/Trailing 같은 **enum 전체 목록**을 볼 수 없을 때
- Framelink와 Console MCP 값이 충돌하고 어느 쪽이 맞는지 확인이 필요할 때

```bash
# REST API 호출 예시 (Figma REST API)
GET /v1/files/{fileKey}/nodes?ids={nodeId}
```

REST audit 결과는 반드시 `src/figma/rest-audits/<component>.rest.json`에 저장.

### Molecule 재귀 읽기 순서 (ListItemNative 회고에서 확립)

```
1. Parent node 읽기 (component set 전체 context)
2. composition.uses, nested module names 추출
3. 각 nested module을 별도로 읽기 ← 재귀 호출
   - Leading module → Type 옵션 (Avatar, Checkbox, Icon, Radio...)
   - Trailing module → Type 옵션 (Button, Toggle, Badge...)
   - Title, Body 등 각 slot
4. 각 nested module의 axes/booleans/text props/instance swaps 기록
5. child atom이 이미 구현됐는지 확인
6. 각 nested module: coverage = complete / partial / deferred 결정
7. 이후에야 public props와 Storybook Controls 설계
```

이 순서가 **Nested Module Inventory First** 원칙이며,
`knowledge/component-complexity/nested-module-inventory.md`에 카드가 있다.

---

## Molecule 추가 주의사항

- **Nested Module Inventory 필수**: 포함된 atom/module 먼저 인벤토리화 (MCP+REST)
- **coverage 결정 선행**: complete / partial / deferred 결정 후 구현 시작
- **Top Navigation**: Title Header 완료 검증 후 시작 (parent-child contract)
- **Dropdown_Box**: Text_Fields 미완이면 시작하지 않음

---

## 현재 부분 구현 항목

- **ListItemNative**: `partial/rest-inventoried` 상태
  - Trailing module 8가지 중 TextAndIcon만 구현
  - REST audit: `src/figma/rest-audits/list-item-native.rest.json`
  - 추가 구현 필요 시 기존 audit JSON 재사용 가능

---

## 검증 방법

- 각 컴포넌트 완료 시: `npm test && npm run typecheck && npm run build-storybook`
- Visual: `npm run visual:baseline && npm run visual:diff`
- Browser smoke: Storybook Controls가 Figma-facing props만 노출되는지 확인
