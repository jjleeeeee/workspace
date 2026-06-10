# List_Item_Web Retrospective

Date: 2026-05-08

## Scope

- Component: `ListItemWeb`
- Figma component set: `69579:9043`
- Key variants inspected:
  - `69579:9044` - `Mode=Default, Size=Small, States=Default`
  - `69579:9056` - `Mode=Default, Size=Small, States=Disabled`
  - `69579:9080` - `Mode=Default, Size=Medium, States=Default`
  - `57343:20409` - nested `_atoms / modules / Trailing (Optional)`
- Source note: `src/figma/list-item-web.source.md`

## What Happened

The first implementation treated the Figma description as enough source truth and generalized from the default row too quickly.

That produced three wrong contracts:

- `States=selected` was added even though Figma only has `Default`, `Hover(Pressed)`, and `Disabled`.
- The body leading `12x12 icon_area` was omitted.
- The disabled-small branch was treated as normal `TextAndIcon + opacity`, but live Figma node `69579:9056` actually swaps trailing to a `20x20 Check` branch and renders as `393x56`.

The correction pass re-read the live Figma nodes and separated parent-owned contract from nested-module contract before changing code.

## What Worked

- **Live variant readback caught a description conflict.** The description says disabled uses state-layer opacity, but the live disabled-small node also changes trailing to `Type=Check`. Reading only the default node would not reveal that.
- **TDD caught the exact contract gaps.** The RED run failed on the intended missing behaviors: no selected state, body default/icon, default Thumbnail leading, and disabled-small check trailing.
- **Nested inventory prevented over-expansion.** The full Trailing component set has 8 types, but `ListItemWeb` live variants use only `TextAndIcon` plus one disabled-small `Check` exception. The rest stayed deferred instead of being pulled into parent API.
- **Branch-specific visual baseline helped.** A separate `list-item-web-small-disabled` baseline made the `393x56 + check trailing + direct divider` branch visible to the harness.

## What Needs Improvement

- **Description should not be treated as complete proof.** It is strong source material, but it can lag or summarize behavior. Live variant readback must verify state/size branches.
- **Default screenshot bias still happened.** The default row hid the disabled-small trailing branch. Complex components need representative state/size reads before implementation.
- **Source note should be updated before code.** The correction became clean only after source note, tests, stories, and visual registry all used the same live Figma contract.

## Current Decisions

- `states` is `default | hover-pressed | disabled`.
- No selected indicator is implemented for `ListItemWeb`.
- Default body label is `Body Text`.
- Body icon area uses `ChordIcon name="nullMedium" size={12}` because the live body module uses `icon_area size=xxsmall(12)` with the null icon selection.
- Leading defaults to nested `Thumbnail ratio="1:1" radius="on"` at `44x44` or `56x56`.
- Default trailing branch is `TextAndIcon`.
- `Mode=Default, Size=Small, States=Disabled` renders a `Check` trailing branch and direct divider branch.
- Full Trailing module options remain child-owned/deferred for `ListItemWeb`.

## Validation Result

- `npm test -- ListItemWeb`: 40 passed
- `npm run typecheck`: passed
- `npm run rules:audit`: passed
- `npm run knowledge:audit`: passed
- `npm run build-storybook`: passed
- `npm run visual:baseline`: `list-item-web-default` and `list-item-web-small-disabled` baselines OK
- `npm run visual:diff`:
  - `list-item-web-default`: `structure-only`, non-gating OK, `visualDiff=0.092491`
  - `list-item-web-small-disabled`: `structure-only`, non-gating OK, `visualDiff=0.05442`
- Browser smoke:
  - `atoms-listitemweb--small-disabled`
  - root size `393x56`
  - trailing branch `check`
  - divider branch `direct`
  - console errors `0`

## Known Gaps

- Full `_atoms / modules / Trailing (Optional)` branches are not implemented as parent API. They remain child-owned/deferred.
- Full Title/Body module matrices are not implemented. Parent covers the observed branch and fixed/default token mapping.
- Visual registry entries remain `structure-only`, not full parity, because Figma uses sampled media and nested module rendering.

## Lessons Promoted

- Knowledge: [Description vs Live Variant Divergence](../knowledge/figma-reading/description-vs-live-variant-divergence.md)
- Promotion: `knowledge`
- Reason: This is reusable for any complex component where description text summarizes behavior but live variant nodes may include branch-specific swaps, size changes, or nested module differences.

## Next Step

Apply the same live-variant verification pattern when reviewing `TitleHeader`, `TopNavigation`, `Tabs`, `DropdownBox`, and other Claude-generated complex components.

---

## Addendum — Leading Type Correction (2026-05-08)

### What Happened

After the initial session was complete, the user pointed out that the Leading slot
had more types than just Square Thumbnail. Investigation revealed:

- The source note's Known Gaps incorrectly stated "Recursive read confirmed only
  Type=Square Thumbnail" and marked the slot as not promoted.
- The previous session had read the child variant's *currently active* INSTANCE
  node (which happened to be Square Thumbnail) and concluded that was the only type.
- The actual component set `_atoms / modules / Leading (Optional)` (`57343:20398`)
  exposes 6 types: Avatar, Checkbox, Icon, Radio, Rectangular Thumbnail, Square
  Thumbnail.

### Root Cause

Knowledge card `knowledge/figma-reading/nested-instance-swap-discovery.md`
documents the correct discovery procedure, but the trigger was missed. The session
saw API output showing Square Thumbnail, did not identify it as an unpromoted swap,
and concluded it was the only type.

### Fix Applied

- Read `_atoms / modules / Leading (Optional)` component set at depth=1 → 6 types.
- Read each type variant at depth=3 to confirm inner atoms (Avatar, Checkbox, Radio,
  Thumbnail dimensions per size).
- Updated source note Nested Module Inventory: all 6 leading types marked `complete`.
- Added `leadingType` enum prop to `ListItemWeb` + `leadingComponentIds` table.
- Added `leadingType` to Storybook Controls and `LeadingTypes` story.

### Prevention

- Added forbidden rule to `rules/nested-composition.md`: "Do not conclude a nested
  instance swap slot is fixed to one type based on API output alone."
- Updated knowledge card with this failure case and the rule promotion note.
- **Knowledge cards require a trigger; rules do not.** Patterns that caused silent
  failures should be promoted to `rules/` so they are enforced unconditionally.
