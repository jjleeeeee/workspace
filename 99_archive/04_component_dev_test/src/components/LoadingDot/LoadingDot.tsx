import type { HTMLAttributes } from "react";
import { cx, type ChordMode } from "../shared";
import "./LoadingDot.css";

export type LoadingDotSize = "small" | "medium";
export type LoadingDotColor = "default" | "white";

export type LoadingDotProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  color?: LoadingDotColor;
  mode?: ChordMode;
  size?: LoadingDotSize;
};

export function LoadingDot({
  className,
  color = "default",
  mode = "default",
  role = "status",
  size = "medium",
  ...rest
}: LoadingDotProps) {
  return (
    <span
      {...rest}
      aria-busy="true"
      className={cx("chord-loading-dot", className)}
      data-color={color}
      data-mode={mode}
      data-size={size}
      role={role}
    >
      <span />
      <span />
      <span />
    </span>
  );
}
