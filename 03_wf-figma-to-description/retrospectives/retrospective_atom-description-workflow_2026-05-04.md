# Atom Description Workflow 회고

날짜: 2026-05-04

## 범위

- `refs/figma-component-keys/index.md`에서 `Level=Atom`으로 분류된 22개 컴포넌트를 대상으로 Description 워크플로우를 실행했다.
- 신규 draft YAML 15개를 만들고, 기존 Atom draft YAML 7개를 재검증했다.
- 신규 Atom draft 15개는 Figma plain `description`에 작성했고, 기존 Atom draft 일부도 다시 동기화했다.
- Figma에서 `descriptionMarkdown` 관련 부작용이 확인되어 추가 쓰기를 중단했다.

## 완료한 일

- 신규 draft YAML을 생성했다:
  - `icon-button`, `divider`, `linear-progress-indicator`, `circular-progress-indicator`
  - `scrim-overlay`, `scrollbar`, `select-number-box`, `skeleton`
  - `pagination-dot-v2`, `pagination-list-v2`, `loading-dot`, `loading-circular`
  - `toggle-switch`, `tooltip`, `tag`
- 기존 Atom draft를 재검증했다:
  - `avatar`, `badge-dot`, `badge-number`, `text-button`, `checkbox`, `chips`, `radio`
- Atom draft YAML 22개 모두 `tools/validate-component-description.mjs`를 통과했다.
- 최종 readback에서 Atom Figma node 22개 모두 plain `description`에 필수 YAML 섹션이 있음을 확인했다.

## 중단 또는 부분 완료

- 기존 Atom 재동기화는 `text-button`, `checkbox`, `chips`, `radio`를 다시 쓰기 전에 중단했다.
- `badge-number` 쓰기 응답은 중간에 끊겼지만, readback 기준 plain `description`에 필수 YAML 섹션이 있다.
- `{component}.md` 파생 문서는 만들지 않았다.
- `descriptionMarkdown`에는 의도적으로 YAML을 쓰지 않았다.

## 핵심 발견

plain `node.description`을 할당하면 Figma에서 기존 nonzero `descriptionMarkdown` 값이 0자로 바뀔 수 있다.

관찰된 사례:

- `icon-button`: `descriptionMarkdown` 45자에서 0자로 변경됨.
- `linear-progress-indicator`: 27자에서 0자로 변경됨.
- `circular-progress-indicator`: 13자에서 0자로 변경됨.
- `loading-dot`: 10자에서 0자로 변경됨.
- `loading-circular`: 11자에서 0자로 변경됨.
- `tag`: 2827자에서 0자로 변경됨.

이는 워크플로우가 `descriptionMarkdown`에 직접 쓴 결과가 아니라, `node.description` 할당 시 발생하는 Figma API 부작용으로 보인다.

## 확인 공백

- `icon-button`: markitdown에는 XLarge icon inner area가 `24x24`로 되어 있으나, live Figma sample은 `20x20`으로 확인되어 draft는 live Figma 기준을 따랐다.
- `skeleton`: Circle radius에 바인딩된 radius token이 없고, 전용 `markitdown-skeleton.md`도 없다.
- `pagination-dot-v2`: fixed mode의 unselected dot token 의미와 일부 `Dots=6+` padding 값이 refs에 충분히 명명되어 있지 않다.
- `loading-dot`, `loading-circular`: local refs에는 Lottie 사용이 언급되어 있으나 JSON asset key/path나 motion timing 정보가 없다.
- `tag`: `Label`은 기존 Figma text에 문서화되어 있지만 live `componentPropertyDefinitions`에는 노출되지 않는다.

## 잘 된 점

- subagent로 추출 작업을 나누니 context 부담이 줄고 variant가 많은 컴포넌트도 관리 가능했다.
- validator 선검증 방식으로 Figma 쓰기 전에 schema 문제를 먼저 잡을 수 있었다.
- Icon Button, Pagination, Tooltip, Tag, Text Button, Chips처럼 variant가 많은 컴포넌트에는 `registry_policy`가 유용했다.
- Atom을 먼저 정리하는 순서는 여전히 유효하다. 이후 Molecule 작업에서 `composition.uses`가 이미 문서화된 Atom을 참조할 수 있기 때문이다.

## 다음에 바꿀 점

- 쓰기 preflight에서 대상별 `descriptionMarkdown` 길이를 기록한다.
- nonzero `descriptionMarkdown`은 중단 조건이 아니라 legacy field로 기록한 뒤 clear하는 대상으로 다룬다.
- 쓰기 batch는 더 작게 나누고, 각 그룹 뒤에 중단 지점을 둔다.
- 다음 대형 batch 전에 `PLAYBOOK.md`에 부작용 규칙을 반영한다.
- legacy nonzero `descriptionMarkdown`을 보존할지, clear할지, migrate할지 정책을 명시한다.

## 다음 추천

Molecule batch를 실행하기 전에 workflow에 `descriptionMarkdown` 부작용 checkpoint를 추가하고 정책을 하나로 고정한다:

- legacy markdown을 보존한 뒤 plain description을 쓴다.
- plain description을 최신화할 때 legacy markdown clear를 허용한다.
- nonzero `descriptionMarkdown`이 있는 컴포넌트는 skip한다.
