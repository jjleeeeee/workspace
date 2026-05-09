import { render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  AvatarGroup,
  avatarGroupAlignmentOptions,
  avatarGroupCountOptions,
  avatarGroupShapeOptions,
  avatarGroupVariantOptions,
  resolveAvatarGroupVariant,
} from "./AvatarGroup";

const avatarGroupCss = readFileSync(join(process.cwd(), "src/components/AvatarGroup/AvatarGroup.css"), "utf8");

describe("AvatarGroup", () => {
  it("exposes Figma variant axes and only 11 live variants", () => {
    expect(avatarGroupShapeOptions).toEqual(["circle", "squircle"]);
    expect(avatarGroupAlignmentOptions).toEqual(["tile", "horizontal"]);
    expect(avatarGroupCountOptions).toEqual(["1", "2", "3", "4", "5+"]);
    expect(avatarGroupVariantOptions).toHaveLength(11);
    expect(avatarGroupVariantOptions).toContain("circle-tile-5+");
    expect(avatarGroupVariantOptions).toContain("circle-horizontal-5+");
    expect(avatarGroupVariantOptions).toContain("squircle-tile-1");
    expect(avatarGroupVariantOptions).not.toContain("squircle-horizontal-2");
  });

  it("normalizes unavailable Squircle combinations instead of inferring missing Figma variants", () => {
    expect(resolveAvatarGroupVariant("squircle", "horizontal", "5+")).toEqual({
      alignment: "tile",
      count: "1",
      normalized: true,
      shape: "squircle",
    });

    const { container } = render(<AvatarGroup shape="squircle" alignment="horizontal" count="5+" />);
    const root = container.querySelector(".chord-avatar-group");
    expect(root).toHaveAttribute("data-shape", "squircle");
    expect(root).toHaveAttribute("data-alignment", "tile");
    expect(root).toHaveAttribute("data-count", "1");
    expect(root).toHaveAttribute("data-normalized", "true");
  });

  it("renders the default Squircle Tile Count 1 variant with Live Tag", () => {
    const { container } = render(<AvatarGroup data-testid="avatar-group" />);
    const root = screen.getByTestId("avatar-group");
    expect(root).toHaveAttribute("data-shape", "squircle");
    expect(root).toHaveAttribute("data-alignment", "tile");
    expect(root).toHaveAttribute("data-count", "1");
    expect(root).toHaveStyle({ "--avatar-group-height": "46px", "--avatar-group-width": "38px" });
    expect(container.querySelectorAll(".chord-avatar")).toHaveLength(1);
    expect(screen.getByTestId("avatar-group-live-tag")).toHaveTextContent("LIVE");
  });

  it("hides the Live Tag but preserves the tile frame size", () => {
    const { container } = render(<AvatarGroup liveTag={false} />);
    const root = container.querySelector(".chord-avatar-group");
    expect(root).toHaveStyle({ "--avatar-group-height": "46px", "--avatar-group-width": "38px" });
    expect(screen.queryByTestId("avatar-group-live-tag")).not.toBeInTheDocument();
  });

  it("renders Circle Tile Count 5+ as grouped avatars plus the internal overflow indicator", () => {
    const { container } = render(<AvatarGroup shape="circle" alignment="tile" count="5+" />);
    const root = container.querySelector(".chord-avatar-group");
    expect(root).toHaveStyle({ "--avatar-group-height": "46px", "--avatar-group-width": "38px" });
    expect(container.querySelectorAll(".chord-avatar")).toHaveLength(4);
    expect(screen.getByTestId("avatar-group-overflow")).toHaveTextContent("5");
  });

  it("renders Horizontal Count 4 with the Figma width table", () => {
    const { container } = render(<AvatarGroup shape="circle" alignment="horizontal" count="4" />);
    const root = container.querySelector(".chord-avatar-group");
    expect(root).toHaveAttribute("data-alignment", "horizontal");
    expect(root).toHaveStyle({ "--avatar-group-height": "26px", "--avatar-group-width": "68px" });
    expect(container.querySelectorAll(".chord-avatar")).toHaveLength(4);
    expect(screen.queryByTestId("avatar-group-live-tag")).not.toBeInTheDocument();
  });

  it("renders Horizontal Count 5+ with four visible avatar slots and overflow", () => {
    const { container } = render(<AvatarGroup shape="circle" alignment="horizontal" count="5+" />);
    expect(container.querySelectorAll(".chord-avatar")).toHaveLength(4);
    expect(screen.getByTestId("avatar-group-overflow")).toHaveTextContent("5");
  });
});

describe("AvatarGroup CSS contract", () => {
  it("uses nested Avatar composition and does not scale child atoms", () => {
    expect(avatarGroupCss).not.toContain("scale(");
    expect(avatarGroupCss).toContain("--avatar-group-width");
    expect(avatarGroupCss).toContain("--avatar-group-live-fill");
    expect(avatarGroupCss).toContain(".chord-avatar-group__overflow");
  });
});
