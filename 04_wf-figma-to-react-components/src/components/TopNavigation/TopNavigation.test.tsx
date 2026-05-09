import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  TopNavigation,
  topNavigationLeadingTypeOptions,
  topNavigationTrailingCountOptions,
} from "./TopNavigation";

describe("TopNavigation", () => {
  describe("root element", () => {
    it("renders chord-top-navigation root class", () => {
      const { container } = render(<TopNavigation />);
      expect(container.querySelector(".chord-top-navigation")).not.toBeNull();
    });

    it("applies data-mode=default by default", () => {
      const { container } = render(<TopNavigation />);
      expect(container.querySelector("[data-mode='default']")).not.toBeNull();
    });

    it("applies data-mode=fixed when mode=fixed", () => {
      const { container } = render(<TopNavigation mode="fixed" />);
      expect(container.querySelector("[data-mode='fixed']")).not.toBeNull();
    });

    it("applies data-text-type=center by default", () => {
      const { container } = render(<TopNavigation />);
      expect(container.querySelector("[data-text-type='center']")).not.toBeNull();
    });

    it("applies data-text-type=search when textType=search", () => {
      const { container } = render(<TopNavigation textType="search" />);
      expect(container.querySelector("[data-text-type='search']")).not.toBeNull();
    });

    it("applies data-scroll-bg=off by default", () => {
      const { container } = render(<TopNavigation />);
      expect(container.querySelector("[data-scroll-bg='off']")).not.toBeNull();
    });

    it("applies data-scroll-bg=on when scrollBg=on", () => {
      const { container } = render(<TopNavigation scrollBg="on" />);
      expect(container.querySelector("[data-scroll-bg='on']")).not.toBeNull();
    });
  });

  describe("title and subtitle", () => {
    it("renders titleLabel", () => {
      render(<TopNavigation titleLabel="My Title" />);
      expect(screen.getByText("My Title")).not.toBeNull();
    });

    it("renders subTitleLabel when showSubTitle=true", () => {
      render(<TopNavigation subTitleLabel="Sub" showSubTitle />);
      expect(screen.getByText("Sub")).not.toBeNull();
    });

    it("does not render subTitleLabel when showSubTitle=false", () => {
      render(<TopNavigation subTitleLabel="Sub" showSubTitle={false} />);
      expect(screen.queryByText("Sub")).toBeNull();
    });

    it("records marquee and subtitle icon Figma props as data contracts", () => {
      const { container } = render(<TopNavigation marquee showSubTitleIcon />);
      expect(container.querySelector(".chord-top-navigation")).toHaveAttribute("data-marquee", "true");
      expect(container.querySelector(".chord-top-navigation__subtitle-icon")).not.toBeNull();
    });
  });

  describe("leading slot", () => {
    it("exposes nested leading type options from Figma", () => {
      expect(topNavigationLeadingTypeOptions).toEqual(["icon-avatar", "avatar", "icon"]);
    });

    it("renders leading area by default when showLeading=true", () => {
      const { container } = render(<TopNavigation />);
      expect(container.querySelector(".chord-top-navigation__leading")).not.toBeNull();
    });

    it("renders leading slot when showLeading=true and leadingSlot provided", () => {
      const { container } = render(
        <TopNavigation showLeading leadingSlot={<span data-testid="lead-icon" />} />,
      );
      expect(container.querySelector(".chord-top-navigation__leading")).not.toBeNull();
    });

    it("does not render leading when showLeading=false", () => {
      const { container } = render(
        <TopNavigation showLeading={false} leadingSlot={<span />} />,
      );
      expect(container.querySelector(".chord-top-navigation__leading")).toBeNull();
    });

    it("renders the avatar-only leading branch", () => {
      const { container } = render(<TopNavigation leadingType="avatar" />);
      const leading = container.querySelector(".chord-top-navigation__leading");
      expect(leading).toHaveAttribute("data-leading-type", "avatar");
      expect(leading?.querySelector(".chord-avatar")).not.toBeNull();
    });
  });

  describe("trailing slot", () => {
    it("exposes nested trailing count options from Figma", () => {
      expect(topNavigationTrailingCountOptions).toEqual(["1ea", "2ea", "3ea", "lottie"]);
    });

    it("renders one trailing item by default when showTrailing=true", () => {
      const { container } = render(<TopNavigation />);
      const trailing = container.querySelector(".chord-top-navigation__trailing");
      expect(trailing).not.toBeNull();
      expect(trailing?.querySelectorAll(".chord-top-navigation__trailing-item")).toHaveLength(1);
    });

    it("renders trailing slot when showTrailing=true and trailingSlot provided", () => {
      const { container } = render(
        <TopNavigation showTrailing trailingSlot={<span data-testid="trail-icon" />} />,
      );
      expect(container.querySelector(".chord-top-navigation__trailing")).not.toBeNull();
    });

    it("does not render trailing when showTrailing=false", () => {
      const { container } = render(
        <TopNavigation showTrailing={false} trailingSlot={<span />} />,
      );
      expect(container.querySelector(".chord-top-navigation__trailing")).toBeNull();
    });

    it("renders three trailing items for count=3ea", () => {
      const { container } = render(<TopNavigation trailingCount="3ea" />);
      const trailing = container.querySelector(".chord-top-navigation__trailing");
      expect(trailing).toHaveAttribute("data-trailing-count", "3ea");
      expect(trailing?.querySelectorAll(".chord-top-navigation__trailing-item")).toHaveLength(3);
    });
  });

  describe("search type", () => {
    it("renders search area for textType=search", () => {
      const { container } = render(<TopNavigation textType="search" />);
      expect(container.querySelector(".chord-top-navigation__search")).not.toBeNull();
    });

    it("does not render text area for textType=search", () => {
      const { container } = render(<TopNavigation textType="search" />);
      expect(container.querySelector(".chord-top-navigation__text-area")).toBeNull();
    });
  });

  describe("logo types", () => {
    it("renders logo area for textType=logo-svg", () => {
      const { container } = render(
        <TopNavigation textType="logo-svg" logoSlot={<svg data-testid="logo" />} />,
      );
      expect(container.querySelector(".chord-top-navigation__logo")).not.toBeNull();
    });

    it("renders logo area for textType=logo-svg-center", () => {
      const { container } = render(
        <TopNavigation textType="logo-svg-center" logoSlot={<svg data-testid="logo" />} />,
      );
      expect(container.querySelector(".chord-top-navigation__logo")).not.toBeNull();
    });
  });

  describe("image types", () => {
    it("renders leading image for textType=img when showImage=true", () => {
      const { container } = render(
        <TopNavigation textType="img" showImage imageSlot={<img alt="avatar" />} />,
      );
      expect(container.querySelector(".chord-top-navigation__image")).not.toBeNull();
    });

    it("does not render image when showImage=false", () => {
      const { container } = render(
        <TopNavigation textType="img" showImage={false} imageSlot={<img alt="avatar" />} />,
      );
      expect(container.querySelector(".chord-top-navigation__image")).toBeNull();
    });
  });

  describe("official badge", () => {
    it("renders official badge by default because Figma default is true", () => {
      const { container } = render(<TopNavigation />);
      expect(container.querySelector(".chord-top-navigation__badge")).not.toBeNull();
    });

    it("renders badge when showOfficialBadge=true", () => {
      const { container } = render(<TopNavigation showOfficialBadge />);
      expect(container.querySelector(".chord-top-navigation__badge")).not.toBeNull();
    });

    it("does not render badge when showOfficialBadge=false", () => {
      const { container } = render(<TopNavigation showOfficialBadge={false} />);
      expect(container.querySelector(".chord-top-navigation__badge")).toBeNull();
    });
  });
});
