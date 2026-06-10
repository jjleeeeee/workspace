import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BadgeNumber, formatBadgeNumberLabel } from "./BadgeNumber";

describe("BadgeNumber", () => {
  it("formats counts above the max as 999+", () => {
    expect(formatBadgeNumberLabel({ count: 1000, max: 999, type: "number" })).toBe("999+");
  });

  it("renders the New state label without requiring a count", () => {
    render(<BadgeNumber type="new" aria-label="new content" />);

    expect(screen.getByText("N")).toBeInTheDocument();
  });
});
