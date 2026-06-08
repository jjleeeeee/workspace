import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CircularProgressIndicator } from "./CircularProgressIndicator";

describe("CircularProgressIndicator", () => {
  it("renders a progressbar with a mode attribute", () => {
    render(<CircularProgressIndicator aria-label="sync progress" mode="fixed" value={64} />);

    const progress = screen.getByLabelText("sync progress");
    expect(progress).toHaveAttribute("role", "progressbar");
    expect(progress).toHaveAttribute("aria-valuenow", "64");
    expect(progress).toHaveAttribute("data-mode", "fixed");
  });
});
