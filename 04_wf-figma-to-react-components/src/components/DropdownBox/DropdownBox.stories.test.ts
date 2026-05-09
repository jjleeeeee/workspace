import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import meta from "./DropdownBox.stories";

const storiesSource = readFileSync(
  join(process.cwd(), "src/components/DropdownBox/DropdownBox.stories.tsx"),
  "utf8",
);

describe("DropdownBox stories", () => {
  it("exposes only Figma-facing controls", () => {
    expect(Object.keys(meta.argTypes ?? {}).sort()).toEqual([
      "mode",
      "showBadgeDot",
      "showGuide",
      "showScrollbar",
      "showTitle",
      "state",
    ]);
  });

  it("default args match Figma prop defaults", () => {
    expect(meta.args.mode).toBe("default");
    expect(meta.args.state).toBe("default");
    expect(meta.args.showTitle).toBe(true);
    expect(meta.args.showGuide).toBe(true);
    expect(meta.args.showBadgeDot).toBe(true);
    expect(meta.args.showScrollbar).toBe(true);
  });

  it("controls include only exposes Figma-facing names", () => {
    const include = meta.parameters?.controls?.include ?? [];
    expect(include.sort()).toEqual(["mode", "showBadgeDot", "showGuide", "showScrollbar", "showTitle", "state"].sort());
    expect(include).not.toContain("titleLabel");
    expect(include).not.toContain("guideLabel");
    expect(include).not.toContain("textLabel");
    expect(include).not.toContain("children");
  });

  it("uses a local 3x visual baseline for FigmaCompare", () => {
    expect(storiesSource).toContain("../../figma/baselines/dropdown-box-default@3x.png");
    expect(storiesSource).not.toContain("figma-alpha-api");
  });
});
