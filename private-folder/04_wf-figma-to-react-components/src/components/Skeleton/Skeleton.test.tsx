import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Skeleton } from "./Skeleton";

const skeletonCss = readFileSync(join(process.cwd(), "src/components/Skeleton/Skeleton.css"), "utf8");

describe("Skeleton", () => {
  it("renders the Figma default contract", () => {
    render(<Skeleton data-testid="skeleton" />);

    const skeleton = screen.getByTestId("skeleton");

    expect(skeleton).toHaveAttribute("data-mode", "default");
    expect(skeleton).toHaveAttribute("data-type", "rectangle");
    expect(skeleton).toHaveAttribute("data-size", "large");
    expect(skeleton).toHaveAttribute("aria-hidden", "true");
  });

  it("maps fixed line medium variant to data attributes", () => {
    render(<Skeleton mode="fixed" skeletonType="line" size="medium" data-testid="skeleton" />);

    const skeleton = screen.getByTestId("skeleton");

    expect(skeleton).toHaveAttribute("data-mode", "fixed");
    expect(skeleton).toHaveAttribute("data-type", "line");
    expect(skeleton).toHaveAttribute("data-size", "medium");
  });

  it("keeps explicit accessibility labels visible to assistive tech", () => {
    render(<Skeleton aria-label="콘텐츠 로딩 중" data-testid="skeleton" />);

    expect(screen.getByTestId("skeleton")).not.toHaveAttribute("aria-hidden");
  });
});

describe("Skeleton CSS contract", () => {
  it("defines shimmer keyframe animation on ::after", () => {
    expect(skeletonCss).toContain("chord-skeleton-shimmer");
    expect(skeletonCss).toContain("animation");
    expect(skeletonCss).toContain("translateX");
  });

  it("respects prefers-reduced-motion", () => {
    expect(skeletonCss).toContain("prefers-reduced-motion");
    expect(skeletonCss).toContain("animation: none");
  });
});
