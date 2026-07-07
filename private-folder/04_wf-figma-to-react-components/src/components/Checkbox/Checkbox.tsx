import type { ButtonHTMLAttributes } from "react";
import { ChordIcon } from "../../assets/chord-icons";
import { cx } from "../../utils/cx";
import "./Checkbox.css";

export type CheckboxMode = "default" | "fixed";
export type CheckboxType = "circle" | "square";
export type CheckboxStatus = "default" | "enabled" | "disabled";

export type CheckboxProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  checkboxType?: CheckboxType;
  checked?: boolean;
  mode?: CheckboxMode;
  nativeType?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  status?: CheckboxStatus;
};

export function resolveCheckboxStatus(
  status: CheckboxStatus | undefined,
  checked: boolean | undefined,
  disabled: boolean | undefined,
) {
  if (status) return status;
  if (disabled) return "disabled";
  return checked ? "enabled" : "default";
}

export function Checkbox({
  checkboxType = "circle",
  checked,
  className,
  disabled,
  mode = "default",
  nativeType = "button",
  status,
  ...rest
}: CheckboxProps) {
  const resolvedStatus = resolveCheckboxStatus(status, checked, disabled);
  const isDisabled = disabled || resolvedStatus === "disabled";
  const isChecked = resolvedStatus === "enabled" || resolvedStatus === "disabled";

  return (
    <button
      {...rest}
      aria-checked={isChecked}
      className={cx("chord-checkbox", className)}
      data-mode={mode}
      data-status={resolvedStatus}
      data-type={checkboxType}
      disabled={isDisabled}
      role="checkbox"
      type={nativeType}
    >
      <span className="chord-checkbox__box" aria-hidden="true">
        {isChecked ? (
          <ChordIcon className="chord-checkbox__icon" data-testid="checkbox-check-icon" name="checkMedium" size={16} />
        ) : null}
      </span>
    </button>
  );
}
