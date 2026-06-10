import type { ButtonHTMLAttributes } from "react";
import "./Radio.css";

export type RadioMode = "default" | "fixed";
export type RadioStatus = "default" | "enabled" | "disabled";

export type RadioProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  checked?: boolean;
  mode?: RadioMode;
  nativeType?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  status?: RadioStatus;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function resolveRadioStatus(
  status: RadioStatus | undefined,
  checked: boolean | undefined,
  disabled: boolean | undefined,
) {
  if (status) return status;
  if (disabled) return "disabled";
  return checked ? "enabled" : "default";
}

export function Radio({
  checked,
  className,
  disabled,
  mode = "default",
  nativeType = "button",
  status,
  ...rest
}: RadioProps) {
  const resolvedStatus = resolveRadioStatus(status, checked, disabled);
  const isDisabled = disabled || resolvedStatus === "disabled";
  const isChecked = resolvedStatus === "enabled" || resolvedStatus === "disabled";

  return (
    <button
      {...rest}
      aria-checked={isChecked}
      className={cx("chord-radio", className)}
      data-mode={mode}
      data-status={resolvedStatus}
      disabled={isDisabled}
      role="radio"
      type={nativeType}
    >
      <span className="chord-radio__outline" aria-hidden="true">
        {isChecked ? <span className="chord-radio__inner" /> : null}
      </span>
    </button>
  );
}
