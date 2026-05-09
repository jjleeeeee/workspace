# SwiftUI 특화 규칙

iOS 플랫폼 코드 생성 시 이 파일의 모든 규칙을 SKILL.md 공통 규칙과 함께 적용한다.

---

## DS 토큰 → SwiftUI API 매핑

### Color (TokenRef)

| DSL TokenRef 형식 | SwiftUI 표현 |
|--------------|-------------|
| `'token:system.color.*'` | `WDS.Color.<kebab-to-camel>.asColor` |
| `'token:system.color.button.default'` | `WDS.Color.systemColorButtonDefault.asColor` |
| `'token:system.color.brand.primary'` | `WDS.Color.systemColorBrandPrimary.asColor` |
| `'hardcoded:rgba(255,255,255,0)'` | `Color(red: 1, green: 1, blue: 1, opacity: 0)` + `// FIXME: hardcoded` |
| `'unresolved:#484848'` | `Color(hex: "#484848")` + `// TODO: 토큰 매칭 필요` |

- `asColor`: `WDSBase` 모듈의 Color extension. `Color` 타입 반환.
- dotted-path를 camelCase로 변환: `system.color.button.default` → `systemColorButtonDefault`.

### Typography

| DSL TokenRef | SwiftUI 표현 |
|--------------|-------------|
| `'textStyle:body-lg/system-700'` | `.wdsTextStyle(textStyle: .bodyLgSystem700)` |
| `'token:typography.default.base.lineheight.text-lineheight-100'` | `.wdsTextStyle(textStyle: .typographyDefaultBaseLineheightTextLineheight100)` 또는 매핑 테이블 사용 |

- `wdsTextStyle`: `WDSBase` 모듈의 `View` extension modifier.
- font size·weight·line height를 한 번에 적용.
- `textStyle:` 형식은 합성 스타일 식별자이므로 매핑 테이블이 있으면 우선 사용.

### Size / Spacing

| DSL TokenRef | SwiftUI 표현 |
|--------------|-------------|
| `'token:system.size.*'` | `WDS.Size.<camelCase>` |
| `'token:system.size.padding.box.300'` | `WDS.Size.systemSizePaddingBox300` |
| `'token:system.size.button-height.large'` | `WDS.Size.systemSizeButtonHeightLarge` |

### Shadow / Effects

`Style.effects` 배열의 `{ type: 'shadow', ... }` →
- `color`가 TokenRef면 토큰 매핑, 그 외는 raw 값 사용
- `.shadow(color:radius:x:y:)` modifier 또는 `.wdsShadow(.<camelCase>)` 매핑 테이블 우선

---

## 레이아웃 매핑 (Layout v2)

| `Layout.kind` + `axis` | SwiftUI 컨테이너 |
|-------------|----------------|
| `kind='stack'`, `axis='horizontal'` | `HStack(alignment:, spacing:)` |
| `kind='stack'`, `axis='vertical'` | `VStack(alignment:, spacing:)` |
| `kind='box'` | 단일 자식 컨테이너 (Group 또는 wrapping View) |
| `kind='overlay'` | `ZStack` |
| `kind='absolute'` | `ZStack` + `.offset(x:y:)` 자식 절대 위치 |
| `kind='scroll'` | `ScrollView { ... }` |

- `layout.spacing` → `spacing:` 파라미터
- `layout.padding.{top,right,bottom,left}` → `.padding(EdgeInsets(top:leading:bottom:trailing:))`
- `layout.alignment.main` → 주축 정렬, `.cross` → 교차축 정렬

---

## SizePolicy 매핑

| DSL `layout.size.<axis>.mode` | SwiftUI |
|-------|---------|
| `'fill'` (width) | `.frame(maxWidth: .infinity)` |
| `'fill'` (height) | `.frame(maxHeight: .infinity)` |
| `'hug'` | `.fixedSize(horizontal:/vertical:)` |
| `'fixed'` + `value: 48` | `.frame(width: 48)` / `.frame(height: 48)` |

---

## WDS 컴포넌트 사용

DS `textbutton` 컴포넌트 예시:
```swift
WDSComponent.TextButton(
    variant: .primary,
    size: .medium,
    title: "구매하기"
)
```

- 컴포넌트는 `WDSComponent` 모듈에서 가져온다.
- `WDSBase`: 토큰(Color, Size, Typography, Shadow) 제공.
- `WDS`: umbrella module (WDSBase + WDSComponent).

---

## 코드 구조 가이드

```swift
import WDS

struct <ComponentName>: View {
    // Props
    
    var body: some View {
        // DSL 구조 그대로 SwiftUI View 트리로
    }
}

#Preview {
    <ComponentName>()
}
```

- `#Preview` 반드시 추가 (Xcode Canvas 확인용).
- `@State`/`@Binding`은 인터랙션이 있는 컴포넌트에만 사용.
- 외부 주입이 필요한 상태는 `@Binding` 파라미터로.

---

## Lint 명령

```bash
swiftlint lint --strict "<generated-file-path>"
```

exit code 0 = PASS.  
`swiftlint`가 없는 환경: "swiftlint 없음 — lint SKIP" 기록 후 SKIP 처리.

---

## Build 명령

XcodeBuildMCP가 사용 가능한 경우:
```
mcp__XcodeBuildMCP__build_sim (project/scheme 기본값 사용)
```

XcodeBuildMCP 없는 경우:
```bash
xcodebuild -scheme <scheme> -destination 'platform=iOS Simulator,name=iPhone 15' build
```

빌드 대상 프로젝트/scheme이 불명확한 경우: "build 대상 불명 — Build SKIP" 기록 후 SKIP 처리.

---

## Screenshot 명령

XcodeBuildMCP `screenshot` 도구 사용:
```
mcp__XcodeBuildMCP__screenshot(simulator_id: <sim-id>)
```

또는 시뮬레이터 직접:
```bash
xcrun simctl io <DEVICE_UUID> screenshot "<output-dir>/screenshot_N.png"
```

시뮬레이터가 없는 환경: "시뮬레이터 없음 — Screenshot SKIP" 기록 후 SKIP 처리.

---

## 주의사항

- `Color(hex:)` 같은 raw hex 생성자 사용 금지. 반드시 `WDS.Color.*` 사용.
- `Font.custom(...)` 직접 사용 금지. 반드시 `.wdsTextStyle()` 사용.
- DSL의 `boundVariables` figmaKey 값은 코드에 삽입하지 않는다. 토큰 경로만 사용.
- Xcode 16+ 기준. `@Observable` 등 최신 Swift 문법 사용 가능.
