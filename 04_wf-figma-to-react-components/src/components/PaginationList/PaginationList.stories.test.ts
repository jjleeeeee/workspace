import { describe, expect, it } from "vitest";
import meta from "./PaginationList.stories";

describe("PaginationList stories", () => {
  it("exposes only Figma-facing controls", () => {
    expect(Object.keys(meta.argTypes ?? {}).sort()).toEqual(["mode", "pages", "size"]);
  });
});
