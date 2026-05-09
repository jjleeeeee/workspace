import { describe, expect, it } from "vitest";

import meta from "./Thumbnail.stories";
import * as stories from "./Thumbnail.stories";

describe("Thumbnail stories", () => {
  it("exposes parent props and owned nested enum props in Playground controls", () => {
    expect(Object.keys(meta.argTypes ?? {}).sort()).toEqual([
      "button",
      "buttonType",
      "fill",
      "leftItem",
      "leftItemShowTag",
      "leftItemType",
      "radius",
      "ratio",
      "rightItemBottom",
      "rightItemBottomShowIcon",
      "rightItemBottomType",
      "rightItemTop",
      "rightItemTopType",
      "seekBar",
    ]);
    expect(meta.parameters?.controls).toEqual({
      include: [
        "button",
        "buttonType",
        "fill",
        "leftItem",
        "leftItemShowTag",
        "leftItemType",
        "radius",
        "ratio",
        "rightItemBottom",
        "rightItemBottomShowIcon",
        "rightItemBottomType",
        "rightItemTop",
        "rightItemTopType",
        "seekBar",
      ],
    });
  });

  it("documents nested enums without adding parent composition examples", () => {
    expect(Object.keys(stories)).toContain("NestedEnums");
    expect(Object.keys(stories)).not.toContain("ListItemUsage");
  });

  it("uses the Figma placeholder fallback instead of inline generated media", () => {
    const src = (meta.args as { src?: string }).src ?? "";

    expect(src).toBe("");
    expect(src).not.toContain("data:image/svg+xml");
  });

  it("wires a concrete Figma reference image into FigmaCompare", () => {
    const storySource = stories.FigmaCompare.render?.toString() ?? "";

    expect(storySource).toContain("thumbnailBaseline");
    expect(storySource).toContain("Figma reference: 60779:56301");
  });
});
