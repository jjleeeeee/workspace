# 2026-05-06 — 컬러 토큰 추출 작업실 재구성

## 목표

`02_wf-figma-color-token-extraction`를 컬러 토큰 추출 전용 폴더로 정리했다.

## 변경

- `README.md`, `AGENTS.md`, `PLAYBOOK.md`를 추가해 진입 순서를 명확히 했다.
- 컬러 추출 정책과 검증 기준을 `workflow/`로 이동했다.
- 최신 컬러 output을 `outputs/current/tokens.color.v1.0.json`로 정리했다.
- 2026-04-23 기준 컬러 snapshot을 `outputs/previous-2026-04-23/`에 보관했다.
- Figma REST raw snapshot을 `outputs/raw/`에 보관했다.
- 추출/검증/회귀 테스트 스크립트를 `tools/`로 정리했다.
- DSL harness, HTML/avatar demo, 비컬러 token output, 나머지 Sprint 기록은
  `../99_archive/02_wf-figma-color-token-extraction_legacy/`로 이동했다.

## 판단

이 작업실의 output scope는 color token catalog 하나로 제한한다.

- size/typography catalog는 이 폴더의 output이 아니다.
- `base/color/*`는 resolve 재료이며 final catalog에는 노출하지 않는다.
- canonical sync 대상은 필요 시
  `../cds-catalogs/catalogs/tokens/tokens.color.v1.0.json`이다.
