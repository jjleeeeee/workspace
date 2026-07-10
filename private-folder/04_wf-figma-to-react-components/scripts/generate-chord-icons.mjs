import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const iconsDir = path.resolve(projectRoot, "src/assets/icons");
const outputPath = path.resolve(projectRoot, "src/assets/chord-icons.tsx");
const iconNameTokenOverrides = {
  birthdayhat: "birthdayHat",
  officialbadge: "officialBadge",
};
const knownMetadataByFileName = {
  "ic_add_medium.svg": {
    figmaKey: "320382b8c03f32600424779c4eea556029fda8cc",
    nodeId: "10177:64611",
  },
  "ic_arrow_left_medium.svg": {
    figmaKey: "b0ecc0cae9129ea24e7b581b115fd54b9122d291",
    nodeId: "14227:2069",
  },
  "ic_arrow_right_en_medium.svg": {
    figmaKey: "de740c9ac1c46029043b3958803bdb3ba50cebb3",
    nodeId: "12779:4052",
  },
  "ic_arrow_right_medium.svg": {
    figmaKey: "fe0df9128d6cfee154d95e9d4f9d45ab79d633ab",
    nodeId: "14227:2070",
  },
  "ic_birthdayhat_medium.svg": {
    colorMode: "original",
    figmaKey: "0f82eb21b51e02e55803ac759b84b528a246ef14",
    nodeId: "40347:21483",
  },
  "ic_check_medium.svg": {
    figmaKey: "9687bb4a90ddfd294a388cf5d54e353b3f85b107",
    nodeId: "10177:64494",
  },
  "ic_close_medium.svg": {
    figmaKey: "37692bb703c0622fcdbdf7a16450751ff6eb3cf9",
    nodeId: "10177:64523",
  },
  "ic_delete_medium.svg": {
    figmaKey: "a27e79cab710ffbb3b56a47024186fcb06f51737",
    nodeId: "9146:25310",
  },
  "ic_null_medium.svg": {
    figmaKey: "336952af75933c621914d60896ed9ab938e6f3ab",
    nodeId: "10219:78694",
  },
  "ic_play_fill_medium.svg": {
    figmaKey: "b89a927c520b67e55dd26fa6b5eb6a77baf91736",
    nodeId: "33543:6427",
  },
  "ic_question_mark_medium.svg": {
    figmaKey: "75dc611e99406a181eeab077413ac80d38d86b99",
    nodeId: "36902:2249",
  },
  "ic_search_medium.svg": {
    figmaKey: "44374b7cb8c8a1819b2c2a5fa06480892f8d9602",
    nodeId: "10177:64481",
  },
  "ic_send_medium.svg": {
    figmaKey: "f157e89fc5b86f7550aab5b66ca3c8b85335f2da",
    nodeId: "15108:5842",
  },
  "ic_subtract_medium.svg": {
    figmaKey: "416af7e1b597337e0ef094c0eeda9a1b95cb4bd9",
    nodeId: "15196:1089",
  },
};

export function getMediumIconFiles(fileNames) {
  return fileNames
    .filter((fileName) => fileName.endsWith(".svg"))
    .filter((fileName) => /_medium(?:_|\.svg$)/.test(fileName))
    .sort((a, b) => toIconName(a).localeCompare(toIconName(b)));
}

export function toIconName(fileName) {
  const baseName = fileName.replace(/\.svg$/, "").replace(/^ic_/, "");
  const parts = baseName.split("_").filter(Boolean);

  return parts
    .map((part, index) => {
      const normalized = iconNameTokenOverrides[part.toLowerCase()] ?? part.toLowerCase();
      if (index === 0) {
        return normalized;
      }

      return `${normalized.charAt(0).toUpperCase()}${normalized.slice(1)}`;
    })
    .join("");
}

function toImportName(iconName) {
  return `${iconName}Svg`;
}

function getFrameSize(fileName) {
  const baseName = fileName.replace(/\.svg$/, "");
  if (baseName.includes("_medium")) {
    return 24;
  }

  return 24;
}

function getSourceName(fileName) {
  const baseName = fileName.replace(/\.svg$/, "");
  const sourceType = /(?:^|_)special(?:_|$)/.test(baseName) ? "special" : baseName.includes("_en_") ? "en" : "em";

  return `24/${sourceType}/${baseName}`;
}

function getEntryColorMode(fileName, svgContentByFileName) {
  const baseName = fileName.replace(/\.svg$/, "");
  const metadata = knownMetadataByFileName[fileName];

  if (
    metadata?.colorMode === "original" ||
    /(?:^|_)special(?:_|$)/.test(baseName) ||
    /url\(#|<(linearGradient|radialGradient)\b/.test(svgContentByFileName.get(fileName) ?? "")
  ) {
    return `    colorMode: "original",\n`;
  }

  return "";
}

function getMetadata(fileName) {
  return (
    knownMetadataByFileName[fileName] ?? {
      figmaKey: `generated:${fileName}`,
      nodeId: `generated:${fileName}`,
    }
  );
}

function assertUniqueIconNames(files) {
  const seen = new Map();

  for (const fileName of files) {
    const iconName = toIconName(fileName);
    const previousFileName = seen.get(iconName);
    if (previousFileName) {
      throw new Error(`Duplicate icon name "${iconName}" for ${previousFileName} and ${fileName}`);
    }

    seen.set(iconName, fileName);
  }
}

function renderImports(files) {
  return files
    .map((fileName) => `import ${toImportName(toIconName(fileName))} from "./icons/${fileName}?raw";`)
    .join("\n");
}

function renderIconEntries(files, svgContentByFileName) {
  return files
    .map((fileName) => {
      const iconName = toIconName(fileName);
      const importName = toImportName(iconName);
      const metadata = getMetadata(fileName);

      return `  ${iconName}: {\n${getEntryColorMode(fileName, svgContentByFileName)}    fileName: "${fileName}",\n    figmaKey: "${metadata.figmaKey}",\n    frameSize: ${getFrameSize(fileName)},\n    nodeId: "${metadata.nodeId}",\n    sourceName: "${getSourceName(fileName)}",\n    svg: ${importName},\n  },`;
    })
    .join("\n");
}

export function renderChordIconsTsx(files, svgContentByFileName = new Map()) {
  assertUniqueIconNames(files);

  return `import type { CSSProperties, HTMLAttributes } from "react";\n\n${renderImports(files)}\nimport "./chord-icons.css";\n\ntype ChordIconAssetSource = {\n  colorMode?: "currentColor" | "original";\n  figmaKey: string;\n  fileName: string;\n  frameSize: 24;\n  nodeId: string;\n  sourceName: string;\n  svg: string;\n};\n\nexport type ChordIconColorMode = "currentColor" | "original";\n\nexport function inferChordIconColorMode(\n  asset: Pick<ChordIconAssetSource, "fileName" | "sourceName">,\n): ChordIconColorMode {\n  const identity = \`\${asset.fileName} \${asset.sourceName}\`.toLowerCase();\n\n  if (identity.includes("specialtype") || /(?:^|[_/])special(?:[_./]|$)/.test(identity)) {\n    return "original";\n  }\n\n  return "currentColor";\n}\n\nconst chordIconAssetSources = {\n${renderIconEntries(files, svgContentByFileName)}\n} as const satisfies Record<string, ChordIconAssetSource>;\n\nexport const chordIconAssets = chordIconAssetSources;\n\nexport type ChordIconName = keyof typeof chordIconAssets;\nexport type ChordIconSize = 10 | 12 | 16 | 18 | 20 | 24 | 32 | 40;\n\nexport function getChordIconAsset(name: ChordIconName): ChordIconAssetSource {\n  const asset = chordIconAssets[name];\n\n  if (!asset) {\n    throw new Error(\`Unknown Chord icon: \${String(name)}\`);\n  }\n\n  const source = asset as ChordIconAssetSource;\n\n  return {\n    ...source,\n    colorMode: source.colorMode ?? inferChordIconColorMode(source),\n  };\n}\n\nexport interface ChordIconProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {\n  name: ChordIconName;\n  size?: ChordIconSize;\n}\n\nexport function ChordIcon({ className, name, size = 24, style, ...spanProps }: ChordIconProps) {\n  const asset = getChordIconAsset(name);\n  const colorMode = asset.colorMode ?? "currentColor";\n  const classNames = ["chord-icon", className].filter(Boolean).join(" ");\n  const iconStyle = {\n    ...style,\n    "--chord-icon-size": \`\${size}px\`,\n  } as CSSProperties;\n\n  return (\n    <span\n      {...spanProps}\n      aria-hidden={spanProps["aria-hidden"] ?? "true"}\n      className={classNames}\n      data-icon-color-mode={colorMode}\n      data-icon-frame-size={asset.frameSize}\n      data-icon-name={name}\n      data-icon-node-id={asset.nodeId}\n      data-icon-size={size}\n      data-icon-source-name={asset.sourceName}\n      style={iconStyle}\n    >\n      <span className="chord-icon__glyph" dangerouslySetInnerHTML={{ __html: asset.svg }} />\n    </span>\n  );\n}\n`;
}

async function main() {
  const files = getMediumIconFiles(await readdir(iconsDir));
  const svgContentByFileName = new Map(
    await Promise.all(files.map(async (fileName) => [fileName, await readFile(path.join(iconsDir, fileName), "utf8")])),
  );

  await writeFile(outputPath, renderChordIconsTsx(files, svgContentByFileName), "utf8");
  console.log(`Generated ${files.length} medium Chord icons.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
