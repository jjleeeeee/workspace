import { describe, expect, it } from "vitest";
import meta from "./Toast.stories";

describe("Toast stories", () => {
  it("exposes only Figma-facing controls", () => {
    expect(Object.keys(meta.argTypes ?? {}).sort()).toEqual(["label", "mode"]);
  });
});
