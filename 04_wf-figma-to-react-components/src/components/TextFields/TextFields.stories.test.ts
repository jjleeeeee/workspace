import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import meta from "./TextFields.stories";

const storiesSource = readFileSync(
  join(process.cwd(), "src/components/TextFields/TextFields.stories.tsx"),
  "utf8",
);

describe("TextFields stories", () => {
  it("exposes only Figma-facing controls", () => {
    expect(Object.keys(meta.argTypes ?? {}).sort()).toEqual([
      "characterCounter",
      "countryCode",
      "guideMessage",
      "lines",
      "mode",
      "scrollbar",
      "showBadgeDot",
      "showTitle",
      "status",
    ]);
  });

  it("uses a local visual baseline for FigmaCompare", () => {
    expect(storiesSource).toContain("../../figma/baselines/text-fields-default@3x.png");
    expect(storiesSource).not.toContain("figma-alpha-api");
  });
});
