import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { ChordIcon } from "../../assets/chord-icons";
import { Checkbox } from "../Checkbox/Checkbox";
import { Tag } from "../Tag/Tag";
import "./Thumbnail.css";

const placeholderWordmarkLarge = new URL("../../figma/fixtures/thumbnail-placeholder-wordmark-large.svg", import.meta.url).href;
const placeholderWordmarkSmall = new URL("../../figma/fixtures/thumbnail-placeholder-wordmark-small.svg", import.meta.url).href;
const placeholderSymbol = new URL("../../figma/fixtures/thumbnail-placeholder-symbol.svg", import.meta.url).href;

export type ThumbnailType = "thumbnail";
export type ThumbnailRatio = "1:1" | "3:4" | "5:6" | "5:8" | "9:16" | "16:9";
export type ThumbnailRadius = "off" | "on";
type ThumbnailPlaceholderMark = "wordmark-large" | "wordmark-small" | "symbol";
export type ThumbnailLeftItemType = "double-icon" | "single-icon";
export type ThumbnailRightItemTopType = "double-icon" | "single-icon" | "checkbox";
export type ThumbnailRightItemBottomType = "text-large" | "text-small" | "timer-large" | "timer-small";
export type ThumbnailButtonType = "play" | "text";

export const thumbnailLeftItemTypeOptions: ThumbnailLeftItemType[] = ["double-icon", "single-icon"];
export const thumbnailRightItemTopTypeOptions: ThumbnailRightItemTopType[] = ["double-icon", "single-icon", "checkbox"];
export const thumbnailRightItemBottomTypeOptions: ThumbnailRightItemBottomType[] = [
  "text-large",
  "text-small",
  "timer-large",
  "timer-small",
];
export const thumbnailButtonTypeOptions: ThumbnailButtonType[] = ["play", "text"];

export const thumbnailRatioReferenceSizes: Record<ThumbnailRatio, { height: number; width: 256 }> = {
  "1:1": { height: 256, width: 256 },
  "3:4": { height: 340, width: 256 },
  "5:6": { height: 307, width: 256 },
  "5:8": { height: 410, width: 256 },
  "9:16": { height: 455, width: 256 },
  "16:9": { height: 144, width: 256 },
};

export interface ThumbnailProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  alt?: string;
  button?: boolean;
  buttonText?: string;
  buttonType?: ThumbnailButtonType;
  fill?: boolean;
  height?: number;
  leftItem?: boolean;
  leftItemLeftIconSlot?: ReactNode;
  leftItemRightIconSlot?: ReactNode;
  leftItemShowTag?: boolean;
  leftItemType?: ThumbnailLeftItemType;
  leftTagLabel?: string;
  radius?: ThumbnailRadius;
  ratio?: ThumbnailRatio;
  rightBottomLabel?: string;
  rightItemBottom?: boolean;
  rightItemBottomIconSlot?: ReactNode;
  rightItemBottomShowIcon?: boolean;
  rightItemBottomType?: ThumbnailRightItemBottomType;
  rightItemTop?: boolean;
  rightItemTopLeftIconSlot?: ReactNode;
  rightItemTopRightIconSlot?: ReactNode;
  rightItemTopType?: ThumbnailRightItemTopType;
  seekBar?: boolean;
  seekProgress?: number;
  src?: string;
  type?: ThumbnailType;
  width?: number;
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function getThumbnailRatioHeight(ratio: ThumbnailRatio, width: number) {
  const reference = thumbnailRatioReferenceSizes[ratio];
  return Math.floor((width / reference.width) * reference.height);
}

function clampProgress(progress: number) {
  return Math.min(100, Math.max(0, progress));
}

function renderNullIconSlot(slot: ReactNode, testId: string) {
  return (
    <span className="chord-thumbnail__icon-area" data-asset-classification={slot ? "consumer-provided-icon" : "null-marker"} data-testid={testId}>
      {slot ?? <ChordIcon name="nullMedium" size={20} />}
    </span>
  );
}

function getPlaceholderMark(ratio: ThumbnailRatio, width: number): ThumbnailPlaceholderMark {
  if (width < 200) {
    return "symbol";
  }

  if (ratio === "5:6" || ratio === "5:8") {
    return "wordmark-small";
  }

  return "wordmark-large";
}

const placeholderMarkSrc: Record<ThumbnailPlaceholderMark, string> = {
  "wordmark-large": placeholderWordmarkLarge,
  "wordmark-small": placeholderWordmarkSmall,
  symbol: placeholderSymbol,
};

export function Thumbnail({
  alt = "",
  button = false,
  buttonText = "+5",
  buttonType = "play",
  className,
  fill = false,
  height,
  leftItem = false,
  leftItemLeftIconSlot,
  leftItemRightIconSlot,
  leftItemShowTag = true,
  leftItemType = "double-icon",
  leftTagLabel = "Text",
  radius = "off",
  ratio = "1:1",
  rightBottomLabel = "99+",
  rightItemBottom = false,
  rightItemBottomIconSlot,
  rightItemBottomShowIcon = false,
  rightItemBottomType = "text-large",
  rightItemTop = false,
  rightItemTopLeftIconSlot,
  rightItemTopRightIconSlot,
  rightItemTopType = "double-icon",
  seekBar = false,
  seekProgress = 25,
  src,
  style,
  type = "thumbnail",
  width = 256,
  ...spanProps
}: ThumbnailProps) {
  const resolvedHeight = height ?? getThumbnailRatioHeight(ratio, width);
  const progress = clampProgress(seekProgress);
  const placeholderMark = getPlaceholderMark(ratio, width);
  const classNames = cx("chord-thumbnail", className);
  const thumbnailStyle = {
    ...style,
    "--thumbnail-height": `${resolvedHeight}px`,
    "--thumbnail-progress": `${progress}%`,
    "--thumbnail-width": `${width}px`,
  } as CSSProperties;

  return (
    <span
      {...spanProps}
      className={classNames}
      data-button={String(button)}
      data-fill={String(fill)}
      data-left-item={String(leftItem)}
      data-radius={radius}
      data-ratio={ratio}
      data-right-item-bottom={String(rightItemBottom)}
      data-right-item-top={String(rightItemTop)}
      data-seek-bar={String(seekBar)}
      data-type={type}
      style={thumbnailStyle}
    >
      {src ? (
        <img alt={alt} className="chord-thumbnail__image" data-asset-classification="consumer-image-content" draggable={false} src={src} />
      ) : (
        <span
          className="chord-thumbnail__placeholder"
          data-asset-classification="figma-no-image-placeholder"
          data-placeholder-mark={placeholderMark}
          data-placeholder-ratio={ratio}
          data-testid="thumbnail-placeholder"
        >
          <img
            alt=""
            className="chord-thumbnail__placeholder-mark"
            data-testid="thumbnail-placeholder-mark"
            draggable={false}
            src={placeholderMarkSrc[placeholderMark]}
          />
        </span>
      )}

      {fill ? <span className="chord-thumbnail__fill" data-module-type="scrim-overlay" data-testid="thumbnail-fill" /> : null}

      {leftItem ? (
        <span className="chord-thumbnail__left-item" data-left-item-type={leftItemType} data-testid="thumbnail-left-item">
          {renderNullIconSlot(leftItemLeftIconSlot, "thumbnail-left-item-left-icon")}
          {leftItemType === "double-icon" ? renderNullIconSlot(leftItemRightIconSlot, "thumbnail-left-item-right-icon") : null}
          {leftItemShowTag ? (
            <Tag color="primary" label={leftTagLabel} shape="squircle" showIcon size="medium" tagType="fill" />
          ) : null}
        </span>
      ) : null}

      {rightItemTop ? (
        <span className="chord-thumbnail__right-item-top" data-right-item-top-type={rightItemTopType} data-testid="thumbnail-right-item-top">
          {rightItemTopType === "checkbox" ? (
            <Checkbox
              aria-hidden="true"
              checkboxType="circle"
              className="chord-thumbnail__right-item-checkbox"
              data-testid="thumbnail-right-item-checkbox"
              disabled
              mode="fixed"
              status="default"
            />
          ) : (
            <>
              {rightItemTopType === "double-icon" ? renderNullIconSlot(rightItemTopLeftIconSlot, "thumbnail-right-item-top-left-icon") : null}
              {renderNullIconSlot(rightItemTopRightIconSlot, "thumbnail-right-item-top-right-icon")}
            </>
          )}
        </span>
      ) : null}

      {rightItemBottom ? (
        <span
          className="chord-thumbnail__right-item-bottom"
          data-right-item-bottom-type={rightItemBottomType}
          data-testid="thumbnail-right-item-bottom"
        >
          {rightItemBottomShowIcon ? renderNullIconSlot(rightItemBottomIconSlot, "thumbnail-right-item-bottom-icon") : null}
          <span className="chord-thumbnail__right-item-bottom-label">{rightBottomLabel}</span>
        </span>
      ) : null}

      {button ? (
        <span className="chord-thumbnail__center-button" data-button-type={buttonType} data-testid="thumbnail-center-button">
          {buttonType === "play" ? (
            <ChordIcon
              className="chord-thumbnail__center-button-icon"
              data-testid="thumbnail-center-button-icon"
              name="playFillMedium"
              size={40}
            />
          ) : (
            <span className="chord-thumbnail__center-button-text">{buttonText}</span>
          )}
        </span>
      ) : null}

      {seekBar ? (
        <span className="chord-thumbnail__seek-bar" data-progress={progress} data-testid="thumbnail-seek-bar">
          <span data-testid="thumbnail-seek-bar-streaming" style={{ inlineSize: `${progress}%` }} />
        </span>
      ) : null}
    </span>
  );
}
