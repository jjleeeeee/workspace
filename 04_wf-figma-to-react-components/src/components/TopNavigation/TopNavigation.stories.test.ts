import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import meta from "./TopNavigation.stories";

const storiesSource = readFileSync(
  join(process.cwd(), "src/components/TopNavigation/TopNavigation.stories.tsx"),
  "utf8",
);

describe("TopNavigation stories contract", () => {
  it("controls.include lists only figma-facing props", () => {
    const include = meta.parameters?.controls?.include ?? [];
    expect(include).toContain("mode");
    expect(include).toContain("textType");
    expect(include).toContain("scrollBg");
    expect(include).toContain("showSubTitle");
    expect(include).toContain("showLeading");
    expect(include).toContain("showTrailing");
    expect(include).toContain("showOfficialBadge");
  });

  it("controls.include does not expose consumer props", () => {
    const include = meta.parameters?.controls?.include ?? [];
    expect(include).not.toContain("titleLabel");
    expect(include).not.toContain("subTitleLabel");
    expect(include).not.toContain("leadingSlot");
    expect(include).not.toContain("trailingSlot");
    expect(include).not.toContain("imageSlot");
    expect(include).not.toContain("logoSlot");
  });

  it("argTypes define mode, textType, scrollBg controls", () => {
    const keys = Object.keys(meta.argTypes ?? {});
    expect(keys).toContain("mode");
    expect(keys).toContain("textType");
    expect(keys).toContain("scrollBg");
  });

  it("uses a local 3x visual baseline for FigmaCompare", () => {
    expect(storiesSource).toContain("../../figma/baselines/top-navigation-center-default@3x.png");
    expect(storiesSource).not.toContain("figma-alpha-api");
  });
});
