import type { HTMLAttributes } from "react";
import "./Skeleton.css";

export type SkeletonMode = "default" | "fixed";
export type SkeletonType = "rectangle" | "line" | "circle";
export type SkeletonSize = "large" | "medium";

export type SkeletonProps = HTMLAttributes<HTMLSpanElement> & {
  mode?: SkeletonMode;
  size?: SkeletonSize;
  skeletonType?: SkeletonType;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Skeleton({
  className,
  mode = "default",
  size = "large",
  skeletonType = "rectangle",
  ...rest
}: SkeletonProps) {
  const { "aria-label": ariaLabel, ...spanProps } = rest;

  return (
    <span
      {...spanProps}
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
      className={cx("chord-skeleton", className)}
      data-mode={mode}
      data-size={size}
      data-type={skeletonType}
    />
  );
}
