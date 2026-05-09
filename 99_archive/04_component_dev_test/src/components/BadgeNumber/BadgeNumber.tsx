import type { HTMLAttributes } from "react";
import { cx, type ChordMode } from "../shared";
import "./BadgeNumber.css";

export type BadgeNumberType = "number" | "new";

export type BadgeNumberLabelInput = {
  count?: number;
  label?: string;
  max?: number;
  type?: BadgeNumberType;
};

export type BadgeNumberProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> &
  BadgeNumberLabelInput & {
    mode?: ChordMode;
  };

export function formatBadgeNumberLabel({
  count,
  label,
  max = 999,
  type = "number",
}: BadgeNumberLabelInput) {
  const trimmedLabel = label?.trim();
  if (type === "new") return trimmedLabel || "N";
  if (trimmedLabel) return trimmedLabel;
  if (count == null) return `${max}+`;
  return count > max ? `${max}+` : String(Math.max(0, count));
}

export function BadgeNumber({
  className,
  count,
  label,
  max = 999,
  mode = "default",
  type = "number",
  ...rest
}: BadgeNumberProps) {
  const text = formatBadgeNumberLabel({ count, label, max, type });

  return (
    <span
      {...rest}
      className={cx("chord-badge-number", className)}
      data-mode={mode}
      data-type={type}
      role={rest.role ?? "status"}
    >
      {text}
    </span>
  );
}
