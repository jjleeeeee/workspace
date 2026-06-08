# CDS Status Report Deck

HTML presentation workspace for the CDS interview status report.

## Source

- Source plan: `content/cds-status-report-slide-deck.md`
- Parsed outline: `content/slide-outline.json`
- Shared deck rules: `../style-kit/DECK.md`

## Visual Rules

- Font: `Pretendard`
- Background flow: `gradient cover -> black narrative -> gradient transition/explanation`
- Charts: use Chart.js config files from `assets/charts/config/`
- Icons: use Lucide SVG icons only when they support status, hierarchy, or navigation

## Chart Targets

- Slide 4: doughnut chart, role distribution, total `n=14`
- Slide 8: horizontal bar, repeated signals, `n=11`
- Slide 9: horizontal bar, CDS starting modes, `n=11`
- Slide 17: horizontal bar, component issue mentions, `n=11`
- Slide 16: prefer tag cluster; use Chart.js only if quantitative emphasis is needed

## Output

- Final HTML deck: `deck/index.html`
- Rendered previews: `preview/`
