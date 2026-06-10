import { describe, expect, it } from "vitest";
import meta from "./LoadingDot.stories";

describe("LoadingDot stories", () => {
  it("exposes only Figma-facing controls", () => {
    expect(Object.keys(meta.argTypes ?? {}).sort()).toEqual(["color", "mode", "size"]);
  });
});
