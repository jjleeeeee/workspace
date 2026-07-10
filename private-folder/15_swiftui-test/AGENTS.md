# Agent Instructions

## Operating Mode

- First classify each request as one of: design execution, BLOG writing, or REFERENCE research.
- Keep answers execution-focused for a solo designer/developer.
- If unclear, ask at most one blocking question.
- Do not refactor beyond the requested scope.
- Keep `AGENTS.md` and `CLAUDE.md` identical.

## Figma to iOS Harness Rules

These rules are mandatory for Figma MCP / SwiftUI conversion work.

### Hard Gates

- Every public content field must be read by the rendered view, or removed.
- Every `@State` must drive at least one visible branch, binding, or action, or be removed.
- Asset names from Figma must pass runtime lookup before the screen is considered implemented.
- A blank image area is not acceptable as a clean build. Run `Resource Probe` before changing layout.
- Page counts, carousel counts, and pagination dots must derive from content arrays, not separate hardcoded values.
- Important surface, text, accent, badge, and CTA colors must be covered by `color_regions` in the diff manifest.
- Layout literals from Figma must be one of:
  - `ChordToken.*`
  - `<ScreenName>Metrics.*`
  - a local comment starting with `Figma-frozen:` and the node/slot reason
- The same numeric value with different meanings must get different metric names.
- iOS-only SwiftUI APIs must be guarded with `#if os(iOS)` when the package also builds for macOS.

### Required Verification Order

1. Regenerate tokens with `scripts/generate_chord_tokens.py` when token JSON changes.
2. Run `swift test`.
3. Run `Resource Probe` for any screen with downloaded or bundled images.
4. Run `FigmaHarnessCLI color-tokens` and stop before screenshot work if color token consistency fails.
5. Run the target SwiftUI preview in the iOS Simulator browser.
6. Capture the Codex browser screenshot and compare against the Figma screenshot.
7. Screenshot diff must score at least 95/100 within 5 loops.

### Asset Rules

- Use `get_design_context` asset URLs or explicit Figma screenshots to create local resources.
- Store resources under `Sources/SwiftUIPreviewTest/Resources`.
- Use `FigmaResourceImage` for bundled Figma images.
- Add an asset lookup test for each required image.
- Add an asset quality test for content images such as hero/carousel photos. A file that is mostly flat color, logo-only, blurred gradient, or placeholder art is not a valid downloaded asset.
- Do not replace missing assets with `Image(systemName: "photo")` unless the missing asset is listed as a known gap.

### Screenshot Diff Rules

- Use `FigmaHarnessCLI normalize` before `FigmaHarnessCLI diff` when the SwiftUI source is a full Simulator screenshot.
- Store artifacts as `/tmp/<screen>-figma.png`, `/tmp/<screen>-swiftui-loop-<n>-full.png`, `/tmp/<screen>-swiftui-loop-<n>.png`, `/tmp/<screen>-normalization-loop-<n>.json`, `/tmp/<screen>-color-tokens-loop-<n>.json`, `/tmp/<screen>-diff-loop-<n>.png`, and `/tmp/<screen>-diff-loop-<n>.json`.
- Pass only when score is `>= 95`.
- Add `critical_regions` for small but meaningful UI anchors such as inline CTAs, badges, selected tabs, and pagination dots. Critical regions must pass independently; global score cannot override them.
- Add `color_regions` for canonical surface, text, accent, badge, and CTA colors. Color regions must pass independently; global score cannot override them.
- Iterate up to 5 loops. If loop 5 is still below 95, stop and report failure.
- Mask dynamic regions such as status bar time, simulator/browser chrome, and SwiftUI preview overlays.
- Pixel differences can be ignored only when a semantic pass region proves both sides use matching Figma token/variable names and Swift `ChordToken.*`, `<ScreenName>Metrics.*`, or another token wrapper with the same resolved value.
- The color-token gate passes only when the manifest maps a Figma variable/token name to `ChordToken.Color.*`, `FigmaLocalColor.*`, or another explicit color-token wrapper with the same resolved value.
- Run color-token consistency before screenshot diff. When a `color_regions` entry maps the Figma variable/token to `ChordToken.Color.*`, `FigmaLocalColor.*`, or another explicit color-token wrapper with the same resolved value, screenshot diff treats that region as semantic pass and accepts pixel color rendering deltas.
- Raw literal equality is not a semantic pass.
- Raw SwiftUI color references such as `Color.white`, `Color(red:)`, or one-off `Color.*` extensions are not color-token proof.
- Asset regions cannot be excused by semantic overrides.

### Metrics Rules

- Create a `<ScreenName>Metrics` enum for fixed-format Figma slots.
- Add invariant tests for derived dimensions, such as `slotWidth - inset * 2 == heroLength`.
- Prefer Chord tokens for spacing, color, radius, and typography before adding a metric.

### Interaction Rules

- Selection state must be wired to controls.
- If a carousel has `heroImageNames`, both pages and dots must use `heroImageNames.count`.
- Empty arrays must render a deliberate empty or fallback state.
