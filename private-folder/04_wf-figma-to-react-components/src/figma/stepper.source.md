---
status: implemented
---

# Stepper Source Note

## Figma Identity
- Component: `[V2] Stepper`
- Node ID: `61604:4394`
- Component key: `684550ae4653da74717f2599c3da1bb7b7640d73`
- Default variant node: `61604:4395`
- Description: `상품 수량처럼 작은 범위의 숫자 값을 직접 입력하거나 감소와 증가 버튼으로 조정하는 입력 컴포넌트`

## Variant Axes
- `Mode`: `Default`, `Fixed`
- `State`: `Default`, `Disabled`, `Enabled`

## Figma Props
- `Caret`: boolean, default `false`
- `Label`: text, default `99`
- `Mode`: `Default | Fixed`
- `State`: `Default | Disabled | Enabled`
- `value_range`: `0-99`

## Layout Contract
- Component size: `104x28px`
- Layout: horizontal
- Subtract button: `28x28px`
- Number field: `48x28px`
- Add button: `28x28px`
- Gap: `0px`
- Stroke weight: `1px`
- Number typography: `WeGothicSans Regular 15px / 21px`
- Caret: `1.5x12px`

## State Interpretation
- `State=Default`: minimum-edge sample. Subtract is disabled, add is enabled.
- `State=Enabled`: subtract and add are both enabled.
- `State=Disabled`: subtract, number, and add are disabled.
- Label must stay in the two-digit usage contract.

## Token Mapping
- Default outline: `system/color/outline/default-200a`
- Fixed outline: `system/fixed_color/outline/default-200a`
- Disabled surface default: `system/color/surface/gray-75`
- Disabled surface fixed: `system/fixed_color/surface/gray-75`
- Number text default: `system/color/text/default`
- Number text fixed: `system/fixed_color/text/default`
- Disabled number text default: `system/color/text/200a`
- Disabled number text fixed: `system/fixed_color/text/200a`
- Subtract default-state icon: `system/color/icon/200a` or `system/fixed_color/icon/200a`
- Enabled action icon: `system/color/icon/default` or `system/fixed_color/icon/default`
- Disabled action icon: `system/color/icon/200a` or `system/fixed_color/icon/200a`

## Asset Notes
- Subtract icon source: `24/em/ic_subtract_medium`, `16x16 icon_area`, mapped as `ChordIcon name="subtractMedium"` from Figma node `15196:1089`.
- Add icon source: `24/em/ic_add_medium`, `16x16 icon_area`, mapped as `ChordIcon name="addMedium"` from Figma node `10177:64611`.
- Do not replace these icons with text glyphs.

## Known Gaps
- No known icon asset gap for add/subtract after `src/assets/chord-icons.tsx` mapping.

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
