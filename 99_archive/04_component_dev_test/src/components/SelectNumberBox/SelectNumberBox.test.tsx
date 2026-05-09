import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SelectNumberBox, formatSelectNumberLabel } from "./SelectNumberBox";

describe("SelectNumberBox", () => {
  it("formats values above 99 as 99+", () => {
    expect(formatSelectNumberLabel(128)).toBe("99+");
  });

  it("renders state and mode attributes", () => {
    render(<SelectNumberBox aria-label="third selected item" mode="fixed" state="selected" value={3} />);

    const box = screen.getByLabelText("third selected item");
    expect(box).toHaveTextContent("3");
    expect(box).toHaveAttribute("data-state", "selected");
    expect(box).toHaveAttribute("data-mode", "fixed");
  });
});
