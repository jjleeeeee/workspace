import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LoadingDot } from "./LoadingDot";

describe("LoadingDot", () => {
  it("renders three busy dots with size and color attributes", () => {
    render(<LoadingDot aria-label="loading timeline" color="white" size="medium" />);

    const loader = screen.getByLabelText("loading timeline");
    expect(loader).toHaveAttribute("aria-busy", "true");
    expect(loader).toHaveAttribute("data-color", "white");
    expect(loader.querySelectorAll("span")).toHaveLength(3);
  });
});
