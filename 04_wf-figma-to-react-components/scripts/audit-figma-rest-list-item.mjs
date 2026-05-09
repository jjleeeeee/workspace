import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const fileKey = "DWEduE6GfxYMlyxKPNJ8jA";
const token = process.env.FIGMA_ACCESS_TOKEN || process.env.FIGMA_TOKEN || process.env.FIGMA_API_TOKEN;

const nodeIds = [
  "57343:18628", // ListItemNative component set
  "57343:18665", // default list item component
  "63406:10120", // small Leading component set
  "57343:20398", // medium Leading component set
  "57343:20409", // Trailing component set
  "9062:21959", // Content module
  "57343:20432", // Title component set
  "57343:20580", // Body component set
];

if (!token) {
  throw new Error("Set FIGMA_ACCESS_TOKEN, FIGMA_TOKEN, or FIGMA_API_TOKEN before running this audit.");
}

function summarizeProperties(properties) {
  if (!properties) return {};

  return Object.fromEntries(
    Object.entries(properties).map(([name, definition]) => [
      name,
      {
        defaultValue: definition.defaultValue,
        type: definition.type,
        value: definition.value,
        variantOptions: definition.variantOptions,
      },
    ]),
  );
}

function summarizeBox(node) {
  if (!node?.absoluteBoundingBox) return null;
  const { height, width, x, y } = node.absoluteBoundingBox;
  return { height, width, x, y };
}

function summarizeComponentSet(node) {
  return {
    id: node.id,
    name: node.name,
    propertyDefinitions: summarizeProperties(node.componentPropertyDefinitions),
    type: node.type,
    variants: (node.children || []).map((child) => ({
      box: summarizeBox(child),
      id: child.id,
      name: child.name,
      type: child.type,
    })),
  };
}

function collectInstances(node, depth = 0, path = []) {
  const nextPath = [...path, `${node.name} (${node.id})`];
  const own =
    node.type === "INSTANCE"
      ? [
          {
            box: summarizeBox(node),
            componentId: node.componentId,
            componentProperties: summarizeProperties(node.componentProperties),
            depth,
            id: node.id,
            name: node.name,
            path: nextPath,
          },
        ]
      : [];

  return own.concat((node.children || []).flatMap((child) => collectInstances(child, depth + 1, nextPath)));
}

const url = `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${nodeIds.join(",")}`;
const response = await fetch(url, {
  headers: { "X-Figma-Token": token },
});

if (!response.ok) {
  throw new Error(`Figma REST request failed: ${response.status} ${response.statusText}`);
}

const payload = await response.json();
const documents = Object.fromEntries(nodeIds.map((id) => [id, payload.nodes[id]?.document]).filter(([, node]) => node));

const audit = {
  fetchedAt: new Date().toISOString(),
  fileKey,
  restEndpoint: `/v1/files/${fileKey}/nodes`,
  nodes: {
    body: summarizeComponentSet(documents["57343:20580"]),
    content: {
      ...summarizeComponentSet(documents["9062:21959"]),
      instances: collectInstances(documents["9062:21959"]),
    },
    leadingMedium: summarizeComponentSet(documents["57343:20398"]),
    leadingSmall: summarizeComponentSet(documents["63406:10120"]),
    listItemNative: summarizeComponentSet(documents["57343:18628"]),
    listItemNativeDefault: {
      box: summarizeBox(documents["57343:18665"]),
      id: documents["57343:18665"]?.id,
      instances: collectInstances(documents["57343:18665"]),
      name: documents["57343:18665"]?.name,
      type: documents["57343:18665"]?.type,
    },
    title: summarizeComponentSet(documents["57343:20432"]),
    trailing: summarizeComponentSet(documents["57343:20409"]),
  },
};

const outputPath = join(process.cwd(), "src/figma/rest-audits/list-item-native.rest.json");
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(audit, null, 2)}\n`);

console.log(`Wrote ${outputPath}`);
console.log("Leading small:", audit.nodes.leadingSmall.variants.map((variant) => `${variant.name} ${variant.box.width}x${variant.box.height}`).join(", "));
console.log("Leading medium:", audit.nodes.leadingMedium.variants.map((variant) => `${variant.name} ${variant.box.width}x${variant.box.height}`).join(", "));
console.log("Title props:", Object.keys(audit.nodes.title.propertyDefinitions).join(", "));
console.log("Body props:", Object.keys(audit.nodes.body.propertyDefinitions).join(", "));
