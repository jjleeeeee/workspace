import { useState } from "react";
import { PaginationDot, type PaginationDotCount, type PaginationDotSelection } from "@chord-ds/components";
import bannerBg1 from "../../assets/figma/weverse-myfeed/banner-main.png";
import bannerBg2 from "../../assets/figma/weverse-myfeed/raw-01.png";
import bannerBg3 from "../../assets/figma/weverse-myfeed/img-14.png";
import bannerBg4 from "../../assets/figma/weverse-myfeed/img-07.png";
import bannerBg5 from "../../assets/figma/weverse-myfeed/img-19.png";
import lineAdArt from "../../assets/figma/weverse-myfeed/img-06.png";
import "./styles.css";

const slides = [
  { bg: bannerBg1, artist: "ENHYPEN", title: "ENHYPEN POP-UP in SYDNEY'Found Heaven", subtitle: "Check it out now!" },
  { bg: bannerBg2, artist: "TXT", title: "TXT Special Event", subtitle: "Check it out now!" },
  { bg: bannerBg3, artist: "BTS", title: "BTS World Tour Update", subtitle: "Check it out now!" },
  { bg: bannerBg4, artist: "SEVENTEEN", title: "SEVENTEEN New Release", subtitle: "Check it out now!" },
  { bg: bannerBg5, artist: "IVE", title: "IVE Fan Meeting", subtitle: "Check it out now!" },
] as const;

export default function WeverseBanner() {
  const [active, setActive] = useState(0);
  const slide = slides[active];

  return (
    <div className="wb" data-screen="weverse-banner">
      <div className="wb__inner">
        {/* Main banner */}
        <div className="wb__main">
          <img src={slide.bg} alt="" className="wb__bg" />
          <div className="wb__gradient" aria-hidden="true" />
          <div className="wb__pagination-num" aria-label={`${active + 1} / ${slides.length}`}>
            <span className="wb__pn-front">{String(active + 1).padStart(2, "0")}</span>
            <span className="wb__pn-line" aria-hidden="true" />
            <span className="wb__pn-back">{String(slides.length).padStart(2, "0")}</span>
          </div>
          <div className="wb__bottom">
            <span className="wb__badge">{slide.artist}</span>
            <div className="wb__text">
              <p className="wb__title">{slide.title}</p>
              <p className="wb__subtitle">{slide.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Line ad */}
        <div className="wb__ad" role="complementary" aria-label="광고">
          <div className="wb__ad-left">
            <p className="wb__ad-title">더 맛있어진 코-크 제로!</p>
            <p className="wb__ad-subtitle">뷔와 함께 짜릿한 코카콜라 제로 어때?</p>
          </div>
          <div className="wb__ad-right">
            <img src={lineAdArt} alt="" className="wb__ad-img" aria-hidden="true" />
            <span className="wb__ad-tag" aria-label="광고">AD</span>
          </div>
        </div>
      </div>

      {/* Dot pagination */}
      <div className="wb__dots">
        <PaginationDot
          mode="default"
          dots={`${slides.length}` as PaginationDotCount}
          selection={(active + 1) as PaginationDotSelection}
          onClick={() => setActive((active + 1) % slides.length)}
        />
      </div>
    </div>
  );
}
