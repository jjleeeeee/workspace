import { render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { Toast } from "./Toast";

const toastCss = readFileSync(join(process.cwd(), "src/components/Toast/Toast.css"), "utf8");

describe("Toast", () => {
  it("renders the Figma default contract", () => {
    render(<Toast data-testid="toast" />);

    const toast = screen.getByTestId("toast");

    expect(toast).toHaveTextContent("Translate it into the following language.");
    expect(toast).toHaveAttribute("data-mode", "default");
    expect(toast).toHaveAttribute("role", "status");
    expect(toast).toHaveAttribute("aria-live", "polite");
  });

  it("supports fixed mode without adding non-contract actions", () => {
    render(<Toast mode="fixed" label="Saved" data-testid="toast" />);

    const toast = screen.getByTestId("toast");

    expect(toast).toHaveAttribute("data-mode", "fixed");
    expect(screen.queryByRole("button")).toBeNull();
    expect(toast.querySelector("svg")).toBeNull();
  });
});

describe("Toast CSS contract", () => {
  it("keeps sizing content-driven and clamps label to two lines", () => {
    expect(toastCss).not.toMatch(/min-inline-size:\s*293px/);
    expect(toastCss).toMatch(/--toast-max-inline-size:\s*410px/);
    expect(toastCss).toMatch(/max-inline-size:\s*min\(var\(--toast-max-inline-size\),\s*calc\(100vw - 20px\)\)/);
    expect(toastCss).toMatch(/-webkit-line-clamp:\s*2/);
  });

  it("uses the alpha background token without extra opacity", () => {
    expect(toastCss).toContain("--cds-system-color-surface-default-reverse-600a-unequal");
    expect(toastCss).not.toMatch(/opacity:\s*0\.8/);
  });

  it("uses the Figma system alias font before generic typography fallback", () => {
    expect(toastCss).toContain('"WeGothicSans"');
    expect(toastCss.indexOf('"WeGothicSans"')).toBeLessThan(toastCss.indexOf("var(--cds-typography-default-font-family-body"));
  });
});
