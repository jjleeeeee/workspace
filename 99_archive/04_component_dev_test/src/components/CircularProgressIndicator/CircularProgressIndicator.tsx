import type { CSSProperties, HTMLAttributes } from "react";
import { cx, type ChordMode } from "../shared";
import { normalizeProgressValue } from "../LinearProgressIndicator/LinearProgressIndicator";
import "./CircularProgressIndicator.css";

type CircularProgressStyle = CSSProperties & {
  "--circular-progress-value"?: string;
};

export type CircularProgressIndicatorProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  mode?: ChordMode;
  value?: number;
};

export function CircularProgressIndicator({
  className,
  mode = "default",
  style,
  value = 0,
  ...rest
}: CircularProgressIndicatorProps) {
  const normalizedValue = normalizeProgressValue(value);

  return (
    <span
      {...rest}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={normalizedValue}
      className={cx("chord-circular-progress", className)}
      data-mode={mode}
      role={rest.role ?? "progressbar"}
      style={{ ...style, "--circular-progress-value": `${normalizedValue}%` } as CircularProgressStyle}
    />
  );
}
