import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Avatar, ChordIcon, BottomNavigation } from "@chord-ds/components";
import type { BottomNavigationTab } from "@chord-ds/components";
import WeverseNavBar from "../WeverseNavBar";
import partyIcon from "../../assets/figma/weverse-myfeed/tab-party-icon.svg";
import officialBadgeSvg from "../../assets/figma/weverse-myfeed/official-badge.svg";
import shopIconSvg from "../../assets/figma/weverse-myfeed/tab-bar-shop.svg";
// LIVE banner thumbnail (Yeonjun selfie, Figma node 2:2245)
import liveThumb from "../../assets/figma/weverse-myfeed/live-yeonjun.png";
// Moment thumbnails
import moment0 from "../../assets/figma/weverse-myfeed/raw-02.png";
import moment1 from "../../assets/figma/weverse-myfeed/raw-03.png";
import moment2 from "../../assets/figma/weverse-myfeed/raw-04.png";
import moment3 from "../../assets/figma/weverse-myfeed/raw-05.png";
import moment4 from "../../assets/figma/weverse-myfeed/raw-06.png";
import moment5 from "../../assets/figma/weverse-myfeed/raw-07.png";
import moment6 from "../../assets/figma/weverse-myfeed/raw-08.png";
// Shop product images (BAMGUT plush set + mini cards)
import shopHero from "../../assets/figma/weverse-myfeed/shop-hero-bamgut.png";
import shopCard1 from "../../assets/figma/weverse-myfeed/shop-card-photobook.png";
import shopCard2 from "../../assets/figma/weverse-myfeed/shop-card-7thyear.png";
import shopCard3 from "../../assets/figma/weverse-myfeed/shop-card-coaster.png";
// Notice artist avatar
import noticeArtistAvatar from "../../assets/figma/weverse-myfeed/notice-artist-avatar.jpg";
import "./styles.css";

// ── Data ──────────────────────────────────────────────────────────────────

const TABS = [
  { label: "My Feed" },
  { label: "Discover" },
  { label: "Party", icon: partyIcon },
  { label: "Spot" },
] as const;

const LIVE_STATS = [
  { label: "재생 327K" },
  { label: "좋아요 2.9M" },
  { label: "채팅 82.4K" },
] as const;

const MOMENTS = [
  { name: "수빈", img: moment0, badgeDot: true },
  { name: "연준", img: moment1, badgeDot: false },
  { name: "범규", img: moment2, badgeDot: false },
  { name: "정원", img: moment3, badgeDot: false },
  { name: "정원", img: moment4, badgeDot: false },
  { name: "정원", img: moment5, badgeDot: false },
  { name: "정원", img: moment6, badgeDot: false },
] as const;

// ── Sub-components ─────────────────────────────────────────────────────────

// ponytail: local tabsRow — chord Tabs doesn't support mixed icon+text tabs (Party logo)
function TabsRow({ selected, onChange, stickyTop }: { selected: number; onChange: (i: number) => void; stickyTop: number }) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [slider, setSlider] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const el = tabRefs.current[selected];
    if (el) setSlider({ left: el.offsetLeft, width: el.offsetWidth });
  }, [selected]);

  return (
    <div className="wmf__tabs-row" role="tablist" style={{ top: stickyTop }}>
      {TABS.map((tab, i) => (
        <button
          key={tab.label}
          ref={el => { tabRefs.current[i] = el; }}
          role="tab"
          aria-selected={i === selected}
          className="wmf__tab"
          onClick={() => onChange(i)}
          type="button"
        >
          {"icon" in tab
            ? <img src={tab.icon} alt={tab.label} className="wmf__tab-icon" aria-hidden="true" />
            : <span className="wmf__tab-label">{tab.label}</span>
          }
        </button>
      ))}
      <span
        className="wmf__tab-slider"
        aria-hidden="true"
        style={{ transform: `translateX(${slider.left}px)`, width: slider.width }}
      />
    </div>
  );
}

function LiveBanner() {
  return (
    <div className="wmf__live-banner" aria-label="TXT_YEONJUN 뮤뮤 끝 라이브">
      <img src={liveThumb} alt="" className="wmf__live-banner-img" />
      <div className="wmf__live-banner-gradient" aria-hidden="true" />
      <div className="wmf__live-banner-contents">
        <div className="wmf__live-banner-top">
          <span className="wmf__live-badge">LIVE</span>
        </div>
        <div className="wmf__live-banner-bottom">
          <div className="wmf__live-title-area">
            <p className="wmf__live-artist">TXT_YEONJUN</p>
            <p className="wmf__live-title">뮤뮤 끝</p>
          </div>
          <div className="wmf__live-stats" aria-label="라이브 통계">
            {LIVE_STATS.map((s, i) => (
              <span key={s.label} className="wmf__live-stat">
                {i > 0 && <span className="wmf__live-dot" aria-hidden="true">·</span>}
                {s.label}
              </span>
            ))}
            <span className="wmf__live-dot" aria-hidden="true">·</span>
            <span className="wmf__live-cc">CC</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AiBanner({ text }: { text: string }) {
  return (
    <div className="wmf__ai-banner" role="complementary" aria-label="AI 추천">
      <ChordIcon name="aiSpecialMedium" size={20} />
      <span className="wmf__ai-prompt">{text}</span>
    </div>
  );
}

function MomentsSection() {
  return (
    <section className="wmf__moments" aria-label="Moments">
      <h2 className="wmf__moments-title">Moments</h2>
      <div className="wmf__moments-card">
        <div className="wmf__moments-scroll" role="list">
          {MOMENTS.map((m, i) => (
            <div key={i} className="wmf__moment-item" role="listitem">
              <div className="wmf__moment-thumb">
                <img src={m.img} alt={m.name} className="wmf__moment-thumb-img" />
              </div>
              {/* ponytail: wrap Avatar to force 30×30; chord xsmall may vary */}
              <div className="wmf__moment-info">
                <div className="wmf__moment-avatar-wrap">
                  <Avatar
                    mode="default"
                    avatarType="circle"
                    size="xxsmall"
                    badgeDot={m.badgeDot}
                    alt={m.name}
                  />
                </div>
                <span className="wmf__moment-name">{m.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const SHOP_CARDS = [
  { img: shopCard1, name: "TOMORROW X TOGETHER Mini Photo Book" },
  { img: shopCard2, name: "7TH YEAR: A Moment of Stillness in the Th..." },
  { img: shopCard3, name: "TOMORROW X TOGETHER Coaster S..." },
] as const;

function DmSection() {
  return (
    <section className="wmf__dm" aria-label="DM">
      <h2 className="wmf__section-title">DM이 도착했어요</h2>
      <div className="wmf__dm-card">
        <div className="wmf__dm-header">
          <Avatar mode="default" avatarType="circle" size="small" alt="말랑공떡이" />
          <div className="wmf__dm-meta">
            <div className="wmf__dm-name-row">
              <span className="wmf__dm-name">말랑공떡이</span>
              <img src={officialBadgeSvg} alt="" className="wmf__dm-badge" aria-hidden="true" />
            </div>
            <span className="wmf__dm-sub">TOMORROW X TOGETHER · 1시간 전</span>
          </div>
          <span className="wmf__dm-hide">Hide from artis</span>
        </div>
        <div className="wmf__dm-bubble">
          <span className="wmf__dm-message">내일부터는 콘서트 연습이야 😤 힘들겠지만...</span>
        </div>
        <button type="button" className="wmf__dm-more">다른 DM 보기 ↺</button>
      </div>
    </section>
  );
}

function NoticeSection() {
  return (
    <section className="wmf__notice" aria-label="최신 Notice">
      <h2 className="wmf__section-title">최신 Notice</h2>
      <div className="wmf__notice-card">
        <div className="wmf__notice-item">
          <img src={noticeArtistAvatar} alt="TOMORROW X TOGETHER" className="wmf__notice-artist-avatar" />
          <div className="wmf__notice-content">
            <div className="wmf__notice-name-row">
              <span className="wmf__notice-artist">TOMORROW X TOGETHER</span>
              <span className="wmf__notice-time">2시간 전</span>
            </div>
            <span className="wmf__notice-text">
              [NOTICE] TOMORROW X TOGETHER '2026 TXT MOA CON' - 공식 상품 현장...
            </span>
          </div>
        </div>
      </div>
      <AiBanner text="놓친 공지사항은 없는지 확인해보세요" />
    </section>
  );
}

function ShopSection() {
  return (
    <section className="wmf__shop" aria-label="Weverse Shop">
      <div className="wmf__shop-header">
        <div className="wmf__shop-title-area">
          <div className="wmf__shop-title-row">
            <span className="wmf__shop-title">Weverse Shop</span>
            <img src={officialBadgeSvg} alt="" className="wmf__shop-title-badge" aria-hidden="true" />
          </div>
          <span className="wmf__shop-sub">Inspired by Your Interests</span>
        </div>
        <img src={shopIconSvg} alt="" className="wmf__shop-icon" aria-hidden="true" />
      </div>
      <div className="wmf__shop-hero-card">
        <div className="wmf__shop-hero-img-wrap">
          <span className="wmf__shop-fan-tag">Fan Event</span>
          <img src={shopHero} alt="BAMGUT Plush Set" className="wmf__shop-hero-img" />
        </div>
        <div className="wmf__shop-hero-info">
          <div className="wmf__shop-upcoming-row">
            <span className="wmf__shop-upcoming">Upcoming</span>
            <span className="wmf__shop-days">12 days left</span>
          </div>
          <span className="wmf__shop-product-name">TOMORROW X TOGETHER [BEOMGYU] BAMGUT Plush Set</span>
          <div className="wmf__shop-tags-row">
            <span className="wmf__shop-tag">한정수량</span>
            <span className="wmf__shop-tag">정전세금</span>
          </div>
        </div>
      </div>
      <div className="wmf__shop-cards" role="list">
        {SHOP_CARDS.map((p, i) => (
          <div key={i} className="wmf__shop-card" role="listitem">
            <div className="wmf__shop-card-img-wrap">
              <span className="wmf__shop-fan-tag">Fan Event</span>
              <img src={p.img} alt={p.name} className="wmf__shop-card-img" />
            </div>
            <span className="wmf__shop-card-name">{p.name}</span>
          </div>
        ))}
      </div>
      <button type="button" className="wmf__shop-more">WEVERSE Shop 더보기 &gt;</button>
    </section>
  );
}

// ── Main screen ────────────────────────────────────────────────────────────

const STATUS_BAR_HEIGHT = 50; // Figma-frozen: statusBarHeight
const NAV_HEIGHT = 48; // Figma-frozen: top nav height

export default function WeverseMyFeed() {
  const [activeTab, setActiveTab] = useState(0);
  const [navTab, setNavTab] = useState<BottomNavigationTab>("home");
  const [navHidden, setNavHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastScrollY.current && y > NAV_HEIGHT) setNavHidden(true);
      else if (y < lastScrollY.current) setNavHidden(false);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="wmf" data-screen="weverse-myfeed">
      {/* ponytail: 50px status bar spacer — matches Figma frame which includes status bar */}
      <div className="wmf__status-bar" aria-hidden="true" />
      <div className={`wmf__topnav${navHidden ? " wmf__topnav--hidden" : ""}`}>
        <WeverseNavBar />
      </div>
      <TabsRow selected={activeTab} onChange={setActiveTab} stickyTop={navHidden ? 0 : STATUS_BAR_HEIGHT + NAV_HEIGHT} />
      <main className="wmf__main">
        <LiveBanner />
        <AiBanner text="작년에는 어떤 라이브가 진행되었을까요?" />
        <MomentsSection />
        <DmSection />
        <NoticeSection />
        <ShopSection />
      </main>
      <div className="wmf__bnav-wrapper">
        <BottomNavigation
          activeTab={navTab}
          onTabChange={setNavTab}
          showSystem={false}
        />
      </div>
    </div>
  );
}
