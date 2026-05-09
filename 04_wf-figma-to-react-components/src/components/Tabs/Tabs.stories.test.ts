import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import meta from "./Tabs.stories";

const storiesSource = readFileSync(
  join(process.cwd(), "src/components/Tabs/Tabs.stories.tsx"),
  "utf8",
);

describe("Tabs stories contract", () => {
  it("controls.include lists only figma-facing props", () => {
    const include = meta.parameters?.controls?.include ?? [];
    expect(include).toContain("mode");
    expect(include).toContain("style");
    expect(include).toContain("type");
    expect(include).toContain("size");
    expect(include).toContain("showExpandButton");
  });

  it("controls.include does not expose consumer props", () => {
    const include = meta.parameters?.controls?.include ?? [];
    expect(include).not.toContain("tabItems");
    expect(include).not.toContain("selectedIndex");
    expect(include).not.toContain("onTabChange");
  });

  it("argTypes define mode, style, type, size controls", () => {
    const keys = Object.keys(meta.argTypes ?? {});
    expect(keys).toContain("mode");
    expect(keys).toContain("style");
    expect(keys).toContain("type");
    expect(keys).toContain("size");
  });

  it("uses a local 3x visual baseline for FigmaCompare", () => {
    expect(storiesSource).toContain("../../figma/baselines/tabs-bar-default@3x.png");
    expect(storiesSource).not.toContain("figma-alpha-api");
  });
});
