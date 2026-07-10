# 예약 변경 — 12h 전환 와이어프레임

스크린샷: `screenshots/03_order-history/reservation-change-177-102534.png`

---

## 목표 & 사용자 작업

유저가 기존 PICK-UP 예약 날짜·시간을 변경하는 화면.
픽업예약 화면과 동일한 슬롯 그리드 + 날짜 Chip 추가.

---

## 콘텐츠 & 컴포넌트

| 변경 지점 | 현재 | 변경 후 |
|-----------|------|---------|
| 헤더 요약 시간 | `시간 10:45~11:00` | `Time 6:45–7:00 PM PST` |
| 안내 라벨 | `수령지 기준 시간 : KST` | `Times shown in your local time zone (PST)` |
| 섹션 헤더 | `오전` | `AM` |
| 슬롯 셀 | `09:00` / `~09:15` | `9:00` / `–9:15` |
| 날짜 Chip | `08.13 화`, `08.14 수`, `08.15 목`, `08.16 금` | 유지 (날짜 변경 없음) |

- **날짜 Chip**: Chord `Chips` 컴포넌트 사용. 텍스트 변경 없음.
- 슬롯 그리드 규칙은 픽업예약 화면(`01_pickup-reservation.md`)과 동일 (안C)

---

## UX 체크리스트

- [x] 정보위계: 헤더 요약 → 날짜 Chip 선택 → AM/PM 섹션 → 슬롯 그리드 → 예약 변경하기 CTA
- [x] 터치 영역: 날짜 Chip ≥44pt / ≥48dp / 슬롯 셀 동일
- [ ] 날짜 Chip 비활성(`08.16 금` 회색) accessibilityTrait = disabled 확인
- [x] `예약 변경하기` CTA: 슬롯 선택 전 비활성화 처리 확인

---

## 접근성 체크리스트

- [ ] 날짜 Chip accessibilityLabel: `"August 13, Tuesday, selected"` / `"August 14, Wednesday"` / `"August 16, Friday, unavailable"`
- [ ] 슬롯 셀 accessibilityLabel: 픽업예약 화면과 동일 규칙 (`"9:00 AM to 9:15 AM, available"`)
- [ ] 헤더 요약 accessibilityLabel: `"Selected time: 6:45 PM to 7:00 PM PST"`
- [ ] Dynamic Type: 날짜 Chip 텍스트 + 슬롯 셀 동시 확대 시 레이아웃 확인

---

## Native 패턴 결정

**공통**
- 슬롯 시간: 픽업예약 화면과 동일 DateFormatter/DateTimeFormatter 재사용
- 날짜 Chip: `MM.dd EEE` 포맷 원본 유지 (날짜 변경 없음)

**iOS**
- Chip selected state: `UIButton` selected / accessibilityValue `"selected"`
- Chip disabled state: `isEnabled = false`

**Android**
- Chip: Material `Chip` with `isCheckable = true`
- Disabled: `isEnabled = false` → contentDescription `"unavailable"` 추가

---

## Figma Agent 프롬프트 블록

```
화면: PICK-UP 예약 변경하기 (node 177-102534)
작업: 텍스트 교체 (픽업예약 화면 동일 규칙)

교체:
- "시간 10:45~11:00" → "Time 6:45–7:00 PM PST"
- "수령지 기준 시간 : KST" → "Times shown in your local time zone (PST)"
- "오전" → "AM"
- 슬롯 셀: "09:00"→"9:00", "~09:15"→"–9:15" (전체 슬롯 동일 규칙)
- 마감/마감임박 뱃지: "Closed" / "Almost full"

날짜 Chip(08.13 화 등) 변경 없음.
스크린샷으로 슬롯 그리드 + Chip 레이아웃 확인.
```
