import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ToggleSwitch } from "./ToggleSwitch";

describe("ToggleSwitch", () => {
  it("renders checked switch state with OS and size attributes", () => {
    render(<ToggleSwitch aria-label="Notifications" os="aos" size="small" status="on" />);

    const toggle = screen.getByRole("switch", { name: "Notifications" });
    expect(toggle).toHaveAttribute("aria-checked", "true");
    expect(toggle).toHaveAttribute("data-os", "aos");
    expect(toggle).toHaveAttribute("data-size", "small");
  });

  it("disables interaction for disabled status", () => {
    render(<ToggleSwitch aria-label="Muted setting" status="disabled" />);

    expect(screen.getByRole("switch", { name: "Muted setting" })).toBeDisabled();
  });
});
