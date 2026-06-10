import { Chips } from "../Chips/Chips";
import { BadgeDot } from "../BadgeDot/BadgeDot";
import { ChordIcon } from "../../assets/chord-icons";
import "./Tabs.css";

export type TabsMode = "default" | "fixed";
export type TabsStyle = "bar" | "chip";
export type TabsType = "fixed" | "scrollable" | "expand";
export type TabsSize = "medium" | "small-only-chips" | "small";

export const tabsModeOptions: TabsMode[] = ["default", "fixed"];
export const tabsStyleOptions: TabsStyle[] = ["bar", "chip"];
export const tabsTypeOptions: TabsType[] = ["fixed", "scrollable", "expand"];
export const tabsSizeOptions: TabsSize[] = ["medium", "small-only-chips", "small"];

export type TabsResolvedVariant = {
  style: TabsStyle;
  type: TabsType;
  size: TabsSize;
};

export type TabsValidCombination = TabsResolvedVariant & {
  mode: TabsMode;
};

const tabsValidBranches: TabsResolvedVariant[] = [
  { style: "bar", type: "fixed", size: "medium" },
  { style: "bar", type: "scrollable", size: "medium" },
  { style: "chip", type: "fixed", size: "medium" },
  { style: "chip", type: "fixed", size: "small-only-chips" },
  { style: "chip", type: "scrollable", size: "medium" },
  { style: "chip", type: "scrollable", size: "small-only-chips" },
  { style: "chip", type: "expand", size: "medium" },
  { style: "chip", type: "expand", size: "small" },
];

export const tabsValidCombinations: TabsValidCombination[] = tabsModeOptions.flatMap((mode) =>
  tabsValidBranches.map((branch) => ({ mode, ...branch })),
);

export function resolveTabsVariant({
  size,
  style,
  type,
}: {
  style: TabsStyle;
  type: TabsType;
  size: TabsSize;
}): TabsResolvedVariant {
  if (style === "bar") {
    return {
      style,
      type: type === "scrollable" ? "scrollable" : "fixed",
      size: "medium",
    };
  }

  if (type === "expand") {
    return {
      style,
      type,
      size: size === "small" || size === "small-only-chips" ? "small" : "medium",
    };
  }

  return {
    style,
    type,
    size: size === "small" ? "small-only-chips" : size,
  };
}

export type TabsProps = {
  mode?: TabsMode;
  style?: TabsStyle;
  type?: TabsType;
  size?: TabsSize;
  tabItems?: string[];
  selectedIndex?: number;
  onTabChange?: (index: number) => void;
  barBadge?: boolean;
  showExpandButton?: boolean;
  scrollMoreSize?: "medium" | "small";
  scrollMoreState?: "spread" | "fold";
};

export function Tabs({
  mode = "default",
  style = "bar",
  type = "fixed",
  size = "medium",
  tabItems = ["Tab 1", "Tab 2", "Tab 3", "Tab 4"],
  selectedIndex = 0,
  onTabChange,
  barBadge = false,
  showExpandButton = true,
  scrollMoreSize = "small",
  scrollMoreState = "spread",
}: TabsProps) {
  const normalized = resolveTabsVariant({ style, type, size });
  const isChip = normalized.style === "chip";
  const isExpand = normalized.type === "expand";
  const isScrollable = normalized.type === "scrollable";

  const chipItems = tabItems.map((label, i) => (
    <span
      key={i}
      className="chord-tabs__chip-item"
      data-selected={i === selectedIndex}
    >
      <Chips
        label={label}
        mode={mode}
        size={normalized.size === "medium" ? "medium" : "small"}
        state={i === selectedIndex ? "filled-selected" : "default"}
        onClick={() => onTabChange?.(i)}
      />
    </span>
  ));

  return (
    <div
      className="chord-tabs"
      data-mode={mode}
      data-requested-size={size}
      data-requested-style={style}
      data-requested-type={type}
      data-size={normalized.size}
      data-style={normalized.style}
      data-type={normalized.type}
    >
      {isChip ? (
        <>
          <div className="chord-tabs__chip-row">
            {isScrollable ? (
              <div className="chord-tabs__chip-scroll">
                <div className="chord-tabs__chip-items">{chipItems}</div>
              </div>
            ) : isExpand ? (
              <div className="chord-tabs__chip-col">
                <div className="chord-tabs__chip-items">{chipItems}</div>
              </div>
            ) : (
              <div className="chord-tabs__chip-items">{chipItems}</div>
            )}
            {isExpand && showExpandButton && (
              <button
                className="chord-tabs__expand-btn"
                data-scroll-more-size={scrollMoreSize}
                data-scroll-more-state={scrollMoreState}
                type="button"
                aria-label="expand tabs"
              >
                <ChordIcon name="arrowDownMedium" size={16} />
              </button>
            )}
            {isScrollable && (
              <button
                className="chord-tabs__scroll-btn"
                data-scroll-more-size={scrollMoreSize}
                data-scroll-more-state={scrollMoreState}
                type="button"
                aria-label="more tabs"
              >
                <ChordIcon name="arrowDownMedium" size={16} />
              </button>
            )}
          </div>
          {isExpand && (
            <span
              aria-hidden="true"
              className="chord-tabs__expand-gradient"
              data-state={scrollMoreState}
            />
          )}
        </>
      ) : (
        <>
          <div className="chord-tabs__bar-items">
            {tabItems.map((label, i) => (
              <button
                key={i}
                className="chord-tabs__bar-item"
                data-selected={i === selectedIndex}
                onClick={() => onTabChange?.(i)}
                type="button"
              >
                <span className="chord-tabs__bar-label">{label}</span>
                {barBadge && (
                  <span className="chord-tabs__bar-badge" aria-hidden="true">
                    <BadgeDot mode={mode} outline="off" size="small" />
                  </span>
                )}
                {i === selectedIndex && <span className="chord-tabs__bar-indicator" />}
              </button>
            ))}
          </div>
          <div className="chord-tabs__bar-line" />
        </>
      )}
    </div>
  );
}
