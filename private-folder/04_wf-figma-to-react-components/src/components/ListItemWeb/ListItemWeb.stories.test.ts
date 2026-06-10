import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import meta, { SmallDisabled } from "./ListItemWeb.stories";

const storiesSource = readFileSync(
  join(process.cwd(), "src/components/ListItemWeb/ListItemWeb.stories.tsx"),
  "utf8",
);

describe("ListItemWeb stories contract", () => {
  it("controls.include lists only figma-facing props", () => {
    const include = meta.parameters?.controls?.include ?? [];
    expect(include).toContain("mode");
    expect(include).toContain("size");
    expect(include).toContain("states");
    expect(include).toContain("showLeading");
    expect(include).toContain("leadingType");
    expect(include).toContain("showTrailing");
    expect(include).toContain("showDivider");
  });

  it("controls.include does not expose text label props", () => {
    const include = meta.parameters?.controls?.include ?? [];
    expect(include).not.toContain("titleLabel");
    expect(include).not.toContain("bodyLabel");
    expect(include).not.toContain("trailingLabel");
  });

  it("controls.include does not expose slot props", () => {
    const include = meta.parameters?.controls?.include ?? [];
    expect(include).not.toContain("leadingSlot");
  });

  it("controls.include does not expose internal props", () => {
    const include = meta.parameters?.controls?.include ?? [];
    expect(include).not.toContain("showBadgeDot");
  });

  it("argTypes define mode, size, and states controls", () => {
    const keys = Object.keys(meta.argTypes ?? {});
    expect(keys).toContain("mode");
    expect(keys).toContain("size");
    expect(keys).toContain("states");
  });

  it("states controls match the Figma axis values", () => {
    const states = meta.argTypes?.states;
    expect(states?.options).toEqual(["default", "hover-pressed", "disabled"]);
    expect(states?.options).not.toContain("selected");
  });

  it("uses a local 3x visual baseline for FigmaCompare", () => {
    expect(storiesSource).toContain("../../figma/baselines/list-item-web-default@3x.png");
    expect(storiesSource).not.toContain("figma-alpha-api");
  });

  it("has a single-component story for the Figma disabled-small branch", () => {
    expect(SmallDisabled.args).toMatchObject({
      mode: "default",
      size: "small",
      states: "disabled",
    });
  });

  it("documents the recursively confirmed leading component set branches", () => {
    expect(storiesSource).toContain("LeadingTypes");
    expect(storiesSource).toContain("listItemWebLeadingTypeOptions");
    expect(storiesSource).toContain("Type=Rectanglular Thumbnail");
    expect(storiesSource).toContain("63406:10120");
    expect(storiesSource).toContain("57343:20398");
    expect(storiesSource).toContain("63406:10129");
    expect(storiesSource).toContain("63354:137265");
  });
});
