#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TOKENS_DIR="${TOKENS_DIR:-/Users/jj.iee/Desktop/chord-design-system/tokens}"
SIMULATOR_ID="${SIMULATOR_ID:-24FF4B41-9C61-4917-94D7-22B4DF6C7CDD}"
SCREEN_SLUG="${SCREEN_SLUG:-figma-live-news-card}"
PREVIEW_FILTER="${PREVIEW_FILTER:-Figma test-swiftui}"
FIGMA_URL="${FIGMA_URL:-https://www.figma.com/design/hSZA1GLBpbgIyDFOnibf99/Untitled?node-id=287-16607&t=HGZdG885C2yjFSHi-11}"
FIGMA_FILE_KEY="${FIGMA_FILE_KEY:-hSZA1GLBpbgIyDFOnibf99}"
FIGMA_NODE_ID="${FIGMA_NODE_ID:-287:16607}"
ARTIFACT_DIR="${ARTIFACT_DIR:-/tmp/figma-swiftui-harness}"
LOOP_INDEX="${LOOP_INDEX:-1}"
MAX_LOOPS="${MAX_LOOPS:-5}"
DIFF_THRESHOLD="${DIFF_THRESHOLD:-95}"
SWIFT_TEST_FILTERS="${SWIFT_TEST_FILTERS:-ChordTokenTests,FigmaLiveNewsCardContentTests,FigmaResourceLookupTests,FigmaScreenshotDiffTests,testLiveNewsCardHeroImageIsContentAsset}"
FIGMA_SCREENSHOT="${FIGMA_SCREENSHOT:-$ARTIFACT_DIR/$SCREEN_SLUG-figma.png}"
SWIFTUI_SCREENSHOT="${SWIFTUI_SCREENSHOT:-$ARTIFACT_DIR/$SCREEN_SLUG-swiftui-loop-$LOOP_INDEX.png}"
SWIFTUI_FULL_SCREENSHOT="${SWIFTUI_FULL_SCREENSHOT:-$ARTIFACT_DIR/$SCREEN_SLUG-swiftui-loop-$LOOP_INDEX-full.png}"
NORMALIZATION_JSON="${NORMALIZATION_JSON:-$ARTIFACT_DIR/$SCREEN_SLUG-normalization-loop-$LOOP_INDEX.json}"
COLOR_TOKEN_JSON="${COLOR_TOKEN_JSON:-$ARTIFACT_DIR/$SCREEN_SLUG-color-tokens-loop-$LOOP_INDEX.json}"
DIFF_JSON="${DIFF_JSON:-$ARTIFACT_DIR/$SCREEN_SLUG-diff-loop-$LOOP_INDEX.json}"
DIFF_PNG="${DIFF_PNG:-$ARTIFACT_DIR/$SCREEN_SLUG-diff-loop-$LOOP_INDEX.png}"
DIFF_MANIFEST="${DIFF_MANIFEST:-$ROOT_DIR/harness/$SCREEN_SLUG-diff-manifest.json}"

cd "$ROOT_DIR"
mkdir -p "$ARTIFACT_DIR"

echo "== Figma to iOS Harness Check =="
echo "tokens: $TOKENS_DIR"
echo "screen: $SCREEN_SLUG"
echo "figma: $FIGMA_URL"
echo "figma fileKey: $FIGMA_FILE_KEY"
echo "figma nodeId: $FIGMA_NODE_ID"
echo "loop: $LOOP_INDEX / $MAX_LOOPS"

python3 scripts/generate_chord_tokens.py \
  --tokens-dir "$TOKENS_DIR" \
  --output Sources/SwiftUIPreviewTest/Generated/ChordTokens.swift

if [[ -n "$SWIFT_TEST_FILTERS" ]]; then
  IFS=',' read -r -a TEST_FILTER_ARRAY <<< "$SWIFT_TEST_FILTERS"
  for test_filter in "${TEST_FILTER_ARRAY[@]}"; do
    swift test --filter "$test_filter"
  done
else
  swift test
fi

swift run FigmaHarnessCLI color-tokens \
  --screen "$SCREEN_SLUG" \
  --manifest "$DIFF_MANIFEST" \
  --output-json "$COLOR_TOKEN_JSON"

if [[ "${CAPTURE_SWIFTUI_SCREENSHOT:-0}" == "1" ]]; then
  xcrun simctl io "$SIMULATOR_ID" screenshot "$SWIFTUI_FULL_SCREENSHOT"
fi

if [[ -f "$FIGMA_SCREENSHOT" && -f "$SWIFTUI_FULL_SCREENSHOT" ]]; then
  swift run FigmaHarnessCLI normalize \
    --figma "$FIGMA_SCREENSHOT" \
    --simulator-full "$SWIFTUI_FULL_SCREENSHOT" \
    --output "$SWIFTUI_SCREENSHOT" \
    --output-report "$NORMALIZATION_JSON" \
    --manifest "$DIFF_MANIFEST"
fi

if [[ ! -f "$FIGMA_SCREENSHOT" || ! -f "$SWIFTUI_SCREENSHOT" ]]; then
  cat <<EOF

Screenshot diff inputs are missing.

Expected:
- Figma screenshot:   $FIGMA_SCREENSHOT
- SwiftUI screenshot: $SWIFTUI_SCREENSHOT
- SwiftUI full shot:  $SWIFTUI_FULL_SCREENSHOT

Create them before running the diff gate:
1. Save Figma MCP get_screenshot for the target node to:
   $FIGMA_SCREENSHOT
   Figma URL: $FIGMA_URL
   fileKey: $FIGMA_FILE_KEY
   nodeId: $FIGMA_NODE_ID
2. Run the SwiftUI preview filtered by '$PREVIEW_FILTER'.
3. Either save the simulator screenshot to:
   $SWIFTUI_FULL_SCREENSHOT
   or rerun with CAPTURE_SWIFTUI_SCREENSHOT=1 after the preview is visible.
4. The harness will normalize the full screenshot into:
   $SWIFTUI_SCREENSHOT

The harness intentionally stops here so "clean build" cannot be treated as design pass.
EOF
  exit 2
fi

swift run FigmaHarnessCLI diff \
  --screen "$SCREEN_SLUG" \
  --figma "$FIGMA_SCREENSHOT" \
  --swiftui "$SWIFTUI_SCREENSHOT" \
  --output-json "$DIFF_JSON" \
  --output-diff "$DIFF_PNG" \
  --manifest "$DIFF_MANIFEST" \
  --threshold "$DIFF_THRESHOLD" \
  --loop "$LOOP_INDEX" \
  --max-loops "$MAX_LOOPS"

cat <<EOF

Screenshot diff passed.

Artifacts:
- $FIGMA_SCREENSHOT
- $SWIFTUI_FULL_SCREENSHOT
- $SWIFTUI_SCREENSHOT
- $NORMALIZATION_JSON
- $COLOR_TOKEN_JSON
- $DIFF_PNG
- $DIFF_JSON

Figma source:
- $FIGMA_URL
- fileKey: $FIGMA_FILE_KEY
- nodeId: $FIGMA_NODE_ID

Preview helpers:

1. Resource probe
node /Users/jj.iee/.codex/plugins/cache/personal/build-ios-apps/0.1.2/skills/ios-simulator-browser/scripts/swiftui-preview-browser.mjs \\
  "$ROOT_DIR/Package.swift" \\
  --package-target SwiftUIPreviewTest \\
  --device "$SIMULATOR_ID" \\
  --preview-filter 'Resource Probe'

2. Card preview
node /Users/jj.iee/.codex/plugins/cache/personal/build-ios-apps/0.1.2/skills/ios-simulator-browser/scripts/swiftui-preview-browser.mjs \\
  "$ROOT_DIR/Package.swift" \\
  --package-target SwiftUIPreviewTest \\
  --device "$SIMULATOR_ID" \\
  --preview-filter "$PREVIEW_FILTER"

3. Browser mirror
SIM="$SIMULATOR_ID" npx --yes serve-sim@latest -p 3201 "$SIMULATOR_ID"
EOF
