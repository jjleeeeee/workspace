#!/bin/bash
# Component MD 품질 검증 하네스 (canonical)
# 사용법:
#   bash harness/eval.sh components/{name}.md

MD_FILE="${1:-components/avatar.md}"
DOC_NAME=$(basename "$MD_FILE" .md)
COMPONENT="$DOC_NAME"
HARNESS_DIR="$(dirname "$0")"
FIXTURE_DIR="$HARNESS_DIR/fixtures/$COMPONENT"
TESTS_DIR="$HARNESS_DIR/tests"

echo "========================================"
echo "  Component MD Quality Harness"
echo "  Component: $COMPONENT"
echo "  Document: $DOC_NAME"
echo "  Profile: yaml-contract+markdown-guidance"
echo "  Target: $MD_FILE"
echo "  Fixtures: $FIXTURE_DIR"
echo "========================================"

PASS=0; FAIL=0

run_check() {
    local result
    result=$(python3 "$1" "${@:2}" 2>&1)
    local exit_code=$?
    echo "$result"
    if [ $exit_code -eq 0 ]; then PASS=$((PASS+1)); else FAIL=$((FAIL+1)); fi
}

# Stitch-style design checks
run_check "$TESTS_DIR/check_design_sections.py" "$MD_FILE"
run_check "$TESTS_DIR/check_agent_guidance.py" "$MD_FILE"
run_check "$TESTS_DIR/check_contract_scope.py" "$MD_FILE"

# Figma fact checks
run_check "$TESTS_DIR/check_variants.py"  "$MD_FILE" "$FIXTURE_DIR/variants.json"
run_check "$TESTS_DIR/check_tokens.py"    "$MD_FILE" "$FIXTURE_DIR/tokens.json"

# 선택 체크 (fixture 파일이 있을 때만 실행)
[ -f "$FIXTURE_DIR/sizes.json" ] && \
    run_check "$TESTS_DIR/check_sizes.py" "$MD_FILE" "$FIXTURE_DIR/sizes.json"

[ -f "$FIXTURE_DIR/variants_rest.json" ] && \
    run_check "$TESTS_DIR/check_sources.py" "$MD_FILE" "$FIXTURE_DIR/variants.json" "$FIXTURE_DIR/variants_rest.json"

echo "----------------------------------------"
TOTAL=$((PASS+FAIL))
SCORE=$(echo "scale=0; $PASS * 100 / $TOTAL" | bc)
echo "SCORE: $SCORE/100  ($PASS/$TOTAL checks passed)"
[ "$SCORE" -ge 95 ] && echo "RESULT: PASS ✓" || echo "RESULT: FAIL ✗"
[ "$SCORE" -ge 95 ] && exit 0 || exit 1
