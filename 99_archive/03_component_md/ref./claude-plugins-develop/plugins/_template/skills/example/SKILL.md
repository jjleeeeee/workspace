---
name: example-skill
trigger: "template example placeholder"
description: "예시 skill입니다. 실제 플러그인에서는 이 파일을 수정하거나 삭제하세요."
---

# 예시 Skill

이 파일은 auto-activating skill의 예시입니다.

## Skill의 역할

Skill은 특정 상황(trigger)에서 자동으로 활성화되어 Claude에게 추가 문맥 정보를 제공합니다.

## 구조

```yaml
---
name: skill-name
trigger: "활성화 조건 (키워드 등)"
description: "Skill 설명 (선택)"
---

[Skill 콘텐츠]
```

## 활성화 조건 (trigger)

사용자 메시지에 `trigger` 필드의 내용이 포함되면 자동으로 활성화됩니다.

### 예시

**trigger:** `iOS development Swift`

사용자가 이렇게 입력하면 활성화됨:
- "iOS 앱에서 메모리 누수 문제를 Swift로 해결하는 방법?"
- "Swift를 사용한 iOS 개발 best practices"
- "iOS와 Swift 성능 최적화"

## Skill 콘텐츠

활성화되었을 때 Claude에게 전달할 문맥 정보를 마크다운으로 작성합니다.

### 좋은 예시

```yaml
---
name: ios-apple-docs
trigger: "iOS development Swift"
description: "iOS 개발 시 Apple 공식 문서 자동 로드"
---

## Apple Developer Documentation

iOS/Swift 개발 시 다음 공식 문서를 참고하세요:

### Core Documentation
- **SwiftUI**: https://developer.apple.com/documentation/swiftui
- **UIKit**: https://developer.apple.com/documentation/uikit
- **Swift**: https://www.swift.org/documentation/

### Common Topics
- Memory Management: https://developer.apple.com/documentation/foundation/memory_management
- Concurrency: https://developer.apple.com/documentation/swift/concurrency
- Performance: https://developer.apple.com/documentation/performancetools

### WWDC Videos
- 2024 WWDC: https://developer.apple.com/wwdc24/
```

## 실제 플러그인 만들기

1. 이 파일을 삭제하세요
2. 다른 skill이 필요하면 새 디렉터리를 만드세요:
   ```
   skills/
   └── my-skill/
       └── SKILL.md    ← 반드시 이 이름
   ```
3. `trigger`, `name`, 콘텐츠를 설정하세요

## 파일 명명 규칙

- 디렉터리명: `snake_case` (예: `ios_docs`, `performance_tips`)
- 파일명: 반드시 `SKILL.md` (대문자, 정확한 철자)

## 주의사항

- ⚠️ 파일명이 `SKILL.md`가 아니면 인식되지 않습니다
- ⚠️ trigger는 정확히 일치해야 활성화됩니다 (부분 일치 가능)
- ⚠️ 콘텐츠는 마크다운 형식이어야 합니다

더 자세한 정보는 [플러그인 개발 가이드](../../docs/plugin-development.md#2-auto-activating-skills)를 참고하세요.
