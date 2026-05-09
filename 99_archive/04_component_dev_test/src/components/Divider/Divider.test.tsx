import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Divider } from "./Divider";

describe("Divider", () => {
  it("exposes mode, height, and style variant as stable data attributes", () => {
    render(<Divider mode="fixed" height="8" styleVariant="default-50a-2" />);

    const divider = screen.getByRole("separator");
    expect(divider).toHaveAttribute("data-mode", "fixed");
    expect(divider).toHaveAttribute("data-height", "8");
    expect(divider).toHaveAttribute("data-style-variant", "default-50a-2");
  });
});
