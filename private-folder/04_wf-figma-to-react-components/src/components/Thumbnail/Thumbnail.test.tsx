import { render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  Thumbnail,
  getThumbnailRatioHeight,
  thumbnailButtonTypeOptions,
  thumbnailLeftItemTypeOptions,
  thumbnailRatioReferenceSizes,
  thumbnailRightItemBottomTypeOptions,
  thumbnailRightItemTopTypeOptions,
} from "./Thumbnail";

const thumbnailCss = readFileSync(join(process.cwd(), "src/components/Thumbnail/Thumbnail.css"), "utf8");
const sourceNote = readFileSync(join(process.cwd(), "src/figma/thumbnail.source.md"), "utf8");

describe("Thumbnail", () => {
  it("exposes the Figma ratio/radius contract and nested module enums", () => {
    expect(thumbnailRatioReferenceSizes).toEqual({
      "1:1": { height: 256, width: 256 },
      "3:4": { height: 340, width: 256 },
      "5:6": { height: 307, width: 256 },
      "5:8": { height: 410, width: 256 },
      "9:16": { height: 455, width: 256 },
      "16:9": { height: 144, width: 256 },
    });
    expect(thumbnailLeftItemTypeOptions).toEqual(["double-icon", "single-icon"]);
    expect(thumbnailRightItemTopTypeOptions).toEqual(["double-icon", "single-icon", "checkbox"]);
    expect(thumbnailRightItemBottomTypeOptions).toEqual(["text-large", "text-small", "timer-large", "timer-small"]);
    expect(thumbnailButtonTypeOptions).toEqual(["play", "text"]);
  });

  it("rounds ratio-derived heights down from the 256px reference", () => {
    expect(getThumbnailRatioHeight("16:9", 256)).toBe(144);
    expect(getThumbnailRatioHeight("3:4", 44)).toBe(58);
    expect(getThumbnailRatioHeight("5:6", 44)).toBe(52);
  });

  it("renders a deliberate no-image state and does not invent media content", () => {
    render(<Thumbnail data-testid="thumbnail" />);

    const thumbnail = screen.getByTestId("thumbnail");

    expect(thumbnail).toHaveAttribute("data-type", "thumbnail");
    expect(thumbnail).toHaveAttribute("data-ratio", "1:1");
    expect(thumbnail).toHaveAttribute("data-radius", "off");
    expect(thumbnail).toHaveStyle({ "--thumbnail-width": "256px", "--thumbnail-height": "256px" });
    expect(screen.getByTestId("thumbnail-placeholder")).toHaveAttribute("data-asset-classification", "figma-no-image-placeholder");
    expect(screen.getByTestId("thumbnail-placeholder")).toHaveAttribute("data-placeholder-mark", "wordmark-large");
    expect(screen.getByTestId("thumbnail-placeholder")).toHaveAttribute("data-placeholder-ratio", "1:1");
    expect(screen.getByTestId("thumbnail-placeholder-mark")).toHaveAttribute("alt", "");
  });

  it("switches the Figma placeholder mark by rendered size and ratio", () => {
    const { rerender } = render(<Thumbnail data-testid="thumbnail" ratio="5:8" />);

    expect(screen.getByTestId("thumbnail-placeholder")).toHaveAttribute("data-placeholder-mark", "wordmark-small");

    rerender(<Thumbnail data-testid="thumbnail" width={144} />);

    expect(screen.getByTestId("thumbnail-placeholder")).toHaveAttribute("data-placeholder-mark", "symbol");
  });

  it("renders media content inside the fixed ratio frame when src is supplied", () => {
    render(<Thumbnail alt="Cover" data-testid="thumbnail" radius="on" ratio="16:9" src="/cover.png" width={128} />);

    const thumbnail = screen.getByTestId("thumbnail");
    const image = screen.getByAltText("Cover");

    expect(thumbnail).toHaveAttribute("data-ratio", "16:9");
    expect(thumbnail).toHaveAttribute("data-radius", "on");
    expect(thumbnail).toHaveStyle({ "--thumbnail-width": "128px", "--thumbnail-height": "72px" });
    expect(image).toHaveAttribute("data-asset-classification", "consumer-image-content");
  });

  it("renders parent boolean modules with the confirmed nested default enum values", () => {
    render(<Thumbnail button fill leftItem rightItemBottom rightItemTop seekBar data-testid="thumbnail" />);

    expect(screen.getByTestId("thumbnail-fill")).toHaveAttribute("data-module-type", "scrim-overlay");
    expect(screen.getByTestId("thumbnail-center-button")).toHaveAttribute("data-button-type", "play");
    expect(screen.getByTestId("thumbnail-center-button-icon")).toHaveAttribute("data-icon-name", "playFillMedium");
    expect(screen.getByTestId("thumbnail-left-item")).toHaveAttribute("data-left-item-type", "double-icon");
    expect(screen.getByTestId("thumbnail-right-item-top")).toHaveAttribute("data-right-item-top-type", "double-icon");
    expect(screen.getByTestId("thumbnail-right-item-bottom")).toHaveAttribute("data-right-item-bottom-type", "text-large");
    expect(screen.getByTestId("thumbnail-seek-bar")).toHaveAttribute("data-progress", "25");
  });

  it("keeps Left Item owned enums active only inside the Left Item module", () => {
    const { rerender } = render(<Thumbnail leftItemType="single-icon" />);

    expect(screen.queryByTestId("thumbnail-left-item")).not.toBeInTheDocument();

    rerender(<Thumbnail leftItem leftItemShowTag={false} leftItemType="single-icon" />);

    expect(screen.getByTestId("thumbnail-left-item")).toHaveAttribute("data-left-item-type", "single-icon");
    expect(screen.getByTestId("thumbnail-left-item-left-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("thumbnail-left-item-right-icon")).not.toBeInTheDocument();
    expect(screen.queryByText("Text")).not.toBeInTheDocument();
  });

  it("keeps Right Item_top owned enums active only inside the Right Item_top module", () => {
    const { rerender } = render(<Thumbnail rightItemTopType="checkbox" />);

    expect(screen.queryByTestId("thumbnail-right-item-top")).not.toBeInTheDocument();

    rerender(<Thumbnail rightItemTop rightItemTopType="checkbox" />);

    const top = screen.getByTestId("thumbnail-right-item-top");
    const checkbox = screen.getByTestId("thumbnail-right-item-checkbox");

    expect(top).toHaveAttribute("data-right-item-top-type", "checkbox");
    expect(checkbox).toHaveClass("chord-checkbox");
    expect(checkbox).toHaveAttribute("data-mode", "fixed");
    expect(checkbox).toHaveAttribute("data-type", "circle");
    expect(checkbox).toHaveAttribute("data-status", "default");
  });

  it("renders nested enum branches without mapping unknown product icons by shape", () => {
    render(
      <Thumbnail
        button
        buttonType="text"
        buttonText="+5"
        leftItem
        leftItemType="single-icon"
        rightBottomLabel="00:00:00"
        rightItemBottom
        rightItemBottomType="timer-small"
        rightItemTop
        rightItemTopType="checkbox"
      />,
    );

    expect(screen.getByTestId("thumbnail-center-button")).toHaveAttribute("data-button-type", "text");
    expect(screen.getByTestId("thumbnail-left-item")).toHaveAttribute("data-left-item-type", "single-icon");
    expect(screen.getByTestId("thumbnail-right-item-top")).toHaveAttribute("data-right-item-top-type", "checkbox");
    expect(screen.getByTestId("thumbnail-right-item-checkbox")).toHaveClass("chord-checkbox");
    expect(screen.getByTestId("thumbnail-right-item-bottom")).toHaveAttribute("data-right-item-bottom-type", "timer-small");
    expect(screen.getByTestId("thumbnail-right-item-bottom")).toHaveTextContent("00:00:00");
  });

  it("records source decisions for nested enums and pixel diff limits", () => {
    expect(sourceNote).toContain("Left Item");
    expect(sourceNote).toContain("Double Icon");
    expect(sourceNote).toContain("owned by `_atoms / modules / Left Item (Optional)`");
    expect(sourceNote).toContain("Right Item_top");
    expect(sourceNote).toContain("CheckBox");
    expect(sourceNote).toContain("owned by `_atoms / modules / Right Item_Top (Optional)`");
    expect(sourceNote).toContain("Figma-backed placeholder");
    expect(sourceNote).toContain("63529:131799");
  });
});

describe("Thumbnail CSS contract", () => {
  it("uses tokenized overlays and keeps icon_area as wrapper sizing", () => {
    expect(thumbnailCss).toContain("--cds-system-fixed-color-surface-default-400a");
    expect(thumbnailCss).toContain("--cds-system-fixed-color-surface-default-reverse-300a");
    expect(thumbnailCss).toContain("--cds-system-fixed-color-status-danger-red");
    expect(thumbnailCss).toContain("--thumbnail-radius");
    expect(thumbnailCss).toContain("object-fit: cover");
    expect(thumbnailCss).toContain(".chord-thumbnail__icon-area");
    expect(thumbnailCss).toContain("#f2f3f7");
    expect(thumbnailCss).toContain(".chord-thumbnail__placeholder-mark");
    expect(thumbnailCss).toContain("display: flex");
    expect(thumbnailCss).toContain("block-size: 15.099px");
    expect(thumbnailCss).toContain("block-size: 12.64px");
    expect(thumbnailCss).toContain("block-size: 12.012px");
  });
});
