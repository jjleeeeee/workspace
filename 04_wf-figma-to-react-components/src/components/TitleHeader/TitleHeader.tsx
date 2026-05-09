import type { ReactNode } from "react";
import { ChordIcon } from "../../assets/chord-icons";
import { AvatarGroup } from "../AvatarGroup/AvatarGroup";
import "./TitleHeader.css";

export type TitleHeaderMode = "default" | "fixed";
export type TitleHeaderAlign = "left" | "center";
export type TitleHeaderLeadingType = "icon" | "avatar-group";
export type TitleHeaderTrailingType = "text-icon" | "dropdown";

export const titleHeaderModeOptions: TitleHeaderMode[] = ["default", "fixed"];
export const titleHeaderAlignOptions: TitleHeaderAlign[] = ["left", "center"];
export const titleHeaderLeadingTypeOptions: TitleHeaderLeadingType[] = ["icon", "avatar-group"];
export const titleHeaderTrailingTypeOptions: TitleHeaderTrailingType[] = ["text-icon", "dropdown"];

export type TitleHeaderProps = {
  mode?: TitleHeaderMode;
  align?: TitleHeaderAlign;
  marquee?: boolean;
  titleLabel?: string;
  subTitleLabel?: string;
  trailingLabel?: string;
  leadingType?: TitleHeaderLeadingType;
  trailingType?: TitleHeaderTrailingType;
  showLeading?: boolean;
  showSubTitle?: boolean;
  showTrailing?: boolean;
  showTrailingText?: boolean;
  showTrailingIcon?: boolean;
  showTitleBadge?: boolean;
  showBadge1?: boolean;
  showBadge2?: boolean;
  showSubBadge?: boolean;
  showTitleMultiple?: boolean;
  showSubTitleMultiple?: boolean;
  leadingSlot?: ReactNode;
  trailingSlot?: ReactNode;
  badge1Slot?: ReactNode;
  badge2Slot?: ReactNode;
  subBadgeSlot?: ReactNode;
  multipleTitleSlot?: ReactNode;
  multipleSubTitleSlot?: ReactNode;
  multipleSlot?: ReactNode;
};

export function TitleHeader({
  mode = "default",
  align = "left",
  marquee = false,
  titleLabel = "Title",
  subTitleLabel = "SubTitle",
  trailingLabel = "Detail",
  leadingType = "icon",
  trailingType = "dropdown",
  showLeading = true,
  showSubTitle = true,
  showTrailing = true,
  showTrailingText = true,
  showTrailingIcon = true,
  showTitleBadge = true,
  showBadge1 = true,
  showBadge2 = true,
  showSubBadge = true,
  showTitleMultiple = false,
  showSubTitleMultiple = false,
  leadingSlot,
  trailingSlot,
  badge1Slot,
  badge2Slot,
  subBadgeSlot,
  multipleTitleSlot,
  multipleSubTitleSlot,
  multipleSlot,
}: TitleHeaderProps) {
  const resolvedLeadingType = align === "center" ? "icon" : leadingType;
  const defaultLeading =
    resolvedLeadingType === "avatar-group" ? (
      <AvatarGroup alignment="tile" count="1" liveTag shape="squircle" />
    ) : (
      <ChordIcon name="nullMedium" size={24} />
    );
  const trailingIconName = trailingType === "dropdown" ? "arrowDownMedium" : "arrowRightEnMedium";

  return (
    <div className="chord-title-header" data-mode={mode} data-align={align} data-marquee={String(marquee)}>
      <div className="chord-title-header__content">
        {showLeading && (
          <div
            className="chord-title-header__leading"
            data-leading-type={resolvedLeadingType}
            data-requested-leading-type={leadingType}
          >
            {leadingSlot ?? defaultLeading}
          </div>
        )}

        <div className="chord-title-header__text-area">
          <div className="chord-title-header__title-row">
            <span className="chord-title-header__title">{titleLabel}</span>
            {showTitleMultiple && multipleTitleSlot && (
              <span className="chord-title-header__title-multiple">{multipleTitleSlot}</span>
            )}
            {showTitleBadge && (
              <span className="chord-title-header__title-badge">
                {showBadge1 && (badge1Slot ?? <ChordIcon name="nullMedium" size={12} />)}
                {showBadge2 && (badge2Slot ?? <ChordIcon name="nullMedium" size={12} />)}
              </span>
            )}
          </div>

          {showSubTitle && (
            <div className="chord-title-header__subtitle-area">
              {showSubTitleMultiple ? (
                <>
                  {multipleSubTitleSlot}
                  {multipleSlot}
                </>
              ) : (
                <>
                  <span className="chord-title-header__subtitle">{subTitleLabel}</span>
                  {showSubBadge && (subBadgeSlot ?? <ChordIcon name="nullMedium" size={12} />)}
                </>
              )}
            </div>
          )}
        </div>

        {showTrailing && (
          <div
            className="chord-title-header__trailing"
            data-show-trailing-icon={String(showTrailingIcon)}
            data-show-trailing-text={String(showTrailingText)}
            data-trailing-type={trailingType}
          >
            {trailingSlot ?? (
              <>
            {showTrailingText && trailingLabel && (
              <span className="chord-title-header__trailing-label">{trailingLabel}</span>
            )}
            {showTrailingIcon && <ChordIcon name={trailingIconName} size={20} />}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
