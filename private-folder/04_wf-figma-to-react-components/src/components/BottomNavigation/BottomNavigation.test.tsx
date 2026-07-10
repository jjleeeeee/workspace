import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BottomNavigation, bottomNavigationValidCombinations } from "./BottomNavigation";

const bottomNavigationCss = readFileSync(
  join(process.cwd(), "src/components/BottomNavigation/BottomNavigation.css"),
  "utf8"
);

describe("BottomNavigation", () => {
  describe("Figma valid combinations", () => {
    it("exposes 4 combinations (2 modes × 2 OS)", () => {
      expect(bottomNavigationValidCombinations).toHaveLength(4);
    });
  });

  describe("root element", () => {
    it("renders chord-bottom-navigation root class", () => {
      const { container } = render(<BottomNavigation />);
      expect(container.querySelector(".chord-bottom-navigation")).not.toBeNull();
    });

    it("applies data-mode=default by default", () => {
      const { container } = render(<BottomNavigation />);
      expect(container.querySelector("[data-mode='default']")).not.toBeNull();
    });

    it("applies data-mode=fixed when mode=fixed", () => {
      const { container } = render(<BottomNavigation mode="fixed" />);
      expect(container.querySelector("[data-mode='fixed']")).not.toBeNull();
    });

    it("applies data-os=ios by default", () => {
      const { container } = render(<BottomNavigation />);
      expect(container.querySelector("[data-os='ios']")).not.toBeNull();
    });

    it("applies data-os=android when os=android", () => {
      const { container } = render(<BottomNavigation os="android" />);
      expect(container.querySelector("[data-os='android']")).not.toBeNull();
    });
  });

  describe("tabs", () => {
    it("renders 4 tab buttons", () => {
      const { container } = render(<BottomNavigation />);
      expect(container.querySelectorAll(".chord-bottom-navigation__tab")).toHaveLength(4);
    });

    it("marks home tab active by default", () => {
      const { container } = render(<BottomNavigation />);
      const tabs = Array.from(container.querySelectorAll(".chord-bottom-navigation__tab"));
      expect(tabs[0]?.getAttribute("data-active")).toBe("true");
      expect(tabs[1]?.getAttribute("data-active")).toBe("false");
      expect(tabs[2]?.getAttribute("data-active")).toBe("false");
      expect(tabs[3]?.getAttribute("data-active")).toBe("false");
    });

    it("marks specified activeTab as active", () => {
      const { container } = render(<BottomNavigation activeTab="dm" />);
      const tabs = Array.from(container.querySelectorAll(".chord-bottom-navigation__tab"));
      expect(tabs[2]?.getAttribute("data-active")).toBe("true");
      expect(tabs[0]?.getAttribute("data-active")).toBe("false");
    });

    it("calls onTabChange when tab clicked", () => {
      const onTabChange = vi.fn();
      render(<BottomNavigation onTabChange={onTabChange} />);
      fireEvent.click(screen.getByLabelText("Shop"));
      expect(onTabChange).toHaveBeenCalledWith("shop");
    });

    it("renders tab labels", () => {
      render(<BottomNavigation />);
      expect(screen.getByText("Home")).not.toBeNull();
      expect(screen.getByText("Shop")).not.toBeNull();
      expect(screen.getByText("DM")).not.toBeNull();
      expect(screen.getByText("More")).not.toBeNull();
    });

    it("active tab has aria-current=page", () => {
      render(<BottomNavigation activeTab="shop" />);
      expect(screen.getByLabelText("Shop").getAttribute("aria-current")).toBe("page");
      expect(screen.getByLabelText("Home").getAttribute("aria-current")).toBeNull();
    });
  });

  describe("community button", () => {
    it("renders community button", () => {
      const { container } = render(<BottomNavigation />);
      expect(container.querySelector(".chord-bottom-navigation__community")).not.toBeNull();
    });
  });

  describe("system indicator", () => {
    it("renders home indicator for iOS by default", () => {
      const { container } = render(<BottomNavigation />);
      expect(container.querySelector(".chord-bottom-navigation__home-indicator")).not.toBeNull();
    });

    it("renders android nav for android OS", () => {
      const { container } = render(<BottomNavigation os="android" />);
      expect(container.querySelector(".chord-bottom-navigation__android-nav")).not.toBeNull();
    });

    it("hides system indicator when showSystem=false", () => {
      const { container } = render(<BottomNavigation showSystem={false} />);
      expect(container.querySelector(".chord-bottom-navigation__system")).toBeNull();
    });
  });

  describe("Figma policy (node 87669:2290)", () => {
    it("uses pill border-radius for tab selection", () => {
      expect(bottomNavigationCss).toContain("border-radius: 999px");
    });

    it("uses backdrop-filter blur for pill", () => {
      expect(bottomNavigationCss).toContain("backdrop-filter: blur");
    });
  });
});
