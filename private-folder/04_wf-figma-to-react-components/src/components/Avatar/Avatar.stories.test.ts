import { describe, expect, it } from "vitest";
import meta from "./Avatar.stories";
import * as stories from "./Avatar.stories";

describe("Avatar stories", () => {
  it("exposes Figma-facing axes and visibility props", () => {
    expect(Object.keys(meta.argTypes ?? {}).sort()).toEqual([
      "avatarType",
      "badgeDot",
      "birthdayHat",
      "emoji",
      "host",
      "mode",
      "ring",
      "size",
    ]);
  });

  it("keeps composition examples out of the Avatar story set", () => {
    expect(Object.keys(stories)).not.toContain("ListItemUsage");
  });

  it("provides a dedicated visual-registry story for the squircle medium baseline", () => {
    expect(Object.keys(stories)).toContain("VisualSquircleMedium");
    expect(stories.VisualSquircleMedium.args).toEqual({
      avatarType: "squircle",
      badgeDot: true,
      host: true,
      mode: "default",
      size: "medium",
    });
  });
});
