import type { CSSProperties, ReactNode } from "react";
import { Avatar } from "../Avatar/Avatar";
import { BadgeNumber } from "../BadgeNumber/BadgeNumber";
import { BadgeDot } from "../BadgeDot/BadgeDot";
import { Checkbox } from "../Checkbox/Checkbox";
import { Divider } from "../Divider/Divider";
import { IconButton } from "../IconButton/IconButton";
import { Radio } from "../Radio/Radio";
import { Thumbnail } from "../Thumbnail/Thumbnail";
import { TextButton } from "../TextButton/TextButton";
import { ToggleSwitch } from "../ToggleSwitch/ToggleSwitch";
import { ChordIcon } from "../../assets/chord-icons";

export type ListItemWebMode = "default" | "fixed";
export type ListItemWebSize = "small" | "medium";
export type ListItemWebStates = "default" | "hover-pressed" | "disabled";
export type ListItemWebLeadingType =
  | "avatar"
  | "checkbox"
  | "icon"
  | "radio"
  | "rectangular-thumbnail"
  | "square-thumbnail";
export type ListItemWebTrailingType =
  | "main-button"
  | "icon-button"
  | "number-badge"
  | "radio"
  | "toggle"
  | "text-and-icon"
  | "text-only"
  | "icon-only";

export const listItemWebModeOptions: ListItemWebMode[] = ["default", "fixed"];
export const listItemWebSizeOptions: ListItemWebSize[] = ["small", "medium"];
export const listItemWebStatesOptions: ListItemWebStates[] = ["default", "hover-pressed", "disabled"];
export const listItemWebLeadingTypeOptions: ListItemWebLeadingType[] = [
  "avatar",
  "checkbox",
  "icon",
  "radio",
  "rectangular-thumbnail",
  "square-thumbnail",
];
export const listItemWebTrailingTypeOptions: ListItemWebTrailingType[] = [
  "main-button",
  "icon-button",
  "number-badge",
  "radio",
  "toggle",
  "text-and-icon",
  "text-only",
  "icon-only",
];

export type ListItemWebProps = {
  mode?: ListItemWebMode;
  size?: ListItemWebSize;
  states?: ListItemWebStates;
  titleLabel?: string;
  bodyLabel?: string | null;
  trailingLabel?: string | null;
  showLeading?: boolean;
  leadingType?: ListItemWebLeadingType;
  showSmallLeading?: boolean;
  showMediumLeading?: boolean;
  showTrailing?: boolean;
  trailingType?: ListItemWebTrailingType;
  showTrailingText?: boolean;
  showTrailingIcon?: boolean;
  trailingBadgeLabel?: string | number;
  showDivider?: boolean;
  showBadgeDot?: boolean;
  leadingSlot?: ReactNode;
};

function UnresolvedIconSlot({ role }: { role: string }) {
  return (
    <span
      className="chord-list-item-web__unresolved-icon"
      data-asset-classification="unknown"
      data-asset-role={role}
    />
  );
}

type LeadingSpec = {
  componentId: string;
  componentSetId: string;
  figmaType: string;
  height: number;
  imageSize?: number;
  width: number;
};

const leadingComponentIds: Record<ListItemWebSize, Record<ListItemWebLeadingType, string>> = {
  small: {
    avatar: "63406:10121",
    checkbox: "63406:10123",
    icon: "63406:10125",
    radio: "63406:10131",
    "rectangular-thumbnail": "63406:10127",
    "square-thumbnail": "63406:10129",
  },
  medium: {
    avatar: "57343:20399",
    checkbox: "57343:20401",
    icon: "57343:20403",
    radio: "59314:27103",
    "rectangular-thumbnail": "62641:42034",
    "square-thumbnail": "63354:137265",
  },
};

const leadingFigmaTypes: Record<ListItemWebLeadingType, string> = {
  avatar: "Avatar",
  checkbox: "Checkbox",
  icon: "Icon",
  radio: "Radio",
  "rectangular-thumbnail": "Rectanglular Thumbnail",
  "square-thumbnail": "Square Thumbnail",
};

function getLeadingSpec(size: ListItemWebSize, leadingType: ListItemWebLeadingType): LeadingSpec {
  const isMedium = size === "medium";
  const base = {
    componentId: leadingComponentIds[size][leadingType],
    componentSetId: isMedium ? "57343:20398" : "63406:10120",
    figmaType: leadingFigmaTypes[leadingType],
  };

  if (leadingType === "avatar") {
    return {
      ...base,
      height: isMedium ? 46 : 40,
      imageSize: isMedium ? 40 : 34,
      width: isMedium ? 46 : 40,
    };
  }

  if (leadingType === "rectangular-thumbnail") {
    return { ...base, height: isMedium ? 88 : 56, width: isMedium ? 156 : 100 };
  }

  if (leadingType === "square-thumbnail") {
    return { ...base, height: isMedium ? 56 : 44, width: isMedium ? 56 : 44 };
  }

  return { ...base, height: 24, width: 24 };
}

export function ListItemWeb({
  mode = "default",
  size = "small",
  states = "default",
  titleLabel = "Title",
  bodyLabel = "Body Text",
  trailingLabel = "Detail",
  showLeading = true,
  showSmallLeading = true,
  showMediumLeading = true,
  showTrailing = true,
  trailingType = "text-and-icon",
  showTrailingText = true,
  showTrailingIcon = true,
  trailingBadgeLabel = "999+",
  showDivider = true,
  showBadgeDot = false,
  leadingType = "square-thumbnail",
  leadingSlot,
}: ListItemWebProps) {
  const leadingSpec = getLeadingSpec(size, leadingType);
  const hasLeading = showLeading && (size === "medium" ? showMediumLeading : showSmallLeading);
  const leadingVisibleProperty = size === "medium" ? "Show Medium Leading#69756:0" : "Show Small Leading#69756:13";
  const leadingStyle = {
    "--list-item-web-leading-height": `${leadingSpec.height}px`,
    "--list-item-web-leading-width": `${leadingSpec.width}px`,
  } as CSSProperties;
  const usesCheckTrailing = mode === "default" && size === "small" && states === "disabled";
  const usesDirectDivider = usesCheckTrailing;
  const resolvedTrailingType = usesCheckTrailing ? "check" : trailingType;
  const renderedLeading =
    leadingSlot ??
    (() => {
      if (leadingType === "avatar") {
        return (
          <Avatar
            alt="avatar"
            avatarType="squircle"
            badgeDot={false}
            componentSize={leadingSpec.width}
            imageSize={leadingSpec.imageSize}
            mode="default"
            size="small"
          />
        );
      }

      if (leadingType === "checkbox") {
        return <Checkbox aria-hidden="true" checkboxType="square" mode="default" status="default" tabIndex={-1} />;
      }

      if (leadingType === "icon") {
        return (
          <span className="chord-list-item-web__leading-icon" data-icon-area-size="medium(24)">
            <ChordIcon name="nullMedium" size={24} />
          </span>
        );
      }

      if (leadingType === "radio") {
        return <Radio aria-hidden="true" mode="default" status="enabled" tabIndex={-1} />;
      }

      return (
        <Thumbnail
          alt="thumbnail"
          button={false}
          fill={false}
          height={leadingSpec.height}
          leftItem={false}
          radius="on"
          ratio={leadingType === "rectangular-thumbnail" ? "16:9" : "1:1"}
          rightItemBottom={false}
          rightItemTop={false}
          seekBar={false}
          type="thumbnail"
          width={leadingSpec.width}
        />
      );
    })();
  const trailingDisabled = states === "disabled";
  const renderedTrailing = (() => {
    if (usesCheckTrailing) {
      return (
        <span className="chord-list-item-web__trailing-check">
          <ChordIcon name="checkMedium" size={20} />
        </span>
      );
    }

    if (trailingType === "main-button") {
      return (
        <TextButton mode={mode} size="xxsmall" status={trailingDisabled ? "disabled" : "default"}>
          {trailingLabel ?? "Text"}
        </TextButton>
      );
    }

    if (trailingType === "icon-button") {
      return (
        <IconButton
          aria-label="List item action"
          icon={<UnresolvedIconSlot role="trailing-icon-button" />}
          mode={mode}
          size="xxsmall"
          status={trailingDisabled ? "disabled" : "default"}
        />
      );
    }

    if (trailingType === "number-badge") {
      return <BadgeNumber label={trailingBadgeLabel} mode={mode} />;
    }

    if (trailingType === "radio") {
      return <Radio mode={mode} status={trailingDisabled ? "disabled" : "default"} />;
    }

    if (trailingType === "toggle") {
      return <ToggleSwitch mode={mode} size="small" status={trailingDisabled ? "disabled" : "default"} />;
    }

    if (trailingType === "text-only") {
      return trailingLabel != null ? (
        <span className="chord-list-item-web__trailing-label">{trailingLabel}</span>
      ) : null;
    }

    if (trailingType === "icon-only") {
      return (
        <span className="chord-list-item-web__trailing-icon">
          <ChordIcon name="arrowRightEnMedium" size={20} />
        </span>
      );
    }

    return (
      <>
        {showTrailingText && trailingLabel != null && (
          <span className="chord-list-item-web__trailing-label">{trailingLabel}</span>
        )}
        {showTrailingIcon && (
          <span className="chord-list-item-web__trailing-icon">
            <ChordIcon name="arrowRightEnMedium" size={20} />
          </span>
        )}
      </>
    );
  })();

  return (
    <div
      className="chord-list-item-web"
      data-mode={mode}
      data-size={size}
      data-states={states}
    >
      <div className="chord-list-item-web__state-layer">
        {hasLeading && (
          <div
            className="chord-list-item-web__leading"
            data-leading-component-id={leadingSpec.componentId}
            data-leading-component-set-id={leadingSpec.componentSetId}
            data-leading-figma-type={leadingSpec.figmaType}
            data-leading-type={leadingType}
            data-leading-visible-property={leadingVisibleProperty}
            style={leadingStyle}
          >
            {renderedLeading}
          </div>
        )}
        <div className="chord-list-item-web__text-area">
          <div className="chord-list-item-web__title-row">
            <span className="chord-list-item-web__title">{titleLabel}</span>
            {showBadgeDot && (
              <span className="chord-list-item-web__badge-dot">
                <BadgeDot />
              </span>
            )}
          </div>
          {bodyLabel != null && (
            <span className="chord-list-item-web__body-row">
              <span className="chord-list-item-web__body-icon">
                <ChordIcon name="nullMedium" size={12} />
              </span>
              <span className="chord-list-item-web__body">{bodyLabel}</span>
            </span>
          )}
        </div>
        {showTrailing && (
          <div
            className="chord-list-item-web__trailing"
            data-trailing-branch={resolvedTrailingType}
            data-show-trailing-icon={String(showTrailingIcon)}
            data-show-trailing-text={String(showTrailingText)}
          >
            {renderedTrailing}
          </div>
        )}
      </div>
      {showDivider && (
        <div
          className="chord-list-item-web__divider"
          data-divider-branch={usesDirectDivider ? "direct" : "wrapper"}
        >
          <Divider />
        </div>
      )}
    </div>
  );
}
