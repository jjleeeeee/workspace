---
type: WorkflowGuide
status: Draft
version: 1.0
updated: 2026-05-05
---

# Icon Asset Registry

이 문서는 Chord DS icon asset을 Figma에서 export하고 React component에서
일관되게 사용하는 절차다. 목적은 component마다 icon을 임의 SVG, text glyph,
CSS drawing으로 다시 만드는 일을 막는 것이다.

## Source

- Figma icon library source: node `10219:78691`
- SVG export directory: `src/assets/icons/`
- React registry: `src/assets/chord-icons.tsx`
- Registry renderer: `ChordIcon`

## Registry Contract

각 icon entry는 다음 metadata를 가져야 한다.

| Field | Meaning |
| --- | --- |
| `name` | code에서 쓰는 stable icon name |
| `sourceName` | Figma component name, 예: `24/em/ic_search_medium` |
| `nodeId` | Figma icon component node id |
| `figmaKey` | Figma icon component key |
| `frameSize` | exported SVG source frame size |
| `svg` | raw SVG import |
| `colorMode` | optional. `currentColor` for monochrome icons, `original` for color-preserving icons |

`icon_area`는 SVG asset이 아니다. `icon_area`는 wrapper/sizing contract이고,
실제 glyph는 `ChordIcon` registry entry에서 온다.

## Asset Classification Gate

Icon registry를 보기 전에 시각 요소를 먼저 분류한다.

| Classification | Decision |
| --- | --- |
| `icon component` | Figma 구조상 icon component로 확인된 glyph만 `ChordIcon`으로 매핑한다. |
| `icon_area wrapper` | asset이 아니라 wrapper/sizing contract로 기록한다. |
| `component state shape` | pagination ellipsis, tooltip caret, progress ring, radio dot처럼 component 상태/도형이면 registry 대상이 아니다. |
| `component fallback` | consumer content가 없을 때 component가 렌더하는 fallback이다. `src` sample로 넣지 말고 fallback state로 구현하며, nested mark/logo bound를 따른다. |
| `placeholder` | 임시 범위와 production 교체 조건을 source note에 기록한다. |
| `unknown` | 임의 매핑하지 않고 slot-only 또는 `Known Gaps`로 둔다. |

Shape similarity is not evidence. 비슷한 모양의 SVG가 icon library에 있어도
Figma 구조나 description에서 icon asset으로 확인되지 않으면 `ChordIcon`으로
매핑하지 않는다.

Figma screenshot 전체를 media fixture로 쓰지 않는다. Component fallback은
trigger state와 nested asset을 분리해서 구현하고, screenshot은 visual reference로만
사용한다.

## Export Flow

1. Figma icon library node `10219:78691`에서 target icon component의
   `sourceName`, `nodeId`, `figmaKey`, source frame size를 확인한다.
2. SVG를 `src/assets/icons/`에 저장한다. 파일명은 Figma source name을
   kebab/snake 형태로 유지한다.
3. `src/assets/chord-icons.tsx`에 raw SVG import와 metadata entry를 추가한다.
4. component에서는 SVG 파일을 직접 import하지 않고 `ChordIcon name="..."`만
   사용한다.
5. source note의 Asset Notes에 registry hit/miss와 `icon_area` size를 기록한다.

## Implementation Rules

- Component code must not directly import `src/assets/icons/*.svg`.
- Component code uses `ChordIcon` for mapped DS icons.
- `ChordIcon size`는 사용 위치의 `icon_area` 또는 internal graphic size를 따른다.
- Registry `frameSize`는 source SVG frame이고, component usage `size`와 분리한다.
- Figma `Specialtype` icons and `_special` SVG files preserve original SVG colors.
  They must not be forced to black/currentColor.
- Normal monochrome icons use `currentColor` unless the registry entry explicitly
  marks `colorMode: "original"`.
- Missing icon은 silent fallback하지 않는다. Registry miss는 export/registry 추가
  또는 source note `Known Gaps`의 `missing-icon-registry-entry`로 남긴다.
- CSS drawing, text glyph, emoji icon은 production implementation으로 보고하지 않는다.

## Validation

- Known icon name renders inline SVG.
- Unknown icon name fails loudly.
- SVG file and registry metadata are added together.
- Storybook docs/source note에서 mapped asset인지 placeholder인지 확인할 수 있다.
- visual diff 실패는 `asset-registry`, `icon-area-sizing`, `svg-rendering` 중
  하나로 우선 분류한다.
