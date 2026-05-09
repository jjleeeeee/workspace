import { render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { Tooltip } from "./Tooltip";

const tooltipCss = readFileSync(join(process.cwd(), "src/components/Tooltip/Tooltip.css"), "utf8");

describe("Tooltip", () => {
  it("renders the Figma default contract", () => {
    render(<Tooltip data-testid="tooltip" />);

    const tooltip = screen.getByTestId("tooltip");

    expect(tooltip).toHaveAttribute("data-mode", "default");
    expect(tooltip).toHaveAttribute("data-size", "large");
    expect(tooltip).toHaveAttribute("data-color", "black");
    expect(tooltip).toHaveAttribute("data-position", "bottom-center");
    expect(tooltip).toHaveAttribute("data-button-close", "true");
    expect(screen.getByRole("button", { name: "Close tooltip" })).toBeInTheDocument();
  });

  it("supports hiding the close button", () => {
    render(<Tooltip buttonClose={false} label="No close" />);

    expect(screen.queryByRole("button", { name: "Close tooltip" })).toBeNull();
    expect(screen.getByText("No close")).toBeInTheDocument();
  });

  it("keeps Tooltip sizing content-driven instead of promoting the Figma sample width", () => {
    render(<Tooltip label="짧음" data-testid="short-tooltip" />);
    render(
      <Tooltip
        buttonClose={false}
        label="긴 문장은 최대 너비 안에서 줄바꿈되어야 하고 샘플 렌더 폭을 최소 너비로 강제하지 않는다"
        data-testid="long-tooltip"
      />,
    );

    expect(screen.getByTestId("short-tooltip")).toHaveAttribute("data-button-close", "true");
    expect(screen.getByTestId("long-tooltip")).toHaveAttribute("data-button-close", "false");
    expect(tooltipCss).not.toMatch(/min-inline-size:\s*225px/);
    expect(tooltipCss).toMatch(/max-inline-size:\s*240px/);
    expect(tooltipCss).toMatch(/-webkit-line-clamp:\s*8/);
  });

  it("uses the Figma system alias font before generic typography fallback", () => {
    expect(tooltipCss).toContain('"WeGothicSans"');
    expect(tooltipCss.indexOf('"WeGothicSans"')).toBeLessThan(tooltipCss.indexOf("var(--cds-typography-default-font-family-body"));
  });

  it("uses the mapped DS close icon for the close button", () => {
    render(<Tooltip />);

    expect(screen.getByTestId("tooltip-close-icon")).toHaveAttribute("data-icon-name", "closeMedium");
    expect(tooltipCss).not.toContain("stroke-width: 1.5");
  });

  it("uses primary-100 for fixed+tint non-bottom-center and secondary-blue only for bottom-center per Figma", () => {
    // Base fixed+tint rule must reference primary-100 (covers all 7 non-bottom-center positions)
    expect(tooltipCss).toMatch(
      /\.chord-tooltip\[data-mode="fixed"\]\[data-color="tint"\]\s*\{[^}]*--cds-system-fixed-color-surface-primary-100/s,
    );
    // Bottom Center must be a separate override using secondary-blue
    expect(tooltipCss).toMatch(
      /\.chord-tooltip\[data-mode="fixed"\]\[data-color="tint"\]\[data-position="bottom-center"\][^{]*\{[^}]*--cds-system-fixed-color-roles-secondary-blue/s,
    );
  });
});
