import { BadgeDot } from "../BadgeDot/BadgeDot";
import "./Tabs.css";

export type TabsMode = "default" | "fixed";
export type TabsType = "fill" | "swipe";

export const tabsModeOptions: TabsMode[] = ["default", "fixed"];
export const tabsTypeOptions: TabsType[] = ["fill", "swipe"];

export const tabsValidCombinations = tabsModeOptions.flatMap((mode) =>
  tabsTypeOptions.map((type) => ({ mode, type })),
);

export type TabsProps = {
  mode?: TabsMode;
  type?: TabsType;
  tabItems?: string[];
  selectedIndex?: number;
  onTabChange?: (index: number) => void;
  barBadge?: boolean;
};

export function Tabs({
  mode = "default",
  type = "fill",
  tabItems = ["Tab 1", "Tab 2", "Tab 3", "Tab 4"],
  selectedIndex = 0,
  onTabChange,
  barBadge = false,
}: TabsProps) {
  return (
    <div
      className="chord-tabs"
      data-mode={mode}
      data-type={type}
    >
      <div className="chord-tabs__bar-items">
        {tabItems.map((label, i) => (
          <button
            key={i}
            className="chord-tabs__bar-item"
            data-selected={i === selectedIndex}
            onClick={() => onTabChange?.(i)}
            type="button"
          >
            <span className="chord-tabs__bar-text-row">
              <span className="chord-tabs__bar-label">{label}</span>
              {barBadge && (
                <span className="chord-tabs__bar-badge" aria-hidden="true">
                  <BadgeDot mode={mode} outline="off" size="small" />
                </span>
              )}
            </span>
            {i === selectedIndex && <span className="chord-tabs__bar-indicator" />}
          </button>
        ))}
      </div>
      <div className="chord-tabs__bar-line" />
    </div>
  );
}
