import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ChordIcon } from "../../assets/chord-icons";
import "./IconButton.css";

export type IconButtonMode = "default" | "fixed";
export type IconButtonType = "filled" | "outlined";
export type IconButtonSize = "xlarge" | "medium" | "small" | "xxsmall";
export type IconButtonStatus = "default" | "hover" | "disabled";
export type IconButtonRadius = "on" | "off";
export type IconButtonColor = "default" | "black";

export type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  buttonColor?: IconButtonColor;
  buttonType?: IconButtonType;
  icon?: ReactNode;
  mode?: IconButtonMode;
  nativeType?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  radius?: IconButtonRadius;
  size?: IconButtonSize;
  status?: IconButtonStatus;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function resolveIconButtonDisabled(status: IconButtonStatus, disabled?: boolean) {
  return disabled || status === "disabled";
}

export function IconButton({
  "aria-label": ariaLabel = "Icon action",
  buttonColor = "default",
  buttonType = "filled",
  className,
  disabled,
  icon,
  mode = "default",
  nativeType = "button",
  radius = "off",
  size = "xlarge",
  status = "default",
  ...rest
}: IconButtonProps) {
  const resolvedDisabled = resolveIconButtonDisabled(status, disabled);

  return (
    <button
      {...rest}
      aria-label={ariaLabel}
      className={cx("chord-icon-button", className)}
      data-button-color={buttonColor}
      data-button-type={buttonType}
      data-mode={mode}
      data-radius={radius}
      data-size={size}
      data-status={status}
      disabled={resolvedDisabled}
      type={nativeType}
    >
      <span className="chord-icon-button__icon">
        {icon ?? <ChordIcon data-testid="icon-button-default-icon" name="sendMedium" size={20} />}
      </span>
    </button>
  );
}
