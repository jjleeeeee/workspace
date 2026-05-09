---
name: platform-ios
description: "iOS SwiftUI/UIKit 플랫폼 구현 규칙. WDS 토큰·컴포넌트 매핑, 에셋 규칙, XcodeBuildMCP QA를 정의한다."
trigger: "swiftui, ios, xcodeproj, wds, swift, ios 플랫폼"
---

# iOS 플랫폼 규칙

`figma_impl_orchestration` 스킬의 iOS 플랫폼 sub-rule이다.  
`ios_ui_implementor` 에이전트가 이 규칙을 참조해 SwiftUI/UIKit 코드를 생성한다.

베이스: w2/slave `.cursor/skills/wds-figma/SKILL.md`

---

## WDS 토큰 규칙 (필수)

```swift
import WDS

// ✅ 색상
WDS.Color.systemColorButtonDefault
WDS.FixedColor.iconPrimary.asColor

// ✅ 사이즈
WDS.Size.paddingBox200
WDS.Size.spacingBox100

// ✅ 타이포그래피
WDS.Typography.body_m           // Figma: body-m/system-*
WDS.Typography.circular_title_xlg  // Figma: CircularXX TT, /circular-*
```

**금지**: 하드코딩 hex, `WeverseColors`, `WeverseTypography`, `WeverseFont`, `Color.green`, `Font.system(size:weight:)`

---

## 타이포그래피 패밀리 확인 (Figma → WDS)

Figma 폰트 패밀리 확인 후 선택:
- `font_family/body`, `/system-` → `WDS.Typography.*` (비-Circular)
- `font_family/title`, `CircularXX TT`, `/circular-` → `WDS.Typography.circular_*`

---

## WDS 색상 변수 경로 매핑

| Figma 변수 경로 | WDS API |
|---|---|
| `system/color/*` | `WDS.Color.*` |
| `system/fixed_color/*` | `WDS.FixedColor.*` |

---

## WDS 사이즈 토큰 (Figma → WDS.Size)

| Figma token | WDS.Size |
|---|---|
| `system/size/padding/box/0` | `WDS.Size.paddingBox0` |
| `system/size/padding/box/100` | `WDS.Size.paddingBox100` |
| `system/size/padding/box/200` | `WDS.Size.paddingBox200` |
| `system/size/padding/box/300` | `WDS.Size.paddingBox300` |
| `system/size/radius/box/100` | `WDS.Size.radiusBox100` |

---

## WDSComponent 매핑 (Figma → WDSComponent)

| Figma 컴포넌트 | WDSComponent |
|---|---|
| `[V2] Avatar` | `WDSComponent.Avatar` |
| `Button` / `Text Button` | `WDSComponent.Button` |
| `ListItem` | `WDSComponent.ListItem` |
| `Dialog` | `WDSComponent.DialogView` |
| `Toggle` | `WDSComponent.Toggle` |
| `Badge` | `WDSComponent.Badge` |
| `Divider` | `WDSComponent.Divider` |

매핑 없는 컴포넌트: custom view로 구현 + 사용자에게 명시

---

## 에셋 규칙

1. `Image(systemName:)` 사용 금지
2. Resources 모듈 우선 탐색: `Resources/Sources/Resources/Assets/<catalog>.xcassets/`
3. `_fill_` 아이콘 + Figma `selection color` 있으면 반드시 `.renderingMode(.template)` + `.foregroundStyle()` 적용

에셋 카탈로그:
| 카탈로그 | 용도 |
|---|---|
| `ListeningParty.xcassets` | Listening Party 관련 |
| `Profile.xcassets` | 프로필, 배지, 멤버십 |
| `WDM.xcassets` | Weverse DM 관련 |

---

## QA 도구

QA 자동화는 `ui_qa` 에이전트가 수행. 본 SKILL 은 iOS 플랫폼에서 사용 가능한 도구만 명시한다.

### Primary (XcodeBuildMCP)
- **빌드/실행**: `build_run_sim` (또는 `xcodebuild` + `xcrun simctl launch`)
- **샘플 진입**: 코드와 맞는 환경 변수 사용 (예: `SIMCTL_CHILD_AUTO_QA_DESTINATION=party`). `<Feature>Sample.xcodeproj` + scheme `<Feature>Sample` 우선
- **스크린샷**: `screenshot` (또는 `xcrun simctl io booted screenshot`)
- **UI 자동화** (`XCODEBUILDMCP_ENABLED_WORKFLOWS` 에 `ui-automation` 포함 시): `swipe` / `tap` / `screenshot` / `snapshot_ui` / `describe-ui`
- **시뮬레이터 로그**: `start_sim_log_cap`

### Fallback — AXe CLI (MCP 미연결 또는 `ui-automation` 비활성)
- `xcodebuildmcp` npm 패키지의 `bundled/axe` 바이너리 사용
- `npx xcodebuildmcp` 로 패키지 풀린 경로의 `bundled/axe` 로 swipe·screenshot·`describe-ui` 수행
- Primary 도구가 없다고 즉시 포기하지 않고 동등 시퀀스 검증을 끝까지 시도

### 상태 전이 증명
- 시퀀스 후 접근성 라벨 확인 (예: `Carousel, page 2 of 10`)
- `snapshot_ui` 또는 `describe-ui` 결과로 ViewHierarchy 확인

### Figma 비교
- Figma MCP `get_screenshot` / `get_design_context`
- 미연결 시 fileKey + nodeId + 시뮬레이터 PNG 경로 명시

---

## 아키텍처 원칙

- UIKit 기반, SwiftUI는 `UIHostingController`로 호스팅
- RTL 대응: `left/right` 대신 `leading/trailing`
- Safe Area 준수
- Dynamic Type 비사용 (Weverse 앱 정책)
- 다크모드 지원 (WDS 토큰이 자동 처리)
