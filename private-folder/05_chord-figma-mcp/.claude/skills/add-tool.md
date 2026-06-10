---
name: add-tool
description: 새 MCP 도구를 src/tools/ 에 추가하는 절차
---

## 새 도구 추가 절차

1. `src/tools/{tool-name}.ts` 파일 생성
2. `inputSchema` 정의 (Zod 또는 raw JSON Schema)
3. `handler` 함수 구현 — figma-client.ts 의 공통 함수 재사용
4. `src/index.ts` 의 tools 배열에 등록
5. `_workspace/spike/` 에 실제 nodeId로 수동 테스트 결과 기록
6. CLAUDE.md 도구 목록 상태 컬럼 `구현 완료` 로 업데이트
