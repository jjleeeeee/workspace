---
status: implemented
---

# Menu Source Note

## Figma Identity
- Component: `[V2] Menu`
- Node ID: `25963:37235`
- Component key: `f1e30b43648b4839e2cd69b1de633dd29a408fed`
- Default variant node: `25963:37236`
- Description: `현재 맥락에서 선택 가능한 여러 액션이나 항목을 짧게 보여주는 오버레이 선택 컴포넌트`

## Variant Axes
- `Mode`: `Default`, `Fixed`

## Figma Props
- `mode`: default `Default`
- `item_count` -> code `itemCount`: default `9`
- `position`: `top | bottom | center`, default `bottom`; placement is consumer-owned, not a Figma variant axis.
- `max_height`: default `370`

## Layout Contract
- Live panel size: `240x370px`
- Figma export baseline size: `288x418px`
- Export size includes shadow bounds. The component panel remains `240x370px`; the Storybook visual harness captures an outer shadow box for diff.
- Container padding: `4px 0px`
- Container radius: `8px`
- Row sample count: `9`
- Row source: `[V2] List_Item_Native`
- Code row branch: `ListItemNative size="small"`, `inlineSize=240`, `showBodyText=false`, `showSmallLeading=false`, `showMediumLeading=false`, `showTrailing=false`, `showDivider=false`
- Code compact row height: `40px`; this is a ListItemNative compact title-only branch used by Menu, not private Menu row CSS.
- `itemCount=9` gives 9 title-only rows inside the `240x370` panel.

## Token Mapping
- Default surface: `system/color/surface/default-4`
- Fixed surface: `system/fixed_color/surface/gray-100`
- Scrollbar thumb default: `system/color/surface/default-reverse-200a`
- Scrollbar thumb fixed: `system/fixed_color/surface/default-reverse-200a`
- Row text, padding, status, and typography are owned by `[V2] List_Item_Native`.

## Composition Notes
- Figma composes `[V2] List_Item_Native` rows and optionally a `Scrollbar`.
- Menu is a container-only component: surface, shadow bounds, max height, clipping, placement metadata, and optional `Scrollbar`.
- Rows are composed with `ListItemNative` compact title-only branch.
- Menu does not own row typography, row padding, leading/trailing modules, title/body text internals, or row status visuals.
- Disabled item state maps to `aria-disabled=true` on the menuitem and `ListItemNative status="disabled"`.
- Overflow uses DS `Scrollbar`, not a native browser scrollbar.

## Asset Notes
- No icon asset is required by the default Menu sample.
- Any future leading/trailing row asset belongs to `List_Item_Native`, not the Menu container.

## Known Gaps
- Visual diff can be affected by the shadow export bounds; layout size and export size must be evaluated separately.
- Menu FigmaCompare validates container plus default compact row composition only. It does not claim full `ListItemNative` branch parity.

## Alpha Token Notes

- N/A for legacy backfill (2026-05-08): explicit evidence for this section was not recorded as a dedicated section in the existing source note.
- Re-read Figma and replace this note with concrete evidence before changing this component contract.

## Font Mapping Notes

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
