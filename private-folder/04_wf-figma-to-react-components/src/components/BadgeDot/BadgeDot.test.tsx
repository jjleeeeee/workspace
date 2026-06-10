import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BadgeDot } from "./BadgeDot";

describe("BadgeDot", () => {
  it("renders the Figma default contract", () => {
    render(<BadgeDot data-testid="badge-dot" />);

    const badge = screen.getByTestId("badge-dot");

    expect(badge).toHaveAttribute("data-mode", "default");
    expect(badge).toHaveAttribute("data-size", "medium");
    expect(badge).toHaveAttribute("data-outline", "off");
    expect(badge).toHaveAttribute("aria-hidden", "true");
  });

  it("maps fixed large outline variant to data attributes", () => {
    render(<BadgeDot mode="fixed" size="large" outline="on" data-testid="badge-dot" />);

    const badge = screen.getByTestId("badge-dot");

    expect(badge).toHaveAttribute("data-mode", "fixed");
    expect(badge).toHaveAttribute("data-size", "large");
    expect(badge).toHaveAttribute("data-outline", "on");
  });

  it("keeps explicit accessibility labels visible to assistive tech", () => {
    render(<BadgeDot aria-label="새 알림" data-testid="badge-dot" />);

    expect(screen.getByTestId("badge-dot")).not.toHaveAttribute("aria-hidden");
  });
});
