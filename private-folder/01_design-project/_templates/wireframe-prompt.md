# Wireframe Prompt — [화면명]

> Figma Agent에 전달할 프롬프트. Phase 3 산출물.
> 위버스 현재 화면 스크린샷: `screenshots/<screen>.png`

---

## 목표 & 사용자 작업

- 사용자가 이 화면에서 해야 할 일:
- 핵심 인터랙션:

---

## 콘텐츠 & 컴포넌트

> chord-design-system 컴포넌트명 사용. 경로: `/Users/jj.iee/Desktop/chord-design-system/components/`

| 영역 | 컴포넌트 | 비고 |
|---|---|---|
| 헤더 | | |
| 본문 | | |
| 하단 CTA | | |

---

## UX 체크리스트

- [ ] 정보위계 명확 (H1 → H2 → Body 순)
- [ ] 터치 영역 ≥44pt (iOS) / ≥48dp (Android)
- [ ] 빈 상태 (Empty state) 처리
- [ ] 로딩 상태 처리
- [ ] 에러 상태 처리
- [ ] 스크롤 시 고정 요소 동작

---

## 접근성 체크리스트

- [ ] 텍스트 색 대비 ≥4.5:1
- [ ] UI 요소 색 대비 ≥3:1
- [ ] VoiceOver 레이블 (iOS)
- [ ] TalkBack 레이블 (Android)
- [ ] Dynamic Type 대응 (최대 AX5까지)
- [ ] 색 단독으로 정보 전달 금지

---

## Native 패턴 결정

- **iOS (HIG)**: 
- **Android (M3)**: 
- **공통 결정 사항**: 

---

## Figma Agent 프롬프트 블록

```
화면: [화면명]
플랫폼: iOS / Android (공통 와이어프레임)
캔버스 사이즈: 390×844 (iPhone 14 기준)

레이아웃:
- 상단 내비게이션: [컴포넌트명], 높이 44pt
- 본문: [설명]
- 하단 탭바: [컴포넌트명], 높이 83pt (safe area 포함)

사용 컴포넌트 (chord-design-system 기준):
- [컴포넌트명]: [배치 위치, 상태]

토큰:
- 배경: [token name]
- 텍스트: [token name]
- 간격: [token name]

주의:
- Safe area top/bottom 반드시 확보
- 터치 영역 최소 44pt
```
