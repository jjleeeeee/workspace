import { describe, expect, it } from "vitest";
import meta from "./Menu.stories";

describe("Menu stories", () => {
  it("exposes only Figma-facing controls", () => {
    expect(Object.keys(meta.argTypes ?? {}).sort()).toEqual(["itemCount", "maxHeight", "mode", "position"]);
    expect(meta.parameters?.controls).toEqual({
      include: ["mode", "itemCount", "maxHeight", "position"],
    });
  });
});
