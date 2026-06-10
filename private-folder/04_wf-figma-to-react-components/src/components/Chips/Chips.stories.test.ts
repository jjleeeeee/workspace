import { describe, expect, it } from "vitest";
import meta from "./Chips.stories";

describe("Chips stories", () => {
  it("exposes only Figma-facing controls", () => {
    expect(Object.keys(meta.argTypes ?? {}).sort()).toEqual([
      "badge",
      "badgeNumber",
      "label",
      "marquee",
      "mode",
      "radius",
      "size",
      "state",
      "type",
    ]);
  });
});
