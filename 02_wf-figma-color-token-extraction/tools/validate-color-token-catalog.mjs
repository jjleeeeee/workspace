#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const DEFAULT_INPUT_DIR = "02_wf-figma-color-token-extraction/outputs/current";
const TOKEN_FILES = [
  "tokens.color.v1.0.json",
];

const TOKEN_ID_PATTERN = /^token:[a-z0-9][a-z0-9_-]*(\.[a-z0-9_-]+)*$/;
const MODE_PATTERN = /^[a-z][a-z0-9-]*$/;
const HEX_PATTERN = /^#[0-9A-F]{6}([0-9A-F]{2})?$/;
const TYPES = new Set(["color", "dimension", "number", "string"]);
const USAGES = new Set([
  "shape-fill",
  "text-fill",
  "stroke",
  "effect",
  "corner-radius",
  "width-height",
  "gap",
  "opacity",
  "font-family",
  "font-size",
  "font-weight",
  "font-style",
  "letter-spacing",
  "line-height",
  "paragraph-spacing",
  "paragraph-indent",
  "text-content",
  "all",
]);
const DIAGNOSTIC_CODES = new Set([
  "documentation:missing",
  "duplicate-alias",
  "naming:inconsistent",
  "platform-code:missing-web",
  "platform-code:missing-ios",
  "platform-code:missing-android",
  "hidden-from-publishing",
  "type:ambiguous-float",
  "alias:dangling",
]);

function validateCatalog(catalog, filename) {
  const errors = [];
  requireObject(catalog, "$", errors);
  if (catalog.$schema !== "https://our-ds-mcp/schemas/tokens.v1.json") {
    errors.push("$schema must be https://our-ds-mcp/schemas/tokens.v1.json");
  }
  if (!catalog.source || typeof catalog.source !== "object") {
    errors.push("source must be an object");
  } else {
    for (const key of ["origin", "fileKey", "collection", "freshness", "stageLabel"]) {
      if (typeof catalog.source[key] !== "string" || catalog.source[key].length === 0) {
        errors.push(`source.${key} must be a non-empty string`);
      }
    }
    if (catalog.source.version !== null && typeof catalog.source.version !== "string") {
      errors.push("source.version must be string or null");
    }
    if (!catalog.source.coverage || typeof catalog.source.coverage !== "object") {
      errors.push("source.coverage must be an object");
    }
  }
  if (!Array.isArray(catalog.modes) || catalog.modes.length === 0) {
    errors.push("modes must be a non-empty array");
  }
  const modes = new Set(catalog.modes ?? []);
  for (const mode of modes) {
    if (!MODE_PATTERN.test(mode)) {
      errors.push(`invalid mode: ${mode}`);
    }
  }
  if (!Array.isArray(catalog.tokens)) {
    errors.push("tokens must be an array");
  }
  for (const [index, token] of (catalog.tokens ?? []).entries()) {
    const where = `tokens[${index}]`;
    if (!TOKEN_ID_PATTERN.test(token.id ?? "")) {
      errors.push(`${where}.id invalid: ${token.id}`);
    }
    if (typeof token.name !== "string" || token.name.length === 0) {
      errors.push(`${where}.name must be non-empty string`);
    }
    if (!TYPES.has(token.type)) {
      errors.push(`${where}.type invalid: ${token.type}`);
    }
    if (token.type !== "color") {
      errors.push(`${where}.type must be color in this workflow`);
    }
    if (!token.values || typeof token.values !== "object") {
      errors.push(`${where}.values must be object`);
    } else {
      for (const [mode, value] of Object.entries(token.values)) {
        if (!modes.has(mode)) {
          errors.push(`${where}.values.${mode} is not declared in catalog.modes`);
        }
        if (!value || typeof value !== "object" || !Object.hasOwn(value, "raw")) {
          errors.push(`${where}.values.${mode}.raw is required`);
        }
        if (!("aliasOf" in value) || (value.aliasOf !== null && typeof value.aliasOf !== "string")) {
          errors.push(`${where}.values.${mode}.aliasOf must be string or null`);
        }
        if (token.type === "color" && !HEX_PATTERN.test(value.raw)) {
          errors.push(`${where}.values.${mode}.raw must be uppercase hex color`);
        }
      }
    }
    for (const usage of token.usage ?? []) {
      if (!USAGES.has(usage)) {
        errors.push(`${where}.usage invalid: ${usage}`);
      }
    }
    for (const diagnostic of token.diagnostics ?? []) {
      if (!DIAGNOSTIC_CODES.has(diagnostic)) {
        errors.push(`${where}.diagnostics invalid: ${diagnostic}`);
      }
    }
    if (!token.figmaKey || typeof token.figmaKey !== "string") {
      errors.push(`${where}.figmaKey must be non-empty string`);
    }
  }
  for (const diagnostic of catalog.diagnostics ?? []) {
    if (!diagnostic || typeof diagnostic !== "object") {
      errors.push("catalog diagnostic must be object");
      continue;
    }
    if (!DIAGNOSTIC_CODES.has(diagnostic.code)) {
      errors.push(`catalog diagnostic code invalid: ${diagnostic.code}`);
    }
    if (typeof diagnostic.message !== "string" || diagnostic.message.length === 0) {
      errors.push(`catalog diagnostic ${diagnostic.code} needs a message`);
    }
  }

  const summary = {
    file: filename,
    tokens: catalog.tokens?.length ?? 0,
    modes: catalog.modes ?? [],
    errorCount: errors.length,
    colorBaseCount: (catalog.tokens ?? []).filter((token) => token.type === "color" && token.name.startsWith("base/color/")).length,
    colorNonHexCount: (catalog.tokens ?? []).filter((token) => token.type === "color")
      .flatMap((token) => Object.values(token.values ?? {}))
      .filter((value) => !HEX_PATTERN.test(value.raw)).length,
    aliasOfNonNullCount: (catalog.tokens ?? [])
      .flatMap((token) => Object.values(token.values ?? {}))
      .filter((value) => value.aliasOf !== null).length,
    allFillsUsageCount: (catalog.tokens ?? []).filter((token) => (token.usage ?? []).includes("all-fills")).length,
  };

  return { summary, errors };
}

function requireObject(value, label, errors) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    errors.push(`${label} must be an object`);
  }
}

function parseArgs(argv) {
  const args = { inputDir: DEFAULT_INPUT_DIR, files: TOKEN_FILES };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--input-dir") {
      args.inputDir = argv[++index];
    } else if (arg === "--file") {
      args.files = [argv[++index]];
    } else if (arg === "--help") {
      console.log("Usage: node tools/validate-color-token-catalog.mjs [--input-dir <dir>] [--file <path>]");
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  let totalErrors = 0;
  for (const file of args.files) {
    const filename = file.includes("/") ? file : path.join(args.inputDir, file);
    const catalog = JSON.parse(fs.readFileSync(filename, "utf8"));
    const { summary, errors } = validateCatalog(catalog, filename);
    totalErrors += errors.length;
    console.log(JSON.stringify(summary));
    for (const error of errors) {
      console.log(`  - ${error}`);
    }
  }
  if (totalErrors > 0) {
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
