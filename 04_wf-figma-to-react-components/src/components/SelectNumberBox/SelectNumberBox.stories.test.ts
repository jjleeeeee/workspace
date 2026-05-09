import { describe, expect, it } from "vitest";
import meta from "./SelectNumberBox.stories";

describe("SelectNumberBox stories", () => {
  it("exposes only Figma-facing controls", () => {
    expect(Object.keys(meta.argTypes ?? {}).sort()).toEqual(["mode", "state", "value"]);
  });
});
