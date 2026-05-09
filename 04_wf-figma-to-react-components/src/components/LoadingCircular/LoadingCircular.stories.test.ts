import { describe, expect, it } from "vitest";
import meta from "./LoadingCircular.stories";

describe("LoadingCircular stories", () => {
  it("exposes only Figma-facing controls", () => {
    expect(Object.keys(meta.argTypes ?? {}).sort()).toEqual(["mode"]);
  });
});
