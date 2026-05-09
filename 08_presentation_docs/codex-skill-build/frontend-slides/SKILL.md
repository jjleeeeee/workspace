---
name: frontend-slides
description: Use when the user asks for /frontend-slides, frontend-slides, HTML presentation, web presentation, browser-based deck, single-file slide deck, PPT/PPTX to HTML conversion, or animation-rich presentation generation. Creates zero-dependency, self-contained HTML slide decks from scratch or from PowerPoint content.
---

# Frontend Slides for Codex

Create zero-dependency, self-contained HTML presentations that run in the browser. This is a Codex-adapted version of `zarazhangrui/frontend-slides`.

## Trigger Phrases

Treat these as requests to use this skill:

- `/frontend-slides`
- `frontend-slides`
- `HTML presentation`
- `web presentation`
- `browser deck`
- `PPT/PPTX to HTML`
- `단일 HTML 발표자료`

Codex may not have a native Claude-style slash command registry. In Codex, `/frontend-slides` works as a user-facing trigger phrase for this skill rather than as a separate executable command.

## Core Rules

- Output a single `.html` file with inline CSS and JS unless the user explicitly asks for assets or a project structure.
- No build step, npm app, framework, or runtime dependency for the final deck.
- Every slide must fit the viewport: `.slide { height: 100vh; height: 100dvh; overflow: hidden; }`.
- Use `clamp()` for font sizes and spacing.
- Include reduced-motion support.
- If content is too dense, split or summarize. Never create scrollable content inside a slide.
- Use distinctive art direction. Avoid generic SaaS card grids, default system-font layouts, and purple-gradient AI aesthetics.

## Workflow

1. Detect mode:
   - New presentation: ask for purpose/content only if not provided.
   - PPT conversion: extract content with `scripts/extract-pptx.py`.
   - Existing HTML enhancement: read the HTML and preserve working navigation.
2. For PPT conversion, run:
   ```bash
   python scripts/extract-pptx.py <input.pptx> <output_dir>
   ```
   If `python-pptx` is missing, create a project-local `.venv` and install it there.
3. Choose a visual preset. Read `references/STYLE_PRESETS.md` only when deciding style.
4. Before generating the final deck, read:
   - `references/viewport-base.css`
   - `references/html-template.md`
   - `references/animation-patterns.md`
5. Generate the deck and verify:
   - slide count
   - no per-slide overflow at desktop and mobile sizes
   - keyboard navigation
   - touch/wheel navigation when included
   - hash or progress state if implemented

## Recommended Default Style

For internal product/design-system decks, default to a restrained dark professional style:

- dark background
- one sharp accent color
- strong typographic hierarchy
- sparse UI chrome
- no decorative card mosaics

If the user asks to see options, generate three short preview HTML files first instead of a full deck.

## Supporting Files

- `references/STYLE_PRESETS.md` - preset catalog.
- `references/viewport-base.css` - mandatory viewport fitting CSS. Include its full contents in every generated deck.
- `references/html-template.md` - HTML/JS architecture.
- `references/animation-patterns.md` - motion patterns by feeling.
- `scripts/extract-pptx.py` - PPTX text/image extraction.
- `scripts/export-pdf.sh` - optional PDF export.
- `scripts/deploy.sh` - optional deploy helper.

## Delivery

Return:

- path to the generated HTML deck
- slide count
- navigation controls
- verification commands/results

Do not claim the deck is ready until browser or static verification has been run.
