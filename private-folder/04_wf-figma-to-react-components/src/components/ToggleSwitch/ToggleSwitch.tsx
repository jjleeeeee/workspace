import type { ButtonHTMLAttributes } from "react";
import { cx } from "../../utils/cx";
import "./ToggleSwitch.css";

export type ToggleSwitchMode = "default" | "fixed";
export type ToggleSwitchPlatform = "ios" | "aos";
export type ToggleSwitchSize = "medium" | "small";
export type ToggleSwitchStatus = "default" | "enabled" | "disabled";

export type ToggleSwitchProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  checked?: boolean;
  mode?: ToggleSwitchMode;
  nativeType?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  platform?: ToggleSwitchPlatform;
  size?: ToggleSwitchSize;
  status?: ToggleSwitchStatus;
};

export function resolveToggleSwitchStatus(
  status: ToggleSwitchStatus | undefined,
  checked: boolean | undefined,
  disabled: boolean | undefined,
) {
  if (status) return status;
  if (disabled) return "disabled";
  return checked ? "enabled" : "default";
}

export function ToggleSwitch({
  checked,
  className,
  disabled,
  mode = "default",
  nativeType = "button",
  platform = "ios",
  size = "medium",
  status,
  ...rest
}: ToggleSwitchProps) {
  const resolvedStatus = resolveToggleSwitchStatus(status, checked, disabled);
  const isDisabled = disabled || resolvedStatus === "disabled";
  const isChecked = resolvedStatus === "enabled";

  return (
    <button
      {...rest}
      aria-checked={isChecked}
      className={cx("chord-toggle-switch", className)}
      data-mode={mode}
      data-platform={platform}
      data-size={size}
      data-status={resolvedStatus}
      disabled={isDisabled}
      role="switch"
      type={nativeType}
    >
      <span aria-hidden="true" />
    </button>
  );
}
