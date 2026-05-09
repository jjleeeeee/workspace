---
status: implemented
---

# Avatar Source Note

## Figma Identity
- Component: `[V2] Avatar`
- Node ID: `62973:7556`
- Component key: `33d955018e09fb10ab89cefc8f00f2662a2b0e39`
- Description: `사람, 아티스트, 그룹, 공식 커뮤니티를 대표하는 이미지형 컴포넌트`

## Source Reads
- Index lookup only: `design-cds-docs/99_ref/ref-figma-component-keys/chord-ds/index.md`
- Console MCP `figma_get_component(62973:7556, enrich=true)`
- Console MCP `figma_get_component_for_development(62973:7591)`: `Mode=Default, Type=Circle, Size=Medium`
- Console MCP `figma_get_component_for_development(62973:7599)`: `Mode=Default, Type=Circle, Size=Small`
- Console MCP `figma_get_component_for_development(62973:7653)`: `Mode=Default, Type=Squircle, Size=Medium`
- Console MCP `figma_get_component_for_development(57343:20399)`: ListItem Leading `Type=Avatar`
- Framelink `get_figma_data(62973:7599, depth=4)`
- Framelink `get_figma_data(57343:20399, depth=4)`
- Framelink `download_figma_images(80800:54100)` for `src/assets/avatar/squircle-mask.svg`
- Figma MCP `get_design_context(81500:7449)`: Avatar placeholder image bundle
- Figma MCP `get_screenshot(81500:7449)`: placeholder bundle visual reference
- Framelink `download_figma_images(81500:7438..81500:7448)` for
  `src/assets/avatar/avatar-placeholder-<size>.svg`

## Variant Axes
- `Mode`: `Default`, `Fixed`
- `Type`: `Circle`, `Squircle`
- `Size`: `XXXXLarge`, `XXXLarge`, `XXLarge`, `XLarge`, `Large`, `Medium`, `Small`, `XSmall`, `XXSmall`, `XXXSmall`, `Tiny`
- Variant formula: `2 x 2 x 11 = 44`

## Figma Props
- `Ring`: boolean, default `true`
- `Birthday_Hat`: boolean, default `true`
- `Emoji`: boolean, default `true`
- `Badge_Dot`: boolean, default `true`
- `Host`: boolean, default `true`

## Code Mapping
- `avatarType`: `circle | squircle`
- `size`: `xxxxlarge | xxxlarge | xxlarge | xlarge | large | medium | small | xsmall | xxsmall | xxxsmall | tiny`
- `ring`, `birthdayHat`, `emoji`, `badgeDot`, `host`: boolean, default `true`
- `src`, `alt`, `emojiText`, `hostSrc`, `hostAlt`: runtime content props, hidden from Storybook Figma controls.

## Size Contract
| Size | Component | Image |
| --- | ---: | ---: |
| `xxxxlarge` | 140 | 128 |
| `xxxlarge` | 108 | 96 |
| `xxlarge` | 84 | 72 |
| `xlarge` | 72 | 64 |
| `large` | 64 | 56 |
| `medium` | 56 | 48 |
| `small` | 46 | 40 |
| `xsmall` | 38 | 32 |
| `xxsmall` | 30 | 24 |
| `xxxsmall` | 26 | 20 |
| `tiny` | 22 | 16 |

## Asset Notes
| Asset | Classification | Status |
| --- | --- | --- |
| `squircle_mask` node `80800:54100` | asset-backed mask | exported to `src/assets/avatar/squircle-mask.svg` |
| `placeholder_image` node `81500:7449` | asset-backed placeholder bundle | exported size-specific SVGs to `src/assets/avatar/avatar-placeholder-<size>.svg` |

## Parent Composition Sizing Notes
- Avatar keeps the Figma-facing `size` axis unchanged.
- Verified parent components may pass runtime-only `componentSize` and `imageSize` to match nested module bounds without CSS scale.
- These sizing hooks are hidden from Storybook Controls and must be documented in the parent source note before use.
- Current use: `ListItemNative` Leading Avatar passes `40x40` for Small and `46x46` for Medium.
| `birthday_hat` | icon component / icon_area wrapper | mapped as `ChordIcon name="birthdayHatMedium"` from node `40347:21483` |
| `emoji` | component state shape/text | rendered as `emojiText`, default `🏕` |
| `badge_dot` | component state shape | rendered inside Avatar using Figma size/stroke table |
| `host` | nested component | rendered as nested `Avatar size="xxsmall"` with `host=false` |

## Host Overlay Contract
- Representative nodes:
  - `62973:7624`: `Mode=Default`, `Type=Squircle`, `Size=XXXXLarge`
  - `62973:7653`: `Mode=Default`, `Type=Squircle`, `Size=Medium`
- Host is visible only for Squircle `XXXXLarge` through `Medium` in the current implementation.
- Host is pinned inside the parent with `right=0`, `bottom=0`, `clipsContent=true`.
- Host background is an ellipse using token `system/color/surface/default`.

| Parent size | Parent component | Main image | Host frame | Host child Avatar | Host child image |
| --- | ---: | ---: | ---: | --- | ---: |
| `xxxxlarge` | 140 | 128 | 46 | `small` | 40 |
| `xxxlarge` | 108 | 96 | 38 | `xsmall` | 32 |
| `xxlarge` | 84 | 72 | 30 | `xxsmall` | 24 |
| `xlarge` | 72 | 64 | 30 | `xxsmall` | 24 |
| `large` | 64 | 56 | 30 | `xxsmall` | 24 |
| `medium` | 56 | 48 | 30 | `xxsmall` | 24 |

- Forbidden interpretation: do not push Host outside the parent frame with negative offsets.
- Forbidden interpretation: do not reuse `XXSmall` as the nested Host Avatar for all parent sizes.

## Composition Notes
- Circle supports `ring`, `birthdayHat`, and `emoji`.
- Squircle supports `badgeDot` and `host`.
- Incompatible decoration props are ignored by type rather than rendered invisibly.
- ListItem Leading `Type=Avatar` composes `[V2] Avatar` as `Mode=Default`, `Type=Squircle`, `Size=Small`, `Badge_Dot=true`.

## Placeholder SVG Mapping
| Size | Node ID | SVG |
| --- | --- | --- |
| `xxxxlarge` | `81500:7444` | `avatar-placeholder-xxxxlarge.svg` |
| `xxxlarge` | `81500:7443` | `avatar-placeholder-xxxlarge.svg` |
| `xxlarge` | `81500:7446` | `avatar-placeholder-xxlarge.svg` |
| `xlarge` | `81500:7442` | `avatar-placeholder-xlarge.svg` |
| `large` | `81500:7441` | `avatar-placeholder-large.svg` |
| `medium` | `81500:7448` | `avatar-placeholder-medium.svg` |
| `small` | `81500:7440` | `avatar-placeholder-small.svg` |
| `xsmall` | `81500:7447` | `avatar-placeholder-xsmall.svg` |
| `xxsmall` | `81500:7439` | `avatar-placeholder-xxsmall.svg` |
| `xxxsmall` | `81500:7445` | `avatar-placeholder-xxxsmall.svg` |
| `tiny` | `81500:7438` | `avatar-placeholder-tiny.svg` |

## Known Gaps
- Nested `Moment_Ring` has a `Type` variant axis, but Avatar parent exposes only boolean `Ring`; this implementation follows the Avatar parent public prop and renders the observed Moment ring style.
- Exact Figma image fills are sample content, not bundled runtime assets. Consumers pass `src`; missing or failed images fall back to the placeholder.
- Visual registry registered as `structure-only` / `isParityGate: false` for circle-small and squircle-medium. Baselines are Figma exports; component renders placeholder SVG → visualDiff ~54–69%, expected and non-blocking.
- `avatar-circle-medium-default` deferred: Figma export is 84×90 (includes hat overflow space), component element is 56×56 → size mismatch prevents registry entry without a new component-derived baseline.
- Full pixel-parity diff requires deterministic media (consumer `src` or injected fixture image).

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
