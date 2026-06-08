# Jetpack Compose 특화 규칙

Android 플랫폼 코드 생성 시 이 파일의 모든 규칙을 SKILL.md 공통 규칙과 함께 적용한다.

---

## DS 토큰 → Compose API 매핑

### Color (TokenRef)

| DSL TokenRef 형식 | Compose 표현 |
|--------------|------------|
| `'token:system.color.*'` | `WDSTheme.color.<camelCase>` |
| `'token:system.color.button.default'` | `WDSTheme.color.systemColorButtonDefault` |
| `'token:system.color.brand.primary'` | `WDSTheme.color.systemColorBrandPrimary` |
| `'hardcoded:rgba(255,255,255,0)'` | `Color(0x00FFFFFF)` + `// FIXME: hardcoded` |
| `'unresolved:#484848'` | `Color(0xFF484848)` + `// TODO: 토큰 매칭 필요` |

- `WDSTheme.color.*`: `Color` 타입.
- dotted-path를 camelCase로 변환: `system.color.button.default` → `systemColorButtonDefault`.

### Typography

| DSL TokenRef | Compose 표현 |
|--------------|------------|
| `'textStyle:body-lg/system-700'` | `WDSTheme.typography.bodyLgSystem700` |
| `'token:typography.default.base.lineheight.text-lineheight-100'` | 매핑 테이블 우선, 없으면 `WDSTheme.typography.<camelCase>` |

- `WDSTheme.typography.*`: `TextStyle` 타입. `Text()`의 `style` 파라미터에 전달.

### Size / Spacing

| DSL TokenRef | Compose 표현 |
|--------------|------------|
| `'token:system.size.*'` | `WDSTheme.size.<camelCase>` |
| `'token:system.size.padding.box.300'` | `WDSTheme.size.systemSizePaddingBox300` |
| `'token:system.size.button-height.large'` | `WDSTheme.size.systemSizeButtonHeightLarge` |

- `WDSTheme.size.*`: `Dp` 값.

### Shadow / Effects

`Style.effects` 배열의 `{ type: 'shadow', ... }` →
- `Modifier.shadow(elevation = ...)` 또는 매핑 테이블 우선
- TokenRef 컬러는 `WDSTheme.elevation.*` 매핑

---

## 레이아웃 매핑 (Layout v2)

| `Layout.kind` + `axis` | Compose 컨테이너 |
|-------------|----------------|
| `kind='stack'`, `axis='horizontal'` | `Row(horizontalArrangement:, verticalAlignment:)` |
| `kind='stack'`, `axis='vertical'` | `Column(verticalArrangement:, horizontalAlignment:)` |
| `kind='box'` | `Box` |
| `kind='overlay'` | `Box` (자식 z-순서) |
| `kind='absolute'` | `Box` + 자식 `Modifier.offset(x, y)` |
| `kind='scroll'` | `Modifier.verticalScroll(rememberScrollState())` 등 |

- `layout.spacing` → `Arrangement.spacedBy(<n>.dp)`
- `layout.padding` → `Modifier.padding(top = <t>.dp, end = <r>.dp, bottom = <b>.dp, start = <l>.dp)`
- `layout.alignment.main` → `Arrangement.<Start|Center|End|SpaceBetween|...>`
- `layout.alignment.cross` → `Alignment.<Start|CenterHorizontally|End|...>` 등

---

## SizePolicy 매핑

| DSL `layout.size.<axis>.mode` | Compose Modifier |
|-------|----------------|
| `'fill'` (width) | `Modifier.fillMaxWidth()` |
| `'fill'` (height) | `Modifier.fillMaxHeight()` |
| `'hug'` | `Modifier.wrapContentSize()` (또는 width/height 별도) |
| `'fixed'` + `value: 48` | `Modifier.width(48.dp)` / `Modifier.height(48.dp)` |

---

## WDS 컴포넌트 사용

DS `textbutton` 컴포넌트 예시:
```kotlin
WDSTextButton(
    variant = WDSTextButton.Variant.Primary,
    size = WDSTextButton.Size.Medium,
    text = "구매하기",
    onClick = { }
)
```

- 컴포넌트는 `com.weverse.wds.component.*` 패키지.
- 토큰은 `WDSTheme` CompositionLocal을 통해 접근.
- `WDSTheme { }` 래퍼 안에서만 `WDSTheme.*` 접근 가능.

---

## 코드 구조 가이드

```kotlin
package com.weverse.sample

import androidx.compose.runtime.Composable
import com.weverse.wds.component.*
import com.weverse.wds.theme.WDSTheme

@Composable
fun <ComponentName>(
    // props
) {
    // DSL 구조 그대로 Compose 트리로
}

@Preview(showBackground = true)
@Composable
fun <ComponentName>Preview() {
    WDSTheme {
        <ComponentName>()
    }
}
```

- `@Preview` 반드시 추가.
- `WDSTheme {}` 래퍼 없이는 토큰에 접근 불가.
- 상태는 `remember { mutableStateOf(...) }` 또는 외부 주입 (`State<T>` hoisting).

---

## Lint 명령

```bash
ktlint "<generated-file-path>"
```

exit code 0 = PASS.  
`ktlint`가 없는 환경: "ktlint 없음 — lint SKIP" 기록 후 SKIP 처리.

---

## Build 명령

```bash
./gradlew assembleDebug
```

또는 모듈 지정:
```bash
./gradlew :<module-name>:assembleDebug
```

`gradlew`가 없거나 프로젝트 루트가 불명확한 경우: "Build 대상 불명 — Build SKIP" 기록 후 SKIP 처리.

---

## Screenshot 명령

Paparazzi (단위 테스트 기반 스크린샷):
```bash
./gradlew :<module>:recordPaparazziDebug
```

또는 에뮬레이터 직접 캡처:
```bash
adb shell screencap -p /sdcard/screenshot.png && adb pull /sdcard/screenshot.png "<output-dir>/screenshot_N.png"
```

환경 없는 경우: "스크린샷 환경 없음 — Screenshot SKIP" 기록 후 SKIP 처리.

---

## 주의사항

- `Color(0xFF...)` 직접 사용 금지. 반드시 `WDSTheme.color.*` 사용.
- `TextStyle(fontSize = ...)` 직접 구성 금지. 반드시 `WDSTheme.typography.*` 사용.
- Kotlin 최신 문법(1.9+) 사용 가능.
- Compose BOM 최신 버전 기준 (Material3 기반 WDS).
