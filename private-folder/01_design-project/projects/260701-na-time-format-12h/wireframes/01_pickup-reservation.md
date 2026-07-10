# 픽업 예약하기 — 12h 전환 와이어프레임

스크린샷: `screenshots/01_pickup-reservation/pickup-reservation-177-100977.png`

---

## 목표 & 사용자 작업

en-US 유저가 픽업 날짜·시간 슬롯을 선택하는 화면.
시간 표기를 24h(KST) → 12h(유저 로컬 TZ)로 변환.

---

## 콘텐츠 & 컴포넌트

| 변경 지점 | 현재 | 변경 후 |
|-----------|------|---------|
| 헤더 요약 | `시간 10:45~11:00` | `Time 6:45–7:00 PM PST` |
| 섹션 헤더 | `오전` | `AM` |
| 섹션 헤더 | `오후` | `PM` |
| 안내 라벨 | `수령지 기준 시간 : KST` | `Times shown in your local time zone (PST)` |
| 슬롯 셀 시작 | `09:00` | `9:00` |
| 슬롯 셀 종료 | `~09:15` | `–9:15` |
| 선택된 슬롯 헤더 | `시간 10:45~11:00` | `Time 6:45–7:00 PM PST` |

- **Chips (Chord)**: 슬롯 셀 = Chips 컴포넌트 확인 필요 (현재 custom grid일 가능성)
- 섹션 헤더는 Body/Label 텍스트 컴포넌트

### 슬롯 셀 변환 예시 전체 (KST → PST, UTC-9)

| KST 원본 | PST 표시 | 섹션 |
|----------|----------|------|
| 09:00~09:15 | 12:00–12:15 AM | AM |
| 09:15~09:30 | 12:15–12:30 AM | AM |
| … | … | … |
| 17:30~17:45 | 8:30–8:45 PM | PM |

> ⚠️ PST는 KST -17h. KST 09:00 = PST 전일 16:00. 슬롯이 전일로 넘어가는 케이스 날짜 처리 별도 결정 필요 (Open Q#1).

---

## UX 체크리스트

- [x] 정보위계: 헤더 요약(선택된 시간) → 섹션 헤더(AM/PM) → 슬롯 셀
- [x] 터치 영역: 슬롯 카드 ≥44pt iOS / ≥48dp Android (현재 크기 유지)
- [ ] 빈 상태: 모든 슬롯 마감 시 처리 확인
- [x] 로딩: `새로고침` 버튼 유지
- [ ] 에러: 네트워크 실패 시 슬롯 미노출 케이스 확인

---

## 접근성 체크리스트

- [ ] 슬롯 셀 accessibilityLabel: `"9:00 AM to 9:15 AM, available"` / `"9:30 AM to 9:45 AM, almost full"` / `"10:00 AM to 10:15 AM, closed"`
- [ ] 선택된 셀: `"6:45 PM to 7:00 PM, selected"`
- [ ] `마감` 뱃지 → `Closed` (별도 accessibilityLabel 불필요, 텍스트가 라벨)
- [ ] `마감임박` 뱃지 → `Almost full`
- [ ] 섹션 헤더 `AM`/`PM`은 장식 아님 → heading role or group label
- [ ] 색 대비: 비활성 슬롯(회색) ≥3:1 / 활성 슬롯 테두리 ≥3:1
- [ ] Dynamic Type: 슬롯 셀 폰트 크기 축소 시 2줄 wrap 허용 여부 확인

---

## Native 패턴 결정

**iOS**
- `DateFormatter`, locale `en_US`, timeZone `TimeZone.current`, dateFormat `h:mm a`
- accessibilityLabel: `"\(startFormatted) to \(endFormatted), \(status)"`

**Android**
- `DateTimeFormatter.ofPattern("h:mm a", Locale.US).withZone(ZoneId.systemDefault())`
- contentDescription: `"$startFormatted to $endFormatted, $status"`

---

## Figma Agent 프롬프트 블록

```
화면: PICK-UP 예약하기 (node 177-100977)
작업: 텍스트 레이어만 교체 (레이아웃 무변경)

교체 목록:
- "시간 10:45~11:00" → "Time 6:45–7:00 PM PST"
- "수령지 기준 시간 : KST" → "Times shown in your local time zone (PST)"
- "오전" 섹션 헤더 → "AM"
- "오후" 섹션 헤더 → "PM"
- 슬롯 셀 시작시각: "09:00" 형식 → "9:00" (leading zero 제거)
- 슬롯 셀 종료시각: "~09:15" → "–9:15" (tilde → en-dash)
- 마감 뱃지: "마감" → "Closed"
- 마감임박 뱃지: "마감임박" → "Almost full"

토큰: 기존 text style 그대로 사용
스크린샷 후 3열 그리드 레이아웃 깨짐 여부 확인
```
