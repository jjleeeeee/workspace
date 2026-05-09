import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

type VisualRegistryEntry = {
  component: string;
  comparisonScope?: "full-parity" | "structure-only" | "shell-only";
  id: string;
  isParityGate?: boolean;
  selector: string;
  storyId: string;
};

const visualRegistry = JSON.parse(
  readFileSync(join(process.cwd(), "src/figma/visual-registry.json"), "utf8"),
) as VisualRegistryEntry[];

describe("visual registry coverage", () => {
  it("declares comparison scope and parity gate intent for every registered baseline", () => {
    for (const entry of visualRegistry) {
      expect(entry.comparisonScope ?? "full-parity").toMatch(/^(full-parity|structure-only|shell-only)$/);
      expect(typeof (entry.isParityGate ?? true)).toBe("boolean");
      if ((entry.isParityGate ?? true) === true) {
        expect(entry.comparisonScope ?? "full-parity").toBe("full-parity");
      }
    }
  });

  it("includes ListItemNative now that default structural comparison is deterministic", () => {
    expect(visualRegistry).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          component: "ListItemNative",
          comparisonScope: "structure-only",
          id: "list-item-native-default",
          isParityGate: false,
          storyId: "atoms-listitemnative--playground",
        }),
      ]),
    );
  });

  it("marks TextFields Default/Single/Default as a full-parity gate after the nested default branch is implemented", () => {
    expect(visualRegistry).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          component: "TextFields",
          comparisonScope: "full-parity",
          id: "text-fields-default",
          isParityGate: true,
        }),
      ]),
    );
  });

  it("registers Avatar and Thumbnail as structure-only non-gating because baselines are Figma media exports not component placeholder captures", () => {
    const mediaComponents = visualRegistry.filter((e) => e.component === "Avatar" || e.component === "Thumbnail");
    expect(mediaComponents.length).toBeGreaterThan(0);
    for (const entry of mediaComponents) {
      expect(entry.comparisonScope).toBe("structure-only");
      expect(entry.isParityGate).toBe(false);
    }
  });
});
