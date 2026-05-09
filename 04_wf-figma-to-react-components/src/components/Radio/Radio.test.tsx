import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Radio, resolveRadioStatus } from "./Radio";

describe("Radio", () => {
  it("renders the Figma default contract", () => {
    render(<Radio aria-label="선택" data-testid="radio" />);

    const radio = screen.getByTestId("radio");

    expect(radio).toHaveAttribute("data-mode", "default");
    expect(radio).toHaveAttribute("data-status", "default");
    expect(radio).toHaveAttribute("role", "radio");
    expect(radio).toHaveAttribute("aria-checked", "false");
  });

  it("resolves checked and disabled state", () => {
    expect(resolveRadioStatus(undefined, true, false)).toBe("enabled");
    expect(resolveRadioStatus(undefined, false, true)).toBe("disabled");
    expect(resolveRadioStatus("default", true, true)).toBe("default");
  });

  it("disables interaction for disabled status", () => {
    render(<Radio aria-label="선택" status="disabled" data-testid="radio" />);

    expect(screen.getByTestId("radio")).toBeDisabled();
  });
});
