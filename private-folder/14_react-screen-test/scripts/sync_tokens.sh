#!/usr/bin/env bash
# Regenerates src/styles/tokens.css from Chord Design System token JSON.
# The output file is committed — this script is optional, run when tokens change.
#
# Usage:
#   bash scripts/sync_tokens.sh
#   bash scripts/sync_tokens.sh --tokens-dir /path/to/tokens
#   CHORD_TOKENS_DIR=/path/to/tokens bash scripts/sync_tokens.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
TOKENS_DIR="${CHORD_TOKENS_DIR:-/Users/jj.iee/Desktop/chord-design-system/tokens}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --tokens-dir)
      TOKENS_DIR="$2"
      shift 2
      ;;
    *)
      shift
      ;;
  esac
done

if [[ ! -d "$TOKENS_DIR" ]]; then
  printf >&2 '\nError: Chord Design System tokens directory not found:\n  %s\n\nSet CHORD_TOKENS_DIR or pass --tokens-dir <path>.\nExample:\n  CHORD_TOKENS_DIR=/Users/jj.iee/Desktop/chord-design-system/tokens bash scripts/sync_tokens.sh\n\n' "$TOKENS_DIR"
  exit 2
fi

echo "sync_tokens: reading from $TOKENS_DIR"
node "$SCRIPT_DIR/build-tokens.mjs" \
  --tokens-dir "$TOKENS_DIR" \
  --output "$ROOT_DIR/src/styles/tokens.css"
echo "sync_tokens: done — src/styles/tokens.css updated"
