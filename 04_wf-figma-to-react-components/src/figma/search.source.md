---
status: implemented
---

# Search Source Note

## Figma Identity
- Component: `[V2] Search`
- Node ID: `59722:17972`
- Component key: `cbcd2baf8a758cd859c194359b69faf7fa3e543a`
- Default variant node: `59722:17973`
- Description: `키워드를 입력해 원하는 정보나 결과를 찾는 검색 입력 컴포넌트`

## Variant Axes
- `Mode`: `Default`, `Fixed`
- `State`: `Default`, `Enabled`, `Completed`

## Figma Props
- `Label`: text, default `Search`
- `Mode`: `Default | Fixed`
- `State`: `Default | Enabled | Completed`

## Layout Contract
- Component size: `361x36px`
- Container radius: `24px`
- Container padding: `6px 12px`
- Container gap: `8px`
- Input area gap: `4px`
- Search icon frame: `24x24px`; inner icon area: `16x16px`
- Clear button frame: `24x24px`; visible in `Enabled` and `Completed`
- Clear internal graphic/component bound: `18x18px`, offset `3px` inside the 24px frame

## Token Mapping
- Default surface: `system/color/surface/default-gray-50`
- Fixed surface: `system/fixed_color/surface/default-gray-50`
- Placeholder text default: `system/color/text/300a`
- Placeholder text fixed: `system/fixed_color/text/300a`
- Query text default: `system/color/text/default`
- Query text fixed: `system/fixed_color/text/default`
- Clear button surface default: `system/color/surface/gray-300`
- Clear button surface fixed: `system/fixed_color/surface/gray-300`
- Clear icon default: `system/color/icon/default-reverse`
- Clear icon fixed: `system/fixed_color/icon/default`
- Typography: `WeGothicSans Regular 15px / 21px`

## Font Mapping Notes
- Figma fontFamily: `WeGothicSans`
- Type: `system-alias`
- CSS order: `"WeGothicSans", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", var(--cds-typography-default-font-family-body, Pretendard, ui-sans-serif, system-ui, sans-serif)`
- Decision: `use-system-alias`

## Asset Notes
- Search icon source: `24/em/ic_search_medium`, nested through `icon_area size=xsmall(16), em=On`.
- Clear icon source: `icon/20/ic_delete` / `공통요소 / 인풋박스 / ic_input_X`.
- Clear icon is not `icon_area`; it is a `24x24` delete icon frame with an `18x18` internal graphic bound.
- Current mapping:
  - Search icon: `ChordIcon name="searchMedium"`, Figma node `10177:64481`, exported as `src/assets/icons/ic_search_medium.svg`.
  - Clear icon: `ChordIcon name="deleteMedium"`, Figma node `9146:25310`, exported as `src/assets/icons/ic_delete_medium.svg`; the `24x24` button frame and `18x18` internal graphic area are preserved.
- `icon_area` remains the sizing wrapper interpretation for search only; the clear button is still documented as `24x24 frame + 18x18 internal graphic`, not `icon_area`.

## Known Gaps
- Clear uses the confirmed delete glyph registry entry and does not infer a similar-looking `closeMedium` icon. If the exact `ic_input_X` wrapper asset is exported later, keep the current `24x24 frame + 18x18 internal graphic` contract and swap only the glyph source.
- No opacity is added on top of alpha tokens such as `text/300a`.

## Alpha Token Notes

- N/A for legacy backfill (2026-05-08): explicit evidence for this section was not recorded as a dedicated section in the existing source note.
- Re-read Figma and replace this note with concrete evidence before changing this component contract.

## Text Behavior Notes

- N/A for legacy backfill (2026-05-08): explicit evidence for this section was not recorded as a dedicated section in the existing source note.
- Re-read Figma and replace this note with concrete evidence before changing this component contract.

## Sizing Interpretation Notes

- N/A for legacy backfill (2026-05-08): explicit evidence for this section was not recorded as a dedicated section in the existing source note.
- Re-read Figma and replace this note with concrete evidence before changing this component contract.

## Nested Atom Mapping

- N/A for legacy backfill (2026-05-08): explicit evidence for this section was not recorded as a dedicated section in the existing source note.
- Re-read Figma and replace this note with concrete evidence before changing this component contract.

## Nested Module Inventory

- N/A for legacy backfill (2026-05-08): explicit evidence for this section was not recorded as a dedicated section in the existing source note.
- Re-read Figma and replace this note with concrete evidence before changing this component contract.

## Token vs Rendered Pixel Notes

- N/A for legacy backfill (2026-05-08): explicit evidence for this section was not recorded as a dedicated section in the existing source note.
- Re-read Figma and replace this note with concrete evidence before changing this component contract.
