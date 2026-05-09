# Menu + ListItemNative Composition Retrospective

Date: 2026-05-07

## Scope

- Component: `[V2] Menu`
- Related child: `[V2] List_Item_Native`
- Work type: parent container composition
- Current status: Menu container uses `ListItemNative` compact title-only rows.

## What Happened

- Menu initially kept itself buildable with private `.chord-menu__row` markup.
- That private row duplicated responsibilities that belong to `ListItemNative`:
  typography, padding, row status, title rendering, and disabled state.
- After `ListItemNative` gained enough verified surface, Menu was changed to
  compose `ListItemNative` instead of drawing rows itself.
- Because Menu needs a `240px` title-only row while default `ListItemNative` is
  `393px`, the fix was not CSS scale. The child opened a compact composition
  branch through public props.

## What Worked

- The new knowledge layer made the failure easy to name: parent component versus
  child contract ownership.
- `ListItemNative` could remain `partial/rest-inventoried` while still exposing
  a verified Menu-specific branch.
- Tests caught the important regression risks:
  private row classes removed, default row count preserved, disabled state
  mapped to ListItemNative, and DS Scrollbar used for overflow.
- Source notes now say exactly what Menu owns and what ListItemNative owns.

## What Needs Improvement

- Menu's visual comparison still validates container plus default compact rows,
  not every `ListItemNative` branch.
- `ListItemNative` still has deferred branch verification for non-Menu cases
  such as rectangular thumbnail row height and Avatar exact size.
- Parent composition branches should be discovered earlier, before a temporary
  duplicate row implementation becomes convenient.

## Key Lesson

Parent components should not copy child internals. If a parent needs a narrower,
smaller, or simpler child shape, add a verified child branch and compose that
branch through public props.

For Menu, the ownership line is:

```text
Menu:
surface, shadow bounds, panel size, max-height, clipping, placement metadata,
overflow scrollbar

ListItemNative:
row height, title/body, leading/trailing, typography, padding, disabled visual
```

## Validation Result

- `npm test -- Menu ListItemNative`: passed
- `npm test`: passed, 57 files / 175 tests
- `npm run typecheck`: passed
- `npm run knowledge:audit`: passed
- `npm run rules:audit`: passed
- `npm run build-storybook`: passed
- `npm run visual:baseline`: passed
- `npm run visual:diff`: passed
- `menu-default`: `visualDiff=0.02191`, `visualMatch=0.97809`

## Lessons Promoted

- Knowledge: [Parent Container, Child Contract](../knowledge/component-complexity/parent-container-child-contract.md)
- Promotion: `knowledge`
- Reason: Menu showed that parent components must compose verified child branches instead of duplicating child internals.
