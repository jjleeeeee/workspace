# 2026-04-20 4차 — OS 구현 vs Figma Diff 정규화 spec PoC

## 목표
iOS/AOS/Web 3개 직군에서 AI 생성 코드와 Figma 원본의 wireframe-level drift를 자동 검증하기 위한 **정규화 스키마(v0.1)** 초안 확정 및 실제 Figma 노드로 추출 검증.

## 진행
- `figma-console` MCP의 `figma_get_component_for_development`로 `hSZA1GLBpbgIyDFOnibf99` 파일의 `287:16452` (Common_Slot, 393×674) 노드 JSON 추출 — 13개 하위 컴포넌트 트리(depth 4) 성공.
- `figma_get_variables`로 bound variable 16개 중 **11개** 이름 resolve (예: `system/size/padding/box/150`, `system/color/surface/default-reverse`).
- `NormalizedNode` 스키마 정의 (box / layout / spacing / style / variants / slots / children), 실측 노드를 해당 스키마로 변환.
- 결과 문서: [../os_diff_wireframe_verification.md](../os_diff_wireframe_verification.md)

## 실패/우회
- 나머지 5개 bound variable은 primitives 라이브러리 소속이라 현재 파일에서 resolve 불가
  - **우회**: `$fallback` 필드로 실제 값(`#FFFFFF`, `16`, shadow spec) 기록 → 이름이 없어도 diff는 성립
- `figma_get_variables` 응답이 64k chars 초과로 직접 반환 불가
  - **우회**: 파일 저장 후 `jq`로 ID 꼬리 매칭 필터링해 11개만 추출

## 결과
- Drift 자동 탐지 사례 확인: Tabs 내 Chip 3개가 fill을 raw `rgb(0.87,0.87,0.87)`로 사용, `boundVariables.fills` 없음 → `__drift` 플래그로 스키마에서 표시 가능.
- OS 3개 직군 매핑 표 작성 (같은 Figma 토큰 → `SizeToken.*` / `R.dimen.*` / CSS var) → 심볼 문자열 비교만으로 토큰 적용 여부 판정 가능.

## 다음 사이클 이슈
- primitives 라이브러리 직접 열어 미resolve 5개 토큰 이름 확보
- OS별 추출기 스펙 (iOS 뷰 디버거 / AOS `uiautomator dump` / Web `getComputedStyle` → NormalizedNode 매핑 표)
- Diff 엔진 프로토타입 (TS 함수, 리포트 카테고리: missing/extra/token-drift/variant-mismatch/layout-mismatch/spacing-mismatch)
