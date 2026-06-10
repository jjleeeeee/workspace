import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  clampProgress,
  LinearProgressIndicator,
  normalizeLinearProgressRounded,
} from "./LinearProgressIndicator";

describe("LinearProgressIndicator", () => {
  it("renders the Figma default contract", () => {
    render(<LinearProgressIndicator data-testid="progress" />);

    const progress = screen.getByTestId("progress");

    expect(progress).toHaveAttribute("data-mode", "default");
    expect(progress).toHaveAttribute("data-rounded", "off");
    expect(progress).toHaveAttribute("data-height", "default");
    expect(progress).toHaveAttribute("aria-hidden", "true");
  });

  it("clamps progress values", () => {
    expect(clampProgress(-1)).toBe(0);
    expect(clampProgress(2)).toBe(1);
    expect(clampProgress(Number.NaN)).toBe(0.19084);
  });

  it("normalizes invalid rounded height 4 combination", () => {
    expect(normalizeLinearProgressRounded("4", "on")).toBe("off");
  });

  it("exposes progressbar attributes when labeled", () => {
    render(<LinearProgressIndicator aria-label="업로드 진행률" progress={0.5} data-testid="progress" />);

    const progress = screen.getByTestId("progress");

    expect(progress).toHaveAttribute("role", "progressbar");
    expect(progress).toHaveAttribute("aria-valuenow", "50");
  });
});
