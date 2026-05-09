import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LoadingCircular } from "./LoadingCircular";

describe("LoadingCircular", () => {
  it("renders the Figma default contract", () => {
    render(<LoadingCircular data-testid="loading" />);

    const loading = screen.getByTestId("loading");

    expect(loading).toHaveAttribute("data-mode", "default");
    expect(loading).toHaveAttribute("data-animated", "false");
    expect(loading).toHaveAttribute("aria-hidden", "true");
  });

  it("exposes status semantics when labeled", () => {
    render(<LoadingCircular aria-label="로딩 중" data-testid="loading" />);

    expect(screen.getByTestId("loading")).toHaveAttribute("role", "status");
  });
});
