---
type: WorkflowReference
status: Draft
version: 1.0
updated: 2026-05-08
---

# Source Note Contract

source note는 component 구현 전에 남기는 근거 문서다. 구현자는 source note 없이
component code를 작성하지 않는다.

## Path

```text
src/figma/<component>.source.md
```

## Required Content

새로 만들거나 수정하는 source note는 아래 항목을 채운다. 적용되지 않는 항목도
삭제하지 말고 `N/A` 또는 `not applicable`로 남겨서 “확인 안 함”과 “해당 없음”을
구분한다. 기존 legacy source note는 해당 component를 다시 만질 때 이 기준으로
backfill한다. `npm run rules:audit`는 모든 `src/figma/*.source.md` 파일이
아래 required section heading을 갖는지 확인한다.

- source read timestamp
- `index.md`에서 확인한 node id와 component key
- Framelink/Figma MCP call 목록
- Console MCP call 목록
- Figma description
- variant axes와 code props mapping
- component properties
- constraints
- token mapping
- Alpha Token Notes
- Font Mapping Notes
- Text Behavior Notes
- Sizing Interpretation Notes
- Nested Atom Mapping
- Nested Module Inventory
- Token vs Rendered Pixel Notes
- layout rules
- representative child nodes
- visual reference image URL 또는 local baseline path
- placeholder 사용 범위
- `Known Gaps`

## Props Mapping Policy

- Figma variant axis와 component property를 public prop mapping의 기준으로 삼는다.
- native HTML prop과 이름이 충돌하면 public prop을 분리한다.
- ReactNode slot props는 Storybook Controls에서 숨긴다.
- invalid variant 조합은 Figma 제약 기준으로 normalize하거나 명시적으로 막는다.

## Token vs Rendered Pixel Notes

토큰값과 Figma rendered baseline이 충돌하거나 pixel diff가 token 사용만으로
해결되지 않으면 source note에 아래 형식으로 기록한다.

```md
## Token vs Rendered Pixel Notes

| Field | Value |
| --- | --- |
| token id | `<token-id>` |
| token value | `<token-value>` |
| Figma rendered value | `<figma-rendered-value>` |
| actual value | `<actual-code-value>` |
| decision | `visual-environment / token-mapping / component-css / font-rendering / token-or-figma-spec-gap` |
| follow-up owner | `component / token / figma-spec / asset / none` |
```

- `component-css` 결정은 component 구현에서 수정한다.
- `token-or-figma-spec-gap` 결정은 `Known Gaps`와 `history/`에도 기록한다.
- size mismatch는 font rendering gap으로 기록하지 않는다.

## Alpha Token Notes

Figma paint가 `boundVariables`와 raw `opacity`를 함께 제공하면 source note에
아래 내용을 기록한다.

```md
## Alpha Token Notes

| Field | Value |
| --- | --- |
| Figma raw paint | `<rgb/fill + opacity>` |
| bound token | `<token-name>` |
| token alpha meaning | `none / 50a / 100a / 200a / 300a / ... / unknown` |
| CSS mapping | `<css-variable-only / css-variable-plus-opacity / opacity-only>` |
| decision | `use-alpha-token / use-separate-opacity / known-gap` |
```

- token 이름이 `*-50a`, `*-100a`, `*-200a`, `*-300a`처럼 alpha를 포함하면
  CSS에서는 token만 사용한다.
- alpha token에 CSS `opacity`를 추가하지 않는다.
- CSS `opacity`는 token이 alpha를 표현하지 않거나 source note가 별도 layer
  opacity로 기록한 경우에만 사용한다.
- Figma raw paint opacity는 alpha token이 렌더링을 위해 풀린 값일 수 있으므로
  token semantic보다 먼저 구현 규칙으로 쓰지 않는다.

## Font Mapping Notes

Figma development data에 concrete `fontFamily`가 있으면 source note에 아래
내용을 기록한다.

```md
## Font Mapping Notes

| Field | Value |
| --- | --- |
| Figma fontFamily | `<font-family-from-figma>` |
| font family type | `actual-font / system-alias / token-alias / unknown` |
| availability | `available / unavailable / unknown` |
| system alias meaning | `<macOS system stack / Android system stack / none / unknown>` |
| CSS font-family order | `"<FigmaFont>", <system-fallback>, <token-fallback>` |
| decision | `use-figma-font / use-system-alias / token-fallback / known-gap` |
| visual diff risk | `none / font-rendering / unknown` |
```

- concrete `fontFamily`를 generic typography token으로 조용히 치환하지 않는다.
- Figma `fontFamily`가 actual font인지, system alias인지, token alias인지 먼저
  분류한다.
- system alias는 실제 font file이 아니라 Figma가 OS font stack을 표현하기 위해
  붙인 이름일 수 있다.
- 사용 가능하거나 target runtime에서 해석되는 system alias면 Figma fontFamily를
  CSS font-family 첫 번째에 둔다.
- system alias 뒤에는 의미가 가까운 OS fallback을 두고, generic typography token은
  그 뒤에 둔다.
- 사용 불가 또는 확인 불가로 token fallback을 쓰면 `Known Gaps`에 남긴다.
- diff가 text pixels에 집중되면 size/color를 고치기 전에 font mapping을 먼저
  확인한다.

## Text Behavior Notes

텍스트가 있는 컴포넌트는 source note에 아래 내용을 기록한다.

```md
## Text Behavior Notes

| Text role | Figma readback | Explicit overflow policy | CSS decision |
| --- | --- | --- | --- |
| `<title/body/detail>` | `<textAutoResize / node size / parent sizing>` | `<none / truncate / maxLines / lineClamp / clipsContent>` | `<wrap / hug / explicit-ellipsis / unknown>` |
```

- `textAutoResize`는 단순 메타데이터가 아니라 CSS `white-space`, `overflow`,
  `text-overflow`, `line-clamp` 판단의 근거다.
- Figma description, annotations, component properties, or readback에서
  `truncate`, `ellipsis`, `lineClamp`, `maxLines`, `clipsContent` 같은 정책이
  확인되지 않으면 기본 CSS ellipsis를 넣지 않는다.
- Parent row가 fixed height라고 해서 child text가 자동으로 one-line truncate
  된다고 해석하지 않는다.
- Overflow 정책을 product/runtime option으로 제공해야 하면 Figma-facing 계약과
  구분하고 Storybook Controls에서는 숨기거나 명시적으로 opt-in으로 둔다.

## Sizing Interpretation Notes

Figma sample rendered size와 CSS sizing contract가 혼동될 수 있는 component는
source note에 아래 내용을 기록한다.

```md
## Sizing Interpretation Notes

| Field | Value |
| --- | --- |
| Figma layout sizing | `hug / fill / fixed / mixed` |
| sample rendered size | `<width>x<height>` |
| text wrapping rule | `single-line / wraps / max-lines / unknown` |
| min/max constraints | `<none / max-width 240 / fixed width ...>` |
| padding and gap source | `<figma layout / token / unknown>` |
| asset frame contribution | `<close 16x16 / icon 12x12 / none / unknown>` |
| CSS sizing decision | `hug-content / fixed-size / constrained-max / story-only-wrapper` |
| forbidden interpretation | `sample-size-is-not-min-width / none` |
```

- `sample rendered size`는 특정 props와 label로 나온 관찰값이다.
- Figma layout sizing이 `hug`이면 sample width/height를 CSS fixed/min size로
  사용하지 않는다.
- 고정/min/max sizing은 Figma fixed sizing, explicit constraint, token, 또는
  description layout rule이 있을 때만 기록하고 구현한다.
- visual diff를 위해 story wrapper에만 크기를 둔 경우 component CSS가 아니라
  `story-only-wrapper`로 기록한다.

## Nested Atom Mapping

분자/조합 컴포넌트가 atom instance를 포함하면 source note에 아래 내용을 기록한다.

```md
## Nested Atom Mapping

| Parent variant/size | Nested role | Figma nested component | Nested variant/props | Frame size | Offset/placement | CSS decision |
| --- | --- | --- | --- | ---: | --- | --- |
| `<parent props>` | `<leading / trailing / host / badge / ...>` | `<[V2] Avatar / IconButton / ...>` | `<Size=Small, Type=Circle, ...>` | `<46x46>` | `<right=0 bottom=0>` | `<compose-public-props>` |
```

- `Nested variant/props`는 Figma nested instance의 실제 component properties에서 온다.
- Parent size별로 nested atom size가 달라지면 size table을 작성한다.
- Nested atom을 CSS `scale()`, percentage sizing, 임의 width/height로 축소/확대하지
  않는다.
- Nested atom의 public prop으로 표현할 수 없는 override는 `Known Gaps` 또는
  `Asset Notes`에 별도로 기록한다.
- Parent Storybook Controls에는 parent의 Figma-facing props만 노출하고 nested
  atom internal props는 숨긴다.

## Nested Module Inventory

복합 컴포넌트가 nested module 또는 nested component set을 포함하면 source note에
아래 내용을 기록한다. 이 표는 구현 범위를 결정하기 전에 작성한다.

```md
## Nested Module Inventory

| Nested role | Node id/key | Module/component | Owner type | Axes/props/options | Required child atoms/assets | Coverage | Deferred reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `<trailing>` | `<57343:20409 / key>` | `<_atoms / modules / Trailing>` | `<component-set>` | `<Type=TextAndIcon/Icon Only/...; showText; showIcon>` | `<IconButton, Radio, Toggle, BadgeNumber, ChordIcon>` | `<partial>` | `<v1 implements TextAndIcon only>` |
```

- `Owner type`은 `atom / module / component-set / asset / unknown` 중 하나로
  기록한다.
- `Axes/props/options`에는 nested module의 variant axes, boolean props, text props,
  instance swap option, asset role을 기록한다.
- Coverage는 `complete / partial / deferred` 중 하나로 기록한다.
- Parent default screenshot에 보이지 않는 nested enum도 contract 후보로 기록한다.
- `partial/default-only` 구현은 source note와 Storybook docs에 명시한다.
- 구현하지 않는 nested enum branch는 일반 `Known Gaps`가 아니라
  `deferred coverage`와 reason으로 기록한다.

## Asset Policy

- `description.assets`는 실제 파일 목록이 아니라 구현 계약과 asset role로 본다.
- Asset Notes에는 `asset classification`을 기록한다:
  `icon component / icon_area wrapper / component state shape / component fallback / placeholder / unknown`.
- icon, loading, image, logo, badge처럼 asset-backed visual로 확인된 항목은
  Figma nested node export 또는 기존 DS asset mapping을 먼저 시도한다.
- icon asset은 먼저 `src/assets/chord-icons.tsx` registry에서 검색한다.
  registry에 없으면 Figma icon library node `10219:78691`에서 SVG를 export하고
  registry metadata를 추가한다.
- Figma `Specialtype` 또는 `_special` icon은 source note Asset Notes에
  `colorMode=original`로 기록한다. 이 icon들은 black/currentColor로 강제하지 않는다.
- `icon_area`는 SVG asset이 아니라 wrapper/sizing contract로 기록한다.
- pagination ellipsis, tooltip caret, progress ring, radio dot처럼 component state
  shape로 분류된 도형은 icon registry 대상이 아니다.
- `component fallback`은 consumer content가 없을 때 component가 자체적으로
  렌더하는 상태다. 예: Thumbnail no-image placeholder.
  - Figma asset을 `src` sample이나 product media로 넣지 않는다.
  - fallback state로 구현하고, Storybook default args에서 해당 fallback이
    보이도록 한다.
  - source note에는 fallback trigger, nested asset source node, local fixture,
    mark/logo bound, alignment를 기록한다.
  - nested mark/logo는 parent frame에 stretch하지 않고 Figma rendered bound를
    따른다.
- shape similarity is not evidence. 유사한 SVG가 있어도 Figma 구조상 icon
  component로 확인되기 전에는 `ChordIcon`으로 매핑하지 않는다.
- icon registry miss를 해결하지 못하면 `Known Gaps`에
  `missing-icon-registry-entry`로 남긴다.
- source를 찾지 못하면 text, emoji, CSS drawing으로 조용히 대체하지 않고
  `Known Gaps`에 남긴다.
- 임시 placeholder를 쓰면 이유, 허용 범위, production asset 필요 시점을 기록한다.
- asset-backed prop이 Storybook Controls에 노출되면 story docs 또는
  `FigmaCompare`에서 placeholder 여부를 확인할 수 있어야 한다.
