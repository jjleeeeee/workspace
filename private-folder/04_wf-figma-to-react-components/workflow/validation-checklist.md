---
type: WorkflowReference
status: Draft
version: 1.0
updated: 2026-05-08
---

# Validation Checklist

이 문서는 component 작업 완료 전에 확인할 검증 gate를 정의한다.

## Commands

```bash
npm test
npm run typecheck
npm run build-storybook
npm run visual:baseline
npm run visual:diff
npm run rules:audit
npm run knowledge:audit
```

Storybook static server:

```bash
python3 -m http.server 7008 -d storybook-static
```

## Browser Smoke

- target story가 렌더된다.
- Controls가 Figma-facing props만 노출한다.
- component console error가 0개다.
- 대표 component의 computed style이 source note의 핵심 치수와 큰 방향에서 맞다.
- `FigmaCompare` 또는 screenshot baseline으로 육안 검증이 가능하다.
- 1x layout baseline과 Storybook actual screenshot의 size gate가 통과한다.
- 3x visual baseline과 Storybook actual screenshot의 pixel diff가 통과한다.
- visual registry의 `comparisonScope`와 `isParityGate`가 source note의
  coverage와 일치한다.
- diff 실패 시 heatmap/report를 보고 원인을 분류하고 재검증 loop를 돈다.

Diff 실패 분류:

- `visual-environment`: baseline scale, DPR, transparent background,
  Storybook wrapper, font load 문제
- `token-mapping`: Figma bound token과 source note/code token mapping 불일치
- `component-css`: box model, border, padding, intrinsic sizing, layout 구현 문제
- `font-rendering`: font family/load/anti-aliasing 차이
- `asset-gap`: icon/loading/image/logo/badge asset 미확보 또는 placeholder 문제
- `asset-registry`: SVG 파일, `chord-icons` metadata, `ChordIcon` 사용 누락
- `component-fallback`: no-image/empty/loading fallback을 consumer `src` sample이나
  screenshot media로 잘못 구현함
- `icon-area-sizing`: `icon_area` wrapper size와 glyph usage size 해석 오류
- `svg-rendering`: raw inline SVG/currentColor/rendering 방식 문제
- `token-or-figma-spec-gap`: token value와 Figma rendered component의 구조적 충돌

Size/layout diff 확인 질문:

- Figma layout sizing이 `hug`, `fill`, `fixed` 중 무엇인지 source note에
  기록되어 있는가?
- mismatch를 CSS fixed/min size로 고치기 전에 text wrapping, max width,
  padding, gap, font mapping, asset frame dimensions를 확인했는가?
- sample rendered width/height를 component contract로 착각하지 않았는가?
- `hug content` component라면 label 길이에 따라 width가 변하는 story/test가
  있는가?
- baseline parity용 wrapper가 필요하면 component CSS가 아니라 story-only wrapper로
  분리했는가?
- no-image/empty fallback이면 Figma screenshot 전체가 아니라 nested fallback
  asset의 실제 bound와 alignment를 확인했는가?
- fallback mark/logo가 parent ratio frame에 stretch되지 않는가?

최소 computed style:

- representative height/width/radius/padding
- representative typography
- representative color token
- 주요 state에서 DOM state와 visual state 일치

## Done Checklist

- [ ] `index.md`에서 node id/key만 확인했다.
- [ ] variant detail markdown 파일을 읽지 않았다.
- [ ] Framelink/Figma MCP로 component set properties를 읽었다.
- [ ] Framelink/Figma MCP로 representative child node를 읽었다.
- [ ] Console MCP로 component metadata를 읽었다.
- [ ] 1x layout baseline과 3x visual baseline을 확보했다.
- [ ] `src/figma/<component>.source.md`를 먼저 작성했다.
- [ ] source note에 representative node 범주와 누락 범주를 기록했다.
- [ ] placeholder 사용 범위와 production asset gap을 기록했다.
- [ ] asset-backed visual을 text나 CSS drawing으로 조용히 대체하지 않았다.
- [ ] asset-backed icon이 있으면 `chord-icons` registry entry를 확인했다.
- [ ] 새 icon이면 SVG 파일과 registry metadata를 함께 추가했다.
- [ ] `icon_area`를 SVG asset이 아니라 sizing wrapper로 기록했다.
- [ ] Figma `Specialtype` 또는 `_special` icon이면 original color mode로 렌더된다.
- [ ] nested atom이 있으면 Figma nested instance의 variant/size prop을 확인했다.
- [ ] nested atom을 CSS scale/percentage/임의 width-height로 축소 또는 확대하지 않았다.
- [ ] parent size별 nested atom size가 다르면 source note에 mapping table을 기록했다.
- [ ] Figma layout sizing과 sample rendered size를 분리해서 기록했다.
- [ ] sample rendered size를 CSS fixed/min size로 승격하지 않았다.
- [ ] Storybook에서 asset placeholder 상태를 확인할 수 있다.
- [ ] token CSS 출력 순서와 mode override를 확인했다.
- [ ] tests를 먼저 작성하고 component contract를 확인했다.
- [ ] Storybook Controls에서 internal/native props를 숨겼다.
- [ ] `npm test`를 실행했다.
- [ ] `npm run typecheck`를 실행했다.
- [ ] `npm run build-storybook`을 실행했다.
- [ ] `npm run visual:baseline`을 실행했다.
- [ ] `npm run visual:diff`를 실행했다.
- [ ] `npm run rules:audit`를 실행했다.
- [ ] `npm run knowledge:audit`를 실행했다.
- [ ] visual registry `storyId`가 `FigmaCompare`가 아니라 단일 component story를 가리킨다.
- [ ] browser smoke를 실행했다.
- [ ] visual registry가 `comparisonScope`와 `isParityGate`를 명시하고,
      partial/deferred coverage를 full-parity gate로 보고하지 않는다.
- [ ] visual diff 결과와 한계를 완료 보고에 남겼다.
- [ ] diff 실패 원인을 위 분류 중 하나로 기록했다.
- [ ] workflow decision은 `history/`, component learning은 `retrospectives/`에 기록했다.

## Completion Report

```md
완료:
- `<Component>` 구현
- source note: `src/figma/<component>.source.md`
- Storybook: `http://127.0.0.1:7008/?path=/story/...`

검증:
- `npm test` pass
- `npm run typecheck` pass
- `npm run build-storybook` pass
- `npm run visual:baseline` pass
- `npm run visual:diff` pass
- `npm run rules:audit` pass
- `npm run knowledge:audit` pass
- browser smoke pass
- component console error 0

기록:
- history 또는 retrospective path

남은 한계:
- production asset, 미확인 variant gap, 또는 visual diff known gap
```
