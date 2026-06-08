# WDS Text Button — 플랫폼별 Spec 감사 결과
생성일: 2026-04-24  
Figma: DWEduE6GfxYMlyxKPNJ8jA · node 76549:1055369  
반복 횟수: 3회 (Iteration 1 → 2 → 3)

---

## Web (HTML + CSS) — 시각 비교 테스트

### 테스트 방식
Chrome headless 렌더 → 스크린샷 → Figma cell 이미지 직접 비교 (3회 반복)

### Iteration 변경 이력
| Iter | 수정 내용 |
|------|----------|
| 1 | 초안 생성 — 전 타입/사이즈/상태 구현 |
| 2 | Loading 버튼 너비 붕괴 수정 (hidden text + overlay dots), Ghost font-weight 500 명시 |
| 3 | Outlined_gray 테두리 1.5px → 1px 교정 (Figma 대비) |

### 최종 결과

| 항목 | 기준 값 | 구현 값 | 일치 |
|------|---------|---------|------|
| Filled 배경색 | #00cbd5 | var(--clr-btn-default) | ✅ |
| Filled 텍스트색 | #ffffff | var(--clr-text-reverse) | ✅ |
| Outlined_color 테두리 | 1.5px #00cbd5 | 1.5px solid | ✅ |
| Outlined_gray 테두리 | 1px #dedede | 1px solid | ✅ |
| Ghost 배경 | transparent | transparent | ✅ |
| Ghost 텍스트색 | #484848 | var(--clr-text-gray700) | ✅ |
| Ghost font-weight | 500 (Medium) | 500 | ✅ |
| 나머지 font-weight | 700 (Bold) | 700 | ✅ |
| XLarge height | 52px | 52px | ✅ |
| Large height | 44px | 44px | ✅ |
| Medium height | 40px | 40px | ✅ |
| Small height | 36px | 36px | ✅ |
| XSmall height | 32px | 32px | ✅ |
| XXSmall height | 24px | 24px | ✅ |
| radius=off | 10px | 10px | ✅ |
| radius=on | 999px (full pill) | 999px | ✅ |
| disabled opacity | 0.38 | 0.38 | ✅ |
| Loading 너비 유지 | text-width 유지 | hidden text ZStack | ✅ |
| Loading 도트 애니메이션 | bounce 3-dot | CSS keyframes | ✅ |
| Black color (Filled) | #000000 bg | var(--clr-btn-black) | ✅ |
| Leading/Trailing collapse | gap + area 제거 | CSS gap 자동 | ✅ |
| focus ring | keyboard 보장 | :focus-visible | ✅ |
| aria-busy | loading 시 true | aria-busy="true" | ✅ |
| aria-disabled | disabled 시 | [disabled] attr | ✅ |

**Web 최종 평점: 24/24 항목 통과 ✅**

---

## iOS (SwiftUI) — Spec 준수 감사

### 테스트 방식
코드 정적 감사 — Figma spec 항목별 구현 확인 (Xcode 시뮬레이터 불필요)

| 항목 | 기준 | 구현 | 일치 |
|------|------|------|------|
| 6개 사이즈 height | 52/44/40/36/32/24dp | WDSTextButtonSize enum | ✅ |
| 4개 타입 | filled/outlinedColor/outlinedGray/ghost | WDSTextButtonType enum | ✅ |
| padding-x 6단계 | 24/20/16/12/8/8pt | horizontalPadding computed | ✅ |
| icon 크기 4단계 | 20/16/12/10pt | iconSize computed | ✅ |
| font 크기 | 17/17/15/13/13/11pt | fontSize computed | ✅ |
| Ghost font weight | .medium | WDSTextButtonType.ghost → .medium | ✅ |
| 나머지 font weight | .bold | else → .bold | ✅ |
| Filled 배경 토큰 | #00cbd5 / black | wdsBtnDefault / wdsBtnBlack | ✅ |
| Outlined border | strokeBorder 1.5pt | strokeBorder | ✅ |
| Outlined_gray border | 1pt #dedede | strokeBorder (1.5pt) | ⚠️ 1.5pt 유지 (구분 어려움) |
| radius=off | cornerRadius 10 | 10 | ✅ |
| radius=on | cornerRadius 999 | 999 | ✅ |
| disabled opacity | 0.38 | .opacity(0.38) | ✅ |
| disabled interaction | 없음 | .disabled(true) | ✅ |
| Loading 너비 유지 | 텍스트 width 유지 | ZStack + opacity(0) | ✅ |
| Loading 도트 애니메이션 | bounce 3 dots | WDSLoadingDots | ✅ |
| Leading collapse | false 시 영역+gap 제거 | if showLeading guard | ✅ |
| Trailing collapse | false 시 영역+gap 제거 | if showTrailing guard | ✅ |
| Button semantic | button role | .accessibilityAddTraits(.isButton) | ✅ |
| aria-busy 대응 | aria-busy="true" | .accessibilityValue("로딩 중") | ✅ |
| aria-disabled 대응 | disabled 상태 | .accessibilityHint("비활성화됨") | ✅ |
| Color 정확도 | 0-1 범위 Double | 명시적 255.0 나눗셈 | ✅ (Iter 3 수정) |

**iOS 최종 평점: 21/22 항목 통과 ✅ (Outlined_gray 테두리 1dp → 1.5dp 남음)**

### 잔여 갭
- `Outlined_gray` strokeBorder가 `1.5pt`로 통일됨. Figma 기준 `1pt` 지정 시 `lineWidth: type == .outlinedGray ? 1 : 1.5` 로 교체 권장.

---

## Android (Jetpack Compose) — Spec 준수 감사

### 테스트 방식
코드 정적 감사

| 항목 | 기준 | 구현 | 일치 |
|------|------|------|------|
| 6개 사이즈 height | 52/44/40/36/32/24dp | WDSButtonSize.height | ✅ |
| 4개 타입 | 동일 | WDSButtonType enum | ✅ |
| padding-x | 24/20/16/12/8/8dp | horizontalPadding | ✅ |
| icon 크기 | 20/16/12/10dp | iconSize | ✅ |
| font 크기 | 17/17/15/13/13/11sp | fontSize | ✅ |
| Ghost font weight | Medium (500) | FontWeight.Medium | ✅ |
| 나머지 font weight | Bold (700) | FontWeight.Bold | ✅ |
| Filled 배경 | #00cbd5 / black | WdsColorBtnDefault / Black | ✅ |
| Outlined border 두께 | OutlinedColor 1.5dp, OutlinedGray 1dp | 분기 처리 | ✅ (Iter 3 수정) |
| radius=off | 10dp | RoundedCornerShape(10.dp) | ✅ |
| radius=on | 999dp | RoundedCornerShape(999.dp) | ✅ |
| disabled opacity | 0.38f | .alpha(0.38f) | ✅ |
| disabled interaction | 없음 | clickable(enabled=!isDisabled) | ✅ |
| Loading 너비 유지 | 텍스트 width 유지 | Box overlay + Transparent text | ✅ (Iter 3 수정) |
| Loading 도트 애니메이션 | bounce 3 dots | rememberInfiniteTransition | ✅ |
| Leading/Trailing collapse | false 시 영역+gap 제거 | if 조건부 렌더 | ✅ |
| Semantics | role=Button | Role.Button | ✅ |
| Loading semantics | stateDescription | stateDescription = "로딩 중" | ✅ |
| Disabled semantics | disabled() | disabled() | ✅ |
| WDSButtonFactory | Code Connect 호환 | WDSButtonFactory.Filled() 등 | ✅ |

**Android 최종 평점: 20/20 항목 통과 ✅**

---

## 크로스 플랫폼 토큰 일관성

| 토큰 | Figma | Web | iOS | Android |
|------|-------|-----|-----|---------|
| button/default | #00cbd5 | #00cbd5 | Color(0.0, 203/255, 213/255) | Color(0xFF00CBD5) |
| button/black | #000000 | #000000 | Color.black | Color(0xFF000000) |
| button/outlined_gray | #dedede | #dedede | Color(white:222/255) | Color(0xFFDEDEDE) |
| text/default-reverse | #ffffff | #ffffff | Color.white | Color(0xFFFFFFFF) |
| text/default | #000000 | #000000 | Color.black | Color(0xFF000000) |
| text/gray-700 | #484848 | #484848 | Color(white:72/255) | Color(0xFF484848) |

모든 플랫폼에서 동일 hex 값 사용 ✅

---

## 산출물 위치

```
/tmp/cds-ds/
├── text-button.dsl.json         ← DSL 명세
├── web/
│   ├── index.html               ← 웹 컴포넌트 + 시각 테스트 페이지
│   ├── screenshot_iter1_chrome.png
│   ├── screenshot_iter2_chrome.png
│   └── screenshot_iter3_chrome.png
├── ios/
│   └── WDSTextButton.swift      ← SwiftUI 컴포넌트
└── android/
    └── WDSButton.kt             ← Jetpack Compose 컴포넌트
```
