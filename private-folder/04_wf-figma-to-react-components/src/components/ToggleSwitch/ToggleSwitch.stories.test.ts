import { describe, expect, it } from "vitest";
import meta from "./ToggleSwitch.stories";

describe("ToggleSwitch stories", () => {
  it("exposes only Figma-facing controls", () => {
    expect(Object.keys(meta.argTypes ?? {}).sort()).toEqual(["mode", "platform", "size", "status"]);
  });
});
