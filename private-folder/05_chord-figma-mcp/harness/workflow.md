# 작업 흐름 (Workflow)

## Phase 0 — REST API 쓰기 스파이크
담당: spike-tester 에이전트
- FIGMA_ACCESS_TOKEN 확인
- PATCH /v1/files/{fileKey}/nodes/{nodeId} 테스트
- 결과: `_workspace/spike/rest-write-result.md` 기록
- 결론: write_description 포함 여부 결정

## Phase 1 — 프로젝트 세팅
- package.json 초기화
- @modelcontextprotocol/sdk, TypeScript 설치
- src/index.ts 기본 구조 (stdio transport)

## Phase 2 — Figma REST 클라이언트
- src/figma-client.ts 구현
- 공통 fetch 래퍼 (Authorization 헤더, 에러 핸들링)

## Phase 3 — READ 도구 구현 (순서대로)
1. read_component
2. read_design_context
3. discover_nested_slots
4. get_tokens
5. get_component_image

## Phase 4 — 워크플로우 도구
6. generate_source_note
7. check_source_note

## Phase 5 — WRITE 도구 (Phase 0 결과 기반)
8. write_description

## Phase 6 — Claude Code 등록
- ~/.claude/claude.json 에 MCP 서버 추가
- 04_wf에서 실제 컴포넌트로 검증
