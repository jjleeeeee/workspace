import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TextButton } from "./TextButton";

describe("TextButton", () => {
  it("renders variant props as stable attributes and supports disabled status", () => {
    render(
      <TextButton
        buttonColor="black"
        radius="on"
        size="large"
        status="disabled"
        variant="outlinedColor"
      >
        Buy now
      </TextButton>,
    );

    const button = screen.getByRole("button", { name: "Buy now" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("data-variant", "outlinedColor");
    expect(button).toHaveAttribute("data-size", "large");
    expect(button).toHaveAttribute("data-button-color", "black");
  });

  it("marks loading status as busy", () => {
    render(<TextButton status="loading">Loading</TextButton>);

    expect(screen.getByRole("button", { name: "Loading" })).toHaveAttribute("aria-busy", "true");
  });
});
