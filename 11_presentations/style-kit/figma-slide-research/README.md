# Figma Slide Research

This folder collects compact research data from three Figma Slides decks so the shared web PPT rules can be promoted into `style-kit/DECK.md`.

## Scope

- Analyze all slides, not only representative samples.
- Keep raw per-slide summaries under `raw/<fileKey>/nodes/`.
- Promote only repeated patterns into merged common rules.
- Force `Pretendard` for all generated web PPT output, regardless of source Figma font metadata.

## Extraction Status

This is the first compact pass from the Figma Desktop Bridge. It captures slide inventory, canvas position, child count, and inferred pattern buckets. Deep text/geometry extraction should be run on promoted candidates when exact coordinates are needed.
