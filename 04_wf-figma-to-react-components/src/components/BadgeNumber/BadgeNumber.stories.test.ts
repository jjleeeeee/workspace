import { describe, expect, it } from "vitest";
import meta from "./BadgeNumber.stories";

describe("BadgeNumber stories", () => {
  it("exposes only Figma-facing controls", () => {
    expect(Object.keys(meta.argTypes ?? {}).sort()).toEqual(["badgeType", "label", "mode"]);
  });
});
