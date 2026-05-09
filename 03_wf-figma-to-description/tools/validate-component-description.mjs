#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { basename } from "node:path";
import process from "node:process";

const [, , inputPath] = process.argv;

if (!inputPath) {
  console.error("Usage: node tools/validate-component-description.mjs <description-yaml-file>");
  process.exit(2);
}

if (!existsSync(inputPath)) {
  console.error(`ERROR: file not found: ${inputPath}`);
  process.exit(2);
}

const text = readFileSync(inputPath, "utf8");
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

const requiredComponentFields = [
  "name",
  "description",
  "figma_file",
  "node_id",
  "component_set_key",
  "last_synced",
];

const requiredCoverageFields = ["axes", "props", "assets", "layout", "exclusions"];
const htmlEntities = ["&quot;", "&#34;", "&apos;", "&#39;", "&amp;", "&lt;", "&gt;"];

function hasTopLevelSection(name) {
  return new RegExp(`^${escapeRegExp(name)}:\\s*$`, "m").test(text);
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

if (text.includes("descriptionMarkdown")) {
  errors.push("Forbidden storage path found: descriptionMarkdown");
}

for (const entity of htmlEntities) {
  if (text.includes(entity)) {
    errors.push(`HTML entity remains in YAML: ${entity}`);
  }
}

if (/\btoken:\s*null\b/.test(text) && !hasTopLevelSection("source_gaps")) {
  errors.push("Found token: null without a source_gaps section");
}

if (hasTopLevelSection("source_gaps") && !/^\s{2}-\s+(part|item|field):\s*\S/m.test(text)) {
  errors.push("source_gaps must include at least one '- part:', '- item:', or '- field:' entry");
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

if (!/implementation_order:\n\s{2}-\s+/.test(text)) {
  errors.push("implementation_order must include at least one list item");
}

if (!hasListItemUnder("rules", "do") || !hasListItemUnder("rules", "dont")) {
  errors.push("rules.do and rules.dont must each include at least one list item");
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
