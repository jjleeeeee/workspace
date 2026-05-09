import { describe, expect, it } from "vitest";
import meta from "./Snackbar.stories";

describe("Snackbar stories", () => {
  it("exposes only Figma-facing controls plus the documented action text surface", () => {
    expect(Object.keys(meta.argTypes ?? {}).sort()).toEqual(["actionLabel", "icon", "label", "mode"]);
  });
});
