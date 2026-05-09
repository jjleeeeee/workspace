import { createServer } from "node:http";
import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { createReadStream, existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import pixelmatch from "pixelmatch";
import { chromium } from "playwright";
import { PNG } from "pngjs";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const registryPath = path.join(rootDir, "src/figma/visual-registry.json");
const staticDir = path.join(rootDir, "storybook-static");
const artifactsDir = path.join(rootDir, "artifacts/visual-diff");

const mode = process.argv[2] ?? "diff";

function resolveRoot(relativePath) {
  return path.join(rootDir, relativePath);
}

async function readRegistry() {
  return JSON.parse(await readFile(registryPath, "utf8"));
}

async function readPngFile(filePath) {
  return PNG.sync.read(await readFile(filePath));
}

async function writeJson(filePath, data) {
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

async function ensureBaseline(entry) {
  const visualScale = entry.visualScale ?? 1;
  const layoutBaselinePath = entry.layoutBaselinePath ?? entry.baselinePath;
  const visualBaselinePath = entry.visualBaselinePath ?? layoutBaselinePath;
  const layoutPath = resolveRoot(layoutBaselinePath);
  const visualPath = resolveRoot(visualBaselinePath);

  if (!existsSync(layoutPath)) {
    return { id: entry.id, ok: false, reason: `Missing layout baseline: ${layoutBaselinePath}` };
  }

  if (!existsSync(visualPath)) {
    return { id: entry.id, ok: false, reason: `Missing visual baseline: ${visualBaselinePath}` };
  }

  const layoutImage = await readPngFile(layoutPath);
  const visualImage = await readPngFile(visualPath);
  const expectedVisualWidth = entry.expectedWidth * visualScale;
  const expectedVisualHeight = entry.expectedHeight * visualScale;
  const layoutSizeOk = layoutImage.width === entry.expectedWidth && layoutImage.height === entry.expectedHeight;
  const visualSizeOk = visualImage.width === expectedVisualWidth && visualImage.height === expectedVisualHeight;

  return {
    id: entry.id,
    ok: layoutSizeOk && visualSizeOk,
    reason: layoutSizeOk && visualSizeOk
      ? "ok"
      : `Baseline size mismatch: layout ${layoutImage.width}x${layoutImage.height} expected ${entry.expectedWidth}x${entry.expectedHeight}, visual ${visualImage.width}x${visualImage.height} expected ${expectedVisualWidth}x${expectedVisualHeight}`,
    layoutSize: { width: layoutImage.width, height: layoutImage.height },
    visualSize: { width: visualImage.width, height: visualImage.height },
    visualScale,
  };
}

function contentType(filePath) {
  if (filePath.endsWith(".html")) return "text/html";
  if (filePath.endsWith(".js")) return "text/javascript";
  if (filePath.endsWith(".css")) return "text/css";
  if (filePath.endsWith(".png")) return "image/png";
  if (filePath.endsWith(".json")) return "application/json";
  if (filePath.endsWith(".svg")) return "image/svg+xml";
  if (filePath.endsWith(".woff2")) return "font/woff2";
  return "application/octet-stream";
}

async function serveStatic() {
  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url ?? "/", "http://127.0.0.1");
      const pathname = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
      const requestedPath = path.normalize(path.join(staticDir, pathname));

      if (!requestedPath.startsWith(staticDir)) {
        response.writeHead(403);
        response.end("Forbidden");
        return;
      }

      const fileStat = await stat(requestedPath);
      const filePath = fileStat.isDirectory() ? path.join(requestedPath, "index.html") : requestedPath;
      response.writeHead(200, { "Content-Type": contentType(filePath) });
      createReadStream(filePath).pipe(response);
    } catch {
      response.writeHead(404);
      response.end("Not found");
    }
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  return {
    port: address.port,
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}

function makeOverlay(baseline, actual, diff) {
  const overlay = new PNG({ width: baseline.width, height: baseline.height });

  for (let i = 0; i < baseline.data.length; i += 4) {
    const isDiff = diff.data[i] > 0 || diff.data[i + 1] > 0 || diff.data[i + 2] > 0;
    overlay.data[i] = isDiff ? 255 : Math.round((baseline.data[i] + actual.data[i]) / 2);
    overlay.data[i + 1] = isDiff ? 64 : Math.round((baseline.data[i + 1] + actual.data[i + 1]) / 2);
    overlay.data[i + 2] = isDiff ? 64 : Math.round((baseline.data[i + 2] + actual.data[i + 2]) / 2);
    overlay.data[i + 3] = 255;
  }

  return overlay;
}

async function captureElement(browser, baseUrl, entry, scale, outputPath) {
  const context = await browser.newContext({ deviceScaleFactor: scale });
  const page = await context.newPage();

  try {
    await page.setViewportSize({
      width: Math.max(entry.expectedWidth + 80, 480),
      height: Math.max(entry.expectedHeight + 80, 320),
    });
    await page.goto(`${baseUrl}/iframe.html?viewMode=story&id=${entry.storyId}`, { waitUntil: "networkidle" });
    await page.addStyleTag({
      content: `
        html,
        body,
        .sb-show-main,
        #storybook-root {
          background: transparent !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        body,
        #storybook-root {
          display: inline-block !important;
          line-height: 0 !important;
        }
      `,
    });
    const element = page.locator(entry.selector).first();
    await element.waitFor({ state: "visible", timeout: 10_000 });
    await element.evaluate((node) => {
      const element = /** @type {HTMLElement} */ (node);
      element.style.position = "absolute";
      element.style.insetInlineStart = "0";
      element.style.insetBlockStart = "0";
      element.style.margin = "0";
    });
    await element.screenshot({ omitBackground: true, path: outputPath });
  } finally {
    await context.close();
  }
}

async function captureEntry(browser, baseUrl, entry) {
  const outputDir = path.join(artifactsDir, entry.id);
  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });

  const visualScale = entry.visualScale ?? 1;
  const layoutBaselinePath = entry.layoutBaselinePath ?? entry.baselinePath;
  const visualBaselinePath = entry.visualBaselinePath ?? layoutBaselinePath;
  const layoutActualPath = path.join(outputDir, "layout-actual.png");
  const visualActualPath = path.join(outputDir, "visual-actual.png");

  await captureElement(browser, baseUrl, entry, 1, layoutActualPath);
  await captureElement(browser, baseUrl, entry, visualScale, visualActualPath);

  const layoutBaseline = await readPngFile(resolveRoot(layoutBaselinePath));
  const layoutActual = await readPngFile(layoutActualPath);
  const visualBaseline = await readPngFile(resolveRoot(visualBaselinePath));
  const visualActual = await readPngFile(visualActualPath);
  const layoutSizeMatches =
    layoutBaseline.width === layoutActual.width && layoutBaseline.height === layoutActual.height;
  const visualSizeMatches =
    visualBaseline.width === visualActual.width && visualBaseline.height === visualActual.height;

  const report = {
    id: entry.id,
    component: entry.component,
    storyId: entry.storyId,
    selector: entry.selector,
    comparisonScope: entry.comparisonScope ?? "full-parity",
    isParityGate: entry.isParityGate ?? true,
    loopBudget: entry.loopBudget,
    visualScale,
    threshold: entry.pixelmatchThreshold,
    maxDiffPixelRatio: entry.maxDiffPixelRatio,
    layoutBaselineSize: { width: layoutBaseline.width, height: layoutBaseline.height },
    layoutActualSize: { width: layoutActual.width, height: layoutActual.height },
    visualBaselineSize: { width: visualBaseline.width, height: visualBaseline.height },
    visualActualSize: { width: visualActual.width, height: visualActual.height },
    layoutSizeMatches,
    visualSizeMatches,
    ok: false,
  };

  if (!layoutSizeMatches || !visualSizeMatches) {
    report.reason = "size-mismatch";
    await writeJson(path.join(outputDir, "report.json"), report);
    return report;
  }

  const diff = new PNG({ width: visualBaseline.width, height: visualBaseline.height });
  const diffPixels = pixelmatch(visualBaseline.data, visualActual.data, diff.data, visualBaseline.width, visualBaseline.height, {
    threshold: entry.pixelmatchThreshold,
  });
  const totalPixels = visualBaseline.width * visualBaseline.height;
  const diffPixelRatio = diffPixels / totalPixels;
  const matchRate = 1 - diffPixelRatio;
  const overlay = makeOverlay(visualBaseline, visualActual, diff);

  await writeFile(path.join(outputDir, "diff.png"), PNG.sync.write(diff));
  await writeFile(path.join(outputDir, "overlay.png"), PNG.sync.write(overlay));

  report.visualDiffPixels = diffPixels;
  report.visualTotalPixels = totalPixels;
  report.visualDiffPixelRatio = Number(diffPixelRatio.toFixed(6));
  report.visualMatchRate = Number(matchRate.toFixed(6));
  report.thresholdPassed = diffPixelRatio <= entry.maxDiffPixelRatio;
  report.ok = report.isParityGate ? report.thresholdPassed : true;
  report.reason = report.isParityGate
    ? report.thresholdPassed
      ? "ok"
      : "diff-threshold-exceeded"
    : report.thresholdPassed
      ? "non-gating-ok"
      : "non-gating-diff-threshold-exceeded";
  await writeJson(path.join(outputDir, "report.json"), report);
  return report;
}

function printSummary(title, results) {
  console.log(`\n${title}`);
  for (const result of results) {
    const isParityGate = result.isParityGate ?? true;
    const marker = isParityGate ? (result.ok ? "PASS" : "FAIL") : "INFO";
    const ratio = result.visualDiffPixelRatio ?? result.diffPixelRatio;
    const match = result.visualMatchRate ?? result.matchRate;
    const scope = result.comparisonScope ? `scope=${result.comparisonScope}, ` : "";
    const gate = isParityGate ? "" : "non-gating, ";
    const detail = ratio === undefined
      ? `${scope}${gate}${result.reason}`
      : `${scope}${gate}${result.reason}, visualDiff=${ratio}, visualMatch=${match}`;
    console.log(`- ${marker} ${result.id}: ${detail}`);
  }
}

async function checkBaselines() {
  const registry = await readRegistry();
  const results = await Promise.all(registry.map(ensureBaseline));
  printSummary("visual:baseline", results);
  await writeJson(path.join(artifactsDir, "baseline-report.json"), results);
  if (results.some((result) => !result.ok)) process.exitCode = 1;
}

async function diff() {
  if (!existsSync(staticDir)) {
    console.error("storybook-static is missing. Run npm run build-storybook first.");
    process.exitCode = 1;
    return;
  }

  const registry = await readRegistry();
  const baselineResults = await Promise.all(registry.map(ensureBaseline));
  const missingBaseline = baselineResults.find((result) => !result.ok);
  if (missingBaseline) {
    printSummary("visual:baseline", baselineResults);
    process.exitCode = 1;
    return;
  }

  const server = await serveStatic();
  const browser = await chromium.launch({ headless: true });

  try {
    const baseUrl = `http://127.0.0.1:${server.port}`;
    const results = [];
    for (const entry of registry) {
      results.push(await captureEntry(browser, baseUrl, entry));
    }
    printSummary("visual:diff", results);
    await writeJson(path.join(artifactsDir, "summary.json"), results);
    if (results.some((result) => !result.ok)) process.exitCode = 1;
  } finally {
    await browser.close();
    await server.close();
  }
}

if (mode === "baseline") {
  await checkBaselines();
} else if (mode === "diff") {
  await diff();
} else {
  console.error(`Unknown mode: ${mode}`);
  process.exitCode = 1;
}
