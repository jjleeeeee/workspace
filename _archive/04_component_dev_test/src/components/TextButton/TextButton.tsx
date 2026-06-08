import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx, type ChordMode } from "../shared";
import "./TextButton.css";

export type TextButtonVariant = "filled" | "outlinedColor" | "outlinedGray" | "ghost";
export type TextButtonSize = "xlarge" | "large" | "medium" | "small" | "xsmall" | "xxsmall";
export type TextButtonColor = "default" | "black";
export type TextButtonStatus = "default" | "hover" | "loading" | "disabled";
export type TextButtonRadius = "off" | "on";

export type TextButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> & {
  buttonColor?: TextButtonColor;
  leading?: ReactNode;
  mode?: ChordMode;
  radius?: TextButtonRadius;
  showLeading?: boolean;
  showTrailing?: boolean;
  size?: TextButtonSize;
  status?: TextButtonStatus;
  trailing?: ReactNode;
  variant?: TextButtonVariant;
};

export function TextButton({
  buttonColor = "default",
  children = "Button",
  className,
  disabled,
  leading,
  mode = "default",
  radius = "off",
  showLeading = false,
  showTrailing = false,
  size = "medium",
  status = "default",
  trailing,
  type = "button",
  variant = "filled",
  ...rest
}: TextButtonProps) {
  const isDisabled = disabled || status === "disabled";
  const isLoading = status === "loading";

  return (
    <button
      {...rest}
      aria-busy={isLoading || undefined}
      className={cx("chord-text-button", className)}
      data-button-color={buttonColor}
      data-mode={mode}
      data-radius={radius}
      data-size={size}
      data-status={status}
      data-variant={variant}
      disabled={isDisabled}
      type={type}
    >
      {(leading || showLeading) && (
        <span className="chord-text-button__affix" aria-hidden={!leading}>
          {leading ?? "←"}
        </span>
      )}
      {isLoading && <span className="chord-text-button__spinner" aria-hidden="true" />}
      <span className="chord-text-button__label">{children}</span>
      {(trailing || showTrailing) && (
        <span className="chord-text-button__affix" aria-hidden={!trailing}>
          {trailing ?? "→"}
        </span>
      )}
    </button>
  );
}
