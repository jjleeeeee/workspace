# Molecule Description Workflow 회고

날짜: 2026-05-04

## 범위

- `refs/figma-component-keys/index.md`에서 `Level=Molecule`로 분류된 13개 컴포넌트를 대상으로 Description 워크플로우를 실행했다.
- 신규 draft YAML 13개를 만들고 validator를 통과시킨 뒤 Figma plain `description`에 저장했다.
- `{component}.md` 파생 문서는 만들지 않았다.

## 완료한 일

- 생성한 draft:
  - `dropdown-box`, `list-item-native`, `list-item-web`, `menu`
  - `search`, `snackbar`, `stepper`, `tabs`, `text-fields`
  - `thumbnail`, `title-header`, `top-navigation`, `toast`
- 각 draft에서 variant count, 필수 섹션, `implementation_order`, `implementation_coverage`, `rules`를 검증했다.
- `snackbar`, `title-header`에서 low-level `icon_area`를 `composition.uses`에서 제외해 부모 구현 계약만 남겼다.
- Figma official readback에서 13개 모두 plain `description` 저장, variant registry count 일치, `descriptionMarkdownLength === 0`을 확인했다.

## 핵심 발견

- `descriptionMarkdown` clear 순서가 중요하다.
- plain `description`을 쓴 뒤 `descriptionMarkdown = ""`를 실행하면 plain Description까지 비워질 수 있다.
- 안전한 순서는 write 전 기존 `descriptionMarkdown` 길이를 기록하고, `descriptionMarkdown`을 먼저 clear한 뒤 plain `description`을 쓰는 것이다.
- Figma readback의 plain `description`에는 `&quot;` 같은 HTML entity가 남을 수 있으므로 검증은 decode 기준으로 해야 한다.

## 잘 된 점

- subagent로 도메인을 나누니 13개 Molecule draft를 한 번에 만들 수 있었다.
- Atom을 먼저 정리해 둔 덕분에 Molecule의 `composition.uses` 판단이 단순해졌다.
- `refs/figma-component-keys/variant-keys/`가 variant node id와 component key 대조 시간을 줄였다.

## 다음에 바꿀 점

- write 도구는 대량 문자열 전달 한계가 있으므로, 배치 쓰기 전에 로컬 draft를 읽는 안정적인 전송 방식을 먼저 확정한다.
- `composition.uses`가 길어지는 컴포넌트는 하위 DS 컴포넌트 관계만 남기고 상세 spec 중복을 계속 금지한다.
- 다음 배치에서는 readback 스크립트에 HTML entity decode와 registry count 검증을 기본 포함한다.
