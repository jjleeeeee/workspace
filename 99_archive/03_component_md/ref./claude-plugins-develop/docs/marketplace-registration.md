# Marketplace 등록 가이드

이 문서는 `~/.claude/settings.json`에 Weverse Marketplace를 등록하는 모든 방법을 설명합니다.

## 설정 파일 위치

### 시스템별 경로

| OS | 경로 |
|-----|------|
| **macOS / Linux** | `~/.claude/settings.json` |
| **Windows** | `%APPDATA%\claude\settings.json` |

## 방법 1: 자동 설정 (가장 쉬움)

Claude Code의 자동 설정 도구를 사용합니다:

```bash
claude configure
```

프롬프트에 따라 진행하면 자동으로 marketplace가 추가됩니다.

## 방법 2: 수동 편집 (권장)

텍스트 에디터로 직접 편집합니다.

### 단계별 가이드

#### 1단계: 파일 열기

```bash
# macOS/Linux - VS Code
code ~/.claude/settings.json

# 또는 nano
nano ~/.claude/settings.json

# 또는 vim
vim ~/.claude/settings.json
```

#### 2단계: 설정 추가

파일의 내용을 다음과 같이 구성합니다:

**파일이 비어있거나 없으면:**

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

**기존 설정이 있으면:**

`extraKnownMarketplaces` 섹션에 추가합니다:

```json
{
  "model": "haiku",
  "enabledPlugins": {
    "some-plugin@other-marketplace": true
  },
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

#### 3단계: 저장

- VS Code: `Ctrl+S` (또는 `Cmd+S`)
- Nano: `Ctrl+O` → `Enter` → `Ctrl+X`
- Vim: `:wq`

#### 4단계: Claude Code 재시작

설정 변경을 적용하려면 Claude Code를 재시작합니다:

```bash
# 현재 세션 종료 후 다시 시작
exit
claude
```

## 설정 구조 설명

### marketplace 정의 블록

```json
{
  "weverse-marketplace": {
    "source": {
      "source": "github",
      "repo": "weversecompany/claude-plugins"
    }
  }
}
```

| 필드 | 의미 | 예시 |
|-----|------|------|
| `weverse-marketplace` | 마켓플레이스 이름 | 고유 식별자 |
| `source.source` | 소스 타입 | `"github"` 또는 `"git"` |
| `source.repo` | GitHub 저장소 | `"owner/repo"` 형식 |

### 다른 마켓플레이스도 함께 사용

여러 마켓플레이스를 등록할 수 있습니다:

```json
{
  "extraKnownMarketplaces": {
    "weverse-marketplace": {
      "source": {
        "source": "github",
        "repo": "weversecompany/claude-plugins"
      }
    },
    "official-plugins": {
      "source": {
        "source": "github",
        "repo": "anthropics/claude-code"
      }
    },
    "custom-repo": {
      "source": {
        "source": "git",
        "url": "https://github.com/myorg/custom-plugins.git"
      }
    }
  }
}
```

## Git URL로 직접 등록 (고급)

`"github"` 대신 `"git"`을 사용하여 모든 Git URL 지원:

```json
{
  "weverse-marketplace": {
    "source": {
      "source": "git",
      "url": "https://github.com/weversecompany/claude-plugins.git"
    }
  }
}
```

또는 SSH:

```json
{
  "weverse-marketplace": {
    "source": {
      "source": "git",
      "url": "git@github.com:weversecompany/claude-plugins.git"
    }
  }
}
```

## 프로젝트별 설정 (선택)

특정 프로젝트에서만 플러그인을 사용하려면 프로젝트 루트에 `.claude/settings.json` 생성:

```bash
cd /path/to/your/project
mkdir -p .claude
cat > .claude/settings.json << 'EOF'
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
EOF
```

이 프로젝트에서 작업할 때만 weverse-marketplace 플러그인이 사용됩니다.

### .gitignore 추가

프로젝트 `.gitignore`에 추가 (선택):

```
# Claude Code 설정 (개인별)
.claude/settings.json
.claude/settings.local.json
```

## 설정 검증

### 1. JSON 형식 확인

파일이 유효한 JSON인지 확인합니다:

- VS Code: 자동으로 강조 표시
- JSON 검증 사이트: https://jsonlint.com/

### 2. Marketplace 인식 확인

설정 후 다음을 실행합니다:

```bash
claude plugins list --all
```

출력:

```
Available marketplaces:
  ✓ weverse-marketplace (github:weversecompany/claude-plugins)
  ✓ claude-code-plugins (github:anthropics/claude-code)
  ...
```

### 3. 플러그인 설치 테스트

마켓플레이스가 정상 작동하는지 테스트합니다:

```bash
# 마켓플레이스 플러그인 나열
claude plugins available weverse-marketplace

# 플러그인 설치
/claude install <plugin-name>@weverse-marketplace
```

## 문제 해결

### "Marketplace를 찾을 수 없습니다"

**원인**: 설정이 없거나 형식이 잘못됨

**해결**:
1. `settings.json` 파일 존재 확인: `ls -la ~/.claude/settings.json`
2. JSON 형식 검증: 전체 파일을 JSON 검증기로 확인
3. 오타 확인:
   - `extraKnownMarketplaces` (정확한 철자)
   - `weverse-marketplace` (대소문자 확인)
   - `weversecompany` (조직명 확인)

### "인증 실패 (Authentication failed)"

**원인**: GitHub 인증 문제

**해결**:
1. GitHub 토큰 생성: https://github.com/settings/tokens
2. SSH 키 설정 (SSH 사용 시)
3. `git credential` 캐시 확인:
   ```bash
   git credential reject
   ```

### JSON 형식 에러

**원인**: JSON 문법 오류 (쉼표, 괄호 등)

**해결**:
```bash
# JSON 파일 검증 (macOS)
plutil -lint ~/.claude/settings.json

# 또는 Python 사용
python3 -m json.tool ~/.claude/settings.json
```

에러 메시지에 줄 번호가 표시되므로 해당 부분을 수정합니다.

## 완전한 설정 예시

```json
{
  "model": "haiku",
  "suppressWarnings": [],
  "enabledPlugins": {},
  "extraKnownMarketplaces": {
    "weverse-marketplace": {
      "source": {
        "source": "github",
        "repo": "weversecompany/claude-plugins"
      }
    },
    "official-plugins": {
      "source": {
        "source": "github",
        "repo": "anthropics/claude-code"
      }
    }
  },
  "customExtraKnownMarketplaces": {}
}
```

## 자동 업데이트 (선택)

플러그인을 자동으로 최신 버전으로 유지:

```bash
# 주기적으로 실행 (cron job 등)
claude plugins sync
```

## 다음 단계

- [시작하기](getting-started.md) — 플러그인 설치 및 사용
- [플러그인 개발](plugin-development.md) — 새 플러그인 만들기
