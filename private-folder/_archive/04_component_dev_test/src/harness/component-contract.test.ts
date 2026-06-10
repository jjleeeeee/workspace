import { describe, expect, it } from "vitest";
import { chordComponents } from "../figma/chord-components";
import { componentContracts, validateContractAgainstManifest } from "./component-contract";

describe("component contracts", () => {
  it("keeps ready component contracts aligned with Figma variant axes", () => {
    const issues = Object.values(componentContracts).flatMap((contract) =>
      validateContractAgainstManifest(contract, chordComponents),
    );

    expect(issues).toEqual([]);
  });
});
