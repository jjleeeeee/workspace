# FloatingActionButton Source Note

## MCP Reads

- Console MCP `figma_get_component_for_development_deep` on `88900:5063` (branch `vuq1CyC1Pi4NZYE7ximg3I`) — 2026-06-19
  - Re-read after designer cleaned up unnecessary layer nesting

## Figma Entry

- Node ID: `88900:5063`
- Name: `💠 FloatingButton`
- File: Chord-Design-System (branch `vuq1CyC1Pi4NZYE7ximg3I`)
- Version: v.0.6.0

## Axes

| Axis | Values | Default |
|------|--------|---------|
| Mode | Default, Fixed | Default |
| Function | Go_to_Top, Go_to_Botton (Figma typo) | Go_to_Top |

4 variants total (2×2).

## Props Contract

| Figma Axis | React Prop | Type |
|------------|------------|------|
| Mode | `mode` | `'default' \| 'fixed'` |
| Function | `fabFunction` | `'goToTop' \| 'goToBottom'` |

## Layout

- Component size: 40×40px (`system/size/icon/40mquad` → `--cds-system-size-icon-40mquad`)
- cornerRadius: 100 (fully circular)
- Icon size: 20×20px (`small(20)` via icon_area)
- Icon centered in button

## Tokens

### Default mode

| Property | Token | Value |
|----------|-------|-------|
| Background | `system/color/surface/default` | `--cds-system-color-surface-default` (#fff) |
| Stroke | `system/color/outline/default-100a` | `--cds-system-color-outline-default-100a` (#0000001a) |
| Icon color | `system/color/icon/default` | `--cds-system-color-icon-default` (#000) |

### Fixed mode

| Property | Token | Value |
|----------|-------|-------|
| Background | `system/fixed_color/surface/default` | `--cds-system-fixed-color-surface-default` (#000) |
| Stroke | `system/fixed_color/outline/default-100a` | `--cds-system-fixed-color-outline-default-100a` (#ffffff1a) |
| Icon color | `system/fixed_color/icon/default` | `--cds-system-fixed-color-icon-default` (#fff) |

### Shadow (both modes)

- DROP_SHADOW: x=0, y=6, blur=28, spread=0, rgba(0,0,0,0.10)

## Icons

| Function | chord-icons key | Figma node |
|----------|----------------|------------|
| Go_to_Top | `scrollToTopMedium` | `16319:48550` |
| Go_to_Bottom (Go_to_Botton) | `scrollToBottomMedium` | `15773:15259` |

Both 20×20px, currentColor mode.

## Known Gaps

- Shadow spread token (`VariableID:1327:57541`) not resolved to named token — using raw value `0` (confirmed from Figma data).
- `figmaKey` for scroll icons are branch-specific placeholders; will need update when branch merges.

## Coverage

- Axes: complete
- Layout/size: complete
- Tokens: complete
- Icons: complete
- Nested modules: N/A (icon_area is a flat icon slot, not a DS atom with separate management)
- Coverage: **complete**
