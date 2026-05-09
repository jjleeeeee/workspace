# Claude Code Plugin Marketplace 개발 가이드

이 문서는 Claude Code가 이 리파지토리에서 플러그인을 개발할 때 참고하는 컨텍스트입니다.

## 리파지토리 목적

이것은 **Weverse Company 사내 공용 Claude Code 플러그인 마켓플레이스**입니다.

### 역할
- 플러그인들을 중앙에서 관리 및 버전 관리
- 팀원들이 `/claude install plugin-name@weverse-marketplace`로 설치 가능
- 공용 개발 도구/자동화 기능 제공

## 플러그인 구조

모든 플러그인은 다음 구조를 따릅니다:

```
plugins/
└── plugin-name/
    ├── .claude-plugin/
    │   └── plugin.json              # 필수: 메타데이터
    ├── commands/
    │   └── *.md                     # Slash commands (선택)
    ├── skills/
    │   └── skill-name/
    │       └── SKILL.md             # Auto-activating skills (선택)
    ├── hooks/
    │   └── hooks.json               # 이벤트 핸들러 (선택)
    ├── agents/
    │   └── agent-name.md            # 서브에이전트 (선택)
    ├── .mcp.json                    # MCP 서버 정의 (선택)
    └── README.md                    # 플러그인 설명
```

## 마켓플레이스 메타데이터

`.claude-plugin/marketplace.json`는 마켓플레이스 전체를 선언합니다:

```json
{
  "name": "weverse-marketplace",
  "version": "1.0.0",
  "owner": { "name": "...", "email": "..." },
  "description": "...",
  "plugins": [
    {
      "name": "plugin-name",
      "description": "...",
      "version": "1.0.0",
      "source": "./plugins/plugin-name"
    }
  ]
}
```

새 플러그인 추가 시 `plugins` 배열에 항목을 추가합니다.

## 개별 플러그인 메타데이터

각 플러그인의 `.claude-plugin/plugin.json`:

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "플러그인 설명",
  "author": {
    "name": "개발자명",
    "email": "developer@weversecompany.com"
  },
  "license": "MIT",
  "homepage": "https://github.com/weversecompany/claude-plugins/tree/main/plugins/my-plugin",
  "keywords": ["tag1", "tag2"]
}
```

## 플러그인이 제공할 수 있는 기능

### 1. Slash Commands (`plugins/<name>/commands/*.md`)

사용자가 명시적으로 호출하는 명령어:

```yaml
---
name: command-name
description: "명령어 설명"
---

!python3 ${CLAUDE_PLUGIN_ROOT}/scripts/handler.py $ARGUMENTS
```

### 2. Auto-activating Skills (`plugins/<name>/skills/<skill>/SKILL.md`)

특정 상황에서 자동으로 활성화되는 문맥 정보:

```yaml
---
name: skill-name
trigger: "이 내용이 사용자 메시지에 포함되면 자동 활성화"
---

[스킬 콘텐츠]
```

### 3. Hooks (`plugins/<name>/hooks/hooks.json`)

특정 이벤트 발생 시 실행되는 핸들러:

```json
{
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

지원 이벤트: `PreToolUse`, `PostToolUse`, `Stop`, `SessionStart`, `SessionEnd`, `UserPromptSubmit`

### 4. Agents (`plugins/<name>/agents/<agent>.md`)

복잡한 작업을 수행하는 서브에이전트 정의.

### 5. MCP Servers (`plugins/<name>/.mcp.json`)

외부 서비스와의 통합 (Confluence, Linear, GitHub 등):

```json
{
  "server-name": {
    "command": "${CLAUDE_PLUGIN_ROOT}/servers/executable",
    "args": [],
    "env": {}
  }
}
```

## 개발 규칙

### 파일 명명
- Commands: `kebab-case.md` (예: `my-command.md`)
- Skills: 디렉터리명은 `snake_case`, 파일명은 항상 `SKILL.md`
- Agents: `snake_case.md`
- Hooks: 반드시 `hooks.json`
- Python 스크립트: `snake_case.py`

### 환경 변수
- `${CLAUDE_PLUGIN_ROOT}` — 플러그인 루트 디렉터리 (항상 사용 가능)
- `${ARGUMENTS}` — Commands에 전달된 사용자 인자

### 버전 관리
- Semantic Versioning (`major.minor.patch`)
- `plugin.json`에 `version` 필드 설정
- `marketplace.json`에도 같은 버전 기입

### 문서화
- 각 플러그인마다 `README.md` 필수
- 복잡한 기능은 `docs/` 서브디렉터리에 추가 문서 작성

## 기여 흐름

1. Feature branch 생성: `git checkout -b plugins/my-plugin`
2. 플러그인 개발
3. PR 제출 → 리뷰 → Merge
4. `marketplace.json` 업데이트 (자동화 또는 수동)

## 템플릿 활용

새 플러그인을 시작할 때:

1. `plugins/_template/` 전체 복사
2. 디렉터리명을 플러그인명으로 변경
3. `plugin.json` 수정
4. `commands/example.md`, `skills/example/SKILL.md` 등을 자신의 기능으로 수정
5. 불필요한 파일 제거

## 좋은 플러그인의 특징

- ✅ 명확한 목적 (한 가지 문제를 잘 해결)
- ✅ 완전한 문서 (README, 사용 예시)
- ✅ 에러 핸들링 (스크립트가 실패해도 안정적)
- ✅ 환경 격리 (플러그인 간 충돌 없음)
- ✅ 테스트 가능 (수동 또는 자동 테스트)

## 문제 해결

### 플러그인이 설치되지 않음
- `marketplace.json`의 `plugins` 배열에 항목이 있는지 확인
- `plugin.json` 파일이 존재하는지 확인
- Git 변경사항이 Push되었는지 확인

### Commands가 작동하지 않음
- `${CLAUDE_PLUGIN_ROOT}` 경로가 올바른지 확인
- 스크립트에 실행 권한이 있는지 확인
- 스크립트가 올바른 경로에 있는지 확인

### Skills가 활성화되지 않음
- `SKILL.md` 파일명 대소문자 확인
- `trigger` 필드가 정확히 일치하는지 확인
