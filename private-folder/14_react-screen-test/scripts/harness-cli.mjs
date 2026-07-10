#!/usr/bin/env node
// Figma → React harness CLI.
// Subcommands: color-tokens | capture | normalize | diff | sync-check | populate-manifest | code-connect | build-component | extract-nodes
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = resolve(__dirname, "..");
const CC_SOURCE_DIR = resolve(ROOT, "../04_wf-figma-to-react-components/src/components");
const CC_INDEX_PATH = resolve(ROOT, "harness/code-connect-index.json");
const NODES_CACHE_DIR = resolve(ROOT, "harness");
const DEFAULT_LIMIT = 25;

const [, , cmd, ...rawArgs] = process.argv;

function parseArgs(argv) {
  const result = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) {
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith("--")) {
        result[argv[i].slice(2)] = next;
        i++;
      } else {
        result[argv[i].slice(2)] = true;
      }
    }
  }
  return result;
}

const args = parseArgs(rawArgs);

switch (cmd) {
  case "color-tokens":
    await runColorTokens(args);
    break;
  case "capture":
    await runCapture(args);
    break;
  case "normalize":
    await runNormalize(args);
    break;
  case "diff":
    await runDiff(args);
    break;
  case "sync-check":
    await runSyncCheck(args);
    break;
  case "populate-manifest":
    await runPopulateManifest(args);
    break;
  case "code-connect":
    // rawArgs[0] is the mode (index | resolve); rest are flags
    await runCodeConnect(rawArgs);
    break;
  case "build-component":
    await runBuildComponent(args);
    break;
  case "extract-nodes":
    await runExtractNodes(rawArgs);
    break;
  default:
    process.stderr.write(`Unknown command: ${cmd}\nAvailable: color-tokens | capture | normalize | diff | sync-check | populate-manifest | code-connect | build-component | extract-nodes\n`);
    process.exit(1);
}

// ── color-tokens ─────────────────────────────────────────────────────────────
// Reads src/styles/tokens.css and checks each color_region's css_var
// resolves to expected_hex. Fails if any region mismatches.
async function runColorTokens({ screen, manifest, "output-json": outputJson }) {
  if (!manifest || !existsSync(manifest)) {
    process.stderr.write(`color-tokens: manifest not found: ${manifest}\n`);
    process.exit(1);
  }

  const manifestData = JSON.parse(readFileSync(manifest, "utf8"));
  const tokensFile = resolve(ROOT, "src/styles/tokens.css");

  if (!existsSync(tokensFile)) {
    process.stderr.write(`color-tokens: tokens.css not found at ${tokensFile}\n  Run: bash scripts/sync_tokens.sh\n`);
    process.exit(1);
  }

  const tokensCss = readFileSync(tokensFile, "utf8");
  const colorRegions = manifestData.color_regions ?? [];

  if (colorRegions.length === 0) {
    console.log("color-tokens: no color_regions defined in manifest — skipping");
    return;
  }

  const results = [];
  let failed = false;

  for (const region of colorRegions) {
    const re = new RegExp(`${escapeRegex(region.css_var)}:\\s*([^;\\n]+)[;\\n]`);
    const match = tokensCss.match(re);
    const resolvedValue = match?.[1]?.trim() ?? null;
    const expectedHex = region.expected_hex ?? null;

    let pass = false;
    if (resolvedValue && expectedHex) {
      pass = resolvedValue.toLowerCase() === expectedHex.toLowerCase();
    } else if (resolvedValue && !expectedHex) {
      // No expected_hex specified: just verify the var exists
      pass = true;
    }

    if (!pass) failed = true;

    results.push({
      name: region.name,
      css_var: region.css_var,
      figma_token: region.figma_token ?? null,
      expected_hex: expectedHex,
      resolved_value: resolvedValue,
      pass,
    });

    const tag = pass ? "PASS" : "FAIL";
    console.log(`  [${tag}] ${region.name}: ${region.css_var} = ${resolvedValue ?? "(not found)"} (expected: ${expectedHex ?? "any"})`);
  }

  const report = { screen, results, pass: !failed };

  if (outputJson) {
    writeFileSync(outputJson, JSON.stringify(report, null, 2));
    console.log(`color-tokens: report → ${outputJson}`);
  }

  if (failed) {
    console.error("color-tokens: FAIL — one or more color_regions did not match");
    process.exit(1);
  }

  console.log("color-tokens: PASS");
}

// ── capture ──────────────────────────────────────────────────────────────────
// Playwright headless screenshot. Saves PNG to --output.
// Section flags (optional):
//   --scroll-y <css-px>      scroll position before capture (default: 0)
//   --capture-height <css-px> crop output to this height in CSS px (default: viewport height)
async function runCapture({ url, output, width, height, dpr, "scroll-y": scrollY, "capture-height": captureHeight }) {
  if (!url || !output) {
    process.stderr.write("capture: --url and --output are required\n");
    process.exit(1);
  }

  const { chromium } = await import("@playwright/test");

  const viewportWidth = parseInt(width ?? "393", 10);
  const viewportHeight = parseInt(height ?? "852", 10);
  const deviceScaleFactor = parseFloat(dpr ?? "2");
  const scrollYPx = scrollY ? parseInt(scrollY, 10) : 0;
  const captureHeightPx = captureHeight ? parseInt(captureHeight, 10) : viewportHeight;

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: viewportWidth, height: viewportHeight },
    deviceScaleFactor,
  });
  const page = await context.newPage();

  await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 });

  if (scrollYPx > 0) {
    await page.evaluate((y) => window.scrollTo(0, y), scrollYPx);
    await page.waitForTimeout(300); // allow reflow after scroll
  }

  await page.waitForTimeout(300);
  await page.screenshot({ path: output, fullPage: false });
  await browser.close();

  // Crop to captureHeight if smaller than viewport
  if (captureHeightPx < viewportHeight) {
    const { PNG } = await import("pngjs");
    const img = PNG.sync.read(readFileSync(output));
    const targetH = Math.round(captureHeightPx * deviceScaleFactor);
    const cropH = Math.min(img.height, targetH);
    const cropped = new PNG({ width: img.width, height: cropH });
    PNG.bitblt(img, cropped, 0, 0, img.width, cropH, 0, 0);
    writeFileSync(output, PNG.sync.write(cropped));
  }

  console.log(`capture: ${url} scroll=${scrollYPx}px → ${output} (${viewportWidth}x${captureHeightPx} @${deviceScaleFactor}x)`);
}

// ── normalize ────────────────────────────────────────────────────────────────
// Aligns browser screenshot to Figma screenshot dimensions.
// Section mode: --section-scroll-y + --section-height crop the Figma full-page
// screenshot to the matching section, so both images have the same region.
//
//   Standard:  normalize(figma-full, browser-full) → browser cropped to viewport size
//   Section:   normalize(figma-full, browser-section, --section-scroll-y 852 --section-height 852)
//              → figma cropped from y=852 h=852; browser already pre-cropped by capture
async function runNormalize({
  figma,
  "browser-full": browserFull,
  output,
  "output-report": outputReport,
  manifest: manifestPath,
  "section-scroll-y": sectionScrollY,
  "section-height": sectionHeight,
}) {
  if (!figma || !browserFull || !output) {
    process.stderr.write("normalize: --figma, --browser-full, and --output are required\n");
    process.exit(1);
  }

  const { PNG } = await import("pngjs");

  const figmaData = PNG.sync.read(readFileSync(figma));
  const browserData = PNG.sync.read(readFileSync(browserFull));

  const manifest = manifestPath && existsSync(manifestPath)
    ? JSON.parse(readFileSync(manifestPath, "utf8"))
    : null;

  const dpr = manifest?.viewport?.deviceScaleFactor ?? 2;
  const viewportW = manifest?.viewport?.width ?? 393;
  // Auto-detect Figma DPR from PNG width vs CSS viewport width.
  // Figma MCP may export at 1x even when the browser runs at 2x.
  const figmaDpr = figmaData.width / viewportW; // e.g. 1.0 for 1x, 2.0 for 2x
  const targetWidth = Math.round(viewportW * dpr); // browser-resolution output

  let outputImg;

  if (sectionScrollY !== undefined && sectionHeight !== undefined) {
    // Section mode: crop Figma full screenshot to the section band,
    // then match browser screenshot (already captured at that scroll pos).
    // Use figmaDpr for Figma crop coords (may differ from browser dpr).
    const scrollY = parseInt(sectionScrollY, 10);
    const sectH = parseInt(sectionHeight, 10);

    const figmaScrollPx = Math.round(scrollY * figmaDpr);
    const figmaSectHPx = Math.round(sectH * figmaDpr);
    const figmaCropH = Math.min(figmaSectHPx, Math.max(0, figmaData.height - figmaScrollPx));

    const browserScrollPx = 0; // browser already captured at this scroll pos
    const browserSectHPx = Math.round(sectH * dpr);
    const browserH = Math.min(browserData.height, browserSectHPx);

    // Target is browser-resolution so diff regions work with manifest dpr
    const targetH = Math.min(Math.round(figmaCropH * (dpr / figmaDpr)), browserH);

    // Crop Figma to section at its native DPR
    const figmaSection1x = new PNG({ width: figmaData.width, height: figmaCropH });
    figmaSection1x.data.fill(255);
    if (figmaCropH > 0) {
      PNG.bitblt(figmaData, figmaSection1x, 0, figmaScrollPx, figmaData.width, figmaCropH, 0, 0);
    }

    // Upscale figma crop to browser DPR (nearest-neighbor) if DPRs differ
    const scale = dpr / figmaDpr;
    const figmaOutW = Math.round(figmaSection1x.width * scale);
    const figmaOutH = Math.round(figmaSection1x.height * scale);
    const figmaSection = new PNG({ width: figmaOutW, height: figmaOutH });
    figmaSection.data.fill(255);
    if (Math.abs(scale - 1) < 0.01) {
      PNG.bitblt(figmaSection1x, figmaSection, 0, 0, figmaSection1x.width, figmaSection1x.height, 0, 0);
    } else {
      const sr = Math.round(scale);
      for (let y = 0; y < figmaSection1x.height; y++) {
        for (let x = 0; x < figmaSection1x.width; x++) {
          const si = (y * figmaSection1x.width + x) * 4;
          for (let dy = 0; dy < sr; dy++) {
            for (let dx = 0; dx < sr; dx++) {
              const di = ((y * sr + dy) * figmaOutW + (x * sr + dx)) * 4;
              figmaSection.data[di] = figmaSection1x.data[si];
              figmaSection.data[di + 1] = figmaSection1x.data[si + 1];
              figmaSection.data[di + 2] = figmaSection1x.data[si + 2];
              figmaSection.data[di + 3] = figmaSection1x.data[si + 3];
            }
          }
        }
      }
    }
    writeFileSync(output.replace(/\.png$/, "-figma-section.png"), PNG.sync.write(figmaSection));

    // Align browser to same height (already at browser DPR)
    outputImg = new PNG({ width: targetWidth, height: targetH });
    outputImg.data.fill(255);
    PNG.bitblt(browserData, outputImg, 0, 0, Math.min(browserData.width, targetWidth), targetH, 0, 0);

    console.log(`normalize(section): figma[dpr=${figmaDpr} y=${figmaScrollPx}px h=${figmaCropH}px →${figmaOutW}x${figmaOutH}] + browser[h=${browserH}px] → ${targetWidth}x${targetH} (${output})`);

    if (outputReport) {
      writeFileSync(outputReport, JSON.stringify({
        mode: "section",
        section_scroll_y: scrollY,
        section_height: sectH,
        figma_dpr: figmaDpr,
        browser_dpr: dpr,
        figma_full: { width: figmaData.width, height: figmaData.height },
        figma_section_native: { width: figmaData.width, height: figmaCropH, offset_y: figmaScrollPx },
        figma_section_scaled: { width: figmaOutW, height: figmaOutH },
        browser: { width: browserData.width, height: browserH },
        output: { width: targetWidth, height: targetH },
      }, null, 2));
    }
  } else {
    // Standard mode: crop browser to viewport size
    const targetHeight = manifest ? Math.round(manifest.viewport.height * dpr) : figmaData.height;
    const cropW = Math.min(browserData.width, targetWidth);
    const cropH = Math.min(browserData.height, targetHeight);

    outputImg = new PNG({ width: targetWidth, height: targetHeight });
    outputImg.data.fill(255);
    PNG.bitblt(browserData, outputImg, 0, 0, cropW, cropH, 0, 0);

    console.log(`normalize: ${browserData.width}x${browserData.height} → ${targetWidth}x${targetHeight} (${output})`);

    if (outputReport) {
      writeFileSync(outputReport, JSON.stringify({
        mode: "standard",
        dpr,
        figma: { width: figmaData.width, height: figmaData.height },
        browser_full: { width: browserData.width, height: browserData.height },
        cropped: { width: targetWidth, height: targetHeight },
      }, null, 2));
    }
  }

  writeFileSync(output, PNG.sync.write(outputImg));
}

// ── diff ─────────────────────────────────────────────────────────────────────
// Pixelmatch diff with critical_regions support.
async function runDiff({
  screen,
  figma,
  browser,
  manifest: manifestPath,
  "output-json": outputJson,
  "output-diff": outputDiff,
  "output": outputAlias,
  threshold,
  loop,
  "max-loops": maxLoops,
  "section-scroll-y": sectionScrollY,
  "section-height": sectionHeight,
}) {
  if (!figma || !browser || !manifestPath) {
    process.stderr.write("diff: --figma, --browser, and --manifest are required\n");
    process.exit(1);
  }

  const { PNG } = await import("pngjs");
  const pixelmatch = (await import("pixelmatch")).default;

  const manifestData = JSON.parse(readFileSync(manifestPath, "utf8"));
  const thresholdValue = parseFloat(threshold ?? "95");
  const loopNum = parseInt(loop ?? "1", 10);
  const maxLoopsNum = parseInt(maxLoops ?? "5", 10);
  const dpr = manifestData.viewport?.deviceScaleFactor ?? 2;
  // If section mode, derive scroll from manifest section entry or explicit flag
  const scrollY = sectionScrollY !== undefined ? parseInt(sectionScrollY, 10) : 0;
  const sectH = sectionHeight !== undefined ? parseInt(sectionHeight, 10) : Infinity;

  // Adjust a full-frame CSS rect to section-relative pixel coords.
  // Returns null if the region doesn't overlap this section.
  function sectionRect([rx, ry, rw, rh]) {
    const sectionTop = scrollY;
    const sectionBot = scrollY + sectH;
    const regTop = ry;
    const regBot = ry + rh;
    const overlapTop = Math.max(sectionTop, regTop);
    const overlapBot = Math.min(sectionBot, regBot);
    if (overlapTop >= overlapBot) return null; // no overlap
    const adjY = overlapTop - sectionTop;
    const adjH = overlapBot - overlapTop;
    return [rx, adjY, rw, adjH].map((v) => Math.round(v * dpr));
  }

  const figmaImg = PNG.sync.read(readFileSync(figma));
  const browserImg = PNG.sync.read(readFileSync(browser));

  const width = Math.min(figmaImg.width, browserImg.width);
  const height = Math.min(figmaImg.height, browserImg.height);

  // Resize data buffers if needed
  const figmaBuf = cropBuffer(figmaImg, width, height);
  const browserBuf = cropBuffer(browserImg, width, height);
  const diffPng = new PNG({ width, height });

  // Apply mask_regions (zero out pixels in both images so they're identical)
  for (const region of manifestData.mask_regions ?? []) {
    const adj = sectionRect(region.rect);
    if (!adj) continue;
    const [rx, ry, rw, rh] = adj;
    zeroRegion(figmaBuf, width, rx, ry, rw, rh);
    zeroRegion(browserBuf, width, rx, ry, rw, rh);
  }

  const numDiffPixels = pixelmatch(figmaBuf, browserBuf, diffPng.data, width, height, {
    threshold: 0.1,
    includeAA: false,
  });

  const totalPixels = width * height;
  const globalScore = Math.round(((totalPixels - numDiffPixels) / totalPixels) * 100);

  // critical_regions
  const criticalResults = [];
  for (const region of manifestData.critical_regions ?? []) {
    const adj = sectionRect(region.rect);
    if (!adj) continue; // region not in this section
    const [rx, ry, rw, rh] = adj;
    const safeW = Math.min(rw, width - rx);
    const safeH = Math.min(rh, height - ry);
    if (safeW <= 0 || safeH <= 0) continue;

    const figmaRegion = extractRegion(figmaBuf, width, rx, ry, safeW, safeH);
    const browserRegion = extractRegion(browserBuf, width, rx, ry, safeW, safeH);
    const regionDiff = new Uint8Array(safeW * safeH * 4);
    const regionDiffPixels = pixelmatch(figmaRegion, browserRegion, regionDiff, safeW, safeH, {
      threshold: 0.1,
    });
    const regionScore = Math.round(((safeW * safeH - regionDiffPixels) / (safeW * safeH)) * 100);
    const minScore = region.min_score ?? 95;
    const pass = regionScore >= minScore;
    criticalResults.push({ name: region.name, score: regionScore, min_score: minScore, pass });
  }

  const allCriticalPass = criticalResults.every((r) => r.pass);
  const globalPass = globalScore >= thresholdValue;
  const pass = globalPass && allCriticalPass;

  const report = {
    screen,
    loop: loopNum,
    max_loops: maxLoopsNum,
    global_score: globalScore,
    threshold: thresholdValue,
    global_pass: globalPass,
    critical_regions: criticalResults,
    all_critical_pass: allCriticalPass,
    pass,
  };

  if (outputJson) writeFileSync(outputJson, JSON.stringify(report, null, 2));
  const diffOutPath = outputDiff || outputAlias;
  if (diffOutPath) writeFileSync(diffOutPath, PNG.sync.write(diffPng));

  console.log(`diff: score=${globalScore} threshold=${thresholdValue} loop=${loopNum}/${maxLoopsNum}`);
  for (const r of criticalResults) {
    console.log(`  [${r.pass ? "PASS" : "FAIL"}] ${r.name}: ${r.score}/${r.min_score}`);
  }

  if (!pass) {
    if (loopNum >= maxLoopsNum) {
      console.error(`diff: FAIL after ${maxLoopsNum} loops — global=${globalScore} threshold=${thresholdValue}`);
    } else {
      console.log(`diff: score=${globalScore} < ${thresholdValue} (loop ${loopNum}/${maxLoopsNum}) — fix and retry`);
    }
    process.exit(1);
  }

  console.log("diff: PASS");
}

// ── sync-check ───────────────────────────────────────────────────────────────
// Reads the latest sync-figma-token dry-run report from /tmp and checks drift.
// Exit 0: clean (all counts zero). Exit 1: drift detected. Exit 2: no report / stale.
//
// sync-figma-token report path: /tmp/sync-figma-token-dry-run-{runId}.json
// Summary fields: create | update | aliasFix | scopeFix | syntaxFix | archive | delete
async function runSyncCheck({ report, "max-age-minutes": maxAgeStr, "output-json": outputJson }) {
  const maxAgeMs = parseFloat(maxAgeStr ?? "60") * 60 * 1000;

  let reportPath = report ?? null;

  if (!reportPath) {
    // Find latest /tmp/sync-figma-token-dry-run-*.json
    try {
      const files = readdirSync("/tmp")
        .filter((f) => f.startsWith("sync-figma-token-dry-run-") && f.endsWith(".json"))
        .map((f) => ({ name: f, mtime: statSync(`/tmp/${f}`).mtimeMs }))
        .sort((a, b) => b.mtime - a.mtime);

      if (files.length > 0) {
        reportPath = `/tmp/${files[0].name}`;
        const ageMs = Date.now() - files[0].mtime;
        if (ageMs > maxAgeMs) {
          console.warn(
            `sync-check: STALE — report is ${Math.round(ageMs / 60000)}min old (max: ${Math.round(maxAgeMs / 60000)}min)\n  ${reportPath}\n  Run /sync-figma-token to get a fresh dry-run report.`
          );
          process.exit(2);
        }
      }
    } catch {
      // /tmp not readable
    }
  }

  if (!reportPath || !existsSync(reportPath)) {
    console.warn(
      "sync-check: NO REPORT — no sync-figma-token dry-run report found in /tmp.\n" +
      "  Run /sync-figma-token (dry-run, code_to_figma direction) before implementing screens.\n" +
      "  Set SKIP_SYNC_CHECK=1 to bypass this gate."
    );
    process.exit(2);
  }

  const data = JSON.parse(readFileSync(reportPath, "utf8"));
  const summary = data.summary ?? data; // some versions put counts at root
  const DRIFT_KEYS = ["create", "update", "aliasFix", "scopeFix", "syntaxFix", "archive", "delete"];
  const totalDrift = DRIFT_KEYS.reduce((sum, k) => sum + (summary[k] ?? 0), 0);

  if (outputJson) writeFileSync(outputJson, JSON.stringify({ reportPath, summary, totalDrift, pass: totalDrift === 0 }, null, 2));

  if (totalDrift > 0) {
    console.error(`sync-check: DRIFT DETECTED — ${totalDrift} token(s) out of sync`);
    for (const k of DRIFT_KEYS) {
      if (summary[k]) console.error(`  ${k}: ${summary[k]}`);
    }
    if (data.drift?.length) {
      console.error("  First 5 drifted tokens:");
      for (const item of data.drift.slice(0, 5)) {
        console.error(`    ${item.key}: ${item.category ?? "drift"}`);
      }
    }
    console.error("  Fix drift with /sync-figma-token (apply), then re-run harness.");
    process.exit(1);
  }

  console.log(`sync-check: PASS — tokens in sync (${reportPath})`);
}

// ── populate-manifest ─────────────────────────────────────────────────────────
// Auto-fills color_regions[].expected_hex from committed tokens.css.
// Only fills missing/empty values unless --force is set.
//
// Usage:
//   node scripts/harness-cli.mjs populate-manifest --manifest harness/my-screen-diff-manifest.json
//   node scripts/harness-cli.mjs populate-manifest --manifest ... --force --dry-run
async function runPopulateManifest({ manifest, "tokens-css": tokensCssPath, force, "dry-run": dryRun }) {
  if (!manifest) {
    process.stderr.write("populate-manifest: --manifest is required\n");
    process.exit(1);
  }
  if (!existsSync(manifest)) {
    process.stderr.write(`populate-manifest: manifest not found: ${manifest}\n`);
    process.exit(1);
  }

  const tokensFile = tokensCssPath ?? resolve(ROOT, "src/styles/tokens.css");
  if (!existsSync(tokensFile)) {
    process.stderr.write(`populate-manifest: tokens.css not found: ${tokensFile}\n  Run: bash scripts/sync_tokens.sh\n`);
    process.exit(1);
  }

  const tokensCss = readFileSync(tokensFile, "utf8");
  const manifestData = JSON.parse(readFileSync(manifest, "utf8"));
  const colorRegions = manifestData.color_regions ?? [];

  if (colorRegions.length === 0) {
    console.log("populate-manifest: no color_regions in manifest — nothing to do");
    return;
  }

  let updated = 0;
  let skipped = 0;

  for (const region of colorRegions) {
    if (!region.css_var) continue;
    if (region.expected_hex && !force) {
      skipped++;
      continue;
    }

    const re = new RegExp(`${escapeRegex(region.css_var)}:\\s*([^;\\n]+)[;\\n]`);
    const match = tokensCss.match(re);
    const value = match?.[1]?.trim() ?? null;

    if (!value) {
      console.warn(`  [SKIP] ${region.name}: ${region.css_var} not found in tokens.css`);
      continue;
    }

    if (dryRun) {
      console.log(`  [DRY]  ${region.name}: would set expected_hex = ${value}`);
    } else {
      region.expected_hex = value;
      console.log(`  [SET]  ${region.name}: expected_hex = ${value}`);
    }
    updated++;
  }

  if (!dryRun && updated > 0) {
    writeFileSync(manifest, JSON.stringify(manifestData, null, 2) + "\n");
    console.log(`populate-manifest: ${updated} region(s) updated, ${skipped} skipped → ${manifest}`);
  } else {
    console.log(`populate-manifest: ${updated} region(s) would be updated, ${skipped} skipped (dry-run)`);
  }
}

// ── code-connect ─────────────────────────────────────────────────────────────
// Local-first Code Connect index built from *.figma.tsx files in 04_wf.
// Usage:
//   node scripts/harness-cli.mjs code-connect index [--output harness/code-connect-index.json]
//   node scripts/harness-cli.mjs code-connect resolve --node-id 59869-78921 [--file-key XXXX]

async function runCodeConnect(rawArgs) {
  const [mode, ...rest] = rawArgs;
  const modeArgs = parseArgs(rest);

  switch (mode) {
    case "index":
      await runCodeConnectIndex(modeArgs);
      break;
    case "resolve":
      await runCodeConnectResolve(modeArgs);
      break;
    default:
      process.stderr.write(
        `code-connect: unknown mode "${mode ?? "(none)"}". Use: index | resolve\n`
      );
      process.exit(1);
  }
}

// Scan all *.figma.tsx files and build harness/code-connect-index.json
async function runCodeConnectIndex({ output, "source": source }) {
  if (source === "mcp") {
    process.stderr.write("code-connect index --source mcp: not yet implemented (Figma CC not published). Omit --source to use local files.\n");
    process.exit(1);
  }

  if (!existsSync(CC_SOURCE_DIR)) {
    process.stderr.write(`code-connect index: component dir not found:\n  ${CC_SOURCE_DIR}\n`);
    process.exit(1);
  }

  const figmaTsxFiles = [];

  // Walk one level: src/components/<Name>/<Name>.figma.tsx
  for (const entry of readdirSync(CC_SOURCE_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const candidate = resolve(CC_SOURCE_DIR, entry.name, `${entry.name}.figma.tsx`);
    if (existsSync(candidate)) figmaTsxFiles.push(candidate);
  }

  if (figmaTsxFiles.length === 0) {
    process.stderr.write(`code-connect index: no *.figma.tsx files found in ${CC_SOURCE_DIR}\n`);
    process.exit(1);
  }

  // Build index: { [fileKey]: { [nodeId]: mapping } }
  const index = {};
  const errors = [];

  for (const filePath of figmaTsxFiles) {
    const content = readFileSync(filePath, "utf8");
    const parsed = parseCodeConnectFile(content, filePath);

    if (!parsed) {
      errors.push(`  SKIP (parse failed): ${filePath}`);
      continue;
    }

    const { componentName, figmaUrl, fileKey, nodeId, props } = parsed;

    if (!index[fileKey]) index[fileKey] = {};
    index[fileKey][nodeId] = {
      component: componentName,
      import: "@chord-ds/components",
      figma_url: figmaUrl,
      props,
    };
  }

  if (errors.length) {
    console.warn("code-connect index: parse warnings:");
    for (const e of errors) console.warn(e);
  }

  const outPath = output ?? CC_INDEX_PATH;
  writeFileSync(outPath, JSON.stringify(index, null, 2) + "\n");

  const total = Object.values(index).flatMap(Object.values).length;
  console.log(`code-connect index: ${total} component(s) indexed → ${outPath}`);
  if (errors.length) console.warn(`  ${errors.length} file(s) skipped (see above)`);
}

// Resolve a single Figma node-id → component mapping (hard fail on miss)
async function runCodeConnectResolve({ "node-id": rawNodeId, "file-key": fileKey, "output-json": outputJson }) {
  if (!rawNodeId) {
    process.stderr.write("code-connect resolve: --node-id is required\n");
    process.exit(1);
  }

  if (!existsSync(CC_INDEX_PATH)) {
    process.stderr.write(
      `code-connect resolve: index not found (${CC_INDEX_PATH})\n  Run: node scripts/harness-cli.mjs code-connect index\n`
    );
    process.exit(1);
  }

  const index = JSON.parse(readFileSync(CC_INDEX_PATH, "utf8"));

  // Normalize node-id: accept both "59869-78921" and "59869:78921"
  const nodeIdColon = rawNodeId.replace("-", ":");
  const nodeIdDash = rawNodeId.replace(":", "-");

  let found = null;
  let foundFileKey = null;

  const targetFileKeys = fileKey ? [fileKey] : Object.keys(index);

  for (const fk of targetFileKeys) {
    const fkIndex = index[fk];
    if (!fkIndex) continue;
    const hit = fkIndex[nodeIdColon] ?? fkIndex[nodeIdDash];
    if (hit) {
      found = hit;
      foundFileKey = fk;
      break;
    }
  }

  // Fallback: search nodes caches for an instance whose id matches → use its mainComponentId
  if (!found) {
    const { readdirSync: rds } = await import("node:fs");
    const cacheFiles = rds(NODES_CACHE_DIR).filter(f => f.endsWith("-nodes.json"));
    for (const cf of cacheFiles) {
      const cache = JSON.parse(readFileSync(resolve(NODES_CACHE_DIR, cf), "utf8"));
      const skipped = cache.dsInstancesSkipped ?? [];
      const entry = skipped.find(s => s.id === nodeIdColon || s.id === nodeIdDash);
      if (entry?.mainComponentId) {
        const mcIdColon = entry.mainComponentId.replace("-", ":");
        const mcIdDash   = entry.mainComponentId.replace(":", "-");
        for (const fk of Object.keys(index)) {
          const hit = index[fk][mcIdColon] ?? index[fk][mcIdDash];
          if (hit) {
            found = { ...hit, _resolvedViaMainComponent: entry.mainComponentId };
            foundFileKey = fk;
            break;
          }
        }
        if (found) break;
      }
    }
  }

  if (!found) {
    const availableFileKeys = Object.keys(index);
    const allNodeIds = availableFileKeys.flatMap((fk) => Object.keys(index[fk]));
    // Suggest nearest by prefix (first 4 chars)
    const prefix = rawNodeId.slice(0, 4);
    const nearest = allNodeIds.filter((id) => id.startsWith(prefix)).slice(0, 5);

    const fkHint = fileKey ? ` --file-key ${fileKey}` : " --file-key <figma-file-key>";
    process.stderr.write(
      `code-connect resolve: FAIL — node-id "${rawNodeId}" not found in index.\n\n` +
      `  Available file keys: ${availableFileKeys.join(", ")}\n` +
      (nearest.length ? `  Nearest node-ids (prefix "${prefix}"): ${nearest.join(", ")}\n` : "") +
      `\n  Resolution paths (in priority order):\n` +
      `  1. Build into DS (preferred for reusable components):\n` +
      `       node scripts/harness-cli.mjs build-component --node-id ${rawNodeId}${fkHint} --name <PascalName>\n` +
      `     Then re-run: node scripts/harness-cli.mjs code-connect index\n` +
      `  2. Local composition (screen-specific only — inline JSX, no DS file).\n` +
      `  3. Document gap: harness/<screen>-component-gaps.md\n` +
      `  Justify chosen path in one line before proceeding.\n`
    );
    process.exit(1);
  }

  const result = { fileKey: foundFileKey, nodeId: nodeIdColon, ...found };
  const json = JSON.stringify(result, null, 2);

  if (outputJson) writeFileSync(outputJson, json + "\n");
  console.log(json);
}

// Parse a *.figma.tsx file and extract component name, Figma URL, and props
function parseCodeConnectFile(content, filePath) {
  try {
    // Component name: import { ComponentName } from "./ComponentName"
    const importMatch = content.match(/import\s+\{\s*(\w+)\s*\}.*?from\s+["']\.\/\w+["']/s);
    const componentName = importMatch?.[1];
    if (!componentName) return null;

    // Figma URL: second arg to figma.connect()
    const urlMatch = content.match(/figma\.connect\(\s*\w+,\s*\n?\s*["']([^"']+)["']/);
    const figmaUrl = urlMatch?.[1];
    if (!figmaUrl) return null;

    // Parse URL for fileKey and nodeId
    const urlObj = new URL(figmaUrl);
    const pathParts = urlObj.pathname.split("/").filter(Boolean);
    // pathname: /design/{fileKey}/...  or  /file/{fileKey}/...
    const fileKey = pathParts[1];
    const rawNodeId = urlObj.searchParams.get("node-id") ?? "";
    // Normalize to colon format: "59869-78921" → "59869:78921"
    const nodeId = rawNodeId.replace("-", ":");
    if (!fileKey || !nodeId) return null;

    // Props: extract the block between "props: {" and "example:"
    const propsBlockMatch = content.match(/\bprops\s*:\s*\{([\s\S]*?)\},?\s*\n\s*(?:\/\/[^\n]*)?\s*example\s*:/);
    const propsStr = propsBlockMatch?.[1] ?? "";

    const props = {};

    // figma.enum("FigmaProp", { Key: "val", "Key Spaced": "val2" })
    const enumRe = /(\w+)\s*:\s*figma\.enum\(\s*["']([^"']+)["']\s*,\s*\{([^}]+)\}/g;
    for (const m of propsStr.matchAll(enumRe)) {
      const [, reactProp, figmaProp, valuesStr] = m;
      const values = {};
      // Match both `Key: "val"` and `"Key Spaced": "val"`
      const valueRe = /(?:["']([^"']+)["']|(\b\w+\b))\s*:\s*["']([^"']+)["']/g;
      for (const vm of valuesStr.matchAll(valueRe)) {
        const key = vm[1] ?? vm[2]; // quoted or bare key
        // Skip keys that are escape sequences like \b artifacts
        if (key && !key.startsWith("\\")) values[key] = vm[3];
      }
      props[figmaProp] = { type: "enum", react_prop: reactProp, values };
    }

    // figma.boolean("FigmaProp")
    const boolRe = /(\w+)\s*:\s*figma\.boolean\(\s*["']([^"']+)["']\s*\)/g;
    for (const m of propsStr.matchAll(boolRe)) {
      props[m[2]] = { type: "boolean", react_prop: m[1] };
    }

    // figma.string("FigmaProp")
    const strRe = /(\w+)\s*:\s*figma\.string\(\s*["']([^"']+)["']\s*\)/g;
    for (const m of propsStr.matchAll(strRe)) {
      props[m[2]] = { type: "string", react_prop: m[1] };
    }

    return { componentName, figmaUrl, fileKey, nodeId, props };
  } catch (err) {
    process.stderr.write(`  parse error in ${filePath}: ${err.message}\n`);
    return null;
  }
}

// ── build-component ──────────────────────────────────────────────────────────
// Scaffolds a new DS component into 04_wf-figma-to-react-components.
// Usage: node scripts/harness-cli.mjs build-component \
//          --node-id <id> --name <PascalName> --file-key <key> \
//          [--figma-vars "var1, var2"] [--props-json '[...]'] [--dry-run]
//
// --props-json format (array):
//   [{"figmaProp":"Mode","reactProp":"mode","type":"enum","values":{"Default":"default"}},
//    {"figmaProp":"Marquee","reactProp":"marquee","type":"boolean"},
//    {"figmaProp":"Label","reactProp":"label","type":"string"}]
async function runBuildComponent({
  "node-id": rawNodeId,
  "file-key": fileKey,
  name: NAME,
  "figma-vars": figmaVarsRaw,
  "props-json": propsJsonRaw,
  "dry-run": dryRun,
}) {
  if (!rawNodeId) { process.stderr.write("build-component: --node-id is required\n"); process.exit(1); }
  if (!NAME) { process.stderr.write("build-component: --name <PascalName> is required\n"); process.exit(1); }
  if (!/^[A-Z][A-Za-z0-9]+$/.test(NAME)) {
    process.stderr.write(`build-component: --name must be PascalCase (got "${NAME}")\n`); process.exit(1);
  }

  const DS_COMPONENTS = resolve(ROOT, "../04_wf-figma-to-react-components/src/components");
  const DS_INDEX = resolve(DS_COMPONENTS, "index.ts");
  const TARGET_DIR = resolve(DS_COMPONENTS, NAME);

  if (existsSync(TARGET_DIR)) {
    process.stderr.write(`build-component: ABORT — ${TARGET_DIR} already exists. Pick a different --name or delete first.\n`);
    process.exit(1);
  }

  if (!existsSync(DS_COMPONENTS)) {
    process.stderr.write(`build-component: DS components dir not found: ${DS_COMPONENTS}\n`);
    process.exit(1);
  }

  // Derive kebab-case from PascalCase: TopNavigation → top-navigation
  const NAME_KEBAB = NAME.replace(/([A-Z])/g, (m, c, i) => (i === 0 ? c : `-${c}`)).toLowerCase();

  const nodeIdColon = rawNodeId.replace("-", ":");
  const FIGMA_URL = fileKey
    ? `https://www.figma.com/design/${fileKey}?node-id=${nodeIdColon.replace(":", "-")}`
    : `https://www.figma.com/design/<FILE_KEY>?node-id=${nodeIdColon.replace(":", "-")}`;

  // Parse props
  let props = [];
  if (propsJsonRaw) {
    try { props = JSON.parse(propsJsonRaw); }
    catch (e) { process.stderr.write(`build-component: invalid --props-json: ${e.message}\n`); process.exit(1); }
  }

  const figmaVars = figmaVarsRaw ? figmaVarsRaw.split(",").map((v) => v.trim()).filter(Boolean) : [];

  // ── generate substitution values ─────────────────────────────────────────
  const FIGMA_VARS = figmaVars.length
    ? figmaVars.map((v) => `   ${v}`).join("\n")
    : "   (none — run get_variable_defs on this node and pass via --figma-vars)";

  // PROPS_BLOCK for figma.tsx
  const PROPS_BLOCK = props.length
    ? props.map((p) => {
        if (p.type === "enum") {
          const entries = Object.entries(p.values ?? {}).map(([k, v]) => `${JSON.stringify(k)}: ${JSON.stringify(v)}`).join(", ");
          return `      ${p.reactProp}: figma.enum(${JSON.stringify(p.figmaProp)}, { ${entries} }),`;
        }
        if (p.type === "boolean") return `      ${p.reactProp}: figma.boolean(${JSON.stringify(p.figmaProp)}),`;
        if (p.type === "string") return `      ${p.reactProp}: figma.string(${JSON.stringify(p.figmaProp)}),`;
        return `      // unknown prop type: ${JSON.stringify(p)}`;
      }).join("\n")
    : `      // TODO: add figma.enum / figma.boolean / figma.string props\n      //   from get_design_context on node ${rawNodeId}`;

  const reactProps = props.map((p) => p.reactProp).filter(Boolean);
  const EXAMPLE_PARAMS = reactProps.length ? `({ ${reactProps.join(", ")} })` : `(_props)`;
  const EXAMPLE_ATTRS = reactProps.map((p) => `${p}={${p}}`).join(" ");

  // ARGTYPES_BLOCK for stories.tsx
  function argtypeEntry(p) {
    if (p.type === "enum") {
      const opts = Object.values(p.values ?? {}).map((v) => JSON.stringify(v)).join(", ");
      const ctrl = Object.values(p.values ?? {}).length <= 3 ? "inline-radio" : "select";
      return `  ${p.reactProp}: { control: { type: ${JSON.stringify(ctrl)} }, options: [${opts}] },`;
    }
    if (p.type === "boolean") return `  ${p.reactProp}: { control: { type: "boolean" } },`;
    if (p.type === "string") return `  ${p.reactProp}: { control: { type: "text" } },`;
    return "";
  }
  const argtypeLines = props.map(argtypeEntry).filter(Boolean);
  const ARGTYPES_BLOCK = argtypeLines.length
    ? `const argTypes = {\n${argtypeLines.join("\n")}\n} as const;`
    : `const argTypes = {} as const; // TODO: add controls from Figma props`;

  // ARGTYPES_KEYS for stories.test.ts
  const sortedKeys = reactProps.slice().sort();
  const ARGTYPES_KEYS = sortedKeys.length
    ? sortedKeys.map((k) => `      ${JSON.stringify(k)},`).join("\n")
    : `      // (no props yet)`;

  // ── template substitution ─────────────────────────────────────────────────
  const TMPL_DIR = resolve(__dirname, "templates/component");
  const files = [
    { tmpl: "Name.tsx.tmpl",            out: `${NAME}.tsx` },
    { tmpl: "Name.css.tmpl",            out: `${NAME}.css` },
    { tmpl: "Name.stories.tsx.tmpl",    out: `${NAME}.stories.tsx` },
    { tmpl: "Name.stories.test.ts.tmpl",out: `${NAME}.stories.test.ts` },
    { tmpl: "Name.test.tsx.tmpl",       out: `${NAME}.test.tsx` },
    { tmpl: "Name.figma.tsx.tmpl",      out: `${NAME}.figma.tsx` },
  ];

  function applyTemplate(content) {
    return content
      .replace(/\{\{NAME\}\}/g, NAME)
      .replace(/\{\{NAME_KEBAB\}\}/g, NAME_KEBAB)
      .replace(/\{\{NODE_ID\}\}/g, rawNodeId)
      .replace(/\{\{FIGMA_URL\}\}/g, FIGMA_URL)
      .replace(/\{\{FIGMA_VARS\}\}/g, FIGMA_VARS)
      .replace(/\{\{PROPS_BLOCK\}\}/g, PROPS_BLOCK)
      .replace(/\{\{EXAMPLE_PARAMS\}\}/g, EXAMPLE_PARAMS)
      .replace(/\{\{EXAMPLE_ATTRS\}\}/g, EXAMPLE_ATTRS)
      .replace(/\{\{ARGTYPES_BLOCK\}\}/g, ARGTYPES_BLOCK)
      .replace(/\{\{ARGTYPES_KEYS\}\}/g, ARGTYPES_KEYS);
  }

  const BARREL_LINE = `export * from "./${NAME}/${NAME}";\n`;

  // Check barrel for existing export (idempotency guard used in dry-run too)
  const existingBarrel = existsSync(DS_INDEX) ? readFileSync(DS_INDEX, "utf8") : "";
  const barrelAlreadyHas = existingBarrel.includes(`"./${NAME}/${NAME}"`);

  console.log(`build-component: scaffolding ${NAME} (node ${rawNodeId})`);
  console.log(`  target dir: ${TARGET_DIR}`);
  console.log(`  kebab:      chord-${NAME_KEBAB}`);
  console.log(`  figma url:  ${FIGMA_URL}`);
  console.log(`  props:      ${props.length} (${props.map((p) => p.reactProp).join(", ") || "none"})`);
  console.log(`  dry-run:    ${dryRun ? "yes" : "no"}`);
  console.log("");

  for (const { tmpl, out } of files) {
    const tmplPath = resolve(TMPL_DIR, tmpl);
    if (!existsSync(tmplPath)) {
      process.stderr.write(`build-component: template not found: ${tmplPath}\n`);
      process.exit(1);
    }
    const content = applyTemplate(readFileSync(tmplPath, "utf8"));
    const outPath = resolve(TARGET_DIR, out);
    if (dryRun) {
      console.log(`  [dry-run] WRITE ${outPath} (${content.length} bytes)`);
    } else {
      if (!existsSync(TARGET_DIR)) mkdirSync(TARGET_DIR, { recursive: true });
      writeFileSync(outPath, content);
      console.log(`  WRITE ${out}`);
    }
  }

  // Barrel append
  if (barrelAlreadyHas) {
    console.log(`  SKIP barrel (already has "./${NAME}/${NAME}")`);
  } else if (dryRun) {
    console.log(`  [dry-run] APPEND ${DS_INDEX}: ${BARREL_LINE.trim()}`);
  } else {
    // Insert alphabetically before the chord-icons line (always last)
    const lines = existingBarrel.split("\n");
    const iconsIdx = lines.findIndex((l) => l.includes("chord-icons"));
    const insertIdx = iconsIdx >= 0 ? iconsIdx : lines.length;
    lines.splice(insertIdx, 0, BARREL_LINE.trimEnd());
    writeFileSync(DS_INDEX, lines.join("\n"));
    console.log(`  APPEND ${DS_INDEX}: ${BARREL_LINE.trim()}`);
  }

  console.log("");
  if (dryRun) {
    console.log("build-component: dry-run complete. Drop --dry-run to write.");
  } else {
    console.log("build-component: scaffold complete.");
    console.log(`\nNext steps:`);
    console.log(`  1. Fill JSX+CSS in ${TARGET_DIR}/${NAME}.tsx and ${NAME}.css`);
    console.log(`     Use Figma MCP get_design_context --node-id ${rawNodeId}`);
    console.log(`  2. cd ../04_wf-figma-to-react-components && npm test -- --run src/components/${NAME}`);
    console.log(`  3. cd ../14_react-screen-test && node scripts/harness-cli.mjs code-connect index`);
    console.log(`  4. node scripts/harness-cli.mjs code-connect resolve --node-id ${rawNodeId}`);
  }
}

// ── extract-nodes ─────────────────────────────────────────────────────────────
// Chunked Figma node-tree extractor. Manages the cache file; actual figma_execute
// calls are made by the agent following the figma-extract skill.
//
// Usage:
//   node scripts/harness-cli.mjs extract-nodes fetch      --node-id <id> --file-key <key> --slug <slug> [--limit 25]
//   node scripts/harness-cli.mjs extract-nodes next-script --slug <slug>
//   node scripts/harness-cli.mjs extract-nodes ingest     --slug <slug> --response <path>
//   node scripts/harness-cli.mjs extract-nodes status     --slug <slug>
//   node scripts/harness-cli.mjs extract-nodes resume     --slug <slug>   (alias: next-script + status)

function nodesCachePath(slug) {
  return resolve(NODES_CACHE_DIR, `${slug}-nodes.json`);
}

function loadCache(slug) {
  const p = nodesCachePath(slug);
  if (!existsSync(p)) return null;
  return JSON.parse(readFileSync(p, "utf8"));
}

function saveCache(slug, data) {
  writeFileSync(nodesCachePath(slug), JSON.stringify(data, null, 2) + "\n");
}

// The figma_execute worker script template injected with OFFSET/LIMIT/NODE_ID
function buildWorkerScript(nodeId, offset, limit) {
  return `// figma_execute — extract-nodes batch (offset=${offset}, limit=${limit})
const OFFSET = ${offset};
const LIMIT  = ${limit};
const NODE_ID = ${JSON.stringify(nodeId)};
const DS_PREFIXES = ['💠','🛠️'];

function isDSNode(n){ return DS_PREFIXES.some(p => n.name.startsWith(p)); }
function isDSInstance(n){
  if (n.type !== 'INSTANCE') return false;
  try { const mc = n.mainComponent; return mc && DS_PREFIXES.some(p => mc.name.startsWith(p)); }
  catch(e){ return false; }
}

function extractSpec(n){
  return {
    id: n.id, name: n.name, type: n.type, parent: n.parent?.id ?? null,
    layout: n.layoutMode ? { mode: n.layoutMode, padding: [n.paddingTop,n.paddingRight,n.paddingBottom,n.paddingLeft], itemSpacing: n.itemSpacing } : null,
    geometry: { w: n.width, h: n.height, x: n.x, y: n.y },
    fills: n.fills ?? [], strokes: n.strokes ?? [], effects: n.effects ?? [],
    cornerRadius: n.cornerRadius ?? null,
    text: n.type === 'TEXT' ? { characters: n.characters, styleId: n.textStyleId ?? null } : null,
    boundVariables: n.boundVariables ?? null
  };
}

function walk(node, out, skipped){
  if (isDSNode(node) || isDSInstance(node)){
    skipped.push({ id: node.id, name: node.name, mainComponentId: node.mainComponent?.id ?? null, mainComponentKey: node.mainComponent?.key ?? null, mainComponentName: node.mainComponent?.name ?? null });
    return;
  }
  out.push(extractSpec(node));
  if ('children' in node) for (const c of node.children) walk(c, out, skipped);
}

const root = figma.getNodeById(NODE_ID);
if (!root) return { error: 'node not found: ' + NODE_ID };
const all = [], skipped = [];
walk(root, all, skipped);
return {
  offset: OFFSET, limit: LIMIT,
  hasMore: all.length > OFFSET + LIMIT,
  totalScanned: all.length,
  nodes: all.slice(OFFSET, OFFSET + LIMIT),
  dsInstancesSkipped: skipped
};`;
}

async function runExtractNodes(rawArgs) {
  const [mode, ...rest] = rawArgs;
  const modeArgs = parseArgs(rest);

  switch (mode) {
    case "fetch": {
      const { "node-id": nodeId, "file-key": fileKey, slug, limit: limitRaw } = modeArgs;
      if (!nodeId) { process.stderr.write("extract-nodes fetch: --node-id is required\n"); process.exit(1); }
      if (!fileKey) { process.stderr.write("extract-nodes fetch: --file-key is required\n"); process.exit(1); }
      if (!slug) { process.stderr.write("extract-nodes fetch: --slug is required\n"); process.exit(1); }
      const limit = limitRaw ? parseInt(limitRaw, 10) : DEFAULT_LIMIT;
      const now = new Date().toISOString();
      const cache = { slug, figma: { fileKey, nodeId }, limit, offset: 0, hasMore: true, startedAt: now, updatedAt: now, totalScanned: 0, dsInstancesSkipped: [], nodes: [] };
      saveCache(slug, cache);
      console.log(`extract-nodes: cache initialized → ${nodesCachePath(slug)}`);
      console.log(`extract-nodes: run next-script to get the first figma_execute batch script`);
      break;
    }

    case "next-script": {
      const { slug } = modeArgs;
      if (!slug) { process.stderr.write("extract-nodes next-script: --slug is required\n"); process.exit(1); }
      const cache = loadCache(slug);
      if (!cache) { process.stderr.write(`extract-nodes next-script: cache not found for slug "${slug}". Run fetch first.\n`); process.exit(1); }
      if (!cache.hasMore) { console.log(`extract-nodes: already complete (hasMore=false). Nothing to fetch.`); break; }
      const script = buildWorkerScript(cache.figma.nodeId, cache.offset, cache.limit);
      console.log("// ── paste into figma_execute ──────────────────────────────────────────────");
      console.log(script);
      console.log("// ───────────────────────────────────────────────────────────────────────────");
      console.log(`// After running, save the JSON response to a file and run:`);
      console.log(`// node scripts/harness-cli.mjs extract-nodes ingest --slug ${slug} --response <path>`);
      break;
    }

    case "ingest": {
      const { slug, response: responsePath } = modeArgs;
      if (!slug) { process.stderr.write("extract-nodes ingest: --slug is required\n"); process.exit(1); }
      if (!responsePath || !existsSync(responsePath)) { process.stderr.write(`extract-nodes ingest: --response file not found: ${responsePath}\n`); process.exit(1); }
      const cache = loadCache(slug);
      if (!cache) { process.stderr.write(`extract-nodes ingest: cache not found for slug "${slug}". Run fetch first.\n`); process.exit(1); }
      const batch = JSON.parse(readFileSync(responsePath, "utf8"));
      if (batch.error) { process.stderr.write(`extract-nodes ingest: figma_execute returned error: ${batch.error}\n`); process.exit(1); }
      // Merge: append nodes, merge dsInstancesSkipped (dedupe by id), advance offset
      const existingIds = new Set(cache.dsInstancesSkipped.map(n => n.id));
      for (const s of batch.dsInstancesSkipped ?? []) {
        if (!existingIds.has(s.id)) { cache.dsInstancesSkipped.push(s); existingIds.add(s.id); }
      }
      cache.nodes.push(...(batch.nodes ?? []));
      cache.offset = cache.offset + cache.limit;
      cache.hasMore = batch.hasMore ?? false;
      cache.totalScanned = batch.totalScanned ?? cache.totalScanned;
      cache.updatedAt = new Date().toISOString();
      saveCache(slug, cache);
      console.log(`extract-nodes ingest: +${(batch.nodes ?? []).length} nodes (total=${cache.nodes.length}, scanned=${cache.totalScanned}, hasMore=${cache.hasMore})`);
      if (!cache.hasMore) console.log(`extract-nodes: ✓ complete — all nodes cached to ${nodesCachePath(slug)}`);
      break;
    }

    case "status": {
      const { slug } = modeArgs;
      if (!slug) { process.stderr.write("extract-nodes status: --slug is required\n"); process.exit(1); }
      const cache = loadCache(slug);
      if (!cache) { process.stderr.write(`extract-nodes status: cache not found for slug "${slug}".\n`); process.exit(1); }
      console.log(`slug:              ${cache.slug}`);
      console.log(`figma nodeId:      ${cache.figma.nodeId}`);
      console.log(`figma fileKey:     ${cache.figma.fileKey}`);
      console.log(`nodes cached:      ${cache.nodes.length}`);
      console.log(`totalScanned:      ${cache.totalScanned}`);
      console.log(`dsInstSkipped:     ${cache.dsInstancesSkipped.length}`);
      console.log(`nextOffset:        ${cache.offset}`);
      console.log(`hasMore:           ${cache.hasMore}`);
      console.log(`updatedAt:         ${cache.updatedAt}`);
      if (cache.dsInstancesSkipped.length) {
        console.log(`\nDS instances (→ code-connect resolve):`);
        for (const s of cache.dsInstancesSkipped) console.log(`  ${s.id}  ${s.mainComponentName ?? s.name}`);
      }
      break;
    }

    case "resume":
      // Convenience alias: print next-script then status
      await runExtractNodes(["next-script", ...rest]);
      console.log("");
      await runExtractNodes(["status", ...rest]);
      break;

    default:
      process.stderr.write(`extract-nodes: unknown mode "${mode ?? "(none)"}". Use: fetch | next-script | ingest | status | resume\n`);
      process.exit(1);
  }
}

// ── helpers ───────────────────────────────────────────────────────────────────

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function cropBuffer(png, w, h) {
  if (png.width === w && png.height === h) return new Uint8Array(png.data.buffer);
  const buf = new Uint8Array(w * h * 4);
  for (let row = 0; row < h; row++) {
    const srcOff = row * png.width * 4;
    const dstOff = row * w * 4;
    buf.set(new Uint8Array(png.data.buffer, srcOff, w * 4), dstOff);
  }
  return buf;
}

function extractRegion(buf, imgWidth, x, y, w, h) {
  const region = new Uint8Array(w * h * 4);
  for (let row = 0; row < h; row++) {
    const srcOff = ((y + row) * imgWidth + x) * 4;
    const dstOff = row * w * 4;
    region.set(buf.subarray(srcOff, srcOff + w * 4), dstOff);
  }
  return region;
}

function zeroRegion(buf, imgWidth, x, y, w, h) {
  for (let row = 0; row < h; row++) {
    const off = ((y + row) * imgWidth + x) * 4;
    buf.fill(0, off, off + w * 4);
  }
}
