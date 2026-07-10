import liveVideo from "../../../assets/figma/my-feed-v2/live-video.png";
import officialBadge from "../../../assets/figma/my-feed-v2/official-badge.svg";
import "./OnLive.css";

const LIVE_STATS = [
  { label: "재생", value: "327K" },
  { label: "좋아요", value: "2.9M" },
  { label: "채팅", value: "82.4K" },
] as const;

export default function OnLive() {
  return (
    <div className="wmfv2__live__outer" aria-label="TXT_YEONJUN 뮤뮤 끝 라이브">
      <div className="wmfv2__live__card">
        <img src={liveVideo} alt="" className="wmfv2__live__thumb" />
        <div className="wmfv2__live__gradient" aria-hidden="true" />
        <div className="wmfv2__live__contents">
          {/* Top: LIVE badge */}
          <div className="wmfv2__live__top">
            <span className="wmfv2__live__badge">LIVE</span>
          </div>

          {/* Bottom: artist + title + stats */}
          <div className="wmfv2__live__bottom">
            <div className="wmfv2__live__artist-row">
              <span className="wmfv2__live__artist">TXT_YEONJUN</span>
              <img src={officialBadge} alt="" className="wmfv2__live__official" aria-hidden="true" />
            </div>
            <span className="wmfv2__live__title">뮤뮤 끝</span>
            <div className="wmfv2__live__stats" aria-label="라이브 통계">
              {LIVE_STATS.map((s, i) => (
                <span key={s.label} className="wmfv2__live__stat-item">
                  {i > 0 && <span className="wmfv2__live__sep" aria-hidden="true">·</span>}
                  <span className="wmfv2__live__stat-label">{s.label} </span>
                  <span className="wmfv2__live__stat-value">{s.value}</span>
                </span>
              ))}
              <span className="wmfv2__live__sep" aria-hidden="true">·</span>
              <span className="wmfv2__live__cc">CC</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
