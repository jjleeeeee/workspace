import type { ReactNode } from "react";
import { ChordIcon } from "../../assets/chord-icons";
import { Avatar } from "../Avatar/Avatar";
import { Search } from "../Search/Search";
import "./TopNavigation.css";

export type TopNavigationMode = "default" | "fixed";
export type TopNavigationTextType =
  | "default"
  | "left"
  | "center"
  | "search"
  | "img"
  | "img-text"
  | "logo-svg"
  | "logo-svg-center";
export type TopNavigationScrollBg = "on" | "off";
export type TopNavigationLeadingType = "icon-avatar" | "avatar" | "icon";
export type TopNavigationTrailingCount = "1ea" | "2ea" | "3ea" | "lottie";

export const topNavigationModeOptions: TopNavigationMode[] = ["default", "fixed"];
export const topNavigationTextTypeOptions: TopNavigationTextType[] = [
  "default",
  "left",
  "center",
  "search",
  "img",
  "img-text",
  "logo-svg",
  "logo-svg-center",
];
export const topNavigationScrollBgOptions: TopNavigationScrollBg[] = ["on", "off"];
export const topNavigationLeadingTypeOptions: TopNavigationLeadingType[] = ["icon-avatar", "avatar", "icon"];
export const topNavigationTrailingCountOptions: TopNavigationTrailingCount[] = ["1ea", "2ea", "3ea", "lottie"];

export type TopNavigationProps = {
  mode?: TopNavigationMode;
  textType?: TopNavigationTextType;
  scrollBg?: TopNavigationScrollBg;
  marquee?: boolean;
  titleLabel?: string;
  subTitleLabel?: string;
  leadingType?: TopNavigationLeadingType;
  trailingCount?: TopNavigationTrailingCount;
  showSubTitle?: boolean;
  showSubTitleIcon?: boolean;
  showLeading?: boolean;
  showTrailing?: boolean;
  showImage?: boolean;
  showOfficialBadge?: boolean;
  leadingSlot?: ReactNode;
  leadingAvatarSlot?: ReactNode;
  trailingSlot?: ReactNode;
  trailingSlots?: ReactNode[];
  imageSlot?: ReactNode;
  logoSlot?: ReactNode;
};

function DefaultAvatar() {
  return (
    <Avatar
      avatarType="squircle"
      badgeDot={false}
      birthdayHat={false}
      emoji={false}
      host={false}
      ring={false}
      size="xsmall"
    />
  );
}

export function TopNavigation({
  mode = "default",
  textType = "center",
  scrollBg = "off",
  marquee = false,
  titleLabel = "Title",
  subTitleLabel = "SubTitle",
  leadingType = "icon-avatar",
  trailingCount = "1ea",
  showSubTitle = true,
  showSubTitleIcon = true,
  showLeading = true,
  showTrailing = true,
  showImage = true,
  showOfficialBadge = true,
  leadingSlot,
  leadingAvatarSlot,
  trailingSlot,
  trailingSlots,
  imageSlot,
  logoSlot,
}: TopNavigationProps) {
  const isSearch = textType === "search";
  const isLogo = textType === "logo-svg" || textType === "logo-svg-center";
  const isImg = textType === "img" || textType === "img-text";
  const hasLeading = showLeading && !isImg;
  const hasTrailing = showTrailing;
  const trailingItemCount = trailingCount === "3ea" ? 3 : trailingCount === "2ea" ? 2 : 1;
  const defaultLeading = (() => {
    if (leadingSlot) return leadingSlot;
    if (leadingType === "avatar") return leadingAvatarSlot ?? <DefaultAvatar />;
    if (leadingType === "icon") return <ChordIcon name="nullMedium" size={24} />;
    // icon-avatar: icon area (40px hit) + Avatar XSmall (38px) side by side
    return (
      <>
        <span className="chord-top-navigation__leading-icon">
          <ChordIcon name="nullMedium" size={24} />
        </span>
        <span className="chord-top-navigation__leading-avatar">
          {leadingAvatarSlot ?? <DefaultAvatar />}
        </span>
      </>
    );
  })();
  const defaultImage = imageSlot ?? <DefaultAvatar />;
  const defaultLogo = logoSlot ?? (
    <span className="chord-top-navigation__logo-placeholder" data-asset-classification="unknown">
      Logo
    </span>
  );
  const renderTrailingItem = (index: number) => {
    if (trailingCount === "lottie") {
      return (
        <span className="chord-top-navigation__lottie-placeholder" data-asset-classification="unknown">
          Lottie
        </span>
      );
    }

    return trailingSlots?.[index] ?? (index === 0 ? trailingSlot : undefined) ?? (
      <ChordIcon name="nullMedium" size={24} />
    );
  };

  return (
    <div
      className="chord-top-navigation"
      data-leading-type={leadingType}
      data-marquee={String(marquee)}
      data-mode={mode}
      data-text-type={textType}
      data-scroll-bg={scrollBg}
      data-trailing-count={trailingCount}
    >
      {hasLeading && (
        <div className="chord-top-navigation__leading" data-leading-type={leadingType}>
          {defaultLeading}
        </div>
      )}

      {isSearch ? (
        <div className="chord-top-navigation__search">
          <Search />
        </div>
      ) : isLogo ? (
        <div className="chord-top-navigation__logo">{defaultLogo}</div>
      ) : (
        <>
          {isImg && showImage && (
            <div className="chord-top-navigation__image">{defaultImage}</div>
          )}
          <div className="chord-top-navigation__text-area">
            <div className="chord-top-navigation__title-row">
              <span className="chord-top-navigation__title">{titleLabel}</span>
              {showOfficialBadge && (
                <span className="chord-top-navigation__badge">
                  <ChordIcon name="officialBadgeFillMedium" size={12} />
                </span>
              )}
            </div>
            {showSubTitle && textType !== "img" && (
              <span className="chord-top-navigation__subtitle-row">
                {showSubTitleIcon && (
                  <span className="chord-top-navigation__subtitle-icon">
                    <ChordIcon name="nullMedium" size={12} />
                  </span>
                )}
                <span className="chord-top-navigation__subtitle">{subTitleLabel}</span>
              </span>
            )}
          </div>
        </>
      )}

      {hasTrailing && (
        <div className="chord-top-navigation__trailing" data-trailing-count={trailingCount}>
          {Array.from({ length: trailingItemCount }, (_, index) => (
            <span className="chord-top-navigation__trailing-item" key={index}>
              {renderTrailingItem(index)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
