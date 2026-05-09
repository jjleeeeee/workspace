import type { CSSProperties, HTMLAttributes } from "react";
import { cx, type ChordMode } from "../shared";
import "./Skeleton.css";

export type SkeletonType = "rectangle" | "circle" | "text";
export type SkeletonSize = "small" | "medium";

type SkeletonStyle = CSSProperties & {
  "--skeleton-width"?: string;
  "--skeleton-height"?: string;
};

export type SkeletonProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  animated?: boolean;
  height?: number | string;
  mode?: ChordMode;
  size?: SkeletonSize;
  type?: SkeletonType;
  width?: number | string;
};

function toCssLength(value: number | string | undefined) {
  if (value == null) return undefined;
  return typeof value === "number" ? `${value}px` : value;
}

export function Skeleton({
  animated = true,
  className,
  height,
  mode = "default",
  size = "medium",
  style,
  type = "rectangle",
  width,
  ...rest
}: SkeletonProps) {
  const cssVars: SkeletonStyle = {
    ...style,
    "--skeleton-width": toCssLength(width),
    "--skeleton-height": toCssLength(height),
  };

  return (
    <span
      {...rest}
      aria-busy="true"
      className={cx("chord-skeleton", className)}
      data-animated={animated ? "true" : "false"}
      data-mode={mode}
      data-size={size}
      data-type={type}
      role={rest.role ?? "status"}
      style={cssVars}
    />
  );
}
