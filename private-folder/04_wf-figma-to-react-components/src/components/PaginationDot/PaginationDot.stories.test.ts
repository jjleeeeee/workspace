import { describe, expect, it } from "vitest";
import meta from "./PaginationDot.stories";

describe("PaginationDot stories", () => {
  it("exposes only Figma-facing controls", () => {
    expect(Object.keys(meta.argTypes ?? {}).sort()).toEqual(["dots", "mode", "selection"]);
  });
});
