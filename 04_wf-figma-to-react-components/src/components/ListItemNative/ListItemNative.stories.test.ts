import { describe, expect, it } from "vitest";

import meta from "./ListItemNative.stories";
import * as stories from "./ListItemNative.stories";

describe("ListItemNative stories", () => {
  it("exposes only Figma axes and optional slot booleans as controls", () => {
    expect(Object.keys(meta.argTypes ?? {}).sort()).toEqual([
      "bodyLeadingIcon",
      "bodyTextColor",
      "bodyTextWeight",
      "leadingType",
      "mode",
      "showBodyText",
      "showDivider",
      "showMediumLeading",
      "showSmallLeading",
      "showTitleBadge",
      "showTrailing",
      "size",
      "status",
      "titleTextColor",
      "titleTextWeight",
      "trailingShowIcon",
      "trailingShowText",
      "trailingType",
    ]);
    expect(meta.parameters?.controls).toEqual({
      include: [
        "mode",
        "size",
        "status",
        "showDivider",
        "showTrailing",
        "showSmallLeading",
        "showMediumLeading",
        "leadingType",
        "showBodyText",
        "showTitleBadge",
        "bodyLeadingIcon",
        "titleTextWeight",
        "titleTextColor",
        "bodyTextWeight",
        "bodyTextColor",
        "trailingType",
        "trailingShowIcon",
        "trailingShowText",
      ],
    });
  });

  it("provides review stories without recreating public Leading or Trailing components", () => {
    expect(Object.keys(stories)).toEqual(
      expect.arrayContaining([
        "Playground",
        "Variants",
        "OptionalSlots",
        "ModuleBranches",
        "ContentBranches",
        "States",
        "TitleBadge",
        "LongText",
        "FigmaCompare",
      ]),
    );
    expect(Object.keys(stories).join(" ")).not.toMatch(/Leading|Trailing/);
  });

  it("provides a title badge placement check story for node 81275:904969", () => {
    expect(stories.TitleBadge.args).toMatchObject({
      leadingType: "avatar",
      showTitleBadge: true,
      trailingType: "iconButton",
    });
    expect(stories.TitleBadge.parameters?.docs?.description?.story).toContain("81275:904969");
    expect(stories.TitleBadge.parameters?.docs?.description?.story).toContain("4x22 wrapper frame");
  });

  it("provides a long text story that checks containment without implicit ellipsis", () => {
    expect(stories.LongText.args).toMatchObject({
      showTitleBadge: true,
      textOverflow: "wrap",
      title: "asdfadsfkadsjflkadsjflkjadslkfjadsflkfjladskjf",
      trailingType: "textAndIcon",
    });
    expect(stories.LongText.parameters?.docs?.description?.story).toContain("textOverflow=wrap");
    expect(stories.LongText.parameters?.docs?.description?.story).toContain("explicit runtime opt-in");
  });

  it("wires a concrete Figma reference image into FigmaCompare", () => {
    const storySource = stories.FigmaCompare.render?.toString() ?? "";

    expect(storySource).toContain("listItemNativeBaseline");
    expect(storySource).toContain("Figma reference: 57343:18665");
    expect(storySource).toContain("list-item-native-figma-reference");
    expect(storySource).toContain("Complete/deep-inventoried branch coverage");
  });

  it("documents the component as complete branch coverage with structure-only visual scope", () => {
    expect(meta.parameters?.docs?.description?.component).toContain("complete/deep-inventoried");
    expect(meta.parameters?.docs?.description?.component).toContain("Console MCP deep read");
    expect(meta.parameters?.docs?.description?.component).toContain("REST");
    expect(meta.parameters?.docs?.description?.component).toContain("structure-only");
  });
});
