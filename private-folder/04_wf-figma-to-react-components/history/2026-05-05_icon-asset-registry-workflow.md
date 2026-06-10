# 2026-05-05 Icon Asset Registry Workflow

## Decision

Chord DS icon은 component별로 임의 구현하지 않고, Figma icon library 전체 export와
`src/assets/chord-icons.tsx` registry를 기준으로 관리한다.

## Reason

- `icon_area`를 실제 SVG asset으로 오해하는 일이 반복됐다.
- CSS drawing이나 inline replacement SVG가 Storybook에서는 그럴듯해도 visual diff와
  asset parity에서 실패할 수 있다.
- Component마다 icon을 새로 찾는 방식은 source note와 Storybook 문구가 쉽게
  오래된 상태로 남는다.

## Rule

- Figma icon library source는 node `10219:78691`이다.
- SVG는 `src/assets/icons/`에 저장한다.
- Registry는 `src/assets/chord-icons.tsx`에서 관리한다.
- Component는 mapped DS icon을 직접 SVG import하지 않고 `ChordIcon name="..."`
  으로 사용한다.
- Registry miss는 export/registry 추가 또는 source note
  `missing-icon-registry-entry` gap으로 남긴다.
- visual diff 실패는 `asset-registry`, `icon-area-sizing`, `svg-rendering`으로
  분류할 수 있어야 한다.
