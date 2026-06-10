---
type: WorkflowReference
status: Draft
version: 1.0
updated: 2026-05-08
---

# Exceptions And Recovery

이 문서는 component build workflow에서 자주 생기는 실패와 대응을 정리한다.

| Situation | Response |
| --- | --- |
| component set 전체 context가 너무 큼 | child variant node를 골라 `get_design_context`를 다시 호출한다 |
| Framelink MCP와 Console MCP 값이 다름 | source note에 conflict를 기록하고 Console MCP description을 우선한다 |
| Console MCP Desktop Bridge가 연결되지 않음 | **source note 작성과 component implementation을 중단한다.** 사용자에게 Figma Desktop에서 Desktop Bridge 플러그인을 실행한 뒤 재시도를 요청한다. |
| required parent/representative MCP read 실패 | source note 작성과 component implementation을 중단하고 재시도를 요청한다 |
| nested component/module read만 실패 | source note에 `nested-read-failed:<component-name>`을 기록하고 `Nested Module Inventory` coverage를 `deferred`로 표시한다. 이 범위는 full-parity gate로 보고하지 않는다 |
| screenshot URL 만료 | 같은 node id로 screenshot/image를 다시 생성하고 가능하면 local baseline을 저장한다 |
| token JSON에 필요한 token이 없음 | hardcode하지 말고 source note의 `Known Gaps`에 기록한다 |
| Storybook port 충돌 | 빈 local port를 사용하고 완료 보고에 실제 URL을 남긴다 |
| representative node 근거가 부족함 | 구현 범위를 줄이거나 누락 범주를 `Known Gaps`에 남긴다 |
| production icon/loading/image/logo/badge asset이 없음 | CSS로 몰래 다시 그리지 않는다. placeholder면 source note/story/회고에 gap을 기록한다 |
| icon registry entry가 없음 | Figma icon library node `10219:78691`에서 SVG export와 `chord-icons` metadata 추가를 먼저 시도한다 |
| `icon_area`와 SVG glyph size를 혼동함 | `icon_area`는 wrapper/sizing contract로, SVG glyph는 registry asset으로 source note에 분리 기록한다 |
| SVG가 visual diff에서 깨짐 | `asset-registry`, `icon-area-sizing`, `svg-rendering` 중 하나로 분류하고 raw inline SVG/currentColor 렌더링을 확인한다 |
| token output 순서 때문에 색상이 뒤집힘 | token build script를 먼저 고치고 visual smoke를 다시 실행한다 |
| browser smoke에서 console error가 남 | resource error와 component error를 구분하고 component console error 0 기준을 다시 확인한다 |

## Recovery Rule

- 복구는 source note에 기록 가능한 근거가 있을 때만 한다.
- source가 부족하면 구현 범위를 줄이거나 `Known Gaps`로 남긴다.
- icon registry miss는 `missing-icon-registry-entry`로 기록한다.
- placeholder는 production-complete로 보고하지 않는다.
