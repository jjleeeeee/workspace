import { describe, expect, it } from "vitest";
import meta from "./CircularProgressIndicator.stories";

describe("CircularProgressIndicator stories", () => {
  it("exposes only Figma-facing controls", () => {
    expect(Object.keys(meta.argTypes ?? {}).sort()).toEqual(["button", "mode"]);
  });
});
