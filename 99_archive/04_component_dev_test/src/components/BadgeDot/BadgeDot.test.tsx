import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BadgeDot } from "./BadgeDot";

describe("BadgeDot", () => {
  it("exposes size, outline, and mode as stable data attributes", () => {
    render(<BadgeDot aria-label="unread" mode="fixed" outline="on" size="large" />);

    const dot = screen.getByLabelText("unread");
    expect(dot).toHaveAttribute("data-size", "large");
    expect(dot).toHaveAttribute("data-outline", "on");
    expect(dot).toHaveAttribute("data-mode", "fixed");
  });
});
