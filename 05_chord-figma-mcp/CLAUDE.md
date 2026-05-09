# Chord Figma MCP — 프로젝트 규칙

## 목적
03_wf(figma-to-description)와 04_wf(figma-to-react-components) 두 워크플로우에서
공통으로 사용하는 Figma 데이터 읽기/쓰기 도구를 순수 REST API 기반 MCP 서버로 통합.

Desktop Bridge(figma-console) 의존성 없이 동작하는 것이 핵심 목표.

## 환경 변수
- `FIGMA_ACCESS_TOKEN` — Figma Personal Access Token (필수)
- 설정 방법: `export FIGMA_ACCESS_TOKEN=figd_...`

## 개발 규칙
- 새 도구 추가 시 `.claude/skills/add-tool.md` 절차 따를 것
- 각 도구는 `src/tools/` 아래 단일 파일로 유지
- 도구 테스트는 `_workspace/spike/` 에 결과 기록 후 진행
- Phase 0(REST 쓰기 스파이크) 결과 확인 전 `write-description.ts` 구현 시작 금지

## 도구 목록 (8개)
| 도구 | 대체 대상 | 상태 |
|------|-----------|------|
| read_component | figma-console figma_get_component(enrich=true) | 미구현 |
| read_design_context | figma-official get_design_context | 미구현 |
| discover_nested_slots | get_figma_data depth≥3 + REST 스크립트 | 미구현 |
| get_tokens | 로컬 토큰 JSON + Console MCP | 미구현 |
| get_component_image | figma_get_component_image | 미구현 |
| generate_source_note | (수동 작성) | 미구현 |
| check_source_note | npm run rules:audit | 미구현 |
| write_description | figma-official use_figma | 스파이크 후 결정 |

## Figma REST API 엔드포인트
- `GET /v1/files/{fileKey}/nodes?ids={nodeId}` — 노드 전체 데이터
- `GET /v1/files/{fileKey}/variables/local` — 토큰/변수
- `GET /v1/images/{fileKey}?ids={nodeId}&format=png&scale=3` — 이미지
- `GET /v1/components/{key}` — 컴포넌트 메타
