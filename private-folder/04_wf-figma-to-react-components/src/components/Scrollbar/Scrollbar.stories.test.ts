import { describe, expect, it } from "vitest";
import meta from "./Scrollbar.stories";

describe("Scrollbar stories", () => {
  it("exposes only Figma-facing controls", () => {
    expect(Object.keys(meta.argTypes ?? {}).sort()).toEqual(["mode"]);
  });
});
