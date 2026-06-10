import type { HTMLAttributes, ReactNode } from "react";
import { ChordIcon } from "../../assets/chord-icons";
import "./Search.css";

export type SearchMode = "default" | "fixed";
export type SearchState = "default" | "enabled" | "completed";

export interface SearchProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  clearIconSlot?: ReactNode;
  label?: string;
  mode?: SearchMode;
  onClear?: () => void;
  searchIconSlot?: ReactNode;
  state?: SearchState;
}

export function Search({
  className,
  clearIconSlot,
  label = "Search",
  mode = "default",
  onClear,
  searchIconSlot,
  state = "default",
  ...divProps
}: SearchProps) {
  const classNames = ["chord-search", className].filter(Boolean).join(" ");
  const clearVisible = state === "enabled" || state === "completed";

  return (
    <div
      {...divProps}
      aria-label={label}
      className={classNames}
      data-clear-visible={String(clearVisible)}
      data-mode={mode}
      data-state={state}
      role="search"
    >
      <span className="chord-search__icon" aria-hidden={searchIconSlot ? undefined : "true"}>
        {searchIconSlot ?? <ChordIcon data-testid="search-icon" name="searchMedium" size={16} />}
      </span>
      <span className="chord-search__label">{label}</span>
      {clearVisible ? (
        <button className="chord-search__clear" onClick={onClear} type="button" aria-label="Clear search">
          {clearIconSlot ?? (
            <span className="chord-search__clear-asset" aria-hidden="true">
              <ChordIcon
                className="chord-search__clear-glyph"
                data-testid="clear-icon"
                name="deleteMedium"
                size={18}
              />
            </span>
          )}
        </button>
      ) : null}
    </div>
  );
}
