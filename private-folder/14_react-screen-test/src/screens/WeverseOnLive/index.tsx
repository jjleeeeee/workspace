import { useState } from "react";
import { Avatar, PaginationDot, type PaginationDotCount, type PaginationDotSelection } from "@chord-ds/components";
import slotTrailingIcon from "../../assets/figma/weverse-myfeed/slot-trailing-icon.svg";
import officialBadge from "../../assets/figma/weverse-myfeed/official-badge.svg";
import onLiveContent1 from "../../assets/figma/weverse-myfeed/raw-01.png";
import onLiveContent2 from "../../assets/figma/weverse-myfeed/raw-20.png";
import onLiveContent3 from "../../assets/figma/weverse-myfeed/raw-13.png";
import "./styles.css";

const contentImages = [onLiveContent1, onLiveContent2, onLiveContent3] as const;

type CardHeaderProps = { name: string; group: string };

function CardHeader({ name, group }: CardHeaderProps) {
  return (
    <div className="wol__card-header">
      <div className="wol__leading">
        <Avatar mode="default" avatarType="circle" size="xsmall" />
        <span className="wol__live-badge">LIVE</span>
      </div>
      <div className="wol__card-text">
        <p className="wol__card-name">{name}</p>
        <div className="wol__card-meta">
          <span className="wol__card-group">{group}</span>
          <img src={officialBadge} alt="" className="wol__official-badge" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

export default function WeverseOnLive() {
  const [activeDot, setActiveDot] = useState(0);

  return (
    <div className="wol" data-screen="weverse-on-live">
      {/* Section header */}
      <div className="wol__header">
        <div className="wol__header-text">
          <p className="wol__title">ON LIVE</p>
          <p className="wol__subtitle">Subtitle</p>
        </div>
        <div className="wol__trailing" aria-hidden="true">
          <img src={slotTrailingIcon} alt="" />
        </div>
      </div>

      {/* Card */}
      <div className="wol__card-wrap">
        <div className="wol__card">
          {/* Top live stream */}
          <div className="wol__top-header">
            <CardHeader name="2!3!werbts..." group="TXT" />
          </div>

          {/* Content thumbnail */}
          <div
            className="wol__content"
            aria-label="ON LIVE 콘텐츠"
          >
            {contentImages.map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className={`wol__content-img${i === activeDot ? " wol__content-img--active" : ""}`}
                aria-hidden={i !== activeDot}
              />
            ))}
            <div className="wol__content-dots">
              <PaginationDot
                mode="fixed"
                dots={`${contentImages.length}` as PaginationDotCount}
                selection={(activeDot + 1) as PaginationDotSelection}
                onClick={() => setActiveDot((activeDot + 1) % contentImages.length)}
              />
            </div>
          </div>

          {/* Bottom live stream */}
          <div className="wol__bottom-header">
            <CardHeader name="휴닝카이" group="TOMORROW X TOGETHER" />
          </div>
        </div>
      </div>
    </div>
  );
}
