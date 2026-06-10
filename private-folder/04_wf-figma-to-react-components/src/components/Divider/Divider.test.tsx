import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Divider } from "./Divider";

describe("Divider", () => {
  it("renders the Figma default contract", () => {
    render(<Divider data-testid="divider" />);

    const divider = screen.getByTestId("divider");

    expect(divider).toHaveAttribute("data-mode", "default");
    expect(divider).toHaveAttribute("data-height", "1");
    expect(divider).toHaveAttribute("data-style", "default-50a");
    expect(divider).toHaveAttribute("role", "separator");
  });

  it("maps fixed secondary style", () => {
    render(<Divider data-testid="divider" dividerStyle="default-50a-2" height="8" mode="fixed" />);

    expect(screen.getByTestId("divider")).toHaveAttribute("data-style", "default-50a-2");
    expect(screen.getByTestId("divider")).toHaveAttribute("data-height", "8");
    expect(screen.getByTestId("divider")).toHaveAttribute("data-mode", "fixed");
  });
});
