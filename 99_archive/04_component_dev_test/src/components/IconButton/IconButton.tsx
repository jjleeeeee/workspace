import type { ButtonHTMLAttributes } from "react";
import { cx, type ChordMode } from "../shared";
import "./IconButton.css";

export type IconButtonVariant = "filled" | "outlined";
export type IconButtonSize = "xlarge" | "medium" | "small" | "xxsmall";
export type IconButtonState = "default" | "hover" | "disabled";
export type IconButtonRadius = "off" | "on";
export type IconButtonColor = "default" | "black";

export type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> & {
  buttonColor?: IconButtonColor;
  mode?: ChordMode;
  radius?: IconButtonRadius;
  size?: IconButtonSize;
  state?: IconButtonState;
  variant?: IconButtonVariant;
};

export function IconButton({
  buttonColor = "default",
  children,
  className,
  disabled,
  mode = "default",
  radius = "off",
  size = "medium",
  state = "default",
  type = "button",
  variant = "filled",
  ...rest
}: IconButtonProps) {
  const isDisabled = disabled || state === "disabled";

  return (
    <button
      {...rest}
      className={cx("chord-icon-button", className)}
      data-button-color={buttonColor}
      data-mode={mode}
      data-radius={radius}
      data-size={size}
      data-state={state}
      data-variant={variant}
      disabled={isDisabled}
      type={type}
    >
      <span className="chord-icon-button__glyph" aria-hidden="true">
        {children ?? "⋯"}
      </span>
    </button>
  );
}
