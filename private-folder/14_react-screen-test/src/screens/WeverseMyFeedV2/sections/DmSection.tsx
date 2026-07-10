import { Avatar, TextButton } from "@chord-ds/components";
import officialBadge from "../../../assets/figma/my-feed-v2/dm-official-badge.svg";
import dmAvatar from "../../../assets/figma/my-feed-v2/dm-avatar.png";
import "./DmSection.css";

export default function DmSection() {
  return (
    <section className="wmfv2__dm">
      <span className="wmfv2__dm__title">DM이 도착했어요</span>

      <div className="wmfv2__dm__card">
        {/* TitleHeader row */}
        <div className="wmfv2__dm__header">
          <Avatar size="small" src={dmAvatar} ring={false} />

          <div className="wmfv2__dm__meta">
            <div className="wmfv2__dm__name-row">
              <span className="wmfv2__dm__name">말랑콩떡이</span>
              <img
                src={officialBadge}
                alt="official"
                className="wmfv2__dm__badge"
              />
            </div>

            <div className="wmfv2__dm__sub-row">
              <span className="wmfv2__dm__sub">TOMORROW X TOGETHER</span>
              <span className="wmfv2__dm__dot">·</span>
              <span className="wmfv2__dm__sub">1시간 전</span>
              <span className="wmfv2__dm__dot">·</span>
              <span className="wmfv2__dm__tag">Hide from artist</span>
              <span className="wmfv2__dm__tag">CC</span>
              <span className="wmfv2__dm__tag">SDH</span>
            </div>
          </div>
        </div>

        {/* Bubble row */}
        <div className="wmfv2__dm__bubble-row">
          <div className="wmfv2__dm__bubble">
            <span className="wmfv2__dm__message">
              내일부터는 콘서트 연습이야 🥹 힘들겠지만 설레
            </span>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="wmfv2__dm__footer">
          <TextButton buttonType="ghost">다른 DM 보기 ↺</TextButton>
        </div>
      </div>
    </section>
  );
}
