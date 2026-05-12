---
type: WorkflowGuide
status: Draft
version: 1.0
updated: 2026-05-11
---

# Code Connect Workflow

이 문서는 `04_wf-figma-to-react-components`에서 React Code Connect를
작성, 검증, 발행할 때 따르는 운영 규칙이다. 이 프로젝트는 parser 기반
`.figma.tsx` 파일과 Figma Code Connect CLI를 사용한다.

## Config

- CLI config는 `figma.config.json`을 기준으로 한다.
- React parser만 사용한다.
- 대상은 `src/components/**/*.{ts,tsx}` 안의 `.figma.tsx` 연결이다.
- stories와 test 파일은 publish 대상에서 제외한다.
- 기존 `figma.config.ts`가 있더라도 CLI 1.4.4는 JSON config를 안정적으로
  읽으므로 publish/parse 명령에는 `--config figma.config.json`을 사용한다.

## Local Validation

Code Connect 변경 후에는 먼저 로컬에서 parse 결과와 타입을 확인한다.

```bash
npm run typecheck
./node_modules/.bin/figma connect parse --config figma.config.json --skip-update-check --outFile /private/tmp/chord-code-connect-after.json
```

기대값:

- parse entry count가 `36`이다.
- 모든 entry의 `label`은 `React`다.
- `.figma.tsx` prop mismatch가 없다.

## Publish Flow

Figma에는 React 라벨만 대상으로 발행한다. Compose 등 다른 라벨은 건드리지
않는다.

```bash
./node_modules/.bin/figma connect publish --config figma.config.json --label React --dry-run --exit-on-unreadable-files --skip-update-check --token "$FIGMA_ACCESS_TOKEN"
```

dry-run이 통과한 뒤에만 실제 publish를 실행한다.

```bash
./node_modules/.bin/figma connect publish --config figma.config.json --label React --exit-on-unreadable-files --skip-update-check --token "$FIGMA_ACCESS_TOKEN"
```

기존 React mapping을 삭제해야 할 때도 `--label React` 범위를 유지한다.

```bash
./node_modules/.bin/figma connect unpublish --config figma.config.json --label React --dry-run --skip-update-check --token "$FIGMA_ACCESS_TOKEN"
```

## Template Rules

- `.figma.tsx`는 public React component API를 바꾸지 않고 Figma props를
  코드 props에 맞춘다.
- Figma text property는 가능한 `figma.string(...)`으로 실제 instance text를
  반영한다.
- Figma enum name과 React prop name이 다르면 React prop name을 기준으로
  명확히 바꾼다. 예: `Type` -> `buttonType`, `Button_Color` -> `buttonColor`.
- React children으로 전달되는 label은 prop이 아니라 children 형태를 우선한다.
  예: `<TextButton>{buttonText}</TextButton>`.
- Figma property 이름 끝에 보이지 않는 공백이 있는 경우 Code Connect publish
  validation은 통과해도 Dev Mode snippet에서 `Error`로 렌더링될 수 있다.
  이런 prop은 Figma 원본 property명을 정리하기 전까지 `.figma.tsx` 매핑에서
  제외한다. 예: TitleHeader의 `[Title] Multiple `, `[Sub] Multiple `.

## Boolean Props

`figma.boolean()` 값을 일반 JSX boolean prop으로 넘기면 false 값은 snippet에서
생략될 수 있다. component default가 `true`인 prop은 의미가 바뀔 수 있으므로
false를 보존해야 한다.

권장:

```tsx
<Avatar
  mode={mode}
  avatarType={avatarType}
  size={size}
  {...{ badgeDot, birthdayHat, emoji, host, ring }}
/>
```

이 방식은 Dev Mode snippet에서 다음처럼 false 값까지 보존한다.

```tsx
<Avatar mode="default" avatarType="squircle" size="large" {...{ badgeDot: true, birthdayHat: true, emoji: true, host: false, ring: true }} />
```

비권장:

```tsx
<Avatar badgeDot={badgeDot} host={host} />
```

false일 때 prop이 생략되어 `host={false}` 의미가 사라질 수 있다.

## Figma MCP Verification

publish 후에는 실제 consumer/test frame을 MCP로 다시 읽어 Code Connect snippet을
검증한다.

- `clientFrameworks=react`
- `clientLanguages=typescript`
- Code Connect가 필요한 경우 `disableCodeConnect`를 설정하지 않는다.

확인할 것:

- snippet이 실제 React prop API와 맞는가.
- Figma instance text가 snippet에 반영되는가.
- boolean false가 필요한 prop은 생략되지 않고 보존되는가.
- `CodeConnectSnippet` wrapper는 최종 구현 코드에 포함하지 않는다.
