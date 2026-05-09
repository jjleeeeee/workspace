# 시작하기

Weverse Claude Code Plugin Marketplace를 처음 사용하는 팀원을 위한 가이드입니다.

## 전제조건

- Claude Code CLI가 설치되어 있어야 합니다
- Git이 설치되어 있어야 합니다
- 회사 GitHub 계정이 필요합니다 (weversecompany 조직)

### Claude Code 설치 확인

터미널에서 다음을 실행합니다:

```bash
claude --version
```

설치되지 않았다면 [Claude Code 공식 문서](https://claude.com/claude-code)에서 설치합니다.

## 1단계: Marketplace 등록

### 자동 등록 (추천)

다음 명령을 실행하면 자동으로 설정됩니다:

```bash
claude configure
```

또는 직접 파일을 편집합니다.

### 수동 등록

`~/.claude/settings.json` 파일을 엽니다:

```bash
# macOS/Linux
nano ~/.claude/settings.json

# 또는 선호하는 에디터
code ~/.claude/settings.json
```

다음 JSON 블록을 추가합니다 (기존 `extraKnownMarketplaces` 섹션에 병합):

```json
{
  "model": "haiku",
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

### 설정 확인

다음 명령으로 마켓플레이스가 인식되었는지 확인합니다:

```bash
claude plugins list --all
```

출력에 `weverse-marketplace`가 표시되면 성공입니다.

## 2단계: 플러그인 설치

### 설치 방법

Claude Code에서 다음 명령을 실행합니다:

```
/claude install <plugin-name>@weverse-marketplace
```

예를 들어, 첫 번째 플러그인이 `spec-search`라면:

```
/claude install spec-search@weverse-marketplace
```

### 설치 확인

설치된 플러그인 목록을 확인합니다:

```
/claude plugins list
```

또는 로컬 파일 시스템에서:

```bash
ls ~/.claude/plugins/cache/weverse-marketplace/
```

## 3단계: 플러그인 사용하기

각 플러그인은 서로 다른 기능을 제공합니다.

### Slash Commands 사용

플러그인이 제공하는 slash command를 사용합니다:

```
/plugin-command <arguments>
```

설치된 모든 명령을 보려면:

```
/claude help commands
```

### Auto-activating Skills

특정 상황에서 플러그인의 skill이 자동으로 활성화됩니다. 별도의 조작이 필요 없습니다.

예) 특정 키워드로 시작된 대화에서 자동으로 관련 skill이 로드됩니다.

## 플러그인 제거

플러그인을 제거하려면:

```
/claude uninstall <plugin-name>@weverse-marketplace
```

또는 설정에서 수동으로 제거:

```bash
# 로컬 캐시 삭제
rm -rf ~/.claude/plugins/cache/weverse-marketplace/<plugin-name>

# installed_plugins.json에서 항목 삭제
nano ~/.claude/plugins/installed_plugins.json
```

## 플러그인별 사용 가이드

각 플러그인은 자신의 README 파일에 상세한 사용법을 제공합니다.

- 플러그인 목록: [README.md](../README.md)
- 개별 플러그인 설명: `plugins/<plugin-name>/README.md`

## 문제 해결

### "Marketplace를 찾을 수 없습니다" 에러

**증상**: `/claude install` 실행 시 마켓플레이스를 찾을 수 없다는 메시지

**해결 방법**:
1. `~/.claude/settings.json`에 `weverse-marketplace` 설정이 있는지 확인
2. JSON 형식이 올바른지 확인 (VS Code 등에서 Validate JSON 사용)
3. Claude Code를 재시작합니다: `exit` 후 다시 시작

### "플러그인이 설치되지 않음"

**증상**: 설치 명령이 완료되지만 플러그인이 작동하지 않음

**해결 방법**:
1. `/claude plugins list`에서 플러그인이 나타나는지 확인
2. `.claude/plugins/cache/` 디렉터리 권한 확인
3. 인터넷 연결 확인 (GitHub 접속 필요)

### "권한 거부 (Permission denied)" 에러

**증상**: Git 또는 파일 접근 에러

**해결 방법**:
1. SSH 키 또는 GitHub 토큰 설정 확인
2. 파일 권한 확인: `ls -la ~/.claude/`
3. 필요시 권한 수정: `chmod 700 ~/.claude/`

## 팁

- 💡 플러그인 업데이트를 자동으로 확인하려면 `claude plugins sync` 실행
- 💡 특정 프로젝트에만 플러그인을 사용하려면 프로젝트 루트의 `.claude/settings.json`에 설정
- 💡 플러그인 개발에 관심이 있다면 [플러그인 개발 가이드](plugin-development.md) 참고

## 다음 단계

- [플러그인 개발](plugin-development.md) — 새 플러그인 만들기
- [기여 가이드](../CONTRIBUTING.md) — 플러그인 기여 방법
- [상세 등록 가이드](marketplace-registration.md) — 마켓플레이스 등록 방법 심화

## 지원

질문이 있으신가요?

- **GitHub Issues**: [문제 신고](https://github.com/weversecompany/claude-plugins/issues)
- **GitHub Discussions**: [질문하기](https://github.com/weversecompany/claude-plugins/discussions)
- **Slack**: `#claude-code` 채널
