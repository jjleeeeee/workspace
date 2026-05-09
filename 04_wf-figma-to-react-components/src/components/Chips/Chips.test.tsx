import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Chips } from "./Chips";

describe("Chips", () => {
  it("renders the Figma default contract", () => {
    render(<Chips label="Text" data-testid="chip" />);
    const chip = screen.getByTestId("chip");

    expect(chip).toHaveAttribute("data-mode", "default");
    expect(chip).toHaveAttribute("data-size", "small");
    expect(chip).toHaveAttribute("data-type", "text");
    expect(chip).toHaveAttribute("data-state", "default");
    expect(chip).toHaveAttribute("data-radius", "on");
    expect(chip).not.toBeDisabled();
  });

  it("renders text through the label node", () => {
    render(<Chips label="옵션" data-testid="chip" />);
    expect(screen.getByText("옵션")).toHaveClass("chord-chips__label");
  });

  it("normalizes invalid type=image + size=small to text", () => {
    const { container } = render(<Chips label="Text" type="image" size="small" data-testid="chip" />);

    expect(screen.getByTestId("chip")).toHaveAttribute("data-type", "text");
    expect(container.querySelector(".chord-chips__image")).not.toBeInTheDocument();
  });

  it("renders the Figma null icon marker for icon chips when no icon slot is supplied", () => {
    const { container } = render(<Chips label="Text" type="icon" size="medium" data-testid="chip" />);

    expect(screen.getByTestId("chip")).toHaveAttribute("data-type", "icon");
    expect(container.querySelector(".chord-chips__leading")).toHaveAttribute("data-leading-type", "icon");
    expect(container.querySelector('[data-icon-name="nullMedium"]')).toBeInTheDocument();
  });

  it("renders a consumer icon slot instead of the null marker", () => {
    const { container } = render(
      <Chips icon={<span data-testid="custom-icon" />} label="Text" type="icon" data-testid="chip" />,
    );

    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    expect(container.querySelector('[data-icon-name="nullMedium"]')).not.toBeInTheDocument();
  });

  it("renders the Figma image fixture for medium image chips", () => {
    const { container } = render(<Chips label="Text" type="image" size="medium" data-testid="chip" />);

    expect(screen.getByTestId("chip")).toHaveAttribute("data-type", "image");
    expect(container.querySelector(".chord-chips__image")).toBeInTheDocument();
    expect(container.querySelector(".chord-chips__image img")).toHaveAttribute("alt", "");
  });

  it("renders BadgeDot when badge is true", () => {
    const { container } = render(<Chips badge label="Text" data-testid="chip" />);

    const dot = container.querySelector(".chord-badge-dot");
    expect(dot).toBeInTheDocument();
    expect(dot).toHaveAttribute("data-size", "small");
    expect(dot).toHaveAttribute("data-outline", "off");
  });

  it("renders BadgeNumber and lets BadgeNumber take precedence over BadgeDot", () => {
    const { container } = render(<Chips badge badgeNumber badgeNumberLabel={7} label="Text" data-testid="chip" />);

    expect(container.querySelector(".chord-badge-number")).toHaveTextContent("7");
    expect(container.querySelector(".chord-badge-dot")).not.toBeInTheDocument();
  });

  it("sets native disabled for disabled states", () => {
    const { rerender } = render(<Chips label="Text" state="filled-disabled" data-testid="chip" />);
    expect(screen.getByTestId("chip")).toBeDisabled();

    rerender(<Chips label="Text" state="outlined-disabled" data-testid="chip" />);
    expect(screen.getByTestId("chip")).toBeDisabled();
  });

  it("reflects marquee as a visual state hook", () => {
    render(<Chips label="A very long chip label" marquee data-testid="chip" />);
    expect(screen.getByTestId("chip")).toHaveAttribute("data-marquee", "true");
  });
});
