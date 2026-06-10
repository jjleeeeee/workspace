# Orchestrator

## 에이전트 조율 순서

```
Phase 0  →  spike-tester 에이전트
             └─ 결과 기록: _workspace/spike/rest-write-result.md
             └─ 결론 보고: write_description 포함 여부

Phase 1~2 →  tool-builder 에이전트
             └─ 세팅 + figma-client.ts

Phase 3~4 →  tool-builder 에이전트 (도구 1개씩 순서대로)
             └─ 각 도구 완료 시 CLAUDE.md 상태 업데이트

Phase 5   →  tool-builder 에이전트 (Phase 0 결과 기반으로만)

Phase 6   →  Claude Code 글로벌 설정 등록
```

## 중간 산출물 저장 위치
- 스파이크 결과: `_workspace/spike/`
- 작업 중 메모: `_workspace/drafts/`
- 완성된 도구 설명: `_workspace/outputs/`
