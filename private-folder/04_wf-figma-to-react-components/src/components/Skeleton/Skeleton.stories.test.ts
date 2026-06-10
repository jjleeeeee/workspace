import { describe, expect, it } from "vitest";
import meta from "./Skeleton.stories";

describe("Skeleton stories", () => {
  it("exposes only Figma-facing controls", () => {
    expect(Object.keys(meta.argTypes ?? {}).sort()).toEqual(["mode", "size", "skeletonType"]);
  });
});
