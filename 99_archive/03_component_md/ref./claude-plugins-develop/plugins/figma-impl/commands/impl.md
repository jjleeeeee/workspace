---
name: impl
description: "Figma URL을 받아 멀티 플랫폼 UI를 생성합니다. T0~T6 오케스트레이션 하네스를 실행합니다. 예: /impl https://figma.com/design/... --platform=web"
---

# UI 생성 하네스 실행

`$ARGUMENTS`를 파싱해 `figma_impl_orchestration` 스킬의 T0~T6 워크플로우를 시작한다.

## 인자 파싱

```
/impl <figma-url> [--platform=web|ios|aos] [--feature=<name>] [--skip-tokens]
```

| 인자 | 필수 | 설명 |
|------|------|------|
| `<figma-url>` | ✅ | Figma 디자인 URL (node-id 포함 권장) |
| `--platform` | 선택 | `web`, `ios`, `aos` 중 하나. 미지정 시 T0에서 질문 |
| `--feature` | 선택 | 기능명. 미지정 시 Figma 파일명에서 추출 |
| `--skip-tokens` | 선택 | 토큰 사전 준비 건너뜀 (이미 설정된 경우) |

## 실행 흐름

`figma_impl_orchestration` SKILL을 활성화하고 아래 handoff note를 전달한다:

```
[UI Generator Handoff]
- Figma URL: <parsed-url>
- Platform: <parsed-platform | "미지정 — T0에서 확인">
- Feature: <parsed-feature | "Figma 파일명에서 추출">
- Skip tokens: <true|false>

T0~T6 오케스트레이션 시작. figma_impl_orchestration SKILL 규칙을 따른다.
```

플랫폼이 지정되지 않은 경우, T0에서 사용자에게 한 번만 짧게 확인:
> "어떤 플랫폼으로 생성할까요? (web / ios / aos)"
