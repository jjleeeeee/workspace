# Figma to iOS Harness Retrospective

## What Failed

The simulator browser, preview host, and hot reload were healthy, but the card hero image rendered as a blank white area.

The first suspicion was resource lookup. That was wrong. The PNG existed inside the installed preview host bundle, and `Resource Probe` proved `UIImage` could decode it as `373x373`.

The actual failure was layout: the image view was loaded, but the hero slot was not receiving a stable fixed-format size inside the generated SwiftUI card. The Figma frame used a `393` wide slot with `10` point side insets, so the hero needed a `373 x 373` contract.

## Harness Upgrades

1. Resource probe first.
   - Run `Resource Probe` before debugging card layout.
   - It reports `Bundle.module`, `Bundle.main`, all bundle hits, recursive app hit, and decoded image size.

2. Fixed-format metrics become code contracts.
   - `FigmaLiveNewsCardMetrics.slotWidth = 393`
   - `cardHorizontalInset = 10`
   - `heroLength = 373`
   - Test invariant: `slotWidth - inset * 2 == heroLength`

3. Token bridge stays generated.
   - `scripts/generate_chord_tokens.py` regenerates `ChordTokens.swift`.
   - UI code should use `ChordToken` for colors, spacing, radius, typography.

4. Visual verification order.
   - `swift test`
   - `Resource Probe` preview
   - target screen preview
   - Codex browser screenshot

## Next Rules

- Do not trust "asset exists" as proof. Confirm decode and render separately.
- Do not leave Figma fixed-format slots as flexible SwiftUI frames without an invariant.
- When preview host output differs from package tests, add a small diagnostic preview before changing production layout.
- Keep Figma-derived dimensions grouped in a metrics namespace until the design system has a semantic token for them.

## Hard Gates Added

- Content fields must be consumed by the rendered view.
- `@State` values must drive visible state or be removed.
- Carousel page counts must come from the same array used to render pages.
- Figma assets must pass lookup/decode verification before visual work is considered complete.
- Magic layout literals must be represented as `ChordToken`, screen metrics, or a `Figma-frozen:` comment.
- iOS-only APIs must be guarded in cross-platform SwiftPM targets.
