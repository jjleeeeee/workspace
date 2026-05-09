import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const componentIndex = readFileSync(join(process.cwd(), "src/components/index.ts"), "utf8");

describe("component public barrel", () => {
  it("does not export Storybook stories as package API", () => {
    expect(componentIndex).not.toMatch(/\\.stories/);
    expect(componentIndex).not.toContain("TextButtonStories");
  });
});
