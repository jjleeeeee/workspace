#!/bin/bash
# Run Component MD quality harness for every component with fixtures.

set -u

HARNESS_DIR="$(dirname "$0")"
ROOT_DIR="$(cd "$HARNESS_DIR/.." && pwd)"
FAIL=0

for fixture_dir in "$HARNESS_DIR"/fixtures/*; do
    [ -d "$fixture_dir" ] || continue
    component="$(basename "$fixture_dir")"
    md_file="$ROOT_DIR/components/$component.md"

    if [ ! -f "$md_file" ]; then
        echo "SKIP: $component — missing $md_file"
        continue
    fi

    bash "$HARNESS_DIR/eval.sh" "$md_file"
    exit_code=$?
    if [ "$exit_code" -ne 0 ]; then
        FAIL=$((FAIL+1))
    fi
done

if [ "$FAIL" -eq 0 ]; then
    echo "ALL COMPONENT MD CHECKS PASS"
    exit 0
fi

echo "$FAIL COMPONENT MD CHECK(S) FAILED"
exit 1
