import type { HTMLAttributes } from "react";
import { cx } from "../../utils/cx";
import "./LoadingDot.css";

export type LoadingDotMode = "default" | "fixed";
export type LoadingDotSize = "medium" | "small";
export type LoadingDotColor = "primary" | "white";

export type LoadingDotProps = HTMLAttributes<HTMLSpanElement> & {
  animated?: boolean;
  color?: LoadingDotColor;
  mode?: LoadingDotMode;
  size?: LoadingDotSize;
};

export function normalizeLoadingDotColor(size: LoadingDotSize, color: LoadingDotColor) {
  return size === "medium" && color === "white" ? "primary" : color;
}

export function LoadingDot({
  animated = false,
  className,
  color = "primary",
  mode = "default",
  size = "medium",
  ...rest
}: LoadingDotProps) {
  const resolvedColor = normalizeLoadingDotColor(size, color);
  const accessibilityProps = rest["aria-label"] ? {} : { "aria-hidden": "true" as const };

  return (
    <span
      {...accessibilityProps}
      {...rest}
      className={cx("chord-loading-dot", className)}
      data-animated={animated ? "true" : "false"}
      data-color={resolvedColor}
      data-mode={mode}
      data-size={size}
    >
      <span />
      <span />
      <span />
    </span>
  );
}
