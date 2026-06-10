---
name: platform-aos
description: "Android Compose 플랫폼 구현 규칙. WDS Android 토큰, Jetpack Compose 패턴, ADB 기반 QA를 정의한다."
trigger: "android, compose, kotlin, jetpack, aos 플랫폼"
---

# AOS(Android) 플랫폼 규칙

`figma_impl_orchestration` 스킬의 AOS 플랫폼 sub-rule이다.  
`aos_ui_implementor` 에이전트가 이 규칙을 참조해 Jetpack Compose 코드를 생성한다.

---

## WDS 토큰 규칙 (필수)

```kotlin
// ✅ 색상
WdsTheme.colors.systemColorButtonDefault
WdsTheme.colors.systemColorSurfacePrimary

// ✅ 타이포그래피
WdsTheme.typography.bodyLg
WdsTheme.typography.titleXlg

// ✅ 사이즈
WdsTheme.dimens.paddingBox200
WdsTheme.dimens.spacingBox100
```

**금지**: 하드코딩 hex (`Color(0xFF3D5AFE)`), 하드코딩 dp (`16.dp`)

---

## Compose 레이아웃 매핑 (Figma → Compose)

| Figma Layout | Compose |
|---|---|
| Horizontal Auto Layout | `Row` |
| Vertical Auto Layout | `Column` |
| Wrap | `FlowRow` (Accompanist) |
| Fill width | `Modifier.fillMaxWidth()` |
| Hug width | `Modifier.wrapContentWidth()` |
| Fixed size | `Modifier.size(WdsTheme.dimens.*)` |
| Overlay | `Box` |
| Scroll | `verticalScroll(rememberScrollState())` |

---

## WDS Android 컴포넌트 매핑

| Figma | WDS Android |
|---|---|
| Button / Text Button | `WdsButton` |
| Avatar | `WdsAvatar` |
| Chip | `WdsChip` |
| Divider | `WdsDivider` |

매핑 없는 컴포넌트: Material3 → custom Composable

---

## 파일 구조

```
feature/<feature-name>/
├── ui/
│   ├── <FeatureName>Screen.kt
│   └── components/
│       └── <ComponentName>.kt
└── viewmodel/
    └── <FeatureName>ViewModel.kt  (비즈니스 로직은 수정 금지)
```

---

## QA 도구

QA 자동화는 `ui_qa` 에이전트가 수행. 본 SKILL 은 AOS 플랫폼에서 사용 가능한 도구만 명시한다.

### 빌드·기동
- **빌드**: `./gradlew assembleDebug`
- **에뮬레이터/디바이스 실행**: `adb shell am start -n <package>/<activity>`
- **사전 조건**: 에뮬레이터 부팅 또는 USB 디바이스 연결 (`adb devices` 로 확인)

### 스크린샷 (single-frame-qa)
```bash
adb shell screencap -p /sdcard/qa_<scenario>.png
adb pull /sdcard/qa_<scenario>.png \
  docs/design-brief/<feature>/by-figma/screenshots/qa_<scenario>.png
```

### Sequence 자동화 (sequence-qa)
- 제스처: `adb shell input swipe <x1> <y1> <x2> <y2> <ms>`
- 탭: `adb shell input tap <x> <y>`
- 키 이벤트: `adb shell input keyevent <code>`
- 상태마다 별도 캡처 (`qa_initial.png`, `qa_carousel-page-1.png`, ...)

### 상태 전이 증명
- `adb shell uiautomator dump /sdcard/window_dump.xml` + `adb pull`
- ViewHierarchy XML 에서 `content-desc` 어서션 (예: `content-desc="Carousel, page 2 of 10"`)

### Figma 비교
- Figma MCP `get_screenshot` / `get_design_context`
- 미연결 시 fileKey + nodeId + 디바이스 PNG 경로 명시

### Fallback
- ADB 미연결: "ADB 미연결 — `manual-pending`" + 사유 1줄

---

## 접근성

- 모든 이미지에 `contentDescription` 추가
- 인터랙티브 요소에 `semantics { }` 추가
- 색상 대비율 4.5:1 이상 (WDS 토큰 사용 시 자동 보장)
