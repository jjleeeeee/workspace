import { render, screen } from "@testing-library/react";
import mediumIconManifest from "./chord-icon-medium-files.json";
import { describe, expect, it } from "vitest";

import { ChordIcon, chordIconAssets, getChordIconAsset, inferChordIconColorMode } from "./chord-icons";

describe("ChordIcon asset registry", () => {
  it("renders a known Figma-exported SVG icon through the shared registry", () => {
    render(<ChordIcon data-testid="icon" name="searchMedium" size={16} />);

    const icon = screen.getByTestId("icon");

    expect(icon).toHaveAttribute("data-icon-name", "searchMedium");
    expect(icon).toHaveAttribute("data-icon-source-name", "24/em/ic_search_medium");
    expect(icon).toHaveAttribute("data-icon-size", "16");
    expect(icon).toHaveStyle({ "--chord-icon-size": "16px" });
    expect(icon.querySelector("svg")).toBeInTheDocument();
  });

  it("keeps icon_area size separate from the exported SVG source frame", () => {
    const asset = getChordIconAsset("arrowRightEnMedium");

    expect(asset.frameSize).toBe(24);
    expect(chordIconAssets.arrowRightEnMedium.sourceName).toBe("24/en/ic_arrow_right_en_medium");

    render(<ChordIcon data-testid="icon" name="arrowRightEnMedium" size={10} />);

    expect(screen.getByTestId("icon")).toHaveAttribute("data-icon-size", "10");
  });

  it("registers the TextFields country-code arrow down glyph from the Figma icon area", () => {
    const asset = getChordIconAsset("arrowDownMedium");

    expect(asset.sourceName).toBe("24/em/ic_arrow_down_medium");
    expect(asset.fileName).toBe("ic_arrow_down_medium.svg");

    render(<ChordIcon data-testid="icon" name="arrowDownMedium" size={16} />);

    expect(screen.getByTestId("icon")).toHaveAttribute("data-icon-source-name", "24/em/ic_arrow_down_medium");
    expect(screen.getByTestId("icon")).toHaveAttribute("data-icon-size", "16");
    expect(screen.getByTestId("icon").querySelector("svg")).toBeInTheDocument();
  });

  it("fails loudly when a runtime icon name is not registered", () => {
    expect(() => getChordIconAsset("missing" as never)).toThrow(/Unknown Chord icon/);
  });

  it("registers the Checkbox check glyph from the Figma icon library", () => {
    const asset = getChordIconAsset("checkMedium");

    expect(asset.sourceName).toBe("24/em/ic_check_medium");
    expect(asset.nodeId).toBe("10177:64494");
    expect(asset.fileName).toBe("ic_check_medium.svg");

    render(<ChordIcon data-testid="icon" name="checkMedium" size={16} />);

    expect(screen.getByTestId("icon")).toHaveAttribute("data-icon-source-name", "24/em/ic_check_medium");
    expect(screen.getByTestId("icon").querySelector("svg")).toBeInTheDocument();
  });

  it("registers the Avatar birthday hat glyph from the Figma icon library", () => {
    const asset = getChordIconAsset("birthdayHatMedium");

    expect(asset.sourceName).toBe("24/em/ic_birthdayhat_medium");
    expect(asset.nodeId).toBe("40347:21483");
    expect(asset.fileName).toBe("ic_birthdayhat_medium.svg");
    expect(asset.colorMode).toBe("original");

    render(<ChordIcon data-testid="icon" name="birthdayHatMedium" size={20} />);

    expect(screen.getByTestId("icon")).toHaveAttribute("data-icon-source-name", "24/em/ic_birthdayhat_medium");
    expect(screen.getByTestId("icon")).toHaveAttribute("data-icon-color-mode", "original");
    expect(screen.getByTestId("icon").querySelector("svg")).toBeInTheDocument();
  });

  it("treats Specialtype and _special icons as original-color assets", () => {
    const specialFiles = mediumIconManifest.files.filter((file) => file.targetFileName.includes("_special"));

    expect(specialFiles.length).toBeGreaterThan(0);
    expect(specialFiles.every((file) => file.targetFileName.endsWith("_special_medium.svg"))).toBe(true);
    expect(
      inferChordIconColorMode({
        fileName: "ic_ai_special_medium.svg",
        sourceName: "24/Specialtype/ic_ai_special_medium",
      }),
    ).toBe("original");
    expect(
      inferChordIconColorMode({
        fileName: "ic_search_medium.svg",
        sourceName: "24/em/ic_search_medium",
      }),
    ).toBe("currentColor");
  });

  it("keeps registry source names and SVG filenames unique", () => {
    const sourceNames = Object.values(chordIconAssets).map((asset) => asset.sourceName);
    const fileNames = Object.values(chordIconAssets).map((asset) => asset.fileName);

    expect(new Set(sourceNames).size).toBe(sourceNames.length);
    expect(new Set(fileNames).size).toBe(fileNames.length);
  });

  it("keeps the bulk icon asset folder scoped to medium SVG filenames", () => {
    expect(mediumIconManifest.count).toBeGreaterThan(300);
    expect(mediumIconManifest.excludedSourceFiles).toEqual([
      "ic_add_to_community_special_dark.svg",
      "ic_add_to_community_special_light.svg",
    ]);
    expect(mediumIconManifest.files.every((file) => file.targetFileName.includes("_medium"))).toBe(true);
  });
});
