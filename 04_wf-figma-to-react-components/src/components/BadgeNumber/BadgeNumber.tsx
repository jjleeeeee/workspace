import type { HTMLAttributes } from "react";
import "./BadgeNumber.css";

export type BadgeNumberMode = "default" | "fixed";
export type BadgeNumberType = "number" | "new";

export type BadgeNumberProps = HTMLAttributes<HTMLSpanElement> & {
  badgeType?: BadgeNumberType;
  label?: string | number;
  mode?: BadgeNumberMode;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function normalizeBadgeNumberLabel(label: string | number | null | undefined) {
  const normalized = String(label ?? "").trim();
  if (!normalized) return "999+";
  return normalized.slice(0, 4);
}

export function BadgeNumber({
  badgeType = "number",
  className,
  label = "999+",
  mode = "default",
  ...rest
}: BadgeNumberProps) {
  const displayLabel = badgeType === "new" ? "N" : normalizeBadgeNumberLabel(label);

  return (
    <span
      {...rest}
      className={cx("chord-badge-number", className)}
      data-mode={mode}
      data-type={badgeType}
    >
      {displayLabel}
    </span>
  );
}
