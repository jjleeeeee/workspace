import { describe, expect, it } from "vitest";

import { getMediumIconFiles, toIconName } from "./generate-chord-icons.mjs";

describe("generate-chord-icons", () => {
  it("selects only medium icon SVG files", () => {
    const files = [
      "ic_add_medium.svg",
      "ic_add_xsmall.svg",
      "ic_safe_light_xxxlarge.svg",
      "img_avatar_default_thumbnail.svg",
      "ic_badge_close_special_medium.svg",
    ];

    expect(getMediumIconFiles(files)).toEqual([
      "ic_add_medium.svg",
      "ic_badge_close_special_medium.svg",
    ]);
  });

  it("converts SVG filenames to ChordIcon names", () => {
    expect(toIconName("ic_add_medium.svg")).toBe("addMedium");
    expect(toIconName("ic_badge_close_special_medium.svg")).toBe("badgeCloseSpecialMedium");
    expect(toIconName("ic_birthdayhat_medium.svg")).toBe("birthdayHatMedium");
    expect(toIconName("ic_officialbadge_fill_medium.svg")).toBe("officialBadgeFillMedium");
    expect(toIconName("ic_LP_heart_medium.svg")).toBe("lpHeartMedium");
  });
});
