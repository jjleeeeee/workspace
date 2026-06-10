import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { resolveToggleSwitchStatus, ToggleSwitch } from "./ToggleSwitch";

describe("ToggleSwitch", () => {
  it("renders the Figma default contract", () => {
    render(<ToggleSwitch aria-label="설정" data-testid="toggle" />);

    const toggle = screen.getByTestId("toggle");

    expect(toggle).toHaveAttribute("data-mode", "default");
    expect(toggle).toHaveAttribute("data-platform", "ios");
    expect(toggle).toHaveAttribute("data-size", "medium");
    expect(toggle).toHaveAttribute("data-status", "default");
    expect(toggle).toHaveAttribute("role", "switch");
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });

  it("resolves checked and disabled state", () => {
    expect(resolveToggleSwitchStatus(undefined, true, false)).toBe("enabled");
    expect(resolveToggleSwitchStatus(undefined, false, true)).toBe("disabled");
    expect(resolveToggleSwitchStatus("default", true, true)).toBe("default");
  });

  it("disables interaction for disabled status", () => {
    render(<ToggleSwitch aria-label="설정" status="disabled" data-testid="toggle" />);

    expect(screen.getByTestId("toggle")).toBeDisabled();
  });
});
