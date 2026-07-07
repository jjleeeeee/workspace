import type { HTMLAttributes } from "react";
import { cx } from "../../utils/cx";
import "./BadgeDot.css";

export type BadgeDotMode = "default" | "fixed";
export type BadgeDotSize = "small" | "medium" | "large";
export type BadgeDotOutline = "off" | "on";

export type BadgeDotProps = HTMLAttributes<HTMLSpanElement> & {
  mode?: BadgeDotMode;
  outline?: BadgeDotOutline;
  size?: BadgeDotSize;
};

export function BadgeDot({
  className,
  mode = "default",
  outline = "off",
  size = "medium",
  ...rest
}: BadgeDotProps) {
  const { "aria-label": ariaLabel, ...spanProps } = rest;

  return (
    <span
      {...spanProps}
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
      className={cx("chord-badge-dot", className)}
      data-mode={mode}
      data-outline={outline}
      data-size={size}
    />
  );
}
