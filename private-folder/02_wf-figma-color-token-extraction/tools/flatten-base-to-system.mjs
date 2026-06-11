#!/usr/bin/env node
/**
 * flatten-base-to-system.mjs
 *
 * Phase B automation: re-point system/* alias tokens to direct RGBA/FLOAT values,
 * then delete base/color/* and base/size/* from the Figma branch.
 *
 * Usage:
 *   node tools/flatten-base-to-system.mjs            # dry-run (default)
 *   node tools/flatten-base-to-system.mjs --execute  # apply to Figma branch
 *   node tools/flatten-base-to-system.mjs --batch-size 100  # override batch size
 *
 * Env:
 *   FIGMA_ACCESS_TOKEN  — personal access token with file_variables:read + write
 *
 * Branch file key is hardcoded. Only touches WDS_tokens collection.
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

// ── Config ──────────────────────────────────────────────────────────────────

const BRANCH_FILE_KEY = "vuq1CyC1Pi4NZYE7ximg3I";
const WDS_COLLECTION_ID = "VariableCollectionId:490:8920";
const MODE_LIGHT = "490:0";
const MODE_DARK = "7606:6";

// base/* prefixes to delete after re-pointing
const BASE_DELETE_PREFIXES = ["base/color/", "base/size/"];

// system/* prefixes whose alias→base entries get flattened
const SYSTEM_PREFIXES = ["system/color/", "system/fixed_color/", "system/size/"];

// brand-green is deletedButReferenced by external library — leave as-is
const SKIP_DANGLING_NAMES = new Set(["system/color/roles/brand-green"]);

const FIGMA_API = "https://api.figma.com/v1";
const SNAPSHOT_PATH = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../outputs/raw/figma.variables.local.2026-06-10.pre-flatten.json"
);

// ── Args ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const DRY_RUN = !args.includes("--execute");
const BATCH_SIZE = (() => {
  const idx = args.indexOf("--batch-size");
  return idx !== -1 ? parseInt(args[idx + 1], 10) : 50;
})();

// ── Helpers ──────────────────────────────────────────────────────────────────

function hexToRgba(hex) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
  return { r, g, b, a };
}

function resolveValue(vars, v, modeId, depth = 0) {
  if (depth > 15) return { type: "CYCLE" };
  const val = v.valuesByMode[modeId] ?? Object.values(v.valuesByMode)[0];
  if (val === undefined || val === null) return { type: "MISSING" };
  if (val.type === "VARIABLE_ALIAS") {
    const t = vars[val.id];
    if (!t) return { type: "DANGLING", id: val.id };
    return resolveValue(vars, t, modeId, depth + 1);
  }
  return val; // RGBA object or number
}

async function figmaPost(path, body, dryRun) {
  const token = process.env.FIGMA_ACCESS_TOKEN;
  if (!token) throw new Error("FIGMA_ACCESS_TOKEN not set");
  if (dryRun) {
    const vars = body.variables?.length ?? 0;
    const vals = body.variableModeValues?.length ?? 0;
    console.log(`  [dry-run] POST ${path} — variables: ${vars}, variableModeValues: ${vals}`);
    return { status: 200 };
  }
  const res = await fetch(`${FIGMA_API}${path}`, {
    method: "POST",
    headers: { "X-Figma-Token": token, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok || json.error) throw new Error(`Figma API error ${res.status}: ${json.err ?? JSON.stringify(json)}`);
  return json;
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\nflatten-base-to-system — mode: ${DRY_RUN ? "DRY RUN" : "EXECUTE"}`);
  console.log(`batch size: ${BATCH_SIZE}\n`);

  // Load snapshot
  if (!fs.existsSync(SNAPSHOT_PATH)) {
    console.error("Snapshot not found:", SNAPSHOT_PATH);
    console.error("Run Phase A first: save pre-flatten REST snapshot.");
    process.exit(1);
  }
  const data = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, "utf8"));
  const vars = data.meta.variables;
  const cols = data.meta.variableCollections;
  const col = cols[WDS_COLLECTION_ID];
  if (!col) {
    console.error("WDS_tokens collection not found in snapshot.");
    process.exit(1);
  }

  // ── Step 1: Build variableModeValues (re-point aliases) ───────────────────

  const modeValues = [];
  const skipList = [];
  let aliasCount = 0;

  for (const id of col.variableIds) {
    const v = vars[id];
    if (!v) continue;
    if (!SYSTEM_PREFIXES.some((p) => v.name.startsWith(p))) continue;
    if (SKIP_DANGLING_NAMES.has(v.name)) {
      skipList.push(v.name);
      continue;
    }

    for (const modeId of [MODE_LIGHT, MODE_DARK]) {
      const val = v.valuesByMode[modeId] ?? Object.values(v.valuesByMode)[0];
      if (!val || val.type !== "VARIABLE_ALIAS") continue;

      const target = vars[val.id];
      if (!target || !BASE_DELETE_PREFIXES.some((p) => target.name.startsWith(p))) continue;

      const resolved = resolveValue(vars, v, modeId);
      if (resolved.type === "DANGLING" || resolved.type === "MISSING" || resolved.type === "CYCLE") {
        console.warn(`  WARN: ${v.name} [${modeId}] resolve failed (${resolved.type}) — skipping`);
        skipList.push(`${v.name}[${modeId}]`);
        continue;
      }

      modeValues.push({ variableId: v.id, modeId, value: resolved });
      aliasCount++;
    }
  }

  console.log(`aliases to re-point: ${aliasCount}`);
  console.log(`skipped: ${skipList.length} (${skipList.slice(0, 5).join(", ")}${skipList.length > 5 ? "..." : ""})`);

  // ── Step 2: Build DELETE list for base/* ──────────────────────────────────

  const deleteVars = [];
  for (const id of col.variableIds) {
    const v = vars[id];
    if (!v) continue;
    if (!BASE_DELETE_PREFIXES.some((p) => v.name.startsWith(p))) continue;
    deleteVars.push({ action: "DELETE", id: v.id });
  }
  console.log(`base vars to delete: ${deleteVars.length}`);

  // ── Step 3: Batch re-point ────────────────────────────────────────────────

  console.log("\n--- Phase B-1: re-point aliases ---");
  const modeValueBatches = chunk(modeValues, BATCH_SIZE);
  for (let i = 0; i < modeValueBatches.length; i++) {
    const batch = modeValueBatches[i];
    process.stdout.write(`  batch ${i + 1}/${modeValueBatches.length} (${batch.length} values)… `);
    await figmaPost(`/files/${BRANCH_FILE_KEY}/variables`, { variableModeValues: batch }, DRY_RUN);
    console.log("ok");
    if (!DRY_RUN) await new Promise((r) => setTimeout(r, 300)); // rate limit buffer
  }

  // ── Step 4: Batch delete base/* ───────────────────────────────────────────

  console.log("\n--- Phase B-2: delete base/* vars ---");
  const deleteBatches = chunk(deleteVars, BATCH_SIZE);
  for (let i = 0; i < deleteBatches.length; i++) {
    const batch = deleteBatches[i];
    process.stdout.write(`  batch ${i + 1}/${deleteBatches.length} (${batch.length} deletes)… `);
    await figmaPost(`/files/${BRANCH_FILE_KEY}/variables`, { variables: batch }, DRY_RUN);
    console.log("ok");
    if (!DRY_RUN) await new Promise((r) => setTimeout(r, 300));
  }

  // ── Step 5: Verify summary ────────────────────────────────────────────────

  console.log("\n--- Summary ---");
  console.log(`re-pointed: ${aliasCount} mode-values across ${new Set(modeValues.map((m) => m.variableId)).size} variables`);
  console.log(`deleted: ${DRY_RUN ? "(dry-run)" : deleteVars.length} base/* variables`);
  console.log(`skipped (dangling/manual): ${skipList.length}`);
  if (!DRY_RUN) {
    console.log("\nNext: re-fetch REST and run Phase C validation.");
    console.log("  node tools/extract-figma-color-tokens.mjs --output-dir outputs/current");
    console.log("  node tools/validate-color-token-catalog.mjs --input-dir outputs/current");
  } else {
    console.log("\nDry-run complete. Re-run with --execute to apply.");
  }
}

main().catch((err) => {
  console.error("\nFATAL:", err.message);
  process.exit(1);
});
