import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ScrimOverlay, scrimOverlayColorOptions } from "./ScrimOverlay";

describe("ScrimOverlay", () => {
  it("exposes the complete Figma variant axes", () => {
    expect(scrimOverlayColorOptions).toEqual(["50", "80"]);
  });

  it("renders the Figma default contract", () => {
    render(<ScrimOverlay data-testid="scrim" />);

    const scrim = screen.getByTestId("scrim");

    expect(scrim).toHaveAttribute("data-color", "50");
    expect(scrim).toHaveAttribute("data-full-cover", "false");
    expect(scrim).toHaveAttribute("aria-hidden", "true");
  });

  it("applies 80% dim color", () => {
    render(<ScrimOverlay color="80" data-testid="scrim" />);
    expect(screen.getByTestId("scrim")).toHaveAttribute("data-color", "80");
  });

  it("supports implementation-only full cover sizing", () => {
    render(<ScrimOverlay data-testid="scrim" fullCover />);
    expect(screen.getByTestId("scrim")).toHaveAttribute("data-full-cover", "true");
  });
});
