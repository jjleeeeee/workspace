---
status: implemented
---

# Thumbnail Source Note

## Figma Identity
- Component: `[V2] Thumbnail`
- Node ID: `50545:51014`
- Component set key: `d0a05143f1a3867b7d8d30eacf939b885d41e0eb`
- Description: `콘텐츠 대표 이미지를 정해진 비율, 반경, 선택 오버레이와 함께 표시하는 미디어 썸네일 컴포넌트`

## Figma Reads
- `index.md`: component address only, node `50545:51014`, key `d0a05143f1a3867b7d8d30eacf939b885d41e0eb`.
- `get_context_for_code_connect(50545:51014)`: parent props, variant axes, descendant module tree.
- `get_design_context(50545:51014)`: layout, generated reference, description payload, rendered screenshot.
- `get_design_context(63529:131799)`: Figma placeholder examples for no-image Thumbnail states.
- `get_screenshot(63529:131799)`: placeholder visual reference matrix.
- `get_screenshot(60779:56301)`: `Type=Thumbnail, Ratio=1:1, Radius=on` FigmaCompare reference.
- `framelink(60355:25745)`: `_atoms / modules / Center Button`.
- `framelink(60355:25688)`: `_atoms / modules / Left Item (Optional)`.
- `framelink(60355:25695)`: `_atoms / modules / Right Item_Top (Optional)`.
- `framelink(60376:15368)`: `_atoms / modules / Right Item_Bottom (Optional)`.

## Variant Axes
- `Type`: `Thumbnail` only.
- `Ratio`: `1:1`, `3:4`, `5:6`, `5:8`, `9:16`, `16:9`.
- `Radius`: `off`, `on`.
- Variant count: `12`.

## Figma Boolean Props
- `Fill`: default `false`.
- `Button`: default `false`.
- `Left Item`: default `false`.
- `Right Item_top`: default `false`.
- `Right Item_bottom`: default `false`.
- `Seek bar`: default `false`.

## Layout Contract
- Reference width: `256px`.
- Ratio sizes:
  - `16:9`: `256x144`
  - `3:4`: `256x340`
  - `1:1`: `256x256`
  - `5:8`: `256x410`
  - `5:6`: `256x307`
  - `9:16`: `256x455`
- Minimum width: `44px`.
- Ratio-derived decimal heights are rounded down.
- Radius: `off=0px`, `on=8px`.
- Clipping stays enabled for both radius values.
- `width` is code-facing. It scales the reference ratio; it is not a Figma variant axis.

## Nested Module Contract
- `Fill`: `_atoms / modules / Fill`, nested type `Scrim Overlay`; fills selected ratio frame.
- `Button`: `buttonType` is owned by `_atoms / modules / Center Button`; nested types `Play`, `Text`; default `Play`; frame `48x48`.
- `Left Item`: `leftItemType` and `leftItemShowTag` are owned by `_atoms / modules / Left Item (Optional)`; nested types `Double Icon`, `Single Icon`; default `Double Icon`; padding `8`, gap `4`, icon slots `20x20`, optional `Tag Size=Medium, Type=Fill, Shape=Squircle, Color=Primary`.
- `Right Item_top`: `rightItemTopType` is owned by `_atoms / modules / Right Item_Top (Optional)`; nested types `Double Icon`, `Single Icon`, `CheckBox`; default `Double Icon`; padding `8`, gap `4`, icon slots `20x20`.
- `Right Item_bottom`: `rightItemBottomType` and `rightItemBottomShowIcon` are owned by `_atoms / modules / Right Item_Bottom (Optional)`; nested types `Text Large`, `Text Small`, `Timer Large`, `Timer Small`; default `Text Large`; bottom/right padding `8`, gap `2`.
- `Seek bar`: bottom progress state, height `2`.

## Token Mapping
- Fill scrim: `system/fixed_color/surface/default-400a`.
- Seek bar track: `system/fixed_color/surface/default-reverse-300a`.
- Seek bar streaming: `system/fixed_color/status/danger-red`.
- Right item text: `system/fixed_color/text/default`, `caption-m/system-700` or `caption-xs/system-700`.
- Left item tag: compose `Tag size=medium tagType=fill shape=squircle color=primary`.
- Center button icon: `system/fixed_color/icon/default`.
- Typography font: `WeGothicSans` system alias before OS and token fallback.

## Asset Classification
- `image_content`: consumer-provided media. The component renders a deliberate no-image placeholder only when `src` is absent.
- `no-image placeholder`: Figma-backed placeholder from node `63529:131799`; local fixtures:
  - `src/figma/fixtures/thumbnail-placeholder-wordmark-large.svg`
  - `src/figma/fixtures/thumbnail-placeholder-wordmark-small.svg`
  - `src/figma/fixtures/thumbnail-placeholder-symbol.svg`
- Placeholder mark selection:
  - `width < 200`: compact `symbol` mark.
  - `Ratio=5:6` or `Ratio=5:8` at default width: small wordmark.
  - all other default-width ratios: large wordmark.
- Placeholder mark sizing must use the Figma vector bounds, not intrinsic image stretching:
  - large wordmark: `106x15.099px`
  - small wordmark: `88x12.64px`
  - symbol: `20x12.012px`
- Do not use the placeholder SVG as `object-fit: cover` media content. Each Thumbnail ratio owns its frame size; the placeholder mark is centered inside that frame at its own fixed bound.
- `icon_area`: wrapper, not an SVG asset.
- `Left Item` and `Right Item_top` icon defaults: Figma readback uses `ic_null_medium`; treat as null marker default, not product icon choice.
- `Center Button / Play`: confirmed DS icon `24/em/ic_play_fill_medium`, node `33543:6427`; use `ChordIcon` registry.
- `Right Item_top / CheckBox`: nested module is backed by `[V2] Checkbox`; render with `Checkbox mode=fixed checkboxType=circle status=default`.

## Storybook Contract
- `Playground`: parent Thumbnail props plus owned nested enum props.
- Default Storybook args intentionally omit `src` so the Figma placeholder fallback is visible.
- `Ratios`: all six ratios at 256px reference width.
- `OverlayModules`: boolean module examples.
- `NestedEnums`: explicit nested enum matrix for Left Item, Right Item_top, Right Item_bottom, and Button.
- `FigmaCompare`: manual review support only.
- `FigmaCompare` must show `src/figma/baselines/thumbnail-default.png` next to the current implementation.
- Visual registry is deferred until a deterministic reference media policy is available. The current Figma baseline contains concrete media, while the component default intentionally renders the Figma no-image placeholder.
- No parent composition examples such as List Item usage inside Thumbnail stories.

## Known Gaps
- Visual registry registered as `structure-only` / `isParityGate: false` for `ratio=1:1, width=256`. Baseline (`thumbnail-default.png`) is a Figma concrete-media export; component renders no-image placeholder → visualDiff=98.4%, expected and non-blocking.
- Module overlay states (fill, button, left/right items, seek bar) have no registered baseline variants.
- Full pixel-parity diff requires deterministic media policy (consumer `src` or injected fixture image).
- Product-specific overlay icons should be supplied through icon slots. Null marker defaults are visible only as placeholder/null state.

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
