# CLAUDE.md — Figma Description 하네스 규칙집

## 미션

Figma 컴포넌트 → `_workspace/outputs/draft-descriptions/*.description.yaml` (SoT)

## 읽기 순서

1. `harness/workflow.md` — 전체 흐름 + 단계별 판단 기준
2. `harness/orchestrator.md` — 에이전트 운영 + 작업 우선순위
3. `harness/schema.md` — YAML 스키마
4. `refs/figma-component-keys/index.md` — 컴포넌트 키 (필요 시)
5. `refs/markitdown-output/<component>.md` — 보조 참조 (필요 시)
6. `_workspace/reviews/history/figma-description-history.md` — 결정 이력 (필요 시)

## 허용

- `_workspace/outputs/draft-descriptions/*.description.yaml` 작성/수정
- `node tools/validate-component-description.mjs` 실행
- `python scripts/enrich_tokens.py`, `scripts/enrich_typography.py` 실행
- `_workspace/reviews/history/` 에 기록 추가
- `refs/`, `harness/` 읽기
- 서브에이전트: enricher, validator 역할에 한해 사용 가능

## 금지

- Figma `description` / `descriptionMarkdown` 필드에 직접 쓰기 (deprecated 2026-05-12)
- `bridge-descriptions/` 생성/수정 (deprecated 2026-05-12)
- 확인되지 않은 값을 추론으로 YAML 필드에 채우기 → `source_gaps`에 기록
- 자식 컴포넌트 상세를 부모 YAML에 복사 → `composition.uses`로 참조
- 서브에이전트의 Figma MCP 사용 (부모 에이전트 전용)
- `{component}.md` 파생 산출물 생성

## Source Priority

1. 사용자 지시
2. Figma 라이브 데이터 (MCP)
3. `refs/figma-component-keys/`
4. `refs/markitdown-output/`
5. `_workspace/reviews/history/`
6. LLM 추론 (최하위 — 확인 불가 시 source_gaps에 기록)

## Done 기준

- `_workspace/outputs/draft-descriptions/<component>.description.yaml` 저장
- `node tools/validate-component-description.mjs` 통과
- 결정 변경 시 `_workspace/reviews/history/figma-description-history.md` 기록
