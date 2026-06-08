#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const DEFAULT_FILE_KEY = "DWEduE6GfxYMlyxKPNJ8jA";
const DEFAULT_STAGE_LABEL = "v1.0";
const WORKSPACE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DEFAULT_OUTPUT_DIR = path.join(WORKSPACE_ROOT, "chord-design-system/tokens");
const TOKEN_FILES = {
  color: "color.json",
  size: "size.json",
  typography: "typography.json",
  typographySemantic: "typography.semantic.json",
};

const FONT_FAMILY_SEMANTICS = {
  WeGothicSans: {
    kind: "system-alias",
    platform: "ios",
    meaning: "Apple system font environment for Korean UI",
    composition: ["Apple SD Gothic", "SF Pro"],
    runtimeStack: ["-apple-system", "BlinkMacSystemFont", "SF Pro", "Apple SD Gothic Neo", "system-ui", "sans-serif"],
  },
  Roboto: {
    kind: "system-font",
    platform: "aos",
    meaning: "Android OS default system font",
    runtimeStack: ["Roboto", "system-ui", "sans-serif"],
  },
  Pretendard: {
    kind: "web-font",
    platform: "web",
    meaning: "Web UI font",
    runtimeStack: ["Pretendard", "ui-sans-serif", "system-ui", "sans-serif"],
  },
  "CircularXX TT": {
    kind: "brand-font",
    platform: "shared",
    meaning: "Brand/display Latin font",
    runtimeStack: ["CircularXX TT", "ui-sans-serif", "system-ui", "sans-serif"],
  },
};

const MODE_NAME_MAP = new Map([
  ["Light", "light"],
  ["Dark", "dark"],
  ["iOS", "ios"],
  ["IOS", "ios"],
  ["AOS", "aos"],
  ["WEB", "web"],
  ["Mode 1", "mode-1"],
]);

const USAGE_SCOPE_MAP = new Map([
  ["ALL_SCOPES", "all"],
  ["ALL_FILLS", "all"],
  ["SHAPE_FILL", "shape-fill"],
  ["TEXT_FILL", "text-fill"],
  ["STROKE_COLOR", "stroke"],
  ["EFFECT_COLOR", "effect"],
  ["CORNER_RADIUS", "corner-radius"],
  ["WIDTH_HEIGHT", "width-height"],
  ["GAP", "gap"],
  ["OPACITY", "opacity"],
  ["FONT_FAMILY", "font-family"],
  ["FONT_SIZE", "font-size"],
  ["FONT_WEIGHT", "font-weight"],
  ["FONT_STYLE", "font-style"],
  ["LETTER_SPACING", "letter-spacing"],
  ["LINE_HEIGHT", "line-height"],
  ["PARAGRAPH_SPACING", "paragraph-spacing"],
  ["PARAGRAPH_INDENT", "paragraph-indent"],
  ["TEXT_CONTENT", "text-content"],
]);

const TYPOGRAPHY_STYLE_SCALE = {
  "caption-2xs": { textSize: "text-15", lineHeight: "text-lineheight-15", family: "body" },
  "caption-xs": { textSize: "text-25", lineHeight: "text-lineheight-25", family: "body" },
  "caption-s": { textSize: "text-50", lineHeight: "text-lineheight-50", family: "body" },
  "caption-m": { textSize: "text-75", lineHeight: "text-lineheight-75", family: "body" },
  "body-xs": { textSize: "text-100", lineHeight: "text-lineheight-100", family: "body" },
  "body-s": { textSize: "text-150", lineHeight: "text-lineheight-150", family: "body" },
  "body-m": { textSize: "text-200", lineHeight: "text-lineheight-200", family: "body" },
  "body-lg": { textSize: "text-300", lineHeight: "text-lineheight-300", family: "body" },
  "headline-s": { textSize: "text-400", lineHeight: "text-lineheight-400", family: "title" },
  "headline-m": { textSize: "text-500", lineHeight: "text-lineheight-500", family: "title" },
  "title-s": { textSize: "text-600", lineHeight: "text-lineheight-600", family: "title" },
  "title-m": { textSize: "text-700", lineHeight: "text-lineheight-700", family: "title" },
  "title-lg": { textSize: "text-800", lineHeight: "text-lineheight-800", family: "title" },
  "title-xlg": { textSize: "text-900", lineHeight: "text-lineheight-900", family: "title" },
  "title-2xlg": { textSize: "text-1200", lineHeight: "text-lineheight-900", family: "title" },
};

const SEMANTIC_TYPOGRAPHY_STYLES = [
  ...["title-2xlg", "title-xlg", "title-lg", "title-m"].flatMap((style) => [
    { style, variant: "system", weight: 800 },
    { style, variant: "circular", weight: 900 },
  ]),
  { style: "title-s", variant: "system", weight: 800 },
  { style: "title-s", variant: "circular", weight: 900 },
  { style: "title-s", variant: "circular", weight: 500 },
  { style: "headline-m", variant: "system", weight: 800 },
  { style: "headline-m", variant: "circular", weight: 900 },
  { style: "headline-s", variant: "system", weight: 800 },
  { style: "headline-s", variant: "system", weight: 700 },
  { style: "headline-s", variant: "circular", weight: 700 },
  ...["body-lg", "body-m", "body-s", "body-xs"].flatMap((style) => [
    ...[700, 600, 500, 400].map((weight) => ({ style, variant: "system", weight })),
    ...[700, 500, 400].map((weight) => ({ style, variant: "circular", weight })),
  ]),
  ...["caption-m", "caption-s", "caption-xs"].flatMap((style) => [
    ...[700, 500, 400].map((weight) => ({ style, variant: "system", weight })),
    ...[700, 500, 400].map((weight) => ({ style, variant: "circular", weight })),
  ]),
  { style: "caption-2xs", variant: "system", weight: 400 },
];

export function tokenIdFromName(name, prefix = "token:") {
  return `${prefix}${name.toLowerCase().replaceAll("/", ".").replaceAll("_", "-")}`;
}

export function normalizeScope(scope) {
  return USAGE_SCOPE_MAP.get(scope) ?? scope.toLowerCase().replaceAll("_", "-");
}

export function normalizeModeName(name) {
  return MODE_NAME_MAP.get(name) ?? name.toLowerCase().replaceAll(/\s+/g, "-");
}

export function rgbaToHex(value) {
  const toByte = (channel) => Math.round(channel * 255);
  const toHex = (byte) => byte.toString(16).padStart(2, "0").toUpperCase();
  const rgb = [toByte(value.r), toByte(value.g), toByte(value.b)].map(toHex).join("");
  const alpha = value.a ?? 1;
  return alpha >= 0.999 ? `#${rgb}` : `#${rgb}${toHex(toByte(alpha))}`;
}

export function buildCatalogs(restPayload, options = {}) {
  const fileKey = options.fileKey ?? DEFAULT_FILE_KEY;
  const stageLabel = options.stageLabel ?? DEFAULT_STAGE_LABEL;
  const freshness = options.freshness ?? new Date().toISOString();
  const collections = normalizeList(restPayload.meta?.variableCollections);
  const variables = normalizeList(restPayload.meta?.variables);
  const variableById = new Map(variables.map((variable) => [variable.id, variable]));
  const collectionById = new Map(collections.map((collection) => [collection.id, collection]));

  const wdsCollection = selectPrimaryCollection(collections, "WDS_tokens");
  const version = getSourceVersion(wdsCollection, variableById);

  const baseSource = {
    origin: "figma:Chord Design System",
    fileKey,
    version,
    freshness,
    stageLabel,
  };

  const colorBuild = buildColorCatalog({
    source: { ...baseSource, collection: "WDS_tokens" },
    collection: wdsCollection,
    collectionById,
    variableById,
  });
  const sizeBuild = buildSizeCatalog({
    source: { ...baseSource, collection: "WDS_tokens" },
    collection: wdsCollection,
    collectionById,
    variableById,
  });
  const typographyBuild = buildTypographyCatalog({
    source: { ...baseSource, collection: "TYPO_tokens + TYPO_circular_tokens" },
    collections,
    collectionById,
    variableById,
  });
  const typography = makeCatalog({
    source: typographyBuild.source,
    modes: ["ios", "aos", "web", "mode-1"],
    tokens: typographyBuild.tokens,
    diagnostics: typographyBuild.diagnostics,
  });

  const catalogs = {
    color: makeCatalog({
      source: colorBuild.source,
      modes: ["light", "dark"],
      tokens: colorBuild.tokens,
      diagnostics: colorBuild.diagnostics,
    }),
    size: makeCatalog({
      source: sizeBuild.source,
      modes: ["light", "dark"],
      tokens: sizeBuild.tokens,
      diagnostics: sizeBuild.diagnostics,
    }),
    typography,
  };

  if (options.includeSemantic) {
    catalogs.typographySemantic = buildSemanticTypographyCatalog(typography, {
      fileKey,
      freshness,
    });
  }

  return catalogs;
}

function buildColorCatalog({ source, collection, collectionById, variableById }) {
  const tokens = [];
  const danglingIds = [];
  const candidates = variablesForCollection(collection, variableById)
    .filter((variable) => variable.resolvedType === "COLOR")
    .filter((variable) => (
      variable.name.startsWith("system/color/") ||
      variable.name.startsWith("system/fixed_color/")
    ))
    .sort(compareTokenSource);

  for (const variable of candidates) {
    const token = buildToken(variable, {
      collection,
      collectionById,
      variableById,
      idPrefix: "token:",
      type: "color",
      transformRaw: (value) => isRgba(value) ? rgbaToHex(value) : value,
    });
    const rawValues = Object.values(token.values).map((modeValue) => modeValue.raw);
    if (rawValues.every((raw) => typeof raw === "string" && /^#[0-9A-F]{6}([0-9A-F]{2})?$/.test(raw))) {
      tokens.push(token);
    } else {
      danglingIds.push(token.id);
    }
  }

  const diagnostics = [
    ...makeCommonDiagnostics(tokens),
    {
      code: "duplicate-alias",
      message: "SameColor/FixedColor cleanup is intentionally deferred; system tokens are flattened to raw hex for DSL rendering.",
    },
  ];
  if (danglingIds.length > 0) {
    diagnostics.push({
      code: "alias:dangling",
      message: "Color variables that could not be resolved to final hex are excluded because their alias targets are missing from the Figma REST local variables response.",
      tokens: danglingIds,
    });
  }

  return { source, tokens, diagnostics };
}

function buildSizeCatalog({ source, collection, collectionById, variableById }) {
  const tokens = variablesForCollection(collection, variableById)
    .filter((variable) => variable.resolvedType === "FLOAT")
    .filter((variable) => variable.name.startsWith("system/size/"))
    .sort(compareTokenSource)
    .map((variable) => buildToken(variable, {
      collection,
      collectionById,
      variableById,
      idPrefix: "token:",
      type: "dimension",
      transformRaw: (value) => value,
    }));

  return { source, tokens, diagnostics: makeCommonDiagnostics(tokens) };
}

function buildTypographyCatalog({ source, collections, collectionById, variableById }) {
  const defaultCollection = selectPrimaryCollection(collections, "TYPO_tokens");
  const circularCollection = selectPrimaryCollection(collections, "TYPO_circular_tokens");
  const tokens = [
    ...buildTypographyTokensForCollection({
      collection: circularCollection,
      collectionById,
      variableById,
      idPrefix: "token:typography.circular.",
    }),
    ...buildTypographyTokensForCollection({
      collection: defaultCollection,
      collectionById,
      variableById,
      idPrefix: "token:typography.default.",
    }),
  ].sort((a, b) => a.id.localeCompare(b.id));

  return { source, tokens, diagnostics: makeCommonDiagnostics(tokens) };
}

function buildTypographyTokensForCollection({ collection, collectionById, variableById, idPrefix }) {
  return variablesForCollection(collection, variableById)
    .filter((variable) => variable.resolvedType === "FLOAT" || variable.resolvedType === "STRING")
    .sort((a, b) => tokenIdFromName(a.name, idPrefix).localeCompare(tokenIdFromName(b.name, idPrefix)))
    .map((variable) => buildToken(variable, {
      collection,
      collectionById,
      variableById,
      idPrefix,
      type: typographyTokenType(variable),
      transformRaw: (value) => value,
    }));
}

function typographyTokenType(variable) {
  if (variable.resolvedType === "STRING") {
    return "string";
  }
  const usage = usageFor(variable);
  if (usage.includes("font-size") || usage.includes("line-height") || usage.includes("letter-spacing")) {
    return "dimension";
  }
  return "number";
}

export function buildSemanticTypographyCatalog(typographyCatalog, options = {}) {
  const fileKey = options.fileKey ?? DEFAULT_FILE_KEY;
  const freshness = options.freshness ?? new Date().toISOString();
  const tokenById = new Map(typographyCatalog.tokens.map((token) => [token.id, token]));

  const tokens = SEMANTIC_TYPOGRAPHY_STYLES.map((style) => {
    const refs = refsForSemanticStyle(style);
    for (const [property, ref] of Object.entries(refs)) {
      if (!tokenById.has(ref)) {
        throw new Error(`Missing typography primitive for ${style.style}/${style.variant}-${style.weight}: refs.${property}=${ref}`);
      }
    }
    return {
      name: `${style.style}/${style.variant}-${style.weight}`,
      refs,
      resolved: resolveSemanticTypography(refs, tokenById),
    };
  });

  return {
    $schema: "https://our-ds-mcp/schemas/typography-semantic.v1.json",
    source: {
      origin: "Figma text styles",
      fileKey,
      tool: "semantic typography generator",
      primitive: "typography.json",
      freshness,
      coverage: {
        total: tokens.length,
      },
    },
    fontFamilySemantics: FONT_FAMILY_SEMANTICS,
    tokens,
  };
}

function refsForSemanticStyle({ style, variant, weight }) {
  const scale = TYPOGRAPHY_STYLE_SCALE[style];
  if (!scale) {
    throw new Error(`Unknown semantic typography style: ${style}`);
  }
  const family = variant === "circular" ? "title" : scale.family;
  return {
    fontFamily: typographyRef(variant, `font_family/${family}`),
    fontSize: typographyRef(variant, `base/text_size/${scale.textSize}`),
    fontWeight: typographyRef(variant, `base/text_weight/text-weight-${weight}`),
    lineHeight: typographyRef(variant, `base/lineheight/${scale.lineHeight}`),
  };
}

function typographyRef(variant, name) {
  const family = variant === "circular" ? "circular" : "default";
  return tokenIdFromName(name, `token:typography.${family}.`);
}

function resolveSemanticTypography(refs, tokenById) {
  const modes = Object.keys(tokenById.get(refs.fontSize).values);
  const resolved = {};
  for (const mode of modes) {
    resolved[mode] = {
      fontSize: tokenById.get(refs.fontSize).values[mode].raw,
      fontFamily: tokenById.get(refs.fontFamily).values[mode].raw,
      fontWeight: tokenById.get(refs.fontWeight).values[mode].raw,
      lineHeight: tokenById.get(refs.lineHeight).values[mode].raw,
      letterSpacing: 0,
    };
  }
  return resolved;
}

function buildToken(variable, { collection, collectionById, variableById, idPrefix, type, transformRaw }) {
  const values = {};
  const modeEntries = modeEntriesForCollection(collection);
  for (const [modeId, modeName] of modeEntries) {
    values[modeName] = {
      raw: transformRaw(resolveVariableValue(variable, modeId, { collectionById, variableById })),
      aliasOf: null,
    };
  }

  const platformCode = platformCodeFor(variable);
  const diagnostics = tokenDiagnostics(variable, platformCode);
  return {
    id: tokenIdFromName(variable.name, idPrefix),
    name: variable.name,
    type,
    values,
    usage: usageFor(variable),
    platformCode,
    description: normalizeDescription(variable.description),
    hidden: Boolean(variable.hiddenFromPublishing),
    figmaKey: variable.key || variable.id,
    diagnostics,
  };
}

function makeCatalog({ source, modes, tokens, diagnostics }) {
  const documented = tokens.filter((token) => token.description).length;
  const hidden = tokens.filter((token) => token.hidden).length;
  return {
    $schema: "https://our-ds-mcp/schemas/tokens.v1.json",
    source: {
      origin: source.origin,
      fileKey: source.fileKey,
      collection: source.collection,
      version: source.version,
      freshness: source.freshness,
      coverage: {
        total: tokens.length,
        documented,
        hidden,
      },
      stageLabel: source.stageLabel,
    },
    modes,
    tokens,
    diagnostics: diagnostics ?? makeCommonDiagnostics(tokens),
  };
}

function makeCommonDiagnostics(tokens) {
  const diagnostics = [];
  const missingDescriptions = tokens.filter((token) => !token.description).length;
  if (missingDescriptions > 0) {
    diagnostics.push({
      code: "documentation:missing",
      message: `${missingDescriptions}/${tokens.length} tokens have empty descriptions.`,
    });
  }
  const hiddenTokens = tokens.filter((token) => token.hidden).map((token) => token.id);
  if (hiddenTokens.length > 0) {
    diagnostics.push({
      code: "hidden-from-publishing",
      message: `${hiddenTokens.length} hidden tokens are included because they are semantic output tokens.`,
      tokens: hiddenTokens,
    });
  }
  return diagnostics;
}

function resolveVariableValue(variable, modeId, context, seen = new Set()) {
  const value = valueForMode(variable, modeId);
  if (isVariableAlias(value)) {
    if (seen.has(value.id)) {
      return undefined;
    }
    seen.add(value.id);
    const target = context.variableById.get(value.id);
    if (!target) {
      return undefined;
    }
    return resolveVariableValue(target, modeId, context, seen);
  }
  return value;
}

function valueForMode(variable, modeId) {
  const valuesByMode = variable.valuesByMode ?? {};
  if (Object.hasOwn(valuesByMode, modeId)) {
    return valuesByMode[modeId];
  }
  return Object.values(valuesByMode)[0];
}

function usageFor(variable) {
  return [...new Set((variable.scopes ?? []).map(normalizeScope))].filter(Boolean);
}

function platformCodeFor(variable) {
  const codeSyntax = variable.codeSyntax ?? {};
  return {
    ios: codeSyntax.iOS ?? codeSyntax.IOS ?? codeSyntax.ios ?? null,
    android: codeSyntax.ANDROID ?? codeSyntax.Android ?? codeSyntax.android ?? null,
    web: codeSyntax.WEB ?? codeSyntax.web ?? deriveWebCode(variable.name),
  };
}

function deriveWebCode(name) {
  const segments = name.split("/");
  const relevant = segments[0] === "system" ? segments.slice(2) : segments[0] === "base" ? segments.slice(1) : segments;
  return relevant.join("-").toLowerCase().replaceAll("_", "-");
}

function tokenDiagnostics(variable, platformCode) {
  const diagnostics = [];
  if (!normalizeDescription(variable.description)) {
    diagnostics.push("documentation:missing");
  }
  if (platformCode.ios == null) {
    diagnostics.push("platform-code:missing-ios");
  }
  if (platformCode.android == null) {
    diagnostics.push("platform-code:missing-android");
  }
  if (platformCode.web == null) {
    diagnostics.push("platform-code:missing-web");
  }
  if (variable.hiddenFromPublishing) {
    diagnostics.push("hidden-from-publishing");
  }
  return diagnostics;
}

function getSourceVersion(collection, variableById) {
  const versionVariable = variablesForCollection(collection, variableById)
    .find((variable) => variable.name === "base/wds_version");
  if (!versionVariable) {
    return null;
  }
  const raw = Object.values(versionVariable.valuesByMode ?? {})[0];
  return typeof raw === "string" ? raw : null;
}

function variablesForCollection(collection, variableById) {
  if (!collection) {
    return [];
  }
  const ids = collection.variableIds ?? [];
  if (ids.length > 0) {
    return ids.map((id) => variableById.get(id)).filter(Boolean);
  }
  return [...variableById.values()].filter((variable) => variable.variableCollectionId === collection.id);
}

function modeEntriesForCollection(collection) {
  return (collection?.modes ?? []).map((mode) => [
    mode.modeId ?? mode.id,
    normalizeModeName(mode.name),
  ]);
}

function selectPrimaryCollection(collections, name) {
  return collections
    .filter((collection) => collection.name === name)
    .sort((a, b) => (b.variableIds?.length ?? 0) - (a.variableIds?.length ?? 0))[0];
}

function normalizeDescription(description) {
  return typeof description === "string" && description.trim() !== "" ? description : null;
}

function normalizeList(value) {
  if (Array.isArray(value)) {
    return value;
  }
  return Object.values(value ?? {});
}

function compareTokenSource(a, b) {
  return tokenIdFromName(a.name).localeCompare(tokenIdFromName(b.name));
}

function isVariableAlias(value) {
  return value && typeof value === "object" && value.type === "VARIABLE_ALIAS" && typeof value.id === "string";
}

function isRgba(value) {
  return value && typeof value === "object" &&
    typeof value.r === "number" &&
    typeof value.g === "number" &&
    typeof value.b === "number";
}

async function fetchFigmaVariables(fileKey, token) {
  const response = await fetch(`https://api.figma.com/v1/files/${fileKey}/variables/local`, {
    headers: { "X-Figma-Token": token },
  });
  if (!response.ok) {
    throw new Error(`Figma REST request failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

function parseArgs(argv) {
  const args = {
    fileKey: DEFAULT_FILE_KEY,
    outputDir: DEFAULT_OUTPUT_DIR,
    stageLabel: DEFAULT_STAGE_LABEL,
    input: null,
    rawOutput: null,
    freshness: null,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = () => argv[++index];
    if (arg === "--file-key") args.fileKey = next();
    else if (arg === "--output-dir") args.outputDir = next();
    else if (arg === "--stage-label") args.stageLabel = next();
    else if (arg === "--input") args.input = next();
    else if (arg === "--raw-output") args.rawOutput = next();
    else if (arg === "--freshness") args.freshness = next();
    else if (arg === "--help") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

function printHelp() {
  console.log(`Usage: node tools/extract-figma-color-tokens.mjs [options]

Options:
  --file-key <key>       Figma file key. Defaults to ${DEFAULT_FILE_KEY}
  --output-dir <path>    Directory for token JSON files. Defaults to ${DEFAULT_OUTPUT_DIR}
  --stage-label <label>  source.stageLabel. Defaults to ${DEFAULT_STAGE_LABEL}
  --freshness <iso>      Override source.freshness. Defaults to current time
  --input <path>         Use saved Figma REST variables/local JSON instead of calling REST
  --raw-output <path>    Save the REST response JSON
`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const payload = args.input
    ? JSON.parse(fs.readFileSync(args.input, "utf8"))
    : await fetchFigmaVariables(args.fileKey, process.env.FIGMA_ACCESS_TOKEN);
  if (args.rawOutput) {
    fs.mkdirSync(path.dirname(args.rawOutput), { recursive: true });
    fs.writeFileSync(args.rawOutput, `${JSON.stringify(payload, null, 2)}\n`);
  }
  const catalogs = buildCatalogs(payload, {
    fileKey: args.fileKey,
    stageLabel: args.stageLabel,
    freshness: args.freshness ?? new Date().toISOString(),
    includeSemantic: true,
  });
  fs.mkdirSync(args.outputDir, { recursive: true });
  for (const [catalogName, fileName] of Object.entries(TOKEN_FILES)) {
    const catalog = catalogs[catalogName];
    if (!catalog) {
      continue;
    }
    const outputPath = path.join(args.outputDir, fileName);
    fs.writeFileSync(outputPath, `${JSON.stringify(catalog, null, 2)}\n`);
    const modes = catalog.modes ? `, modes=${catalog.modes.join(",")}` : "";
    console.log(`Wrote ${catalogName} token catalog to ${outputPath}`);
    console.log(`${catalogName}: ${catalog.tokens.length} tokens${modes}`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
