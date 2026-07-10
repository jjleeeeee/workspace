import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it, expect } from "vitest";

const TOKENS_CSS = resolve(__dirname, "../src/styles/tokens.css");

function readTokens() {
  return readFileSync(TOKENS_CSS, "utf8");
}

function getVar(css: string, name: string): string | null {
  const re = new RegExp(`${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}:\\s*([^;\\n]+)[;\\n]`);
  return css.match(re)?.[1]?.trim() ?? null;
}

describe("tokens.css", () => {
  it("file exists and is committed", () => {
    expect(existsSync(TOKENS_CSS)).toBe(true);
  });

  it("was generated (not empty or placeholder)", () => {
    const css = readTokens();
    expect(css.length).toBeGreaterThan(1000);
    expect(css).toContain("--cds-");
  });

  // Canonical token snapshot — catches accidental token drift.
  // Values come from committed src/styles/tokens.css; update here if tokens intentionally change.
  it("canonical typography tokens are present", () => {
    const css = readTokens();
    expect(getVar(css, "--cds-typography-default-base-text-size-text-100")).toBe("13px");
    expect(getVar(css, "--cds-typography-circular-base-text-size-text-100")).toBe("14px");
    expect(getVar(css, "--cds-typography-default-base-lineheight-text-lineheight-100")).toBe("17px");
  });

  it("canonical color tokens are present", () => {
    const css = readTokens();
    expect(getVar(css, "--cds-system-color-button-default")).toBe("#00CBD5");
    expect(getVar(css, "--cds-system-color-button-black")).toBe("#000000");
  });

  it("has both light and dark theme blocks", () => {
    const css = readTokens();
    expect(css).toContain("data-theme='light'");
    expect(css).toContain("data-theme='dark'");
  });
});
