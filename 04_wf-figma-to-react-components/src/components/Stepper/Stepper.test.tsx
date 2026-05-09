import { fireEvent, render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";

import { normalizeStepperLabel, Stepper } from "./Stepper";

const stepperCss = readFileSync(join(process.cwd(), "src/components/Stepper/Stepper.css"), "utf8");

describe("normalizeStepperLabel", () => {
  it("keeps the visible value within the two-digit usage contract", () => {
    expect(normalizeStepperLabel("123")).toBe("12");
    expect(normalizeStepperLabel("a9b8")).toBe("98");
    expect(normalizeStepperLabel("")).toBe("0");
  });
});

describe("Stepper", () => {
  it("renders the Figma default state with subtract disabled and add enabled", () => {
    render(<Stepper data-testid="stepper" />);

    expect(screen.getByTestId("stepper")).toHaveAttribute("data-state", "default");
    expect(screen.getByRole("button", { name: /decrease/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /increase/i })).not.toBeDisabled();
    expect(screen.getByText("99")).toBeInTheDocument();
  });

  it("supports enabled and disabled state behavior", () => {
    const onDecrement = vi.fn();
    const onIncrement = vi.fn();
    render(<Stepper state="enabled" onDecrement={onDecrement} onIncrement={onIncrement} label="12" />);

    fireEvent.click(screen.getByRole("button", { name: /decrease/i }));
    fireEvent.click(screen.getByRole("button", { name: /increase/i }));

    expect(onDecrement).toHaveBeenCalledTimes(1);
    expect(onIncrement).toHaveBeenCalledTimes(1);
  });

  it("accepts DS icon slots without replacing icons with text glyphs", () => {
    render(
      <Stepper
        addIconSlot={<svg aria-label="add asset" />}
        subtractIconSlot={<svg aria-label="subtract asset" />}
        state="enabled"
      />,
    );

    expect(screen.getByLabelText("add asset")).toBeInTheDocument();
    expect(screen.getByLabelText("subtract asset")).toBeInTheDocument();
  });

  it("uses mapped DS icons for the default add and subtract controls", () => {
    render(<Stepper state="enabled" />);

    expect(screen.getByTestId("stepper-subtract-icon")).toHaveAttribute("data-icon-name", "subtractMedium");
    expect(screen.getByTestId("stepper-add-icon")).toHaveAttribute("data-icon-name", "addMedium");
  });
});

describe("Stepper CSS contract", () => {
  it("keeps the fixed 104x28 frame and 28/48/28 regions", () => {
    expect(stepperCss).toContain("inline-size: 104px");
    expect(stepperCss).toContain("block-size: 28px");
    expect(stepperCss).toContain("grid-template-columns: 28px 48px 28px");
  });

  it("uses tokenized alpha colors without extra opacity and keeps icon area at 16x16", () => {
    expect(stepperCss).toContain("--cds-system-color-outline-default-200a");
    expect(stepperCss).toContain("--cds-system-color-icon-200a");
    expect(stepperCss).not.toMatch(/opacity:\s*0\./);
    expect(stepperCss).toContain("block-size: 16px");
    expect(stepperCss).toContain("inline-size: 16px");
    expect(stepperCss).not.toContain("chord-stepper__icon-svg path");
  });
});
