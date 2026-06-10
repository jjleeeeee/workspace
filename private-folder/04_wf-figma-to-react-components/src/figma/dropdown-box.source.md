---
status: implemented
---

# Dropdown Box Source Note

## Figma Identity
- Component: `Dropdown_Box`
- Node ID: `60730:9605`
- Component set key: `97601b8a3636233ad6892ba3ecb2fa22f59e9546`
- Description: `제공된 선택 항목 중 하나를 고르기 위한 입력형 선택 컴포넌트`

## Figma Reads
- `index.md`: component address only, node `60730:9605`, key `97601b8a3636233ad6892ba3ecb2fa22f59e9546`.
- `figma_get_component(60730:9605, enrich=true)`: variant axes, all 14 variants, props, tokens, assets, layout, composition, implementation order.
- `get_design_context(60730:9606)`: rendered screenshot (Mode=Default, State=Default), typography, visual reference.
- Figma REST image export: `60730:9606`, scale `1` and `3` — local baselines captured 2026-05-08.
- `variant-keys/dropdown-box.md`: variant key registry cross-check.

## Variant Axes
- `Mode`: `Default`, `Fixed`.
- `State`: `Default`, `Pressed (Hover)`, `Enabled_Down`, `Enabled_Up`, `Completed`, `Error`, `Disabled`.
- Variant count: `14` (2 × 7, all combinations implemented).
- `Enabled_Down` = open list below input. `Enabled_Up` = open list above input.

## React Props (Figma property → camelCase code prop)
- `Mode` → `mode`: `"default" | "fixed"`, default `"default"`.
- `State` → `state`: `"default" | "pressed" | "enabled-down" | "enabled-up" | "completed" | "error" | "disabled"`, default `"default"`.
- `Label_Title` → `titleLabel`: string, default `"Title"`.
- `Label_Guide` → `guideLabel`: string, default `"Guide Message"`.
- `Label_Text` → `textLabel`: string, default `"Select Option"`.
- `Show_Title` → `showTitle`: boolean, default `true`.
- `Show_Guide` → `showGuide`: boolean, default `true`.
- `Show_Scrollbar` → `showScrollbar`: boolean, default `true`.
- `Show_Badge_Dot` → `showBadgeDot`: boolean, default `true`.
- `children`: `ReactNode`, option rows rendered inside the open menu panel (Enabled_Down / Enabled_Up states only).

## Layout Contract
- Shell: `width: 393px`, `padding: 0 16px`, `box-sizing: border-box`.
- Vertical gap between parts: `6px`.
- Title row: `width: 361px`, `height: 18px`, `padding: 0 4px`.
  - Title text + Badge_Dot inline with `gap: 2px`.
- Input field: `width: 361px`, `height: 46px`, `padding: 12px 16px`, `border-radius: 8px`.
  - Content direction: horizontal, `gap: 8px`.
- Guide message: `width: 361px`, `height: 17px`, `padding: 0 4px`.
- Dropdown menu: `width: 361px`, `height: 262px`, `border-radius: 8px`.
  - List item area: `361 × 216px` (remaining space is scrollbar area).
  - Enabled_Down: menu appears directly below the input field.
  - Enabled_Up: menu appears directly above the input field.
- Arrow icon: `16 × 16px`, rendered as `ChordIcon`.

## Token Mapping
- Title text (Default): `system/color/text/400a` → `--cds-system-color-text-400a` (`#00000080`).
- Title text (Fixed): `system/fixed_color/text/400a` → `--cds-system-fixed-color-text-400a` (`#ffffff80`).
- Title pressed text (Fixed): `system/fixed_color/text/gray-600` → `--cds-system-fixed-color-text-gray-600` (`#999999`).
- Input stroke (inactive, Default): `system/color/status/inactive-gray` → `--cds-system-color-status-inactive-gray` (`#dcdee4`).
- Input stroke (inactive, Fixed): `system/fixed_color/status/inactive-gray` → `--cds-system-fixed-color-status-inactive-gray` (`#3e3e3e`).
- Input stroke (focus/open, Default): `system/color/status/focus-gray-400` → `--cds-system-color-status-focus-gray-400` (`#aeb1b8`).
- Input stroke (focus/open, Fixed): `system/fixed_color/status/focus-gray-400` → `--cds-system-fixed-color-status-focus-gray-400` (`#555555`).
- Input stroke (error, Default): `system/color/status/danger-red` → `--cds-system-color-status-danger-red` (`#fe5b58`).
- Input stroke (error, Fixed): `system/fixed_color/status/danger-red` → `--cds-system-fixed-color-status-danger-red` (`#fe5b58`).
- Input surface (pressed, Default): `system/color/surface/default-reverse-50a-2` → `--cds-system-color-surface-default-reverse-50a-2` (`#0000000a`).
- Input surface (pressed, Fixed): `system/fixed_color/surface/default-reverse-100a` → `--cds-system-fixed-color-surface-default-reverse-100a` (`#ffffff1a`).
- Input surface (disabled, Default): `system/color/status/background-disabled` → `--cds-system-color-status-background-disabled` (`#f2f3f7`).
- Input surface (disabled, Fixed): `system/fixed_color/status/background-disabled` → `--cds-system-fixed-color-status-background-disabled` (`#1f1f1f`).
- Label text (enabled/completed, Default): `system/color/text/default` → `--cds-system-color-text-default` (`#000000`).
- Label text (enabled/completed, Fixed): `system/fixed_color/text/default` → `--cds-system-fixed-color-text-default` (`#ffffff`).
- Label text (disabled, Default): `system/color/text/200a` → `--cds-system-color-text-200a` (`#00000033`).
- Label text (disabled, Fixed): `system/fixed_color/text/200a` → `--cds-system-fixed-color-text-200a` (`#ffffff33`).
- Error guide message: `system/fixed_color/roles/negative` → `--cds-system-fixed-color-roles-negative` (`#fe5b58`).
- Dropdown menu surface (Default): `system/color/surface/default-4` → `--cds-system-color-surface-default-4` (`#ffffff`).
- Dropdown menu surface (Fixed): `system/fixed_color/surface/default-4` → `--cds-system-fixed-color-surface-default-4` (`#282828`).
- Dropdown divider (Default): `system/color/outline/default-50a-2` → `--cds-system-color-outline-default-50a-2` (`#0000000a`).
- Dropdown divider (Fixed): `system/fixed_color/outline/default-100a` → `--cds-system-fixed-color-outline-default-100a` (`#ffffff1a`).
- Scrollbar thumb (Default): `system/color/surface/default-reverse-200a` → `--cds-system-color-surface-default-reverse-200a` (`#00000033`).
- Scrollbar thumb (Fixed): `system/fixed_color/surface/default-reverse-200a` → `--cds-system-fixed-color-surface-default-reverse-200a` (`#ffffff33`).
- Badge Dot: `system/color/status/danger-red`; delegated to `BadgeDot` component.

## Asset Classification
- `ic_arrow_down_medium`: closed states (Default, Pressed, Completed, Error, Disabled); `16×16px`; registered as `arrowDownMedium` in `chord-icons.tsx`.
- `ic_arrow_down_fold_medium`: open states (Enabled_Down, Enabled_Up); `16×16px`; registered as `arrowDownFoldMedium` in `chord-icons.tsx`.
- `icon_area` is a wrapper container, not an SVG asset.
- Arrow icons communicate open/closed state and must remain icon assets — do not redraw with CSS.
- `Badge_Dot`: Figma-backed component; rendered via `BadgeDot` component (mode=small, outline=off).

## Nested Module Contract
- `Badge_Dot`: rendered via `<BadgeDot mode={mode} size="small" />` when `showBadgeDot=true` and `showTitle=true`.
- `[V2] List_Item_Native`: rendered through `children` prop in the open menu panel; spec owned by `ListItemNative` component set.
- `[V2] Divider`: rendered through `children` prop; spec owned by `Divider` component set.
- `Scrollbar`: rendered via `<Scrollbar mode={scrollbarMode} />` when `showScrollbar=true` and state is open.
  - `scrollbarMode`: `"fixed-white"` when `mode="fixed"`, else `"default"`.
- Nested coverage: `partial/open-menu-deferred` — option rows, dividers, and scrollbar are passed via `children`; their internal specs are not duplicated here.

## Storybook Contract
- `Playground`: all Figma-facing props with Controls enabled.
- `States`: closed states matrix (Default, Pressed, Completed, Error, Disabled) at mode=default.
- `Modes`: side-by-side Default vs Fixed at state=default.
- `OpenStates`: Enabled_Down and Enabled_Up with sample children option rows.
- `FigmaCompare`: manual review support; `src/figma/baselines/dropdown-box-default@3x.png` displayed at CSS size `393x93` next to current implementation.
- Storybook Controls expose only Figma-facing props: `mode`, `state`, `showTitle`, `showGuide`, `showBadgeDot`, `showScrollbar`.
- `titleLabel`, `guideLabel`, `textLabel` are not in Controls (text-content props, not Figma variant axes).
- Visual registry id: `dropdown-box-default`.
- Visual registry scope: `comparisonScope="structure-only"`, `isParityGate=false`.

## Known Gaps
- Visual registry is intentionally non-gating. The closed default branch is visually close, but the component source note still has partial open-menu child composition (`ListItemNative`, Divider, Scrollbar internals).
- `arrowDownFoldMedium` Figma key confirmed as gap (source spec records icon name only, not component set key).
- Open menu child composition (ListItemNative, Divider, Scrollbar internals) deferred to respective component specs.
- Fixed mode `State=Fixed/Pressed (Hover)` title text uses `gray-600` token instead of the `400a` opacity token — this is confirmed from Figma data and is intentional.

## Visual Validation

- Layout baseline: `src/figma/baselines/dropdown-box-default.png` (`393x93`, scale 1).
- Visual baseline: `src/figma/baselines/dropdown-box-default@3x.png` (`1179x279`, scale 3).

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
