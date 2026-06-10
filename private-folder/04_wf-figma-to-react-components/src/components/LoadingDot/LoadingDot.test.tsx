import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LoadingDot, normalizeLoadingDotColor } from "./LoadingDot";

describe("LoadingDot", () => {
  it("renders the Figma default contract", () => {
    render(<LoadingDot data-testid="loading-dot" />);

    const loading = screen.getByTestId("loading-dot");

    expect(loading).toHaveAttribute("data-mode", "default");
    expect(loading).toHaveAttribute("data-size", "medium");
    expect(loading).toHaveAttribute("data-color", "primary");
    expect(loading).toHaveAttribute("data-animated", "false");
    expect(loading).toHaveAttribute("aria-hidden", "true");
  });

  it("normalizes invalid medium white combination to primary", () => {
    expect(normalizeLoadingDotColor("medium", "white")).toBe("primary");

    render(<LoadingDot color="white" data-testid="loading-dot" />);

    expect(screen.getByTestId("loading-dot")).toHaveAttribute("data-color", "primary");
  });

  it("keeps explicit accessibility labels visible to assistive tech", () => {
    render(<LoadingDot aria-label="로딩 중" data-testid="loading-dot" />);

    expect(screen.getByTestId("loading-dot")).not.toHaveAttribute("aria-hidden");
  });
});
