# Weverse Claude Code Plugin Marketplace

Weverse Company 사내 공용 Claude Code 플러그인 마켓플레이스입니다.

## 소개

이 리파지토리는 Claude Code 플러그인들을 중앙에서 관리하고 배포합니다. 팀원들은 간단한 설정으로 사내 플러그인들을 자동으로 설치하고 사용할 수 있습니다.

## 빠른 시작

### 1단계: Marketplace 등록

`~/.claude/settings.json`에 다음 설정을 추가합니다:

```json
{
  "extraKnownMarketplaces": {
    "weverse-marketplace": {
      "source": {
        "source": "github",
        "repo": "weversecompany/claude-plugins"
      }
    }
  }
}
```

더 자세한 방법은 [Marketplace 등록](docs/marketplace-registration.md) 문서를 참고하세요.

### 2단계: 플러그인 설치

Claude Code에서 다음 명령으로 플러그인을 설치합니다:

```
/claude install <plugin-name>@weverse-marketplace
```

### 3단계: 설치된 플러그인 확인

```
/claude plugins list
```

## 사용 가능한 플러그인

현재 마켓플레이스에 등록된 플러그인:

| 플러그인 | 버전 | 설명 | 설치 명령 |
|---------|------|------|---------|
| **persona** | 3.5.0 | 사용자 인터뷰용 페르소나 에이전트 (윤아, 차시온) | `/claude install persona@weverse-marketplace` |


## 문서

- **[시작하기](docs/getting-started.md)** — 설치 및 기본 사용법
- **[플러그인 개발](docs/plugin-development.md)** — 새 플러그인 만드는 방법
- **[Marketplace 등록](docs/marketplace-registration.md)** — 상세 설정 가이드
- **[기여 가이드](CONTRIBUTING.md)** — 플러그인 기여 방법

## 플러그인 구조

모든 플러그인은 다음 구조를 따릅니다:

```
plugin-name/
├── .claude-plugin/
│   └── plugin.json          # 필수: 플러그인 메타데이터
├── commands/                 # (선택) Slash commands
├── skills/                   # (선택) Auto-activating skills
├── hooks/                    # (선택) 이벤트 핸들러
├── agents/                   # (선택) 서브에이전트 정의
├── .mcp.json                # (선택) MCP 서버 정의
└── README.md
```

## 새 플러그인 만들기

1. `plugins/_template/` 디렉터리를 복사합니다
2. 플러그인 이름으로 디렉터리를 생성합니다
3. `plugin.json`을 수정하여 플러그인 정보를 입력합니다
4. 필요한 기능(commands, skills, hooks 등)을 추가합니다
5. PR을 제출합니다 (자세한 방법은 [CONTRIBUTING.md](CONTRIBUTING.md) 참고)

## 주요 기능

Claude Code 플러그인으로 제공할 수 있는 기능들:

### Slash Commands (`/command`)
사용자가 직접 호출 가능한 명령어

### Auto-activating Skills
특정 상황에서 자동으로 활성화되는 문맥 정보

### Hooks
Pre/Post tool use, 세션 시작/종료 등 각종 이벤트 처리

### Agents
복잡한 작업을 수행하는 서브에이전트

### MCP Servers
외부 서비스와의 통합 (Confluence, Linear, GitHub 등)

## 지원

질문이나 문제가 있으시면:

1. [GitHub Issues](https://github.com/weversecompany/claude-plugins/issues)에서 문제를 신고하세요
2. [Discussions](https://github.com/weversecompany/claude-plugins/discussions)에서 질문하세요

## 라이센스

이 리파지토리와 모든 플러그인들은 MIT 라이센스 아래 배포됩니다.

## 변경 이력

자세한 변경 이력은 [CHANGELOG.md](CHANGELOG.md)를 참고하세요.
