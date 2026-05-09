import { describe, expect, it } from "vitest";
import meta from "./IconButton.stories";

describe("IconButton stories", () => {
  it("exposes only Figma-facing controls", () => {
    expect(Object.keys(meta.argTypes ?? {}).sort()).toEqual([
      "buttonColor",
      "buttonType",
      "mode",
      "radius",
      "size",
      "status",
    ]);
  });
});
