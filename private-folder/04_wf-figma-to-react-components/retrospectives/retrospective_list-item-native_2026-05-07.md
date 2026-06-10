# ListItemNative Retrospective

Date: 2026-05-07

## Scope

- Component: `[V2] List_Item_Native`
- Node ID: `57343:18628`
- Key: `e120970b1638c0fa7a5b7638923eb91479384ebe`
- Work type: complex atom / nested module composition
- Current implementation status: `partial/rest-inventoried`

This retrospective covers the ListItem implementation process, not just the
final code state. The main lesson is that ListItem was not one visual row. It
was a parent component wrapping multiple nested component sets: Leading,
Content, Title, Body, Trailing, Divider, and several child atoms.

## What Happened

1. The first implementation read the parent ListItem node and default visual
   branch too shallowly.
2. The default story looked plausible because it rendered a thumbnail, title,
   body, detail text, arrow, and divider.
3. User review revealed that the actual Figma component exposed many more
   nested controls:
   - Leading Type: `Avatar`, `Checkbox`, `Icon`, `Radio`,
     `Rectanglular Thumbnail`, `Square Thumbnail`
   - Trailing Type: `Icon Button`, `Main Button`, `Number Badge`, `Radio`,
     `Toggle`, `TextAndIcon`, `Text Only`, `Icon Only`
   - Title options: badge, text weight, text color
   - Body options: leading icon, text weight, text color
4. Review findings correctly identified that the implementation implied a
   complete row while only covering a default branch.
5. We added a Recursive Nested Module Inventory rule and then used Figma REST
   API as a cross-check when MCP reads did not expose enough component-set
   detail.
6. The source note and component were corrected to mark status as
   `partial/rest-inventoried`, expose the confirmed nested enums, and avoid
   claiming full visual parity.

## What Worked

- The source-note-first workflow helped contain the problem once the gap was
  discovered. The issue could be corrected in `list-item-native.source.md`
  instead of being treated as a vague visual bug.
- Code review findings were useful because they named the exact failure mode:
  parent-default-only implementation.
- Figma REST API was a good fallback when MCP context was too shallow or
  unstable. It exposed actual component set nodes and property definitions for
  Leading, Trailing, Title, and Body.
- Separating `complete`, `partial`, and `deferred` coverage gave us a cleaner
  status than pretending the component was done.
- Reusing existing atoms was still the right direction:
  `Avatar`, `Thumbnail`, `Checkbox`, `Radio`, `IconButton`, `TextButton`,
  `BadgeNumber`, `BadgeDot`, `ToggleSwitch`, `Divider`, and `ChordIcon`.

## What Failed

- We treated the parent default screenshot as if it represented the component
  contract.
- We did not recursively inspect nested component sets before implementing the
  first version.
- Storybook `FigmaCompare` looked like a comparison surface, but it did not have
  a reliable baseline for all relevant branches.
- "Looks like a ListItem" was allowed to pass too early. For a nested component,
  visual plausibility is much weaker evidence than confirmed prop inventory.
- Leading and Trailing were initially compressed into private render branches
  without a full owned-enum inventory.
- The implementation briefly drifted toward "coverage by convenience": build
  the visible branch first, then discover hidden branches from user review.

## Root Cause

The root cause was not only missing description data. The larger issue was that
the read workflow stopped at the parent component too soon.

The Figma description gave enough hints that this was a composition-heavy
component, but the implementation did not treat nested modules as first-class
source objects. The default instance hid most of the important enum surface. In
other words, the failure was mostly an implementation workflow depth problem,
not just a Figma documentation problem.

MCP reads were helpful but not sufficient by themselves. For complex component
sets, a screenshot plus generated design context can miss property definitions
that are visible in Figma UI or REST API. The user screenshot of the Leading
dropdown was the turning point because it proved the source surface was wider
than the implementation.

## Important Discovery

ListItem has at least four nested contract layers:

1. Parent axes:
   `Mode`, `Size`, `Status`
2. Parent optional booleans:
   divider, trailing, small leading, medium leading
3. Nested module enums:
   Leading Type, Trailing Type, Title options, Body options
4. Child atom contracts:
   Avatar size, Thumbnail ratio/size, Checkbox/Radio status,
   TextButton/IconButton size, BadgeNumber label, Divider style, icon assets

The old mental model was:

```text
ListItem = row + leading + content + trailing
```

The corrected mental model is:

```text
ListItem = parent layout contract
         + nested module inventory
         + child atom readiness
         + branch-level visual verification
```

## Workflow Lesson

For simple atoms, a source note can be mostly axes, tokens, layout, and states.
For complex atoms, the source note must become an inventory document before it
becomes an implementation brief.

The right sequence is:

1. Read parent node.
2. Extract composition and nested module names.
3. Read each nested component set separately.
4. Record axes, booleans, text props, instance swaps, and asset roles.
5. Mark each nested module as `complete`, `partial`, or `deferred`.
6. Check whether child atoms are ready.
7. Only then design public props and Storybook Controls.

## What Changed

- `ListItemNative` now exposes Leading Type branches instead of only square
  thumbnail.
- `ListItemNative` now exposes Trailing Type branches instead of only
  TextAndIcon.
- Title and Body options now include badge/icon/text-weight/text-color controls.
- `listItemNativeCoverage` is explicitly `partial/rest-inventoried`.
- The source note includes a Nested Module Inventory table.
- Figma REST audit output is stored at
  `src/figma/rest-audits/list-item-native.rest.json`.
- Storybook docs should present the component as partial/rest-inventoried, not
  complete.

## Still Open

- `Type=Rectanglular Thumbnail` is larger than the default medium row height:
  REST reports `156x88`, while the default medium row is `80px` tall. This needs
  branch screenshot verification before layout can be called correct.
- Small Leading Avatar is reported as `40x40`, while the current Avatar public
  sizing model may not expose an exact `40px` squircle size. This needs an
  Avatar/ListItem integration decision.
- Default visual diff should not be treated as full parity. Branch-level
  baselines are needed for Leading, Trailing, Title, and Body variants.
- Menu should not be rebuilt on top of ListItem until ListItem coverage is
  broader and branch behavior is verified.

## Rules To Keep

- Do not mark a complex component complete from the parent default screenshot.
- Do not treat nested module enums as optional research. They are part of the
  component contract.
- Do not hide partial coverage in `Known Gaps`. Use explicit coverage:
  `complete`, `partial`, `deferred`.
- Do not let Storybook imply complete coverage when only the default branch is
  reliable.
- Use Figma REST API or Figma UI screenshots when MCP cannot expose component
  set property definitions deeply enough.

## Next Recommendation

Recommended next action: verify ListItem branch screenshots before expanding
usage into Menu.

Start with these branches:

- Leading `Rectanglular Thumbnail`, Medium
- Leading `Avatar`, Small
- Trailing `Icon Button`
- Trailing `Main Button`
- Body `Leading Icon=false`

Tradeoff: this slows down visible component count, but it prevents another
"plausible but shallow" implementation from becoming the base of a larger
composition.

Alternative: pause ListItem and first close the Avatar exact-size gap. This is
cleaner for atom correctness, but it delays validating the ListItem row-height
problem.

## Final Takeaway

ListItem exposed the difference between building a visual sample and building a
design-system component. The visual sample can be produced from one screenshot.
The component requires a recursive inventory of every nested module it owns or
composes.

The workflow is now stronger because the failure was made explicit: complex
components need inventory first, implementation second, and visual parity only
after branch-level evidence exists.

## Lessons Promoted

- Knowledge: [Nested Module Inventory](../knowledge/component-complexity/nested-module-inventory.md)
- Promotion: `knowledge`
- Reason: ListItem showed that nested component sets must be inventoried before implementation.

- Knowledge: [Partial Coverage Labeling](../knowledge/component-complexity/partial-coverage-labeling.md)
- Promotion: `knowledge`
- Reason: ListItem must remain visibly `partial/rest-inventoried` until branch-level verification exists.

- Knowledge: [Default Screenshot Is Not Contract](../knowledge/figma-reading/default-screenshot-is-not-contract.md)
- Promotion: `knowledge`
- Reason: The parent default screenshot hid Leading, Trailing, Title, and Body contract branches.

- Knowledge: [MCP vs REST API](../knowledge/figma-reading/mcp-vs-rest-api.md)
- Promotion: `knowledge`
- Reason: REST API exposed nested property definitions that MCP reads did not fully surface.
