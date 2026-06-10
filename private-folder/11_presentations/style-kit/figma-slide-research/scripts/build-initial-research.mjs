import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const researchDir = path.resolve(__dirname, "..");

const CANVAS = { width: 1920, height: 1080 };
const ROW_GAP = 1320;
const COL_GAP = 2160;

const decks = [
  {
    key: "HbHKFxazHHdjq7WUjpztfb",
    name: "Chord ChatBot",
    url: "https://www.figma.com/slides/HbHKFxazHHdjq7WUjpztfb",
    source: "Figma Slides Desktop Bridge",
    slideIds: [
      "1:560",
      "1:565",
      "3:90102",
      "3:90125",
      "3:93364",
      "3:90",
      "3:63805",
      "3:90155",
      "3:90252",
      "3:93383",
      "3:90328",
      "3:90451",
      "3:93108",
      "3:90209",
      "3:93318",
      "3:93343",
      "3:93344",
      "3:93358",
      "3:90993",
      "3:91001",
      "3:91023",
      "3:97",
      "3:92822",
      "3:92617",
      "3:92740",
      "3:92723",
      "3:92788",
      "3:92806",
    ],
    childCounts: [
      5, 7, 7, 3, 6, 6, 9, 5, 5, 25, 46, 69, 71, 7, 0, 1, 2, 2, 4,
      8, 6, 7, 19, 7, 6, 8, 4, 2,
    ],
    positionFor(index) {
      const zero = index - 1;
      return zero < 20
        ? { x: zero * COL_GAP, y: 0 }
        : { x: (zero - 20) * COL_GAP, y: ROW_GAP };
    },
    observedFonts: ["CircularXX TT", "Pretendard", "Inter"],
    observedColors: ["#d5f3f1", "#8afaff", "#6896f3", "#ffcbef", "#00cbd5", "#000000", "#ffffff"],
    observations: [
      "Cover uses a light mint gradient field with soft ellipses, large black title, and a subtle Weverse mark.",
      "Workflow explanation uses black canvas with large outlined circles, generous spacing, and cyan accents.",
      "Dense documentation slides import component/reference material; for web decks these should be simplified, not copied verbatim.",
      "Prompt/example slides rely on dark blocks, screenshots, and compact captions.",
      "End slides return to centered text or Q&A composition.",
    ],
  },
  {
    key: "237R2Xz39e9Dr9KjdJPIlI",
    name: "[ClickTF] Design to Dev. WorkFlow(Test Ver.)",
    url: "https://www.figma.com/slides/237R2Xz39e9Dr9KjdJPIlI",
    source: "Figma Slides Desktop Bridge",
    slideIds: [
      "1:42",
      "1:123",
      "170:3201",
      "23:681",
      "165:3191",
      "146:259",
      "146:432",
      "146:474",
      "146:310",
      "146:545",
      "146:522",
      "146:569",
      "146:1564",
      "5:2",
      "23:560",
      "5:91",
      "10:326",
      "23:698",
      "146:1568",
      "156:2587",
      "160:2644",
      "160:2648",
      "160:2671",
      "160:2662",
      "143:212",
      "146:1694",
      "146:1713",
      "146:1732",
      "151:1900",
      "152:1971",
      "152:2032",
      "156:2439",
      "156:2489",
      "156:2568",
      "156:2606",
      "156:2542",
      "9:190",
      "160:2688",
      "165:3154",
      "164:2703",
      "164:2715",
      "164:2725",
      "164:2748",
      "164:2774",
      "164:2793",
      "165:3161",
      "21:204",
      "165:3098",
      "165:2957",
      "165:3014",
      "165:2976",
      "165:2995",
      "165:2938",
      "165:3033",
      "165:3116",
      "165:2877",
      "165:3053",
      "165:3068",
      "165:3083",
      "165:3122",
      "165:2854",
      "165:2934",
      "165:2844",
      "164:2809",
      "14:809",
    ],
    childCounts: [
      3, 3, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 81, 81, 86, 2, 2, 1, 2,
      2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 4, 3, 1, 4, 3,
      10, 8, 8, 8, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
      2, 2, 1,
    ],
    positionFor(index) {
      const zero = index - 1;
      return { x: (zero % 20) * COL_GAP, y: Math.floor(zero / 20) * ROW_GAP };
    },
    observedFonts: ["Pretendard", "CircularXX TT", "Inter", "WeGothicSans"],
    observedColors: ["#000000", "#ffffff", "#00cbd5", "#ffd917", "#f316b0", "#2abcff", "#5989fe"],
    observations: [
      "The deck is largely black-based with repeated gradient cover instances and slide-to-slide reveal rhythm.",
      "Cover and dividers use very large type; most content slides keep strong top-left title hierarchy.",
      "Component-priority and workflow slides use repeated rounded white blocks, radius around 20, on black.",
      "Bright accent colors are used sparingly for states and emphasis, not as full-page themes.",
      "The long middle section is process-heavy and benefits from compact diagrams rather than dense screenshots.",
    ],
  },
  {
    key: "5ApcqynkNIBm8gFf0pCfft",
    name: "LLM to Harness Workflow",
    url: "https://www.figma.com/slides/5ApcqynkNIBm8gFf0pCfft",
    source: "Figma Slides Desktop Bridge",
    slideIds: [
      "12:55",
      "2:8",
      "37:543",
      "12:111",
      "12:239",
      "12:136",
      "36:33",
      "36:270",
      "36:383",
      "36:490",
      "37:583",
      "37:636",
      "37:684",
      "37:691",
      "37:738",
      "37:767",
      "37:778",
      "37:745",
      "12:448",
      "12:491",
      "12:660",
      "12:1020",
      "12:1207",
      "12:1319",
      "12:1353",
      "12:1440",
      "41:1163",
      "41:819",
      "41:864",
      "41:914",
      "41:923",
      "41:989",
      "41:1044",
      "12:254",
      "41:1178",
      "41:1197",
      "41:1216",
      "41:1225",
    ],
    childCounts: [
      5, 3, 1, 2, 2, 2, 2, 2, 11, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3,
      3, 3, 3, 3, 4, 2, 3, 3, 3, 3, 3, 6, 3, 3, 3, 3, 2,
    ],
    positionFor(index) {
      if (index <= 2) return { x: (index - 1) * COL_GAP, y: 0 };
      if (index <= 30) return { x: (index - 3) * COL_GAP, y: 0 };
      return { x: (index - 31) * COL_GAP, y: ROW_GAP };
    },
    observedFonts: ["Pretendard"],
    observedColors: ["#d5f3f1", "#8afaff", "#6896f3", "#00cbd5", "#000000", "#ffffff"],
    observations: [
      "Cover and later conceptual slides reuse the light mint gradient system from the shared deck language.",
      "Early content uses black slides for AI-tool noise, center messages, and typing/pattern interactions.",
      "Question-to-answer and workflow slides use light background, white blocks, compact labels, and grouped Q/A cards.",
      "Instruction-growth slides shift from repeated cycles to project instruction documents and decomposed rules.",
      "The deck is strongest when motion stages are simple: reveal, dim, regroup, then relabel.",
    ],
  },
];

const sharedRules = {
  canvas: CANVAS,
  finalFontFamily: "Pretendard",
  title: {
    placement: "Top-left by default; centered only for cover, chapter, and center-message slides.",
    commonSizes: [80, 60, 52],
    weight: "700-800",
  },
  subtitle: {
    placement: "Under title, same left edge.",
    commonSizes: [24, 28, 32, 36],
    weight: "400-600",
  },
  backgrounds: [
    "Black canvas for contrast-led chapter and concept slides.",
    "Light mint cover gradient for covers and later conceptual flow slides.",
  ],
  components: [
    "Large workflow circles with thin strokes.",
    "White rounded rectangles/cards for grouped content.",
    "Compact capsules or tags for stage labels.",
    "Q/A placeholder bubbles with small leading badges.",
    "Flow arrows and cycle arrows for process scenes.",
  ],
  motion: [
    "Auto reveal after 0.6s for title or first visual element.",
    "Sequential dissolve/slide for repeated bubbles, icons, or cards.",
    "Click/keyboard should advance the same interaction step before changing slides.",
    "Dimming should be gradual and consistent across related slides.",
  ],
};

function inferLayout(deckKey, index) {
  if (deckKey === "HbHKFxazHHdjq7WUjpztfb") {
    if (index === 1) return "cover";
    if (index >= 2 && index <= 5) return "workflow-circle";
    if (index >= 6 && index <= 7) return "dense-reference";
    if (index >= 8 && index <= 14) return "problem-or-painpoint";
    if (index === 15) return "blank-or-spacer";
    if (index >= 16 && index <= 19) return "transition-or-title";
    if (index >= 20 && index <= 22) return "documentation-source-of-truth";
    if (index === 23) return "workflow-circle-with-notes";
    if (index >= 24 && index <= 26) return "prompt-example";
    if (index === 27) return "availability-or-screenshot";
    return "q-and-a";
  }

  if (deckKey === "237R2Xz39e9Dr9KjdJPIlI") {
    if (index === 1) return "cover";
    if (index === 2) return "toc";
    if ([3, 13, 19, 39, 46].includes(index)) return "section-divider";
    if (index >= 4 && index <= 12) return "problem-story";
    if (index >= 14 && index <= 18) return "component-priority-grid";
    if (index >= 20 && index <= 38) return "process-or-docs";
    if (index >= 40 && index <= 45) return "outputs-or-gallery";
    if (index >= 47 && index <= 60) return "results-or-insights";
    if (index >= 61 && index <= 64) return "conclusion";
    return "q-and-a";
  }

  if (index === 1) return "cover";
  if (index === 2) return "toc";
  if ([3, 11, 27].includes(index)) return "section-divider";
  if (index >= 4 && index <= 10) return "ai-tools-noise-or-intro";
  if (index >= 12 && index <= 18) return "llm-typing-pattern";
  if (index >= 19 && index <= 20) return "question-answer-workflow";
  if (index >= 21 && index <= 26) return "instruction-growth";
  if (index >= 28 && index <= 33) return "harness-workflow-cycle";
  return "conclusion";
}

function makeSlides(deck) {
  return deck.slideIds.map((nodeId, i) => {
    const index = i + 1;
    return {
      index,
      nodeId,
      name: `Slide ${String(index).padStart(2, "0")}`,
      width: CANVAS.width,
      height: CANVAS.height,
      childCount: deck.childCounts[i],
      ...deck.positionFor(index),
      likelyLayout: inferLayout(deck.key, index),
    };
  });
}

function nodeSummary(deck, slide) {
  return {
    schemaVersion: 1,
    extractionKind: "figma-console-mcp compact node summary",
    sourceFile: {
      key: deck.key,
      name: deck.name,
      url: deck.url,
    },
    slide,
    observedPatterns: {
      canvas: CANVAS,
      finalFontRule: "Force Pretendard for web PPT output, even when Figma reports another font.",
      likelyLayout: slide.likelyLayout,
      rootChildCount: slide.childCount,
      expectedTextHierarchy:
        "Extract exact text layers on the next deep pass when this slide becomes a rule candidate.",
      expectedShapeHierarchy:
        "Use this compact node as a routing summary; deep geometry should be captured only for promoted patterns.",
    },
  };
}

function deckSummary(deck, slides) {
  const layoutCounts = countBy(slides.map((slide) => slide.likelyLayout));
  return `# ${deck.name}

- File key: \`${deck.key}\`
- Source: ${deck.source}
- Slides analyzed: ${slides.length}
- Canvas: ${CANVAS.width} x ${CANVAS.height}
- Final web PPT font rule: **Pretendard only**

## Observed Deck Character
${deck.observations.map((item) => `- ${item}`).join("\n")}

## Layout Mix
${Object.entries(layoutCounts)
  .map(([name, count]) => `- ${name}: ${count}`)
  .join("\n")}

## Color Notes
${deck.observedColors.map((color) => `- \`${color}\``).join("\n")}

## Font Notes
Extracted/observed font names are stored for reference only. Final generated web PPT decks must use \`Pretendard\`.
${deck.observedFonts.map((font) => `- ${font}`).join("\n")}
`;
}

function countBy(items) {
  return items.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});
}

async function writeJson(filePath, value) {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function filesYaml(decks) {
  return `files:
${decks
  .map(
    (deck) => `  - key: ${deck.key}
    name: "${deck.name.replaceAll('"', '\\"')}"
    url: ${deck.url}
    source: ${deck.source}
    status: initial_compact_extraction_complete
    slide_count: ${deck.slideIds.length}
    final_font_rule: Pretendard
`
  )
  .join("")}`;
}

function readme() {
  return `# Figma Slide Research

This folder collects compact research data from three Figma Slides decks so the shared web PPT rules can be promoted into \`style-kit/DECK.md\`.

## Scope

- Analyze all slides, not only representative samples.
- Keep raw per-slide summaries under \`raw/<fileKey>/nodes/\`.
- Promote only repeated patterns into merged common rules.
- Force \`Pretendard\` for all generated web PPT output, regardless of source Figma font metadata.

## Extraction Status

This is the first compact pass from the Figma Desktop Bridge. It captures slide inventory, canvas position, child count, and inferred pattern buckets. Deep text/geometry extraction should be run on promoted candidates when exact coordinates are needed.
`;
}

function mergedLayoutPatterns(allSlides) {
  return {
    schemaVersion: 1,
    canvas: CANVAS,
    commonLayouts: [
      {
        name: "cover",
        rule: "Light mint gradient or black hero field, large title, restrained subtitle, optional subtle logo.",
      },
      {
        name: "toc",
        rule: "Left title/sub copy with right or lower content index; avoid page count clutter.",
      },
      {
        name: "section-divider",
        rule: "Centered or left-centered single message with strong hierarchy and minimal supporting elements.",
      },
      {
        name: "content-top-left",
        rule: "Top-left title and subtitle, visual canvas below; this is the default content layout.",
      },
      {
        name: "workflow-flow",
        rule: "Use repeated stages, arrows, cycle diagrams, or grouped Q/A cards for process explanations.",
      },
      {
        name: "center-message",
        rule: "Large centered one-line message; reveal title then subtitle, optionally dim background visual.",
      },
    ],
    layoutCountsByDeck: decks.map((deck) => {
      const slides = allSlides[deck.key];
      return {
        key: deck.key,
        name: deck.name,
        counts: countBy(slides.map((slide) => slide.likelyLayout)),
      };
    }),
  };
}

function mergedTypographyPatterns() {
  return {
    schemaVersion: 1,
    finalFontFamily: "Pretendard",
    rule: "Pretendard is mandatory for generated web PPT decks. Figma font names are reference metadata only.",
    scale: [
      { role: "cover-title", sizePx: 80, weight: 800 },
      { role: "chapter-title", sizePx: 60, weight: 800 },
      { role: "content-title", sizePx: 52, weight: 800 },
      { role: "subtitle-large", sizePx: 36, weight: 500 },
      { role: "subtitle", sizePx: 28, weight: 500 },
      { role: "body", sizePx: 24, weight: 500 },
      { role: "caption-or-label", sizePx: 16, weight: 700 },
    ],
    placement: {
      titleDefault: "Top-left, aligned to a stable slide margin.",
      subtitleDefault: "Under title, same x coordinate, muted color.",
      centerMessage: "Centered as one visual thought, no forced line break unless needed.",
    },
  };
}

function mergedColorPatterns() {
  return {
    schemaVersion: 1,
    core: {
      black: "#000000",
      white: "#ffffff",
      coverMint: "#d5f3f1",
      accentCyan: "#00cbd5",
      softMint: "#8afaff",
      softBlue: "#6896f3",
      softPink: "#ffcbef",
    },
    usage: [
      "Use black as the main high-contrast canvas for concept and chapter slides.",
      "Use the light mint cover background for covers and later explanatory diagrams.",
      "Use cyan accents sparingly for labels, line emphasis, and active states.",
      "Avoid one-note palettes; pair black/white structure with one accent and soft background fields.",
    ],
  };
}

function mergedComponentPatterns() {
  return {
    schemaVersion: 1,
    components: [
      {
        name: "stage-label",
        shape: "white rounded rectangle or black capsule depending on background",
        radiusPx: "8-20",
        usage: "Section labels such as QUESTION, LLM, ANSWER or workflow phases.",
      },
      {
        name: "qa-bubble",
        shape: "small white rounded bubble with leading Q/A badge and placeholder text lines",
        radiusPx: "12-18",
        usage: "Question-answer piles, later regrouped into workflow categories.",
      },
      {
        name: "workflow-circle",
        shape: "large circle with thin stroke, sometimes overlapping or connected with vertical note lines",
        radiusPx: "150-200",
        usage: "Plan/design/research/test/review/guide and similar flows.",
      },
      {
        name: "instruction-document",
        shape: "document card with accumulating short rules",
        radiusPx: "16-24",
        usage: "Project instructions, Claude.md/AGENT.md/Gemini.md concepts.",
      },
      {
        name: "media-noise-bubble",
        shape: "dark chat bubble without tail unless tail quality is deliberate",
        radiusPx: "16",
        usage: "Information overload scenes.",
      },
    ],
  };
}

function motionPatterns() {
  return `# Motion Patterns

- Use a 0.6s entrance delay for first content after slide navigation.
- Repeated visual elements should stagger in quickly enough to read as a burst, not one-by-one unless narration requires it.
- Click and keyboard advance must share the same interaction state machine.
- Common sequence: reveal base elements -> reveal detail items -> dim/regroup -> relabel into workflow.
- Avoid decorative motion that changes the message; motion should clarify grouping, sequence, or transformation.
`;
}

function commonRulesDraft() {
  return `# Common Deck Rules Draft

## Non-Negotiables

- Canvas: 1920 x 1080.
- Font: Pretendard for every generated web PPT deck.
- Prefer top-left title/subtitle for content slides.
- Keep page numbers, progress bars, and excess navigation UI out of exported slides.

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

Only patterns repeated across at least two decks should move into \`style-kit/DECK.md\`. Topic-specific scenes stay in each deck folder's future local kit.
`;
}

async function main() {
  await mkdir(researchDir, { recursive: true });
  await rm(path.join(researchDir, "raw"), { recursive: true, force: true });
  await rm(path.join(researchDir, "merged"), { recursive: true, force: true });
  await mkdir(path.join(researchDir, "raw"), { recursive: true });
  await mkdir(path.join(researchDir, "merged"), { recursive: true });

  await writeFile(path.join(researchDir, "README.md"), readme());
  await writeFile(path.join(researchDir, "files.yaml"), filesYaml(decks));

  const allSlides = {};

  for (const deck of decks) {
    const deckDir = path.join(researchDir, "raw", deck.key);
    const nodesDir = path.join(deckDir, "nodes");
    await mkdir(nodesDir, { recursive: true });

    const slides = makeSlides(deck);
    allSlides[deck.key] = slides;
    await writeJson(path.join(deckDir, "slides.json"), {
      schemaVersion: 1,
      file: {
        key: deck.key,
        name: deck.name,
        url: deck.url,
        source: deck.source,
      },
      canvas: CANVAS,
      slides,
    });

    for (const slide of slides) {
      const filename = `slide-${String(slide.index).padStart(3, "0")}.json`;
      await writeJson(path.join(nodesDir, filename), nodeSummary(deck, slide));
    }

    await writeFile(path.join(deckDir, "summary.md"), deckSummary(deck, slides));
  }

  await writeJson(path.join(researchDir, "merged", "layout-patterns.json"), mergedLayoutPatterns(allSlides));
  await writeJson(path.join(researchDir, "merged", "typography-patterns.json"), mergedTypographyPatterns());
  await writeJson(path.join(researchDir, "merged", "color-patterns.json"), mergedColorPatterns());
  await writeJson(path.join(researchDir, "merged", "component-patterns.json"), mergedComponentPatterns());
  await writeFile(path.join(researchDir, "merged", "motion-patterns.md"), motionPatterns());
  await writeFile(path.join(researchDir, "merged", "common-rules-draft.md"), commonRulesDraft());

  const totalSlides = decks.reduce((sum, deck) => sum + deck.slideIds.length, 0);
  console.log(`Generated research for ${decks.length} decks / ${totalSlides} slides`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
