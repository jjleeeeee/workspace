# Visual Registry + Media Baseline Retrospective

Date: 2026-05-07

## Scope

- Components reviewed: `Avatar`, `Thumbnail`, `ListItemNative`, `Search`, `Tag`
- Work type: component audit, visual registry coverage, asset gap cleanup
- Current status: `ListItemNative` is registered for structural visual diff; `Avatar` and `Thumbnail` remain manual/deferred for media-dependent baselines.

## What Happened

- The component audit found that most atom baselines were registered, but `Avatar`, `Thumbnail`, and `ListItemNative` were outside automated visual diff.
- Tests were added first to make the missing registry coverage and public barrel leak visible.
- `components/index.ts` was cleaned so Storybook stories are no longer exported as package API.
- `Avatar` gained runtime-only `componentSize` and `imageSize` props so verified parent compositions can match nested bounds without CSS scale.
- `ListItemNative` now uses those Avatar sizing hooks for Leading Avatar `40x40` and `46x46`.
- `ListItemNative` default structural comparison was added to `visual-registry.json`.
- `Avatar` and `Thumbnail` were briefly registered, then visual diff failed for the right reason: their Figma baselines include concrete media/image fills while the implementation intentionally renders placeholder/no-image defaults.
- `Search` clear icon moved from unresolved placeholder to the confirmed `deleteMedium` registry glyph while preserving the `24x24 frame + 18x18 internal graphic` contract.
- `Tag` was visually inspected after a higher diff ratio; the actual and baseline matched structurally, so no code change was made.

## What Worked

- The visual diff failure was useful because it exposed a bad comparison target, not necessarily bad component CSS.
- Keeping `Avatar` sizing as runtime-only props preserved Figma-facing Storybook Controls while still allowing parent compositions to be accurate.
- Source notes now separate three cases more clearly:
  - automated visual diff registered
  - manual/deferred because media is not deterministic
  - structural comparison only
- Search improved from placeholder to mapped asset without over-interpreting a similar icon.
- Tests now protect against:
  - Storybook story exports leaking into public package API
  - missing `ListItemNative` visual registry coverage
  - media-dependent `Avatar`/`Thumbnail` baselines being registered too early

## What Needs Improvement

- `Avatar` and `Thumbnail` still need deterministic reference media before they can be useful automated diff targets.
- `ListItemNative` visual diff passes, but it is a structural/default-row comparison, not full branch parity.
- The visual registry currently encodes only registered entries. Deferred/manual entries live in source notes and tests, but there is not yet a separate machine-readable manifest for visual coverage status.
- `Tag` diff is acceptable but still relatively high because tiny text/stroke antialiasing dominates the ratio.

## Key Lesson

Visual diff is only meaningful when baseline and implementation represent the same state and content policy. A Figma screenshot with concrete media is not a valid default component baseline if the React component intentionally renders a placeholder until the consumer supplies `src`.

Before adding a component to `visual-registry.json`, classify the comparison:

```text
registered:
same state, same content policy, deterministic baseline

deferred-media:
Figma baseline has concrete media or sample image, implementation default does not

manual-only:
Storybook FigmaCompare helps review, but automated pass/fail would be misleading

structural:
layout/size/composition is checked, but full visual parity is not claimed
```

## Validation Result

- `npm test`: passed, 59 files / 181 tests
- `npm run typecheck`: passed
- `npm run knowledge:audit`: passed
- `npm run rules:audit`: passed
- `npm run build-storybook`: passed
- `npm run visual:baseline`: passed
- `npm run visual:diff`: passed
- `list-item-native-default`: `visualDiff=0.094807`, `visualMatch=0.905193`
- `search-default`: `visualDiff=0.014056`, `visualMatch=0.985944`
- `tag-default`: `visualDiff=0.055556`, `visualMatch=0.944444`

## Follow-Up

- Add deterministic reference media for `Avatar` and `Thumbnail`, then register automated visual diff.
- Consider a lightweight `visual-coverage` manifest if deferred/manual registry decisions become hard to track from source notes alone.
- Add branch-specific `ListItemNative` baselines for Leading non-default cases after screenshots are confirmed.

## Lessons Promoted

- Knowledge: [Media-Dependent Baselines](../knowledge/visual-validation/media-dependent-baselines.md)
- Promotion: `knowledge`
- Reason: The same mistake can recur whenever a Figma baseline includes sample media but the component default intentionally uses placeholder or consumer-supplied content.
