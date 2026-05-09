import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScrimOverlay } from "./ScrimOverlay";

describe("ScrimOverlay", () => {
  it("renders a presentation overlay with the requested opacity", () => {
    render(<ScrimOverlay aria-label="modal backdrop" opacity={0.72} />);

    const overlay = screen.getByLabelText("modal backdrop");
    expect(overlay).toHaveAttribute("role", "presentation");
    expect(overlay).toHaveStyle({ opacity: "0.72" });
  });
});
