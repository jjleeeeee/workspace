import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx, type ChordMode } from "../shared";
import "./Checkbox.css";

export type CheckboxShape = "circle" | "square";
export type CheckboxStatus = "default" | "enabled" | "disabled";

export type CheckboxProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "role"> & {
  checked?: boolean;
  label?: ReactNode;
  mode?: ChordMode;
  shape?: CheckboxShape;
  status?: CheckboxStatus;
};

export function Checkbox({
  checked,
  children,
  className,
  disabled,
  label,
  mode = "default",
  shape = "circle",
  status = "default",
  type = "button",
  ...rest
}: CheckboxProps) {
  const isDisabled = disabled || status === "disabled";
  const isChecked = checked ?? status === "enabled";
  const visibleLabel = children ?? label;

  return (
    <button
      {...rest}
      aria-checked={isChecked}
      className={cx("chord-checkbox", className)}
      data-mode={mode}
      data-shape={shape}
      data-status={status}
      disabled={isDisabled}
      role="checkbox"
      type={type}
    >
      <span className="chord-checkbox__control" aria-hidden="true" />
      {visibleLabel && <span className="chord-checkbox__label">{visibleLabel}</span>}
    </button>
  );
}
