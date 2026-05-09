import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Radio } from "./Radio";

describe("Radio", () => {
  it("maps enabled status to a checked radio", () => {
    render(<Radio aria-label="Selected option" status="enabled" />);

    const radio = screen.getByRole("radio", { name: "Selected option" });
    expect(radio).toHaveAttribute("aria-checked", "true");
    expect(radio).toHaveAttribute("data-status", "enabled");
  });

  it("disables interaction for disabled status", () => {
    render(<Radio aria-label="Unavailable option" status="disabled" />);

    expect(screen.getByRole("radio", { name: "Unavailable option" })).toBeDisabled();
  });
});
