import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import meta from "./TitleHeader.stories";

const storiesSource = readFileSync(
  join(process.cwd(), "src/components/TitleHeader/TitleHeader.stories.tsx"),
  "utf8",
);

describe("TitleHeader stories contract", () => {
  it("controls.include lists only figma-facing props", () => {
    const include = meta.parameters?.controls?.include ?? [];
    expect(include).toContain("mode");
    expect(include).toContain("align");
    expect(include).toContain("showLeading");
    expect(include).toContain("showSubTitle");
    expect(include).toContain("showTrailing");
    expect(include).toContain("showTitleBadge");
  });

  it("controls.include does not expose text label props", () => {
    const include = meta.parameters?.controls?.include ?? [];
    expect(include).not.toContain("titleLabel");
    expect(include).not.toContain("subTitleLabel");
    expect(include).not.toContain("trailingLabel");
  });

  it("controls.include does not expose slot props", () => {
    const include = meta.parameters?.controls?.include ?? [];
    expect(include).not.toContain("leadingSlot");
    expect(include).not.toContain("trailingSlot");
    expect(include).not.toContain("badge1Slot");
  });

  it("argTypes define mode and align controls", () => {
    const keys = Object.keys(meta.argTypes ?? {});
    expect(keys).toContain("mode");
    expect(keys).toContain("align");
  });

  it("uses a local 3x visual baseline for FigmaCompare", () => {
    expect(storiesSource).toContain("../../figma/baselines/title-header-default@3x.png");
    expect(storiesSource).not.toContain("figma-alpha-api");
  });
});
