import type { CSSProperties, HTMLAttributes } from "react";

import addMediumSvg from "./icons/ic_add_medium.svg?raw";
import arrowDownFoldMediumSvg from "./icons/ic_arrow_down_fold_medium.svg?raw";
import arrowDownMediumSvg from "./icons/ic_arrow_down_medium.svg?raw";
import arrowLeftMediumSvg from "./icons/ic_arrow_left_medium.svg?raw";
import arrowRightEnMediumSvg from "./icons/ic_arrow_right_en_medium.svg?raw";
import arrowRightMediumSvg from "./icons/ic_arrow_right_medium.svg?raw";
import birthdayHatMediumSvg from "./icons/ic_birthdayhat_medium.svg?raw";
import checkMediumSvg from "./icons/ic_check_medium.svg?raw";
import closeMediumSvg from "./icons/ic_close_medium.svg?raw";
import deleteMediumSvg from "./icons/ic_delete_medium.svg?raw";
import hiddenMediumSvg from "./icons/ic_hidden_medium.svg?raw";
import nullMediumSvg from "./icons/ic_null_medium.svg?raw";
import officialBadgeFillMediumSvg from "./icons/ic_officialbadge_fill_medium.svg?raw";
import playFillMediumSvg from "./icons/ic_play_fill_medium.svg?raw";
import questionMarkMediumSvg from "./icons/ic_question_mark_medium.svg?raw";
import searchMediumSvg from "./icons/ic_search_medium.svg?raw";
import sendMediumSvg from "./icons/ic_send_medium.svg?raw";
import subtractMediumSvg from "./icons/ic_subtract_medium.svg?raw";
import "./chord-icons.css";

type ChordIconAssetSource = {
  colorMode?: "currentColor" | "original";
  figmaKey: string;
  fileName: string;
  frameSize: 24;
  nodeId: string;
  sourceName: string;
  svg: string;
};

export type ChordIconColorMode = "currentColor" | "original";

export function inferChordIconColorMode(
  asset: Pick<ChordIconAssetSource, "fileName" | "sourceName">,
): ChordIconColorMode {
  const identity = `${asset.fileName} ${asset.sourceName}`.toLowerCase();

  if (identity.includes("specialtype") || /(?:^|[_/])special(?:[_./]|$)/.test(identity)) {
    return "original";
  }

  return "currentColor";
}

const chordIconAssetSources = {
  addMedium: {
    fileName: "ic_add_medium.svg",
    figmaKey: "320382b8c03f32600424779c4eea556029fda8cc",
    frameSize: 24,
    nodeId: "10177:64611",
    sourceName: "24/em/ic_add_medium",
    svg: addMediumSvg,
  },
  arrowDownFoldMedium: {
    fileName: "ic_arrow_down_fold_medium.svg",
    figmaKey: "figma-context-dropdown-fold",
    frameSize: 24,
    nodeId: "figma-context-dropdown-fold",
    sourceName: "24/em/ic_arrow_down_fold_medium",
    svg: arrowDownFoldMediumSvg,
  },
  arrowDownMedium: {
    fileName: "ic_arrow_down_medium.svg",
    figmaKey: "figma-context-62030-25493",
    frameSize: 24,
    nodeId: "I62030:25493;10219:79410",
    sourceName: "24/em/ic_arrow_down_medium",
    svg: arrowDownMediumSvg,
  },
  arrowLeftMedium: {
    fileName: "ic_arrow_left_medium.svg",
    figmaKey: "b0ecc0cae9129ea24e7b581b115fd54b9122d291",
    frameSize: 24,
    nodeId: "14227:2069",
    sourceName: "24/em/ic_arrow_left_medium",
    svg: arrowLeftMediumSvg,
  },
  arrowRightEnMedium: {
    fileName: "ic_arrow_right_en_medium.svg",
    figmaKey: "de740c9ac1c46029043b3958803bdb3ba50cebb3",
    frameSize: 24,
    nodeId: "12779:4052",
    sourceName: "24/en/ic_arrow_right_en_medium",
    svg: arrowRightEnMediumSvg,
  },
  arrowRightMedium: {
    fileName: "ic_arrow_right_medium.svg",
    figmaKey: "fe0df9128d6cfee154d95e9d4f9d45ab79d633ab",
    frameSize: 24,
    nodeId: "14227:2070",
    sourceName: "24/em/ic_arrow_right_medium",
    svg: arrowRightMediumSvg,
  },
  birthdayHatMedium: {
    colorMode: "original",
    fileName: "ic_birthdayhat_medium.svg",
    figmaKey: "0f82eb21b51e02e55803ac759b84b528a246ef14",
    frameSize: 24,
    nodeId: "40347:21483",
    sourceName: "24/em/ic_birthdayhat_medium",
    svg: birthdayHatMediumSvg,
  },
  checkMedium: {
    fileName: "ic_check_medium.svg",
    figmaKey: "9687bb4a90ddfd294a388cf5d54e353b3f85b107",
    frameSize: 24,
    nodeId: "10177:64494",
    sourceName: "24/em/ic_check_medium",
    svg: checkMediumSvg,
  },
  closeMedium: {
    fileName: "ic_close_medium.svg",
    figmaKey: "37692bb703c0622fcdbdf7a16450751ff6eb3cf9",
    frameSize: 24,
    nodeId: "10177:64523",
    sourceName: "24/em/ic_close_medium",
    svg: closeMediumSvg,
  },
  deleteMedium: {
    fileName: "ic_delete_medium.svg",
    figmaKey: "a27e79cab710ffbb3b56a47024186fcb06f51737",
    frameSize: 24,
    nodeId: "9146:25310",
    sourceName: "24/em/ic_delete_medium",
    svg: deleteMediumSvg,
  },
  hiddenMedium: {
    fileName: "ic_hidden_medium.svg",
    figmaKey: "figma-gap-hidden-medium",
    frameSize: 24,
    nodeId: "figma-gap-hidden-medium",
    sourceName: "24/em/ic_hidden_medium",
    svg: hiddenMediumSvg,
  },
  officialBadgeFillMedium: {
    fileName: "ic_officialbadge_fill_medium.svg",
    figmaKey: "figma-gap-official-badge-fill-medium",
    frameSize: 24,
    nodeId: "figma-gap-official-badge-fill-medium",
    sourceName: "24/em/ic_officialbadge_fill_medium",
    svg: officialBadgeFillMediumSvg,
  },
  nullMedium: {
    fileName: "ic_null_medium.svg",
    figmaKey: "336952af75933c621914d60896ed9ab938e6f3ab",
    frameSize: 24,
    nodeId: "10219:78694",
    sourceName: "24/em/ic_null_medium",
    svg: nullMediumSvg,
  },
  playFillMedium: {
    fileName: "ic_play_fill_medium.svg",
    figmaKey: "b89a927c520b67e55dd26fa6b5eb6a77baf91736",
    frameSize: 24,
    nodeId: "33543:6427",
    sourceName: "24/em/ic_play_fill_medium",
    svg: playFillMediumSvg,
  },
  questionMarkMedium: {
    fileName: "ic_question_mark_medium.svg",
    figmaKey: "75dc611e99406a181eeab077413ac80d38d86b99",
    frameSize: 24,
    nodeId: "36902:2249",
    sourceName: "24/em/ic_question_mark_medium",
    svg: questionMarkMediumSvg,
  },
  searchMedium: {
    fileName: "ic_search_medium.svg",
    figmaKey: "44374b7cb8c8a1819b2c2a5fa06480892f8d9602",
    frameSize: 24,
    nodeId: "10177:64481",
    sourceName: "24/em/ic_search_medium",
    svg: searchMediumSvg,
  },
  sendMedium: {
    fileName: "ic_send_medium.svg",
    figmaKey: "f157e89fc5b86f7550aab5b66ca3c8b85335f2da",
    frameSize: 24,
    nodeId: "15108:5842",
    sourceName: "24/em/ic_send_medium",
    svg: sendMediumSvg,
  },
  subtractMedium: {
    fileName: "ic_subtract_medium.svg",
    figmaKey: "416af7e1b597337e0ef094c0eeda9a1b95cb4bd9",
    frameSize: 24,
    nodeId: "15196:1089",
    sourceName: "24/em/ic_subtract_medium",
    svg: subtractMediumSvg,
  },
} as const satisfies Record<string, ChordIconAssetSource>;

export const chordIconAssets = chordIconAssetSources;

export type ChordIconName = keyof typeof chordIconAssets;
export type ChordIconSize = 10 | 12 | 16 | 18 | 20 | 24 | 32 | 40;

export function getChordIconAsset(name: ChordIconName): ChordIconAssetSource {
  const asset = chordIconAssets[name];

  if (!asset) {
    throw new Error(`Unknown Chord icon: ${String(name)}`);
  }

  const source = asset as ChordIconAssetSource;

  return {
    ...source,
    colorMode: source.colorMode ?? inferChordIconColorMode(source),
  };
}

export interface ChordIconProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  name: ChordIconName;
  size?: ChordIconSize;
}

export function ChordIcon({ className, name, size = 24, style, ...spanProps }: ChordIconProps) {
  const asset = getChordIconAsset(name);
  const colorMode = asset.colorMode ?? "currentColor";
  const classNames = ["chord-icon", className].filter(Boolean).join(" ");
  const iconStyle = {
    ...style,
    "--chord-icon-size": `${size}px`,
  } as CSSProperties;

  return (
    <span
      {...spanProps}
      aria-hidden={spanProps["aria-hidden"] ?? "true"}
      className={classNames}
      data-icon-color-mode={colorMode}
      data-icon-frame-size={asset.frameSize}
      data-icon-name={name}
      data-icon-node-id={asset.nodeId}
      data-icon-size={size}
      data-icon-source-name={asset.sourceName}
      style={iconStyle}
    >
      <span className="chord-icon__glyph" dangerouslySetInnerHTML={{ __html: asset.svg }} />
    </span>
  );
}
