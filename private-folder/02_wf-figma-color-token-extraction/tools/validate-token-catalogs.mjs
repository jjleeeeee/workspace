#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const WORKSPACE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DEFAULT_INPUT_DIR = path.join(WORKSPACE_ROOT, "chord-design-system/tokens");
const CORE_FILES = ["color.json", "size.json", "typography.json"];
const SEMANTIC_FILE = "typography.semantic.json";
const TOKEN_ID_PATTERN = /^token:[a-z0-9][a-z0-9_-]*(\.[a-z0-9_-]+)*$/;
const MODE_PATTERN = /^[a-z][a-z0-9-]*$/;
const HEX_PATTERN = /^#[0-9A-F]{6}([0-9A-F]{2})?$/;
const TYPES = new Set(["color", "dimension", "number", "string"]);

function parseArgs(argv) {
  const args = { inputDir: DEFAULT_INPUT_DIR };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = () => argv[++index];
    if (arg === "--input-dir") args.inputDir = next();
    else if (arg === "--help") {
      console.log(`Usage: node tools/validate-token-catalogs.mjs [--input-dir ${DEFAULT_INPUT_DIR}]`);
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function validateCoreCatalog(catalog, fileName) {
  const errors = [];
  if (catalog.$schema !== "https://our-ds-mcp/schemas/tokens.v1.json") {
    errors.push(`${fileName}: invalid $schema`);
  }
  if (!catalog.source || typeof catalog.source !== "object") {
    errors.push(`${fileName}: source must be object`);
  }
  if (!Array.isArray(catalog.modes) || catalog.modes.length === 0) {
    errors.push(`${fileName}: modes must be non-empty array`);
  }
  for (const mode of catalog.modes ?? []) {
    if (!MODE_PATTERN.test(mode)) {
      errors.push(`${fileName}: invalid mode ${mode}`);
    }
  }
  if (!Array.isArray(catalog.tokens)) {
    errors.push(`${fileName}: tokens must be array`);
  }
  const modes = new Set(catalog.modes ?? []);
  for (const [index, token] of (catalog.tokens ?? []).entries()) {
    const where = `${fileName}: tokens[${index}]`;
    if (!TOKEN_ID_PATTERN.test(token.id ?? "")) errors.push(`${where}.id invalid`);
    if (typeof token.name !== "string" || token.name.length === 0) errors.push(`${where}.name invalid`);
    if (!TYPES.has(token.type)) errors.push(`${where}.type invalid`);
    for (const [mode, value] of Object.entries(token.values ?? {})) {
      if (!modes.has(mode)) errors.push(`${where}.values.${mode} not declared`);
      if (!value || typeof value !== "object" || !Object.hasOwn(value, "raw")) {
        errors.push(`${where}.values.${mode}.raw missing`);
      }
      if (!("aliasOf" in value) || (value.aliasOf !== null && typeof value.aliasOf !== "string")) {
        errors.push(`${where}.values.${mode}.aliasOf invalid`);
      }
      if (token.type === "color" && !HEX_PATTERN.test(value.raw)) {
        errors.push(`${where}.values.${mode}.raw must be uppercase hex`);
      }
    }
  }
  return errors;
}

function validateSemanticTypography(semanticCatalog, typographyCatalog) {
  const errors = [];
  const primitiveById = new Map(typographyCatalog.tokens.map((token) => [token.id, token]));
  const fontFamilySemantics = semanticCatalog.fontFamilySemantics;
  if (!fontFamilySemantics || typeof fontFamilySemantics !== "object" || Array.isArray(fontFamilySemantics)) {
    errors.push("typography.semantic.json: fontFamilySemantics must be object");
  }
  const registeredFontFamilies = new Set(Object.keys(fontFamilySemantics ?? {}));
  for (const [family, semantics] of Object.entries(fontFamilySemantics ?? {})) {
    const where = `typography.semantic.json: fontFamilySemantics.${family}`;
    if (!semantics || typeof semantics !== "object" || Array.isArray(semantics)) {
      errors.push(`${where} must be object`);
      continue;
    }
    for (const key of ["kind", "platform", "meaning"]) {
      if (typeof semantics[key] !== "string" || semantics[key].length === 0) {
        errors.push(`${where}.${key} must be non-empty string`);
      }
    }
    if (
      !Array.isArray(semantics.runtimeStack) ||
      semantics.runtimeStack.length === 0 ||
      semantics.runtimeStack.some((item) => typeof item !== "string" || item.length === 0)
    ) {
      errors.push(`${where}.runtimeStack must be non-empty string array`);
    }
    if (family === "WeGothicSans" && (
      !Array.isArray(semantics.composition) ||
      semantics.composition.length === 0 ||
      semantics.composition.some((item) => typeof item !== "string" || item.length === 0)
    )) {
      errors.push(`${where}.composition must be non-empty string array`);
    }
  }
  if (!Array.isArray(semanticCatalog.tokens)) {
    return ["typography.semantic.json: tokens must be array"];
  }
  for (const [index, token] of semanticCatalog.tokens.entries()) {
    const where = `typography.semantic.json: tokens[${index}]`;
    for (const hardcodedKey of ["fontSize", "fontFamily", "fontWeight", "lineHeight", "letterSpacing"]) {
      if (Object.hasOwn(token, hardcodedKey)) {
        errors.push(`${where}.${hardcodedKey} must not be top-level hardcoded value`);
      }
    }
    for (const key of ["fontFamily", "fontSize", "fontWeight", "lineHeight"]) {
      const ref = token.refs?.[key];
      if (!TOKEN_ID_PATTERN.test(ref ?? "")) {
        errors.push(`${where}.refs.${key} invalid`);
      } else if (!primitiveById.has(ref)) {
        errors.push(`${where}.refs.${key} missing primitive: ${ref}`);
      }
    }
    const sizeRef = token.refs?.fontSize;
    const modes = Object.keys(primitiveById.get(sizeRef)?.values ?? {});
    for (const mode of modes) {
      const resolved = token.resolved?.[mode];
      if (!resolved) {
        errors.push(`${where}.resolved.${mode} missing`);
        continue;
      }
      if (!registeredFontFamilies.has(resolved.fontFamily)) {
        errors.push(`${where}.resolved.${mode}.fontFamily missing fontFamilySemantics: ${resolved.fontFamily}`);
      }
      const expected = {
        fontSize: primitiveById.get(token.refs.fontSize).values[mode].raw,
        fontFamily: primitiveById.get(token.refs.fontFamily).values[mode].raw,
        fontWeight: primitiveById.get(token.refs.fontWeight).values[mode].raw,
        lineHeight: primitiveById.get(token.refs.lineHeight).values[mode].raw,
        letterSpacing: 0,
      };
      if (JSON.stringify(resolved) !== JSON.stringify(expected)) {
        errors.push(`${where}.resolved.${mode} does not match refs`);
      }
    }
  }
  return errors;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const catalogs = new Map();
  const errors = [];
  for (const fileName of CORE_FILES) {
    const catalog = readJson(path.join(args.inputDir, fileName));
    catalogs.set(fileName, catalog);
    errors.push(...validateCoreCatalog(catalog, fileName));
  }
  const semanticCatalog = readJson(path.join(args.inputDir, SEMANTIC_FILE));
  errors.push(...validateSemanticTypography(semanticCatalog, catalogs.get("typography.json")));

  if (errors.length > 0) {
    console.error(`Token catalog validation failed (${errors.length} errors):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }
  for (const fileName of CORE_FILES) {
    console.log(`${fileName}: ${catalogs.get(fileName).tokens.length} tokens`);
  }
  console.log(`${SEMANTIC_FILE}: ${semanticCatalog.tokens.length} tokens`);
  console.log("Token catalogs valid");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
