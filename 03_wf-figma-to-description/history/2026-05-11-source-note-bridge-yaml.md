# 2026-05-11 / source note bridge YAML

## Decision

Create `bridge-descriptions/*.bridge.yaml` as a separate implementation
validation bridge layer instead of putting enriched implementation mapping data
beside or inside `draft-descriptions/*.description.yaml`.

## Reason

`draft-descriptions/` is reserved for Figma plain Description YAML drafts. The
Implementation bridges need different provenance: Figma live-read evidence,
platform-specific source notes, visual registry entries, parity scope, and
implementation findings. Keeping those files in a separate folder prevents
confusing "write this to Figma" drafts with "compare this against platform
implementation" contracts.

## Platform-Neutral Update

Bridge YAML now separates shared component facts from platform-specific binding
details:

- `component_contract`: Figma identity, live-read evidence, axes, props,
  composition, and comparison scope.
- `platform_bindings.react`: React source-note mapping, visual-registry mapping,
  prop names, runtime hidden props, and implementation findings.
- `platform_bindings.swift` / `platform_bindings.kotlin`: reserved binding
  slots that reuse the same component contract.

## Initial Scope

- `bridge-descriptions/text-button.bridge.yaml`
- `bridge-descriptions/text-fields.bridge.yaml`
- `bridge-descriptions/list-item-native.bridge.yaml`

The validator now supports:

```bash
node tools/validate-component-description.mjs --mode=bridge bridge-descriptions/<component>.bridge.yaml
```

Existing description validation remains the default mode.
