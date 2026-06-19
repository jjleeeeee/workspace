import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Tabs, tabsValidCombinations } from "./Tabs";

const tabsCss = readFileSync(join(process.cwd(), "src/components/Tabs/Tabs.css"), "utf8");

const defaultItems = ["Tab 1", "Tab 2", "Tab 3"];

describe("Tabs", () => {
  describe("Figma valid combinations", () => {
    it("exposes the 4 bar combinations (2 modes × 2 types)", () => {
      expect(tabsValidCombinations).toHaveLength(4);
    });
  });

  describe("root element", () => {
    it("renders chord-tabs root class", () => {
      const { container } = render(<Tabs tabItems={defaultItems} />);
      expect(container.querySelector(".chord-tabs")).not.toBeNull();
    });

    it("applies data-mode=default by default", () => {
      const { container } = render(<Tabs tabItems={defaultItems} />);
      expect(container.querySelector("[data-mode='default']")).not.toBeNull();
    });

    it("applies data-mode=fixed when mode=fixed", () => {
      const { container } = render(<Tabs tabItems={defaultItems} mode="fixed" />);
      expect(container.querySelector("[data-mode='fixed']")).not.toBeNull();
    });

    it("applies data-type=fill by default", () => {
      const { container } = render(<Tabs tabItems={defaultItems} />);
      expect(container.querySelector("[data-type='fill']")).not.toBeNull();
    });

    it("applies data-type=swipe when type=swipe", () => {
      const { container } = render(<Tabs tabItems={defaultItems} type="swipe" />);
      expect(container.querySelector("[data-type='swipe']")).not.toBeNull();
    });
  });

  describe("bar tab items", () => {
    it("renders all tab labels", () => {
      render(<Tabs tabItems={["Alpha", "Beta", "Gamma"]} />);
      expect(screen.getByText("Alpha")).not.toBeNull();
      expect(screen.getByText("Beta")).not.toBeNull();
      expect(screen.getByText("Gamma")).not.toBeNull();
    });

    it("marks the first tab selected by default", () => {
      const { container } = render(<Tabs tabItems={defaultItems} />);
      const items = Array.from(container.querySelectorAll(".chord-tabs__bar-item"));
      expect(items[0]?.getAttribute("data-selected")).toBe("true");
      expect(items[1]?.getAttribute("data-selected")).toBe("false");
    });

    it("marks the specified selectedIndex as selected", () => {
      const { container } = render(<Tabs tabItems={defaultItems} selectedIndex={2} />);
      const items = Array.from(container.querySelectorAll(".chord-tabs__bar-item"));
      expect(items[2]?.getAttribute("data-selected")).toBe("true");
      expect(items[0]?.getAttribute("data-selected")).toBe("false");
    });

    it("calls onTabChange with the clicked index", () => {
      const onTabChange = vi.fn();
      render(<Tabs tabItems={defaultItems} onTabChange={onTabChange} />);
      fireEvent.click(screen.getByText("Tab 2"));
      expect(onTabChange).toHaveBeenCalledWith(1);
    });

    it("renders bottom separator line", () => {
      const { container } = render(<Tabs tabItems={defaultItems} />);
      expect(container.querySelector(".chord-tabs__bar-line")).not.toBeNull();
    });

    it("supports the barBadge boolean for bar tabs", () => {
      const { container } = render(<Tabs tabItems={defaultItems} barBadge />);
      expect(container.querySelector(".chord-tabs__bar-badge")).not.toBeNull();
    });
  });

  describe("Figma policy (node 89244:28661)", () => {
    it("truncates label text with ellipsis per policy", () => {
      expect(tabsCss).toContain("text-overflow: ellipsis");
      expect(tabsCss).toContain("overflow: hidden");
    });

    it("enforces 88px min-width on swipe tabs per policy", () => {
      expect(tabsCss).toContain("min-width: 88px");
    });
  });
});
