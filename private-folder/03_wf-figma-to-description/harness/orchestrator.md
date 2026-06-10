# Orchestrator — Claude 에이전트 운영 지침

이 프로젝트에서 Claude는 아래 구조로 작업팀처럼 동작한다.

```
[부모 에이전트 — 오케스트레이터]
  │
  ├─► figma-reader   (MCP 직접 소유, 직렬 실행 — 서브에이전트 위임 불가)
  │
  ├─► yaml-drafter   (로컬 파일 작업)
  │
  ├─► enricher       (서브에이전트 가능)
  │
  └─► validator      (서브에이전트 가능)
```

## 실행 원칙

1. **Figma MCP는 부모 에이전트 전용.** figma-reader 역할은 서브에이전트에 위임 불가.
2. **로컬 파일 작업은 서브에이전트 가능.** enricher, validator는 병렬 실행 허용.
3. **YAML 저장 경로:** `_workspace/outputs/draft-descriptions/<component>.description.yaml`
4. **Validator 통과 없이 커밋 금지.**
5. **추론으로 값 채우기 금지.** 확인 불가 값은 source_gaps에 기록.

## 표준 1컴포넌트 처리 흐름

```
figma-reader: Figma 데이터 읽기  (harness/workflow.md Step 1~3)
     ↓
yaml-drafter: YAML 작성/수정    (harness/workflow.md Step 4)
     ↓
enricher:     enrich-component 스킬  (.claude/skills/enrich-component.md)
     ↓
validator:    validate-component 스킬 (통과 필수)
     ↓
커밋
     ↓
record-history 스킬 (결정 변경 시)
```

## 에이전트 파일 위치

| 에이전트 | 파일 |
|----------|------|
| figma-reader | `.claude/agents/figma-reader.md` |
| yaml-drafter | `.claude/agents/yaml-drafter.md` |
| enricher | `.claude/agents/enricher.md` |
| validator | `.claude/agents/validator.md` |

## 스킬 파일 위치

| 스킬 | 파일 |
|------|------|
| validate-component | `.claude/skills/validate-component.md` |
| enrich-component | `.claude/skills/enrich-component.md` |
| fill-gap | `.claude/skills/fill-gap.md` |
| record-history | `.claude/skills/record-history.md` |

## 작업 우선순위 큐 (source_gaps + spec_notes 보강)

Gap + spec_notes 둘 다 부족한 컴포넌트 우선:

1. tag, tooltip (gap 있음 + notes 0개)
2. loading-circular, loading-dot, snackbar, toast, title-header, text-fields,
   pagination-dot-v2, skeleton, avatar-group, dropdown-box, search (gap 2~3개)
3. thumbnail, icon-button, avatar, bottom-navigation, list-item-native, list-item-web (gap 1개)
4. toggle-switch, badge-dot, badge-number, checkbox, radio, scrim-overlay,
   scrollbar, text-button (notes만 얇음)

## Exit 조건

- 모든 source_gaps: 비어 있거나 `confirmed: true + reason` 명시
- 모든 대상 컴포넌트 spec_notes ≥ 2개
