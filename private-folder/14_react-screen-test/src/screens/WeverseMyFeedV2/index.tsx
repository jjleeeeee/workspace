import { useState, useLayoutEffect, useEffect, useRef } from "react";
import { BottomNavigation } from "@chord-ds/components";
import WeverseNavBar from "../WeverseNavBar";
import OnLive from "./sections/OnLive";
import AiBanner from "./sections/AiBanner";
import MediaSlot from "./sections/MediaSlot";
import DmSection from "./sections/DmSection";
import LatestNotice from "./sections/LatestNotice";
import MerchSlot from "./sections/MerchSlot";
import partyIconSrc from "../../assets/figma/my-feed-v2/tab-party-logo.svg";
import "./styles.css";

const TABS = [
  { label: "My Feed" },
  { label: "Discover" },
  { label: "Party", icon: partyIconSrc },
  { label: "Spot" },
] as const;

function TabsRow({
  selected,
  onChange,
  stickyTop,
}: {
  selected: number;
  onChange: (i: number) => void;
  stickyTop: number;
}) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [slider, setSlider] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const el = tabRefs.current[selected];
    if (el) setSlider({ left: el.offsetLeft, width: el.offsetWidth });
  }, [selected]);

  return (
    <div className="wmfv2__tabs" role="tablist" style={{ top: stickyTop }}>
      {TABS.map((tab, i) => (
        <button
          key={tab.label}
          ref={(el) => { tabRefs.current[i] = el; }}
          role="tab"
          aria-selected={i === selected}
          className="wmfv2__tab"
          onClick={() => onChange(i)}
          type="button"
        >
          {"icon" in tab
            ? <img src={tab.icon} alt={tab.label} className="wmfv2__tab-icon" />
            : <span className="wmfv2__tab-label">{tab.label}</span>}
        </button>
      ))}
      <span
        className="wmfv2__tab-slider"
        aria-hidden="true"
        style={{ transform: `translateX(${slider.left}px)`, width: slider.width }}
      />
    </div>
  );
}

const STATUS_BAR_H = 50; // Figma-frozen: iPhone status bar height

function StatusBar() {
  return (
    <div className="wmfv2__status-bar">
      <span className="wmfv2__status-bar__time">9:41</span>
      <div className="wmfv2__status-bar__icons">
        {/* Signal bars */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
          <rect x="0" y="6" width="3" height="6" rx="1" fill="#000"/>
          <rect x="4.5" y="4" width="3" height="8" rx="1" fill="#000"/>
          <rect x="9" y="2" width="3" height="10" rx="1" fill="#000"/>
          <rect x="13.5" y="0" width="3" height="12" rx="1" fill="#000"/>
        </svg>
        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M8 9.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" fill="#000"/>
          <path d="M1.7 5.8A9 9 0 0 1 14.3 5.8" stroke="#000" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          <path d="M4.2 8.3A5 5 0 0 1 11.8 8.3" stroke="#000" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        </svg>
        {/* Battery */}
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="#000" strokeOpacity="0.35"/>
          <rect x="2" y="2" width="17" height="8" rx="2" fill="#000"/>
          <path d="M23 4v4a2 2 0 0 0 0-4z" fill="#000" fillOpacity="0.4"/>
        </svg>
      </div>
    </div>
  );
}

export default function WeverseMyFeedV2() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [navHidden, setNavHidden] = useState(false);
  const lastScrollY = useRef(0);
  const navRef = useRef<HTMLDivElement>(null);
  const [navHeight, setNavHeight] = useState(48);

  // Use window scroll so Playwright window.scrollTo() works for harness diffs
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setNavHidden(y > lastScrollY.current && y > 60);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useLayoutEffect(() => {
    if (navRef.current) setNavHeight(navRef.current.offsetHeight);
  }, []);

  const tabsTop = navHidden ? STATUS_BAR_H : STATUS_BAR_H + navHeight;

  return (
    <div className="wmfv2">
      <StatusBar />

      <div
        ref={navRef}
        className={`wmfv2__topnav${navHidden ? " wmfv2__topnav--hidden" : ""}`}
        style={{ top: STATUS_BAR_H }}
      >
        <WeverseNavBar />
      </div>

      {/* spacer so content starts below fixed status bar + nav */}
      <div style={{ height: STATUS_BAR_H + navHeight }} />

      <TabsRow
        selected={selectedTab}
        onChange={setSelectedTab}
        stickyTop={tabsTop}
      />

      <main className="wmfv2__content">
        <section className="wmfv2__section">
          <OnLive />
        </section>

        <section className="wmfv2__section">
          <AiBanner text="작년에는 어떤 라이브가 진행되었을까요?" />
        </section>

        <section className="wmfv2__section">
          <MediaSlot />
        </section>

        <section className="wmfv2__section">
          <DmSection />
        </section>

        <section className="wmfv2__section">
          <LatestNotice />
        </section>

        <section className="wmfv2__section">
          <AiBanner text="놓친 공지사항은 없는지 확인해보세요" />
        </section>

        <section className="wmfv2__section wmfv2__section--merch">
          <MerchSlot />
        </section>
      </main>

      <div className="wmfv2__bottom-nav-spacer" />

      <div className="wmfv2__bottom-nav">
        <BottomNavigation os="ios" mode="default" />
      </div>
    </div>
  );
}
