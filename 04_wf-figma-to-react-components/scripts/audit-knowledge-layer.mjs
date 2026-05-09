import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, normalize, relative, resolve } from "node:path";

const root = process.cwd();
const issues = [];

function rel(file) {
  return relative(root, file);
}

function read(file) {
  return readFileSync(file, "utf8");
}

function addIssue(file, rule, message, hint) {
  issues.push({ file: rel(file), rule, message, hint });
}

function walk(dir) {
  if (!existsSync(dir)) return [];

  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const file = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(file));
      continue;
    }
    if (entry.isFile()) files.push(file);
  }
  return files;
}

function markdownLinks(text) {
  const links = [];
  const pattern = /\[[^\]]+\]\(([^)]+)\)/g;
  for (const match of text.matchAll(pattern)) {
    const href = match[1].split("#")[0];
    if (!href || /^https?:\/\//.test(href)) continue;
    links.push(href);
  }
  return links;
}

function resolveMarkdownLink(fromFile, href) {
  return normalize(resolve(dirname(fromFile), href));
}

const knowledgeRoot = join(root, "knowledge");
const knowledgeReadme = join(knowledgeRoot, "README.md");
const retrospectiveRoot = join(root, "retrospectives");

if (!existsSync(knowledgeReadme)) {
  addIssue(knowledgeReadme, "missing-knowledge-readme", "knowledge/README.md is missing.", "Create the knowledge layer index.");
}

const knowledgeFiles = walk(knowledgeRoot).filter((file) => file.endsWith(".md") && file !== knowledgeReadme);
const knowledgeReadmeText = existsSync(knowledgeReadme) ? read(knowledgeReadme) : "";
const readmeLinkedFiles = new Set(
  markdownLinks(knowledgeReadmeText)
    .map((href) => resolveMarkdownLink(knowledgeReadme, href))
    .filter((file) => file.startsWith(knowledgeRoot) && file.endsWith(".md")),
);

for (const file of knowledgeFiles) {
  const stats = statSync(file);
  if (stats.size === 0) {
    addIssue(file, "empty-knowledge-card", "Knowledge card is empty.", "Add Trigger, Lesson, Apply, and Source Cases sections.");
  }

  if (!readmeLinkedFiles.has(file)) {
    addIssue(
      file,
      "knowledge-card-not-indexed",
      "Knowledge card is not linked from knowledge/README.md.",
      "Add the card to the README trigger index.",
    );
  }
}

const retrospectiveFiles = walk(retrospectiveRoot).filter((file) => file.endsWith(".md"));
for (const file of retrospectiveFiles) {
  const text = read(file);
  if (!/^## Lessons Promoted/m.test(text)) {
    addIssue(
      file,
      "retrospective-missing-lessons-promoted",
      "Retrospective is missing a Lessons Promoted section.",
      "Add ## Lessons Promoted with linked knowledge cards or None.",
    );
  }

  for (const href of markdownLinks(text)) {
    if (!href.includes("knowledge/")) continue;
    const linked = resolveMarkdownLink(file, href);
    if (!existsSync(linked)) {
      addIssue(
        file,
        "broken-knowledge-link",
        `Linked knowledge file does not exist: ${href}`,
        "Create the card or fix the retrospective link.",
      );
    }
  }
}

if (issues.length > 0) {
  console.error(`Knowledge layer audit failed with ${issues.length} issue(s):\n`);
  for (const issue of issues) {
    console.error(`${issue.file} [${issue.rule}] ${issue.message}`);
    console.error(`  Hint: ${issue.hint}`);
  }
  process.exit(1);
}

console.log(
  `Knowledge layer audit passed. Indexed ${knowledgeFiles.length} card(s), checked ${retrospectiveFiles.length} retrospective(s).`,
);
