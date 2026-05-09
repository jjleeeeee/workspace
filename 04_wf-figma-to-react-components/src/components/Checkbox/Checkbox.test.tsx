import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Checkbox, resolveCheckboxStatus } from "./Checkbox";

describe("Checkbox", () => {
  it("renders the Figma default contract", () => {
    render(<Checkbox aria-label="선택" data-testid="checkbox" />);

    const checkbox = screen.getByTestId("checkbox");

    expect(checkbox).toHaveAttribute("data-mode", "default");
    expect(checkbox).toHaveAttribute("data-type", "circle");
    expect(checkbox).toHaveAttribute("data-status", "default");
    expect(checkbox).toHaveAttribute("role", "checkbox");
    expect(checkbox).toHaveAttribute("aria-checked", "false");
  });

  it("resolves checked and disabled state", () => {
    expect(resolveCheckboxStatus(undefined, true, false)).toBe("enabled");
    expect(resolveCheckboxStatus(undefined, false, true)).toBe("disabled");
    expect(resolveCheckboxStatus("default", true, true)).toBe("default");
  });

  it("disables interaction for disabled status", () => {
    render(<Checkbox aria-label="선택" status="disabled" data-testid="checkbox" />);

    expect(screen.getByTestId("checkbox")).toBeDisabled();
  });

  it("uses the mapped DS check icon when checked", () => {
    render(<Checkbox aria-label="선택" checked data-testid="checkbox" />);

    expect(screen.getByTestId("checkbox-check-icon")).toHaveAttribute("data-icon-name", "checkMedium");
    expect(screen.getByTestId("checkbox-check-icon")).toHaveAttribute("data-icon-size", "16");
  });
});
