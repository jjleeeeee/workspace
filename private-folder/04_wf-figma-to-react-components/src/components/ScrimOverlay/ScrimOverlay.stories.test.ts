import { describe, expect, it } from "vitest";
import meta from "./ScrimOverlay.stories";

describe("ScrimOverlay stories", () => {
  it("exposes only Figma-facing controls", () => {
    expect(Object.keys(meta.argTypes ?? {}).sort()).toEqual(["color"]);
  });
});
