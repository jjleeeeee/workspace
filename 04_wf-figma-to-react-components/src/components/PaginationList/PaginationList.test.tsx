import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { clampPaginationListPage, getPaginationListModel, PaginationList } from "./PaginationList";

describe("PaginationList", () => {
  it("renders the Figma default contract", () => {
    render(<PaginationList data-testid="pagination" />);

    const pagination = screen.getByTestId("pagination");

    expect(pagination).toHaveAttribute("data-mode", "default");
    expect(pagination).toHaveAttribute("data-size", "large");
    expect(pagination).toHaveAttribute("data-pages", "2");
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Page 1" })).toHaveAttribute("aria-current", "page");
  });

  it("builds the 8+ ellipsis model", () => {
    const model = getPaginationListModel("8+", 1);

    expect(model.map((item) => item.kind)).toEqual([
      "control",
      "page",
      "page",
      "page",
      "page",
      "page",
      "ellipsis",
      "page",
      "control",
    ]);
  });

  it("clamps selected page to the available range", () => {
    expect(clampPaginationListPage("3", 99)).toBe(3);
    expect(clampPaginationListPage("8+", 0)).toBe(1);
  });

  it("uses mapped DS arrow icons for previous and next controls", () => {
    render(<PaginationList />);

    expect(screen.getByTestId("pagination-previous-icon")).toHaveAttribute("data-icon-name", "arrowLeftMedium");
    expect(screen.getByTestId("pagination-next-icon")).toHaveAttribute("data-icon-name", "arrowRightMedium");
  });
});
