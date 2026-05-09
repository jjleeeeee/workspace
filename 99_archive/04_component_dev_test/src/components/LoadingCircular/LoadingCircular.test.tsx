import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LoadingCircular } from "./LoadingCircular";

describe("LoadingCircular", () => {
  it("renders an indeterminate circular loading indicator", () => {
    render(<LoadingCircular aria-label="loading card" mode="fixed" />);

    const loader = screen.getByLabelText("loading card");
    expect(loader).toHaveAttribute("aria-busy", "true");
    expect(loader).toHaveAttribute("data-mode", "fixed");
  });
});
