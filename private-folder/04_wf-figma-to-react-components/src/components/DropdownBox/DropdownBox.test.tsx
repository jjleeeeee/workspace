import { render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { DropdownBox } from "./DropdownBox";

const css = readFileSync(join(process.cwd(), "src/components/DropdownBox/DropdownBox.css"), "utf8");
const sourceNote = readFileSync(join(process.cwd(), "src/figma/dropdown-box.source.md"), "utf8");

describe("DropdownBox", () => {
  it("renders the Figma default contract", () => {
    render(<DropdownBox data-testid="db" />);
    const el = screen.getByTestId("db");

    expect(el).toHaveAttribute("data-mode", "default");
    expect(el).toHaveAttribute("data-state", "default");
  });

  it("reflects mode and state as data attributes", () => {
    render(<DropdownBox mode="fixed" state="error" data-testid="db" />);
    const el = screen.getByTestId("db");

    expect(el).toHaveAttribute("data-mode", "fixed");
    expect(el).toHaveAttribute("data-state", "error");
  });

  it("renders all seven state values as data-state", () => {
    const states = ["default", "pressed", "enabled-down", "enabled-up", "completed", "error", "disabled"] as const;
    for (const state of states) {
      const { unmount } = render(<DropdownBox state={state} data-testid="db" />);
      expect(screen.getByTestId("db")).toHaveAttribute("data-state", state);
      unmount();
    }
  });

  it("renders title row when showTitle is true", () => {
    const { container } = render(<DropdownBox showTitle titleLabel="카테고리" data-testid="db" />);

    expect(container.querySelector(".chord-dropdown-box__title")).toBeInTheDocument();
    expect(screen.getByText("카테고리")).toBeInTheDocument();
  });

  it("hides title row when showTitle is false", () => {
    const { container } = render(<DropdownBox showTitle={false} data-testid="db" />);

    expect(container.querySelector(".chord-dropdown-box__title")).not.toBeInTheDocument();
  });

  it("renders BadgeDot when showBadgeDot is true and showTitle is true", () => {
    const { container } = render(<DropdownBox showTitle showBadgeDot data-testid="db" />);

    expect(container.querySelector(".chord-badge-dot")).toBeInTheDocument();
  });

  it("does not render BadgeDot when showBadgeDot is false", () => {
    const { container } = render(<DropdownBox showTitle showBadgeDot={false} data-testid="db" />);

    expect(container.querySelector(".chord-badge-dot")).not.toBeInTheDocument();
  });

  it("does not render BadgeDot when showTitle is false", () => {
    const { container } = render(<DropdownBox showTitle={false} showBadgeDot data-testid="db" />);

    expect(container.querySelector(".chord-badge-dot")).not.toBeInTheDocument();
  });

  it("renders input field with textLabel", () => {
    const { container } = render(<DropdownBox textLabel="옵션 선택" data-testid="db" />);

    expect(container.querySelector(".chord-dropdown-box__input")).toBeInTheDocument();
    expect(screen.getByText("옵션 선택")).toBeInTheDocument();
  });

  it("renders arrowDownMedium icon for closed states", () => {
    const closedStates = ["default", "pressed", "completed", "error", "disabled"] as const;
    for (const state of closedStates) {
      const { unmount } = render(<DropdownBox state={state} data-testid="db" />);
      const arrow = screen.getByTestId("dropdown-box-arrow");
      expect(arrow).toHaveAttribute("data-icon-name", "arrowDownMedium");
      unmount();
    }
  });

  it("renders arrowDownFoldMedium icon for open states", () => {
    const openStates = ["enabled-down", "enabled-up"] as const;
    for (const state of openStates) {
      const { unmount } = render(<DropdownBox state={state} data-testid="db" />);
      const arrow = screen.getByTestId("dropdown-box-arrow");
      expect(arrow).toHaveAttribute("data-icon-name", "arrowDownFoldMedium");
      unmount();
    }
  });

  it("renders guide message row when showGuide is true", () => {
    const { container } = render(<DropdownBox showGuide guideLabel="안내 메시지" data-testid="db" />);

    expect(container.querySelector(".chord-dropdown-box__guide")).toBeInTheDocument();
    expect(screen.getByText("안내 메시지")).toBeInTheDocument();
  });

  it("hides guide message row when showGuide is false", () => {
    const { container } = render(<DropdownBox showGuide={false} data-testid="db" />);

    expect(container.querySelector(".chord-dropdown-box__guide")).not.toBeInTheDocument();
  });

  it("renders menu panel for enabled-down state below the input", () => {
    const { container } = render(
      <DropdownBox state="enabled-down" data-testid="db">
        <div data-testid="option-row">옵션 1</div>
      </DropdownBox>,
    );

    const menu = container.querySelector(".chord-dropdown-box__menu");
    expect(menu).toBeInTheDocument();
    expect(menu).toHaveAttribute("data-direction", "down");
    expect(screen.getByTestId("option-row")).toBeInTheDocument();
  });

  it("renders menu panel for enabled-up state above the input", () => {
    const { container } = render(
      <DropdownBox state="enabled-up" data-testid="db">
        <div data-testid="option-row">옵션 1</div>
      </DropdownBox>,
    );

    const menu = container.querySelector(".chord-dropdown-box__menu");
    expect(menu).toBeInTheDocument();
    expect(menu).toHaveAttribute("data-direction", "up");
    expect(screen.getByTestId("option-row")).toBeInTheDocument();
  });

  it("does not render menu panel for closed states", () => {
    const closedStates = ["default", "pressed", "completed", "error", "disabled"] as const;
    for (const state of closedStates) {
      const { unmount } = render(<DropdownBox state={state} data-testid="db" />);
      expect(document.querySelector(".chord-dropdown-box__menu")).not.toBeInTheDocument();
      unmount();
    }
  });

  it("renders Scrollbar in open state when showScrollbar is true", () => {
    const { container } = render(<DropdownBox state="enabled-down" showScrollbar data-testid="db" />);

    expect(container.querySelector(".chord-scrollbar")).toBeInTheDocument();
  });

  it("does not render Scrollbar in open state when showScrollbar is false", () => {
    const { container } = render(<DropdownBox state="enabled-down" showScrollbar={false} data-testid="db" />);

    expect(container.querySelector(".chord-scrollbar")).not.toBeInTheDocument();
  });

  it("does not render Scrollbar in closed state even when showScrollbar is true", () => {
    const { container } = render(<DropdownBox state="default" showScrollbar data-testid="db" />);

    expect(container.querySelector(".chord-scrollbar")).not.toBeInTheDocument();
  });

  it("uses fixed-white scrollbar mode when mode=fixed", () => {
    const { container } = render(<DropdownBox mode="fixed" state="enabled-down" showScrollbar data-testid="db" />);

    expect(container.querySelector(".chord-scrollbar")).toHaveAttribute("data-mode", "fixed-white");
  });

  it("uses default scrollbar mode when mode=default", () => {
    const { container } = render(<DropdownBox mode="default" state="enabled-down" showScrollbar data-testid="db" />);

    expect(container.querySelector(".chord-scrollbar")).toHaveAttribute("data-mode", "default");
  });

  it("passes className and other div props through to the root element", () => {
    render(<DropdownBox className="custom-class" data-testid="db" aria-label="드롭다운" />);
    const el = screen.getByTestId("db");

    expect(el).toHaveClass("chord-dropdown-box", "custom-class");
    expect(el).toHaveAttribute("aria-label", "드롭다운");
  });

  it("source note declares Figma reads from Console MCP and variant axis data", () => {
    expect(sourceNote).toContain("60730:9605");
    expect(sourceNote).toContain("figma_get_component(60730:9605, enrich=true)");
    expect(sourceNote).toContain("Enabled_Down");
    expect(sourceNote).toContain("Enabled_Up");
  });

  it("CSS applies the correct border-radius to the input field", () => {
    expect(css).toContain(".chord-dropdown-box__input");
    expect(css).toContain("border-radius: var(--cds-system-size-radius-box-100, 8px)");
  });

  it("CSS applies inactive-gray stroke for default/completed/disabled states", () => {
    expect(css).toContain("--cds-system-color-status-inactive-gray");
  });

  it("CSS applies focus stroke for pressed and open states", () => {
    expect(css).toContain("--cds-system-color-status-focus-gray-400");
  });

  it("CSS applies danger-red stroke for error state", () => {
    expect(css).toContain("--cds-system-color-status-danger-red");
  });

  it("CSS applies danger-red to guide message text for error state", () => {
    expect(css).toContain("[data-state=\"error\"]");
    expect(css).toContain(".chord-dropdown-box__guide-text");
  });

  it("CSS uses the correct token for the dropdown menu surface", () => {
    expect(css).toContain("--cds-system-color-surface-default-4");
  });
});
