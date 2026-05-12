#!/usr/bin/env node

import assert from "node:assert/strict";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import { spawnSync } from "node:child_process";

const validator = "tools/validate-component-description.mjs";

function runValidator(args) {
  return spawnSync(process.execPath, [validator, ...args], {
    cwd: process.cwd(),
    encoding: "utf8",
  });
}

function withTempFile(name, text, callback) {
  const dir = join(tmpdir(), `description-validator-${process.pid}`);
  mkdirSync(dir, { recursive: true });
  const filePath = join(dir, name);
  writeFileSync(filePath, text);

  try {
    callback(filePath);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function makeBridge({ registryPath, comparisonScope = "full-parity", isParityGate = true, includeSourceNote = true }) {
  return `
bridge:
  component: "TextButton"
  source_draft: "_workspace/outputs/draft-descriptions/text-button.description.yaml"
  status: "ready"

component_contract:
  figma:
    file_key: "DWEduE6GfxYMlyxKPNJ8jA"
    node_id: "52753:39618"
    component_set_key: "70d2a20bcdfe3ac7a3c3190410d9a255d8783e1d"
  figma_read_evidence:
    provenance: "live_figma_read"
    representative_nodes:
      - { id: "52753:39957", label: "Default / Medium / Filled" }
  axes:
    Mode: ["Default", "Fixed"]
  props:
    Button_Text: { type: "text", default: "Text" }
  validation_scope:
    comparison_scope: "full-parity"
    rationale: "Default visual can be compared across platforms."

platform_bindings:
  react:
${includeSourceNote ? `    source_note:
      provenance: "04_source_note"
      path: "../04_wf-figma-to-react-components/src/figma/text-button.source.md"
      sections:
        - "Variant Axes"
        - "Token Mapping"
` : ""}    props:
      axes:
        Mode: { prop: "mode", values: ["default", "fixed"] }
      runtime_hidden:
        - { prop: "type", reason: "native button type" }
    visual_validation:
      provenance: "04_visual_registry"
      registry_path: "${registryPath}"
      registry_id: "text-button-default"
      component: "TextButton"
      story_id: "atoms-textbutton--playground"
      selector: ".chord-text-button"
      comparison_scope: "${comparisonScope}"
      is_parity_gate: ${isParityGate}
      expected_size: "63x40"
      layout_baseline_path: "../04_wf-figma-to-react-components/src/figma/baselines/text-button-default.png"
      visual_baseline_path: "../04_wf-figma-to-react-components/src/figma/baselines/text-button-default@3x.png"
    implementation_bridge:
      provenance: "04_source_note"
      findings:
        - "Filled representative uses inset stroke model, not layout-affecting border."
  swift:
    status: "not-authored"
  kotlin:
    status: "not-authored"

validation:
  commands:
    - "node tools/validate-component-description.mjs --mode=bridge bridge-descriptions/text-button.bridge.yaml"
    - "npm run visual:diff"
`;
}

describe("validate-component-description", () => {
  it("keeps legacy description validation as the default mode", () => {
    const result = runValidator(["harness/examples/valid-description.yaml"]);

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /PASS valid-description\.yaml/);
  });

  it("validates common contract plus platform bindings in bridge mode", () => {
    const validBridge = makeBridge({
      registryPath: "../04_wf-figma-to-react-components/src/figma/visual-registry.json",
    });

    withTempFile("valid.bridge.yaml", validBridge, (filePath) => {
      const result = runValidator(["--mode=bridge", filePath]);

      assert.equal(result.status, 0, result.stderr);
      assert.match(result.stdout, /PASS valid\.bridge\.yaml/);
    });
  });

  it("fails bridge YAML that lacks React source note mapping", () => {
    const invalidBridge = makeBridge({
      registryPath: "../04_wf-figma-to-react-components/src/figma/visual-registry.json",
      includeSourceNote: false,
    });

    withTempFile("invalid.bridge.yaml", invalidBridge, (filePath) => {
      const result = runValidator(["--mode=bridge", filePath]);

      assert.equal(result.status, 1, result.stdout);
      assert.match(result.stderr, /Missing platform binding field: platform_bindings\.react\.source_note\.path/);
    });
  });

  it("fails bridge YAML when visual registry scope does not match", () => {
    const dir = join(tmpdir(), `description-validator-${process.pid}`);
    mkdirSync(dir, { recursive: true });
    const registryPath = join(dir, "visual-registry.json");
    const bridgePath = join(dir, "registry-mismatch.bridge.yaml");

    writeFileSync(
      registryPath,
      JSON.stringify(
        [
          {
            id: "text-button-default",
            component: "TextButton",
            storyId: "atoms-textbutton--playground",
            selector: ".chord-text-button",
            comparisonScope: "structure-only",
            isParityGate: false,
            expectedWidth: 63,
            expectedHeight: 40,
            layoutBaselinePath: "src/figma/baselines/text-button-default.png",
            visualBaselinePath: "src/figma/baselines/text-button-default@3x.png",
          },
        ],
        null,
        2,
      ),
    );

    writeFileSync(bridgePath, makeBridge({ registryPath, comparisonScope: "full-parity", isParityGate: true }));

    try {
      const result = runValidator(["--mode=bridge", bridgePath]);

      assert.equal(result.status, 1, result.stdout);
      assert.match(result.stderr, /Visual registry mismatch: comparison_scope/);
      assert.match(result.stderr, /Visual registry mismatch: is_parity_gate/);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
