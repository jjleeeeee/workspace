import { describe, expect, it } from "vitest";
import meta from "./Stepper.stories";

describe("Stepper stories", () => {
  it("exposes only Figma-facing controls", () => {
    expect(Object.keys(meta.argTypes ?? {}).sort()).toEqual(["caret", "label", "mode", "state"]);
  });
});
