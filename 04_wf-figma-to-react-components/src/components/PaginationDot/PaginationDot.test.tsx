import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { clampPaginationDotSelection, getPaginationDotModel, PaginationDot } from "./PaginationDot";

describe("PaginationDot", () => {
  it("renders the Figma default contract", () => {
    render(<PaginationDot data-testid="pagination" />);

    const pagination = screen.getByTestId("pagination");

    expect(pagination).toHaveAttribute("data-mode", "fixed");
    expect(pagination).toHaveAttribute("data-dots", "2");
    expect(pagination).toHaveAttribute("data-selection", "1");
    expect(pagination.querySelectorAll(".chord-pagination-dot__dot")).toHaveLength(2);
  });

  it("clamps unavailable selections", () => {
    expect(clampPaginationDotSelection("2", 6)).toBe(2);
    expect(clampPaginationDotSelection("6+", 6)).toBe(6);
  });

  it("uses condensed dots for 6+ edge states", () => {
    const model = getPaginationDotModel("6+", 6);

    expect(model.map((dot) => dot.size)).toEqual(["tiny", "small", "normal", "normal", "normal"]);
    expect(model.at(-1)?.selected).toBe(true);
  });
});
