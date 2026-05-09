import { describe, expect, it } from "vitest";
import meta from "./ScrimOverlay.stories";

describe("ScrimOverlay stories", () => {
  it("exposes no Figma controls because the component has no axes", () => {
    expect(Object.keys(meta.argTypes ?? {}).sort()).toEqual([]);
  });
});
