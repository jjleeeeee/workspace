import { render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { resolveTagVariant, Tag } from "./Tag";

const tagCss = readFileSync(resolve(__dirname, "Tag.css"), "utf8");

function cssRule(selector: string) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = tagCss.match(new RegExp(`${escapedSelector}\\s*{([\\s\\S]*?)}`));
  return match?.[1] ?? "";
}

describe("resolveTagVariant", () => {
  it("normalizes LIVE Red to the only Figma-supported variant", () => {
    expect(resolveTagVariant({ color: "live-red", size: "medium", tagType: "line", shape: "round" })).toEqual({
      color: "live-red",
      shape: "squircle",
      size: "small",
      tagType: "fill",
    });
  });

  it("keeps standard colors on requested axes", () => {
    expect(resolveTagVariant({ color: "secondary-blue", size: "medium", tagType: "fill", shape: "round" })).toEqual({
      color: "secondary-blue",
      shape: "round",
      size: "medium",
      tagType: "fill",
    });
  });
});

describe("Tag", () => {
  it("renders the Figma default contract", () => {
    render(<Tag data-testid="tag" />);

    const tag = screen.getByTestId("tag");

    expect(tag).toHaveTextContent("Text");
    expect(tag).toHaveAttribute("data-size", "small");
    expect(tag).toHaveAttribute("data-tag-type", "line");
    expect(tag).toHaveAttribute("data-shape", "squircle");
    expect(tag).toHaveAttribute("data-color", "primary");
    expect(tag).toHaveAttribute("data-show-icon", "true");
    expect(tag.querySelector(".chord-tag__icon")).not.toBeNull();
  });

  it("collapses the icon slot when showIcon is false", () => {
    render(<Tag showIcon={false} label="Gray" data-testid="tag" />);

    const tag = screen.getByTestId("tag");

    expect(tag).toHaveAttribute("data-show-icon", "false");
    expect(tag.querySelector(".chord-tag__icon")).toBeNull();
  });

  it("uses the provided icon slot without making it a Storybook control contract", () => {
    render(<Tag icon={<svg aria-label="asset icon" />} data-testid="tag" />);

    expect(screen.getByLabelText("asset icon")).toBeInTheDocument();
  });

  it("uses the icon registry for the default null marker", () => {
    render(<Tag data-testid="tag" />);

    const nullIcon = screen.getByTestId("tag-null-icon");
    expect(nullIcon).toHaveAttribute("data-icon-name", "nullMedium");
    expect(nullIcon).toHaveAttribute("data-icon-size", "10");
  });
});

describe("Tag CSS contract", () => {
  it("keeps the public icon slot and supplied SVG slot at 10x10", () => {
    expect(cssRule(".chord-tag__icon")).toContain("block-size: 10px");
    expect(cssRule(".chord-tag__icon")).toContain("inline-size: 10px");
    expect(cssRule(".chord-tag__icon > svg")).toContain("block-size: 10px");
    expect(cssRule(".chord-tag__icon > svg")).toContain("inline-size: 10px");
  });

  it("renders the null marker at the same 10x10 visible frame as the Figma baseline", () => {
    expect(cssRule(".chord-tag__null-icon")).toContain("block-size: 10px");
    expect(cssRule(".chord-tag__null-icon")).toContain("inline-size: 10px");
    expect(cssRule(".chord-tag__null-icon")).not.toContain("8.333px");
  });
});
