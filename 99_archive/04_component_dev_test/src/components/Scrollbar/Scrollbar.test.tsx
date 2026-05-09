import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Scrollbar } from "./Scrollbar";

describe("Scrollbar", () => {
  it("renders a scrollbar thumb with value and state attributes", () => {
    render(<Scrollbar aria-label="content scroll" state="dragging" value={40} />);

    const scrollbar = screen.getByLabelText("content scroll");
    expect(scrollbar).toHaveAttribute("role", "scrollbar");
    expect(scrollbar).toHaveAttribute("aria-valuenow", "40");
    expect(scrollbar).toHaveAttribute("data-state", "dragging");
  });
});
