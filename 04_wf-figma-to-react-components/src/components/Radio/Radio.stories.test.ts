import { describe, expect, it } from "vitest";
import meta from "./Radio.stories";

describe("Radio stories", () => {
  it("exposes only Figma-facing controls", () => {
    expect(Object.keys(meta.argTypes ?? {}).sort()).toEqual(["mode", "status"]);
  });
});
