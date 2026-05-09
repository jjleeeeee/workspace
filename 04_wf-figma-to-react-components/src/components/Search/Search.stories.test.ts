import { describe, expect, it } from "vitest";
import meta, * as stories from "./Search.stories";

describe("Search stories", () => {
  it("exposes only Figma-facing controls", () => {
    expect(Object.keys(meta.argTypes ?? {}).sort()).toEqual(["label", "mode", "state"]);
  });

  it("documents clear as a mapped delete graphic rather than an unresolved placeholder", () => {
    expect(meta.parameters?.docs?.description?.component).toContain("clear icons are mapped");
    expect(meta.parameters?.docs?.description?.component).not.toContain("unresolved");
    expect(stories.FigmaCompare.render?.toString() ?? "").toContain("mapped 18x18 delete graphic");
  });
});
