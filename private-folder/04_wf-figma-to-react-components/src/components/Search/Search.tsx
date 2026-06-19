import type { HTMLAttributes, ReactNode } from "react";
import { ChordIcon } from "../../assets/chord-icons";
import "./Search.css";

export type SearchMode = "default" | "fixed";
export type SearchState = "default" | "enabled" | "completed";

export interface SearchProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onChange"> {
  clearIconSlot?: ReactNode;
  label?: string;
  mode?: SearchMode;
  onChange?: (value: string) => void;
  onClear?: () => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  searchIconSlot?: ReactNode;
  state?: SearchState;
  value?: string;
}

export function Search({
  className,
  clearIconSlot,
  label = "Search",
  mode = "default",
  onChange,
  onClear,
  onSearch,
  placeholder,
  searchIconSlot,
  state = "default",
  value,
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
      <input
        className="chord-search__input"
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSearch?.(value ?? "");
        }}
        placeholder={placeholder ?? label}
        type="text"
        value={value ?? ""}
      />
      {clearVisible ? (
        <button className="chord-search__clear" onClick={onClear} type="button" aria-label="Clear search">
          {clearIconSlot ?? (
            <span className="chord-search__clear-asset" aria-hidden="true">
              <ChordIcon
                className="chord-search__clear-glyph"
                data-testid="clear-icon"
                name="closeMedium"
                size={10}
              />
            </span>
          )}
        </button>
      ) : null}
    </div>
  );
}
