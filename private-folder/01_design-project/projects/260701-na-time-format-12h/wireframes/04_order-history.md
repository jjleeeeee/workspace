# 주문내역 목록 — 12h 전환 와이어프레임

스크린샷: `screenshots/03_order-history/order-history-177-99309.png`

---

## 목표 & 사용자 작업

유저가 PICK-UP 주문 이력을 조회하는 목록 화면.
두 가지 시간 지점 존재: 주문일시(결제 시각) + PICK-UP 예약시간.

---

## 콘텐츠 & 컴포넌트

| 변경 지점 | 현재 | 변경 후 | 비고 |
|-----------|------|---------|------|
| 주문일시 | `2025.07.16 12:59` | `2025.07.16 4:59 AM PST` | 결제 UTC → 로컬 변환. 날짜도 로컬 기준 시프트 가능 (Open Q#2) |
| PICK-UP 예약시간 | `2025.08.13 (화) 10:45~11:00 (KST)` | `2025.08.13 (화) 6:45–7:00 PM PST` | 날짜/요일 KST 원본 유지, 시간+TZ만 변환 |

### 주문일시 vs 예약시간 처리 방침 (Open Q#2)

> 아직 미결. 현재 임시안:
> - 주문일시: 결제 타임스탬프 (UTC 기록) → 유저 로컬 TZ 변환 → 날짜도 로컬 계산
> - 예약시간: 픽업 현장 시각 (KST 맥락) → 날짜는 KST 원본, 시간만 로컬 변환 후 TZ 표기
>
> 확정 전까지 Figma 시안은 "날짜 KST 유지 + 시간 로컬 변환" 단일 규칙으로 제작.

---

## UX 체크리스트

- [x] 정보위계: 주문일시(secondary) → 주문번호 → 상품 → PICK-UP 예약시간(강조)
- [x] 터치 영역: 카드 전체 탭 가능 (`>` 화살표 포함) ≥44pt / ≥48dp
- [x] `변경` 버튼: 예약 변경 화면으로 이동
- [ ] 빈 상태: 주문 없을 때 처리 확인

---

## 접근성 체크리스트

- [ ] 주문일시 accessibilityLabel: `"Order date: July 16, 2025, 4:59 AM PST"`
- [ ] PICK-UP 예약시간 accessibilityLabel: `"PICK-UP reservation: August 13, 2025 Tuesday, 6:45 PM to 7:00 PM PST"`
- [ ] `변경` 버튼 accessibilityLabel: `"Change PICK-UP reservation"`
- [ ] 탭 필터(`PICK-UP`, `전체상태`, `미수령`, `수령완료`) — i18n 별도 범위
- [ ] Dynamic Type: 예약시간 텍스트 길이 증가 시 줄바꿈 여부

---

## Native 패턴 결정

**공통**
- 주문일시: UTC ISO → `DateFormatter(locale: en_US, timeZone: .current, dateStyle: none, timeStyle: short)` → `4:59 AM PST`
- PICK-UP 예약: KST ISO → 로컬 TZ 변환 → `h:mm–h:mm a zzz`

---

## Figma Agent 프롬프트 블록

```
화면: 주문내역 목록 (node 177-99309)
작업: 시간 텍스트 교체

교체:
- "2025.07.16 12:59" → "2025.07.16 4:59 AM PST"
- "2025.08.13 (화) 10:45~11:00 (KST)" → "2025.08.13 (화) 6:45–7:00 PM PST"

날짜/요일 변경 없음. 스크린샷으로 카드 레이아웃 확인.
```
