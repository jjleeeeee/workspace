import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx, type ChordMode } from "../shared";
import "./Radio.css";

export type RadioStatus = "default" | "enabled" | "disabled";

export type RadioProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "role"> & {
  checked?: boolean;
  label?: ReactNode;
  mode?: ChordMode;
  status?: RadioStatus;
};

export function Radio({
  checked,
  children,
  className,
  disabled,
  label,
  mode = "default",
  status = "default",
  type = "button",
  ...rest
}: RadioProps) {
  const isDisabled = disabled || status === "disabled";
  const isChecked = checked ?? status === "enabled";
  const visibleLabel = children ?? label;

  return (
    <button
      {...rest}
      aria-checked={isChecked}
      className={cx("chord-radio", className)}
      data-mode={mode}
      data-status={status}
      disabled={isDisabled}
      role="radio"
      type={type}
    >
      <span className="chord-radio__control" aria-hidden="true" />
      {visibleLabel && <span className="chord-radio__label">{visibleLabel}</span>}
    </button>
  );
}
