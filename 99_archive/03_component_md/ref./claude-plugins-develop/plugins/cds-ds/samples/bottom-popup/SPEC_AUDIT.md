# WDS Bottom Popup Molecule — 플랫폼별 Spec 감사 결과
생성일: 2026-04-24
Figma: DWEduE6GfxYMlyxKPNJ8jA · node 71614:31833 (ground-truth: 73246:33455)
반복 횟수: 3회 (Iteration 1 → 2 → 3)

---

## 선행 Atom 컴포넌트

| Atom | 경로 | 플랫폼 |
|------|------|--------|
| WDSTextField | `atoms/text-field/` | Web / iOS / Android |
| WDSCheckbox | `atoms/checkbox/` | Web / iOS / Android |
| WDSTopNavigation | `atoms/top-navigation/` | Web / iOS / Android |

---

## Iteration 변경 이력

| Iter | 수정 내용 |
|------|----------|
| 1 | 초안 생성 — 전 prop/상태 구현 (Close button을 TopNavigation 내부에 배치) |
| 2 | Close Button을 TopNavigation 상단 별도 행(40px)으로 분리 (Figma 명세). Agree row 높이 56px, gap 8→6px, overlay padding 교정 |
| 3 | Counter를 title footer → title row 우측으로 이동 (Figma: "입력 필드 · · · 0/200" 같은 행) |

---

## Web (HTML + CSS) — 시각 비교 테스트

### 테스트 방식
Chrome headless 렌더 → 스크린샷 → Figma cell 이미지 직접 비교

### 최종 결과 (Iteration 3)

| 항목 | 기준 값 | 구현 값 | 일치 |
|------|---------|---------|------|
| 시트 배경색 | #ffffff | var(--clr-surface) | ✅ |
| 상단 radius | 16px (top-left, top-right) | border-radius: 16px 16px 0 0 | ✅ |
| 스크림 색상 | rgba(0,0,0,0.5) | var(--clr-scrim) | ✅ |
| Close Button row | 40px, right-aligned (별도 행) | .wds-popup__close-row | ✅ |
| Close icon inset | 16×16 icon in 40×40 frame | 16px SVG in 40×40 | ✅ |
| TopNavigation height | 48px | var(--h-nav)=48px | ✅ |
| Title 좌측 정렬 | 반드시 left | text-align: left | ✅ |
| Title font | 16px Bold | 16px / font-weight:700 | ✅ |
| TextField counter 위치 | title row 우측 | justify-content:space-between | ✅ |
| TextField input height | 48px | height:48px | ✅ |
| TextField border | 1px solid #e0e0e0 | 1px solid var(--clr-line-default) | ✅ |
| TextField radius | 8px | border-radius:8px | ✅ |
| TextField focus border | #00cbd5 | :focus-within border-color | ✅ |
| TextField title font | 13px Medium | 13px / font-weight:500 | ✅ |
| TextField counter font | 11px Regular rgba(0,0,0,0.5) | 11px / var(--clr-text-sub) | ✅ |
| Content padding-x | 16px | padding: 0 16px | ✅ |
| Content padding-bottom | 24px 필수 | padding-bottom:24px | ✅ |
| Overlay gradient height | 24px | .wds-popup__gradient height:24px | ✅ |
| Agree row height | 56px | .wds-checkbox-row height:56px | ✅ |
| Agree gap | 6px | gap:6px | ✅ |
| Checkbox type | circle | border-radius:999px | ✅ |
| Checkbox size | 24px | 24px | ✅ |
| Agree label font | 15px rgba(0,0,0,0.5) | 15px / var(--clr-text-sub) | ✅ |
| Confirm button height | 52px (XLarge 고정) | var(--h-button)=52px | ✅ |
| Confirm button full-width | fill | width:100% | ✅ |
| Confirm button color | #00cbd5 | var(--clr-btn-default) | ✅ |
| Overlay padding | px:16px pb:16px | padding:0 16px 16px | ✅ |
| Scrim dismiss | tap to close | onclick=closeAll() | ✅ |
| Width 반응형 | 373px (mobile) / 410px (tablet+) | min(var(--w-mobile), calc(100vw-20px)) | ✅ |
| Height | 70vh | max-height:70vh | ✅ |
| Slide animation | bottom 진입 | CSS transform transition | ✅ |

**Web 최종 평점: 30/30 항목 통과 ✅**

---

## iOS (SwiftUI) — Spec 준수 감사

| 항목 | 기준 | 구현 | 일치 |
|------|------|------|------|
| 시트 shape | top-radius 16pt | UnevenRoundedRectangle(topLeading:16, topTrailing:16) | ✅ |
| Close Button row | 40pt, right-aligned (별도 VStack 행) | closeButtonRow | ✅ |
| TopNavigation | 48pt, title only | topNavigation (title left) | ✅ |
| Title 좌측 정렬 | left | .frame(maxWidth:.infinity, alignment:.leading) | ✅ |
| WDSTextField counter 위치 | title row 우측 | HStack Spacer + counter | ✅ |
| WDSTextField input height | 48pt | .frame(height:48) | ✅ |
| WDSTextField border focus | #00cbd5 | isFocused ? .wdsBtnDefault | ✅ |
| WDSTextField radius | 8pt | RoundedRectangle(cornerRadius:8) | ✅ |
| Content scroll (overflow) | ScrollView | overflow ? ScrollView : VStack | ✅ |
| Content padding | 0 16pt 24pt | .padding(.horizontal,16).padding(.bottom,24) | ✅ |
| Gradient overlay | 24pt | LinearGradient height:24 | ✅ |
| WDSCheckbox type | circle | WDSCheckboxType.circle | ✅ |
| Confirm button height | 52pt (XLarge) | .frame(height:52) | ✅ |
| Confirm button full-width | fill | .frame(maxWidth:.infinity) | ✅ |
| Confirm button color | #00cbd5 | .wdsBtnDefault | ✅ |
| Scrim opacity | 0.5 | .wdsScrim = .black.opacity(0.5) | ✅ |
| Scrim dismiss | tap | .onTapGesture { dismiss() } | ✅ |
| Drag to dismiss | swipe down > 80pt | DragGesture onEnded | ✅ |
| Animation | spring | .spring(response:0.35) | ✅ |
| Accessibility | button labels | .accessibilityLabel() | ✅ |

**iOS 최종 평점: 20/20 항목 통과 ✅**

---

## Android (Jetpack Compose) — Spec 준수 감사

| 항목 | 기준 | 구현 | 일치 |
|------|------|------|------|
| 시트 shape | top-radius 16dp | RoundedCornerShape(topStart=16.dp, topEnd=16.dp) | ✅ |
| Close Button row | 40dp, right-aligned (별도 Row) | Row height:40dp Arrangement.End | ✅ |
| TopNavigation | 48dp, title only | Row height:48dp | ✅ |
| Title 좌측 정렬 | left | Modifier.weight(1f) + padding(start=8.dp) | ✅ |
| WDSTextField counter 위치 | title row 우측 | Row SpaceBetween + counter Text | ✅ |
| WDSTextField input height | 48dp | height:48.dp | ✅ |
| WDSTextField border focus | #00cbd5 | isFocused → WdsColorBtnDefault | ✅ |
| WDSTextField radius | 8dp | RoundedCornerShape(8.dp) | ✅ |
| Content scroll (overflow) | verticalScroll | overflow → .verticalScroll() | ✅ |
| Content padding | 0 16dp 24dp | .padding(horizontal=16, bottom=24) | ✅ |
| Gradient overlay | 24dp | Brush.verticalGradient height:24.dp | ✅ |
| WDSCheckbox type | circle | WDSCheckboxType.Circle | ✅ |
| Confirm button height | 52dp (XLarge) | .height(52.dp) | ✅ |
| Confirm button full-width | fill | .fillMaxWidth() | ✅ |
| Confirm button color | #00cbd5 | WdsColorBtnDefault | ✅ |
| Scrim opacity | 0.5 | WdsColorScrim = 0x80000000 | ✅ |
| Scrim dismiss | tap | .clickable { onDismiss() } | ✅ |
| Slide animation | AnimatedVisibility | slideInVertically + fadeIn | ✅ |
| Semantics | contentDescription | .semantics { contentDescription = "닫기" } | ✅ |
| Overlay gap | 6dp | Arrangement.spacedBy(6.dp) | ✅ |

**Android 최종 평점: 20/20 항목 통과 ✅**

---

## Atom 컴포넌트 Spec 요약

### WDSTextField
| 항목 | 값 |
|------|-----|
| Input height | 48px/pt/dp |
| Border | 1px, #e0e0e0 (기본) / #00cbd5 (포커스) / #f44336 (에러) |
| Radius | 8px |
| Counter 위치 | title row 우측 (타이틀과 같은 행) |
| Title font | 13px Medium |
| Input font | 15px Regular |
| Counter font | 11px Regular rgba(0,0,0,0.5) |

### WDSCheckbox
| 항목 | 값 |
|------|-----|
| Size | 24px/pt/dp |
| Type | circle (BottomPopup 전용) / square |
| Border | 1.5px #e0e0e0 → checked: #00cbd5 fill |
| Label font | 15px Regular rgba(0,0,0,0.5) |

### WDSTopNavigation
| 항목 | 값 |
|------|-----|
| Height | 48px/pt/dp |
| Title align | 좌측 정렬 필수 |
| Title font | 16px Bold |
| Icon slot | 40×40px (icon 16×16, inset 12px) |

---

## 산출물 위치

```
samples/bottom-popup/
├── bottom-popup.dsl.json
├── SPEC_AUDIT.md               ← 이 파일
├── atoms/
│   ├── text-field/
│   │   ├── text-field.dsl.json
│   │   ├── web/index.html
│   │   ├── ios/WDSTextField.swift
│   │   └── android/WDSTextField.kt
│   ├── checkbox/
│   │   ├── checkbox.dsl.json
│   │   ├── web/index.html
│   │   ├── ios/WDSCheckbox.swift
│   │   └── android/WDSCheckbox.kt
│   └── top-navigation/
│       ├── top-navigation.dsl.json
│       ├── web/index.html
│       ├── ios/WDSTopNavigation.swift
│       └── android/WDSTopNavigation.kt
├── web/index.html              ← 인터랙티브 데모 (4개 variant)
├── ios/WDSBottomPopup.swift
└── android/WDSBottomPopup.kt
```
