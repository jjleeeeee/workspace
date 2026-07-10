import { useState } from "react";
import Lottie from "lottie-react";
import { ChordIcon } from "@chord-ds/components";
import LiquidGlassFilter from "./LiquidGlassFilter";
import fabIconData from "../../assets/lottiefiles/AI_FAB/fab_icon.json";
import fabBg from "../../assets/lottiefiles/AI_FAB/bg@2x.png";
import "./styles.css";

type TabId = "home" | "shop" | "dm" | "more";

const tabs: Array<{
  id: TabId;
  label: string;
  enabledIcon: Parameters<typeof ChordIcon>[0]["name"];
  disabledIcon: Parameters<typeof ChordIcon>[0]["name"];
}> = [
  { id: "home", label: "Home", enabledIcon: "gnbHomeEnabledMedium",  disabledIcon: "gnbHomeDisabledMedium"  },
  { id: "shop", label: "Shop", enabledIcon: "gnbShopEnabledMedium",  disabledIcon: "gnbShopDisabledMedium"  },
  { id: "dm",   label: "DM",   enabledIcon: "gnbDmEnabledMedium",    disabledIcon: "gnbDmDisabledMedium"    },
  { id: "more", label: "More", enabledIcon: "gnbMoreEnabledMedium",  disabledIcon: "gnbMoreDisabledMedium"  },
];

export default function WeverseBottomNav() {
  const [selected, setSelected] = useState<TabId>("home");
  const selectedIndex = tabs.findIndex((t) => t.id === selected);

  return (
    <div className="wbn" data-screen="weverse-bottom-nav">
      <LiquidGlassFilter />
      {/* Gradient fade above bar */}
      <div className="wbn__gradient" aria-hidden="true" />

      <div className="wbn__bar">
        {/* Tab buttons glass pill */}
        <div className="wbn__tabs" role="tablist">
          {/* Glass pill background */}
          <div className="wbn__tabs-glass" aria-hidden="true" />
          {/* Sliding active indicator */}
          <span
            className="wbn__tab-indicator"
            aria-hidden="true"
            style={{ transform: `translateX(${selectedIndex * 100}%)` }}
          />

          {tabs.map((tab) => {
            const isActive = selected === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                className={`wbn__tab${isActive ? " wbn__tab--active" : ""}`}
                onClick={() => setSelected(tab.id)}
                type="button"
              >
                <ChordIcon
                  name={isActive ? tab.enabledIcon : tab.disabledIcon}
                  size={28}
                />
                <span className="wbn__tab-label">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search FAB — Liquid Glass base + PNG color blend + Lottie */}
        <button className="wbn__search" aria-label="커뮤니티 검색" type="button">
          <span className="wbn__search-glass" aria-hidden="true" />
          <img className="wbn__search-bg" src={fabBg} alt="" aria-hidden="true" />
          <Lottie
            animationData={fabIconData}
            loop
            className="wbn__search-lottie"
          />
        </button>
      </div>
    </div>
  );
}
