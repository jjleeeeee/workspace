import type { HTMLAttributes } from "react";
import { cx, type ChordMode } from "../shared";
import "./BadgeDot.css";

export type BadgeDotSize = "small" | "medium" | "large";
export type BadgeDotOutline = "off" | "on";

export type BadgeDotProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  mode?: ChordMode;
  size?: BadgeDotSize;
  outline?: BadgeDotOutline | boolean;
};

function normalizeOutline(outline: BadgeDotProps["outline"]): BadgeDotOutline {
  if (typeof outline === "boolean") return outline ? "on" : "off";
  return outline ?? "off";
}

export function BadgeDot({
  className,
  mode = "default",
  outline = "off",
  size = "medium",
  ...rest
}: BadgeDotProps) {
  const normalizedOutline = normalizeOutline(outline);
  const hasAccessibleName = Boolean(rest["aria-label"] || rest["aria-labelledby"]);

  return (
    <span
      {...rest}
      aria-hidden={hasAccessibleName ? rest["aria-hidden"] : true}
      className={cx("chord-badge-dot", className)}
      data-mode={mode}
      data-outline={normalizedOutline}
      data-size={size}
      role={hasAccessibleName ? "status" : undefined}
    />
  );
}
