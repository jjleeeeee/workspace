import { describe, expect, it } from "vitest";
import meta from "./Divider.stories";

describe("Divider stories", () => {
  it("exposes only Figma-facing controls", () => {
    expect(Object.keys(meta.argTypes ?? {}).sort()).toEqual(["dividerStyle", "height", "mode"]);
  });
});
