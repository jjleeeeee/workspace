import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ScrimOverlay } from "./ScrimOverlay";

describe("ScrimOverlay", () => {
  it("renders the Figma default contract", () => {
    render(<ScrimOverlay data-testid="scrim" />);

    const scrim = screen.getByTestId("scrim");

    expect(scrim).toHaveAttribute("data-full-cover", "false");
    expect(scrim).toHaveAttribute("aria-hidden", "true");
  });

  it("supports implementation-only full cover sizing", () => {
    render(<ScrimOverlay data-testid="scrim" fullCover />);

    expect(screen.getByTestId("scrim")).toHaveAttribute("data-full-cover", "true");
  });
});
