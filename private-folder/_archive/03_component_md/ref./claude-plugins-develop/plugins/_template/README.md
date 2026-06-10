# Template Plugin

이것은 Claude Code 플러그인 개발을 위한 템플릿입니다.

## 설정 방법

1. 이 디렉터리를 복사합니다:
   ```bash
   cp -r plugins/_template plugins/my-plugin
   ```

2. 파일들을 수정합니다:
   - `.claude-plugin/plugin.json` — 플러그인 정보
   - `commands/example.md` — 필요한 commands로 교체
   - `skills/example/SKILL.md` — 필요한 skills로 교체
   - `hooks/hooks.json` — 필요한 hooks만 남기기
   - `README.md` — 이 파일을 플러그인 설명으로 교체

3. 불필요한 파일/디렉터리는 삭제합니다

## 구조

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json              # 필수: 플러그인 메타데이터
├── commands/                     # (선택) Slash commands
│   └── example.md
├── skills/                       # (선택) Auto-activating skills
│   └── example/
│       └── SKILL.md
├── hooks/                        # (선택) 이벤트 핸들러
│   └── hooks.json
├── scripts/                      # (선택) 헬퍼 스크립트
│   └── handler.py
└── README.md                    # 플러그인 설명
```

## 파일별 가이드

- **`.claude-plugin/plugin.json`** — 플러그인 메타데이터 (필수)
  - 플러그인명, 버전, 작성자, 설명 등 입력
  - [상세 가이드](../../docs/plugin-development.md)

- **`commands/*.md`** — Slash commands (선택)
  - 사용자가 호출 가능한 `/command` 형태의 명령어
  - 각 파일이 하나의 명령어
  - [예시](../../docs/plugin-development.md#1-slash-commands)

- **`skills/*/SKILL.md`** — Auto-activating skills (선택)
  - 특정 상황에서 자동으로 활성화되는 문맥 정보
  - 파일명은 반드시 `SKILL.md` (대문자)
  - [예시](../../docs/plugin-development.md#2-auto-activating-skills)

- **`hooks/hooks.json`** — 이벤트 핸들러 (선택)
  - Tool 사용 전/후, 세션 시작/종료 등 이벤트 처리
  - `PreToolUse`, `PostToolUse`, `SessionStart` 등 지원
  - [예시](../../docs/plugin-development.md#3-hooks)

- **`README.md`** — 플러그인 설명 (권장)
  - 플러그인의 목적, 설치 방법, 사용법, 예시

## 개발 팁

1. **로컬 테스트**
   ```bash
   /claude install <path>/plugins/my-plugin
   /my-command test
   ```

2. **삭제하고 재설치**
   ```bash
   /claude uninstall my-plugin@weverse-marketplace
   rm -rf ~/.claude/plugins/cache/*/my-plugin
   ```

3. **로그 확인**
   ```bash
   tail -f ~/.claude/logs/claude.log
   ```

## 플러그인 제출

1. `marketplace.json`에 플러그인 항목 추가
2. PR 제출
3. 리뷰 및 merge
4. 사용자가 `/claude install`로 설치 가능

자세한 과정은 [플러그인 개발 가이드](../../docs/plugin-development.md)를 참고하세요.

## 다음 단계

- [플러그인 개발 가이드](../../docs/plugin-development.md) — 상세한 개발 방법
- [CLAUDE.md](../../CLAUDE.md) — Claude Code 개발 컨텍스트
- [기여 가이드](../../CONTRIBUTING.md) — 플러그인 기여 방법
