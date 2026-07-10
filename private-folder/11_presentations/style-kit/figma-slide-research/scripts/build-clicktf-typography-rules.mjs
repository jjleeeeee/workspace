import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const researchDir = path.resolve(__dirname, "..");
const clickTfDir = path.join(researchDir, "raw", "237R2Xz39e9Dr9KjdJPIlI");
const mergedDir = path.join(researchDir, "merged");

const sourceSummary = {
  schemaVersion: 1,
  extractionKind: "figma-console-mcp typography deep extraction summary",
  sourceFile: {
    key: "237R2Xz39e9Dr9KjdJPIlI",
    name: "[ClickTF] Design to Dev. WorkFlow(Test Ver.)",
    url: "https://www.figma.com/slides/237R2Xz39e9Dr9KjdJPIlI",
  },
  finalFontRule: "Pretendard",
  slideCount: 65,
  textLayerCount: 313,
  note: "Figma Console MCP extracted all 65 slides and counted 313 text layers. This file stores role-level evidence and representative layer samples for typography rule promotion; exact per-node text geometry can be expanded in later chunks if a token needs audit-level proof.",
  slides: [
    ["1:42", 2], ["1:123", 11], ["170:3201", 2], ["23:681", 1], ["165:3191", 3],
    ["146:259", 1], ["146:432", 1], ["146:474", 1], ["146:310", 5], ["146:545", 5],
    ["146:522", 5], ["146:569", 6], ["146:1564", 2], ["5:2", 41], ["23:560", 41],
    ["5:91", 44], ["10:326", 24], ["23:698", 24], ["146:1568", 2], ["156:2587", 2],
    ["160:2644", 2], ["160:2648", 1], ["160:2671", 1], ["160:2662", 1], ["143:212", 1],
    ["146:1694", 2], ["146:1713", 3], ["146:1732", 3], ["151:1900", 3], ["152:1971", 6],
    ["152:2032", 10], ["156:2439", 3], ["156:2489", 1], ["156:2568", 1], ["156:2606", 1],
    ["156:2542", 1], ["9:190", 1], ["160:2688", 1], ["165:3154", 2], ["164:2703", 2],
    ["164:2715", 1], ["164:2725", 5], ["164:2748", 4], ["164:2774", 4], ["164:2793", 4],
    ["165:3161", 2], ["21:204", 1], ["165:3098", 1], ["165:2957", 1], ["165:3014", 1],
    ["165:2976", 1], ["165:2995", 1], ["165:2938", 1], ["165:3033", 2], ["165:3116", 1],
    ["165:2877", 1], ["165:3053", 1], ["165:3068", 1], ["165:3083", 1], ["165:3122", 2],
    ["165:2854", 2], ["165:2934", 2], ["165:2844", 2], ["164:2809", 1], ["14:809", 1],
  ].map(([nodeId, textLayerCount], index) => ({
    index: index + 1,
    nodeId,
    name: String(index + 1),
    textLayerCount,
  })),
  observedFontFamilies: {
    "CircularXX TT": 157,
    Pretendard: 112,
    Inter: 35,
    WeGothicSans: 9,
  },
  roleCounts: {
    "cover-title": 1,
    body: 94,
    label: 61,
    "content-title": 58,
    "section-title": 5,
    "chapter-number": 5,
    subtitle: 4,
    caption: 85,
  },
  topRoleStyles: {
    "cover-title": [{ sizePx: 80, weight: 700, count: 1 }],
    "section-title": [{ sizePx: 60, weight: 900, count: 5 }],
    "chapter-number": [{ sizePx: 42, weight: 700, count: 5 }],
    "content-title": [
      { sizePx: 52, weight: 700, count: 57 },
      { sizePx: 60, weight: 900, count: 1 },
    ],
    subtitle: [{ sizePx: 32, weight: 700, count: 4 }],
    body: [
      { sizePx: 20, weight: 500, count: 35 },
      { sizePx: 32, weight: 700, count: 22 },
      { sizePx: 36, weight: 700, count: 17 },
      { sizePx: 20, weight: 700, count: 6 },
      { sizePx: 24, weight: 500, count: 5 },
      { sizePx: 60, weight: 900, count: 3 },
      { sizePx: 24, weight: 400, count: 3 },
    ],
    label: [
      { sizePx: 20, weight: 700, count: 47 },
      { sizePx: 26, weight: 700, count: 9 },
      { sizePx: 24, weight: 700, count: 5 },
    ],
    caption: [
      { sizePx: 18, weight: 700, count: 28 },
      { sizePx: 18, weight: 500, count: 27 },
      { sizePx: 16, weight: 700, count: 18 },
      { sizePx: 16, weight: 400, count: 6 },
      { sizePx: 14, weight: 400, count: 3 },
      { sizePx: 13, weight: 700, count: 3 },
    ],
  },
  representativeLayers: [
    {
      slideIndex: 1,
      id: "146:218",
      text: "Design to Dev. Workflow Automation",
      role: "cover-title",
      x: 100,
      y: 408,
      width: 1288,
      height: 192,
      fontFamilyOriginal: "CircularXX TT",
      fontStyleOriginal: "Bold",
      fontSize: 80,
      fontWeight: 700,
    },
    {
      slideIndex: 3,
      id: "170:3203",
      text: "문제 정의",
      role: "section-title",
      x: 100,
      y: 544,
      width: 1720,
      height: 72,
      fontFamilyOriginal: "CircularXX TT",
      fontStyleOriginal: "Black",
      fontSize: 60,
      fontWeight: 900,
    },
    {
      slideIndex: 3,
      id: "170:3204",
      text: "01",
      role: "chapter-number",
      x: 760,
      y: 465,
      width: 400,
      height: 55,
      fontFamilyOriginal: "CircularXX TT",
      fontStyleOriginal: "Bold",
      fontSize: 42,
      fontWeight: 700,
    },
    {
      slideIndex: 4,
      id: "165:3167",
      text: "서막의 시작",
      role: "content-title",
      x: 100,
      y: 100,
      width: 1720,
      height: 62,
      fontFamilyOriginal: "Pretendard",
      fontStyleOriginal: "Bold",
      fontSize: 52,
      fontWeight: 700,
    },
    {
      slideIndex: 16,
      id: "10:274",
      text: "공통",
      role: "subtitle",
      x: 100,
      y: 236,
      width: 374,
      height: 38,
      fontFamilyOriginal: "Pretendard",
      fontStyleOriginal: "Bold",
      fontSize: 32,
      fontWeight: 700,
    },
    {
      slideIndex: 2,
      id: "146:236",
      text: "문제 정의",
      role: "body",
      x: 1475,
      y: 722,
      width: 330,
      height: 34,
      fontFamilyOriginal: "Pretendard",
      fontStyleOriginal: "Medium",
      fontSize: 24,
      fontWeight: 500,
    },
    {
      slideIndex: 14,
      id: "5:52",
      text: "Check Box",
      role: "dense-body",
      x: 453,
      y: 474,
      width: 313,
      height: 32,
      fontFamilyOriginal: "CircularXX TT",
      fontStyleOriginal: "Medium",
      fontSize: 20,
      fontWeight: 500,
    },
    {
      slideIndex: 14,
      id: "5:48",
      text: "Action & Selection (액션 및 선택)",
      role: "label",
      x: 453,
      y: 260,
      width: 313,
      height: 64,
      fontFamilyOriginal: "CircularXX TT",
      fontStyleOriginal: "Bold",
      fontSize: 20,
      fontWeight: 700,
    },
    {
      slideIndex: 16,
      id: "5:134",
      text: "Avatar",
      role: "caption",
      x: 552,
      y: 335,
      width: 289,
      height: 29,
      fontFamilyOriginal: "CircularXX TT",
      fontStyleOriginal: "Medium",
      fontSize: 18,
      fontWeight: 500,
    },
  ],
};

const typographyPatterns = {
  schemaVersion: 2,
  sourceOfTruth: {
    key: "237R2Xz39e9Dr9KjdJPIlI",
    name: "[ClickTF] Design to Dev. WorkFlow(Test Ver.)",
    rule: "Typography is anchored to the ClickTF deck. Other decks are references, not typography sources of truth.",
  },
  finalFontFamily: "Pretendard",
  rule: "Generated web PPT decks must use Pretendard for every role. Source Figma font families are evidence only.",
  scale: [
    { role: "cover-title", sizePx: 80, weight: 700, lineHeight: 1.2, letterSpacing: 0 },
    { role: "section-title", sizePx: 60, weight: 900, lineHeight: 1.2, letterSpacing: 0 },
    { role: "chapter-number", sizePx: 42, weight: 700, lineHeight: 1.32, letterSpacing: 0 },
    { role: "content-title", sizePx: 52, weight: 700, lineHeight: 1.2, letterSpacing: 0 },
    { role: "subtitle", sizePx: 32, weight: 700, lineHeight: 1.3, letterSpacing: 0 },
    { role: "body", sizePx: 24, weight: 500, lineHeight: 1.4, letterSpacing: 0 },
    { role: "body-strong", sizePx: 32, weight: 700, lineHeight: 1.3, letterSpacing: 0 },
    { role: "dense-body", sizePx: 20, weight: 500, lineHeight: 1.4, letterSpacing: 0 },
    { role: "label", sizePx: 20, weight: 700, lineHeight: 1.4, letterSpacing: 0 },
    { role: "toc-label", sizePx: 24, weight: 700, lineHeight: 1.4, letterSpacing: 0 },
    { role: "caption", sizePx: 18, weight: 500, lineHeight: 1.4, letterSpacing: 0 },
    { role: "caption-strong", sizePx: 18, weight: 700, lineHeight: 1.4, letterSpacing: 0 },
    { role: "micro", sizePx: 16, weight: 400, lineHeight: 1.4, letterSpacing: 0 },
  ],
  evidence: {
    slideCount: 65,
    textLayerCount: 313,
    roleCounts: sourceSummary.roleCounts,
    observedFontFamilies: sourceSummary.observedFontFamilies,
    topRoleStyles: sourceSummary.topRoleStyles,
  },
  exceptions: [
    {
      role: "body",
      reason: "ClickTF dense component matrix produces many 20/500 layers. For normal presentation body copy, keep 24/500 and use dense-body for compact grids.",
      observed: sourceSummary.topRoleStyles.body,
    },
    {
      role: "content-title",
      reason: "TOC title appears as 60/900 once. Default content title remains the repeated 52/700 pattern.",
      observed: sourceSummary.topRoleStyles["content-title"],
    },
  ],
};

const commonRulesDraft = `# Common Deck Rules Draft

## Non-Negotiables

- Canvas: 1920 x 1080.
- Font: Pretendard for every generated web PPT deck.
- Typography is anchored to the ClickTF deck: \`237R2Xz39e9Dr9KjdJPIlI\`.
- Prefer top-left title/subtitle for content slides.
- Keep page numbers, progress bars, and excess navigation UI out of exported slides.

## Typography

- Source of truth: \`[ClickTF] Design to Dev. WorkFlow(Test Ver.)\`.
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

Only layout, component, color, and motion patterns repeated across at least two decks should move into \`style-kit/DECK.md\`. Typography is the exception: it is fixed from the ClickTF deck.
`;

async function writeJson(filePath, value) {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

await mkdir(clickTfDir, { recursive: true });
await mkdir(mergedDir, { recursive: true });
await writeJson(path.join(clickTfDir, "typography-deep.json"), sourceSummary);
await writeJson(path.join(mergedDir, "typography-patterns.json"), typographyPatterns);
await writeFile(path.join(mergedDir, "common-rules-draft.md"), commonRulesDraft);

console.log("Updated ClickTF typography evidence and common typography rules.");
