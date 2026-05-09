import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import meta from "./AvatarGroup.stories";
import * as stories from "./AvatarGroup.stories";

const storiesSource = readFileSync(
  join(process.cwd(), "src/components/AvatarGroup/AvatarGroup.stories.tsx"),
  "utf8",
);

describe("AvatarGroup stories", () => {
  it("exposes only Figma-facing props in Controls", () => {
    expect(Object.keys(meta.argTypes ?? {}).sort()).toEqual(["alignment", "count", "liveTag", "shape"]);
  });

  it("documents the 11-variant live coverage without parent usage examples", () => {
    expect(Object.keys(stories)).toContain("Variants");
    expect(Object.keys(stories)).toContain("FigmaCompare");
    expect(Object.keys(stories)).not.toContain("TitleHeaderUsage");
    expect(Object.keys(stories)).not.toContain("ListItemUsage");
  });

  it("uses a local baseline image for FigmaCompare", () => {
    expect(storiesSource).toContain("avatar-group-default.png");
  });
});
