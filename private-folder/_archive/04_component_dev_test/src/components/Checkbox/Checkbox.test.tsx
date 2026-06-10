import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("maps enabled status to a checked checkbox and exposes shape", () => {
    render(<Checkbox aria-label="Agree" shape="square" status="enabled" />);

    const checkbox = screen.getByRole("checkbox", { name: "Agree" });
    expect(checkbox).toHaveAttribute("aria-checked", "true");
    expect(checkbox).toHaveAttribute("data-shape", "square");
  });

  it("disables interaction for disabled status", () => {
    render(<Checkbox aria-label="Disabled choice" status="disabled" />);

    expect(screen.getByRole("checkbox", { name: "Disabled choice" })).toBeDisabled();
  });
});
