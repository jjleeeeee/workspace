import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  normalizeSelectNumberBoxValue,
  resolveSelectNumberBoxState,
  SelectNumberBox,
} from "./SelectNumberBox";

describe("SelectNumberBox", () => {
  it("renders the Figma default contract", () => {
    render(<SelectNumberBox data-testid="number" />);

    const number = screen.getByTestId("number");

    expect(number).toHaveAttribute("data-mode", "default");
    expect(number).toHaveAttribute("data-state", "selected");
    expect(number).toHaveTextContent("99");
  });

  it("normalizes numeric overflow", () => {
    expect(normalizeSelectNumberBoxValue(100)).toBe("99+");
    expect(resolveSelectNumberBoxState("selected", 100)).toBe("selected-99-plus");
  });

  it("does not render text in unselected state", () => {
    render(<SelectNumberBox state="unselected" data-testid="number" />);

    expect(screen.getByTestId("number")).toHaveTextContent("");
  });
});
