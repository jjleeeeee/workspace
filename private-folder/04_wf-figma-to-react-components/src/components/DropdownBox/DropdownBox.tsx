import type { HTMLAttributes, ReactNode } from "react";
import { ChordIcon } from "../../assets/chord-icons";
import { BadgeDot } from "../BadgeDot/BadgeDot";
import { Scrollbar } from "../Scrollbar/Scrollbar";
import "./DropdownBox.css";

export type DropdownBoxMode = "default" | "fixed";
export type DropdownBoxState =
  | "default"
  | "pressed"
  | "enabled-down"
  | "enabled-up"
  | "completed"
  | "error"
  | "disabled";

export const dropdownBoxModeOptions: DropdownBoxMode[] = ["default", "fixed"];
export const dropdownBoxStateOptions: DropdownBoxState[] = [
  "default",
  "pressed",
  "enabled-down",
  "enabled-up",
  "completed",
  "error",
  "disabled",
];

export type DropdownBoxProps = HTMLAttributes<HTMLDivElement> & {
  mode?: DropdownBoxMode;
  state?: DropdownBoxState;
  showTitle?: boolean;
  titleLabel?: string;
  showGuide?: boolean;
  guideLabel?: string;
  textLabel?: string;
  showBadgeDot?: boolean;
  showScrollbar?: boolean;
  children?: ReactNode;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function DropdownBox({
  className,
  mode = "default",
  state = "default",
  showTitle = true,
  titleLabel = "Title",
  showGuide = true,
  guideLabel = "Guide Message",
  textLabel = "Select Option",
  showBadgeDot = true,
  showScrollbar = true,
  children,
  ...rest
}: DropdownBoxProps) {
  const isOpenDown = state === "enabled-down";
  const isOpenUp = state === "enabled-up";
  const isOpen = isOpenDown || isOpenUp;
  const scrollbarMode = mode === "fixed" ? "fixed-white" : "default";

  return (
    <div
      {...rest}
      className={cx("chord-dropdown-box", className)}
      data-mode={mode}
      data-state={state}
    >
      {showTitle && (
        <div className="chord-dropdown-box__title">
          <span className="chord-dropdown-box__title-inner">
            <span className="chord-dropdown-box__title-text">{titleLabel}</span>
            {showBadgeDot && (
              <BadgeDot
                className="chord-dropdown-box__title-badge"
                mode={mode === "fixed" ? "fixed" : "default"}
                size="small"
              />
            )}
          </span>
        </div>
      )}

      {isOpenUp && (
        <div className="chord-dropdown-box__menu" data-direction="up">
          {children}
          {showScrollbar && <Scrollbar mode={scrollbarMode} />}
        </div>
      )}

      <div className="chord-dropdown-box__input">
        <span className="chord-dropdown-box__input-text">{textLabel}</span>
        <ChordIcon
          className="chord-dropdown-box__arrow"
          data-testid="dropdown-box-arrow"
          name={isOpen ? "arrowDownFoldMedium" : "arrowDownMedium"}
          size={16}
        />
      </div>

      {isOpenDown && (
        <div className="chord-dropdown-box__menu" data-direction="down">
          {children}
          {showScrollbar && <Scrollbar mode={scrollbarMode} />}
        </div>
      )}

      {showGuide && (
        <div className="chord-dropdown-box__guide">
          <span className="chord-dropdown-box__guide-text">{guideLabel}</span>
        </div>
      )}
    </div>
  );
}
