# Common Deck Rules Draft

## Non-Negotiables

- Canvas: 1920 x 1080.
- Font: Pretendard for every generated web PPT deck.
- Typography is anchored to the ClickTF deck: `237R2Xz39e9Dr9KjdJPIlI`.
- Prefer top-left title/subtitle for content slides.
- Keep page numbers, progress bars, and excess navigation UI out of exported slides.

## Typography

- Source of truth: `[ClickTF] Design to Dev. WorkFlow(Test Ver.)`.
- Other decks are typography references only; they do not change the official scale.
- Final web PPT output always uses Pretendard, even when Figma source layers report CircularXX TT, Inter, or WeGothicSans.
- Official fixed scale: cover-title 80/700, section-title 60/900, chapter-number 42/700, content-title 52/700, subtitle 32/700, body 24/500, dense-body 20/500, label 20/700, caption 18/500.

## Layout Defaults

- Cover: light mint gradient, large title, optional subtle brand mark.
- Content: top-left title, subtitle below, visual canvas occupying lower 60-70%.
- Center message: one-line message centered; reveal title then subtitle.
- Flow: use stable stages, arrows, or cycles; keep labels clean and repeatable.

## Visual Components

- White blocks/cards on light backgrounds should be crisp, low-border, and radius 8-20.
- Q/A bubbles use compact placeholder lines and colored badges; avoid text overload when the bubble is symbolic.
- Workflow groups should be centered inside their column or stage, not visually drifting.
- On black slides, use cyan as the main accent and keep supporting text muted.

## Motion

- Start visual motion after roughly 0.6s.
- Use dissolve/slide reveals for repeated content.
- Use dim/regroup/relabel transitions to explain transformation.
- Keyboard and click interactions must match.

## Promotion Rule

Only layout, component, color, and motion patterns repeated across at least two decks should move into `style-kit/DECK.md`. Typography is the exception: it is fixed from the ClickTF deck.
