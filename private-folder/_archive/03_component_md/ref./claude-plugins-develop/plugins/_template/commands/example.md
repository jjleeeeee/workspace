---
name: example-command
description: "예시 명령어입니다. 실제 플러그인에서는 이 파일을 삭제하거나 수정하세요."
---

이 파일은 slash command를 정의하는 예시입니다.

## 구조

```yaml
---
name: 명령어-이름 (반드시 kebab-case)
description: "명령어 설명 (선택)"
---

[실행할 내용]
```

## 실행 방법

명령어는 다음과 같이 실행됩니다:

```
/example-command [인자들...]
```

## 스크립트 실행

Python 스크립트를 호출하려면:

```yaml
---
name: my-command
description: "설명"
---

!python3 ${CLAUDE_PLUGIN_ROOT}/scripts/handler.py $ARGUMENTS
```

## Bash 스크립트 실행

```yaml
---
name: my-bash-command
description: "설명"
---

!bash ${CLAUDE_PLUGIN_ROOT}/scripts/handler.sh "$ARGUMENTS"
```

## 환경 변수

- `${CLAUDE_PLUGIN_ROOT}` — 플러그인 루트 디렉터리
- `$ARGUMENTS` — 사용자가 입력한 인자
- 시스템 환경 변수 (예: `$HOME`, `$PATH`)

## 예시 구현

실제 plguin에서:

1. 이 파일을 삭제하세요
2. `scripts/` 디렉터리에 실제 스크립트를 만드세요
3. 새로운 `.md` 파일을 생성하고 스크립트를 호출하도록 설정하세요

```yaml
---
name: spec-search
description: "Confluence에서 스펙 검색"
---

!bash ${CLAUDE_PLUGIN_ROOT}/scripts/search.sh "$ARGUMENTS"
```

자세한 예시는 [플러그인 개발 가이드](../../docs/plugin-development.md#1-slash-commands)를 참고하세요.
