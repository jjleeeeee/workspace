#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import process from "node:process";

const args = process.argv.slice(2);
let mode = "description";
let inputPath;

for (let index = 0; index < args.length; index += 1) {
  const arg = args[index];

  if (arg === "--mode") {
    mode = args[index + 1] ?? "";
    index += 1;
    continue;
  }

  if (arg.startsWith("--mode=")) {
    mode = arg.slice("--mode=".length);
    continue;
  }

  inputPath = arg;
}

if (!inputPath) {
  console.error("Usage: node tools/validate-component-description.mjs [--mode=description|bridge] <yaml-file>");
  process.exit(2);
}

if (!["description", "bridge"].includes(mode)) {
  console.error(`ERROR: unsupported mode: ${mode}`);
  process.exit(2);
}

if (!existsSync(inputPath)) {
  console.error(`ERROR: file not found: ${inputPath}`);
  process.exit(2);
}

const text = readFileSync(inputPath, "utf8");
const yamlLines = text.split(/\r?\n/);
const errors = [];
const warnings = [];

const requiredSections = [
  "component",
  "axes",
  "variants",
  "tokens",
  "layout",
  "implementation_order",
  "implementation_coverage",
  "rules",
];

const requiredBridgeSections = [
  "bridge",
  "component_contract",
  "platform_bindings",
  "validation",
];

const requiredComponentFields = [
  "name",
  "description",
  "figma_file",
  "node_id",
  "component_set_key",
  "last_synced",
];

const requiredCoverageFields = ["axes", "props", "assets", "layout", "exclusions"];
const requiredBridgeFields = ["component", "source_draft", "status"];
const requiredCommonContractFields = [
  ["figma", "file_key"],
  ["figma", "node_id"],
  ["figma", "component_set_key"],
  ["figma_read_evidence", "provenance"],
  ["validation_scope", "comparison_scope"],
];
const requiredVisualValidationFields = [
  "provenance",
  "registry_path",
  "registry_id",
  "component",
  "story_id",
  "selector",
  "comparison_scope",
  "is_parity_gate",
];
const htmlEntities = ["&quot;", "&#34;", "&apos;", "&#39;", "&amp;", "&lt;", "&gt;"];

function hasTopLevelSection(name) {
  return new RegExp(`^${escapeRegExp(name)}:\\s*$`, "m").test(text);
}

function parseYamlLine(line) {
  const match = /^(\s*)([A-Za-z0-9_-]+):(?:\s*(.*))?$/.exec(line);
  if (!match) return null;

  return {
    indent: match[1].length,
    key: match[2],
    value: match[3] ?? "",
  };
}

function getLineIndent(line) {
  return line.match(/^\s*/)?.[0].length ?? 0;
}

function findYamlBlockEnd(startIndex, indent) {
  for (let index = startIndex + 1; index < yamlLines.length; index += 1) {
    const line = yamlLines[index];
    if (!line.trim() || line.trimStart().startsWith("#")) continue;

    if (getLineIndent(line) <= indent) {
      return index;
    }
  }

  return yamlLines.length;
}

function findYamlPath(path) {
  let start = 0;
  let end = yamlLines.length;
  let expectedIndent = 0;
  let found = null;

  for (const segment of path) {
    found = null;

    for (let index = start; index < end; index += 1) {
      const parsed = parseYamlLine(yamlLines[index]);
      if (!parsed || parsed.indent !== expectedIndent || parsed.key !== segment) continue;

      found = {
        ...parsed,
        lineIndex: index,
        blockStart: index + 1,
        blockEnd: findYamlBlockEnd(index, parsed.indent),
      };
      break;
    }

    if (!found) return null;

    start = found.blockStart;
    end = found.blockEnd;
    expectedIndent = found.indent + 2;
  }

  return found;
}

function cleanYamlScalar(value) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  return trimmed.replace(/^["']|["']$/g, "");
}

function hasYamlPath(path) {
  return Boolean(findYamlPath(path));
}

function hasYamlPathScalar(path) {
  const entry = findYamlPath(path);
  return Boolean(entry && cleanYamlScalar(entry.value));
}

function getYamlPathScalar(path) {
  const entry = findYamlPath(path);
  return entry ? cleanYamlScalar(entry.value) : "";
}

function hasYamlListAtPath(path) {
  const entry = findYamlPath(path);
  if (!entry) return false;

  const listIndent = entry.indent + 2;
  const pattern = new RegExp(`^\\s{${listIndent}}-\\s+\\S`);

  return yamlLines.slice(entry.blockStart, entry.blockEnd).some((line) => pattern.test(line));
}

function hasNestedField(section, field) {
  const sectionPattern = new RegExp(`^${escapeRegExp(section)}:\\s*$`, "m");
  const match = sectionPattern.exec(text);
  if (!match) return false;

  const start = match.index + match[0].length;
  const nextSection = /\n[A-Za-z0-9_]+:\s*$/gm;
  nextSection.lastIndex = start;
  const next = nextSection.exec(text);
  const body = text.slice(start, next ? next.index : text.length);

  return new RegExp(`^\\s{2}${escapeRegExp(field)}:\\s*\\S`, "m").test(body);
}

function getNestedScalar(section, field) {
  const sectionPattern = new RegExp(`^${escapeRegExp(section)}:\\s*$`, "m");
  const match = sectionPattern.exec(text);
  if (!match) return "";

  const start = match.index + match[0].length;
  const nextSection = /\n[A-Za-z0-9_]+:\s*$/gm;
  nextSection.lastIndex = start;
  const next = nextSection.exec(text);
  const body = text.slice(start, next ? next.index : text.length);
  const fieldPattern = new RegExp(`^\\s{2}${escapeRegExp(field)}:\\s*(.+?)\\s*$`, "m");
  const fieldMatch = fieldPattern.exec(body);
  if (!fieldMatch) return "";

  return fieldMatch[1].trim().replace(/^["']|["']$/g, "");
}

function hasListItemUnder(section, field) {
  const sectionPattern = new RegExp(`^${escapeRegExp(section)}:\\s*$`, "m");
  const match = sectionPattern.exec(text);
  if (!match) return false;

  const start = match.index + match[0].length;
  const nextSection = /\n[A-Za-z0-9_]+:\s*$/gm;
  nextSection.lastIndex = start;
  const next = nextSection.exec(text);
  const body = text.slice(start, next ? next.index : text.length);
  const fieldPattern = new RegExp(`^\\s{2}${escapeRegExp(field)}:\\s*$`, "m");
  const fieldMatch = fieldPattern.exec(body);
  if (!fieldMatch) return false;

  const fieldBody = body.slice(fieldMatch.index + fieldMatch[0].length);
  const nextPeer = /^\s{2}[A-Za-z0-9_]+:\s*$/gm;
  nextPeer.lastIndex = 0;
  const peer = nextPeer.exec(fieldBody);
  const listBody = fieldBody.slice(0, peer ? peer.index : fieldBody.length);

  return /^\s{4}-\s+\S/m.test(listBody);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseExpectedSize(value) {
  const match = /^(\d+)x(\d+)$/.exec(value);
  if (!match) return null;

  return { width: Number(match[1]), height: Number(match[2]) };
}

function bridgePathMatchesRegistry(bridgePath, registryPath) {
  if (!bridgePath || !registryPath) return true;
  return bridgePath === registryPath || bridgePath.endsWith(registryPath);
}

function getReactVisualValidationScalar(field) {
  return getYamlPathScalar(["platform_bindings", "react", "visual_validation", field]);
}

function compareVisualRegistry() {
  const registryPath = getReactVisualValidationScalar("registry_path");
  const registryId = getReactVisualValidationScalar("registry_id");
  if (!registryPath || !registryId) return;

  const absoluteRegistryPath = resolve(process.cwd(), registryPath);
  if (!existsSync(absoluteRegistryPath)) return;

  let registry;
  try {
    registry = JSON.parse(readFileSync(absoluteRegistryPath, "utf8"));
  } catch (error) {
    errors.push(`Unable to parse visual registry JSON: ${registryPath} (${error.message})`);
    return;
  }

  const entry = Array.isArray(registry) ? registry.find((item) => item.id === registryId) : null;
  if (!entry) {
    errors.push(`Visual registry entry not found: ${registryId}`);
    return;
  }

  const comparisons = [
    ["component", getReactVisualValidationScalar("component"), entry.component],
    ["story_id", getReactVisualValidationScalar("story_id"), entry.storyId],
    ["selector", getReactVisualValidationScalar("selector"), entry.selector],
    ["comparison_scope", getReactVisualValidationScalar("comparison_scope"), entry.comparisonScope],
    ["is_parity_gate", getReactVisualValidationScalar("is_parity_gate"), String(entry.isParityGate)],
  ];

  for (const [field, bridgeValue, registryValue] of comparisons) {
    if (bridgeValue !== String(registryValue)) {
      errors.push(`Visual registry mismatch: ${field} bridge=${bridgeValue} registry=${registryValue}`);
    }
  }

  const expectedSize = parseExpectedSize(getReactVisualValidationScalar("expected_size"));
  if (expectedSize) {
    if (expectedSize.width !== entry.expectedWidth || expectedSize.height !== entry.expectedHeight) {
      errors.push(
        `Visual registry mismatch: expected_size bridge=${expectedSize.width}x${expectedSize.height} registry=${entry.expectedWidth}x${entry.expectedHeight}`,
      );
    }
  }

  for (const [field, registryField] of [
    ["layout_baseline_path", "layoutBaselinePath"],
    ["visual_baseline_path", "visualBaselinePath"],
  ]) {
    const bridgeValue = getReactVisualValidationScalar(field);
    const registryValue = entry[registryField];
    if (!bridgePathMatchesRegistry(bridgeValue, registryValue)) {
      errors.push(`Visual registry mismatch: ${field} bridge=${bridgeValue} registry=${registryValue}`);
    }
  }
}

if (mode === "description") {
  for (const section of requiredSections) {
    if (!hasTopLevelSection(section)) {
      errors.push(`Missing top-level section: ${section}`);
    }
  }

  for (const field of requiredComponentFields) {
    if (!hasNestedField("component", field)) {
      errors.push(`Missing component field: component.${field}`);
    }
  }

  for (const field of requiredCoverageFields) {
    if (!hasNestedField("implementation_coverage", field)) {
      errors.push(`Missing coverage field: implementation_coverage.${field}`);
    }
  }

  if (/\btoken:\s*null\b/.test(text) && !hasTopLevelSection("source_gaps")) {
    errors.push("Found token: null without a source_gaps section");
  }

  if (hasTopLevelSection("source_gaps") && !/^\s{2}-\s+(part|item|field):\s*\S/m.test(text)) {
    errors.push("source_gaps must include at least one '- part:', '- item:', or '- field:' entry");
  }

  if (!/implementation_order:\n\s{2}-\s+/.test(text)) {
    errors.push("implementation_order must include at least one list item");
  }

  if (!hasListItemUnder("rules", "do") || !hasListItemUnder("rules", "dont")) {
    errors.push("rules.do and rules.dont must each include at least one list item");
  }
} else {
  for (const section of requiredBridgeSections) {
    if (!hasTopLevelSection(section)) {
      errors.push(`Missing top-level section: ${section}`);
    }
  }

  for (const field of requiredBridgeFields) {
    if (!hasNestedField("bridge", field)) {
      errors.push(`Missing bridge field: bridge.${field}`);
    }
  }

  for (const path of requiredCommonContractFields) {
    const fullPath = ["component_contract", ...path];
    if (!hasYamlPathScalar(fullPath)) {
      errors.push(`Missing component contract field: ${fullPath.join(".")}`);
    }
  }

  for (const path of [
    ["component_contract", "axes"],
    ["component_contract", "props"],
  ]) {
    if (!hasYamlPath(path)) errors.push(`Missing component contract section: ${path.join(".")}`);
  }

  for (const path of [
    ["platform_bindings", "react", "source_note", "provenance"],
    ["platform_bindings", "react", "source_note", "path"],
    ["platform_bindings", "react", "implementation_bridge", "provenance"],
  ]) {
    if (!hasYamlPathScalar(path)) errors.push(`Missing platform binding field: ${path.join(".")}`);
  }

  for (const field of requiredVisualValidationFields) {
    const fullPath = ["platform_bindings", "react", "visual_validation", field];
    if (!hasYamlPathScalar(fullPath)) {
      errors.push(`Missing platform binding field: ${fullPath.join(".")}`);
    }
  }

  if (!hasYamlListAtPath(["validation", "commands"])) {
    errors.push("validation.commands must include at least one list item");
  }

  const status = getNestedScalar("bridge", "status");
  const comparisonScope = getReactVisualValidationScalar("comparison_scope");
  const allowedStatuses = new Set(["ready", "partial", "structure-only", "needs-live-read"]);
  const allowedScopes = new Set(["full-parity", "structure-only", "shell-only"]);

  if (status && !allowedStatuses.has(status)) {
    errors.push(`Unsupported bridge.status: ${status}`);
  }

  if (comparisonScope && !allowedScopes.has(comparisonScope)) {
    errors.push(`Unsupported platform_bindings.react.visual_validation.comparison_scope: ${comparisonScope}`);
  }

  for (const path of [
    ["bridge", "source_draft"],
    ["platform_bindings", "react", "source_note", "path"],
    ["platform_bindings", "react", "visual_validation", "registry_path"],
  ]) {
    const value = getYamlPathScalar(path);
    if (value && !existsSync(resolve(process.cwd(), value))) {
      warnings.push(`Referenced path does not exist: ${path.join(".")} -> ${value}`);
    }
  }

  compareVisualRegistry();
}

for (const entity of htmlEntities) {
  if (text.includes(entity)) {
    errors.push(`HTML entity remains in YAML: ${entity}`);
  }
}

if (/<[^>\n]+>/.test(text)) {
  warnings.push("Placeholder-like angle bracket text remains");
}

if (/확인 필요|TBD|TODO/i.test(text)) {
  warnings.push("Review marker remains: 확인 필요 / TBD / TODO");
}

if (hasTopLevelSection("assets") && !/^\s{4}semantic_rule:\s*\S/m.test(text)) {
  warnings.push("assets section exists but no assets.*.semantic_rule was found");
}

const label = basename(inputPath);

if (errors.length > 0) {
  console.error(`FAIL ${label}`);
  for (const error of errors) console.error(`ERROR: ${error}`);
  for (const warning of warnings) console.error(`WARN: ${warning}`);
  process.exit(1);
}

console.log(`PASS ${label}`);
for (const warning of warnings) console.log(`WARN: ${warning}`);
