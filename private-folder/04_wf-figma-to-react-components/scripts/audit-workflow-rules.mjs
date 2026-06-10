import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();

const ignoredDirs = new Set(["node_modules", "storybook-static", "dist", ".git"]);
const issues = [];
const completionCommands = [
  "npm test",
  "npm run typecheck",
  "npm run build-storybook",
  "npm run visual:baseline",
  "npm run visual:diff",
  "npm run rules:audit",
  "npm run knowledge:audit",
];
const completionCommandDocs = new Set([
  "README.md",
  "PLAYBOOK.md",
  "docs/AI_RULES.md",
  "workflow/README.md",
  "workflow/validation-checklist.md",
]);
const requiredSourceNoteHeadings = [
  "Alpha Token Notes",
  "Font Mapping Notes",
  "Text Behavior Notes",
  "Sizing Interpretation Notes",
  "Nested Atom Mapping",
  "Nested Module Inventory",
  "Token vs Rendered Pixel Notes",
  "Known Gaps",
];

function walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (ignoredDirs.has(entry.name)) continue;
      files.push(...walk(join(dir, entry.name)));
      continue;
    }

    if (entry.isFile()) {
      files.push(join(dir, entry.name));
    }
  }

  return files;
}

function read(file) {
  return readFileSync(file, "utf8");
}

function rel(file) {
  return relative(root, file);
}

function lineOf(text, index) {
  return text.slice(0, index).split("\n").length;
}

function addIssue(file, line, rule, message, hint) {
  issues.push({ file: rel(file), line, rule, message, hint });
}

function componentNameFromCss(file) {
  const parts = rel(file).split("/");
  const componentIndex = parts.indexOf("components");
  return componentIndex >= 0 ? parts[componentIndex + 1] : null;
}

function kebabCase(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .toLowerCase();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function sourceNoteForComponent(componentName) {
  return componentName ? join(root, "src", "figma", `${kebabCase(componentName)}.source.md`) : null;
}

function sourceNoteTextForComponent(componentName) {
  const sourceNote = sourceNoteForComponent(componentName);
  return sourceNote && existsSync(sourceNote) ? read(sourceNote) : "";
}

function hasCoverageThatPreventsParity(sourceText) {
  return (
    /status\s*:\s*partial\//i.test(sourceText) ||
    /Nested coverage\s*:\s*`?[^`\n]*(?:partial|deferred)/i.test(sourceText) ||
    /Current coverage\s*:\s*`?partial/i.test(sourceText) ||
    /partial\/default-only/i.test(sourceText)
  );
}

function sourceNoteAllowsParityForEntry(sourceText, entry) {
  const entryIdPattern = new RegExp(
    `Visual registry id\\s*:\\s*\`?${escapeRegExp(entry.id)}\`?`,
    "i",
  );
  const explicitGatePattern =
    /Visual registry scope\s*:\s*`comparisonScope="full-parity"`,\s*`isParityGate=true`\./i;

  return entryIdPattern.test(sourceText) && explicitGatePattern.test(sourceText);
}

function auditInlineSvgSample(file, text) {
  let index = text.indexOf("data:image/svg+xml");
  while (index !== -1) {
    addIssue(
      file,
      lineOf(text, index),
      "inline-svg-sample",
      "Inline data:image/svg+xml sample found.",
      "Export a Figma/local fixture or render the component state directly.",
    );
    index = text.indexOf("data:image/svg+xml", index + 1);
  }
}

function auditDirectIconSvgImport(file, text) {
  const pattern = /import\s+.+?\s+from\s+["'][^"']*assets\/icons\/[^"']+\.svg["']/g;
  for (const match of text.matchAll(pattern)) {
    addIssue(
      file,
      lineOf(text, match.index ?? 0),
      "direct-icon-svg-import",
      "Component imports an icon SVG directly from src/assets/icons.",
      "Use ChordIcon name=\"...\" and registry metadata instead.",
    );
  }
}

function auditForbiddenStoryComposition(file, text) {
  const pattern = /\bListItemUsage\b/g;
  for (const match of text.matchAll(pattern)) {
    addIssue(
      file,
      lineOf(text, match.index ?? 0),
      "forbidden-parent-composition-story",
      "Atom story contains a parent composition example name.",
      "Keep atom stories focused on the atom unless the atom contract explicitly includes that composition.",
    );
  }
}

function auditPretendardPriority(file, text) {
  const declarationPattern = /font-family\s*:\s*([^;]+);/g;
  for (const match of text.matchAll(declarationPattern)) {
    const declaration = match[1];
    if (!declaration.includes("Pretendard")) continue;

    const firstPretendard = declaration.indexOf("Pretendard");
    const firstToken = declaration.indexOf("var(");
    const firstWeGothic = declaration.indexOf("WeGothicSans");
    const pretendardIsPriority =
      firstPretendard >= 0 &&
      (firstToken === -1 || firstPretendard < firstToken) &&
      (firstWeGothic === -1 || firstPretendard < firstWeGothic);

    if (!pretendardIsPriority) continue;

    const sourceNote = sourceNoteForComponent(componentNameFromCss(file));
    const sourceText = sourceNote && existsSync(sourceNote) ? read(sourceNote) : "";
    const hasFontDecision = /fontFamily|Font Mapping|Typography font|CSS font-family order|Pretendard/.test(sourceText);

    if (!hasFontDecision) {
      addIssue(
        file,
        lineOf(text, match.index ?? 0),
        "pretendard-priority-without-source-note",
        "Pretendard appears as a priority font without a source note font decision.",
        "Record the Figma font classification and CSS order in src/figma/<component>.source.md.",
      );
    }
  }
}

function auditAlphaTokenDoubleOpacity(file, text) {
  const rulePattern = /([^{}]+)\{([^{}]+)\}/g;
  for (const match of text.matchAll(rulePattern)) {
    const body = match[2];
    const hasAlphaToken = /--cds-[\w-]+-(?:100a|200a|300a)\b/.test(body);
    const hasOpacity = /(^|\n)\s*opacity\s*:/.test(body);

    if (hasAlphaToken && hasOpacity) {
      addIssue(
        file,
        lineOf(text, match.index ?? 0),
        "alpha-token-double-opacity",
        "CSS rule combines an alpha token with a separate opacity declaration.",
        "Use the alpha token alone unless the source note records separate layer opacity.",
      );
    }
  }
}

function auditFigmaCompareGateLanguage(file, text) {
  const lines = text.split("\n");
  lines.forEach((line, index) => {
    if (!line.includes("FigmaCompare")) return;
    if (!/(pass\/fail|완료 판정|통과|gate)/i.test(line)) return;
    if (/(not|아니라|수동|manual)/i.test(line)) return;

    addIssue(
      file,
      index + 1,
      "figma-compare-as-gate",
      "FigmaCompare is described like a pass/fail gate.",
      "Describe FigmaCompare as manual review support; use visual diff for pass/fail.",
    );
  });
}

function auditCompletionCommandList(file, text) {
  if (!completionCommandDocs.has(rel(file))) return;

  for (const command of completionCommands) {
    if (text.includes(command)) continue;

    addIssue(
      file,
      1,
      "completion-command-drift",
      `${rel(file)} is missing completion command: ${command}`,
      "Keep README, PLAYBOOK, docs/AI_RULES, workflow/README, and validation-checklist aligned.",
    );
  }
}

function auditSourceNoteRequiredHeadings(file, text) {
  for (const heading of requiredSourceNoteHeadings) {
    const pattern = new RegExp(`^##\\s+${escapeRegExp(heading)}\\b`, "m");
    if (pattern.test(text)) continue;

    addIssue(
      file,
      1,
      "source-note-missing-required-heading",
      `Source note is missing required section: ${heading}`,
      "Backfill the section with evidence, Known Gaps, or an explicit N/A note.",
    );
  }
}

function auditFigmaCompareReference(file, text) {
  if (!/\bexport\s+const\s+FigmaCompare\b/.test(text)) return;

  const hasBaselineImport = /new\s+URL\s*\(\s*["'][^"']*figma\/baselines\/[^"']+\.(?:png|jpg|jpeg|webp)["']/.test(text);
  const hasBaselineImage = /<img\b[\s\S]*?src=\{[^}]*baseline[^}]*\}/i.test(text);

  if (hasBaselineImport && hasBaselineImage) return;

  const index = text.search(/\bexport\s+const\s+FigmaCompare\b/);
  addIssue(
    file,
    lineOf(text, index >= 0 ? index : 0),
    "figma-compare-missing-reference",
    "FigmaCompare story does not wire a local Figma reference image.",
    "Save the Figma screenshot under src/figma/baselines and render it next to the current implementation.",
  );
}

function auditFallbackAsSrcSample(file, text) {
  const pattern = /src\s*:\s*[^,\n]*(?:placeholder|fallback|no[-_]?image|empty)/gi;
  for (const match of text.matchAll(pattern)) {
    addIssue(
      file,
      lineOf(text, match.index ?? 0),
      "component-fallback-as-src-sample",
      "Fallback-looking asset is wired as a consumer src sample.",
      "Render no-image/empty/loading fallback through component state instead of Storybook src.",
    );
  }
}

function auditCoverageAlignedVisualGate() {
  const file = join(root, "src", "figma", "visual-registry.json");
  if (!existsSync(file)) return;

  const entries = JSON.parse(read(file));
  for (const entry of entries) {
    const component = entry.component;
    const sourceText = sourceNoteTextForComponent(component);
    const entryLabel = `${component}/${entry.id}`;
    const index = read(file).indexOf(`"id": "${entry.id}"`);
    const line = lineOf(read(file), index >= 0 ? index : 0);

    if (!["full-parity", "structure-only", "shell-only"].includes(entry.comparisonScope)) {
      addIssue(
        file,
        line,
        "visual-registry-missing-comparison-scope",
        `${entryLabel} does not declare a valid comparisonScope.`,
        "Set comparisonScope to full-parity, structure-only, or shell-only.",
      );
    }

    if (typeof entry.isParityGate !== "boolean") {
      addIssue(
        file,
        line,
        "visual-registry-missing-parity-gate",
        `${entryLabel} does not declare isParityGate.`,
        "Set isParityGate=true only for full-parity entries; use false for partial/deferred scopes.",
      );
    }

    if (entry.isParityGate === true && entry.comparisonScope !== "full-parity") {
      addIssue(
        file,
        line,
        "visual-registry-gating-non-full-scope",
        `${entryLabel} is a parity gate but comparisonScope is not full-parity.`,
        "Only full-parity visual registry entries can be pass/fail parity gates.",
      );
    }

    if (entry.isParityGate === false && entry.comparisonScope === "full-parity") {
      addIssue(
        file,
        line,
        "visual-registry-non-gating-full-scope",
        `${entryLabel} is non-gating but declares full-parity scope.`,
        "Use structure-only or shell-only, or make the entry a real parity gate.",
      );
    }

    if (
      sourceText &&
      hasCoverageThatPreventsParity(sourceText) &&
      !sourceNoteAllowsParityForEntry(sourceText, entry) &&
      (entry.isParityGate !== false || entry.comparisonScope === "full-parity")
    ) {
      addIssue(
        file,
        line,
        "partial-coverage-registered-as-parity",
        `${entryLabel} has partial/deferred source coverage but is registered as a parity gate.`,
        "Mark the entry as isParityGate=false with structure-only/shell-only, or implement the missing nested coverage first.",
      );
    }
  }
}

const allFiles = walk(root);
const componentFiles = allFiles.filter((file) => /^src\/components\//.test(rel(file)) && !/\.test\.[tj]sx?$/.test(file));
const componentSourceFiles = componentFiles.filter((file) => /\.(tsx?|css)$/.test(file));
const storyFiles = componentFiles.filter((file) => /\.stories\.tsx$/.test(file));
const cssFiles = componentFiles.filter((file) => /\.css$/.test(file));
const sourceNoteFiles = allFiles.filter((file) => /^src\/figma\/[^/]+\.source\.md$/.test(rel(file)));
const docsFiles = allFiles.filter((file) => {
  const path = rel(file);
  return /^(AGENTS|PLAYBOOK|README)\.md$/.test(path) || /^docs\/AI_RULES\.md$/.test(path) || /^(rules|workflow)\//.test(path);
});

for (const file of componentSourceFiles) {
  const text = read(file);
  auditInlineSvgSample(file, text);
  auditDirectIconSvgImport(file, text);
}

for (const file of storyFiles) {
  const text = read(file);
  auditForbiddenStoryComposition(file, text);
  auditFigmaCompareReference(file, text);
  auditFallbackAsSrcSample(file, text);
}

for (const file of cssFiles) {
  const text = read(file);
  auditPretendardPriority(file, text);
  auditAlphaTokenDoubleOpacity(file, text);
}

for (const file of sourceNoteFiles) {
  auditSourceNoteRequiredHeadings(file, read(file));
}

for (const file of docsFiles) {
  const text = read(file);
  auditFigmaCompareGateLanguage(file, text);
  auditCompletionCommandList(file, text);
}

auditCoverageAlignedVisualGate();

if (issues.length > 0) {
  console.error(`Workflow rules audit failed with ${issues.length} issue(s):\n`);
  for (const issue of issues) {
    console.error(`${issue.file}:${issue.line} [${issue.rule}] ${issue.message}`);
    console.error(`  Hint: ${issue.hint}`);
  }
  process.exit(1);
}

const scanned = new Set([...componentSourceFiles, ...storyFiles, ...cssFiles, ...docsFiles]).size;
console.log(`Workflow rules audit passed. Scanned ${scanned} file(s).`);
