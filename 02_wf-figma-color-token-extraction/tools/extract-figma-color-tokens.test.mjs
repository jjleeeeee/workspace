import assert from "node:assert/strict";
import fs from "node:fs";

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
        variableIds: [
          "VariableID:typo-family",
          "VariableID:typo-size",
          "VariableID:typo-weight",
          "VariableID:typo-lineheight",
        ],
        modes: [
          { modeId: "ios", name: "iOS" },
          { modeId: "aos", name: "AOS" },
          { modeId: "web", name: "WEB" },
        ],
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
        valuesByMode: { ios: "WeGothicSans", aos: "Roboto", web: "Pretendard" },
        scopes: ["FONT_FAMILY"],
        codeSyntax: {},
        description: "",
        hiddenFromPublishing: false,
      },
      "VariableID:typo-size": {
        id: "VariableID:typo-size",
        key: "typo-size-key",
        name: "base/text_size/text-100",
        variableCollectionId: "VariableCollectionId:typo",
        resolvedType: "FLOAT",
        valuesByMode: { ios: 14, aos: 13, web: 13 },
        scopes: ["FONT_SIZE"],
        codeSyntax: {},
        description: "",
        hiddenFromPublishing: false,
      },
      "VariableID:typo-weight": {
        id: "VariableID:typo-weight",
        key: "typo-weight-key",
        name: "base/text_weight/text-weight-400",
        variableCollectionId: "VariableCollectionId:typo",
        resolvedType: "FLOAT",
        valuesByMode: { ios: 400, aos: 400, web: 400 },
        scopes: ["FONT_STYLE"],
        codeSyntax: {},
        description: "",
        hiddenFromPublishing: false,
      },
      "VariableID:typo-lineheight": {
        id: "VariableID:typo-lineheight",
        key: "typo-lineheight-key",
        name: "base/lineheight/text-lineheight-100",
        variableCollectionId: "VariableCollectionId:typo",
        resolvedType: "FLOAT",
        valuesByMode: { ios: 18, aos: 17, web: 17 },
        scopes: ["LINE_HEIGHT"],
        codeSyntax: {},
        description: "",
        hiddenFromPublishing: false,
      },
    },
  },
};

const { color, size, typography } = buildCatalogs(restPayload, {
  fileKey: "DWEduE6GfxYMlyxKPNJ8jA",
  freshness: "2026-04-23T03:02:53.554Z",
  stageLabel: "v1.0",
});
const rawFixture = JSON.parse(fs.readFileSync(new URL("../outputs/raw/figma.variables.local.2026-05-06.json", import.meta.url), "utf8"));
const { typographySemantic } = buildCatalogs(rawFixture, {
  fileKey: "DWEduE6GfxYMlyxKPNJ8jA",
  freshness: "2026-04-23T03:02:53.554Z",
  stageLabel: "v1.0",
  includeSemantic: true,
});

assert.equal(color.tokens.length, 1);
assert.equal(color.tokens[0].id, "token:system.color.button.default");
assert.deepEqual(color.tokens[0].values, {
  light: { raw: "#00CBD5", aliasOf: null },
  dark: { raw: "#01D5DF", aliasOf: null },
});
assert.deepEqual(color.tokens[0].usage, ["all", "stroke"]);
assert.deepEqual(color.diagnostics.at(-1).tokens, ["token:system.color.roles.brand-green"]);

assert.equal(size.tokens.length, 1);
assert.equal(size.tokens[0].id, "token:system.size.button-height.large");
assert.equal(size.tokens[0].type, "dimension");
assert.deepEqual(size.tokens[0].values, {
  light: { raw: 44, aliasOf: null },
  dark: { raw: 44, aliasOf: null },
});

assert.equal(typography.tokens.length, 4);
assert.deepEqual(typography.modes, ["ios", "aos", "web", "mode-1"]);
assert.equal(typography.tokens.find((token) => token.name === "base/text_size/text-100").type, "dimension");
assert.equal(typography.tokens.find((token) => token.name === "base/text_weight/text-weight-400").type, "number");
assert.equal(typography.tokens.find((token) => token.name === "font_family/title").id, "token:typography.default.font-family.title");
assert.deepEqual(typographySemantic.fontFamilySemantics.WeGothicSans, {
  kind: "system-alias",
  platform: "ios",
  meaning: "Apple system font environment for Korean UI",
  composition: ["Apple SD Gothic", "SF Pro"],
  runtimeStack: ["-apple-system", "BlinkMacSystemFont", "SF Pro", "Apple SD Gothic Neo", "system-ui", "sans-serif"],
});
assert.deepEqual(Object.keys(typographySemantic.fontFamilySemantics).sort(), [
  "CircularXX TT",
  "Pretendard",
  "Roboto",
  "WeGothicSans",
]);
assert.equal(typographySemantic.tokens[0].resolved.ios.fontFamily, "WeGothicSans");
assert.equal(typographySemantic.tokens[0].resolved.aos.fontFamily, "Roboto");
assert.equal(typographySemantic.tokens[0].resolved.web.fontFamily, "Pretendard");

console.log("extract-figma-color-tokens tests passed");
