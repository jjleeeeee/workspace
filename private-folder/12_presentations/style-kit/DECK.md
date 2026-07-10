---
name: Shared Web Deck Rules
description: Common rulebook for HTML/web-based presentation decks in this workspace.
scope: common
status: draft
version: 0.1.0
lastUpdated: 2026-05-28
appliesTo:
  - ai-persona/deck
  - llm-harness-workflow/deck
outputType:
  - html-deck
  - web-presentation
outputRule: All deck deliverables in this workspace are browser-based HTML decks.
canvas:
  width: 1920
  height: 1080
font:
  family: Pretendard
  rule: Always use Pretendard for generated web decks, regardless of source Figma font.
sources:
  typography:
    id: clicktf
    fileKey: 237R2Xz39e9Dr9KjdJPIlI
    role: source-of-truth
    evidence: style-kit/figma-slide-research/raw/237R2Xz39e9Dr9KjdJPIlI/typography-deep.json
  commonPatterns:
    - id: figma-slide-a
      fileKey: HbHKFxazHHdjq7WUjpztfb
      role: layout-component-color-motion-reference
    - id: clicktf
      fileKey: 237R2Xz39e9Dr9KjdJPIlI
      role: typography-layout-component-color-motion-reference
    - id: figma-slide-c
      fileKey: 5ApcqynkNIBm8gFf0pCfft
      role: layout-component-color-motion-reference
promotionRule:
  typography: fixed-from-sources.typography
  layoutComponentColorMotion: promote-only-when-repeated-across-at-least-two-decks
topicSpecificRule: Put presentation-specific motifs in each deck folder's local kit, not here.
typographyTokens:
  cover-title: { size: 80, weight: 700, lineHeight: 1.2 }
  section-title: { size: 60, weight: 900, lineHeight: 1.2 }
  chapter-number: { size: 42, weight: 700, lineHeight: 1.32 }
  content-title: { size: 52, weight: 700, lineHeight: 1.2 }
  subtitle: { size: 32, weight: 700, lineHeight: 1.3 }
  body: { size: 24, weight: 500, lineHeight: 1.4 }
  body-strong: { size: 32, weight: 700, lineHeight: 1.3 }
  dense-body: { size: 20, weight: 500, lineHeight: 1.4 }
  label: { size: 20, weight: 700, lineHeight: 1.4 }
  toc-label: { size: 24, weight: 700, lineHeight: 1.4 }
  caption: { size: 18, weight: 500, lineHeight: 1.4 }
  caption-strong: { size: 18, weight: 700, lineHeight: 1.4 }
  micro: { size: 16, weight: 400, lineHeight: 1.4 }
colors:
  black: "#000000"
  white: "#ffffff"
  accent-cyan: "#00cbd5"
backgrounds:
  cover-gradient:
    asset: style-kit/assets/background/figma-cover-gradient.svg
    baseColor: "#d5f3f1"
    rule: Use only as the default first-cover background unless a deck-specific kit explicitly overrides it.
  black:
    color: "#000000"
    rule: Use as the base background for all non-cover slides.
libraries:
  charts:
    name: Chart.js
    url: https://www.chartjs.org/
    rule: Use when a deck needs doughnut, bar, line, or other data charts.
  icons:
    name: Lucide
    url: https://lucide.dev/icons/
    rule: Use when a deck needs interface icons, status icons, arrows, checks, alerts, or tool symbols.
---

# Shared Web Deck Rules

This file is the shared rulebook for HTML/web-based presentation decks in this workspace.
Use it before applying any topic-specific deck kit.

## Source Hierarchy

- Typography source of truth is `sources.typography`.
- Layout, component, color, and motion rules come from repeated patterns across the three researched Figma decks.
- Topic-specific motifs belong in each presentation folder's local kit, not here.
- Final generated decks must use `Pretendard`, even when source Figma layers report another font.

## Non-Negotiables

- Canvas: `1920 x 1080`.
- Font family: `Pretendard`.
- Do not show page numbers, progress bars, or browser/deck navigation UI inside the slide content.
- Prefer top-left title/subtitle on content slides.
- Use centered type only for cover, section divider, and center-message slides.
- Keep text as real HTML text unless a visual effect requires image/canvas rendering.

## Typography

Use fixed tokens, not ranges.

| Role | Size | Weight | Line Height | Use |
| --- | ---: | ---: | ---: | --- |
| `cover-title` | 80px | 700 | 1.2 | Cover H1 |
| `section-title` | 60px | 900 | 1.2 | Chapter/section divider title |
| `chapter-number` | 42px | 700 | 1.32 | Section number |
| `content-title` | 52px | 700 | 1.2 | Default content slide title |
| `subtitle` | 32px | 700 | 1.3 | Large supporting title or panel header |
| `body` | 24px | 500 | 1.4 | Normal body copy |
| `body-strong` | 32px | 700 | 1.3 | Short emphasized body line |
| `dense-body` | 20px | 500 | 1.4 | Dense grids, component lists, compact docs |
| `label` | 20px | 700 | 1.4 | Small stage labels, component labels |
| `toc-label` | 24px | 700 | 1.4 | TOC number/section label |
| `caption` | 18px | 500 | 1.4 | Captions and low-priority descriptions |
| `caption-strong` | 18px | 700 | 1.4 | Emphasized captions |
| `micro` | 16px | 400 | 1.4 | Metadata only |

Typography notes:

- Letter spacing is `0` by default.
- Do not viewport-scale typography.
- Avoid negative letter spacing in generated web decks, even if a Figma source layer used it.
- Dense component/reference slides may use `dense-body`; normal presentation copy should not shrink below `body`.

## Layout Patterns

### Cover

- Use `backgrounds.cover-gradient` for the first slide cover by default.
- After the cover, use `backgrounds.black` by default for contents, content, workflow, diagram, chart, document/card UI, chapter, and centered-message slides.
- Do not use gradient/black reversal as a recurring transition effect unless a deck-specific local kit explicitly requests it.
- Title is the first visual signal, not a small eyebrow.
- Optional brand mark should be subtle and anchored, usually bottom right.
- Keep enough vertical space so the cover breathes.

### Table of Contents

- Use a clean title/subtitle area plus a structured index.
- Keep TOC labels compact and aligned.
- Do not include total page counts unless the deck specifically needs them.

### Content Slide

- Default title position: top-left at a stable margin.
- Do not add a default kicker, eyebrow, or category label above content titles.
- Subtitle sits under the title with the same left edge.
- Main visual/content area should occupy the lower 60-70% of the slide.
- Avoid nesting cards inside cards.

### Center Message

- Use one strong message centered on the slide.
- Reveal title first, then subtitle when animated.
- Keep one-line messages on one line unless the viewport forces wrapping.

### Flow Or Cycle

- Use stable stages, arrows, or cycles to show process.
- Stage groups must be centered inside their column or region.
- Repeated workflow stages should use consistent labels and spacing.
- Prefer simple structural motion: reveal, regroup, relabel.

## Components

### Cards And Blocks

- White blocks on light backgrounds should be crisp and low-border.
- Default radius: `8px`.
- Larger document/card panels may use up to `20px`.
- Avoid heavy shadows; use shadow only to separate overlapping elements.

### Capsules And Labels

- Use capsules for short state/stage labels only.
- Keep labels visually secondary to slide titles.
- Use black text on white capsules or white text on black capsules depending on background.

### Q/A Bubbles

- Use compact placeholder lines when exact text is not important.
- Use a leading `Q` or `A` badge when showing question-answer structure.
- Keep question and answer bubble styles visually related.
- Do not use tails unless the tail quality is deliberate and clean.

### Workflow Circles

- Use large thin-stroke circles for high-level process concepts.
- Circle labels should be centered and short.
- Overlap circles only when the overlap communicates sequence or relationship.

### Instruction Documents

- Use document-like cards for project rules, agent instructions, and separated guideline files.
- Show accumulation by adding short lines, not by dumping paragraphs.
- Split "must do", "must not do", and "tools to use" into separate visual groups when possible.

## Charts And Icons

- Use [Chart.js](https://www.chartjs.org/) when a deck needs doughnut, bar, line, or other data charts.
- Charts should explain repeated signals, denominators, comparisons, or change; do not use charts as decoration.
- Keep Chart.js chart config and data as separate JSON or JavaScript objects so the chart can be regenerated.
- For HTML deck output, render Chart.js directly in the browser and preserve the source config beside the deck.
- Use [Lucide](https://lucide.dev/icons/) when a deck needs interface icons, status icons, arrows, checks, alerts, or tool symbols.
- Use Lucide icons as SVG, with consistent size and stroke width across the deck.
- Icons should support labels and hierarchy; do not replace essential chart labels or core messages with icons.

## Backgrounds And Color

Core palette:

- `black`: `#000000`
- `white`: `#ffffff`
- `accent-cyan`: `#00cbd5`

Background assets:

- `backgrounds.cover-gradient`: use [figma-cover-gradient.svg](/Users/jj.iee/Desktop/workspace/presentations/style-kit/assets/background/figma-cover-gradient.svg) as the first-cover background asset.
- The mint, blue, and pink blur colors inside `figma-cover-gradient.svg` are part of that source image, not reusable palette tokens.

Use `backgrounds.cover-gradient` when:

- The slide is the first cover.
- A deck-specific local kit explicitly requests a non-cover gradient exception.

Use `backgrounds.black` when:

- The slide comes after the cover.
- The slide is contents, narrative/problem-framing, chapter divider, centered message, sparse visual, chart, workflow, diagram, document/card UI, or contrast-heavy body slide.

Color rules:

- Use black for high-contrast chapter and concept slides.
- Use cyan sparingly for labels, highlights, and active states.
- Avoid one-note color themes; pair neutral structure with one accent.

## Motion

- First visual motion should start after roughly `0.6s`.
- Repeated elements should stagger in as a readable burst, not as a slow one-by-one list unless narration requires it.
- Click and keyboard advance must share the same interaction state machine.
- Common sequence: reveal base elements -> reveal detail items -> dim/regroup -> relabel into workflow.
- Slide transitions should dissolve unless a specific scene asks for a stronger transition.

## Rule Promotion

- Typography is fixed from `sources.typography` and can be applied directly.
- Layout/component/color/motion rules should be promoted here only when repeated across at least two decks.
- If a visual direction is unique to one presentation, place it in that presentation's local kit.
