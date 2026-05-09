import { render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  ListItemNative,
  listItemNativeLeadingTypeOptions,
  listItemNativeModeOptions,
  listItemNativeSizeOptions,
  listItemNativeStatusOptions,
  listItemNativeTrailingTypeOptions,
  listItemNativeCoverage,
} from "./ListItemNative";

const css = readFileSync(join(process.cwd(), "src/components/ListItemNative/ListItemNative.css"), "utf8");
const sourceNote = readFileSync(join(process.cwd(), "src/figma/list-item-native.source.md"), "utf8");

describe("ListItemNative", () => {
  it("exposes only the confirmed Figma variant axes", () => {
    expect(listItemNativeModeOptions).toEqual(["default", "fixed"]);
    expect(listItemNativeSizeOptions).toEqual(["small", "medium"]);
    expect(listItemNativeStatusOptions).toEqual(["default", "hover-pressed", "disabled"]);
    expect(listItemNativeLeadingTypeOptions).toEqual([
      "avatar",
      "checkbox",
      "icon",
      "radio",
      "rectangularThumbnail",
      "squareThumbnail",
    ]);
    expect(listItemNativeTrailingTypeOptions).toEqual([
      "iconButton",
      "mainButton",
      "numberBadge",
      "radio",
      "toggle",
      "textAndIcon",
      "textOnly",
      "iconOnly",
    ]);
    expect(listItemNativeCoverage).toBe("complete/deep-inventoried");
  });

  it("renders the default Medium row with nested atom-backed slots", () => {
    render(<ListItemNative data-testid="list-item" />);

    const item = screen.getByTestId("list-item");

    expect(item).toHaveClass("chord-list-item-native");
    expect(item).toHaveAttribute("data-mode", "default");
    expect(item).toHaveAttribute("data-size", "medium");
    expect(item).toHaveAttribute("data-status", "default");
    expect(item).toHaveAttribute("data-text-overflow", "wrap");
    expect(item).toHaveAttribute("data-coverage", "complete/deep-inventoried");
    expect(item).toHaveStyle({
      "--list-item-leading-height": "56px",
      "--list-item-leading-size": "56px",
      "--list-item-leading-width": "56px",
      "--list-item-row-height": "80px",
    });
    expect(screen.getByTestId("list-item-leading-thumbnail")).toHaveClass("chord-thumbnail");
    expect(screen.queryByTestId("list-item-title-badge")).not.toBeInTheDocument();
    expect(screen.getByTestId("list-item-body-leading-icon")).toHaveAttribute("data-icon-name", "nullMedium");
    expect(screen.getByTestId("list-item-trailing")).toHaveAttribute("data-trailing-type", "textAndIcon");
    expect(screen.getByTestId("list-item-trailing-icon")).toHaveAttribute("data-icon-name", "arrowRightEnMedium");
    expect(screen.getByTestId("list-item-divider")).toHaveClass("chord-divider");
  });

  it("uses the Title-owned badge wrapper frame instead of centering the visible dot directly", () => {
    const { container } = render(<ListItemNative showTitleBadge />);

    expect(screen.getByTestId("list-item-title-badge")).toHaveClass("chord-list-item-native__title-badge");
    expect(container.querySelector(".chord-list-item-native__title-badge > .chord-badge-dot")).toBeInTheDocument();
    expect(css).toContain(".chord-list-item-native__title-row {\n  display: block");
    expect(css).toContain(".chord-list-item-native__title {\n  color: var(--list-item-title-color);\n  display: inline");
    expect(css).toContain("margin-inline-start: 4px");
    expect(css).toContain("vertical-align: top");
  });

  it("uses the Small leading prop only for Size=Small and the Medium leading prop only for Size=Medium", () => {
    const { rerender } = render(<ListItemNative data-testid="list-item" showMediumLeading={false} />);

    expect(screen.queryByTestId("list-item-leading-thumbnail")).not.toBeInTheDocument();
    expect(screen.getByTestId("list-item")).toHaveAttribute("data-leading-visible", "false");

    rerender(<ListItemNative data-testid="list-item" size="small" showMediumLeading={false} showSmallLeading />);

    expect(screen.getByTestId("list-item-leading-thumbnail")).toBeInTheDocument();
    expect(screen.getByTestId("list-item")).toHaveStyle({
      "--list-item-leading-size": "44px",
      "--list-item-leading-width": "44px",
      "--list-item-row-height": "58px",
    });

    rerender(<ListItemNative data-testid="list-item" size="small" showSmallLeading={false} />);

    expect(screen.queryByTestId("list-item-leading-thumbnail")).not.toBeInTheDocument();
    expect(screen.getByTestId("list-item")).toHaveAttribute("data-leading-visible", "false");
  });

  it("collapses optional trailing and divider slots", () => {
    render(<ListItemNative data-testid="list-item" showDivider={false} showTrailing={false} />);

    const item = screen.getByTestId("list-item");

    expect(item).toHaveAttribute("data-trailing-visible", "false");
    expect(screen.queryByTestId("list-item-trailing")).not.toBeInTheDocument();
    expect(screen.queryByTestId("list-item-divider")).not.toBeInTheDocument();
  });

  it("supports a compact title-only branch for Menu composition without CSS scale", () => {
    render(
      <ListItemNative
        data-testid="list-item"
        inlineSize={240}
        showBodyText={false}
        showDivider={false}
        showMediumLeading={false}
        showSmallLeading={false}
        showTrailing={false}
        size="small"
        title="Menu title"
      />,
    );

    const item = screen.getByTestId("list-item");

    expect(item).toHaveAttribute("data-compact-title-only", "true");
    expect(item).toHaveStyle({
      "--list-item-row-height": "40px",
      "--list-item-width": "240px",
    });
    expect(screen.queryByText("Body Text")).not.toBeInTheDocument();
    expect(screen.queryByTestId("list-item-leading")).not.toBeInTheDocument();
    expect(screen.queryByTestId("list-item-trailing")).not.toBeInTheDocument();
  });

  it("keeps runtime content props outside the Figma-facing variant contract", () => {
    render(<ListItemNative bodyText="Second line" detailText="Action" title="Primary" />);

    expect(screen.getByText("Primary")).toBeInTheDocument();
    expect(screen.getByText("Second line")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
  });

  it("renders every confirmed leading module enum branch with existing atoms", () => {
    const { rerender } = render(<ListItemNative leadingType="avatar" />);
    expect(screen.getByTestId("list-item-leading")).toHaveAttribute("data-leading-type", "avatar");
    expect(screen.getByTestId("list-item-leading-avatar")).toHaveClass("chord-avatar");
    expect(screen.getByTestId("list-item-leading-avatar")).toHaveAttribute("data-component-size-override", "true");
    expect(screen.getByTestId("list-item-leading-avatar")).toHaveStyle({
      "--avatar-component-size": "46px",
      "--avatar-image-size": "46px",
    });

    rerender(<ListItemNative leadingType="avatar" size="small" />);
    expect(screen.getByTestId("list-item-leading-avatar")).toHaveStyle({
      "--avatar-component-size": "40px",
      "--avatar-image-size": "40px",
    });

    rerender(<ListItemNative leadingType="checkbox" />);
    expect(screen.getByTestId("list-item-leading-checkbox")).toHaveClass("chord-checkbox");
    expect(screen.getByTestId("list-item-leading-checkbox")).toHaveAttribute("data-type", "square");
    expect(screen.getByTestId("list-item-leading-checkbox")).toHaveAttribute("data-status", "default");
    expect(screen.getByTestId("list-item-leading-checkbox")).toHaveAttribute("aria-checked", "false");

    rerender(<ListItemNative leadingIconName="addMedium" leadingType="icon" />);
    expect(screen.getByTestId("list-item-leading-icon")).toHaveAttribute("data-icon-name", "addMedium");
    expect(screen.getByTestId("list-item-leading-icon")).toHaveAttribute("data-icon-size", "24");

    rerender(<ListItemNative leadingType="radio" />);
    expect(screen.getByTestId("list-item-leading-radio")).toHaveClass("chord-radio");
    expect(screen.getByTestId("list-item-leading-radio")).toHaveAttribute("data-status", "enabled");

    rerender(<ListItemNative leadingType="rectangularThumbnail" />);
    expect(screen.getByTestId("list-item-leading-rectangular-thumbnail")).toHaveClass("chord-thumbnail");
    expect(screen.getByTestId("list-item-leading")).toHaveAttribute("data-leading-type", "rectangularThumbnail");
    expect(screen.getByTestId("list-item-leading-rectangular-thumbnail")).toHaveStyle({
      "--thumbnail-height": "88px",
      "--thumbnail-width": "156px",
    });

    rerender(<ListItemNative leadingType="squareThumbnail" />);
    expect(screen.getByTestId("list-item-leading-thumbnail")).toHaveClass("chord-thumbnail");
  });

  it("renders every confirmed trailing module enum branch with existing atoms", () => {
    const { rerender } = render(<ListItemNative trailingType="iconButton" />);
    expect(screen.getByTestId("list-item-trailing")).toHaveAttribute("data-trailing-type", "iconButton");
    expect(screen.getByTestId("list-item-trailing-icon-button")).toHaveClass("chord-icon-button");
    expect(screen.getByTestId("list-item-trailing-icon-button")).toHaveAttribute("data-size", "medium");
    expect(screen.getByTestId("list-item-trailing-icon-button")).toHaveAttribute("data-radius", "on");

    rerender(<ListItemNative trailingType="mainButton" trailingButtonText="Go" />);
    expect(screen.getByTestId("list-item-trailing-main-button")).toHaveClass("chord-text-button");
    expect(screen.getByTestId("list-item-trailing-main-button")).toHaveAttribute("data-size", "xsmall");
    expect(screen.getByTestId("list-item-trailing-main-button")).toHaveAttribute("data-radius", "off");
    expect(screen.getByText("Go")).toBeInTheDocument();

    rerender(<ListItemNative trailingType="numberBadge" trailingBadgeLabel="7" />);
    expect(screen.getByTestId("list-item-trailing-badge-number")).toHaveClass("chord-badge-number");
    expect(screen.getByTestId("list-item-trailing-badge-number")).toHaveAttribute("data-mode", "default");
    expect(screen.getByText("7")).toBeInTheDocument();

    rerender(<ListItemNative mode="fixed" trailingType="numberBadge" trailingBadgeLabel="7" />);
    expect(screen.getByTestId("list-item-trailing-badge-number")).toHaveAttribute("data-mode", "default");

    rerender(<ListItemNative trailingType="radio" />);
    expect(screen.getByTestId("list-item-trailing-radio")).toHaveClass("chord-radio");

    rerender(<ListItemNative trailingType="toggle" />);
    expect(screen.getByTestId("list-item-trailing-toggle")).toHaveClass("chord-toggle-switch");

    rerender(<ListItemNative trailingType="textOnly" detailText="Only text" />);
    expect(screen.getByTestId("list-item-trailing")).toHaveAttribute("data-trailing-type", "textOnly");
    expect(screen.getByText("Only text")).toBeInTheDocument();
    expect(screen.queryByTestId("list-item-trailing-icon")).not.toBeInTheDocument();

    rerender(<ListItemNative trailingType="iconOnly" trailingIconName="addMedium" />);
    expect(screen.getByTestId("list-item-trailing-single-icon")).toHaveAttribute("data-icon-name", "addMedium");
  });

  it("applies Trailing showText and showIcon props only to text/icon branches", () => {
    const { rerender } = render(<ListItemNative detailText="Detail" trailingShowIcon={false} trailingType="textAndIcon" />);

    expect(screen.getByText("Detail")).toBeInTheDocument();
    expect(screen.queryByTestId("list-item-trailing-icon")).not.toBeInTheDocument();

    rerender(<ListItemNative detailText="Detail" trailingShowText={false} trailingType="textAndIcon" />);

    expect(screen.queryByText("Detail")).not.toBeInTheDocument();
    expect(screen.getByTestId("list-item-trailing-icon")).toHaveAttribute("data-icon-name", "arrowRightEnMedium");

    rerender(<ListItemNative trailingShowIcon={false} trailingType="iconOnly" />);

    expect(screen.queryByTestId("list-item-trailing-single-icon")).not.toBeInTheDocument();
  });

  it("records the Figma composition and token decisions in the source note", () => {
    expect(sourceNote).toContain("[V2] List_Item_Native");
    expect(sourceNote).toContain("57343:18628");
    expect(sourceNote).toContain("Use nested atoms for Leading");
    expect(sourceNote).toContain("Use nested `BadgeDot`");
    expect(sourceNote).toContain("`Type=TextAndIcon`: text module plus `ChordIcon name=\"arrowRightEnMedium\"`");
    expect(sourceNote).toContain("Do not recreate `ListItemLeading` or `ListItemTrailing`");
    expect(sourceNote).toContain("## Nested Module Inventory");
    expect(sourceNote).toContain("complete/deep-inventoried");
    expect(sourceNote).toContain("Leading module enum source: Figma property dropdown screenshot");
    expect(sourceNote).toContain("Console MCP `figma_get_component_for_development_deep(63406:10120, depth=10)`");
    expect(sourceNote).toContain("REST source");
    expect(sourceNote).toContain("Rectanglular Thumbnail");
    expect(sourceNote).toContain("Title props");
    expect(sourceNote).toContain("Body props");
    expect(sourceNote).toContain("TextAndIcon");
    expect(sourceNote).toContain("Icon Button");
    expect(sourceNote).toContain("Number Badge");
    expect(sourceNote).toContain("Trailing module coverage: `complete/deep-inventoried`");
    expect(sourceNote).toContain("Content module coverage: `complete/deep-inventoried`");
  });
});

describe("ListItemNative CSS contract", () => {
  it("contains the Figma row metrics and token family switches", () => {
    expect(css).toContain("--list-item-width: 393px");
    expect(css).toContain("--list-item-small-row-height: 58px");
    expect(css).toContain("--list-item-medium-row-height: 80px");
    expect(css).toContain("--cds-system-color-text-default");
    expect(css).toContain("--cds-system-fixed-color-text-default");
    expect(css).toContain('"WeGothicSans"');
    expect(css).toContain("padding-block-start: 2px");
    expect(css).not.toContain("Pretendard, -apple-system");
  });

  it("allows long text to wrap and grow the row by default", () => {
    render(<ListItemNative data-testid="list-item" title="asdfadsfkadsjflkadsjflkjadslkfjadsflkfjladskjf" />);

    expect(screen.getByTestId("list-item")).toHaveAttribute("data-text-overflow", "wrap");
    expect(css).toContain("min-block-size: var(--list-item-row-height)");
    expect(css).toContain("min-block-size: 46px");
    expect(css).toContain("min-block-size: 22px");
    expect(css).toContain("overflow-wrap: anywhere");
    expect(css).not.toMatch(/\n\s+block-size: var\(--list-item-row-height\)/);
  });

  it("allows clipping and ellipsis only through explicit runtime overflow opt-ins", () => {
    const { rerender } = render(<ListItemNative data-testid="list-item" textOverflow="clip" />);

    expect(screen.getByTestId("list-item")).toHaveAttribute("data-text-overflow", "clip");
    expect(css).toContain('[data-text-overflow="clip"] .chord-list-item-native__title');
    expect(css).toContain("overflow: hidden");

    rerender(<ListItemNative data-testid="list-item" textOverflow="ellipsis" />);

    expect(screen.getByTestId("list-item")).toHaveAttribute("data-text-overflow", "ellipsis");
    expect(css).toContain('[data-text-overflow="ellipsis"] .chord-list-item-native__title');
    expect(css).toContain("text-overflow: ellipsis");
    expect(css).toContain("white-space: nowrap");
  });
});
