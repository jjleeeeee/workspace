import { fireEvent, render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  Avatar,
  avatarSizeOptions,
  avatarTypeOptions,
  avatarVariantOptions,
  getAvatarSizeSpec,
} from "./Avatar";

const avatarCss = readFileSync(join(process.cwd(), "src/components/Avatar/Avatar.css"), "utf8");

describe("Avatar", () => {
  it("exposes the complete Figma variant axes", () => {
    expect(avatarTypeOptions).toEqual(["circle", "squircle"]);
    expect(avatarSizeOptions).toEqual([
      "xxxxlarge",
      "xxxlarge",
      "xxlarge",
      "xlarge",
      "large",
      "medium",
      "small",
      "xsmall",
      "xxsmall",
      "xxxsmall",
      "tiny",
    ]);
    expect(avatarVariantOptions).toHaveLength(44);
    expect(avatarVariantOptions).toContain("default-circle-xxxxlarge");
    expect(avatarVariantOptions).toContain("fixed-squircle-tiny");
  });

  it("maps every size to Figma component and value dimensions", () => {
    expect(getAvatarSizeSpec("xxxxlarge")).toEqual({ component: 140, image: 128 });
    expect(getAvatarSizeSpec("medium")).toEqual({ component: 56, image: 48 });
    expect(getAvatarSizeSpec("small")).toEqual({ component: 46, image: 40 });
    expect(getAvatarSizeSpec("tiny")).toEqual({ component: 22, image: 16 });
  });

  it("renders circle-only decorations and suppresses squircle-only decorations", () => {
    render(<Avatar data-testid="avatar" size="medium" avatarType="circle" />);

    const avatar = screen.getByTestId("avatar");
    expect(avatar).toHaveAttribute("data-type", "circle");
    expect(screen.getByTestId("avatar-ring")).toBeInTheDocument();
    expect(screen.getByTestId("avatar-birthday-hat")).toHaveAttribute("data-icon-name", "birthdayHatMedium");
    expect(screen.getByTestId("avatar-emoji")).toHaveTextContent("🏕");
    expect(screen.queryByTestId("avatar-badge-dot")).not.toBeInTheDocument();
    expect(screen.queryByTestId("avatar-host")).not.toBeInTheDocument();
  });

  it("renders squircle-only decorations and suppresses circle-only decorations", () => {
    render(<Avatar data-testid="avatar" size="medium" avatarType="squircle" />);

    const avatar = screen.getByTestId("avatar");
    expect(avatar).toHaveAttribute("data-type", "squircle");
    expect(screen.getByTestId("avatar-badge-dot")).toBeInTheDocument();
    expect(screen.getByTestId("avatar-host")).toBeInTheDocument();
    expect(screen.queryByTestId("avatar-ring")).not.toBeInTheDocument();
    expect(screen.queryByTestId("avatar-birthday-hat")).not.toBeInTheDocument();
    expect(screen.queryByTestId("avatar-emoji")).not.toBeInTheDocument();
  });

  it("maps Squircle host size and nested Avatar size from Figma", () => {
    const { rerender } = render(<Avatar data-testid="avatar" size="xxxxlarge" avatarType="squircle" />);

    expect(screen.getByTestId("avatar")).toHaveStyle({ "--avatar-host-size": "46px" });
    expect(screen.getByTestId("avatar-host").querySelector(".chord-avatar")).toHaveAttribute("data-size", "small");

    rerender(<Avatar data-testid="avatar" size="xxxlarge" avatarType="squircle" />);

    expect(screen.getByTestId("avatar")).toHaveStyle({ "--avatar-host-size": "38px" });
    expect(screen.getByTestId("avatar-host").querySelector(".chord-avatar")).toHaveAttribute("data-size", "xsmall");

    rerender(<Avatar data-testid="avatar" size="medium" avatarType="squircle" />);

    expect(screen.getByTestId("avatar")).toHaveStyle({ "--avatar-host-size": "30px" });
    expect(screen.getByTestId("avatar-host").querySelector(".chord-avatar")).toHaveAttribute("data-size", "xxsmall");
  });

  it("allows verified parent compositions to override rendered component and image bounds without changing Figma axes", () => {
    render(
      <Avatar
        avatarType="squircle"
        componentSize={40}
        data-testid="avatar"
        imageSize={40}
        size="small"
      />,
    );

    expect(screen.getByTestId("avatar")).toHaveAttribute("data-size", "small");
    expect(screen.getByTestId("avatar")).toHaveAttribute("data-component-size-override", "true");
    expect(screen.getByTestId("avatar")).toHaveStyle({
      "--avatar-component-size": "40px",
      "--avatar-image-offset": "0px",
      "--avatar-image-size": "40px",
    });
  });

  it("falls back to the explicit placeholder when the image fails", () => {
    render(<Avatar alt="Profile" data-testid="avatar" src="/missing.png" />);

    const image = screen.getByTestId("avatar").querySelector("img");
    expect(image).toBeInTheDocument();
    fireEvent.error(image as HTMLImageElement);

    expect(screen.getByTestId("avatar-placeholder")).toHaveAttribute(
      "data-asset-classification",
      "asset-backed-placeholder",
    );
  });

  it("renders the Figma-exported SVG placeholder for the current avatar size", () => {
    render(<Avatar data-testid="avatar" size="small" />);

    const placeholder = screen.getByTestId("avatar-placeholder");

    expect(placeholder).toHaveAttribute("data-placeholder-source-node", "81500:7440");
    expect(placeholder).toHaveAttribute("data-placeholder-file", "avatar-placeholder-small.svg");
    expect(placeholder).toHaveAttribute("data-asset-classification", "asset-backed-placeholder");
    expect(placeholder).toHaveAttribute("src", expect.stringContaining("svg"));
  });
});

describe("Avatar CSS contract", () => {
  it("uses exported avatar assets and keeps decoration sizing hooks", () => {
    expect(avatarCss).toContain("squircle-mask.svg");
    expect(avatarCss).not.toContain(".chord-avatar__placeholder::before");
    expect(avatarCss).not.toContain(".chord-avatar__placeholder::after");
    expect(avatarCss).toContain("--avatar-component-size");
    expect(avatarCss).toContain("--avatar-image-size");
    expect(avatarCss).toContain("--avatar-badge-dot-size");
    expect(avatarCss).toContain("inset-block-end: 0;");
    expect(avatarCss).toContain("inset-inline-end: 0;");
    expect(avatarCss).not.toContain("inset-block-end: -4px");
    expect(avatarCss).not.toContain("inset-inline-end: -4px");
    expect(avatarCss).not.toContain("chord-list-item-leading__avatar");
  });
});
