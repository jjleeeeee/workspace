import assert from "node:assert/strict";

import {
  buildCatalogs,
  normalizeScope,
  rgbaToHex,
  tokenIdFromName,
} from "./extract-figma-color-tokens.mjs";

assert.equal(tokenIdFromName("system/fixed_color/roles/primary"), "token:system.fixed-color.roles.primary");
assert.equal(normalizeScope("ALL_FILLS"), "all");
assert.equal(normalizeScope("STROKE_COLOR"), "stroke");
assert.equal(rgbaToHex({ r: 0, g: 0.8, b: 0.8352941176, a: 1 }), "#00CCD5");
assert.equal(rgbaToHex({ r: 0, g: 0, b: 0, a: 0.1019607843 }), "#0000001A");

const restPayload = {
  meta: {
    variableCollections: {
      "VariableCollectionId:colors-small": {
        id: "VariableCollectionId:colors-small",
        name: "WDS_tokens",
        variableIds: ["VariableID:ignored"],
        modes: [{ modeId: "490:0", name: "Light" }],
      },
      "VariableCollectionId:wds": {
        id: "VariableCollectionId:wds",
        name: "WDS_tokens",
        variableIds: [
          "VariableID:base-light",
          "VariableID:base-dark",
          "VariableID:button",
          "VariableID:dangling",
          "VariableID:size",
          "VariableID:version",
        ],
        modes: [
          { modeId: "490:0", name: "Light" },
          { modeId: "7606:6", name: "Dark" },
        ],
      },
      "VariableCollectionId:typo": {
        id: "VariableCollectionId:typo",
        name: "TYPO_tokens",
        variableIds: ["VariableID:typo-family"],
        modes: [{ modeId: "ios", name: "iOS" }],
      },
    },
    variables: {
      "VariableID:base-light": {
        id: "VariableID:base-light",
        key: "base-light-key",
        name: "base/color/light/mint-500",
        variableCollectionId: "VariableCollectionId:wds",
        resolvedType: "COLOR",
        valuesByMode: { "490:0": { r: 0, g: 0.7960784314, b: 0.8352941176, a: 1 } },
        scopes: [],
        codeSyntax: {},
        description: "",
        hiddenFromPublishing: false,
      },
      "VariableID:base-dark": {
        id: "VariableID:base-dark",
        key: "base-dark-key",
        name: "base/color/dark/mint-500",
        variableCollectionId: "VariableCollectionId:wds",
        resolvedType: "COLOR",
        valuesByMode: { "7606:6": { r: 0.0039215686, g: 0.8352941176, b: 0.8745098039, a: 1 } },
        scopes: [],
        codeSyntax: {},
        description: "",
        hiddenFromPublishing: false,
      },
      "VariableID:button": {
        id: "VariableID:button",
        key: "button-key",
        name: "system/color/button/default",
        variableCollectionId: "VariableCollectionId:wds",
        resolvedType: "COLOR",
        valuesByMode: {
          "490:0": { type: "VARIABLE_ALIAS", id: "VariableID:base-light" },
          "7606:6": { type: "VARIABLE_ALIAS", id: "VariableID:base-dark" },
        },
        scopes: ["ALL_FILLS", "STROKE_COLOR"],
        codeSyntax: { iOS: "buttonDefault", ANDROID: "buttonDefault" },
        description: "",
        hiddenFromPublishing: false,
      },
      "VariableID:dangling": {
        id: "VariableID:dangling",
        key: "dangling-key",
        name: "system/color/roles/brand-green",
        variableCollectionId: "VariableCollectionId:wds",
        resolvedType: "COLOR",
        valuesByMode: {
          "490:0": { type: "VARIABLE_ALIAS", id: "VariableID:missing" },
          "7606:6": { type: "VARIABLE_ALIAS", id: "VariableID:missing" },
        },
        scopes: ["ALL_SCOPES"],
        codeSyntax: {},
        description: "",
        hiddenFromPublishing: false,
      },
      "VariableID:size": {
        id: "VariableID:size",
        key: "size-key",
        name: "system/size/button-height/large",
        variableCollectionId: "VariableCollectionId:wds",
        resolvedType: "FLOAT",
        valuesByMode: { "490:0": 44, "7606:6": 44 },
        scopes: ["WIDTH_HEIGHT"],
        codeSyntax: {},
        description: "",
        hiddenFromPublishing: false,
      },
      "VariableID:version": {
        id: "VariableID:version",
        key: "version-key",
        name: "base/wds_version",
        variableCollectionId: "VariableCollectionId:wds",
        resolvedType: "STRING",
        valuesByMode: { "490:0": "0.4.10" },
        scopes: [],
        codeSyntax: {},
        description: "",
        hiddenFromPublishing: false,
      },
      "VariableID:typo-family": {
        id: "VariableID:typo-family",
        key: "typo-family-key",
        name: "font_family/title",
        variableCollectionId: "VariableCollectionId:typo",
        resolvedType: "STRING",
        valuesByMode: { ios: "WeGothicSans" },
        scopes: ["FONT_FAMILY"],
        codeSyntax: {},
        description: "",
        hiddenFromPublishing: false,
      },
    },
  },
};

const { color } = buildCatalogs(restPayload, {
  fileKey: "DWEduE6GfxYMlyxKPNJ8jA",
  freshness: "2026-04-23T03:02:53.554Z",
  stageLabel: "v1.0",
});

assert.equal(color.tokens.length, 1);
assert.equal(color.tokens[0].id, "token:system.color.button.default");
assert.deepEqual(color.tokens[0].values, {
  light: { raw: "#00CBD5", aliasOf: null },
  dark: { raw: "#01D5DF", aliasOf: null },
});
assert.deepEqual(color.tokens[0].usage, ["all", "stroke"]);
assert.deepEqual(color.diagnostics.at(-1).tokens, ["token:system.color.roles.brand-green"]);

console.log("extract-figma-color-tokens tests passed");
