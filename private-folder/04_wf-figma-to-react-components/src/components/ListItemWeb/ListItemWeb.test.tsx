import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  ListItemWeb,
  listItemWebLeadingTypeOptions,
  listItemWebStatesOptions,
  listItemWebTrailingTypeOptions,
} from "./ListItemWeb";

describe("ListItemWeb", () => {
  describe("root element", () => {
    it("renders a chord-list-item-web root class", () => {
      const { container } = render(<ListItemWeb titleLabel="Title" />);
      expect(container.querySelector(".chord-list-item-web")).not.toBeNull();
    });

    it("applies data-mode=default by default", () => {
      const { container } = render(<ListItemWeb titleLabel="Title" />);
      expect(container.querySelector("[data-mode='default']")).not.toBeNull();
    });

    it("applies data-mode=fixed when mode=fixed", () => {
      const { container } = render(<ListItemWeb titleLabel="Title" mode="fixed" />);
      expect(container.querySelector("[data-mode='fixed']")).not.toBeNull();
    });

    it("applies data-size=small by default", () => {
      const { container } = render(<ListItemWeb titleLabel="Title" />);
      expect(container.querySelector("[data-size='small']")).not.toBeNull();
    });

    it("applies data-size=medium when size=medium", () => {
      const { container } = render(<ListItemWeb titleLabel="Title" size="medium" />);
      expect(container.querySelector("[data-size='medium']")).not.toBeNull();
    });

    it("applies data-states=default by default", () => {
      const { container } = render(<ListItemWeb titleLabel="Title" />);
      expect(container.querySelector("[data-states='default']")).not.toBeNull();
    });

    it("applies data-states=disabled when states=disabled", () => {
      const { container } = render(<ListItemWeb titleLabel="Title" states="disabled" />);
      expect(container.querySelector("[data-states='disabled']")).not.toBeNull();
    });

    it("uses Figma state options without selected", () => {
      expect(listItemWebStatesOptions).toEqual(["default", "hover-pressed", "disabled"]);
      expect(listItemWebStatesOptions).not.toContain("selected");
    });

    it("applies data-states=hover-pressed when states=hover-pressed", () => {
      const { container } = render(<ListItemWeb titleLabel="Title" states="hover-pressed" />);
      expect(container.querySelector("[data-states='hover-pressed']")).not.toBeNull();
    });
  });

  describe("title", () => {
    it("renders titleLabel text", () => {
      render(<ListItemWeb titleLabel="Hello World" />);
      expect(screen.getByText("Hello World")).not.toBeNull();
    });

    it("renders title in chord-list-item-web__title element", () => {
      const { container } = render(<ListItemWeb titleLabel="Title" />);
      expect(container.querySelector(".chord-list-item-web__title")).not.toBeNull();
    });
  });

  describe("body (subtitle)", () => {
    it("renders Figma default body text by default", () => {
      render(<ListItemWeb titleLabel="Title" />);
      expect(screen.getByText("Body Text")).not.toBeNull();
    });

    it("renders bodyLabel text when provided", () => {
      render(<ListItemWeb titleLabel="Title" bodyLabel="Body text" />);
      expect(screen.getByText("Body text")).not.toBeNull();
    });

    it("does not render body element when bodyLabel is null", () => {
      const { container } = render(<ListItemWeb titleLabel="Title" bodyLabel={null} />);
      expect(container.querySelector(".chord-list-item-web__body")).toBeNull();
    });

    it("renders the Figma body leading icon area when body is visible", () => {
      const { container } = render(<ListItemWeb titleLabel="Title" />);
      const icon = container.querySelector(".chord-list-item-web__body-icon .chord-icon");
      expect(icon).not.toBeNull();
      expect(icon).toHaveAttribute("data-icon-name", "nullMedium");
      expect(icon).toHaveAttribute("data-icon-size", "12");
    });
  });

  describe("badgeDot", () => {
    it("renders badge dot when showBadgeDot=true", () => {
      const { container } = render(<ListItemWeb titleLabel="Title" showBadgeDot />);
      expect(container.querySelector(".chord-list-item-web__badge-dot")).not.toBeNull();
    });

    it("does not render badge dot by default", () => {
      const { container } = render(<ListItemWeb titleLabel="Title" />);
      expect(container.querySelector(".chord-list-item-web__badge-dot")).toBeNull();
    });
  });

  describe("leading slot", () => {
    it("exposes all recursively confirmed ListItemWeb leading type options", () => {
      expect(listItemWebLeadingTypeOptions).toEqual([
        "avatar",
        "checkbox",
        "icon",
        "radio",
        "rectangular-thumbnail",
        "square-thumbnail",
      ]);
    });

    it("renders default Thumbnail leading area when showLeading=true", () => {
      const { container } = render(<ListItemWeb titleLabel="Title" />);
      const leading = container.querySelector(".chord-list-item-web__leading");
      expect(leading).not.toBeNull();
      expect(leading?.querySelector(".chord-thumbnail")).not.toBeNull();
    });

    it("uses the small leading size by default", () => {
      const { container } = render(<ListItemWeb titleLabel="Title" />);
      const thumbnail = container.querySelector(".chord-list-item-web__leading .chord-thumbnail");
      expect(thumbnail).toHaveStyle({ "--thumbnail-width": "44px" });
    });

    it("records the small Figma leading branch metadata", () => {
      const { container } = render(<ListItemWeb titleLabel="Title" size="small" />);
      const leading = container.querySelector(".chord-list-item-web__leading");
      expect(leading).toHaveAttribute("data-leading-type", "square-thumbnail");
      expect(leading).toHaveAttribute("data-leading-component-set-id", "63406:10120");
      expect(leading).toHaveAttribute("data-leading-component-id", "63406:10129");
      expect(leading).toHaveAttribute("data-leading-visible-property", "Show Small Leading#69756:13");
    });

    it("uses the medium leading size when size=medium", () => {
      const { container } = render(<ListItemWeb titleLabel="Title" size="medium" />);
      const thumbnail = container.querySelector(".chord-list-item-web__leading .chord-thumbnail");
      expect(thumbnail).toHaveStyle({ "--thumbnail-width": "56px" });
    });

    it("records the medium Figma leading branch metadata", () => {
      const { container } = render(<ListItemWeb titleLabel="Title" size="medium" />);
      const leading = container.querySelector(".chord-list-item-web__leading");
      expect(leading).toHaveAttribute("data-leading-type", "square-thumbnail");
      expect(leading).toHaveAttribute("data-leading-component-set-id", "57343:20398");
      expect(leading).toHaveAttribute("data-leading-component-id", "63354:137265");
      expect(leading).toHaveAttribute("data-leading-visible-property", "Show Medium Leading#69756:0");
    });

    it("passes the fixed square Thumbnail contract used by the default ListItemWeb Leading", () => {
      const { container } = render(<ListItemWeb titleLabel="Title" />);
      const thumbnail = container.querySelector(".chord-list-item-web__leading .chord-thumbnail");
      expect(thumbnail).toHaveAttribute("data-type", "thumbnail");
      expect(thumbnail).toHaveAttribute("data-ratio", "1:1");
      expect(thumbnail).toHaveAttribute("data-radius", "on");
      expect(thumbnail).toHaveAttribute("data-fill", "false");
      expect(thumbnail).toHaveAttribute("data-button", "false");
      expect(thumbnail).toHaveAttribute("data-left-item", "false");
      expect(thumbnail).toHaveAttribute("data-right-item-top", "false");
      expect(thumbnail).toHaveAttribute("data-right-item-bottom", "false");
      expect(thumbnail).toHaveAttribute("data-seek-bar", "false");
    });

    it("renders the avatar leading branch with the Figma small override", () => {
      const { container } = render(<ListItemWeb titleLabel="Title" leadingType="avatar" size="small" />);
      const leading = container.querySelector(".chord-list-item-web__leading");
      const avatar = leading?.querySelector(".chord-avatar");
      expect(leading).toHaveAttribute("data-leading-type", "avatar");
      expect(leading).toHaveAttribute("data-leading-component-id", "63406:10121");
      expect(leading).toHaveStyle({ "--list-item-web-leading-width": "40px" });
      expect(avatar).toHaveAttribute("data-type", "squircle");
      expect(avatar).toHaveAttribute("data-size", "small");
      expect(avatar).toHaveAttribute("data-badge-dot", "false");
      expect(avatar).toHaveStyle({ "--avatar-component-size": "40px", "--avatar-image-size": "34px" });
    });

    it("renders the avatar leading branch with the Figma medium size", () => {
      const { container } = render(<ListItemWeb titleLabel="Title" leadingType="avatar" size="medium" />);
      const leading = container.querySelector(".chord-list-item-web__leading");
      const avatar = leading?.querySelector(".chord-avatar");
      expect(leading).toHaveAttribute("data-leading-component-id", "57343:20399");
      expect(leading).toHaveStyle({ "--list-item-web-leading-width": "46px" });
      expect(avatar).toHaveStyle({ "--avatar-component-size": "46px", "--avatar-image-size": "40px" });
    });

    it("renders the checkbox leading branch using Checkbox", () => {
      const { container } = render(<ListItemWeb titleLabel="Title" leadingType="checkbox" />);
      const leading = container.querySelector(".chord-list-item-web__leading");
      const checkbox = leading?.querySelector(".chord-checkbox");
      expect(leading).toHaveAttribute("data-leading-component-id", "63406:10123");
      expect(checkbox).toHaveAttribute("data-type", "square");
      expect(checkbox).toHaveAttribute("data-status", "default");
    });

    it("renders the icon leading branch using the confirmed null medium icon", () => {
      const { container } = render(<ListItemWeb titleLabel="Title" leadingType="icon" />);
      const leadingIcon = container.querySelector(".chord-list-item-web__leading-icon .chord-icon");
      expect(leadingIcon).toHaveAttribute("data-icon-name", "nullMedium");
      expect(leadingIcon).toHaveAttribute("data-icon-size", "24");
    });

    it("renders the radio leading branch using Radio enabled status", () => {
      const { container } = render(<ListItemWeb titleLabel="Title" leadingType="radio" />);
      const leading = container.querySelector(".chord-list-item-web__leading");
      const radio = leading?.querySelector(".chord-radio");
      expect(leading).toHaveAttribute("data-leading-component-id", "63406:10131");
      expect(radio).toHaveAttribute("data-status", "enabled");
    });

    it("renders the rectangular thumbnail leading branch with size-specific dimensions", () => {
      const small = render(<ListItemWeb titleLabel="Title" leadingType="rectangular-thumbnail" size="small" />);
      const smallLeading = small.container.querySelector(".chord-list-item-web__leading");
      const smallThumbnail = small.container.querySelector(".chord-list-item-web__leading .chord-thumbnail");
      expect(smallLeading).toHaveAttribute("data-leading-component-id", "63406:10127");
      expect(smallLeading).toHaveStyle({ "--list-item-web-leading-width": "100px" });
      expect(smallThumbnail).toHaveStyle({ "--thumbnail-width": "100px", "--thumbnail-height": "56px" });
      expect(smallThumbnail).toHaveAttribute("data-ratio", "16:9");

      const medium = render(<ListItemWeb titleLabel="Title" leadingType="rectangular-thumbnail" size="medium" />);
      const mediumLeading = medium.container.querySelector(".chord-list-item-web__leading");
      const mediumThumbnail = medium.container.querySelector(".chord-list-item-web__leading .chord-thumbnail");
      expect(mediumLeading).toHaveAttribute("data-leading-component-id", "62641:42034");
      expect(mediumLeading).toHaveStyle({ "--list-item-web-leading-width": "156px" });
      expect(mediumThumbnail).toHaveStyle({ "--thumbnail-width": "156px", "--thumbnail-height": "88px" });
    });

    it("renders a custom leading area when leadingSlot is provided", () => {
      const { container } = render(
        <ListItemWeb titleLabel="Title" leadingSlot={<div data-testid="thumb" />} />,
      );
      expect(container.querySelector(".chord-list-item-web__leading")).not.toBeNull();
    });

    it("hides leading when showLeading=false even if leadingSlot is provided", () => {
      const { container } = render(
        <ListItemWeb titleLabel="Title" leadingSlot={<div />} showLeading={false} />,
      );
      expect(container.querySelector(".chord-list-item-web__leading")).toBeNull();
    });

    it("uses the Figma small leading boolean only for small rows", () => {
      const { container } = render(<ListItemWeb titleLabel="Title" size="small" showSmallLeading={false} />);
      expect(container.querySelector(".chord-list-item-web__leading")).toBeNull();
    });

    it("uses the Figma medium leading boolean only for medium rows", () => {
      const { container } = render(<ListItemWeb titleLabel="Title" size="medium" showMediumLeading={false} />);
      expect(container.querySelector(".chord-list-item-web__leading")).toBeNull();
    });
  });

  describe("trailing", () => {
    it("exposes all nested trailing type options from Figma", () => {
      expect(listItemWebTrailingTypeOptions).toEqual([
        "main-button",
        "icon-button",
        "number-badge",
        "radio",
        "toggle",
        "text-and-icon",
        "text-only",
        "icon-only",
      ]);
    });

    it("shows trailing area by default", () => {
      const { container } = render(<ListItemWeb titleLabel="Title" />);
      expect(container.querySelector(".chord-list-item-web__trailing")).not.toBeNull();
    });

    it("hides trailing when showTrailing=false", () => {
      const { container } = render(<ListItemWeb titleLabel="Title" showTrailing={false} />);
      expect(container.querySelector(".chord-list-item-web__trailing")).toBeNull();
    });

    it("renders trailing label text when provided", () => {
      render(<ListItemWeb titleLabel="Title" trailingLabel="Detail" showTrailing />);
      expect(screen.getByText("Detail")).not.toBeNull();
    });

    it("renders trailing arrow icon when showTrailing=true", () => {
      const { container } = render(<ListItemWeb titleLabel="Title" showTrailing />);
      expect(container.querySelector(".chord-list-item-web__trailing-icon")).not.toBeNull();
    });

    it("renders the default small disabled live Figma check trailing branch", () => {
      const { container } = render(
        <ListItemWeb mode="default" size="small" states="disabled" titleLabel="Title" />,
      );
      const trailing = container.querySelector(".chord-list-item-web__trailing");
      expect(trailing).toHaveAttribute("data-trailing-branch", "check");
      expect(trailing?.querySelector(".chord-list-item-web__trailing-label")).toBeNull();
      expect(trailing?.querySelector(".chord-icon")).toHaveAttribute("data-icon-name", "checkMedium");
      expect(trailing?.querySelector(".chord-icon")).toHaveAttribute("data-icon-size", "20");
    });

    it("renders the nested main-button trailing branch using TextButton", () => {
      const { container } = render(<ListItemWeb titleLabel="Title" trailingType="main-button" />);
      const trailing = container.querySelector(".chord-list-item-web__trailing");
      expect(trailing).toHaveAttribute("data-trailing-branch", "main-button");
      expect(trailing?.querySelector(".chord-text-button")).not.toBeNull();
    });

    it("renders the nested icon-button trailing branch using IconButton", () => {
      const { container } = render(<ListItemWeb titleLabel="Title" trailingType="icon-button" />);
      const trailing = container.querySelector(".chord-list-item-web__trailing");
      expect(trailing).toHaveAttribute("data-trailing-branch", "icon-button");
      expect(trailing?.querySelector(".chord-icon-button")).not.toBeNull();
    });

    it("renders the nested number-badge trailing branch using BadgeNumber", () => {
      const { container } = render(<ListItemWeb titleLabel="Title" trailingType="number-badge" />);
      const trailing = container.querySelector(".chord-list-item-web__trailing");
      expect(trailing).toHaveAttribute("data-trailing-branch", "number-badge");
      expect(trailing?.querySelector(".chord-badge-number")).not.toBeNull();
    });

    it("renders the nested radio trailing branch using Radio", () => {
      const { container } = render(<ListItemWeb titleLabel="Title" trailingType="radio" />);
      const trailing = container.querySelector(".chord-list-item-web__trailing");
      expect(trailing).toHaveAttribute("data-trailing-branch", "radio");
      expect(trailing?.querySelector(".chord-radio")).not.toBeNull();
    });

    it("renders the nested toggle trailing branch using ToggleSwitch", () => {
      const { container } = render(<ListItemWeb titleLabel="Title" trailingType="toggle" />);
      const trailing = container.querySelector(".chord-list-item-web__trailing");
      expect(trailing).toHaveAttribute("data-trailing-branch", "toggle");
      expect(trailing?.querySelector(".chord-toggle-switch")).not.toBeNull();
    });

    it("honors nested trailing text and icon booleans for text-and-icon", () => {
      const { container } = render(
        <ListItemWeb
          titleLabel="Title"
          trailingType="text-and-icon"
          showTrailingText={false}
          showTrailingIcon={false}
        />,
      );
      const trailing = container.querySelector(".chord-list-item-web__trailing");
      expect(trailing).toHaveAttribute("data-trailing-branch", "text-and-icon");
      expect(trailing?.querySelector(".chord-list-item-web__trailing-label")).toBeNull();
      expect(trailing?.querySelector(".chord-list-item-web__trailing-icon")).toBeNull();
    });
  });

  describe("divider", () => {
    it("renders divider by default", () => {
      const { container } = render(<ListItemWeb titleLabel="Title" />);
      expect(container.querySelector(".chord-list-item-web__divider")).not.toBeNull();
    });

    it("hides divider when showDivider=false", () => {
      const { container } = render(<ListItemWeb titleLabel="Title" showDivider={false} />);
      expect(container.querySelector(".chord-list-item-web__divider")).toBeNull();
    });

    it("marks the default small disabled divider as the live direct divider branch", () => {
      const { container } = render(
        <ListItemWeb mode="default" size="small" states="disabled" titleLabel="Title" />,
      );
      expect(container.querySelector(".chord-list-item-web__divider")).toHaveAttribute(
        "data-divider-branch",
        "direct",
      );
    });
  });

  describe("state indicator", () => {
    it("does not render a selected indicator because Figma has no selected state", () => {
      const { container } = render(<ListItemWeb titleLabel="Title" states="default" />);
      expect(container.querySelector(".chord-list-item-web__selected-indicator")).toBeNull();
    });

    it("does not render selected indicator when states=disabled", () => {
      const { container } = render(<ListItemWeb titleLabel="Title" states="disabled" />);
      expect(container.querySelector(".chord-list-item-web__selected-indicator")).toBeNull();
    });
  });
});
