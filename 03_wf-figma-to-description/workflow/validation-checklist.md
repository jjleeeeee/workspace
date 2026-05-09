---
type: WorkflowReference
status: Draft
version: 1.0
updated: 2026-05-05
---

# Validation Checklist

이 문서는 draft YAML, Figma readback, 완료 보고 전에 확인해야 하는 gate를
정의한다.

## Local Validator

validator 자체 확인:

```bash
node tools/validate-component-description.mjs examples/valid-description.yaml
node tools/validate-component-description.mjs examples/invalid-description.yaml
```

실제 draft 확인:

```bash
node tools/validate-component-description.mjs draft-descriptions/<component>.description.yaml
```

기대 결과:

- `valid-description.yaml`은 `PASS`가 나와야 한다.
- `invalid-description.yaml`은 `FAIL`이 나와야 한다.
- 실제 Description YAML 검증에서 `FAIL`이 나오면 Figma에 다시 쓰기 전에 YAML을 수정한다.

## Readback Criteria

- HTML entity decode 후 필수 section이 유지되어야 한다.
- list indentation이 유지되어야 한다.
- `descriptionMarkdownLength === 0`이어야 한다.
- 복합 컴포넌트에서 필요한 `assets`, `composition.uses`가 유지되어야 한다.
- `spec_notes`가 있으면 source/readback/보충 메모가 유지되어야 한다.
- `text_behavior`가 있으면 text auto-resize, overflow, inline adornment,
  row height 계약이 유지되어야 한다.
- `source_gaps`가 없거나, 있다면 이유가 명시되어 있어야 한다.
- Figma Dev Mode에서 target component Description에 YAML이 보여야 한다.
- `{component}.md` 파생 Markdown 산출물이 없어야 한다.

## Done Checklist

- [ ] `figma_get_status` probe:true 확인
- [ ] 필수 MCP availability 확인: Framelink MCP, figma-console MCP, Figma official MCP `use_figma`
- [ ] MCP 누락 시 자동 대체하지 않고 누락된 MCP와 막히는 작업을 보고
- [ ] 복구 옵션 사용 시 사용자 승인 확인
- [ ] Framelink로 axes, variant count, node id, component key 추출 완료
- [ ] markitdown 파일 존재 여부 확인
- [ ] `figma_execute`로 token name 추출 완료
- [ ] `token: null` 항목은 YAML에 직접 넣지 않고 `source_gaps`에 기록
- [ ] Description YAML 작성 및 draft 저장 완료
- [ ] validator 실행 완료
- [ ] write 전 legacy `descriptionMarkdown` 길이 기록 완료
- [ ] plain `description` write 전 legacy `descriptionMarkdown` clear 완료
- [ ] 검증된 YAML을 plain `description`에 저장 완료
- [ ] write 후 legacy `descriptionMarkdown` 0자 readback 확인
- [ ] `implementation_order` 포함 및 플랫폼 중립 문구 확인
- [ ] `implementation_coverage` 포함 및 axes/props/assets/layout coverage 확인
- [ ] variant 축이 아닌 content/slot prop은 별도 sample 또는 control로 검증 가능
- [ ] 구현하지 않는 prop/assets/layout 항목은 제외 사유 명시
- [ ] part spacing의 axis/prop/state별 변동 여부 확인
- [ ] 조건별 spacing 차이는 `layout.part_spacing.*.variants[]`에 분리 기록
- [ ] asset-backed visual은 text content로 대체 금지 규칙 포함
- [ ] 복합 컴포넌트는 필요한 경우 `composition.uses` 포함
- [ ] Figma `textAutoResize`가 있는 text node는 YAML `text_behavior.text_auto_resize`에 기록
- [ ] badge/icon/suffix/prefix가 inline adornment이면 text 끝 추종인지 container 끝 정렬인지 기록
- [ ] parent가 hug 또는 min-height 기반이면 long text에서 row height가 커지는지 기록
- [ ] `spec_notes`가 있으면 source/readback/보충 메모 유지 확인
- [ ] Figma Description readback decode 후 주요 구조 일치 확인
- [ ] 결정 또는 동작 변경이 있으면 history 기록 완료
- [ ] `{component}.md` 파생 산출물을 만들지 않았는지 확인

## Completion Report Template

```md
완료:
- 산출물: Figma Description YAML, readback 검증 결과, history 기록(필요 시)
- 입력: Figma `<file_key>`, node `<component_set_node_id>`, 사용자 제공 Do/Don't
- 사용 도구: Framelink MCP, figma-console MCP, Figma official MCP
- 검증: local validator, Figma Description decode readback, Figma Dev Mode 확인
- 남은 한계: `source_gaps`와 수동 확인 필요 항목
```
