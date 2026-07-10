# React Screen Harness Plan

## Context

`14_react-screen-test/` is currently empty. Goal: a self-contained React workspace where the user drops a Figma link and gets a verified screen built strictly from the Chord Design System tokens and the existing React component library in `04_wf-figma-to-react-components/`. The verification loop mirrors the proven SwiftUI harness in `13_swiftui-test/`: regenerate tokens → unit tests → color-token gate → screenshot diff with a ≥95 score, retried up to 5 loops.

Why now:
- The user has a working SwiftUI harness pattern that catches "clean build but visually wrong" failures (see `13_swiftui-test/docs/figma-to-ios-harness-retro.md`).
- The React component library already implements 20+ tokenized components, so screen work should compose them — never re-invent visuals or hard-code values.
- The Chord Design System lives at `/Users/jj.iee/Desktop/chord-design-system/` (DESIGN.md + tokens). All visual values must come from there via tokens.

Outcome: paste a Figma node URL → harness produces a React screen that passes content, token, and screenshot gates inside this single folder.

## Hard Gates (mandatory before "done")

1. Every prop on the screen component is consumed by rendered JSX, or removed.
2. Every `useState` drives a visible branch / binding / handler, or removed.
3. Carousel/pagination counts derive from the content array — never a separate constant.
4. Every layout literal (px / number) is one of:
   - a CSS variable from `src/styles/tokens.css` (`var(--cds-*)`)
   - a member of `<ScreenName>Metrics` (TS `as const`) for fixed-format Figma slots
   - a `// Figma-frozen:` comment with the node/slot reason
5. Every important surface/text/accent/badge/CTA color is covered by `color_regions` in the screen's diff manifest and resolves to a Chord token.
6. Asset lookups (downloaded Figma images) pass a runtime probe test before any layout work.
7. Components from `@chord-ds/components` are used wherever a matching component exists; do not re-implement Avatar, Chips, TopNavigation, etc.

## Architecture

```
14_react-screen-test/
├── CLAUDE.md / AGENTS.md            # mirror 13_swiftui-test rules, React-flavored
├── README.md
├── package.json                     # vite, react, @playwright/test, vitest, pixelmatch, pngjs
├── vite.config.ts
├── playwright.config.ts
├── tsconfig.json
├── index.html
├── src/
│   ├── main.tsx                     # reads ?screen=<slug>, mounts screen
│   ├── screens/
│   │   └── <ScreenName>/
│   │       ├── index.tsx
│   │       ├── metrics.ts           # Figma-frozen slot constants + invariants
│   │       └── content.ts           # typed fixture data
│   ├── styles/
│   │   └── tokens.css               # synced snapshot, committed
│   └── assets/figma/                # downloaded Figma images, committed
├── scripts/
│   ├── sync_tokens.sh               # rebuild tokens.css from chord-design-system
│   ├── harness-cli.mjs              # subcommands: color-tokens | normalize | diff
│   └── run_harness_check.sh         # full verification loop
├── harness/
│   └── <screen-slug>-diff-manifest.json
└── tests/
    ├── tokens.test.ts               # token CSS var presence + values
    ├── asset-lookup.test.ts         # every required image resolves + decodes
    └── <ScreenName>.content.test.ts # content-binding invariants
```

### Component reuse (no re-implementation)

Import from `@chord-ds/components` (relative path, or path alias in `tsconfig.json`).

Available exports — confirmed in `04_wf-figma-to-react-components/src/components/index.ts`:
Avatar, BadgeDot, BadgeNumber, Checkbox, Chips, FloatingActionButton, LoadingDot, PaginationDot, PaginationList, Radio, ScrimOverlay, Search, Skeleton, Snackbar, Tabs, TextButton, Toast, ToggleSwitch, Tooltip, TopNavigation, plus `chord-icons`.

Path strategy: `tsconfig.json` alias `"@chord-ds/components": "../04_wf-figma-to-react-components/src"` plus matching Vite alias. No publish step required.

### Tokens — addressing the Codex finding

The neighbor project `04_wf-figma-to-react-components/scripts/build-tokens.mjs` was recently changed to read tokens directly from `/Users/jj.iee/Desktop/chord-design-system/tokens`, with no in-repo fallback. Codex flagged that any clean checkout without that exact sibling path fails. This plan must not repeat that mistake.

Rules for this repo:
- `src/styles/tokens.css` is **committed** — never gitignored. It is the runtime SoT for the React app.
- `scripts/sync_tokens.sh` accepts `--tokens-dir` (env: `CHORD_TOKENS_DIR`) defaulting to `/Users/jj.iee/Desktop/chord-design-system/tokens`. Missing dir → exit 2 with a clear "set CHORD_TOKENS_DIR or pass --tokens-dir" message, not a silent build failure.
- Sync runs only when the user invokes it; the build itself does not depend on the external dir existing.
- `tests/tokens.test.ts` snapshots a small set of canonical tokens (`--cds-color-roles-primary`, `--cds-typography-body-m-400`, etc.) so accidental token drift is caught even between syncs.

### Screen routing

`src/main.tsx` reads `?screen=<slug>` from URL, dispatches to a lazy-loaded screen module. Playwright targets `http://localhost:5173/?screen=<slug>` per fixed viewport (default mobile 393×852).

### Metrics namespace

Per `13_swiftui-test` lesson: fixed-format Figma slots become a typed namespace with invariant tests.

```ts
// src/screens/LiveNewsCard/metrics.ts
export const LiveNewsCardMetrics = {
  slotWidth: 393,
  cardHorizontalInset: 10,
  heroLength: 373,
} as const;

// tests/LiveNewsCard.metrics.test.ts
expect(LiveNewsCardMetrics.slotWidth - LiveNewsCardMetrics.cardHorizontalInset * 2)
  .toBe(LiveNewsCardMetrics.heroLength);
```

## Verification Loop (mirrors `13_swiftui-test/scripts/run_harness_check.sh`)

`scripts/run_harness_check.sh` runs, in order:

1. `scripts/sync_tokens.sh` if `--sync-tokens` flag or token JSON mtime is newer.
2. `npm test` — vitest: token presence, asset lookup, content invariants.
3. `node scripts/harness-cli.mjs color-tokens --screen <slug> --manifest harness/<slug>-diff-manifest.json` — every `color_regions` entry maps a Figma variable/token to a `var(--cds-*)` whose resolved value matches the Figma resolved hex. Fail closed.
4. Boot Vite dev server (background), wait for ready.
5. Playwright screenshot → `/tmp/<slug>-react-loop-<n>-full.png` (full viewport) and a cropped `/tmp/<slug>-react-loop-<n>.png`.
6. Figma MCP `get_screenshot` for the node → `/tmp/<slug>-figma.png` (manual on first run; cached after).
7. `harness-cli normalize` to align sizes/DPR if needed.
8. `harness-cli diff` — pixelmatch global score plus `critical_regions` (inline CTAs, badges, selected tabs, dots) and `color_regions`, all must independently pass; global ≥95 alone is not enough.
9. Loop 1..5. Loop 5 still < 95 → stop, write `/tmp/<slug>-diff-loop-5.json`, report failure.
10. Tear down dev server.

Artifact naming follows the SwiftUI harness exactly so future tooling can be cross-platform:
`/tmp/<slug>-{figma,react-loop-N-full,react-loop-N,normalization-loop-N,color-tokens-loop-N,diff-loop-N}.{png,json}`.

### Diff manifest schema

```json
{
  "screen": "live-news-card",
  "figma": { "fileKey": "...", "nodeId": "..." },
  "viewport": { "width": 393, "height": 852, "deviceScaleFactor": 2 },
  "mask_regions": [ { "name": "status-bar", "rect": [0,0,393,44] } ],
  "critical_regions": [
    { "name": "cta", "rect": [16, 720, 361, 48], "min_score": 95 }
  ],
  "color_regions": [
    { "name": "card-surface", "rect": [10, 100, 373, 1],
      "figma_token": "system/color/surface/default",
      "css_var": "--cds-color-surface-default" }
  ]
}
```

`harness-cli color-tokens` reads this, queries the DOM via Playwright `evaluate(getComputedStyle)` to get each `css_var`'s resolved value, and compares hex against the Figma resolved value. Mismatch → fail.

## Implementation Order

1. Scaffold Vite + React + TS project; commit baseline.
2. Wire `@chord-ds/components` alias; smoke-render `<Chips/>` to prove tokens.css loads.
3. Write `scripts/sync_tokens.sh` with configurable input dir; commit a first `tokens.css` snapshot.
4. Add vitest + `tests/tokens.test.ts` snapshotting canonical tokens.
5. Write `scripts/harness-cli.mjs` (`color-tokens`, `normalize`, `diff` subcommands using pixelmatch + pngjs).
6. Write Playwright config + capture helper.
7. Write `scripts/run_harness_check.sh` end-to-end, mirroring SwiftUI script structure.
8. Author CLAUDE.md / AGENTS.md with the Hard Gates above, identical content.
9. Build one reference screen (the same `live-news-card` used by SwiftUI harness) to prove the full loop end-to-end with score ≥95.

## Critical Files to Create

- `package.json`, `vite.config.ts`, `tsconfig.json`, `playwright.config.ts`, `index.html`, `src/main.tsx`
- `src/styles/tokens.css` (committed)
- `scripts/sync_tokens.sh`, `scripts/harness-cli.mjs`, `scripts/run_harness_check.sh`
- `harness/<slug>-diff-manifest.json` per screen
- `CLAUDE.md` + identical `AGENTS.md`
- `src/screens/<ScreenName>/{index.tsx,metrics.ts,content.ts}` per screen

## Reused References

- Token JSON SoT: `/Users/jj.iee/Desktop/chord-design-system/tokens/{color,size,typography,typography.semantic}.json`
- DESIGN.md rules: `/Users/jj.iee/Desktop/chord-design-system/DESIGN.md` (token-first, library-first, alpha-suffix-overlay-only, fixed-color-immersive-only, page-title-hierarchy)
- React components: `/Users/jj.iee/Desktop/workspace/private-folder/04_wf-figma-to-react-components/src/components/`
- Token build reference (with caveat): `04_wf-figma-to-react-components/scripts/build-tokens.mjs`
- SwiftUI harness to mirror: `/Users/jj.iee/Desktop/workspace/private-folder/13_swiftui-test/scripts/run_harness_check.sh`
- SwiftUI retro / hard-gate origin: `13_swiftui-test/docs/figma-to-ios-harness-retro.md`, `13_swiftui-test/CLAUDE.md`

## Verification (acceptance for this plan's implementation)

End-to-end on `live-news-card`:
1. Run `CHORD_TOKENS_DIR=/Users/jj.iee/Desktop/chord-design-system/tokens scripts/sync_tokens.sh` → new `src/styles/tokens.css` committed.
2. `npm test` → all green: token snapshot, asset lookup, content binding, metrics invariants.
3. `npm run dev` → open `http://localhost:5173/?screen=live-news-card` → screen renders without console errors.
4. `scripts/run_harness_check.sh` (single command) → completes within 5 loops with diff score ≥95, all `critical_regions` pass, all `color_regions` pass.
5. Sanity: temporarily rename `/Users/jj.iee/Desktop/chord-design-system/tokens` → `npm run build` still succeeds (proves tokens.css is committed and not fetched at build time). Restore.

## Out of Scope

- Publishing `@chord-ds/components` as an npm package.
- Storybook integration in this repo.
- Visual regression CI on GitHub Actions (local-first).
- Dark mode toggle UI (token CSS supports it; no screen-level toggle required for the first reference screen).

## Open Risks

- Browser font rendering differs from Figma; mitigated by `color_regions` semantic pass and reasonable mask regions, not by chasing pixel parity on glyphs.
- Pixel diff cost on retina viewport — keep viewport to 393×852 @ 2x DPR by default; allow override per manifest.
- Component library has uncommitted modifications (see `git status`) including `tokens.css` and `build-tokens.mjs`; do not auto-sync from that working tree in scripts — read from chord-design-system tokens only.
