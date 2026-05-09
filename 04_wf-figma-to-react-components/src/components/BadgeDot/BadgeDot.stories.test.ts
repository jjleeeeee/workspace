import { describe, expect, it } from "vitest";
import meta from "./BadgeDot.stories";

describe("BadgeDot stories", () => {
  it("exposes only Figma-facing controls", () => {
    expect(Object.keys(meta.argTypes ?? {}).sort()).toEqual(["mode", "outline", "size"]);
  });
});
