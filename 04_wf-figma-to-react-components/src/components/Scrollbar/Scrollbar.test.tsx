import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Scrollbar } from "./Scrollbar";

describe("Scrollbar", () => {
  it("renders the Figma default contract", () => {
    render(<Scrollbar data-testid="scrollbar" />);

    const scrollbar = screen.getByTestId("scrollbar");

    expect(scrollbar).toHaveAttribute("data-mode", "default");
    expect(scrollbar.querySelector(".chord-scrollbar__thumb")).not.toBeNull();
  });

  it("supports fixed modes", () => {
    render(<Scrollbar data-testid="scrollbar" mode="fixed-white" />);

    expect(screen.getByTestId("scrollbar")).toHaveAttribute("data-mode", "fixed-white");
  });
});
