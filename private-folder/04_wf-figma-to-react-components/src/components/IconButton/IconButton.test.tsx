import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { IconButton, resolveIconButtonDisabled } from "./IconButton";

describe("IconButton", () => {
  it("renders the Figma default contract", () => {
    render(<IconButton aria-label="Send" data-testid="button" />);

    const button = screen.getByTestId("button");

    expect(button).toHaveAttribute("data-mode", "default");
    expect(button).toHaveAttribute("data-button-type", "filled");
    expect(button).toHaveAttribute("data-size", "xlarge");
    expect(button).toHaveAttribute("data-radius", "off");
    expect(button).toHaveAttribute("data-button-color", "default");
    expect(button).toHaveAccessibleName("Send");
  });

  it("disables native button interaction for disabled status", () => {
    render(<IconButton aria-label="Disabled icon" status="disabled" />);

    expect(screen.getByRole("button", { name: "Disabled icon" })).toBeDisabled();
    expect(resolveIconButtonDisabled("disabled")).toBe(true);
  });

  it("allows replacing the nested icon slot", () => {
    render(<IconButton aria-label="Custom icon" icon={<span data-testid="custom-icon" />} />);

    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("uses the mapped DS send icon by default", () => {
    render(<IconButton aria-label="Send" />);

    expect(screen.getByTestId("icon-button-default-icon")).toHaveAttribute("data-icon-name", "sendMedium");
  });
});
