import type { CSSProperties, HTMLAttributes } from "react";
import { ChordIcon, type ChordIconName } from "../../assets/chord-icons";
import { Avatar } from "../Avatar/Avatar";
import { BadgeDot } from "../BadgeDot/BadgeDot";
import { BadgeNumber } from "../BadgeNumber/BadgeNumber";
import { Checkbox } from "../Checkbox/Checkbox";
import { Divider } from "../Divider/Divider";
import { IconButton } from "../IconButton/IconButton";
import { Radio } from "../Radio/Radio";
import { TextButton } from "../TextButton/TextButton";
import { Thumbnail } from "../Thumbnail/Thumbnail";
import { ToggleSwitch } from "../ToggleSwitch/ToggleSwitch";
import "./ListItemNative.css";

export type ListItemNativeMode = "default" | "fixed";
export type ListItemNativeSize = "small" | "medium";
export type ListItemNativeStatus = "default" | "hover-pressed" | "disabled";
export type ListItemNativeLeadingType =
  | "avatar"
  | "checkbox"
  | "icon"
  | "radio"
  | "rectangularThumbnail"
  | "squareThumbnail";
export type ListItemNativeTextWeight = "bold" | "regular";
export type ListItemNativeTitleTextColor = "default" | "primary" | "red";
export type ListItemNativeBodyTextColor = "default" | "primary";
export type ListItemNativeTrailingType =
  | "iconButton"
  | "mainButton"
  | "numberBadge"
  | "radio"
  | "toggle"
  | "textAndIcon"
  | "textOnly"
  | "iconOnly";
export type ListItemNativeCoverage = "complete/deep-inventoried";
export type ListItemNativeTextOverflow = "wrap" | "clip" | "ellipsis";

export const listItemNativeModeOptions: ListItemNativeMode[] = ["default", "fixed"];
export const listItemNativeSizeOptions: ListItemNativeSize[] = ["small", "medium"];
export const listItemNativeStatusOptions: ListItemNativeStatus[] = ["default", "hover-pressed", "disabled"];
export const listItemNativeLeadingTypeOptions: ListItemNativeLeadingType[] = [
  "avatar",
  "checkbox",
  "icon",
  "radio",
  "rectangularThumbnail",
  "squareThumbnail",
];
export const listItemNativeTextWeightOptions: ListItemNativeTextWeight[] = ["bold", "regular"];
export const listItemNativeTitleTextColorOptions: ListItemNativeTitleTextColor[] = ["default", "primary", "red"];
export const listItemNativeBodyTextColorOptions: ListItemNativeBodyTextColor[] = ["default", "primary"];
export const listItemNativeTrailingTypeOptions: ListItemNativeTrailingType[] = [
  "iconButton",
  "mainButton",
  "numberBadge",
  "radio",
  "toggle",
  "textAndIcon",
  "textOnly",
  "iconOnly",
];
export const listItemNativeCoverage: ListItemNativeCoverage = "complete/deep-inventoried";

export interface ListItemNativeProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  bodyLeadingIcon?: boolean;
  bodyText?: string;
  bodyTextColor?: ListItemNativeBodyTextColor;
  bodyTextWeight?: ListItemNativeTextWeight;
  detailText?: string;
  inlineSize?: number | string;
  leadingCheckboxChecked?: boolean;
  leadingIconName?: ChordIconName;
  leadingRadioChecked?: boolean;
  leadingType?: ListItemNativeLeadingType;
  mode?: ListItemNativeMode;
  showDivider?: boolean;
  showBodyText?: boolean;
  showMediumLeading?: boolean;
  showSmallLeading?: boolean;
  showTitleBadge?: boolean;
  showTrailing?: boolean;
  size?: ListItemNativeSize;
  status?: ListItemNativeStatus;
  trailingBadgeLabel?: string | number;
  trailingButtonText?: string;
  trailingIconName?: ChordIconName;
  trailingRadioChecked?: boolean;
  trailingShowIcon?: boolean;
  trailingShowText?: boolean;
  trailingToggleChecked?: boolean;
  trailingType?: ListItemNativeTrailingType;
  thumbnailAlt?: string;
  thumbnailSrc?: string;
  title?: string;
  titleTextColor?: ListItemNativeTitleTextColor;
  titleTextWeight?: ListItemNativeTextWeight;
  textOverflow?: ListItemNativeTextOverflow;
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function toCssLength(value: number | string) {
  return typeof value === "number" ? `${value}px` : value;
}

function getListItemMetrics(size: ListItemNativeSize) {
  if (size === "small") {
    return {
      rectangularLeadingHeight: 44,
      rectangularLeadingWidth: 78,
      leadingSize: 44,
      paddingBlock: 6,
      rowHeight: 58,
    };
  }

  return {
    rectangularLeadingHeight: 56,
    rectangularLeadingWidth: 100,
    leadingSize: 56,
    paddingBlock: 12,
    rowHeight: 80,
  };
}

function getLeadingDimensions(size: ListItemNativeSize, leadingType: ListItemNativeLeadingType) {
  const smallDimensions: Record<ListItemNativeLeadingType, { height: number; width: number }> = {
    avatar: { height: 40, width: 40 },
    checkbox: { height: 24, width: 24 },
    icon: { height: 24, width: 24 },
    radio: { height: 24, width: 24 },
    rectangularThumbnail: { height: 56, width: 100 },
    squareThumbnail: { height: 44, width: 44 },
  };
  const mediumDimensions: Record<ListItemNativeLeadingType, { height: number; width: number }> = {
    avatar: { height: 46, width: 46 },
    checkbox: { height: 24, width: 24 },
    icon: { height: 24, width: 24 },
    radio: { height: 24, width: 24 },
    rectangularThumbnail: { height: 88, width: 156 },
    squareThumbnail: { height: 56, width: 56 },
  };

  return size === "small" ? smallDimensions[leadingType] : mediumDimensions[leadingType];
}

function renderListItemLeading({
  leadingCheckboxChecked,
  leadingDimensions,
  leadingIconName,
  leadingRadioChecked,
  leadingType,
  metrics,
  mode,
  status,
  thumbnailAlt,
  thumbnailSrc,
}: {
  leadingCheckboxChecked: boolean;
  leadingDimensions: { height: number; width: number };
  leadingIconName: ChordIconName;
  leadingRadioChecked: boolean;
  leadingType: ListItemNativeLeadingType;
  metrics: ReturnType<typeof getListItemMetrics>;
  mode: ListItemNativeMode;
  status: ListItemNativeStatus;
  thumbnailAlt: string;
  thumbnailSrc?: string;
}) {
  const controlDisabled = status === "disabled";

  if (leadingType === "avatar") {
    return (
      <Avatar
        avatarType="squircle"
        componentSize={leadingDimensions.width}
        data-testid="list-item-leading-avatar"
        imageSize={leadingDimensions.width}
        mode={mode}
        size={metrics.leadingSize === 44 ? "small" : "medium"}
      />
    );
  }

  if (leadingType === "checkbox") {
    return (
      <Checkbox
        checked={leadingCheckboxChecked}
        checkboxType="square"
        data-testid="list-item-leading-checkbox"
        disabled={controlDisabled}
        mode={mode}
      />
    );
  }

  if (leadingType === "icon") {
    return (
      <ChordIcon
        className="chord-list-item-native__leading-icon"
        data-testid="list-item-leading-icon"
        name={leadingIconName}
        size={24}
      />
    );
  }

  if (leadingType === "radio") {
    return (
      <Radio
        checked={leadingRadioChecked}
        data-testid="list-item-leading-radio"
        disabled={controlDisabled}
        mode={mode}
        status={leadingRadioChecked ? "enabled" : "default"}
      />
    );
  }

  if (leadingType === "rectangularThumbnail") {
    return (
      <Thumbnail
        alt={thumbnailAlt}
        className="chord-list-item-native__thumbnail"
        data-testid="list-item-leading-rectangular-thumbnail"
        height={leadingDimensions.height}
        radius="on"
        ratio="16:9"
        src={thumbnailSrc}
        width={leadingDimensions.width}
      />
    );
  }

  return (
    <Thumbnail
      alt={thumbnailAlt}
      className="chord-list-item-native__thumbnail"
      data-testid="list-item-leading-thumbnail"
      height={leadingDimensions.height}
      radius="on"
      ratio="1:1"
      src={thumbnailSrc}
      width={leadingDimensions.width}
    />
  );
}

function renderListItemTrailing({
  detailText,
  mode,
  status,
  trailingBadgeLabel,
  trailingButtonText,
  trailingIconName,
  trailingRadioChecked,
  trailingShowIcon,
  trailingShowText,
  trailingToggleChecked,
  trailingType,
}: Required<
  Pick<
    ListItemNativeProps,
    | "detailText"
    | "mode"
    | "status"
    | "trailingBadgeLabel"
    | "trailingButtonText"
    | "trailingIconName"
    | "trailingRadioChecked"
    | "trailingShowIcon"
    | "trailingShowText"
    | "trailingToggleChecked"
    | "trailingType"
  >
>) {
  const childStatus = status === "disabled" ? "disabled" : "default";
  const controlDisabled = status === "disabled";

  if (trailingType === "iconButton") {
    return (
      <IconButton
        aria-label="List item trailing action"
        data-testid="list-item-trailing-icon-button"
        disabled={controlDisabled}
        icon={<ChordIcon name="sendMedium" size={20} />}
        mode={mode}
        radius="on"
        size="medium"
        status={childStatus}
      />
    );
  }

  if (trailingType === "mainButton") {
    return (
      <TextButton
        data-testid="list-item-trailing-main-button"
        disabled={controlDisabled}
        mode={mode}
        radius="off"
        size="xsmall"
        status={childStatus}
      >
        {trailingButtonText}
      </TextButton>
    );
  }

  if (trailingType === "numberBadge") {
    return <BadgeNumber data-testid="list-item-trailing-badge-number" label={trailingBadgeLabel} mode="default" />;
  }

  if (trailingType === "radio") {
    return (
      <Radio
        checked={trailingRadioChecked}
        data-testid="list-item-trailing-radio"
        disabled={controlDisabled}
        mode={mode}
      />
    );
  }

  if (trailingType === "toggle") {
    return (
      <ToggleSwitch
        checked={trailingToggleChecked}
        data-testid="list-item-trailing-toggle"
        disabled={controlDisabled}
        mode={mode}
        size="medium"
      />
    );
  }

  if (trailingType === "iconOnly") {
    return trailingShowIcon ? (
      <ChordIcon
        className="chord-list-item-native__single-icon"
        data-testid="list-item-trailing-single-icon"
        name={trailingIconName}
        size={20}
      />
    ) : null;
  }

  return (
    <>
      {trailingShowText ? <span className="chord-list-item-native__detail">{detailText}</span> : null}
      {trailingType === "textAndIcon" && trailingShowIcon ? (
        <span className="chord-list-item-native__trailing-icon-frame">
          <ChordIcon
            className="chord-list-item-native__trailing-icon"
            data-testid="list-item-trailing-icon"
            name="arrowRightEnMedium"
            size={20}
          />
        </span>
      ) : null}
    </>
  );
}

export function ListItemNative({
  bodyText = "Body Text",
  bodyLeadingIcon = true,
  bodyTextColor = "default",
  bodyTextWeight = "regular",
  className,
  detailText = "Detail",
  inlineSize,
  leadingCheckboxChecked = false,
  leadingIconName = "nullMedium",
  leadingRadioChecked = true,
  leadingType = "squareThumbnail",
  mode = "default",
  showBodyText = true,
  showDivider = true,
  showMediumLeading = true,
  showSmallLeading = true,
  showTitleBadge = false,
  showTrailing = true,
  size = "medium",
  status = "default",
  style,
  trailingBadgeLabel = "999+",
  trailingButtonText = "Text",
  trailingIconName = "addMedium",
  trailingRadioChecked = true,
  trailingShowIcon = true,
  trailingShowText = true,
  trailingToggleChecked = true,
  trailingType = "textAndIcon",
  thumbnailAlt = "",
  thumbnailSrc,
  title = "Title",
  titleTextColor = "default",
  titleTextWeight = "bold",
  textOverflow = "wrap",
  ...divProps
}: ListItemNativeProps) {
  const metrics = getListItemMetrics(size);
  const leadingDimensions = getLeadingDimensions(size, leadingType);
  const leadingVisible = size === "small" ? showSmallLeading : showMediumLeading;
  const compactTitleOnly = !leadingVisible && !showBodyText && !showTrailing && size === "small";
  const classNames = cx("chord-list-item-native", className);
  const listItemStyle = {
    ...style,
    "--list-item-leading-height": `${leadingDimensions.height}px`,
    "--list-item-leading-size": `${metrics.leadingSize}px`,
    "--list-item-leading-width": `${leadingDimensions.width}px`,
    "--list-item-row-height": `${compactTitleOnly ? 40 : metrics.rowHeight}px`,
    "--list-item-row-padding-block": `${compactTitleOnly ? 9 : metrics.paddingBlock}px`,
    ...(inlineSize === undefined ? {} : { "--list-item-width": toCssLength(inlineSize) }),
  } as CSSProperties;

  return (
    <div
      {...divProps}
      className={classNames}
      data-coverage={listItemNativeCoverage}
      data-compact-title-only={String(compactTitleOnly)}
      data-divider-visible={String(showDivider)}
      data-leading-visible={String(leadingVisible)}
      data-mode={mode}
      data-size={size}
      data-status={status}
      data-text-overflow={textOverflow}
      data-trailing-visible={String(showTrailing)}
      style={listItemStyle}
    >
      <div className="chord-list-item-native__row">
        {leadingVisible ? (
          <div className="chord-list-item-native__leading" data-leading-type={leadingType} data-testid="list-item-leading">
            {renderListItemLeading({
              leadingCheckboxChecked,
              leadingDimensions,
              leadingIconName,
              leadingRadioChecked,
              leadingType,
              metrics,
              mode,
              status,
              thumbnailAlt,
              thumbnailSrc,
            })}
          </div>
        ) : null}

        <div className="chord-list-item-native__content">
          <div className="chord-list-item-native__title-row">
            <span
              className="chord-list-item-native__title"
              data-text-color={titleTextColor}
              data-text-weight={titleTextWeight}
            >
              {title}
            </span>
            {showTitleBadge ? (
              <span className="chord-list-item-native__title-badge" data-testid="list-item-title-badge">
                <BadgeDot mode={mode} outline="off" size="small" />
              </span>
            ) : null}
          </div>
          {showBodyText ? (
            <span
              className="chord-list-item-native__body-row"
              data-leading-icon={String(bodyLeadingIcon)}
              data-text-color={bodyTextColor}
              data-text-weight={bodyTextWeight}
            >
              {bodyLeadingIcon ? (
                <ChordIcon
                  className="chord-list-item-native__body-leading-icon"
                  data-testid="list-item-body-leading-icon"
                  name="nullMedium"
                  size={12}
                />
              ) : null}
              <span className="chord-list-item-native__body">{bodyText}</span>
            </span>
          ) : null}
        </div>

        {showTrailing ? (
          <div
            className="chord-list-item-native__trailing"
            data-testid="list-item-trailing"
            data-trailing-show-icon={String(trailingShowIcon)}
            data-trailing-show-text={String(trailingShowText)}
            data-trailing-type={trailingType}
          >
            {renderListItemTrailing({
              detailText,
              mode,
              status,
              trailingBadgeLabel,
              trailingButtonText,
              trailingIconName,
              trailingRadioChecked,
              trailingShowIcon,
              trailingShowText,
              trailingToggleChecked,
              trailingType,
            })}
          </div>
        ) : null}
      </div>

      {showDivider ? (
        <div className="chord-list-item-native__divider-wrap">
          <Divider
            className="chord-list-item-native__divider"
            data-testid="list-item-divider"
            dividerStyle="default-50a-2"
            height="1"
            mode={mode}
          />
        </div>
      ) : null}
    </div>
  );
}
