import { type ReactNode } from "react";
import Lottie from "lottie-react";
import { ChordIcon } from "../../assets/chord-icons";
import LiquidGlassFilter from "./LiquidGlassFilter";
import fabIconData from "../../assets/lottie-fab/fab_icon.json";
import fabBg from "../../assets/lottie-fab/fab_bg_color.png";
import "./BottomNavigation.css";

type ChordIconName = Parameters<typeof ChordIcon>[0]["name"];

export type BottomNavigationMode = "default" | "fixed";
export type BottomNavigationOS = "ios" | "android";
export type BottomNavigationTab = "home" | "shop" | "dm" | "more";

export const bottomNavigationModeOptions: BottomNavigationMode[] = ["default", "fixed"];
export const bottomNavigationOSOptions: BottomNavigationOS[] = ["ios", "android"];
export const bottomNavigationTabOptions: BottomNavigationTab[] = ["home", "shop", "dm", "more"];

export const bottomNavigationValidCombinations = bottomNavigationModeOptions.flatMap((mode) =>
  bottomNavigationOSOptions.map((os) => ({ mode, os })),
);

export type BottomNavigationProps = {
  mode?: BottomNavigationMode;
  os?: BottomNavigationOS;
  activeTab?: BottomNavigationTab;
  showSystem?: boolean;
  onTabChange?: (tab: BottomNavigationTab) => void;
  fabSlot?: ReactNode;
};

const TAB_LABELS: Record<BottomNavigationTab, string> = {
  home: "Home",
  shop: "Shop",
  dm: "DM",
  more: "More",
};

const TAB_ICONS: Record<BottomNavigationTab, [ChordIconName, ChordIconName]> = {
  home: ["gnbHomeEnabledMedium", "gnbHomeDisabledMedium"],
  shop: ["gnbShopEnabledMedium", "gnbShopDisabledMedium"],
  dm:   ["gnbDmEnabledMedium",   "gnbDmDisabledMedium"],
  more: ["gnbMoreEnabledMedium", "gnbMoreDisabledMedium"],
};

const TABS = Object.keys(TAB_LABELS) as BottomNavigationTab[];

export function BottomNavigation({
  mode = "default",
  os = "ios",
  activeTab = "home",
  showSystem = true,
  onTabChange,
  fabSlot,
}: BottomNavigationProps) {
  const activeIndex = TABS.indexOf(activeTab);

  return (
    <div
      className="chord-bottom-navigation"
      data-mode={mode}
      data-os={os}
    >
      <LiquidGlassFilter />
      <div className="chord-bottom-navigation__gradient" aria-hidden="true" />

      <div className="chord-bottom-navigation__bar">
        <div className="chord-bottom-navigation__tabs" role="tablist">
          <div className="chord-bottom-navigation__tabs-glass" aria-hidden="true" />
          <span
            className="chord-bottom-navigation__tab-indicator"
            aria-hidden="true"
            style={{ transform: `translateX(${activeIndex * 100}%)` }}
          />
          {TABS.map((tab) => {
            const isActive = tab === activeTab;
            const [on, off] = TAB_ICONS[tab];
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`chord-bottom-navigation__tab${isActive ? " chord-bottom-navigation__tab--active" : ""}`}
                onClick={() => onTabChange?.(tab)}
              >
                <ChordIcon name={isActive ? on : off} size={24} />
                <span className="chord-bottom-navigation__tab-label" data-label={TAB_LABELS[tab]}>
                  {TAB_LABELS[tab]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="chord-bottom-navigation__fab">
          {fabSlot ?? <DefaultFab />}
        </div>
      </div>

      {showSystem && (
        <div className="chord-bottom-navigation__system">
          {os === "ios" ? (
            <div className="chord-bottom-navigation__home-indicator" />
          ) : (
            <div className="chord-bottom-navigation__android-nav">
              <div className="chord-bottom-navigation__android-btn" />
              <div className="chord-bottom-navigation__android-btn" />
              <div className="chord-bottom-navigation__android-btn" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DefaultFab() {
  return (
    <button
      type="button"
      className="chord-bottom-navigation__fab-btn"
      aria-label="커뮤니티 검색"
    >
      <img src={fabBg} alt="" aria-hidden="true" className="chord-bottom-navigation__fab-bg" />
      <span className="chord-bottom-navigation__fab-glass" aria-hidden="true" />
      <Lottie
        animationData={fabIconData}
        loop
        className="chord-bottom-navigation__fab-lottie"
      />
    </button>
  );
}
