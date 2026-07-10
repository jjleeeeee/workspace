# 쇼케이스 광고 재생 화면 — 안 A (풀이머시브)

> **핵심 가설**: 바텀 네비 + FAB + 미니 배너 동시 숨김 → 9:16 영상 풀블리드 몰입 최대화
> 레퍼런스: 무신사 브랜드판 (바텀 네비 제거) + 위버스 리스닝 파티 풀스크린 (FAB+네비 동시 제거 선례)

---

## 목표 & 사용자 작업

- 쇼케이스 탭 진입 후 9:16 광고 영상 풀스크린 몰입
- 뮤트/언뮤트 제어
- CTA 카드 탭 → 인앱 브라우저 진입
- (탭 이탈) 하단 스와이프업 → 바텀 네비 일시 노출 → 탭 이동

---

## 레이어 스택 (하단 → 상단, z-order)

| z | 레이어 | 처리 |
|---|---|---|
| 1 | 광고 영상 풀블리드 (9:16, 화면 전체) | 재생 중 |
| 2 | 상단 오버레이 영역 (safe area top ~ 56pt) | 반투명 그라데이션 (상단 darkening) |
| 3 | AD 뱃지 — 좌상단 | 커스텀 라벨 (#000 50%, 텍스트 "AD" white) |
| 4 | 뮤트 버튼 — 우상단 | chord Button / Icon Button / Ghost / Fixed |
| 5 | CTA 오버레이 — 하단 고정 (~18%, ≈158pt) | 커스텀 Frame / fill #000000 / opacity 85% |
| 6 | 바텀 네비 | **숨김** (alpha 0, 공간 미점유) |
| 7 | 미디어 플레이어 FAB | **숨김** |
| 8 | 미디어 플레이어 미니 배너 | **억제** (진입 시 자동 노출 방지 — 개발 확인 필요) |

---

## 콘텐츠 & 컴포넌트

### CTA 오버레이 내부 구조 (하단 158pt 영역)

```
┌─────────────────────────────────────────┐  ← 상단 경계 (영상 하단 18% 지점)
│  [Avatar 36pt]  브랜드명 17pt SemiBold  │
│                 카피 14pt Regular       │
│                                    [>]  │  ← chevron, Button/Icon/Ghost/Fixed
│                                         │
│  (home indicator safe area 하단 패딩)   │
└─────────────────────────────────────────┘
```

| 요소 | chord 컴포넌트 | 스펙 |
|---|---|---|
| 브랜드 로고 | Avatar / Circle / Size-M (36pt) | 브랜드 로고 이미지 |
| 브랜드명 | 텍스트 직접 배치 | 17pt SemiBold, #FFFFFF |
| 광고 카피 | 텍스트 직접 배치 | 14pt Regular, #FFFFFF, 최대 1줄 (무신사 21자 기준) |
| Chevron | Button / Icon Button / Ghost / Fixed / XSmall | icon=chevron-right, #FFFFFF |
| 뮤트 버튼 | Button / Icon Button / Ghost / Fixed / Medium | icon=volume-off |
| AD 뱃지 | 커스텀 — chord Badge 미적용 (AD 전용 라벨 필요) | "광고" or "AD", 10pt, rounded rect |

> **chord ScrimOverlay 미사용 이유**: opacity 50% 고정 + 전체 뷰포트 적용 → CTA 하단 부분 영역 오버레이에 부적합.

---

## UX 체크리스트

- [ ] 정보위계: 브랜드 로고 → 브랜드명 → 카피 → chevron CTA
- [ ] 터치 영역: CTA 카드 전체 탭 가능 (최소 44pt / iOS, 48dp / Android)
- [ ] chevron 단독 탭도 동일 CTA 동작
- [ ] 바텀 네비 복귀: 하단 스와이프업 OR 화면 단순 탭 → 네비 일시 노출 (3초 후 페이드아웃)
- [ ] 첫 진입 힌트 UI 1회 노출 (형태 미정: Toast / Tooltip — 후속 결정)
- [ ] 뮤트 상태 기본값: 뮤트 ON (자동재생 정책 준수)
- [ ] 빈상태/로딩/에러: GAM preload 실패 시 폴백 처리 — 오픈이슈 #7 (별도 화면)

---

## 접근성 체크리스트

- [ ] AD 뱃지 색 대비 ≥4.5:1 (텍스트) — 배경 반투명이므로 실제 대비 별도 측정
- [ ] VoiceOver/TalkBack 레이블: `"광고. [브랜드명]. [카피]. 더보기 버튼"`
- [ ] 뮤트 버튼 레이블: `"소리 켜기"` / `"소리 끄기"` (상태 반영)
- [ ] Dynamic Type: CTA 텍스트 최대 2줄까지 오버레이 높이 자동 확장 대응
- [ ] 색 단독 정보 전달 금지 — AD 뱃지는 색 + 텍스트 동시 사용

---

## Native 패턴 결정

- **iOS HIG**
  - Sheet/Modal 아님 — 별도 진입 화면
  - 상단 Safe Area top inset 준수 (AD 뱃지 / 뮤트 버튼 y 좌표)
  - 하단 home indicator 영역(34pt) CTA 오버레이 내 padding으로 흡수
  - 바텀 네비 숨김 = `UITabBar` 또는 커스텀 네비 alpha 0 처리

- **Android M3**
  - Edge-to-edge 모드 강제 적용
  - System status bar 텍스트: Light (영상 위 항상 밝은 콘텐츠)
  - System navigation bar: 영상 평균 컬러 매칭 또는 투명

---

## 광고 소재 SAFE ZONE (광고주 가이드 명시 필요)

```
[화면 전체 1920px 기준]

0px   ┌──────────────────────────┐
      │  상단 메타 영역 (AD/뮤트) │  ~100px
      │  ← 핵심 정보 배치 가능   │
100px ├──────────────────────────┤
      │                          │
      │   SAFE ZONE              │
      │   (핵심 크리에이티브 영역) │
      │                          │
1570px├──────────────────────────┤
      │  CTA 오버레이 (~18%)     │  ~350px
1920px└──────────────────────────┘
         ← 하단 350px 핵심 정보 배치 금지
```

- 하단 18% (≈350px / 1920px) = CTA 오버레이 점유 → 광고 소재 핵심 정보 배치 금지
- 무신사 기준: 279px / 1620px = 17.2% → 위버스 1920px 환산 ≈ 330~350px

---

## Figma Agent 프롬프트 블록

```
프레임: iPhone 15 Pro (393 × 852pt), 배경 #FFFFFF
모든 요소: stroke #000000 1pt, fill none (명시 없으면 동일 적용)

[Layer 1] 영상 영역
- Rectangle 393 × 852pt, x=0, y=0
- 대각선 2개: 좌상(0,0)→우하(393,852), 우상(393,0)→좌하(0,852)
- 중앙 텍스트: "AD VIDEO (9:16)", 14pt

[Layer 2] 상단 오버레이 영역 (점선 박스)
- Rectangle 393 × 120pt, x=0, y=0, stroke dash [4,4]
- 좌상단 내부 텍스트: "[gradient overlay]", 10pt

[Layer 3] AD 뱃지 영역
- Rectangle 36 × 20pt, x=20pt, y=56pt
- 내부 텍스트: "AD", 10pt, center

[Layer 4] 뮤트 버튼 터치 영역
- Rectangle 44 × 44pt, x=329pt, y=48pt
- 내부 텍스트: "[mute]", 10pt, center

[Layer 5] CTA 오버레이 영역
- Rectangle 393 × 158pt, x=0, y=694pt
- 좌상단 내부 레이블: "CTA overlay (158pt / 18%)", 9pt
- 내부 요소:
  - Circle 36 × 36pt, x=20pt, y=714pt — 내부 텍스트: "[logo]", 9pt
  - Text "브랜드명", 17pt, x=68pt, y=714pt
  - Text "신보 발매 기념 한정 콜렉션", 14pt, x=68pt, y=736pt
  - Rectangle 32 × 32pt, x=341pt, y=716pt — 내부 텍스트: "[chevron]", 9pt

[Layer 6] 숨김 영역 (점선 박스)
- Rectangle 393 × 83pt, x=0, y=769pt, stroke dash [4,4]
- 중앙 텍스트: "바텀 네비 / FAB / 미니배너 — 진입 시 숨김", 10pt

주석(annotation — 별도 sticky note):
- "safe area top ≈ 44pt" (상단)
- "가시 영역 ~82%" (영상 영역 좌측 화살표)
- "광고 소재 하단 18% 핵심 정보 배치 금지" (CTA 영역 하단)
```

---

*작성: 2026-06-29 / 시안 A — 풀이머시브 (추천안)*
*비교 대상: `showcase-ad-play-B.md` (바텀 네비 유지)*
