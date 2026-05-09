import { render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { normalizeTextButtonColor, TextButton } from "./TextButton";

const textButtonCss = readFileSync(join(process.cwd(), "src/components/TextButton/TextButton.css"), "utf8");

describe("TextButton", () => {
  it("renders Figma-facing variant props as stable data attributes", () => {
    render(
      <TextButton buttonColor="black" buttonType="outlinedColor" radius="on" size="large" status="hover">
        Text
      </TextButton>,
    );

    const button = screen.getByRole("button", { name: "Text" });
    expect(button).toHaveAttribute("data-mode", "default");
    expect(button).toHaveAttribute("data-button-type", "outlinedColor");
    expect(button).toHaveAttribute("data-button-color", "black");
    expect(button).toHaveAttribute("data-radius", "on");
    expect(button).toHaveAttribute("data-size", "large");
    expect(button).toHaveAttribute("data-status", "hover");
  });

  it("disables native button interaction for disabled status", () => {
    render(<TextButton status="disabled">Text</TextButton>);

    expect(screen.getByRole("button", { name: "Text" })).toBeDisabled();
  });

  it("replaces normal content with loading indication", () => {
    render(
      <TextButton aria-label="Submitting" status="loading">
        Submit
      </TextButton>,
    );

    const button = screen.getByRole("button", { name: "Submitting" });
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveAttribute("data-status", "loading");
    expect(screen.queryByText("Submit")).not.toBeInTheDocument();
    expect(screen.getByTestId("text-button-loading")).toBeInTheDocument();
  });

  it("normalizes unsupported black color combinations to default", () => {
    expect(normalizeTextButtonColor("filled", "black")).toBe("black");
    expect(normalizeTextButtonColor("outlinedColor", "black")).toBe("black");
    expect(normalizeTextButtonColor("outlinedGray", "black")).toBe("default");
    expect(normalizeTextButtonColor("ghost", "black")).toBe("default");
  });

  it("uses the Figma system alias font before generic typography fallback", () => {
    expect(textButtonCss).toContain('"WeGothicSans"');
    expect(textButtonCss.indexOf('"WeGothicSans"')).toBeLessThan(
      textButtonCss.indexOf("var(--cds-typography-default-font-family-body"),
    );
  });

  it("renders nullMedium icon for unresolved optional icon slots", () => {
    const { container } = render(
      <TextButton optionLeading optionTrailing>
        Text
      </TextButton>,
    );

    const nullIcons = container.querySelectorAll('[data-icon-name="nullMedium"]');
    expect(nullIcons.length).toBeGreaterThanOrEqual(2);
  });
});
