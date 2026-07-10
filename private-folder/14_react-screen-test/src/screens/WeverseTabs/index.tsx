import { useState } from "react";
import partyIcon from "../../assets/figma/weverse-myfeed/tab-party-icon.svg";
import "./styles.css";

const tabs = [
  { label: "My Feed" },
  { label: "Lounge" },
  { icon: partyIcon, label: "Party" },
  { label: "Spot" },
] as const;

export default function WeverseTabs() {
  const [selected, setSelected] = useState(1);

  return (
    <div className="wt" data-screen="weverse-tabs">
      <div className="wt__row" role="tablist">
        {tabs.map((tab, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === selected}
            className={`wt__tab${i === selected ? " wt__tab--active" : ""}`}
            onClick={() => setSelected(i)}
            type="button"
          >
            {"icon" in tab ? (
              <img src={tab.icon} alt={tab.label} className="wt__tab-icon" />
            ) : (
              <>
                <span className="wt__tab-label">{tab.label}</span>
                <span className="wt__tab-indicator" aria-hidden="true" />
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
