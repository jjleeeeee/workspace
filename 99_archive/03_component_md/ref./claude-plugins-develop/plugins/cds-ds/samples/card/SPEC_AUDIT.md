# Common Slot Card — Spec Audit

Figma: `PNCopTVjqi100eHucCW9bI` node `15730:43568` (Common_Slot)  
플랫폼: Web only  
Iterations: 3

---

## Web (web/index.html)

비교 방법: Figma MCP `get_design_context` 스크린샷 + JS 계산 검증 (3 iterations)

| # | 항목 | 기대값 | 구현값 | 상태 |
|---|------|--------|--------|------|
| 1 | Section title text | "놓치지 말아야 할 소식" | ✅ | PASS |
| 2 | Section title typography | 19px/800 | ✅ | PASS |
| 3 | Section header height | min-h 48px, px-16px | ✅ | PASS |
| 4 | Screen margin | 10px 좌우 | ✅ JS: card@50, cw:400px | PASS |
| 5 | Card background | #ffffff | ✅ | PASS |
| 6 | Card radius | 16px | ✅ | PASS |
| 7 | Card shadow | 0px 6px 28px rgba(0,0,0,0.1) | ✅ | PASS |
| 8 | Thumbnail aspect | 1:1 | ✅ | PASS |
| 9 | Thumbnail placeholder | 회색 박스 (#d0d0d0) | ✅ | PASS |
| 10 | Bottom Header outer py | 12px 상하 | ✅ card__header-outer | PASS |
| 11 | Bottom Header height | 48px inner | ✅ | PASS |
| 12 | Bottom Header px | 16px 좌우 | ✅ | PASS |
| 13 | Avatar size | 32px 원형 | ✅ | PASS |
| 14 | Artist name typography | 16px/700 | ✅ | PASS |
| 15 | Artist subtitle typography | 13px/400 #8e8e8e | ✅ | PASS |
| 16 | Body text typography | 15px/400 | ✅ | PASS |
| 17 | Body text wrapping | pre-wrap 자연 줄바꿈 | ✅ | PASS |
| 18 | Last Line height | 21px flex row | ✅ | PASS |
| 19 | Last Line text truncation | text-overflow: ellipsis | ✅ JS: llt.w=327 | PASS |
| 20 | "More" link color | #00b8c1 (primary) | ✅ | PASS |
| 21 | "More" link typography | 15px/700 | ✅ | PASS |
| 22 | "More" link position | flex-shrink:0, last-line 우측 | ✅ JS: ml@398 | PASS |
| 23 | Footer divider | 1px #e0e0e0 | ✅ | PASS |
| 24 | Footer list item height | min-h 56px | ✅ | PASS |
| 25 | Footer label typography | 15px/700 | ✅ | PASS |
| 26 | Footer chevron | 16px SVG | ✅ | PASS |
| 27 | Card overflow | hidden (card bound) | ✅ | PASS |
| 28 | Common slot gap | 4px | ✅ | PASS |

**결과: 28/28 ✅**

---

## Iteration 로그

| Iter | 발견 이슈 | 수정 |
|------|-----------|------|
| 1 | Body overflow right, "More" 미표시, Bottom Header outer py 누락 | `overflow-x:hidden` 추가, Last Line flex 패턴 적용, `card__header-outer {py:12px}` 추가 |
| 2 | Card 실제 폭 검증 필요, "More" JS 위치 확인 | `card-wrapper { display:flex }`, `card { flex:1 0 0; min-width:0 }`, `html {overflow-x:hidden}` 추가 |
| 3 | JS 디버그로 레이아웃 정확성 검증 | 레이아웃 올바름 확인 (slot:420@40, card:400@50, ml:35@398) |

---

## 비고

- 이미지 asset → 회색 박스 (#d0d0d0) 대체 (명세 요구사항)
- headless Chrome 최소 CSS viewport = 500px; 실제 모바일(390px) 환경 JS 계산으로 검증
- iOS/Android 구현 없음 (Web only 요청)
