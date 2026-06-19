import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  FloatingActionButton,
  floatingActionButtonFunctionOptions,
  floatingActionButtonModeOptions,
} from "./FloatingActionButton";

describe("FloatingActionButton", () => {
  it("exposes the complete Figma variant axes", () => {
    expect(floatingActionButtonModeOptions).toEqual(["default", "fixed"]);
    expect(floatingActionButtonFunctionOptions).toEqual(["goToTop", "goToBottom"]);
  });

  it("renders goToTop with scrollToTopMedium icon by default", () => {
    render(<FloatingActionButton data-testid="fab" />);
    const fab = screen.getByTestId("fab");
    expect(fab).toHaveAttribute("data-mode", "default");
    expect(fab).toHaveAttribute("data-function", "goToTop");
    expect(fab.querySelector("[data-icon-name='scrollToTopMedium']")).toBeInTheDocument();
  });

  it("renders goToBottom with scrollToBottomMedium icon", () => {
    render(<FloatingActionButton data-testid="fab" fabFunction="goToBottom" />);
    const fab = screen.getByTestId("fab");
    expect(fab).toHaveAttribute("data-function", "goToBottom");
    expect(fab.querySelector("[data-icon-name='scrollToBottomMedium']")).toBeInTheDocument();
  });

  it("applies fixed mode data attribute", () => {
    render(<FloatingActionButton data-testid="fab" mode="fixed" />);
    expect(screen.getByTestId("fab")).toHaveAttribute("data-mode", "fixed");
  });

  it("renders as button element with type=button", () => {
    render(<FloatingActionButton data-testid="fab" />);
    const fab = screen.getByTestId("fab");
    expect(fab.tagName).toBe("BUTTON");
    expect(fab).toHaveAttribute("type", "button");
  });

  it("passes through native button props", () => {
    render(<FloatingActionButton aria-label="위로 가기" data-testid="fab" disabled />);
    const fab = screen.getByTestId("fab");
    expect(fab).toBeDisabled();
    expect(fab).toHaveAttribute("aria-label", "위로 가기");
  });
});
