import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BadgeNumber, normalizeBadgeNumberLabel } from "./BadgeNumber";

describe("normalizeBadgeNumberLabel", () => {
  it("keeps the Figma max label contract to four characters", () => {
    expect(normalizeBadgeNumberLabel("999+")).toBe("999+");
    expect(normalizeBadgeNumberLabel("12345")).toBe("1234");
  });

  it("falls back to the default number label for blank values", () => {
    expect(normalizeBadgeNumberLabel("")).toBe("999+");
    expect(normalizeBadgeNumberLabel("   ")).toBe("999+");
  });
});

describe("BadgeNumber", () => {
  it("renders the number variant by default", () => {
    render(<BadgeNumber data-testid="badge-number" />);

    const badge = screen.getByTestId("badge-number");

    expect(badge).toHaveTextContent("999+");
    expect(badge).toHaveAttribute("data-mode", "default");
    expect(badge).toHaveAttribute("data-type", "number");
  });

  it("renders new type as the fixed N label", () => {
    render(<BadgeNumber badgeType="new" label="1234" data-testid="badge-number" />);

    expect(screen.getByTestId("badge-number")).toHaveTextContent("N");
  });
});
