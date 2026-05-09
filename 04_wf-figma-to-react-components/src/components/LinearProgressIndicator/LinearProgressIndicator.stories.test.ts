import { describe, expect, it } from "vitest";
import meta from "./LinearProgressIndicator.stories";

describe("LinearProgressIndicator stories", () => {
  it("exposes only Figma-facing controls", () => {
    expect(Object.keys(meta.argTypes ?? {}).sort()).toEqual(["indicatorHeight", "mode", "rounded"]);
  });
});
