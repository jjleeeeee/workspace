import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LinearProgressIndicator, normalizeProgressValue } from "./LinearProgressIndicator";

describe("LinearProgressIndicator", () => {
  it("clamps progress values between 0 and 100", () => {
    expect(normalizeProgressValue(140)).toBe(100);
    expect(normalizeProgressValue(-10)).toBe(0);
  });

  it("renders a determinate progressbar with height and rounded attributes", () => {
    render(<LinearProgressIndicator aria-label="upload progress" height="4" rounded="on" value={32} />);

    const progress = screen.getByLabelText("upload progress");
    expect(progress).toHaveAttribute("role", "progressbar");
    expect(progress).toHaveAttribute("aria-valuenow", "32");
    expect(progress).toHaveAttribute("data-height", "4");
    expect(progress).toHaveAttribute("data-rounded", "on");
  });
});
