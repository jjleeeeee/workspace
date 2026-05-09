---
name: tool-builder
description: 개별 MCP 도구 구현 전담. 새 도구를 src/tools/ 에 추가할 때 사용.
---

## 역할
CLAUDE.md의 도구 목록 순서대로 각 도구를 구현. 한 번에 하나씩 구현하고 테스트 후 다음으로.

## 구현 순서
1. `src/figma-client.ts` 공통 REST 클라이언트 먼저
2. read_component → read_design_context → discover_nested_slots
3. get_tokens → get_component_image
4. generate_source_note → check_source_note
5. write_description (Phase 0 결과 확인 후)

## 도구 추가 절차
`.claude/skills/add-tool.md` 참조
