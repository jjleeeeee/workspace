import type { HTMLAttributes } from "react";
import { ChordIcon } from "../../assets/chord-icons";
import { cx } from "../../utils/cx";
import "./Tooltip.css";

export type TooltipMode = "default" | "fixed";
export type TooltipSize = "large" | "medium";
export type TooltipColor = "black" | "white-fixed" | "tint";
export type TooltipPosition =
  | "down-center"
  | "down-left"
  | "down-right"
  | "up-center"
  | "up-left"
  | "up-right"
  | "left-top"
  | "left-middle"
  | "left-bottom"
  | "right-top"
  | "right-middle"
  | "right-bottom";

export type TooltipProps = HTMLAttributes<HTMLDivElement> & {
  buttonClose?: boolean;
  color?: TooltipColor;
  label?: string;
  mode?: TooltipMode;
  position?: TooltipPosition;
  size?: TooltipSize;
};

export function Tooltip({
  buttonClose = true,
  className,
  color = "black",
  label = "가로 최대 240, 글자수 최대 8줄",
  mode = "default",
  position = "down-center",
  role = "tooltip",
  size = "large",
  ...rest
}: TooltipProps) {
  return (
    <div
      {...rest}
      className={cx("chord-tooltip", className)}
      data-button-close={buttonClose ? "true" : "false"}
      data-color={color}
      data-mode={mode}
      data-position={position}
      data-size={size}
      role={role}
    >
      <div className="chord-tooltip__bubble">
        <span className="chord-tooltip__label">{label}</span>
        {buttonClose ? (
          <button aria-label="Close tooltip" className="chord-tooltip__close" type="button">
            <ChordIcon data-testid="tooltip-close-icon" name="closeMedium" size={12} />
          </button>
        ) : null}
      </div>
      {/* Replacement area for Figma nested caret item. */}
      <span aria-hidden="true" className="chord-tooltip__caret" />
    </div>
  );
}
