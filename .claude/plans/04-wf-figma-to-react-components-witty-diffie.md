# 플랜: 워크스페이스 디렉토리에 독립 Git 저장소 초기화

## Context

Codex 컴패니언(`/codex:review`, `/codex:adversarial-review`)이 시작 시 ENOENT로 크래시.
원인: Codex가 `git rev-parse --show-toplevel`로 workspaceRoot를 결정하는데, 현재 git 루트가 `~/` (홈 디렉토리)임.

결과:
- Codex가 홈에서 `git status --short` 실행 → 홈의 모든 untracked 파일 수천 개 반환
- 각 파일을 `statSync`로 읽으려다 존재하지 않는 경로에서 크래시
- 플랜 파일도 `~/.claude/plans/` 에서 찾아서 못 찾음 (실제 위치는 `~/Desktop/workspace/.claude/plans/`)

**확인된 안전성**:
- 홈 git repo `e1a5b115` first commit은 `README.md` 하나만 추적
- workspace 내부 파일은 홈 git에서 추적되지 않음 (전부 untracked)
- `cds-catalogs/`, `design-cds-docs/` 는 자체 `.git` 보유 → git이 nested repo로 자동 처리, 영향 없음

## 결정 사항

`~/Desktop/workspace/`에 독립 git repo를 초기화하여 Codex가 올바른 workspaceRoot를 감지하도록 함.

## 실행 단계

### 1. Git 초기화
```bash
cd /Users/jj.iee/Desktop/workspace
git init
```

### 2. .gitignore 생성
워크스페이스 루트에 `.gitignore` 생성. 추적 제외 항목:
- `node_modules/`
- `dist/`
- `build/`
- `.DS_Store`
- `*.log`
- `.env`, `.env.local`
- `storybook-static/`
- `.serena/`
- `.omc/`

### 3. 검증: Codex 컴패니언 정상 동작
```bash
git rev-parse --show-toplevel
# 결과: /Users/jj.iee/Desktop/workspace (홈이 아니어야 함)

node "/Users/jj.iee/.claude/plugins/cache/openai-codex/codex/1.0.2/scripts/codex-companion.mjs" adversarial-review --help
# 이전: ENOENT 크래시
# 기대: 정상 출력
```

### 4. 정리: 임시 심볼릭 링크 제거
이전에 우회용으로 만든 `~/.claude/plans/` 심볼릭 링크 제거 (Codex가 이제 올바른 경로를 봄):
```bash
rm /Users/jj.iee/.claude/plans/04-wf-figma-to-react-components-*.md
rm /Users/jj.iee/.claude/plans/reactive-floating-alpaca.md
rm /Users/jj.iee/.claude/plans/twinkling-questing-moon.md
# playful-beaming-falcon.md 는 원본이므로 보존
```

### 5. 첫 커밋은 만들지 않음
- 사용자가 어떤 파일을 어떻게 커밋할지 직접 결정하도록 남김
- Codex 동작에는 init만 있으면 충분 (커밋 불필요)

## 영향 범위 (재확인)

| 대상 | 영향 |
|------|------|
| `cds-catalogs/.git` | 없음 (자체 git 유지) |
| `design-cds-docs/.git` | 없음 (자체 git 유지) |
| 홈 `~/.git` (`e1a5b115`) | workspace가 nested repo로 보일 뿐, 추적 변경 없음 |
| `03_wf`, `04_wf`, `05_chord-figma-mcp` | 새 workspace git의 untracked 파일로 잡힘 |

## 검증 방법

1. `git rev-parse --show-toplevel` → `/Users/jj.iee/Desktop/workspace` 반환 확인
2. Codex 컴패니언 헬프 명령이 ENOENT 없이 정상 출력
3. 실제 `/codex:review` 또는 `/codex:adversarial-review` 한 번 실행해서 작동 확인
4. `cds-catalogs`, `design-cds-docs` 안에서 `git status` 실행 → 자체 repo 유지 확인
