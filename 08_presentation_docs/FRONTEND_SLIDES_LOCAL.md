# Frontend Slides Local Setup

This project has a local-only copy of `zarazhangrui/frontend-slides`.

## Installed Paths

- Skill/template repo: `vendor/frontend-slides`
- Local Python environment: `.venv`
- PPT extraction output: `.frontend-slides/roadmap-extract`

## Convert A PPTX To Extracted Slide Data

```bash
.venv/bin/python vendor/frontend-slides/scripts/extract-pptx.py "src/[Road map] 2026 Chord Design System.pptx" .frontend-slides/roadmap-extract
```

Output:

- `.frontend-slides/roadmap-extract/extracted-slides.json`
- `.frontend-slides/roadmap-extract/assets/`

## Files To Read Before Generating A Better HTML Deck

- `vendor/frontend-slides/SKILL.md`
- `vendor/frontend-slides/STYLE_PRESETS.md`
- `vendor/frontend-slides/viewport-base.css`
- `vendor/frontend-slides/html-template.md`
- `vendor/frontend-slides/animation-patterns.md`

## Recommended Next Step

Use the extracted PPT content plus the local `frontend-slides` style presets to generate a new single-file HTML presentation. Prefer a style preview pass before committing to a full deck.
