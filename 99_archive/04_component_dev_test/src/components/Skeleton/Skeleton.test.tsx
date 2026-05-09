import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
  it("announces loading content and exposes its visual type", () => {
    render(<Skeleton aria-label="loading profile" type="circle" size="medium" />);

    const skeleton = screen.getByLabelText("loading profile");
    expect(skeleton).toHaveAttribute("aria-busy", "true");
    expect(skeleton).toHaveAttribute("data-type", "circle");
  });
});
