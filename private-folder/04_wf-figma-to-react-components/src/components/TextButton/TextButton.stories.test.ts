import { describe, expect, it } from "vitest";
import meta from "./TextButton.stories";

describe("TextButton stories", () => {
  it("exposes only Figma-facing controls", () => {
    expect(Object.keys(meta.argTypes ?? {}).sort()).toEqual([
      "buttonColor",
      "buttonType",
      "children",
      "mode",
      "optionLeading",
      "optionTrailing",
      "radius",
      "size",
      "status",
      "trailingIcon",
      "trailingText",
    ]);
  });
});
