import { render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { Snackbar } from "./Snackbar";

const snackbarCss = readFileSync(join(process.cwd(), "src/components/Snackbar/Snackbar.css"), "utf8");

describe("Snackbar", () => {
  it("renders the Figma default contract", () => {
    render(<Snackbar data-testid="snackbar" />);

    const snackbar = screen.getByTestId("snackbar");

    expect(snackbar).toHaveTextContent("Translate it into the following language.");
    expect(snackbar).toHaveTextContent("Retry");
    expect(snackbar).toHaveAttribute("data-mode", "default");
    expect(snackbar).toHaveAttribute("data-icon", "false");
    expect(snackbar).toHaveAttribute("role", "status");
    expect(snackbar).toHaveAttribute("aria-live", "polite");
    expect(snackbar.querySelector(".chord-snackbar__icon")).toBeNull();
  });

  it("supports fixed mode and optional icon replacement slot", () => {
    render(<Snackbar mode="fixed" icon iconSlot={<svg aria-label="question icon" />} data-testid="snackbar" />);

    const snackbar = screen.getByTestId("snackbar");

    expect(snackbar).toHaveAttribute("data-mode", "fixed");
    expect(snackbar).toHaveAttribute("data-icon", "true");
    expect(screen.getByLabelText("question icon")).toBeInTheDocument();
  });

  it("uses the mapped DS question icon when no icon slot is supplied", () => {
    render(<Snackbar icon data-testid="snackbar" />);

    expect(screen.getByTestId("snackbar-default-icon")).toHaveAttribute("data-icon-name", "questionMarkMedium");
    expect(snackbarCss).not.toContain("chord-snackbar__icon-placeholder");
  });

  it("uses the visible action label without adding the hidden Cancel label", () => {
    render(<Snackbar actionLabel="Undo" data-testid="snackbar" />);

    expect(screen.getByText("Undo")).toBeInTheDocument();
    expect(screen.queryByText("Cancel")).toBeNull();
  });
});

describe("Snackbar CSS contract", () => {
  it("keeps runtime sizing responsive while matching the default sample story", () => {
    expect(snackbarCss).not.toMatch(/min-inline-size:\s*373px/);
    expect(snackbarCss).toMatch(/--snackbar-max-inline-size:\s*410px/);
    expect(snackbarCss).toMatch(/--snackbar-sample-inline-size:\s*373px/);
    expect(snackbarCss).toMatch(/--snackbar-default-sample-block-size:\s*44px/);
    expect(snackbarCss).toMatch(/-webkit-line-clamp:\s*3/);
  });

  it("uses the alpha background token without extra opacity", () => {
    expect(snackbarCss).toContain("--cds-system-color-surface-default-reverse-600a-unequal");
    expect(snackbarCss).not.toMatch(/opacity:\s*0\.8/);
  });

  it("uses the Figma system alias font before generic typography fallback", () => {
    expect(snackbarCss).toContain('"WeGothicSans"');
    expect(snackbarCss.indexOf('"WeGothicSans"')).toBeLessThan(
      snackbarCss.indexOf("var(--cds-typography-default-font-family-body"),
    );
  });
});
