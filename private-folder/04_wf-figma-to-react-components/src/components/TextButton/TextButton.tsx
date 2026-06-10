import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ChordIcon } from "../../assets/chord-icons";
import "./TextButton.css";

export type TextButtonMode = "default" | "fixed";
export type TextButtonType = "filled" | "outlinedColor" | "outlinedGray" | "ghost";
export type TextButtonSize = "xlarge" | "large" | "medium" | "small" | "xsmall" | "xxsmall";
export type TextButtonColor = "default" | "black";
export type TextButtonStatus = "default" | "hover" | "loading" | "disabled";
export type TextButtonRadius = "off" | "on";

export type TextButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color" | "type"> & {
  buttonColor?: TextButtonColor;
  buttonType?: TextButtonType;
  leading?: ReactNode;
  mode?: TextButtonMode;
  nativeType?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  optionLeading?: boolean;
  optionTrailing?: boolean;
  radius?: TextButtonRadius;
  size?: TextButtonSize;
  status?: TextButtonStatus;
  trailing?: ReactNode;
  trailingIcon?: boolean;
  trailingText?: boolean;
};

const typesWithBlack = new Set<TextButtonType>(["filled", "outlinedColor"]);

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function normalizeTextButtonColor(buttonType: TextButtonType, buttonColor: TextButtonColor) {
  if (buttonColor === "black" && !typesWithBlack.has(buttonType)) return "default";
  return buttonColor;
}

export function TextButton({
  buttonColor = "default",
  buttonType = "filled",
  children = "Text",
  className,
  disabled,
  leading,
  mode = "default",
  nativeType = "button",
  optionLeading = false,
  optionTrailing = false,
  radius = "off",
  size = "medium",
  status = "default",
  trailing,
  trailingIcon = true,
  trailingText = false,
  ...rest
}: TextButtonProps) {
  const { "aria-label": ariaLabel, ...buttonProps } = rest;
  const isLoading = status === "loading";
  const isDisabled = disabled || status === "disabled" || isLoading;
  const normalizedColor = normalizeTextButtonColor(buttonType, buttonColor);
  const loadingLabel = typeof children === "string" ? children : undefined;
  const computedAriaLabel = ariaLabel ?? (isLoading ? loadingLabel : undefined);

  return (
    <button
      {...buttonProps}
      aria-busy={isLoading || undefined}
      aria-label={computedAriaLabel}
      className={cx("chord-text-button", className)}
      data-button-color={normalizedColor}
      data-button-type={buttonType}
      data-mode={mode}
      data-radius={radius}
      data-size={size}
      data-status={status}
      disabled={isDisabled}
      type={nativeType}
    >
      {isLoading ? (
        <span className="chord-text-button__loading" data-testid="text-button-loading" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      ) : (
        <span className="chord-text-button__content">
          {(optionLeading || leading) && (
            <span className="chord-text-button__leading" aria-hidden={!leading}>
              {leading ?? <ChordIcon name="nullMedium" size={24} />}
            </span>
          )}
          <span className="chord-text-button__label">{children}</span>
          {(optionTrailing || trailing) && (
            <span className="chord-text-button__trailing" aria-hidden={!trailing}>
              {trailing ??
                (trailingText ? (
                  <span className="chord-text-button__trailing-text">10</span>
                ) : trailingIcon ? (
                  <ChordIcon name="nullMedium" size={24} />
                ) : null)}
            </span>
          )}
        </span>
      )}
    </button>
  );
}
