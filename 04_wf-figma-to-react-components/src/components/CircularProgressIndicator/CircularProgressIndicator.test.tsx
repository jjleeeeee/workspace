import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CircularProgressIndicator, clampCircularProgress } from "./CircularProgressIndicator";

describe("CircularProgressIndicator", () => {
  it("renders the Figma default contract", () => {
    render(<CircularProgressIndicator data-testid="progress" />);

    const progress = screen.getByTestId("progress");

    expect(progress).toHaveAttribute("data-mode", "default");
    expect(progress).toHaveAttribute("data-button", "true");
    expect(progress).toHaveAttribute("aria-hidden", "true");
  });

  it("clamps progress values", () => {
    expect(clampCircularProgress(-1)).toBe(0);
    expect(clampCircularProgress(2)).toBe(1);
    expect(clampCircularProgress(Number.NaN)).toBe(0.75);
  });

  it("renders the exported nested cancel asset by default", () => {
    render(<CircularProgressIndicator button data-testid="progress" />);

    expect(screen.getByTestId("progress").querySelector(".chord-circular-progress-indicator__button")).toBeInTheDocument();
    expect(screen.queryByTestId("circular-progress-cancel-icon")).not.toBeInTheDocument();
    expect(screen.getByTestId("progress").querySelector("img")).toHaveAttribute(
      "data-asset-source",
      "figma:81407:905664",
    );
  });
});
