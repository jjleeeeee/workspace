---
name: presentation-slide-style-kit
version: v2
source_of_truth: ../ai-persona/deck/index.html
purpose: AI-generated single-file HTML presentations
canvas:
  width: 1920
  height: 1080
  scaling: fit-viewport
theme:
  mode: dark
  background: "#000000"
  text: "#FFFFFF"
font:
  family: Pretendard
output:
  format: single-html
  dependencies: none
required_rules:
  - use 1920x1080 fixed deck wrapper scaled to viewport
  - keep each slide within one viewport
  - use dark background by default
  - use mint accent sparingly
  - avoid decorative gradients and generic card mosaics
  - use line icons from https://lucide.dev/icons/ when icons are needed
  - prefer Chart.js when charts are needed
  - preserve keyboard navigation when generating a deck
tokens:
  bg: "#000000"
  surface_2: "#161616"
  surface_3: "#1F1F1F"
  surface_4: "#282828"
  text: "#FFFFFF"
  gray_600: "#999999"
  gray_500: "#777777"
  accent: "#01D5DF"
  negative: "#FE5B58"
  border: "#282828"
  outline: "rgba(255,255,255,0.05)"
layout_defaults:
  slide_padding: "100px 80px"
  title_size: "48px"
  body_size: "24px"
  radius_large: "16px"
  radius_medium: "8px"
  radius_small: "4px"
---

# Presentation Slide Style Kit v2

## 1. 기준과 사용 목적

이 문서는 `../ai-persona/deck/index.html` 완성본을 기준으로 다음 단일 HTML 발표자료를 만들기 위한 AI 지시문이다. 실제 색상, 타이포, 여백, 컴포넌트 판단은 이 문서와 `../ai-persona/deck/index.html`을 우선한다.

목표는 이미 완성된 발표자료의 화면 감각을 재사용하는 것이다. 모바일 앱 UI 토큰 스케일이나 다른 디자인 시스템 문서의 값은 발표자료에 그대로 적용하지 않는다.

## 2. Visual Principles

- 전체 톤은 검정 배경, 흰 텍스트, 민트 액센트의 고대비 다크 발표 스타일이다.
- 슬라이드는 1920x1080 한 화면 안에 완전히 들어가야 하며, 내부 스크롤을 만들지 않는다.
- 타이포는 크게 쓴다. 기본 본문도 24px을 기준으로 하고, 제목은 48px 이상을 사용한다.
- 섹션 구분은 큰 여백, 얇은 선, outline, 타이포 위계로 만든다.
- 민트(`#01D5DF`)는 핵심 번호, 강조 태그, 진행 상태, 액센트 outline에만 절제해서 사용한다.
- 장식용 그라데이션, 복잡한 카드 모자이크, 마케팅형 히어로 구성은 사용하지 않는다.
- 다이어그램은 SVG를 허용하되, 검정 배경 위에서 white/mint/gray만 사용한다.
- 아이콘이 필요하면 Lucide의 line icon 스타일을 사용하고, 채움형/일러스트 아이콘은 사용하지 않는다.
- 차트가 필요하면 `../ai-persona/deck/index.html`의 단순 SVG/바 차트 패턴을 재사용할 수 있지만, 새 정량 차트는 Chart.js를 우선한다.

## 3. Tokens

### Color

| Role | CSS variable | Value | Use |
|---|---:|---:|---|
| Background | `--bg` | `#000000` | slide base |
| Surface 2 | `--surface-2` | `#161616` | cards, photo placeholders |
| Surface 3 | `--surface-3` | `#1F1F1F` | diagram nodes, inactive blocks |
| Surface 4 | `--surface-4` | `#282828` | table heads, bar tracks, clock background |
| Text | `--text` | `#FFFFFF` | primary text |
| Gray 600 | `--gray-600` | `#999999` | secondary copy, meta labels |
| Gray 500 | `--gray-500` | `#777777` | counters, dim labels |
| Accent | `--accent` | `#01D5DF` | mint emphasis |
| Negative | `--negative` | `#FE5B58` | warning or don't marker only |
| Border | `--border` | `#282828` | subtle card border |
| Outline | `--outline` | `rgba(255,255,255,0.05)` | table row separators |

### Radius

| Token | Value | Use |
|---|---:|---|
| `--r-lg` | `16px` | cards, table wrappers, persona photos |
| `--r-md` | `8px` | compact cards, diagram boxes |
| `--r-sm` | `4px` | small labels if needed |
| pill | `999px` | tags, capsules, bars |
| circle | `50%` | comparison and use-case circles |

### Borders

- Default card border: `1px solid var(--border)`.
- Strong white outline: `1px solid #FFFFFF` for structural circles, step cards, table wrapper.
- Accent outline: `2px solid var(--accent)` for the active or to-be item.
- Thin separators: `1px solid var(--outline)` or `rgba(255,255,255,0.2)` for table headers.

## 4. Typography

Use Pretendard as the default web font. Mobile UI text tokens are not the presentation scale.

| Element | Size | Weight | Line height | Letter spacing |
|---|---:|---:|---:|---:|
| Cover title | `80px` | 800 | 1.15 | `-1.6px` |
| Cover subtitle | `36px` | 700 | 1.32 | `-0.72px` |
| Closing emphasis | `52px` | 800 | 1.2 | optional |
| Slide title | `48px` | 800 | 1.2 | `-0.96px` |
| Persona name large | `40px` | 800 | 1.15 | `-0.8px` |
| Circle headline | `36px` | 700 | 1.3 | 0 |
| Step card title | `32px` | 700 | 1.3 | 0 |
| Key sentence | `28px` | 700 | 1.45 | 0 |
| Persona subtitle / section title | `28px` | 400-700 | 1.3-1.5 | 0 |
| Body / table / list | `24px` | 400-700 | 1.5-1.7 | 0 |
| Diagram / bar value | `22px` | 700 | 1.4 | 0 |
| Meta / counter / timeline desc | `20px` | 400-700 | 1.3-1.6 | 0 |
| Tag / small label | `18px` | 700 | 1.3 | `0.04em-0.06em` |

Rules:
- Do not use body text below 18px except inside dense SVG diagrams.
- Use weight changes before introducing extra colors.
- Use mint text only for functional emphasis: numbers, section labels, links, active tags.
- Long Korean titles should line-break intentionally with `<br>` instead of shrinking aggressively.

## 5. Layout

### Deck wrapper

Use a fixed 1920x1080 deck and scale it to the viewport.

```css
.deck-wrapper {
  position: absolute;
  width: 1920px;
  height: 1080px;
  transform-origin: top left;
  overflow: hidden;
}
```

The runtime should scale with:

```js
const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
```

### Slide base

```css
.slide {
  position: absolute;
  inset: 0;
  background: var(--bg);
  padding: 100px 80px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow: hidden;
}
```

### Content rhythm

- Default slide padding: `100px 80px`.
- Title and subtitle gap: `24px`, with subtitle margin compensation allowed.
- Main `.content`: `flex: 1`, centered vertically, `gap: 40px`, `margin-top: 76px`.
- Two-column grid: `grid-template-columns: 1fr 1fr`, `gap: 80px`.
- Three-column grid: `repeat(3, 1fr)`, `gap: 40px`.
- Half split slide: left/right each `50%`; left padding `100px 60px 100px 80px`, right padding `100px 80px 100px 60px`.

## 6. Component Patterns

### Cover

- Use `.slide--cover slide--cover-gradient` for the primary cover layout.
- Apply the Figma-derived full-bleed background through `::before` with `assets/background/figma-cover-gradient.svg`.
- Keep the cover text above the background with `position: relative; z-index: 1`.
- Title: `80px`, heavy, black, two lines allowed.
- Subtitle: `36px`, bold, black.
- Meta: `20px`, regular, `rgba(0,0,0,0.65)`, positioned near the bottom with `margin-top: auto`.
- Add `data-hide-counter` to the cover slide so the global slide number is hidden.
- Place the Weverse logo in the hidden counter position: `right: 80px`, `bottom: 100px`, `width: 142px`, `height: 20px`.
- Apply `mix-blend-mode: overlay` to the cover logo to match the Figma `mix-blend-overlay` treatment.

### TOC

- Use half split: title and subtitle on the left, two TOC columns on the right.
- Each TOC item has a 24px number and 24px text.
- Dimmed items stay white in the current style; dimming is by hierarchy and repetition, not opacity.

### Table

- Wrap tables in `.table-wrap` with `1px solid #FFFFFF`, `16px` radius, and hidden overflow.
- Table text is 24px.
- Header text is gray 600 with a subtle bottom border.
- Row separators use `--outline`.
- Use pill tags for source types: mint for primary data, white for external references, gray outline for internal materials.

### Tags

- Pill radius: `999px`.
- Small tag text: `18px / 700`.
- Padding: `4px 16px` for compact tags, `8px 24px` for circle labels.
- Mint and white tags use black text.

### Circle cards

- Use for binary comparison such as AS-IS / TO-BE.
- Size: about `460px x 460px`.
- Border: white `1px` for neutral, mint `2px` for highlighted.
- Label: pill at top, 18px uppercase.
- Headline: 36px bold.
- List: 24px regular, centered.

### Use-case capsule

- Outer capsule: mint `1px` outline, `999px` radius, `32px 64px 64px` padding.
- Inner circles: `400px x 400px`, overlapping by `-40px`.
- Use `z-index` to preserve readable overlaps.
- Keep text centered and broken into short lines.

### Timeline

- Use horizontally distributed columns.
- Stage label: 26px bold.
- Connector line: white `1px` with small arrow.
- Stage card: white fill, `8px` radius, black 22px bold text.
- Bullet list: 24px regular, `1.7` line height.

### Step grid

- Use a 2x3 grid for six-part systems.
- Gap: `16px`.
- Cards: white `1px` border, `16px` radius, centered text.
- Number pill: white fill, black text, 18px bold.
- Step name: 32px bold.
- Description: 28px, gray 600.

### Persona page

- Top layout: persona photo left, information stack right.
- Photo width: `460px`, radius `16px`, object-position `center top`.
- Identity block: name 40px, sub-name 28px gray.
- Meta grid: `repeat(4, 1fr)`, labels 20px gray, values 20px bold.
- Bio: 24px gray, `1.65` line height.
- Insight cards: three columns, `8px` radius, 22-24px title, 18px list items.

### Usage bars and clock

- Bar label column: `180px`.
- Bar track: `32px` height, surface 4, pill radius.
- Bar fill: mint, pill radius.
- Clock visual may use inline SVG. Use surface 4 background, mint active slice, gray guide lines.

### Icons

- Use icons only when they clarify an action, state, or diagram.
- Source icons from Lucide: `https://lucide.dev/icons/`.
- Use line icons only. Do not use filled, duotone, emoji, sticker, or illustrative icons.
- Match the slide style: `stroke-width` around `1.5-2`, `24px` default size, white or mint stroke.
- If the icon is decorative rather than informative, omit it.

### Charts

- Prefer Chart.js for new charts: `https://www.chartjs.org/docs/latest/`.
- Existing `index.html` chart patterns, such as usage bars and inline SVG clock diagrams, may be reused for simple static visuals.
- Use Chart.js when the chart has axes, legends, multiple datasets, tooltips, or needs reliable scaling.
- Keep chart colors within the deck palette: black background, white labels, gray grid, mint primary data.
- Avoid 3D charts, rainbow palettes, heavy fills, and chart decorations that reduce readability.

### SVG diagrams

- Use inline SVG for dense evaluation trees or process maps.
- Keep text readable: 17px minimum, 20-26px preferred.
- Nodes: surface 3 for groups, mint for leaf emphasis, white for category pills.
- Strokes: `#FFFFFF`, `#01D5DF`, or muted gray only.

### Counter

- Place counter at bottom right: `bottom: 100px`, `right: 80px`.
- Text: `20px`, gray 500.
- Hide counter on special slides with `data-hide-counter`.

## 7. Slide Recipes

### Cover slide

Use `slide--cover slide--cover-gradient` with the Figma gradient background. Combine an 80px black title, 36px black subtitle, and 20px muted-black meta stack. Hide the global counter with `data-hide-counter`, then place the overlay-blended Weverse logo at the same bottom-right position.

### TOC slide

Use `slide--halfsplit`. Put narrative title on the left and two TOC columns on the right. Avoid icons and extra cards.

### Problem / comparison slide

Use two circle cards with a mint arrow between them. Neutral state gets white outline; target state gets mint outline and mint label.

### Source / evidence slide

Use a large table with pill tags. Keep rows sparse. Add source links as 20px mint text near the lower-left if needed.

### Process slide

For 4 stages, use the horizontal timeline pattern. For 6 categories, use the 2x3 step grid.

### Persona slide

Use a photo-led layout: image left, identity/meta/bio/insights right, usage bars at the bottom. Do not split persona information across too many small cards.

### Evaluation slide

Use an SVG tree or two-column criteria list. Use mint leaf nodes for scoring labels and white/surface nodes for group labels.

### Closing slide

Use a centered 52px title with a short 24px subtitle. Keep the slide nearly empty.

## 8. Do / Don't

### Do

- Use `index.html` as the final style source.
- Keep each slide self-contained and non-scrollable.
- Use large text and deliberate line breaks.
- Use mint for structure and emphasis, not decoration.
- Prefer outline, spacing, and type hierarchy over filled decorative boxes.
- Use Lucide line icons when icons are necessary.
- Use Chart.js for new quantitative charts unless a simple static SVG/bar pattern is enough.
- Preserve keyboard navigation: right/down advances, left/up goes back.
- Keep generated HTML dependency-free, except optional web font loading.

### Don't

- Do not apply mobile UI typography scale directly to slides.
- Do not use 14px body text for presentation content.
- Do not introduce purple, beige, navy, or multicolor gradient themes.
- Do not create nested card-heavy SaaS layouts.
- Do not add decorative blobs, glow effects, or background gradients.
- Do not make slide content scroll.
- Do not use Figma asset URLs unless the user explicitly asks; they may expire.
- Do not use filled icons, emoji icons, or custom decorative icon illustrations.
- Do not hand-roll complex charts when Chart.js is appropriate.

## 9. Quick Prompt Block

Use this block when asking an AI to generate another deck from this style:

```text
Create a single-file HTML presentation using style-kit/slide-style-kit.md as the style source.
Read the style kit first. If a layout decision is ambiguous, use ai-persona/deck/index.html as the completed reference.
Use a fixed 1920x1080 .deck-wrapper scaled to the viewport.
Use the dark presentation style from ai-persona/deck/index.html: black background, white text, mint #01D5DF accents, large Pretendard typography, and no decorative gradients.
Keep every slide within one viewport with no internal scrolling.
Use 48px slide titles, 24px body/table/list text, 80px cover titles, and the component recipes from the style kit.
If icons are needed, use Lucide line icons from https://lucide.dev/icons/ only.
If charts are needed, prefer Chart.js from https://www.chartjs.org/docs/latest/; reuse ai-persona/deck/index.html chart patterns only for simple static visuals.
Preserve click and arrow-key navigation.
```
