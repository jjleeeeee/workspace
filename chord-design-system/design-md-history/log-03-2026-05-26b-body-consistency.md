# log-03 — 본문 ↔ frontmatter 정합성 수정

**Date:** 2026-05-26b  
**Summary:** 본문의 stale "curated NN개" 문구 제거, namespace→SoT 매핑 추가, shadow SoT 모순 정정

## 변경 내용

- 수정: `§Colors` quote — `"curated 18개"` → `"frontmatter에 color 값 없음"`
- 수정: `§Colors §Role Tokens` — `"curated 18개를 다시 정의하지 않는다"` → 값 없음 명시
- 수정: `§Typography` quote — `"생산 Figma 기준 조합 스타일 12개"` → `"typography 값 없음"`
- 수정: `§Typography §4 Categories` — `"curated 12개"` → `"frontmatter에 typography 값 없음"`
- 수정: `§Layout` quote — `"curated 13개"` → `"spacing 값 없음"`
- 수정: `§Elevation` quote — `size.json의 size shadow/*` 거짓 SoT 제거. shadow = `tokens/size.json` 미등록(TODO), frontmatter `shadows:` 6항목이 유일 SoT로 교체
- 수정: `§Shapes` quote — `"curated 8개"` → `"radius 값 없음"`
- 추가: `ai-implementation-rules.token-reference-syntax` — namespace→SoT 파일 매핑 표 추가 (`{colors.*}`→`color.json`, `{spacing.*}`→`size.json` 등 7개 namespace 명시)
