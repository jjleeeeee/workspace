---
name: ds-token-lint
description: "DS 토큰 lint — DSL JSON 파일의 토큰 참조를 cds-catalogs 기준으로 검사. 예: /ds-token-lint dsl_text_button.json 또는 /ds-token-lint ."
---

!uv run --script ${CLAUDE_PLUGIN_ROOT}/servers/ds_token_lint.py $ARGUMENTS
