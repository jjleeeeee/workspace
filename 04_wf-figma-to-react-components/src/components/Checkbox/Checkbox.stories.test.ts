import { describe, expect, it } from "vitest";
import meta from "./Checkbox.stories";

describe("Checkbox stories", () => {
  it("exposes only Figma-facing controls", () => {
    expect(Object.keys(meta.argTypes ?? {}).sort()).toEqual(["checkboxType", "mode", "status"]);
  });
});
