import { Avatar } from "@chord-ds/components";
import merchBadge from "../../../assets/figma/my-feed-v2/merch-badge.svg";
import merchFcHero from "../../../assets/figma/my-feed-v2/merch-fc-hero.svg";
import merchUpcomingIcon from "../../../assets/figma/my-feed-v2/merch-upcoming-icon.svg";
import merchFcCard from "../../../assets/figma/my-feed-v2/merch-fc-card.svg";
import merchHero from "../../../assets/figma/my-feed-v2/merch-hero-bamgut.png";
import merchCardPhotobook from "../../../assets/figma/my-feed-v2/merch-card-photobook.png";
import merchCard7thYear from "../../../assets/figma/my-feed-v2/merch-card-7thyear.png";
import merchCardCoaster from "../../../assets/figma/my-feed-v2/merch-card-coaster.png";
import "./MerchSlot.css";

const SHOP_CARDS = [
  { img: merchCardPhotobook, artist: "TOMORROW X TOGETHER", name: "Mini Photo Book" },
  { img: merchCard7thYear, artist: "TOMORROW X TOGETHER", name: "7TH YEAR: A Moment of Stillness in the Th..." },
  { img: merchCardCoaster, artist: "TOMORROW X TOGETHER", name: "Coaster Set" },
] as const;

export default function MerchSlot() {
  return (
    <section className="wmfv2__merch" aria-label="Weverse Shop">
      <div className="wmfv2__merch__card">

        {/* 1. Header */}
        <div className="wmfv2__merch__header">
          <div className="wmfv2__merch__header-avatar">
            <Avatar mode="default" avatarType="circle" size="xxsmall" alt="Weverse Shop" ring={false} />
          </div>
          <div className="wmfv2__merch__header-text">
            <div className="wmfv2__merch__header-title-row">
              <span className="wmfv2__merch__header-title">Weverse Shop</span>
              <img src={merchBadge} alt="" className="wmfv2__merch__header-badge" aria-hidden="true" />
            </div>
            <span className="wmfv2__merch__header-sub">Inspired by Your Interests</span>
          </div>
        </div>

        {/* 2. Hero image */}
        <div className="wmfv2__merch__hero-wrap">
          <div className="wmfv2__merch__hero-img-container">
            <img src={merchHero} alt="BAMGEUT Plush Set" className="wmfv2__merch__hero-img" />
            <div className="wmfv2__merch__hero-overlay" aria-hidden="true" />
            <div className="wmfv2__merch__hero-corner-badges" aria-hidden="true">
              <img src={merchFcHero} alt="" className="wmfv2__merch__hero-fav-icon" />
              <span className="wmfv2__merch__hero-fc-tag">Fan Event</span>
            </div>
            <div className="wmfv2__merch__hero-bottom-bar">
              <div className="wmfv2__merch__hero-bottom-left">
                <img src={merchUpcomingIcon} alt="" className="wmfv2__merch__hero-bottom-badge" aria-hidden="true" />
                <span className="wmfv2__merch__hero-upcoming">Upcoming</span>
              </div>
              <span className="wmfv2__merch__hero-days">12 days left</span>
            </div>
          </div>
        </div>

        {/* 3. Product info */}
        <div className="wmfv2__merch__product-info">
          <span className="wmfv2__merch__product-artist">TOMORROW X TOGETHER</span>
          <span className="wmfv2__merch__product-name">[BEOMGYU] BAMGEUT Plush Set</span>
        </div>

        {/* 4. Tags */}
        <div className="wmfv2__merch__tags">
          <span className="wmfv2__merch__tag">한정수량</span>
          <span className="wmfv2__merch__tag">독점재공</span>
        </div>

        {/* 5. Horizontal product list */}
        <div className="wmfv2__merch__product-list" role="list">
          {SHOP_CARDS.map((c, i) => (
            <div key={i} className="wmfv2__merch__product-card" role="listitem">
              <div className="wmfv2__merch__product-card-img-wrap">
                <img src={c.img} alt={c.name} className="wmfv2__merch__product-card-img" />
                <div className="wmfv2__merch__product-card-overlay" aria-hidden="true">
                  <img src={merchFcCard} alt="" className="wmfv2__merch__product-card-fc-icon" />
                  <span className="wmfv2__merch__product-card-fc-tag">Fan Event</span>
                </div>
              </div>
              <span className="wmfv2__merch__product-card-artist">{c.artist}</span>
              <span className="wmfv2__merch__product-card-name">{c.name}</span>
            </div>
          ))}
        </div>

        {/* 6. Footer */}
        <div className="wmfv2__merch__footer">
          <button type="button" className="wmfv2__merch__more-btn">
            WEVERSE Shop 더보기 &gt;
          </button>
        </div>

      </div>
    </section>
  );
}
