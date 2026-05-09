---
status: implemented
---

# List_Item_Web - Figma Source Note

Date: 2026-05-08

## MCP Reads

- Official MCP `get_design_context("69579:9044")` - `Mode=Default, Size=Small, States=Default`
- Official MCP `get_design_context("69579:9056")` - `Mode=Default, Size=Small, States=Disabled`
- Official MCP `get_design_context("69579:9080")` - `Mode=Default, Size=Medium, States=Default`
- Official MCP `get_design_context("57343:20409")` - nested `_atoms / modules / Trailing (Optional)`
- Official MCP `get_screenshot("69579:9044")` - `393x57`
- Official MCP `get_screenshot("69579:9056")` - `393x56`
- Official MCP `get_screenshot("69579:9080")` - `393x81`
- Official MCP `get_screenshot("57343:20409")` - `543x144`
- Console MCP `figma_get_component("63406:10129")` - small Leading component branch, `Type=Square Thumbnail`
- Console MCP `figma_get_component("63354:137265")` - medium Leading component branch, `Type=Square Thumbnail`
- Console MCP `figma_get_component_for_development("69756:29703")` - small Leading instance, `44x44`, nested `[V2] Thumbnail`
- Console MCP `figma_get_component_for_development("69756:29496")` - medium Leading instance, `56x56`, nested `[V2] Thumbnail`
- Plugin API `use_figma` read of small Leading component set `63406:10120` - `Type=Avatar/Checkbox/Icon/Radio/Rectanglular Thumbnail/Square Thumbnail`
- Plugin API `use_figma` read of medium Leading component set `57343:20398` - `Type=Avatar/Checkbox/Icon/Radio/Rectanglular Thumbnail/Square Thumbnail`
- Figma REST readback: parent component set `69579:9043`, all 12 child variants, and nested component ids listed below
- Figma REST image export: `69579:9044`, scale `1` and `3` - local default baselines captured 2026-05-08
- Figma REST image export: `69579:9056`, scale `1` and `3` - local default/small/disabled baselines captured 2026-05-08

## Figma Node

- Component set node: `69579:9043`
- Component set key: `42c19f42926776126ff312006b4505a4e03a905a`
- Primary baseline variant: `69579:9044` (`Mode=Default, Size=Small, Alignment=Center, States=Default`)

## Variant Axes

| Axis | Figma values | Code values |
|---|---|---|
| Mode | `Default`, `Fixed` | `default`, `fixed` |
| Size | `Small`, `Medium` | `small`, `medium` |
| Alignment | `Center` | not exposed, fixed to center |
| States | `Default`, `Hover(Pressed)`, `Disabled` | `default`, `hover-pressed`, `disabled` |

Total: `2 x 2 x 1 x 3 = 12` variants.

Important correction: Figma does **not** expose `selected` as a `List_Item_Web` state. Do not implement a selected indicator for this component.

## Figma Props

| Figma property | Type | Default | Code handling |
|---|---:|---:|---|
| `Show Trailing#37809:4` | boolean | `true` | `showTrailing` |
| `Show Divider#37809:5` | boolean | `true` | `showDivider` |
| `Show Medium Leading#69756:0` | boolean | `true` | `showMediumLeading`; `showLeading` remains a convenience alias only |
| `Show Small Leading#69756:13` | boolean | `true` | `showSmallLeading`; `showLeading` remains a convenience alias only |

## Storybook Controls

Only Figma-facing parent props are exposed:

| Prop | Values |
|---|---|
| `mode` | `default`, `fixed` |
| `size` | `small`, `medium` |
| `states` | `default`, `hover-pressed`, `disabled` |
| `showLeading` | boolean |
| `showSmallLeading` | boolean |
| `showMediumLeading` | boolean |
| `showTrailing` | boolean |
| `showDivider` | boolean |

Content props such as `titleLabel`, `bodyLabel`, `trailingLabel`, `leadingSlot`, and `showBadgeDot` are runtime/internal story args, not Figma-facing parent controls.

Nested leading controls are exposed because `_atoms / modules / Leading (Optional)` is a confirmed nested component set:

| Prop | Values |
|---|---|
| `leadingType` | `avatar`, `checkbox`, `icon`, `radio`, `rectangular-thumbnail`, `square-thumbnail` |

Nested trailing controls are exposed because `_atoms / modules / Trailing (Optional)` is a confirmed nested component set:

| Prop | Values |
|---|---|
| `trailingType` | `main-button`, `icon-button`, `number-badge`, `radio`, `toggle`, `text-and-icon`, `text-only`, `icon-only` |
| `showTrailingText` | boolean |
| `showTrailingIcon` | boolean |

## Tokens

| Purpose | Token | Fallback |
|---|---|---|
| Title text, default mode | `--cds-system-color-text-default` | `#000000` |
| Title text, fixed mode | `--cds-system-fixed-color-text-default` | `#ffffff` |
| Body text, default mode | `--cds-system-color-text-400a` | `rgba(0,0,0,0.5)` |
| Body text, fixed mode | `--cds-system-fixed-color-text-400a` | `rgba(255,255,255,0.5)` |
| Trailing text, default mode | `--cds-system-color-text-default` | `#000000` |
| Trailing text, fixed mode | `--cds-system-fixed-color-text-default` | `#ffffff` |
| Trailing arrow, default mode | `--cds-system-color-icon-default` | `#000000` |
| Trailing arrow, fixed mode | `--cds-system-fixed-color-icon-default` | `#ffffff` |
| Small disabled check live branch | `--cds-system-color-roles-primary` | `#00cbd5` |
| Badge dot | `--cds-system-color-status-danger-red` through `BadgeDot` | component-owned |

## Typography

| Element | Figma style | Size | Weight | Line height |
|---|---|---:|---:|---:|
| Title | `body-m/system-700` | 15px | 700 | 21px |
| Body | `body-xs/system-400` | 13px | 400 | 17px |
| Trailing label | `body-xs/system-500` | 13px | 500 | 17px |

## Layout

### Small

- Component: `393x57` for default/hover/fixed disabled variants with divider.
- Live exception: `Mode=Default, Size=Small, States=Disabled` is `393x56` and uses a direct `[V2] Divider` instance.
- State layer / contents: `393x56`
- Padding: `6px 16px`
- Leading: `44x44`
- Content: `245x44` in default and hover; `273x44` in the live default/small/disabled check branch
- Trailing default branch: `48x20`
- Trailing live check branch: `20x20`

### Medium

- Component: `393x81`
- State layer: `393x80`
- Padding: `12px 16px`
- Leading: `56x56`
- Content: `233x44`
- Trailing default branch: `48x20`

### Common

- Horizontal slot gap: `12px`
- Title and body vertical gap: `2px`
- Body row padding: `2px 0`
- Title height: `21px`
- Body text height: `17px`, body row height `21px`
- Divider wrapper uses `16px` horizontal padding except the default/small/disabled live exception.

## Nested Module Inventory

| Nested role | Node id / component id | Module/component | Owner type | Axes/props/options | Required child atoms/assets | Coverage | Notes |
|---|---|---|---|---|---|---|---|
| leading small component set | `69756:29703` / set `63406:10120` | `_atoms / modules / Leading (Optional)` | component-set | `Type=Avatar`, `Checkbox`, `Icon`, `Radio`, `Rectanglular Thumbnail`, `Square Thumbnail`; visible prop `Show Small Leading#69756:13` | `Avatar`, `Checkbox`, `Radio`, `Thumbnail`, `ChordIcon` | complete | Parent instance default is `Square Thumbnail`, but component property dropdown exposes all 6 branches. |
| leading medium component set | `69756:29496` / set `57343:20398` | `_atoms / modules / Leading (Optional)` | component-set | `Type=Avatar`, `Checkbox`, `Icon`, `Radio`, `Rectanglular Thumbnail`, `Square Thumbnail`; visible prop `Show Medium Leading#69756:0` | `Avatar`, `Checkbox`, `Radio`, `Thumbnail`, `ChordIcon` | complete | Medium dimensions differ for Avatar and Thumbnail branches. |
| leading avatar | small `63406:10121`, medium `57343:20399` | `[V2] Avatar` | atom | `Mode=Default`, `Type=Squircle`, `Size=Small`; small rendered `40x40`, medium rendered `46x46`; `Badge_Dot=false` | `Avatar` | complete | Small branch uses an overridden component/image size (`40/34`) while medium matches Avatar small (`46/40`). |
| leading checkbox | small `63406:10123`, medium `57343:20401` | `[V2] Checkbox` | atom | `Mode=Default`, `Type=Square`, `Status=Default`; `24x24` | `Checkbox` | complete | Use Checkbox atom, not CSS square. |
| leading icon | small `63406:10125`, medium `57343:20403` | `icon_area` | asset wrapper | `size=medium(24)`, `em=On`, selected `24/em/ic_null_medium`; `24x24` | `ChordIcon name=nullMedium size=24` | complete | `icon_area` is wrapper sizing; selected glyph is the confirmed icon asset. |
| leading radio | small `63406:10131`, medium `59314:27103` | `[V2] Radio` | atom | `Mode=Default`, `Status=Enabled`; `24x24` | `Radio` | complete | Use Radio atom with enabled status. |
| leading rectangular thumbnail | small `63406:10127`, medium `62641:42034` | `[V2] Thumbnail` | atom | `Ratio=16:9`, `Radius=on`, optional modules false; small `100x56`, medium `156x88` | `Thumbnail` | complete | Figma spelling is `Rectanglular Thumbnail`; code prop uses corrected `rectangular-thumbnail`. |
| leading square thumbnail | small `63406:10129`, medium `63354:137265` | `[V2] Thumbnail` | atom | `Ratio=1:1`, `Radius=on`, optional modules false; small `44x44`, medium `56x56` | `Thumbnail` | complete | This is the parent default branch, not the only branch. |
| Thumbnail nested optional modules inside Leading | child instance `60779:56301` under the leading wrapper | `[V2] Thumbnail` internals | component-set delegated to child atom | `Fill`, `Button`, `Left Item`, `Right Item_top`, `Right Item_bottom`, `Seek bar` all present in the child component but hidden/false in ListItemWeb Leading | `Thumbnail`, nested optional modules owned by Thumbnail | delegated | These hidden child enums are Thumbnail coverage, not ListItemWeb parent controls. If Thumbnail changes its defaults, ListItemWeb must still pass `false` for these props. |
| content | `69756:29704` / `9062:21959` | `_atoms / modules / Content (Required)` | module | `Body Text#9062:0=true` | title module, body module | partial | Parent implements the observed default content branch only. |
| title | `57343:20433` / fixed `57794:96384` | Title | module | `Title` text, `Show Badge`, `Mode`, `Text Weight`, `Text Color` | `BadgeDot` when `Show Badge=true` | partial | Full title color/weight matrix is owned by the title module; parent keeps default/fixed mapping only. |
| body | `57343:20706` / fixed `57794:96457` | Body | module | `Body Text`, `Leading Icon=true`, `Mode`, `Text Weight`, `Text Color` | `icon_area size=xxsmall(12)`, selected asset `ic_null_medium` | partial | Parent renders the live default body icon area with `ChordIcon name="nullMedium" size=12`. |
| trailing default/fixed text-and-icon | `57343:20430` / fixed `57458:98991` | `_atoms / modules / Trailing (Optional)` | component-set | `Type=TextAndIcon (사이즈 변경 불가)`, `Show Text=true`, `Show Icon=true` | text module + `ic_arrow_right_en_medium`, icon area `10x20` | complete for parent-used default branch | Full trailing component set remains child-owned. |
| trailing small default disabled live branch | `69579:9060` / `51710:68930` | Right Item Optional / Check | module | `Type=Check`, `Show Chevron=false` | `ic_check_medium`, `20x20` | complete for live exception branch | Present only in `Mode=Default, Size=Small, States=Disabled` REST/MCP readback. |
| trailing component set full options | `57343:20409` | `_atoms / modules / Trailing (Optional)` | component-set | `Main Button`, `Icon Button`, `Radio`, `Toggle`, `Number Badge`, `TextAndIcon`, `Text Only`, `Icon Only` across `Default/Fixed`; `Show Text`, `Show Icon` | `TextButton`, `IconButton`, `Radio`, `ToggleSwitch`, `BadgeNumber`, `ChordIcon` | complete | Promoted to parent API as `trailingType`, `showTrailingText`, and `showTrailingIcon` after recursive read. |
| divider | `58374:15244` -> `59215:76794` | Divider optional wrapper -> `[V2] Divider` | module + component | `Size=Small`; nested Divider `Mode=Default`, `Size=Small` | `Divider` | partial | Default/small/disabled uses direct `[V2] Divider` live exception; implementation keeps common wrapper behavior. |

## Description vs Live Variant Notes

- The Figma description says disabled lowers the state-layer opacity to `0.2` without replacing text or icon tokens.
- REST and MCP readback show a live exception for `Mode=Default, Size=Small, States=Disabled`:
  - Component size is `393x56`, not `393x57`.
  - Trailing instance is `51710:68930 Type=Check`, `20x20`, not `57343:20430 Type=TextAndIcon`.
  - Divider is a direct `[V2] Divider` instance, not the optional wrapper.
- Decision: implement the visible live check trailing branch for the default/small/disabled combination and render its divider as a direct/absolute branch to match the `393x56` live baseline.

## Text Behavior Notes

- Title and Body text nodes are `FILL` horizontally and `HUG` vertically in the sampled variants.
- The sampled component keeps fixed row heights and one-line title/body modules.
- No multiline or row-height growth contract was confirmed for `List_Item_Web`.
- Do not infer `selected` or multiline behavior from `ListItemNative`.

## Assets

| Slot | Source | Implementation |
|---|---|---|
| Leading avatar | `[V2] Avatar`, `Mode=Default`, `Type=Squircle`, `Size=Small` | Compose `Avatar` with branch-specific rendered size |
| Leading checkbox | `[V2] Checkbox`, `Mode=Default`, `Type=Square`, `Status=Default` | Compose `Checkbox` |
| Leading icon | `icon_area size=medium(24)`, selected `24/em/ic_null_medium` | Compose `ChordIcon name="nullMedium" size={24}` inside wrapper |
| Leading radio | `[V2] Radio`, `Mode=Default`, `Status=Enabled` | Compose `Radio` |
| Leading rectangular media | nested `[V2] Thumbnail`, `Type=Thumbnail`, `Ratio=16:9`, `Radius=on`, optional modules false | Compose `Thumbnail` at `100x56` small or `156x88` medium |
| Leading square media | nested `[V2] Thumbnail`, `Type=Thumbnail`, `Ratio=1:1`, `Radius=on`, optional modules false | Compose `Thumbnail` at `44x44` small or `56x56` medium |
| Body leading icon | `icon_area size=xxsmall(12)`, selection `ic_null_medium` | `ChordIcon name="nullMedium" size={12}` |
| Title badge | `Badge_Dot`, `Size=Small`, `Outline=OFF` | Compose `BadgeDot` when `showBadgeDot=true` |
| Trailing arrow | `24/en/ic_arrow_right_en_medium`, icon area `10x20`, rendered from `size=small(20)` | `ChordIcon name="arrowRightEnMedium" size={20}` |
| Disabled small check | `ic_check_medium`, `20x20` | `ChordIcon name="checkMedium" size={20}` |
| Divider | `[V2] Divider`, `Size=Small` | Compose `Divider` |

## Known Gaps

- Full `_atoms / modules / Trailing (Optional)` branch implementation is now promoted to the parent API because the nested component set was read recursively and maps to existing atoms.
- ListItemWeb Leading is promoted to a multi-enum API after Plugin API read of the nested Leading component set. The parent default instance is `Square Thumbnail`, but the component set exposes six `Type` branches.
- Full Title/Body module matrices are deferred; parent implements the observed bold title, regular body, default/fixed token mapping.
- The direct divider instance in the default/small/disabled live exception is now a separate `structure-only` visual registry entry.
- Visual registry currently checks only the default small row as `structure-only`, not full parity.

## Visual Validation

- Layout baseline: `src/figma/baselines/list-item-web-default.png` (`393x57`, scale 1).
- Visual baseline: `src/figma/baselines/list-item-web-default@3x.png` (`1179x171`, scale 3).
- Visual registry id: `list-item-web-default`.
- Disabled-small layout baseline: `src/figma/baselines/list-item-web-small-disabled.png` (`393x56`, scale 1).
- Disabled-small visual baseline: `src/figma/baselines/list-item-web-small-disabled@3x.png` (`1179x168`, scale 3).
- Disabled-small visual registry id: `list-item-web-small-disabled`.
- Visual registry scope: `comparisonScope="structure-only"`, `isParityGate=false`.
- Reason: Figma uses a sampled media image and nested module rendering; parent shell and branch structure are comparable, but full nested module parity remains out of scope.

## Alpha Token Notes

- Body text uses `system/color/text/400a` and `system/fixed_color/text/400a`; do not add a separate opacity layer to the body text.
- Disabled state uses state-layer opacity `0.2` from the Figma description. This is a state-layer treatment, not a replacement for text/icon alpha tokens.

## Font Mapping Notes

- Figma text is treated as `WeGothicSans`, the Chord DS system alias for macOS SF / Apple SD Gothic.
- CSS should prefer `"WeGothicSans", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo"` before fallback project fonts.

## Sizing Interpretation Notes

- `393x57`, `393x56`, and `393x81` are rendered parent variant bounds and are valid row contracts.
- Leading dimensions are owned by the parent wrapper (`44x44` small, `56x56` medium); Thumbnail owns internal media rendering.
- Leading wrapper data should record the selected branch, component id, component set id, and visible property reference so future edits do not mistake the default instance for the whole nested component set.
- The default/small/disabled `393x56` branch is a live Figma exception and must not be generalized to all disabled rows.

## Nested Atom Mapping

- `Thumbnail`, `BadgeDot`, `Divider`, `ChordIcon`, `TextButton`, `IconButton`, `Radio`, `ToggleSwitch`, and `BadgeNumber` are composed as child atoms instead of being redrawn in ListItemWeb CSS.
- ListItemWeb maps each Leading branch to existing atoms. Thumbnail branches pass all Thumbnail optional modules off.
- `icon_area` entries are wrapper/sizing contracts. Only confirmed icon component entries use `ChordIcon`.

## Token vs Rendered Pixel Notes

- Parent row bounds and slot sizes follow the Figma rendered baseline first after comparison environment is checked.
- Nested media/image differences are not a parent parity failure unless the parent slot size, gap, or clipping is wrong.
