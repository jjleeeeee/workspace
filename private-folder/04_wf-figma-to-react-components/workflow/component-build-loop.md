---
type: WorkflowReference
status: Draft
version: 1.0
updated: 2026-05-06
---

# Component Build Loop

이 문서는 source note 이후 React component, CSS, tests, Storybook을 만드는 기준이다.

## Token Build

입력:

```text
tokens/tokens.color.v1.0.json
tokens/tokens.size.v1.0.json
tokens/tokens.typography.v1.0.json
```

출력:

```text
src/styles/generated/tokens.css
```

판단 기준:

- token id는 `--cds-*` CSS variables로 변환한다.
- token namespace를 임의로 새로 만들지 않는다.
- source note에 나온 token을 CSS variable로 mapping할 수 있어야 한다.
- mode 값이 output 순서 때문에 뒤집히지 않는지 visual smoke로 확인한다.

## Tests First

먼저 확인할 contract:

- Figma-facing variant props가 stable data attribute나 DOM state로 반영된다.
- disabled/loading/selected state 계산이 맞다.
- invalid variant 조합을 normalize하거나 명시적으로 막는다.
- Storybook Controls에 native/internal props가 노출되지 않는다.

## Recursive Nested Module Gate

복합 컴포넌트는 parent default screenshot만 보고 구현 범위를 결정하지 않는다.

1. Parent node를 읽고 `composition.uses`, `assets.source`, nested node id/key,
   component set key를 추출한다.
2. Nested item이 module 또는 component set이면 해당 node를 별도로 MCP read한다.
3. Nested module별 variant axes, boolean props, text props, instance swap, asset
   role을 `Nested Module Inventory`에 기록한다.
4. 필요한 child atoms/assets가 현재 package에 준비됐는지 확인한다.
5. 각 nested module coverage를 `complete`, `partial`, `deferred`로 결정한다.
6. Public API와 Storybook Controls는 parent Figma-facing props 중심으로 정하되,
   nested coverage가 `partial/default-only`면 source note와 Storybook docs에
   명시한다.
7. 이 gate가 끝난 뒤에 tests와 implementation을 시작한다.

## Text Behavior Gate

텍스트 노드가 있는 component는 CSS 작성 전에 text behavior를 먼저 결정한다.

1. Figma readback에서 `textAutoResize`, text node width/height, parent sizing,
   `clipsContent`, max/min constraints를 확인한다.
2. Description, annotations, component props에서 `truncate`, `ellipsis`,
   `lineClamp`, `maxLines`, `overflow` 정책이 있는지 찾는다.
3. 정책이 확인되면 source note `Text Behavior Notes`에 기록하고 CSS로 구현한다.
4. 정책이 없으면 `white-space: nowrap`, `text-overflow: ellipsis`,
   `-webkit-line-clamp`를 기본값으로 넣지 않는다.
   단, parent/slot 침범을 막기 위한 containment는 truncation과 구분해서 기록하고
   적용할 수 있다. Parent/root가 hug 또는 min-height 기반이면 wrapping으로 row가
   커지게 둔다. Fixed-height가 Figma에서 확인된 경우에만 default clipping을
   고려하고, visible ellipsis는 explicit opt-in으로 분리한다.
5. Parent fixed row height는 text overflow 정책의 증거가 아니다. 필요한 경우
   `unknown` 또는 runtime opt-in prop으로 분리한다.

## Component Implementation

- Figma-facing props를 public API의 중심에 둔다.
- native HTML prop과 충돌하면 public prop을 분리한다.
- CSS 값은 source note의 token mapping을 우선한다.
- Figma `boundVariables`가 alpha token을 가리키면 raw paint opacity보다 token
  의미를 먼저 해석한다.
- `*-50a`, `*-100a`, `*-200a`, `*-300a`, `*-400a`, `*-500a`, `*-600a`,
  `*-700a`, `*-800a`처럼 alpha 의미가 있는 token에는 별도 CSS `opacity`를
  추가하지 않는다.
- Figma development data에 concrete `fontFamily`가 있으면 generic typography
  token으로 조용히 치환하지 않는다.
- Figma가 text overflow/truncation을 명시하지 않았으면 default one-line
  ellipsis를 추가하지 않는다.
- concrete `fontFamily`는 actual font, system alias, token alias 중 무엇인지
  먼저 분류한다.
- actual font이거나 target runtime에서 해석되는 system alias면
  `"<FigmaFont>", system fallback, token fallback` 순서로 둔다.
- state visual은 base fill/stroke/label 의미를 임의로 교체하지 않는다.
- loading이나 pending이 중복 action을 막아야 하면 native disabled 상태가 되어야 한다.
- asset-backed visual은 실제 asset export/mapping 없이 CSS로 production처럼 재현하지 않는다.

## Icon Asset Preflight

- 먼저 asset classification을 결정한다:
  `icon component / icon_area wrapper / component state shape / component fallback / placeholder / unknown`.
- `icon component`로 확인된 항목만 `ChordIcon` registry 대상으로 삼는다.
- `component state shape` 예: pagination ellipsis, tooltip caret, progress ring,
  radio dot은 icon registry 대상이 아니다.
- `component fallback` 예: Thumbnail no-image placeholder처럼 `src`나 consumer
  content가 없을 때 component가 자체적으로 보여주는 상태다. 이 경우 Figma asset을
  Storybook sample `src`로 넣지 말고 fallback state로 구현한다.
- fallback 내부 logo/mark/image는 전체 frame에 stretch하지 않는다. Parent ratio
  frame은 component가 만들고, nested asset은 Figma node의 실제 bound와 alignment를
  따른다.
- Figma screenshot 전체를 media fixture로 쓰지 않는다. 필요한 nested asset만
  export하고, screenshot은 visual reference로만 사용한다.
- shape similarity is not evidence. 비슷한 icon file이 있어도 Figma 구조상
  icon component가 아니면 registry에 매핑하지 않는다.
- Figma read 후 구현 전 nested icon 이름, `icon_area` size, internal graphic size를
  source note에 기록한다.
- `src/assets/chord-icons.tsx`에서 registry hit/miss를 확인한다.
- registry hit이면 component에서 `ChordIcon name="..."`을 사용한다.
- registry miss이면 먼저 Figma icon library node `10219:78691`에서 SVG export와
  registry metadata 추가를 진행한다.
- export/registry 추가가 불가능하면 `Known Gaps`에
  `missing-icon-registry-entry`를 기록하고 production-complete로 보고하지 않는다.
- CSS drawing 또는 text glyph icon은 production implementation으로 금지한다.

## Nested Atom Composition

분자/조합 컴포넌트 안에서 atom을 다시 사용할 때는 atom의 실제 Figma variant와
public prop 조합을 먼저 확인한다.

- Nested instance가 DS atom이면 CSS `scale()`, percentage sizing, 임의 width/height로
  줄이거나 키우지 않는다.
- Parent component size마다 nested atom의 variant/size prop이 달라질 수 있다.
  representative size 하나만 보고 전체 table을 추정하지 않는다.
- Source note에 parent size, nested atom component, nested atom variant/size,
  frame size, offset, visibility prop을 표로 기록한다.
- 조합 컴포넌트는 nested atom의 public props로 구성한다. 예:
  `Avatar host`는 host circle을 직접 그리는 것이 아니라 `[V2] Avatar`
  `Type=Circle`, `Size=Small/XSmall/XXSmall` 조합으로 기록하고 구현한다.
- Figma가 nested instance 대신 override frame, vector, image fill로 표현한 경우에는
  atom composition으로 승격하지 않고 `Known Gaps` 또는 asset/shape classification에
  기록한다.
- Nested atom의 internal props는 Storybook Controls에 노출하지 않는다. Parent가
  공개한 Figma-facing prop만 Controls에 노출한다.
- Pixel diff에서 nested atom 크기가 맞지 않으면 먼저 nested atom mapping table을
  확인한다. renderer noise나 parent CSS 문제로 넘기지 않는다.

## Sizing Interpretation

- Figma의 sample rendered size는 특정 label, props, assets 조합의 결과값이다.
- CSS sizing contract는 sample size가 아니라 Figma layout sizing에서 온다:
  `hug content`, `fill`, `fixed`, min/max constraints, text wrapping, padding,
  gap, asset frame dimensions.
- `hug content` 또는 text-driven component는 sample width/height를 CSS
  `width`, `min-width`, `height`, `min-height`로 승격하지 않는다.
- 고정값은 Figma에 fixed sizing, explicit min/max constraint, token, 또는
  description layout rule로 존재할 때만 사용한다.
- Pixel diff size mismatch가 나면 먼저 wrapper/baseline 환경과 layout sizing을
  확인한다. 그 다음 padding, gap, font mapping, wrapping, asset frame을 조정한다.
- Default screenshot 크기를 맞추기 위해 component 자체에 임시 fixed/min size를
  넣지 않는다. 필요한 경우 story-only visual wrapper로 분리하고 source note에
  기록한다.

## Font Mapping

- Figma dev data의 `fontFamily`는 rendered baseline의 일부로 본다.
- concrete `fontFamily`는 다음 중 하나로 분류한다:
  `actual-font`, `system-alias`, `token-alias`, `unknown`.
- `system-alias`는 실제 font file이 아니라 Figma가 system stack을 표현하기 위해
  붙인 이름일 수 있다. 예: `WeGothicSans`는 macOS SF / Apple SD Gothic 계열
  표현으로 취급한다.
- actual font이거나 local macOS/system/runtime에서 해석되는 system alias면
  token보다 앞에 둔다.
- system alias 뒤에는 의미가 가까운 system fallback을 먼저 두고, 그 뒤에 token
  fallback을 둔다.
- 사용 가능 여부가 불확실하면 source note `Font Mapping Notes`에 확인 상태를
  남긴다.
- concrete font를 사용할 수 없어서 token fallback을 쓰면 `Known Gaps`와
  visual diff risk로 기록한다.
- diff가 text pixels에 집중되고 size/color/background가 맞으면 먼저
  `font-rendering` 또는 `token-mapping`으로 분류한다.

## Alpha Token Policy

- Figma API may expose alpha-token paints as solid RGB plus paint opacity.
- When a paint has `boundVariables`, resolve the token first. If the token name
  already encodes alpha (`*-100a`, `*-300a`, etc.), use the CSS variable only.
- Do not combine an alpha token with CSS `opacity`, because it creates double
  alpha and lowers contrast.
- Use CSS `opacity` only when opacity is not represented by a bound token or
  when the source note records it as a separate layer/part opacity.
- If raw Figma opacity and alpha token semantics appear to conflict, record the
  decision in `Token vs Rendered Pixel Notes` before changing CSS.

## Token vs Pixel Mismatch Priority

토큰 사용 여부와 pixel diff 결과가 충돌하면 아래 순서로 판단한다.

1. `visual-environment`: baseline scale, DPR, transparent background,
   Storybook wrapper padding, font load가 맞는지 먼저 확인한다.
2. `token-mapping`: Figma bound token과 source note token mapping이 실제로
   같은지 확인한다.
3. `component-css`: token mapping이 맞는데 rendered px가 다르면 component
   CSS, box model, border 포함 방식, font, wrapping, intrinsic sizing을
   조정한다.
4. `token-or-figma-spec-gap`: token value 자체와 Figma rendered component가
   구조적으로 충돌하면 조용히 하드코딩하지 않고 source note `Known Gaps`와
   `history/`에 기록한다.

판단 원칙:

- color, spacing, typography의 의미값은 token을 우선한다.
- 최종 component size, layout, radius, background 재현은 Figma rendered
  baseline을 우선한다.
- 단, rendered baseline의 sample size는 layout sizing과 constraints를 통과해
  해석한 뒤 CSS에 반영한다.
- size mismatch는 renderer noise로 넘기지 않는다.
- pixel diff를 token보다 무조건 우선하지 않는다. 검증 조건과 token mapping을
  검증한 뒤 rendered px를 맞춘다.

## Storybook

필수 stories:

- `Playground`
- variant matrix 또는 주요 variant story
- state matrix 또는 주요 state story
- `FigmaCompare`

판단 기준:

- `Playground`는 단일 component 조작용이다.
- Controls는 Figma-facing props 중심으로 유지한다.
- native/internal props는 숨긴다.
- `FigmaCompare`는 수동 확인용이다. 완료 판정은 pixel diff 하네스가 담당한다.
- `FigmaCompare`는 3x visual baseline을 CSS px 크기로 표시해 작은 atom이 흐려 보이지 않게 한다.
- zoom preview가 필요하면 별도로 두되, zoom preview는 pass/fail 근거가 아니다.
- screenshot URL만 쓰지 않고 `src/figma/baselines/` local baseline을 저장한다.
- visual registry의 `storyId`는 `FigmaCompare`가 아니라 `Playground` 같은 단일
  component story를 사용한다. `FigmaCompare`의 라벨/기준 이미지가 transparent
  region에 겹치면 pixel diff가 거짓으로 커진다.
- 1x layout baseline과 implementation screenshot의 width/height가 다르면 visual diff는 즉시 실패해야 한다.
- 3x visual baseline과 deviceScaleFactor 3 implementation screenshot으로 pixel diff를 실행한다.

## Coverage-Aligned Visual Gate

- visual registry에는 `comparisonScope`와 `isParityGate`를 반드시 기록한다.
- `comparisonScope`는 `full-parity`, `structure-only`, `shell-only` 중 하나다.
- `isParityGate=true`는 `comparisonScope="full-parity"`일 때만 허용한다.
- source note가 `partial`, `deferred`, `partial/default-only`, 또는 registered
  baseline에 영향을 주는 nested gap을 기록하면 `isParityGate=false`로 둔다.
- non-gating entry의 diff 결과는 review signal이다. 완료 보고에서 `PASS`가
  아니라 `INFO/non-gating`으로 설명한다.
- partial shell을 full Figma baseline에 대고 낮은 pixel ratio가 나와도 parity로
  해석하지 않는다. 먼저 missing nested content를 구현하거나 registry scope를
  낮춘다.

## Visual Diff Loop

- `npm run visual:baseline`으로 1x layout baseline, 3x visual baseline, registry metadata를 먼저 확인한다.
- `npm run visual:diff`로 Storybook 1x layout screenshot size gate와 3x visual pixel diff를 실행한다.
- 실패하면 heatmap/report를 보고 원인을 `size/layout/token/asset/font-rendering/baseline-export`로 분류한다.
- size/layout/padding/radius/color/background mismatch는 수정 대상이다.
- font anti-aliasing은 heatmap/report 근거가 있을 때만 `Known Gaps`로 기록한다.
- atom은 최대 3회, 복잡한 component는 최대 5회까지 수정 후 재검증한다.
- loop budget을 넘으면 heatmap/report와 함께 retrospective에 남긴다.
