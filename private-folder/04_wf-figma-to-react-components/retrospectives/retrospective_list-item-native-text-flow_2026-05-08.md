# ListItemNative Text Flow Retrospective

Date: 2026-05-08

## Scope

- Component: `ListItemNative`
- Source note: `src/figma/list-item-native.source.md`
- Trigger: title/body wrapping, row height growth, and title badge placement
- Related Figma node: `81275:904969`

This retrospective covers the second ListItem pass focused on text behavior. It
does not replace the broader ListItem nested-module retrospective from
2026-05-07.

## What Happened

1. The row initially behaved like a fixed-height sample: long title text either
   clipped, ellipsized, or visually collided with body/trailing content.
2. Re-reading the Figma data showed `Title textAutoResize=WIDTH_AND_HEIGHT` and
   `Body textAutoResize=HEIGHT`.
3. The parent structure behaved like hug/min-height, so row height needed to
   grow when title/body text wrapped.
4. After the height fix, the title badge exposed a second issue: placing the
   badge as a flex sibling after a full-width title span detached it from the
   rendered text end.
5. The implementation was corrected so the title is inline text and the
   `Badge_Dot` follows the text flow with a 4px start gap.

## What Worked

- User screenshots caught the real failure mode faster than a default
  FigmaCompare could.
- Re-checking Figma text metadata clarified that the default sample size was not
  a fixed max-height contract.
- Turning `clip` and `ellipsis` into explicit runtime opt-ins preserved product
  escape hatches without making them Figma-facing defaults.
- Promoting the lesson to both source note and description workflow made the
  reasoning reusable outside the immediate code fix.

## What Failed

- The first fix removed ellipsis but did not fully connect that decision to row
  height growth.
- The title badge was first modeled like a sibling module because Figma auto
  layout made it look adjacent to the title.
- The regression story came after user review. Long text with badge should have
  been part of the initial ListItem branch checks.

## Root Cause

The root cause was translating a visual Figma arrangement into CSS structure too
literally. Figma can show text and badge side by side, but it does not always
make the intended code ownership obvious. In this case, the badge belonged to
the title text flow, not to the parent row's available horizontal space.

The second root cause was treating a sampled row height as stronger evidence
than `textAutoResize` plus parent hug/min-height behavior.

## What Changed

- `ListItemNative` defaults to `textOverflow="wrap"`.
- `clip` and `ellipsis` remain explicit runtime-only opt-ins.
- Title/body/content/row use min-height behavior so wrapped text can grow the
  row.
- Title badge is documented as a Title-owned inline adornment that follows the
  rendered text end.
- `src/figma/list-item-native.source.md` now has a `Text Flow Contract` section.
- `03_wf-figma-to-description` gained `text_behavior` guidance for future
  Figma Description YAML.

## Rules To Keep

- Do not infer one-line ellipsis from a short default label.
- Do not infer fixed row height from a sample instance when text nodes use
  auto-resize and parents are hug/min-height based.
- Do not put a text-owned badge after a full-width text span.
- Always classify text adornments as `rendered-text-end`, `container-end`, or
  `fixed-slot` before implementation.
- Add long-text regression stories when text flow can change layout.

## Still Open

- Visual parity for all ListItem branches is still broader than this text-flow
  fix.
- More components may need the same adornment classification, especially Chips,
  TextButton, TextFields, and title/header-like modules.

## Lessons Promoted

- Knowledge: [Text AutoResize Is A Contract](../knowledge/figma-reading/text-autoresize-is-a-contract.md)
- Promotion: `knowledge`
- Reason: ListItem showed that text auto-resize plus parent hug/min-height must drive row growth before clipping or ellipsis.

- Knowledge: [Inline Adornment Text Flow](../knowledge/figma-reading/inline-adornment-text-flow.md)
- Promotion: `knowledge`
- Reason: The Title Badge looked like a sibling in Figma but needed to follow the rendered title text end in code.

- Knowledge: [Default Screenshot Is Not Contract](../knowledge/figma-reading/default-screenshot-is-not-contract.md)
- Promotion: `reused`
- Reason: The short default label and sampled row height hid long-text behavior.
