import { copyFile, mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const sourceDir = path.resolve(rootDir, "../design-cds-docs/01_chord-ds/icons/24px");
const targetDir = path.resolve(rootDir, "src/assets/icons");
const manifestPath = path.resolve(rootDir, "src/assets/chord-icon-medium-files.json");

const themedMediumPattern = /(?:_medium_(?:light|dark)|_medium__dark)$/;

function shouldExclude(baseName) {
  return baseName.endsWith("_special_light") || baseName.endsWith("_special_dark");
}

function toMediumFileName(fileName) {
  const baseName = fileName.replace(/\.svg$/, "");

  if (shouldExclude(baseName)) {
    return null;
  }

  if (themedMediumPattern.test(baseName)) {
    return `${baseName}.svg`;
  }

  return `${baseName}_medium.svg`;
}

const sourceFiles = (await readdir(sourceDir)).filter((fileName) => fileName.endsWith(".svg")).sort();
const existingTargetFiles = new Set(await readdir(targetDir).catch(() => []));
const files = [];

await mkdir(targetDir, { recursive: true });

for (const sourceFileName of sourceFiles) {
  const targetFileName = toMediumFileName(sourceFileName);

  if (!targetFileName) {
    continue;
  }

  const sourcePath = path.join(sourceDir, sourceFileName);
  const targetPath = path.join(targetDir, targetFileName);
  const existed = existingTargetFiles.has(targetFileName);

  if (!existed) {
    await copyFile(sourcePath, targetPath);
  }

  files.push({
    copied: !existed,
    sourceFileName,
    targetFileName,
  });
}

const duplicateTargetFiles = files
  .map((file) => file.targetFileName)
  .filter((fileName, index, all) => all.indexOf(fileName) !== index);

if (duplicateTargetFiles.length > 0) {
  throw new Error(`Duplicate medium icon target files: ${[...new Set(duplicateTargetFiles)].join(", ")}`);
}

const manifest = {
  source: "../design-cds-docs/01_chord-ds/icons/24px",
  target: "src/assets/icons",
  rule: "Only SVG assets whose target filename contains _medium are synced. Existing target files are preserved.",
  excludedSourceFiles: sourceFiles.filter((fileName) => toMediumFileName(fileName) === null),
  count: files.length,
  copiedCount: files.filter((file) => file.copied).length,
  files,
};

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

console.log(`Synced ${manifest.copiedCount}/${manifest.count} medium icon SVG files.`);
