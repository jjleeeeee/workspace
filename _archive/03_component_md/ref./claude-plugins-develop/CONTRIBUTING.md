# 기여 가이드

Weverse Claude Code Plugin Marketplace에 새 플러그인을 기여하는 방법을 설명합니다.

## 플러그인 아이디어 제안

### 1. Issue 생성

새 플러그인 아이디어가 있다면 먼저 [GitHub Issues](https://github.com/weversecompany/claude-plugins/issues)에서 논의하세요.

**Issue 제목 형식:**
```
[Plugin Idea] 플러그인명 — 간단한 설명
```

**Issue 내용:**
```
## 플러그인명
...

## 목적
이 플러그인이 해결할 문제나 제공할 기능

## 제안된 기능
- [ ] Slash commands
- [ ] Auto-activating skills
- [ ] Hooks
- [ ] MCP servers

## 예상 사용자
누가 이 플러그인을 사용할 것인가?

## 추가 정보
기술 사항, 의존성, 외부 서비스 등
```

### 2. 피드백 수집

- 팀원들의 의견을 모읍니다
- 필요시 요구사항을 정제합니다

## 개발

### 1. Feature branch 생성

논의 후 개발을 시작합니다:

```bash
git checkout -b plugins/plugin-name
```

**Branch 명명 규칙:**
```
plugins/<plugin-name>     # 새 플러그인
plugins/<plugin-name>/v2  # 플러그인 메이저 업데이트
bugfix/plugin-name        # 버그 수정
docs/plugin-name          # 문서 추가/수정
```

### 2. 플러그인 개발

`plugins/_template/`을 기반으로 개발합니다:

```bash
cp -r plugins/_template plugins/my-awesome-plugin
cd plugins/my-awesome-plugin
# [파일 수정...]
```

자세한 가이드는 [플러그인 개발 가이드](docs/plugin-development.md)를 참고하세요.

### 3. 로컬 테스트

```bash
# 플러그인 설치
/claude install ./plugins/my-awesome-plugin

# 기능 테스트
/my-command
/claude plugins list

# 제거하고 재설치
/claude uninstall my-awesome-plugin@weverse-marketplace
rm -rf ~/.claude/plugins/cache/*/my-awesome-plugin
```

### 4. 문서화

- ✅ `README.md` — 플러그인 목적, 설치, 사용법
- ✅ 복잡한 기능에 대한 주석
- ✅ 환경 변수 기록 (필요 시)

### 5. Commit 메시지

명확한 commit 메시지를 작성하세요:

```
feat: add my-awesome-plugin

- /my-command slash command 추가
- iOS development auto-activating skill 추가
- README.md 작성

Closes #123
```

**메시지 형식:**
```
<type>: <subject>

<body>

<footer>
```

| Type | 설명 |
|------|------|
| `feat` | 새 기능/플러그인 추가 |
| `fix` | 버그 수정 |
| `docs` | 문서 추가/수정 |
| `refactor` | 리팩터링 |
| `test` | 테스트 추가 |

## PR (Pull Request)

### 1. PR 제출

GitHub에서 PR을 생성합니다:

```
Title: feat: add my-awesome-plugin
```

### 2. PR 설명

```markdown
## 변경 사항
플러그인이 제공하는 기능을 설명합니다.

### 플러그인명
my-awesome-plugin

### 기능
- [ ] Slash command: /my-command
- [ ] Auto-activating skill: iOS 개발 문맥
- [ ] Hook: API 키 검증

### 설치 방법
```
/claude install my-awesome-plugin@weverse-marketplace
```

### 사용 방법
```
/my-command <args>
```

### 테스트 결과
로컬 테스트 결과를 기술합니다.

Closes #123
```

### 3. 리뷰 프로세스

리뷰 항목:
- ✅ 플러그인 구조 (필수 파일, 선택 파일 분류)
- ✅ `plugin.json` 메타데이터 완전성
- ✅ README.md 품질 (명확한 설명, 사용 예시)
- ✅ 코드 품질 (주석, 에러 처리)
- ✅ 테스트 가능성

리뷰어가 다음을 확인합니다:
```bash
# 설치 가능한가?
/claude install <plugin>@weverse-marketplace

# 작동하는가?
/my-command test

# 환경 격리가 되는가?
# (다른 플러그인이나 시스템에 영향 없음)
```

### 4. Merge

리뷰 승인 후 merge됩니다.

## marketplace.json 업데이트

Merge 후 `marketplace.json`을 업데이트합니다:

```json
{
  "plugins": [
    {
      "name": "my-awesome-plugin",
      "description": "플러그인 설명",
      "version": "1.0.0",
      "source": "./plugins/my-awesome-plugin"
    }
  ]
}
```

## 버전 관리

### Semantic Versioning

```
MAJOR.MINOR.PATCH
1.0.0
```

| 범위 | 예시 | 언제 |
|------|------|------|
| **MAJOR** | `1.0.0` → `2.0.0` | Breaking change |
| **MINOR** | `1.0.0` → `1.1.0` | 새 기능 추가 |
| **PATCH** | `1.0.0` → `1.0.1` | 버그 수정 |

### 버전 업데이트

1. `plugin.json`의 `version` 필드 수정
2. `marketplace.json`의 플러그인 버전 수정
3. `CHANGELOG.md`에 항목 추가

```markdown
## [1.1.0] - 2024-01-15

### Added
- 새로운 /command 명령어 추가

### Fixed
- 버그 수정 사항

### Changed
- API 변경 사항
```

## 네이밍 컨벤션

### 플러그인명
- kebab-case: `my-awesome-plugin`
- 영문만 사용
- 의도가 명확할 것

### Slash commands
- kebab-case: `/my-command`
- 플러그인 이름과 연관성 있을 것 (선택)
- 예: `my-plugin`의 명령 → `/spec-search`, `/spec-analyze`

### Skills
- snake_case (디렉터리): `ios_development_context`
- 파일명: `SKILL.md` (고정)

### Scripts
- snake_case: `handler.py`, `validate_api.py`

## 모범 사례

### ✅ 좋은 기여

- 📝 완전한 문서화 (README, 주석)
- 🧪 로컬 테스트 완료
- 💡 명확한 commit 메시지
- 🎯 단일 책임 (한 가지 문제 해결)
- 🚀 에러 처리 적절히 구현

### ❌ 피해야 할 것

- ❌ 문서 부족
- ❌ 테스트 미완료
- ❌ 광범위한 기능 추가 ("만능" 플러그인)
- ❌ 다른 플러그인과 환경 오염
- ❌ 하드코딩된 경로 (${CLAUDE_PLUGIN_ROOT} 사용 필수)

## 문제 해결

### PR이 승인되지 않음

**원인**: 문서 부족, 테스트 미완료, 구조 이슈

**해결**:
1. 리뷰어 의견 반영
2. 추가 commit으로 수정 (새 commit 생성)
3. PR 업데이트 (자동 반영됨)

### 플러그인이 설치되지 않음

**원인**: `marketplace.json`에 항목 없음

**해결**:
1. `marketplace.json`에 플러그인 항목 확인
2. JSON 형식 검증
3. 파일 경로 확인: `./plugins/<plugin-name>`

## 지원

질문이나 문제가 있으신가요?

1. [GitHub Issues](https://github.com/weversecompany/claude-plugins/issues) — 버그, 기능 요청
2. [GitHub Discussions](https://github.com/weversecompany/claude-plugins/discussions) — 질문, 토론
3. Slack `#claude-code` 채널 — 빠른 소통

## 변경 이력

변경사항은 [CHANGELOG.md](CHANGELOG.md)를 참고하세요.
