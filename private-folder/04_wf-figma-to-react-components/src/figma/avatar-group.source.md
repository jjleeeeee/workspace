---
status: implemented
---

# Avatar Group Source Note

## Source Read Timestamp

- 2026-05-08

## index.md Node Id And Component Key

- `index.md` entry: N/A — `Avatar Group` is not a top-level index entry.
- Source route: discovered as a nested component in `TitleHeader` `atoms/leading_Left`.
- Component set node: `73587:6404`
- Component set key: `6ad2e4b184997b01a86fa87e803387200dcca643`
- Nested usage node: `62973:7805` (`atoms / leading_Left`)

## MCP Calls

- Official MCP `get_context_for_code_connect("62973:7805")`
- Official MCP `get_design_context("73675:33538")`
- Official MCP `get_screenshot("73675:33538")` -> `38x46`
- Official MCP `get_context_for_code_connect("73587:6404")`
- Plugin API `use_figma("62973:7805")` scoped read of nested component set and default `AvatarGroup` branch
- Plugin API broad component search attempt timed out; no file changes were made. Follow-up reads were narrowed to known node ids.

## Figma Description

`Avatar Group` is a nested composition component marked "디자인 개별 사용금지". It groups multiple Avatars and may show `LIVE` or `5+` status. It is intended for DS parent components such as `TitleHeader` leading identity, not as an arbitrary standalone design surface.

Important description constraints:

- Live component set exposes 11 component variants.
- Circle supports Tile and Horizontal alignment for Count `1`, `2`, `3`, `4`, `5+`.
- Squircle currently supports only `Alignment=Tile`, `Count=1`.
- `Live Tag` is a boolean property, not a variant axis.
- Nested `[V2] Avatar` instances own avatar internals; Avatar Group owns grouping, overlap, LIVE tag, and overflow count.

## Variant Axes And Code Props Mapping

| Axis | Figma values | Code prop |
| --- | --- | --- |
| Shape | `Circle`, `Squircle` | `shape: "circle" \| "squircle"` |
| Alignment | `Tile`, `Horizontal` | `alignment: "tile" \| "horizontal"` |
| Count | `1`, `2`, `3`, `4`, `5+` | `count: "1" \| "2" \| "3" \| "4" \| "5+"` |

Live variant coverage:

| Shape | Alignment | Count | Node |
| --- | --- | --- | --- |
| Circle | Tile | 1 | `73587:6405` |
| Circle | Tile | 2 | `73587:6409` |
| Circle | Tile | 3 | `73587:6418` |
| Circle | Tile | 4 | `73587:6430` |
| Circle | Tile | 5+ | `73587:6442` |
| Circle | Horizontal | 1 | `73587:6457` |
| Circle | Horizontal | 2 | `73587:6463` |
| Circle | Horizontal | 3 | `73587:6469` |
| Circle | Horizontal | 4 | `73587:6481` |
| Circle | Horizontal | 5+ | `73587:6493` |
| Squircle | Tile | 1 | `73587:6510` |

Invalid combinations such as `shape=squircle`, `alignment=horizontal` or `count>1` are not inferred. Code normalizes them to `shape=squircle`, `alignment=tile`, `count=1` and records `data-normalized="true"`.

## Component Properties

| Figma property | Type | Default | Code prop |
| --- | --- | --- | --- |
| `Live Tag#62681:0` | boolean | `true` | `liveTag` |
| `Shape` | variant | `Squircle` | `shape` |
| `Alignment` | variant | `Tile` | `alignment` |
| `Count` | variant | `1` | `count` |

Storybook Controls expose only `shape`, `alignment`, `count`, and `liveTag`.

## Constraints

- Do not generate missing Squircle multi-count or horizontal variants.
- Do not copy Avatar internals into Avatar Group; compose `Avatar`.
- Do not replace `LIVE` or `5+` with external Badge components unless the source changes.
- Do not use this component as a generic public consumer design surface in examples.

## Token Mapping

| Part | Token | CSS var |
| --- | --- | --- |
| Live Tag fill | `system/fixed_color/status/danger-red` | `--cds-system-fixed-color-status-danger-red` |
| Live Tag stroke | `system/fixed_color/outline/default` | `--cds-system-fixed-color-outline-default` |
| Live Tag text | `system/fixed_color/text/default` | `--cds-system-fixed-color-text-default` |
| Overflow text | `system/fixed_color/text/default` | `--cds-system-fixed-color-text-default` |
| Overflow fill | component internal dark overlay | local fallback, no confirmed token |

## Alpha Token Notes

N/A — no alpha token conflict was observed for the root component. Avatar internals are owned by `Avatar`.

## Font Mapping Notes

- Figma uses the Chord DS system font style for the `LIVE` and `5+` labels.
- Treat as `WeGothicSans` system alias.
- CSS order: `"WeGothicSans", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", var(--cds-typography-default-font-family-body, Pretendard, ui-sans-serif, system-ui, sans-serif)`.

## Text Behavior Notes

| Text role | Figma readback | Explicit overflow policy | CSS decision |
| --- | --- | --- | --- |
| Live Tag | fixed `29x16`, text `LIVE`, `10px/13px`, weight 700 | fixed badge | no wrap, fixed internal status label |
| Overflow count | sampled `5`, `20x20` overlay | fixed count badge | no wrap, render `5+` state with text `5` |

## Sizing Interpretation Notes

| Variant family | Size |
| --- | --- |
| Tile Count 1..5+ | `38x46`, avatar area `38x38`, Live Tag `29x16` |
| Horizontal Count 1 | `26x26` |
| Horizontal Count 2 | `40x26` |
| Horizontal Count 3 | `54x26` |
| Horizontal Count 4 | `68x26` |
| Horizontal Count 5+ | `68x26`, overflow indicator on the fourth slot |
| Squircle Tile Count 1 | `38x46` |

Horizontal sizing follows `26 + 14 * (visible slots - 1)` up to 4 slots.

## Nested Atom Mapping

| Parent variant | Nested role | Figma nested component | Nested variant/props | Frame size | Offset/placement | CSS decision |
| --- | --- | --- | --- | ---: | --- | --- |
| Tile Count=1, Squircle | avatar | `[V2] Avatar` | `Mode=Default`, `Type=Squircle`, `Size=XSmall`, `Badge_Dot=false` | `38x38` | top center | `Avatar avatarType="squircle" size="xsmall" componentSize=38 imageSize=32` |
| Circle Tile/Horizontal | avatar | `[V2] Avatar` | `Mode=Default`, `Type=Circle`, `Size=XSmall/XXXSmall/Tiny` | `26x26` or `38x38` area | overlap/stack | `Avatar avatarType="circle"` with public size and parent-specific `componentSize/imageSize` overrides |

## Nested Module Inventory

| Nested role | Node id/key | Module/component | Owner type | Axes/props/options | Required child atoms/assets | Coverage | Deferred reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Avatar visual | `62973:7556` / `33d955018e09fb10ab89cefc8f00f2662a2b0e39` | `[V2] Avatar` | atom | `Mode=Default`, `Type=Circle/Squircle`, small sizes | `Avatar` | complete for grouping contract | Avatar internal overlays remain Avatar-owned |
| Live Tag | child frame under Avatar Group | internal status badge | module | `Live Tag` boolean, Tile only | text + tokenized frame | complete | N/A |
| Overflow count | Count=`5+` child frame | internal count indicator | module | Count=`5+` | text frame | complete | N/A |

## Layout Rules

- Tile alignment stacks avatar area and live tag vertically inside `38x46`.
- Horizontal alignment overlaps avatars horizontally inside a `26px` high strip.
- Count `5+` renders four avatar slots plus an internal count overlay.
- `liveTag=false` hides the Live Tag but keeps the tile component frame size from Figma.

## Representative Child Nodes

- Default nested branch from `atoms/leading_Left`: `73675:33538`
- Avatar Group set: `73587:6404`
- Default Squircle Tile Count 1 component: `73587:6510`
- Title Header usage instance: `73675:33592`

## Visual Reference Image URL Or Local Baseline Path

- MCP screenshot URL captured 2026-05-08: `https://www.figma.com/api/mcp/asset/b915637d-6a06-4ab5-b686-adbee8fa2860`
- Local layout baseline: `src/figma/baselines/avatar-group-default.png` (`38x46`)
- Visual registry scope: structure-only because nested Avatar image placeholder pixels differ from Figma-rendered assets.

## Placeholder Usage Scope

- Avatar images are rendered through the existing `Avatar` placeholder fallback when no consumer `src` is provided.
- This is acceptable for structure-only validation; it is not reported as full media parity.

## Known Gaps

- Full pixel parity is not claimed because nested Avatar media/placeholder rendering can differ from the Figma component screenshot.
- Squircle variants beyond `Tile/Count=1` are not implemented because they do not exist in live Figma.
- The exact internal overflow count fill token was not confirmed; implementation uses a local dark overlay fallback and records it as internal component styling.

## Token vs Rendered Pixel Notes

- Component bounds follow Figma rendered sizes.
- Nested Avatar pixel differences are classified as child media/placeholder differences, not Avatar Group layout parity.
