import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx, type ChordMode } from "../shared";
import "./ToggleSwitch.css";

export type ToggleSwitchOs = "ios" | "aos";
export type ToggleSwitchSize = "small" | "medium";
export type ToggleSwitchStatus = "off" | "on" | "disabled";

export type ToggleSwitchProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "role"> & {
  checked?: boolean;
  label?: ReactNode;
  mode?: ChordMode;
  os?: ToggleSwitchOs;
  size?: ToggleSwitchSize;
  status?: ToggleSwitchStatus;
};

export function ToggleSwitch({
  checked,
  children,
  className,
  disabled,
  label,
  mode = "default",
  os = "ios",
  size = "medium",
  status = "off",
  type = "button",
  ...rest
}: ToggleSwitchProps) {
  const isDisabled = disabled || status === "disabled";
  const isChecked = checked ?? status === "on";
  const visibleLabel = children ?? label;

  return (
    <button
      {...rest}
      aria-checked={isChecked}
      className={cx("chord-toggle-switch", className)}
      data-mode={mode}
      data-os={os}
      data-size={size}
      data-status={status}
      disabled={isDisabled}
      role="switch"
      type={type}
    >
      <span className="chord-toggle-switch__track" aria-hidden="true">
        <span className="chord-toggle-switch__thumb" />
      </span>
      {visibleLabel && <span className="chord-toggle-switch__label">{visibleLabel}</span>}
    </button>
  );
}
