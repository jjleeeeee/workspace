# Visual Diff Harness Decision

Date: 2026-05-05

## Decision

Use 1x local Figma layout baseline PNGs plus 3x local Figma visual baseline PNGs as the visual parity gate.

## Why

Browser smoke only proves that a Storybook story renders. It does not prove that the implementation matches Figma. The first visual review stories also scaled Figma images inconsistently, so manual review could be misleading.

## Rules

- `FigmaCompare` is manual review support, not pass/fail evidence.
- `visual:baseline` verifies 1x and 3x local PNG existence and dimensions.
- `visual:diff` runs a 1x size gate and a 3x pixel diff.
- Size mismatch is always a failure.
- Atom components get up to 3 fix/retest loops.
- Complex components get up to 5 fix/retest loops.
- Font rendering differences require 3x heatmap/report evidence before being recorded as a known limitation.

## First Result

- `BadgeDot`: passed.
- `Skeleton`: passed.
- `BadgeNumber`: failed due text rendering diff.
- `TextButton`: failed due width mismatch.

## Scale Policy Update

After reviewing the 1x baseline issue, the workflow now separates:

- 1x layout baseline for CSS px size gates.
- 3x visual baseline for pixel diff and heatmap review.

Updated result:

- `BadgeDot`: passed at 3x visual diff.
- `Skeleton`: passed at 3x visual diff.
- `BadgeNumber`: still failed, but diff improved from 14.9% at 1x to 5.48% at 3x.
- `TextButton`: still failed on size mismatch (`63x40` layout baseline vs `65x40` actual), so this is not a baseline blur issue.
