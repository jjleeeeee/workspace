# 플러그인 개발 가이드

이 문서는 Weverse Claude Code Plugin Marketplace에 새 플러그인을 만드는 방법을 설명합니다.

## 플러그인이란?

Claude Code 플러그인은 다음 중 하나 이상을 제공합니다:

| 기능 | 설명 | 예시 |
|-----|------|------|
| **Slash Commands** | 사용자가 호출 가능한 명령어 | `/spec-search` 검색 명령 |
| **Skills** | 특정 상황에서 자동 활성화되는 문맥 정보 | iOS 개발 시 Apple 문서 자동 로드 |
| **Hooks** | 특정 이벤트 발생 시 실행되는 핸들러 | Tool 사용 전후 자동 검증 |
| **Agents** | 복잡한 작업을 수행하는 서브에이전트 | 자동 코드 리뷰 에이전트 |
| **MCP Servers** | 외부 서비스 통합 | Confluence 접근, Linear 이슈 조회 등 |

## 플러그인 구조

```
plugins/my-awesome-plugin/
├── .claude-plugin/
│   └── plugin.json              # 필수
├── commands/
│   ├── search.md                # (선택) Slash command
│   └── analyze.md
├── skills/
│   ├── context-loader/
│   │   └── SKILL.md             # (선택) Auto-activating skill
│   └── validation/
│       └── SKILL.md
├── hooks/
│   ├── hooks.json               # (선택) 이벤트 핸들러
│   ├── pretooluse.py
│   └── posttooluse.py
├── agents/
│   └── code-reviewer.md          # (선택) 서브에이전트
├── .mcp.json                    # (선택) MCP 서버
├── scripts/                      # (선택) 헬퍼 스크립트
│   └── handler.py
└── README.md                    # 플러그인 설명
```

## 빠른 시작: 템플릿 사용

### 1단계: 템플릿 복사

```bash
cd /Users/kent/workspace/claude-plugins
cp -r plugins/_template plugins/my-plugin
cd plugins/my-plugin
```

### 2단계: plugin.json 수정

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "플러그인 설명",
  "author": {
    "name": "당신의 이름",
    "email": "your@weversecompany.com"
  },
  "license": "MIT",
  "keywords": ["tag1", "tag2"]
}
```

### 3단계: 기능 추가

- `commands/example.md` → 자신의 명령으로 수정 또는 삭제
- `skills/example/SKILL.md` → 자신의 skill로 수정 또는 삭제
- `hooks/hooks.json` → 필요한 훅 이벤트만 남기거나 삭제
- 불필요한 디렉터리는 삭제

### 4단계: README.md 작성

```markdown
# My Plugin

플러그인의 목적과 기능을 설명합니다.

## 설치

\`\`\`
/claude install my-plugin@weverse-marketplace
\`\`\`

## 사용법

### /my-command
명령어 설명

\`\`\`
/my-command --option value
\`\`\`

## 예시

[실제 사용 예시]
```

## 각 기능 상세 설명

### 1. Slash Commands

#### 파일 위치
`plugins/my-plugin/commands/my-command.md`

#### 구조
```yaml
---
name: my-command
description: "명령어 설명 (선택)"
---

!python3 ${CLAUDE_PLUGIN_ROOT}/scripts/handler.py $ARGUMENTS
```

#### 예시: Confluence 검색 명령

```yaml
---
name: spec-search
description: "Confluence에서 스펙 검색"
---

!bash ${CLAUDE_PLUGIN_ROOT}/scripts/search.sh "$ARGUMENTS"
```

`scripts/search.sh`:
```bash
#!/bin/bash
# Confluence에서 검색하는 로직
curl -X GET "https://confluence.weverse.com/api/content/search?text=$1" \
  -H "Authorization: Bearer $CONFLUENCE_TOKEN" | jq '.results[]'
```

#### 사용
```
/spec-search 결제 환불
```

### 2. Auto-activating Skills

특정 상황에서 자동으로 활성화되는 문맥 정보입니다.

#### 파일 위치
`plugins/my-plugin/skills/skill-name/SKILL.md` (파일명은 반드시 `SKILL.md`)

#### 구조
```yaml
---
name: skill-name
trigger: "활성화 조건 (키워드 등)"
description: "Skill 설명 (선택)"
---

[Skill 콘텐츠]
```

#### 예시: iOS 개발 Skill

```yaml
---
name: ios-apple-docs
trigger: "iOS development Swift"
description: "iOS 개발 시 Apple 공식 문서 자동 로드"
---

## Apple Developer Documentation

당신이 iOS/Swift를 개발할 때 다음 리소스를 참고하세요:

- SwiftUI: https://developer.apple.com/documentation/swiftui
- UIKit: https://developer.apple.com/documentation/uikit
- [더 많은 문서...]
```

활성화 트리거:
```
사용자: "iOS 앱에서 메모리 누수를 어떻게 디버깅하지?"
→ iOS 관련 skill 자동 활성화 → Apple 문서 로드됨
```

### 3. Hooks (이벤트 핸들러)

특정 시점에 자동 실행되는 스크립트입니다.

#### 파일 위치
- `plugins/my-plugin/hooks/hooks.json` — 이벤트 설정
- `plugins/my-plugin/hooks/*.py` — 핸들러 스크립트

#### hooks.json 구조

```json
{
  "description": "플러그인 hooks 설명",
  "hooks": {
    "PreToolUse": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "python3 ${CLAUDE_PLUGIN_ROOT}/hooks/pretooluse.py",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
```

#### 지원 이벤트

| 이벤트 | 시점 | 용도 |
|--------|------|------|
| `PreToolUse` | Tool 사용 전 | 권한 검증, API 키 확인 |
| `PostToolUse` | Tool 사용 후 | 결과 검증, 로깅 |
| `SessionStart` | 세션 시작 | 초기 설정 |
| `SessionEnd` | 세션 종료 | 정리 작업 |
| `UserPromptSubmit` | 사용자 입력 후 | 입력 검증, 전처리 |
| `Stop` | Claude 중단 시 | 리소스 정리 |

#### 예시: API 키 검증 Hook

`hooks/hooks.json`:
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "python3 ${CLAUDE_PLUGIN_ROOT}/hooks/validate_api_key.py",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

`hooks/validate_api_key.py`:
```python
#!/usr/bin/env python3
import os
import sys

api_key = os.getenv("MY_API_KEY")
if not api_key:
    print("ERROR: MY_API_KEY 환경 변수가 설정되지 않았습니다", file=sys.stderr)
    sys.exit(1)

print("✓ API 키 검증 완료")
sys.exit(0)
```

### 4. Agents (서브에이전트)

복잡한 작업을 전담하는 전문 에이전트입니다.

#### 파일 위치
`plugins/my-plugin/agents/agent-name.md`

#### 구조
```yaml
---
name: agent-name
description: "에이전트 설명"
---

당신은 [역할]입니다.

당신의 목표:
- [목표 1]
- [목표 2]

다음 도구를 사용할 수 있습니다:
- [도구 1]
- [도구 2]

[상세 지시사항]
```

#### 예시: iOS PR 리뷰 에이전트

```yaml
---
name: ios-pr-reviewer
description: "iOS 코드 PR 자동 리뷰"
---

당신은 경험 많은 iOS 시니어 개발자입니다.

목표:
- 코드 품질 검토
- 메모리 누수, 성능 문제 검출
- Swift 컨벤션 준수 확인

검토 항목:
- ✓ 메모리 안전성 (ARC, weak/unowned)
- ✓ 성능 (불필요한 allocation)
- ✓ 가독성 및 유지보수성
- ✓ 테스트 커버리지

[상세 리뷰 지침...]
```

### 5. MCP Servers (외부 서비스 통합)

Confluence, Linear, GitHub 등 외부 서비스 접근을 제공합니다.

#### 파일 위치
`plugins/my-plugin/.mcp.json`

#### 구조
```json
{
  "server-name": {
    "command": "${CLAUDE_PLUGIN_ROOT}/servers/executable",
    "args": ["--config", "${CLAUDE_PLUGIN_ROOT}/config.json"],
    "env": {
      "API_KEY": "${API_KEY}",
      "BASE_URL": "https://api.example.com"
    }
  }
}
```

#### 예시: Confluence MCP 서버

`.mcp.json`:
```json
{
  "confluence": {
    "command": "python3",
    "args": ["${CLAUDE_PLUGIN_ROOT}/servers/confluence_server.py"],
    "env": {
      "CONFLUENCE_TOKEN": "${CONFLUENCE_TOKEN}",
      "CONFLUENCE_URL": "https://confluence.weverse.com"
    }
  }
}
```

## 개발 워크플로우

### 1단계: 로컬 개발

```bash
# 플러그인 작업
cd plugins/my-plugin
# → 파일 수정

# 로컬에서 테스트
/claude install <path>/plugins/my-plugin
```

### 2단계: 테스트

```bash
# 플러그인 동작 확인
/claude plugins list
/my-command test
```

필요시 삭제 후 다시 설치:
```bash
/claude uninstall my-plugin@weverse-marketplace
rm -rf ~/.claude/plugins/cache/*/my-plugin
```

### 3단계: 문서화

- README.md 작성 (사용 방법, 예시, 문제 해결)
- 주석 추가 (복잡한 스크립트에)
- 환경 변수 문서화

### 4단계: PR 제출

```bash
git checkout -b plugins/my-plugin
git add plugins/my-plugin
git commit -m "feat: add my-plugin"
git push origin plugins/my-plugin
```

GitHub에서 PR 생성

### 5단계: marketplace.json 업데이트

PR 승인 후 `marketplace.json`에 플러그인 추가:

```json
{
  "plugins": [
    {
      "name": "my-plugin",
      "description": "플러그인 설명",
      "version": "1.0.0",
      "source": "./plugins/my-plugin"
    }
  ]
}
```

## 모범 사례

### ✅ 좋은 플러그인

```
✓ 단일 책임 원칙: 하나의 명확한 목적
✓ 완전한 문서: README, 사용 예시, 문제 해결
✓ 에러 처리: 스크립트가 실패해도 Claude 중단 없음
✓ 환경 격리: 다른 플러그인과 충돌 없음
✓ 테스트 가능: 수동/자동 테스트 가능
```

### ❌ 피해야 할 것

```
✗ 광범위한 기능: "모든 것을 할 수 있는" 플러그인
✗ 문서 부족: README 없음, 사용법 불명확
✗ 에러 무시: 스크립트 에러가 무시됨
✗ 전역 환경 오염: 다른 플러그인 영향
✗ 하드코딩된 경로: ${CLAUDE_PLUGIN_ROOT} 사용 안 함
```

## 문제 해결

### 커맨드가 작동하지 않음

1. 파일명 확인: 반드시 `commands/<name>.md`
2. 스크립트 권한: `chmod +x scripts/*.py`
3. 경로 확인: `${CLAUDE_PLUGIN_ROOT}` 사용했는지

### Skill이 활성화되지 않음

1. 파일명: 반드시 `SKILL.md` (대문자)
2. trigger 필드: 정확히 일치하는지 확인
3. 디렉터리 구조: `skills/<name>/SKILL.md`

### Hook이 실행되지 않음

1. `hooks.json` 파일 존재 확인
2. JSON 형식 검증
3. 스크립트 실행 권한 확인

## 참고 자료

- [시작하기](getting-started.md) — 플러그인 설치/사용 가이드
- [CLAUDE.md](../CLAUDE.md) — Claude Code 개발 컨텍스트
- [기여 가이드](../CONTRIBUTING.md) — 플러그인 제출 방법
