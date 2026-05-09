import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Tabs, resolveTabsVariant, tabsValidCombinations } from "./Tabs";

const defaultItems = ["Tab 1", "Tab 2", "Tab 3"];

describe("Tabs", () => {
  describe("Figma valid combinations", () => {
    it("exposes the 16 implemented Figma combinations", () => {
      expect(tabsValidCombinations).toHaveLength(16);
    });

    it("normalizes bar expand to bar fixed medium", () => {
      expect(resolveTabsVariant({ style: "bar", type: "expand", size: "small" })).toEqual({
        style: "bar",
        type: "fixed",
        size: "medium",
      });
    });

    it("normalizes chip fixed small to small-only-chips", () => {
      expect(resolveTabsVariant({ style: "chip", type: "fixed", size: "small" })).toEqual({
        style: "chip",
        type: "fixed",
        size: "small-only-chips",
      });
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

    it("applies data-style=bar by default", () => {
      const { container } = render(<Tabs tabItems={defaultItems} />);
      expect(container.querySelector("[data-style='bar']")).not.toBeNull();
    });

    it("applies data-style=chip when style=chip", () => {
      const { container } = render(<Tabs tabItems={defaultItems} style="chip" />);
      expect(container.querySelector("[data-style='chip']")).not.toBeNull();
    });

    it("applies data-type=fixed by default", () => {
      const { container } = render(<Tabs tabItems={defaultItems} />);
      expect(container.querySelector("[data-type='fixed']")).not.toBeNull();
    });

    it("applies data-type=scrollable when type=scrollable", () => {
      const { container } = render(<Tabs tabItems={defaultItems} type="scrollable" />);
      expect(container.querySelector("[data-type='scrollable']")).not.toBeNull();
    });

    it("applies data-type=expand when type=expand", () => {
      const { container } = render(
        <Tabs tabItems={defaultItems} style="chip" type="expand" />,
      );
      expect(container.querySelector("[data-type='expand']")).not.toBeNull();
    });

    it("applies data-size=medium by default", () => {
      const { container } = render(<Tabs tabItems={defaultItems} />);
      expect(container.querySelector("[data-size='medium']")).not.toBeNull();
    });

    it("applies data-size=small when size=small", () => {
      const { container } = render(
        <Tabs tabItems={defaultItems} style="chip" type="expand" size="small" />,
      );
      expect(container.querySelector("[data-size='small']")).not.toBeNull();
    });

    it("renders normalized data attributes for invalid theoretical combos", () => {
      const { container } = render(
        <Tabs tabItems={defaultItems} style="bar" type="expand" size="small" />,
      );
      const root = container.querySelector(".chord-tabs");
      expect(root).toHaveAttribute("data-style", "bar");
      expect(root).toHaveAttribute("data-type", "fixed");
      expect(root).toHaveAttribute("data-size", "medium");
      expect(root).toHaveAttribute("data-requested-type", "expand");
      expect(root).toHaveAttribute("data-requested-size", "small");
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

    it("supports the nested _atoms/Tabs Badge boolean for bar tabs", () => {
      const { container } = render(<Tabs tabItems={defaultItems} barBadge />);
      expect(container.querySelector(".chord-tabs__bar-badge")).not.toBeNull();
    });
  });

  describe("chip tab items", () => {
    it("renders all chip labels", () => {
      render(<Tabs tabItems={["Chip 1", "Chip 2"]} style="chip" />);
      expect(screen.getByText("Chip 1")).not.toBeNull();
      expect(screen.getByText("Chip 2")).not.toBeNull();
    });

    it("marks the first chip as selected by default", () => {
      const { container } = render(<Tabs tabItems={defaultItems} style="chip" />);
      const chips = Array.from(container.querySelectorAll(".chord-tabs__chip-item"));
      expect(chips[0]?.getAttribute("data-selected")).toBe("true");
      expect(chips[1]?.getAttribute("data-selected")).toBe("false");
    });

    it("calls onTabChange when chip is clicked", () => {
      const onTabChange = vi.fn();
      render(<Tabs tabItems={["A", "B", "C"]} style="chip" onTabChange={onTabChange} />);
      fireEvent.click(screen.getByText("B"));
      expect(onTabChange).toHaveBeenCalledWith(1);
    });
  });

  describe("expand button", () => {
    it("shows expand button when type=expand and showExpandButton=true", () => {
      const { container } = render(
        <Tabs tabItems={defaultItems} style="chip" type="expand" showExpandButton />,
      );
      expect(container.querySelector(".chord-tabs__expand-btn")).not.toBeNull();
    });

    it("adds the Figma expand gradient layer for expand chip tabs", () => {
      const { container } = render(
        <Tabs tabItems={defaultItems} style="chip" type="expand" showExpandButton />,
      );
      expect(container.querySelector(".chord-tabs__expand-gradient")).not.toBeNull();
    });

    it("hides expand button when showExpandButton=false", () => {
      const { container } = render(
        <Tabs tabItems={defaultItems} style="chip" type="expand" showExpandButton={false} />,
      );
      expect(container.querySelector(".chord-tabs__expand-btn")).toBeNull();
    });

    it("does not show expand button when type is not expand", () => {
      const { container } = render(
        <Tabs tabItems={defaultItems} style="chip" type="fixed" showExpandButton />,
      );
      expect(container.querySelector(".chord-tabs__expand-btn")).toBeNull();
    });
  });

  describe("expand gradient state", () => {
    it("renders gradient with data-state=fold when scrollMoreState=fold", () => {
      const { container } = render(
        <Tabs tabItems={defaultItems} style="chip" type="expand" scrollMoreState="fold" />,
      );
      const gradient = container.querySelector(".chord-tabs__expand-gradient");
      expect(gradient).not.toBeNull();
      expect(gradient).toHaveAttribute("data-state", "fold");
    });

    it("renders gradient with data-state=spread when scrollMoreState=spread", () => {
      const { container } = render(
        <Tabs tabItems={defaultItems} style="chip" type="expand" scrollMoreState="spread" />,
      );
      const gradient = container.querySelector(".chord-tabs__expand-gradient");
      expect(gradient).not.toBeNull();
      expect(gradient).toHaveAttribute("data-state", "spread");
    });

    it("propagates scrollMoreState to expand button as data-scroll-more-state", () => {
      const { container } = render(
        <Tabs tabItems={defaultItems} style="chip" type="expand" scrollMoreState="spread" showExpandButton />,
      );
      expect(container.querySelector(".chord-tabs__expand-btn")).toHaveAttribute("data-scroll-more-state", "spread");
    });
  });

  describe("bottom line", () => {
    it("renders bar bottom line for style=bar", () => {
      const { container } = render(<Tabs tabItems={defaultItems} style="bar" />);
      expect(container.querySelector(".chord-tabs__bar-line")).not.toBeNull();
    });

    it("does not render bar bottom line for style=chip", () => {
      const { container } = render(<Tabs tabItems={defaultItems} style="chip" />);
      expect(container.querySelector(".chord-tabs__bar-line")).toBeNull();
    });
  });
});
