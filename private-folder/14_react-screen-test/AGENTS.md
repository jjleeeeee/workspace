# Agent Instructions

## Operating Mode

- First classify each request as: design execution, BLOG writing, or REFERENCE research.
- Keep answers execution-focused for a solo designer/developer.
- If unclear, ask at most one blocking question.
- Do not refactor beyond the requested scope.
- Keep `AGENTS.md` and `CLAUDE.md` identical.

## Implementation Sources (Mandatory)

Before implementing any screen, read and apply these sources in order:

- **Design spec**: Read `/Users/jj.iee/Desktop/chord-design-system/DESIGN.md`. Follow all rules stated there.
- **Token source**: `/Users/jj.iee/Desktop/chord-design-system/tokens` is the canonical JSON SoT. `src/styles/tokens.css` is the compiled runtime output — synced from there via `bash scripts/sync_tokens.sh`. Never edit `tokens.css` directly.
- **DS components**: Import from `04_wf-figma-to-react-components` (package: `@chord-ds/components`). Use existing components wherever a match exists — do NOT re-implement Avatar, Chips, TopNavigation, Tabs, Snackbar, Toast, ToggleSwitch, etc.
- **Figma MCP**: Use `figma-official` MCP only (`get_design_context`, `get_screenshot`, `download_assets`, etc.). If a capability is missing, fall back to the Figma REST API. Do not use `figma-console` or Framelink tools for new work.
- **Icon assets**: Check `/Users/jj.iee/Desktop/chord-design-system/assets` first. If absent, download from Figma via `figma-official` `download_assets`.

## Figma to React Harness Rules

These rules are mandatory for all Figma MCP / React screen implementation work in this repo.

### Hard Gates

- Every prop on the screen component must be consumed by rendered JSX, or be removed.
- Every `useState` must drive at least one visible branch, binding, or handler, or be removed.
- Asset URLs from Figma must resolve and render before the screen is considered implemented. A blank or white area is not a clean build.
- Carousel / pagination counts must derive from the same content array used to render items — never a separate hardcoded value.
- Important surface, text, accent, badge, and CTA colors must be covered by `color_regions` in the diff manifest.
- Every layout literal (number / px value) must be one of:
  - `var(--cds-*)` CSS variable from `src/styles/tokens.css`
  - a member of `<ScreenName>Metrics` (`as const` object in `metrics.ts`) for fixed-format Figma slots
  - a comment starting with `// Figma-frozen:` followed by the node ID or slot reason
- **Before writing any screen JSX**, if `harness/<slug>-nodes.json` exists, read it instead of calling Figma MCP again. For every Figma instance node in the design context (or cache), run:
  `node scripts/harness-cli.mjs code-connect resolve --node-id <nodeId>`
  - Found → use that component + prop mapping exactly.
  - Not found → choose **one** resolution path and justify it in one line before proceeding:
    1. **Build into DS** (preferred for reusable components):
       `node scripts/harness-cli.mjs build-component --node-id <id> --name <PascalName> --file-key <key>`
       Fill JSX+CSS from Figma MCP, run `npm test` in 04_wf, re-run `code-connect index`, then re-run resolve.
    2. **Local composition** (screen-specific only) — inline JSX in the screen file; do not pollute DS.
    3. **Document gap** (third-party widget or unfillable component) — `harness/<slug>-component-gaps.md` with node-id and reason.
- The same numeric value with different semantic meanings must get different metric names in `<ScreenName>Metrics`.

### Required Verification Order

-1. **Large frames (>50 nodes estimated)**: run the `figma-extract` skill first to chunk-extract the node tree into `harness/<slug>-nodes.json`. All subsequent steps read from this cache — do NOT make additional `get_design_context` calls for the same frame.

0. Run `/sync-figma-token` (dry-run, `code_to_figma`) before implementing any screen. Report saved to `/tmp/sync-figma-token-dry-run-{runId}.json`. Drift detected → fix tokens first. `run_harness_check.sh` reads this report automatically (step 0).
1. Run `bash scripts/sync_tokens.sh` when Chord token JSON changes.
2. Run `node scripts/harness-cli.mjs populate-manifest --manifest harness/<slug>-diff-manifest.json` to auto-fill `color_regions[].expected_hex` from committed tokens.css.
3. Run `npm test` — vitest: token snapshot, asset existence, content invariants, metrics invariants.
4. Run `node scripts/harness-cli.mjs color-tokens` — color gate must pass before screenshot work.
5. Run `npm run dev` → open `http://localhost:5173/?screen=<slug>` — no console errors, no blank areas.
6. Capture Playwright screenshot and compare against Figma MCP screenshot.
7. Screenshot diff score must be ≥ 95/100 within 5 loops. Loop 5 still below 95 → stop and report failure.

### Token Rules

- `src/styles/tokens.css` is the compiled runtime SoT. Never gitignore it. Never edit it directly.
- Sync only when tokens actually change: `bash scripts/sync_tokens.sh`.
- Use `var(--cds-*)` in CSS, not raw hex or px values.
- Check `src/styles/tokens.css` for the exact variable name before writing code — do not guess.

### Asset Rules

- Check `/Users/jj.iee/Desktop/chord-design-system/assets` for icons first.
- Download missing images/icons via `figma-official` `download_assets`.
- Store assets under `src/assets/figma/<screen-slug>/`.
- Add an asset existence test in `tests/<ScreenName>.assets.test.ts`.
- Do not use placeholder `<img>` or gray boxes as stand-ins for missing assets.

### Screenshot Diff Rules

- Use `harness-cli normalize` before `harness-cli diff` when the source is a full viewport screenshot.
- Store artifacts in `/tmp/<screen>-{figma,react-loop-N-full,react-loop-N,normalization-loop-N,color-tokens-loop-N,diff-loop-N}.{png,json}`.
- `critical_regions` (inline CTAs, badges, selected tabs, pagination dots) must pass independently of global score.
- `color_regions` must pass independently of global score.
- Mask dynamic regions: status bar time, browser chrome.
- Pixel differences on text glyphs may be excused when the CSS var and Figma token resolve to the same value and are documented in the manifest.

### Section-Mode Rules (Large / Scrollable Screens)

Use sections when the Figma frame height exceeds 852 CSS px (one viewport).

1. **Capture one full-height Figma screenshot** via `figma-official` `get_screenshot` — do not clip. Save to `$FIGMA_SCREENSHOT` as usual.
2. **Define `sections` in the diff manifest** (`harness/<slug>-diff-manifest.json`):
   ```json
   "sections": [
     { "name": "hero",   "scroll_y": 0,    "capture_height": 852 },
     { "name": "feed",   "scroll_y": 852,  "capture_height": 852 },
     { "name": "footer", "scroll_y": 1704, "capture_height": 400 }
   ]
   ```
   - `scroll_y`: CSS px to scroll before browser capture (matches Figma frame Y offset).
   - `capture_height`: CSS px to capture / crop per section. Last section can be shorter.
   - `name`: used in artifact file names (e.g., `<slug>-hero-diff-loop-1.png`).
3. **The harness handles the rest** — `run_harness_check.sh` detects `sections` and runs capture + normalize + diff per section automatically.
4. `color_regions` rects use full-frame coordinates (same as Figma). The diff clips them to each section automatically.
5. When no `sections` key exists (or array is empty), single-viewport mode runs unchanged.

### Metrics Rules

- Create a `<ScreenName>Metrics` object (`as const`) in `src/screens/<ScreenName>/metrics.ts` for each fixed-format Figma slot.
- Add invariant tests: e.g. `expect(Metrics.slotWidth - Metrics.cardHorizontalInset * 2).toBe(Metrics.heroLength)`.
- Prefer Chord tokens for spacing, color, radius, and typography before adding a new metric constant.

### HTML Semantics Rules

- `<p>` is for actual paragraph text only (terms body, description prose). Do NOT use `<p>` for labels, values, names, or single-line UI text.
- Single-line UI text → `<span>` (add `display: block` in CSS if block layout needed).
- If `<p>` must be used inside a flex container, always add `margin: 0` in CSS — never rely on browser reset.

### Interaction Rules

- Selection state must be wired to React state and controls.
- If a carousel has `heroImageNames`, both page count and dot count must use `heroImageNames.length`.
- Empty arrays must render a deliberate empty or fallback state — not a blank container.
