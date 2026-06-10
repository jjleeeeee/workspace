import { describe, expect, it } from "vitest";
import meta from "./Tag.stories";

describe("Tag stories", () => {
  it("exposes only Figma-facing controls", () => {
    expect(Object.keys(meta.argTypes ?? {}).sort()).toEqual(["color", "label", "shape", "showIcon", "size", "tagType"]);
  });
});
