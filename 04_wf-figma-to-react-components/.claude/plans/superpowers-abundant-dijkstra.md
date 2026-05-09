# Plan: omc (oh-my-claudecode) 클린 삭제

## Context

superpowers:test-driven-development만 유지하고 oh-my-claudecode(omc) 전체를 제거.
omc 삭제 시 oh-my-claudecode:* 스킬 전부 제거됨 — 사용자 확인 완료.

## 삭제 대상 (총 ~88.5MB)

### 디렉토리 삭제

```bash
rm -rf /Users/jj.iee/.omc/
rm -rf /Users/jj.iee/.claude/.omc/
rm -rf /Users/jj.iee/.claude/plugins/cache/omc/
rm -rf /Users/jj.iee/.claude/plugins/marketplaces/omc/
rm -rf /Users/jj.iee/.claude/plugins/data/oh-my-claudecode-omc/
```

### settings.json 수정

파일: `/Users/jj.iee/.claude/settings.json`

제거할 키:
- `"oh-my-claudecode@omc": true`
- `"omc": { "source": { ... } }` 블록 전체

### 건드리지 않는 것

- `~/.zshrc`, `~/.zprofile` — omc 관련 설정 없음
- 전역 npm 패키지 — omc 없음
- 프로젝트 `.claude/` — omc 관련 파일 없음
- superpowers:* 스킬 — 별도 경로, 영향 없음

## 검증

삭제 후:
1. `ls ~/.omc` → "No such file or directory"
2. `ls ~/.claude/plugins/cache/omc` → "No such file or directory"
3. Claude Code 재시작 후 스킬 목록에서 `oh-my-claudecode:*` 없는지 확인
4. `superpowers:test-driven-development` 등 superpowers 스킬은 정상 로드되는지 확인
