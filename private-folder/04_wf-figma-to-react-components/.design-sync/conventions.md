# Chord DS — Design Agent Conventions

This project contains **Chord DS** (@chord-ds/components v0.1.0), the Weverse design system.
34 components are available. Every component renders from the pre-built bundle — no install, no build step needed.

---

## Runtime Setup

The bundle is already loaded. Access components via:

```js
window.ChordDsComponents.<Name>
```

**No ThemeProvider or context wrapper needed.** Components work standalone.

CSS tokens and component styles are loaded from `styles.css` (already imported). Do not add extra style imports.

---

## Using a Component

```jsx
const { Tag } = window.ChordDsComponents;

<Tag color="primary" size="medium" tagType="line" label="Hello" />
```

Each component's props are documented in its `<Name>.d.ts` and `<Name>.prompt.md`. Refer to those for the exact API.

---

## Prop Model

Components are **prop-controlled** — no CSS class overrides needed. Props map internally to `data-*` attributes; the component's own CSS handles the rest.

- Use props to control variant, state, size, color.
- Use `style` prop only for layout concerns (position, margin) on the wrapper.
- Do **not** target internal `chord-*` BEM classes — they are private.

---

## Token System

CSS custom properties follow the `--cds-*` namespace:

| Category | Example token |
|---|---|
| Typography size | `--cds-typography-circular-base-text-size-text-100` (14px) |
| Typography weight | `--cds-typography-circular-base-text-weight-text-weight-700` (700) |
| Line height | `--cds-typography-circular-base-lineheight-text-lineheight-100` (18px) |

Use these tokens in custom layout wrappers or surface-level text elements that sit outside components. Do not hardcode pixel values where a token exists.

---

## Available Components (20 total)

All under `window.ChordDsComponents.*`:

`Avatar` · `BadgeDot` · `BadgeNumber` · `Checkbox` · `Chips` · `FloatingActionButton` · `LoadingDot` · `PaginationDot` · `PaginationList` · `Radio` · `ScrimOverlay` · `Search` · `Skeleton` · `Snackbar` · `Tabs` · `TextButton` · `Toast` · `ToggleSwitch` · `Tooltip` · `TopNavigation`

---

## Known Gaps

- **Fonts**: WeGothicSans, Pretendard, CircularXX TT are not shipped — system font fallback applies. Typography spacing is accurate; rendered font face differs.
- **Search / ToggleSwitch**: Playground preview renders slightly smaller than storybook reference — cardMode viewport constraint; all variants/states render correctly.
- **External images**: `FigmaCompare` stories are excluded — they depend on Figma CDN assets blocked in sandbox.
