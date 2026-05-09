import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { IconButton } from "./IconButton";

describe("IconButton", () => {
  it("renders an accessible icon-only button with Figma variant attributes", () => {
    render(<IconButton aria-label="Open settings" buttonColor="black" radius="on" size="small" state="disabled" variant="outlined" />);

    const button = screen.getByRole("button", { name: "Open settings" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("data-size", "small");
    expect(button).toHaveAttribute("data-state", "disabled");
    expect(button).toHaveAttribute("data-variant", "outlined");
  });
});
