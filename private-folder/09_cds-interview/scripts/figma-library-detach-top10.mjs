#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

const DEFAULT_LIBRARY_FILE_KEY = "DWEduE6GfxYMlyxKPNJ8jA";
const DEFAULT_START_DATE = "2025-12-01";
const DEFAULT_END_DATE = "2026-05-31";
const DEFAULT_LIMIT = 10;
const DEFAULT_OUTPUT = "report/figma-cds-detach-top10.csv";

function parseArgs(argv) {
  const options = {
    libraryFileKey: process.env.FIGMA_LIBRARY_FILE_KEY || DEFAULT_LIBRARY_FILE_KEY,
    startDate: process.env.START_DATE || DEFAULT_START_DATE,
    endDate: process.env.END_DATE || DEFAULT_END_DATE,
    limit: Number(process.env.LIMIT || DEFAULT_LIMIT),
    output: process.env.OUTPUT || DEFAULT_OUTPUT,
    diamondOnly: process.env.DIAMOND_ONLY !== "false",
    aggregateBySet: process.env.AGGREGATE_BY_SET !== "false",
    json: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = argv[i + 1];

    if (arg === "--library-file-key" && next) {
      options.libraryFileKey = next;
      i += 1;
    } else if (arg === "--start-date" && next) {
      options.startDate = next;
      i += 1;
    } else if (arg === "--end-date" && next) {
      options.endDate = next;
      i += 1;
    } else if (arg === "--limit" && next) {
      options.limit = Number(next);
      i += 1;
    } else if (arg === "--output" && next) {
      options.output = next;
      i += 1;
    } else if (arg === "--json") {
      options.json = true;
    } else if (arg === "--all-components") {
      options.diamondOnly = false;
    } else if (arg === "--variant-level") {
      options.aggregateBySet = false;
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown or incomplete argument: ${arg}`);
    }
  }

  if (!Number.isInteger(options.limit) || options.limit <= 0) {
    throw new Error("--limit must be a positive integer");
  }

  return options;
}

function printHelp() {
  console.log(`Usage:
  FIGMA_TOKEN=... node scripts/figma-library-detach-top10.mjs [options]

Options:
  --library-file-key <key>  Figma library file key. Default: ${DEFAULT_LIBRARY_FILE_KEY}
  --start-date <YYYY-MM-DD> Start date. Default: ${DEFAULT_START_DATE}
  --end-date <YYYY-MM-DD>   End date. Default: ${DEFAULT_END_DATE}
  --limit <number>          Number of components to show. Default: ${DEFAULT_LIMIT}
  --output <path>           CSV output path. Default: ${DEFAULT_OUTPUT}
  --all-components          Include components without 💠. Default filters to 💠 components.
  --variant-level           Do not combine variants by component set. Default combines variants.
  --json                    Print JSON instead of Markdown
`);
}

async function fetchPage({ token, libraryFileKey, startDate, endDate, cursor }) {
  const url = new URL(
    `https://api.figma.com/v1/analytics/libraries/${libraryFileKey}/component/actions`,
  );
  url.searchParams.set("group_by", "component");
  url.searchParams.set("start_date", startDate);
  url.searchParams.set("end_date", endDate);
  if (cursor) url.searchParams.set("cursor", cursor);

  const response = await fetch(url, {
    headers: {
      "X-Figma-Token": token,
    },
  });

  const bodyText = await response.text();
  let body;
  try {
    body = bodyText ? JSON.parse(bodyText) : {};
  } catch {
    body = { raw: bodyText };
  }

  if (!response.ok) {
    const message = body?.message || body?.err || body?.raw || response.statusText;
    throw new Error(`Figma API ${response.status}: ${message}`);
  }

  return body;
}

async function fetchAllRows(options) {
  const token = process.env.FIGMA_TOKEN;
  if (!token) {
    throw new Error("FIGMA_TOKEN environment variable is required");
  }

  const rows = [];
  let cursor;

  do {
    const page = await fetchPage({ ...options, token, cursor });
    rows.push(...(page.rows || []));
    cursor = page.next_page ? page.cursor : undefined;
  } while (cursor);

  return rows;
}

function aggregateRows(rows, options) {
  const byComponent = new Map();

  for (const row of rows) {
    const detachments = Number(row.detachments || 0);
    const insertions = Number(row.insertions || 0);
    if (detachments <= 0) continue;

    const setKey = row.component_set_key || "";
    const key = options.aggregateBySet && setKey ? setKey : row.component_key;
    const isSetAggregate = options.aggregateBySet && Boolean(setKey);
    const current = byComponent.get(key) || {
      aggregate_key: key,
      aggregate_type: isSetAggregate ? "component_set" : "component",
      component_key: isSetAggregate ? "" : row.component_key,
      component_name: isSetAggregate
        ? row.component_set_name || row.component_name || ""
        : row.component_name || "",
      component_set_key: setKey,
      component_set_name: row.component_set_name || "",
      total_detachments: 0,
      total_insertions: 0,
      detach_weeks: new Set(),
      variant_count: new Set(),
    };

    current.total_detachments += detachments;
    current.total_insertions += insertions;
    if (row.week) current.detach_weeks.add(row.week);
    current.variant_count.add(row.component_key);
    byComponent.set(key, current);
  }

  return [...byComponent.values()]
    .map((item) => ({
      ...item,
      unique_detach_weeks: item.detach_weeks.size,
      detach_weeks: undefined,
      variant_count: item.variant_count.size,
      detach_rate:
        item.total_insertions > 0
          ? item.total_detachments / item.total_insertions
          : null,
    }))
    .sort((a, b) => {
      if (b.total_detachments !== a.total_detachments) {
        return b.total_detachments - a.total_detachments;
      }
      return b.total_insertions - a.total_insertions;
    });
}

function escapeCell(value) {
  return String(value ?? "").replaceAll("|", "\\|").replaceAll("\n", " ");
}

function formatRate(rate) {
  if (rate === null) return "N/A";
  return `${(rate * 100).toFixed(1)}%`;
}

function toCsvValue(value) {
  const text = String(value ?? "");
  if (/[",\n]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
}

async function writeCsv({ rows, options, rawRowCount }) {
  const header = [
    "rank",
    "aggregate_type",
    "aggregate_key",
    "component_key",
    "component_name",
    "component_set_key",
    "component_set_name",
    "total_detachments",
    "total_insertions",
    "detach_rate",
    "unique_detach_weeks",
    "variant_count",
    "start_date",
    "end_date",
    "library_file_key",
    "raw_weekly_rows",
  ];

  const lines = [header.join(",")];
  rows.slice(0, options.limit).forEach((row, index) => {
    lines.push(
      [
        index + 1,
        row.aggregate_type,
        row.aggregate_key,
        row.component_key,
        row.component_name,
        row.component_set_key,
        row.component_set_name,
        row.total_detachments,
        row.total_insertions,
        row.detach_rate === null ? "" : row.detach_rate.toFixed(6),
        row.unique_detach_weeks,
        row.variant_count,
        options.startDate,
        options.endDate,
        options.libraryFileKey,
        rawRowCount,
      ]
        .map(toCsvValue)
        .join(","),
    );
  });

  await fs.mkdir(path.dirname(options.output), { recursive: true });
  await fs.writeFile(options.output, `${lines.join("\n")}\n`, "utf8");
}

function printMarkdown({ rows, options, rawRowCount }) {
  console.log(
    `# Figma CDS Detach Top ${options.limit}\n\n` +
      `- Library file key: \`${options.libraryFileKey}\`\n` +
      `- Period: ${options.startDate} ~ ${options.endDate}\n` +
      `- Raw weekly rows: ${rawRowCount}\n` +
      `- Filter: ${options.diamondOnly ? "components containing 💠" : "all components"}\n` +
      `- Metric: component-level sum of \`detachments\`\n`,
  );

  console.log("| Rank | Component | Aggregate type | Detachments | Insertions | Detach rate | Variants | Detach weeks |");
  console.log("| ---: | --- | --- | ---: | ---: | ---: | ---: | ---: |");

  rows.slice(0, options.limit).forEach((row, index) => {
    console.log(
      [
        index + 1,
        escapeCell(row.component_name),
        escapeCell(row.aggregate_type),
        row.total_detachments,
        row.total_insertions,
        formatRate(row.detach_rate),
        row.variant_count,
        row.unique_detach_weeks,
      ].join(" | ").replace(/^/, "| ").replace(/$/, " |"),
    );
  });
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const rows = await fetchAllRows(options);
  const filteredRows = options.diamondOnly
    ? rows.filter(
        (row) =>
          String(row.component_name || "").includes("💠") ||
          String(row.component_set_name || "").includes("💠"),
      )
    : rows;
  const aggregated = aggregateRows(filteredRows, options);
  const topRows = aggregated.slice(0, options.limit);

  if (options.json) {
    console.log(
      JSON.stringify(
        {
          library_file_key: options.libraryFileKey,
          start_date: options.startDate,
          end_date: options.endDate,
          raw_weekly_rows: rows.length,
          filtered_weekly_rows: filteredRows.length,
          filter: options.diamondOnly ? "components containing 💠" : "all components",
          top_components: topRows,
        },
        null,
        2,
      ),
    );
    return;
  }

  await writeCsv({ rows: topRows, options, rawRowCount: rows.length });
  console.log(`Saved CSV: ${options.output}`);
  printMarkdown({ rows: topRows, options, rawRowCount: rows.length });
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
