#!/usr/bin/env bash
# Figma → React Harness Check
# Mirrors 13_swiftui-test/scripts/run_harness_check.sh
#
# Usage:
#   SCREEN_SLUG=my-screen FIGMA_URL=https://... bash scripts/run_harness_check.sh
#
# Required env:
#   SCREEN_SLUG     slug used for file naming and screen routing
#   FIGMA_URL       full Figma URL (info only — for logging and instructions)
#   FIGMA_FILE_KEY  Figma file key (for get_screenshot)
#   FIGMA_NODE_ID   Figma node ID (for get_screenshot)
#
# Optional env:
#   ARTIFACT_DIR    default: /tmp/figma-react-harness
#   LOOP_INDEX      current loop number (default: 1)
#   MAX_LOOPS       max loops before hard fail (default: 5)
#   DIFF_THRESHOLD  min score to pass (default: 95)
#   BASE_URL        Vite dev server URL (default: http://localhost:5173)
#   SYNC_TOKENS     set to 1 to run sync_tokens.sh before tests (default: 0)
#   START_DEV_SERVER  set to 1 to boot vite dev server (default: 0)
#   VIEWPORT_W      viewport width (default: 393)
#   VIEWPORT_H      viewport height (default: 852)
#   VIEWPORT_DPR    device pixel ratio (default: 2)
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

SCREEN_SLUG="${SCREEN_SLUG:-}"
FIGMA_URL="${FIGMA_URL:-}"
FIGMA_FILE_KEY="${FIGMA_FILE_KEY:-}"
FIGMA_NODE_ID="${FIGMA_NODE_ID:-}"
ARTIFACT_DIR="${ARTIFACT_DIR:-/tmp/figma-react-harness}"
LOOP_INDEX="${LOOP_INDEX:-1}"
MAX_LOOPS="${MAX_LOOPS:-5}"
DIFF_THRESHOLD="${DIFF_THRESHOLD:-95}"
BASE_URL="${BASE_URL:-http://localhost:5173}"
SYNC_TOKENS="${SYNC_TOKENS:-0}"
SKIP_SYNC_CHECK="${SKIP_SYNC_CHECK:-0}"
SYNC_CHECK_MAX_AGE="${SYNC_CHECK_MAX_AGE:-60}"
START_DEV_SERVER="${START_DEV_SERVER:-0}"
VIEWPORT_W="${VIEWPORT_W:-393}"
VIEWPORT_H="${VIEWPORT_H:-852}"
VIEWPORT_DPR="${VIEWPORT_DPR:-2}"

if [[ -z "$SCREEN_SLUG" ]]; then
  echo "Error: SCREEN_SLUG is required" >&2
  exit 1
fi

DIFF_MANIFEST="${DIFF_MANIFEST:-$ROOT_DIR/harness/$SCREEN_SLUG-diff-manifest.json}"
FIGMA_SCREENSHOT="$ARTIFACT_DIR/$SCREEN_SLUG-figma.png"
BROWSER_FULL_SCREENSHOT="$ARTIFACT_DIR/$SCREEN_SLUG-react-loop-$LOOP_INDEX-full.png"
BROWSER_SCREENSHOT="$ARTIFACT_DIR/$SCREEN_SLUG-react-loop-$LOOP_INDEX.png"
NORMALIZATION_JSON="$ARTIFACT_DIR/$SCREEN_SLUG-normalization-loop-$LOOP_INDEX.json"
COLOR_TOKEN_JSON="$ARTIFACT_DIR/$SCREEN_SLUG-color-tokens-loop-$LOOP_INDEX.json"
DIFF_JSON="$ARTIFACT_DIR/$SCREEN_SLUG-diff-loop-$LOOP_INDEX.json"
DIFF_PNG="$ARTIFACT_DIR/$SCREEN_SLUG-diff-loop-$LOOP_INDEX.png"

cd "$ROOT_DIR"
mkdir -p "$ARTIFACT_DIR"

echo "== Figma to React Harness Check =="
echo "screen:   $SCREEN_SLUG"
echo "figma:    $FIGMA_URL"
echo "loop:     $LOOP_INDEX / $MAX_LOOPS"
echo "artifact: $ARTIFACT_DIR"

# 0. Token parity pre-flight (sync-figma-token)
# Reads the latest /tmp/sync-figma-token-dry-run-*.json written by /sync-figma-token skill.
# Exit 1 (drift detected) → hard fail. Exit 2 (no/stale report) → warning only.
if [[ "$SKIP_SYNC_CHECK" != "1" ]]; then
  echo ""
  echo "-- 0. Token parity check (sync-figma-token)"
  set +e
  node "$ROOT_DIR/scripts/harness-cli.mjs" sync-check \
    --max-age-minutes "$SYNC_CHECK_MAX_AGE" \
    --output-json "$ARTIFACT_DIR/$SCREEN_SLUG-sync-check.json"
  SYNC_EXIT=$?
  set -e
  if [[ $SYNC_EXIT -eq 1 ]]; then
    echo ""
    echo "Token drift detected. Run /sync-figma-token (apply) to fix, then re-run harness." >&2
    exit 1
  elif [[ $SYNC_EXIT -eq 2 ]]; then
    echo "   (no recent report — run /sync-figma-token dry-run for parity confidence)"
    echo "   continuing without parity guarantee. Set SKIP_SYNC_CHECK=1 to silence this."
  fi
fi

# 0.5. Refresh Code Connect index from 04_wf component library
echo ""
echo "-- 0.5. Code Connect index"
node "$ROOT_DIR/scripts/harness-cli.mjs" code-connect index \
  --output "$ROOT_DIR/harness/code-connect-index.json"

# 1. Sync tokens (optional)
if [[ "$SYNC_TOKENS" == "1" ]]; then
  echo ""
  echo "-- 1. Sync tokens"
  bash "$ROOT_DIR/scripts/sync_tokens.sh"
fi

# 2. Unit tests
echo ""
echo "-- 2. npm test"
npm test

# 3. Color token gate
echo ""
echo "-- 3. color-tokens gate"
node "$ROOT_DIR/scripts/harness-cli.mjs" color-tokens \
  --screen "$SCREEN_SLUG" \
  --manifest "$DIFF_MANIFEST" \
  --output-json "$COLOR_TOKEN_JSON"

# 4. Boot dev server if requested
DEV_PID=""
if [[ "$START_DEV_SERVER" == "1" ]]; then
  echo ""
  echo "-- 4. Starting Vite dev server"
  npm run dev &
  DEV_PID=$!
  trap 'kill "$DEV_PID" 2>/dev/null || true' EXIT
  # Wait for Vite to be ready (max 30s)
  for i in $(seq 1 30); do
    if curl -sf "$BASE_URL" > /dev/null 2>&1; then
      echo "   Vite ready at $BASE_URL"
      break
    fi
    sleep 1
  done
fi

# 6. Check Figma screenshot exists (full-page, captured once)
if [[ ! -f "$FIGMA_SCREENSHOT" ]]; then
  cat >&2 <<EOF

Figma screenshot missing: $FIGMA_SCREENSHOT

To create it:
1. Use Figma MCP get_screenshot (full frame, no clip):
   fileKey: $FIGMA_FILE_KEY
   nodeId:  $FIGMA_NODE_ID
2. Save the PNG to: $FIGMA_SCREENSHOT
3. Figma URL: $FIGMA_URL

For sectioned screens, one full-height screenshot is enough —
the harness will crop it per section automatically.

Then re-run with LOOP_INDEX=$LOOP_INDEX.
EOF
  exit 2
fi

# Detect sections in manifest (JSON array: [{name, scroll_y, capture_height}, ...])
SECTIONS_JSON=$(node -e "
try {
  const m = JSON.parse(require('fs').readFileSync('$DIFF_MANIFEST', 'utf8'));
  const s = m.sections;
  if (Array.isArray(s) && s.length > 0) process.stdout.write(JSON.stringify(s));
} catch {}
" 2>/dev/null)

if [[ -z "$SECTIONS_JSON" ]]; then
  # ── Single-viewport mode ───────────────────────────────────────────────────
  echo ""
  echo "-- 5. Playwright capture (single viewport)"
  node "$ROOT_DIR/scripts/harness-cli.mjs" capture \
    --url "$BASE_URL/?screen=$SCREEN_SLUG" \
    --output "$BROWSER_FULL_SCREENSHOT" \
    --width "$VIEWPORT_W" \
    --height "$VIEWPORT_H" \
    --dpr "$VIEWPORT_DPR"

  echo ""
  echo "-- 7. Normalize"
  node "$ROOT_DIR/scripts/harness-cli.mjs" normalize \
    --figma "$FIGMA_SCREENSHOT" \
    --browser-full "$BROWSER_FULL_SCREENSHOT" \
    --output "$BROWSER_SCREENSHOT" \
    --output-report "$NORMALIZATION_JSON" \
    --manifest "$DIFF_MANIFEST"

  echo ""
  echo "-- 8. Diff"
  node "$ROOT_DIR/scripts/harness-cli.mjs" diff \
    --screen "$SCREEN_SLUG" \
    --figma "$FIGMA_SCREENSHOT" \
    --browser "$BROWSER_SCREENSHOT" \
    --manifest "$DIFF_MANIFEST" \
    --output-json "$DIFF_JSON" \
    --output-diff "$DIFF_PNG" \
    --threshold "$DIFF_THRESHOLD" \
    --loop "$LOOP_INDEX" \
    --max-loops "$MAX_LOOPS"

else
  # ── Multi-section mode ─────────────────────────────────────────────────────
  SECTION_COUNT=$(node -e "process.stdout.write(String(JSON.parse('$SECTIONS_JSON').length))")
  echo ""
  echo "-- 5-8. Sectioned capture + diff ($SECTION_COUNT sections)"

  SECTION_FAILED=0

  node -e "
const sections = $SECTIONS_JSON;
sections.forEach((s, i) => {
  process.stdout.write(s.name + '\t' + s.scroll_y + '\t' + s.capture_height + '\n');
});
" | while IFS=$'\t' read -r SECT_NAME SECT_SCROLL SECT_HEIGHT; do
    SECT_BROWSER="$ARTIFACT_DIR/$SCREEN_SLUG-$SECT_NAME-react-loop-$LOOP_INDEX.png"
    SECT_NORM="$ARTIFACT_DIR/$SCREEN_SLUG-$SECT_NAME-react-norm-loop-$LOOP_INDEX.png"
    SECT_NORM_REPORT="$ARTIFACT_DIR/$SCREEN_SLUG-$SECT_NAME-normalization-loop-$LOOP_INDEX.json"
    SECT_DIFF_JSON="$ARTIFACT_DIR/$SCREEN_SLUG-$SECT_NAME-diff-loop-$LOOP_INDEX.json"
    SECT_DIFF_PNG="$ARTIFACT_DIR/$SCREEN_SLUG-$SECT_NAME-diff-loop-$LOOP_INDEX.png"

    echo ""
    echo "   [section: $SECT_NAME] scroll=${SECT_SCROLL}px height=${SECT_HEIGHT}px"

    # Capture browser at scroll position
    node "$ROOT_DIR/scripts/harness-cli.mjs" capture \
      --url "$BASE_URL/?screen=$SCREEN_SLUG" \
      --output "$SECT_BROWSER" \
      --width "$VIEWPORT_W" \
      --height "$VIEWPORT_H" \
      --dpr "$VIEWPORT_DPR" \
      --scroll-y "$SECT_SCROLL" \
      --capture-height "$SECT_HEIGHT"

    # Normalize: crop Figma full screenshot to section + align browser
    node "$ROOT_DIR/scripts/harness-cli.mjs" normalize \
      --figma "$FIGMA_SCREENSHOT" \
      --browser-full "$SECT_BROWSER" \
      --output "$SECT_NORM" \
      --output-report "$SECT_NORM_REPORT" \
      --manifest "$DIFF_MANIFEST" \
      --section-scroll-y "$SECT_SCROLL" \
      --section-height "$SECT_HEIGHT"

    # The figma-section output lives at SECT_NORM with -figma-section.png suffix
    SECT_FIGMA="${SECT_NORM/-react-norm-/-figma-section-}"
    SECT_FIGMA="${SECT_FIGMA/.png/-figma-section.png}"
    # normalize writes figma-section to: output with "-figma-section" suffix
    SECT_FIGMA_ACTUAL="${SECT_NORM%.png}-figma-section.png"

    # Diff section
    node "$ROOT_DIR/scripts/harness-cli.mjs" diff \
      --screen "$SCREEN_SLUG-$SECT_NAME" \
      --figma "$SECT_FIGMA_ACTUAL" \
      --browser "$SECT_NORM" \
      --manifest "$DIFF_MANIFEST" \
      --output-json "$SECT_DIFF_JSON" \
      --output-diff "$SECT_DIFF_PNG" \
      --threshold "$DIFF_THRESHOLD" \
      --loop "$LOOP_INDEX" \
      --max-loops "$MAX_LOOPS" \
      --section-scroll-y "$SECT_SCROLL" \
      --section-height "$SECT_HEIGHT" || SECTION_FAILED=1
  done

  if [[ "$SECTION_FAILED" == "1" ]]; then
    echo ""
    echo "One or more sections failed diff gate." >&2
    exit 1
  fi
fi

cat <<EOF

== PASSED ==

Artifacts dir: $ARTIFACT_DIR
Figma source:
  $FIGMA_URL
  fileKey: $FIGMA_FILE_KEY
  nodeId:  $FIGMA_NODE_ID
EOF
