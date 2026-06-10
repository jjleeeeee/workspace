---
status: implemented
---

# ListItemNative Source Note

## Figma Identity
- Component: `[V2] List_Item_Native`
- Node ID: `57343:18628`
- Component set key: `e120970b1638c0fa7a5b7638923eb91479384ebe`
- Description: `네이티브 앱 목록에서 대표 이미지, 제목/보조문구, 우측 보조 액션을 한 행으로 조합하는 리스트 아이템 컴포넌트`

## Figma Reads
- `get_design_context(57343:18628)`: description, axes, props, nested composition, generated reference, screenshot.
- `get_design_context(57343:20409)`: `_atoms / modules / Trailing (Optional)` nested component set read, including 8 `Type` branches and `showIcon` / `showText`.
- Official `get_design_context(63406:10120)`: attempted full Small Leading component-set read; timed out after 120s, so the full enum read uses Console deep read + REST instead.
- `get_design_context(63406:10129)`: small leading optional module read.
- `get_design_context(63354:137265)`: medium leading optional module read.
- User screenshot `2026-05-07_10-35-13.png`: Figma property dropdown for Leading `Type`.
- Figma REST source: `npm run figma:rest-audit:list-item`, output `src/figma/rest-audits/list-item-native.rest.json`.
  - REST read confirmed component set `63406:10120` for Small Leading and `57343:20398` for Medium Leading.
  - REST read confirmed Content `9062:21959`, Title `57343:20432`, Body `57343:20580`.
- Console MCP `figma_get_component(57343:18628, enrich=true)`: parent description, axes, variant registry, component property definitions, source description.
- Console MCP `figma_get_component_for_development_deep(57343:18628, depth=12)`: parent default/live variant tree, token bindings, nested instance overrides.
- Console MCP `figma_get_component_for_development_deep(63406:10120, depth=10)`: Small Leading component-set all `Type` branches.
- Console MCP `figma_get_component_for_development_deep(57343:20398, depth=10)`: Medium Leading component-set all `Type` branches.
- Console MCP `figma_get_component_for_development_deep(57343:20409, depth=10)`: Trailing component-set all `Mode x Type` branches.
- `get_screenshot(57343:18628)`: 12-variant visual reference.
- `get_screenshot(57343:18665)`: default `Mode=Default, Size=Medium, Status=Default` reference.
- `get_design_context(81275:904969)`: sampled title badge and text behavior case.
  - Title text readback: `textAutoResize=WIDTH_AND_HEIGHT`.
  - Body text readback: `textAutoResize=HEIGHT`.
- `index.md`: used only as node/key address source.

## Variant Axes
- `Mode`: `Default`, `Fixed`
- `Size`: `Small`, `Medium`
- `Status`: `Default`, `Hover(Pressed)`, `Disabled`
- Variant count: `12`

## Figma Boolean Props
- `Show Divider (Optional)#25884:0`: default `true`
- `Show Trailing (Optional)#25884:1`: default `true`
- `Show Small Leading (Optional)#25884:2`: default `true`
- `Show Medium Leading (Optional)#63408:13`: default `true`

## Layout Contract
- Component width: `393px`
- `Size=Small`: total `393x59`, row `393x58`, row padding `6px 16px`, leading `44x44`
- `Size=Medium`: total `393x81`, row `393x80`, row padding `12px 16px`, leading `56x56`
- Leading-to-content gap: `12px`
- Content-to-trailing gap: `12px`
- Content height: `46px`
- Title height: `22px`
- Body height: `18px`
- Title/body gap: `2px`
- Trailing sample size: `54x20`, detail max width `112px`, text/icon gap `4px`
- Divider: `393x1`, horizontal inset `16px`
- Menu compact title-only branch:
  - Used only when composed by `[V2] Menu`.
  - `size="small"`, `inlineSize=240`, `showBodyText=false`, `showSmallLeading=false`, `showMediumLeading=false`, `showTrailing=false`, `showDivider=false`.
  - Row height becomes `40px` without CSS scale or parent selector overrides.
  - `inlineSize` is a runtime sizing prop for verified parent composition and is hidden from Storybook Controls.

## Composition Contract
- Current coverage: `complete/deep-inventoried`.
- Leading module coverage: `complete/deep-inventoried`.
- Leading module enum source: Figma property dropdown screenshot plus Figma REST component sets plus Console MCP deep reads.
- Leading `Type` options: `Avatar / Checkbox / Icon / Radio / Rectanglular Thumbnail / Square Thumbnail`.
- Trailing module coverage: `complete/deep-inventoried`.
- Content module coverage: `complete/deep-inventoried`.
- Title props: `Show Badge`, `Title`, `Mode`, `Text Weight`, `Text Color`.
- Body props: `Leading Icon`, `Body Text`, `Mode`, `Text Weight`, `Text Color`.
- Use nested atoms for Leading:
  - `Type=Avatar`: `<Avatar avatarType="squircle" componentSize={leadingWidth} imageSize={leadingWidth} />`
  - `Type=Checkbox`: `<Checkbox checkboxType="square" checked={false} />`
  - `Type=Icon`: `<ChordIcon size={24} />`
  - `Type=Radio`: `<Radio status="enabled" />`
  - `Type=Rectanglular Thumbnail`: `<Thumbnail ratio="16:9" radius="on" />`
  - `Type=Square Thumbnail`: `<Thumbnail ratio="1:1" radius="on" />`
  - Small Leading REST dimensions:
    - `Avatar`: `40x40`
    - `Checkbox`: `24x24`
    - `Icon`: `24x24`
    - `Radio`: `24x24`
    - `Rectanglular Thumbnail`: `100x56`
    - `Square Thumbnail`: `44x44`
  - Medium Leading REST dimensions:
    - `Avatar`: `46x46`
    - `Checkbox`: `24x24`
    - `Icon`: `24x24`
    - `Radio`: `24x24`
    - `Rectanglular Thumbnail`: `156x88`
    - `Square Thumbnail`: `56x56`
  - Square Thumbnail sizes:
    - `Size=Small`: `<Thumbnail ratio="1:1" radius="on" width={44} height={44} />`
    - `Size=Medium`: `<Thumbnail ratio="1:1" radius="on" width={56} height={56} />`
  - If no `thumbnailSrc` is supplied, the nested Thumbnail owns its own no-image placeholder behavior.
- Use nested `BadgeDot` for the title badge indicator.
  - Title component set default `Show Badge=false`; ListItem default must not show the badge.
  - When `showTitleBadge=true`, `size="small"`, `outline="off"` gives the confirmed `4x4px` dot.
  - Figma node `81275:904969` shows the Title-owned badge wrapper as `4x22px` with `padding-top=2px`; the visible dot is not centered directly in the title row.
  - CSS decision: render a `.chord-list-item-native__title-badge` wrapper frame and place nested `BadgeDot` inside it.
- Use nested Body text module behavior.
  - Body default `Leading Icon=true`.
  - Body leading icon is `icon_area size=xxsmall(12)` with `ic_null_medium` selection in the default REST sample.
- Use nested atoms for Trailing:
  - `Type=Icon Button`: `<IconButton size="medium" radius="on" />`
  - `Type=Main Button`: `<TextButton size="xsmall" radius="off" />`
  - `Type=Number Badge`: `<BadgeNumber mode="default" />`
  - `Type=Radio`: `<Radio />`
  - `Type=Toggle`: `<ToggleSwitch size="medium" />`
  - `Type=TextAndIcon`: text module plus `ChordIcon name="arrowRightEnMedium"`
  - `Type=Text Only`: text module only
  - `Type=Icon Only`: `ChordIcon name="addMedium"` by default, supplied through `trailingIconName`
  - Figma `showIcon` and `showText` are exposed as `trailingShowIcon` and `trailingShowText`.
  - Figma arrow source: `24/en/ic_arrow_right_en_medium`.
  - Parent arrow frame is `10x20`; source icon remains a DS glyph, not a text character.
- Use nested `Divider` for the bottom separator.
  - `height="1"`, `dividerStyle="default-50a-2"`, `mode` follows ListItem mode.
- Use the compact title-only branch for Menu composition.
  - This branch does not implement new Menu-owned row CSS.
  - It exists so Menu can resize and simplify the row through ListItemNative props instead of CSS scale.
- Do not recreate `ListItemLeading` or `ListItemTrailing` as public components.
- Do not flatten `Thumbnail`, `BadgeDot`, `Divider`, `icon_area`, or text module internals inside the parent.

## Nested Module Inventory

| Nested role | Node id/key | Module/component | Owner type | Axes/props/options | Required child atoms/assets | Coverage | Deferred reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Leading / Small | `63406:10120` / selected `63406:10129` | `_atoms / modules / Leading (Optional)` | `component-set` | `Type=Avatar / Checkbox / Icon / Radio / Rectanglular Thumbnail / Square Thumbnail` | `Avatar`, `Checkbox`, `ChordIcon`, `Radio`, `Thumbnail` | `complete/deep-inventoried` | none |
| Leading / Medium | `57343:20398` / selected `63354:137265` | `_atoms / modules / Leading (Optional)` | `component-set` | `Type=Avatar / Checkbox / Icon / Radio / Rectanglular Thumbnail / Square Thumbnail` | `Avatar`, `Checkbox`, `ChordIcon`, `Radio`, `Thumbnail` | `complete/deep-inventoried` | none |
| Content / Title | `57343:20432` | `_atoms / text / title (Required)` | `component-set` | `Show Badge`; `Title`; `Mode=Default/Fixed`; `Text Weight=Bold/Regular`; `Text Color=Default/Primary/Red` | `BadgeDot size=small outline=off`; text token `body-m/system-700/400` | `complete/deep-inventoried` | none |
| Content / Body | `57343:20580` | `_atoms / text / body text (Optional)` | `component-set` | `Leading Icon`; `Body Text`; `Mode=Default/Fixed`; `Text Weight=Bold/Regular`; `Text Color=Default/Primary` | `ChordIcon nullMedium size=12`; text token `body-xs/system-400/700` | `complete/deep-inventoried` | none |
| Trailing | `57343:20409` / `a984ca34f20a11ce339609566d77496f48630b55` | `_atoms / modules / Trailing (Optional)` | `component-set` | `Mode=Default/Fixed`; `Type=Icon Button / Main Button / Number Badge / Radio / Toggle / TextAndIcon / Text Only / Icon Only`; `showIcon`; `showText` | `IconButton`, `TextButton`, `BadgeNumber`, `Radio`, `ToggleSwitch`, `ChordIcon arrowRightEnMedium`, `ChordIcon addMedium`, text token `body-xs/system-500` | `complete/deep-inventoried` | none |
| Divider | `59215:76787` / `a4421d92006feceff814786c7733c63403cebf92` | `[V2] Divider` | `atom` | `Mode=Default/Fixed`; height `1`; style mapped by ListItem mode | `Divider height=1 dividerStyle=default-50a-2` | `complete` | none |
| Menu compact row | `25963:37235` | `[V2] Menu` row composition | `parent-composition` | title-only, no leading, no body, no trailing, no divider, width `240`, row height `40` | `ListItemNative` own title module | `partial/menu-verified` | Full Menu visual parity remains container/default-row only; non-default ListItem branches stay scoped to ListItemNative. |

Deep-inventoried coverage means every parent/nested enum branch has been read and mapped to an implementation branch. Visual parity is still scoped separately because media-backed Thumbnail imagery can differ from code fallback imagery.

## Token Mapping
- Title default: `system/color/text/default`
- Title fixed: `system/fixed_color/text/default`
- Body default: `system/color/text/400a`
- Body fixed: `system/fixed_color/text/400a`
- Trailing detail default: `system/color/text/default`
- Trailing detail fixed: `system/fixed_color/text/default`
- Trailing icon default: `system/color/icon/default`
- Trailing icon fixed: `system/fixed_color/icon/default`
- Divider default: `system/color/outline/default-50a-2`
- Divider fixed: `system/fixed_color/outline/default-100a`
- Disabled: component root opacity `0.2`
- Typography:
  - Title: `body-m/system-700`, `16px / 22px`
  - Body: `body-xs/system-400`, `14px / 18px`
  - Trailing: `body-xs/system-500`, `14px / 18px`
- Font mapping: `WeGothicSans` is treated as the Chord system-font alias before OS and token fallbacks.

## Text Behavior Notes

| Text role | Figma readback | Explicit overflow policy | CSS decision |
| --- | --- | --- | --- |
| Title | `textAutoResize=WIDTH_AND_HEIGHT`; parent root/state/content use hug/min-height behavior in development readback | none found: no `truncate`, `ellipsis`, `lineClamp`, or `maxLines` contract | Default `textOverflow="wrap"`: use row/content/title `min-height` so long text can increase row height. |
| Body | `textAutoResize=HEIGHT`; parent root/state/content use hug/min-height behavior in development readback | none found: no `truncate`, `ellipsis`, `lineClamp`, or `maxLines` contract | Default `textOverflow="wrap"`: use row/content/body `min-height` so long text can increase row height. |
| Trailing detail | text module sampled with `max-inline-size=112px`; overflow behavior not explicitly specified | no explicit ellipsis contract found | Default `textOverflow="wrap"`; detail can wrap within its max inline size. |

- Decision source: Figma node `81275:904969` text readback plus absence of overflow terms in the component description.
- Runtime escape hatches: `textOverflow="clip"` and `textOverflow="ellipsis"` are available for product safety, but they are not the Figma-facing default and remain hidden from Storybook Controls.
- Title badge behavior: the badge is Title-owned and follows the title text in the inline text flow. Do not place it as a flex item after a full-width title span; that detaches the badge from the rendered end of the text.

## Text Flow Contract

| Part | Contract | Implementation decision |
| --- | --- | --- |
| Title text | `textAutoResize=WIDTH_AND_HEIGHT`; no explicit `truncate`, `ellipsis`, `lineClamp`, or `maxLines` contract found. | Default text behavior is wrap. The title is rendered as inline text so wrapped lines can increase content and row height. |
| Title Badge | Title-owned `Badge_Dot` adornment. It follows the rendered end of title text, not the full title container end. | Keep BadgeDot in the title inline flow with a 4px start gap. Do not render it as a flex sibling after a full-width title span. |
| Body text | `textAutoResize=HEIGHT`; no explicit overflow limit found. | Default text behavior is wrap. Row height grows when body text wraps. |
| Runtime overflow | Product safety may require clipping in app usage. | `textOverflow="clip"` and `textOverflow="ellipsis"` exist only as explicit runtime opt-ins and stay hidden from Figma-facing Storybook Controls. |

- Figma caveat: auto layout can make the badge look like a sibling module, but the implementation contract is text-flow attachment. This is one of the cases where Figma visual structure alone is not enough.
- Regression case: long unbroken or multi-line title with `showTitleBadge=true` must keep the badge attached to the rendered text end and must not overlap body or trailing content.

## Token vs Rendered Pixel Notes
- Figma readback lists `body_text_*` as `400a` plus opacity `0.5`.
- Decision: use the alpha token as the semantic color and do not add an extra body-text opacity in CSS.
- Reason: workflow rule says alpha tokens are already meaningful rendered values unless source verification proves a separate layer opacity.
- Follow-up owner: visual diff loop can reclassify this as `token-or-figma-spec-gap` only after screenshot comparison.

## Storybook Contract
- Storybook docs must label this implementation as `complete/deep-inventoried` for branch coverage while keeping visual comparison `structure-only`.
- Controls expose only Figma-facing axes and optional slot booleans:
  - `mode`, `size`, `status`, `showDivider`, `showTrailing`, `showSmallLeading`, `showMediumLeading`, `leadingType`, `showBodyText`, `showTitleBadge`, `bodyLeadingIcon`, `titleTextWeight`, `titleTextColor`, `bodyTextWeight`, `bodyTextColor`, `trailingType`, `trailingShowIcon`, `trailingShowText`
- Runtime content props are allowed for implementation use but hidden from primary controls:
  - `title`, `bodyText`, `detailText`, `inlineSize`, `thumbnailSrc`, `thumbnailAlt`, `leadingIconName`, `leadingCheckboxChecked`, `leadingRadioChecked`, `trailingButtonText`, `trailingBadgeLabel`, `trailingIconName`, `trailingRadioChecked`, `trailingToggleChecked`, `textOverflow`
- Stories:
  - `Playground`
  - `Variants`
  - `States`
  - `OptionalSlots`
  - `FigmaCompare`: must show both `src/figma/baselines/list-item-native-default.png` and the current implementation.

## Known Gaps
- The Figma sample screenshot uses concrete media content in the leading Thumbnail. The component default does not invent a product image; it composes Thumbnail's no-image state unless `thumbnailSrc` is supplied.
- Pixel baseline is registered for the default complete/deep-inventoried row. It uses the current no-image Thumbnail fallback, so it is a structural comparison rather than full media parity.
- Visual registry scope: `comparisonScope="structure-only"`, `isParityGate=false`.
  Do not report this registry result as full media parity until deterministic media parity is closed.
- Official `get_design_context` timed out on the full Small Leading component set; Console deep read and REST audit are the durable branch evidence for this pass.

## Alpha Token Notes

- Body default/fixed text colors are alpha token values:
  - default: `system/color/text/400a`
  - fixed: `system/fixed_color/text/400a`
- Divider colors are alpha/outline token values:
  - default: `system/color/outline/default-50a-2`
  - fixed: `system/fixed_color/outline/default-100a`
- Disabled state is the only component-level opacity contract recorded for the parent: root opacity `0.2`.
- Decision: do not add extra opacity to body text or divider when the alpha token already encodes the rendered alpha.

## Font Mapping Notes

- Figma typography source uses the Chord system alias `WeGothicSans`.
- CSS stack:
  - `"WeGothicSans", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", var(--cds-typography-default-font-family-body, Pretendard, ui-sans-serif, system-ui, sans-serif)`
- Decision: `WeGothicSans` is a system-font alias for macOS SF / Apple SD Gothic behavior, so it must stay before token fallback fonts.

## Sizing Interpretation Notes

- Default component width is `393px`.
- `Size=Small`: base row `393x58`, total with divider `393x59`, leading default `44x44`.
- `Size=Medium`: base row `393x80`, total with divider `393x81`, leading default `56x56`.
- Row height is a minimum for default content, not a hard clipping height:
  - Title readback: `textAutoResize=WIDTH_AND_HEIGHT`.
  - Body readback: `textAutoResize=HEIGHT`.
  - Long title/body content can increase content and row height unless runtime `textOverflow` opts into clipping/ellipsis.
- Leading branch dimensions are owned by the nested Leading modules:
  - Small: Avatar `40x40`, Checkbox/Icon/Radio `24x24`, Rectanglular Thumbnail `100x56`, Square Thumbnail `44x44`.
  - Medium: Avatar `46x46`, Checkbox/Icon/Radio `24x24`, Rectanglular Thumbnail `156x88`, Square Thumbnail `56x56`.
- Trailing branch dimensions are owned by the nested Trailing module:
  - Icon Button `40x40`, Main Button `51x32`, Number Badge `39x16`, Radio `24x24`, Toggle `52x32`, TextAndIcon `54x20`, Text Only `40x18`, Icon Only `20x20`.

## Nested Atom Mapping

- `Avatar`: used by Leading `Type=Avatar`; ListItem passes explicit `componentSize`/`imageSize` instead of scaling CSS.
- `Checkbox`: used by Leading `Type=Checkbox`; Figma branch is unchecked square default.
- `Radio`: used by Leading `Type=Radio` and Trailing `Type=Radio`.
- `Thumbnail`: used by Leading `Type=Rectanglular Thumbnail` and `Type=Square Thumbnail`; image behavior remains Thumbnail-owned.
- `IconButton`: used by Trailing `Type=Icon Button`; default glyph is `sendMedium`.
- `TextButton`: used by Trailing `Type=Main Button`; Figma branch is `size="xsmall"`, `radius="off"`.
- `BadgeNumber`: used by Trailing `Type=Number Badge`; nested branch keeps `mode="default"`.
- `ToggleSwitch`: used by Trailing `Type=Toggle`; Figma branch uses iOS medium enabled switch.
- `BadgeDot`: used by Title `Show Badge`; it is an inline title adornment, not a row-end marker.
- `Divider`: used for bottom separator.
- `ChordIcon`: used only when the source is confirmed as icon asset or icon_area glyph selection:
  - body leading `nullMedium`
  - leading icon `nullMedium`
  - trailing arrow `arrowRightEnMedium`
  - trailing icon-only `addMedium`
  - trailing icon button `sendMedium`
