# log-02 — B+α 순수화

**Date:** 2026-05-26a  
**Summary:** 이름 인덱스 블록 삭제, gradients/shadows 시맨틱 복원

SoT JSON이 있는 블록은 부분 인덱스가 false-allowlist 위험을 만든다는 판단으로 삭제.

## 변경 내용

- 삭제: `colors:` (20항목 `~`) — SoT: `tokens/color.json`
- 삭제: `typography:` (12항목 `~`) — SoT: `tokens/typography.json` + `semantic.json`
- 삭제: `rounded:` (8항목 `~`) — SoT: `tokens/size.json` (`radius/box/*`)
- 삭제: `icon:` (4항목 `~`) — SoT: `tokens/size.json` (`icon/*`)
- 삭제: `spacing:` (13항목 `~`) — SoT: `tokens/size.json` (`padding/margin/*`)
- 복원: `gradients:` — `~` 항목을 컨텍스트 매핑 설명으로 교체. 색 stops SoT는 `color.json`, 1:1 컨텍스트 매핑 SoT는 본 블록 단독
- 복원: `shadows:` — 코멘트 블록 → YAML 블록 전환. 6개 토큰 시맨틱 레이블 추가. `tokens/size.json` 미등록 상태 유지 (TODO)
