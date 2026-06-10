import type { CSSProperties, HTMLAttributes } from "react";
import { cx, type ChordMode } from "../shared";
import "./LinearProgressIndicator.css";

export type LinearProgressHeight = "2" | "4";
export type LinearProgressRounded = "on" | "off";

type LinearProgressStyle = CSSProperties & {
  "--linear-progress-value"?: string;
};

export type LinearProgressIndicatorProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  height?: LinearProgressHeight;
  mode?: ChordMode;
  rounded?: LinearProgressRounded;
  value?: number;
};

export function normalizeProgressValue(value = 0) {
  if (Number.isNaN(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value)));
}

export function LinearProgressIndicator({
  className,
  height = "4",
  mode = "default",
  rounded = "on",
  style,
  value = 0,
  ...rest
}: LinearProgressIndicatorProps) {
  const normalizedValue = normalizeProgressValue(value);

  return (
    <div
      {...rest}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={normalizedValue}
      className={cx("chord-linear-progress", className)}
      data-height={height}
      data-mode={mode}
      data-rounded={rounded}
      role={rest.role ?? "progressbar"}
      style={{ ...style, "--linear-progress-value": `${normalizedValue}%` } as LinearProgressStyle}
    >
      <span />
    </div>
  );
}
