import type { HTMLAttributes } from "react";
import "./LinearProgressIndicator.css";

export type LinearProgressIndicatorMode = "default" | "fixed";
export type LinearProgressIndicatorRounded = "off" | "on";
export type LinearProgressIndicatorHeight = "default" | "4";

export type LinearProgressIndicatorProps = HTMLAttributes<HTMLDivElement> & {
  indicatorHeight?: LinearProgressIndicatorHeight;
  mode?: LinearProgressIndicatorMode;
  progress?: number;
  rounded?: LinearProgressIndicatorRounded;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function clampProgress(progress: number | null | undefined) {
  if (typeof progress !== "number" || Number.isNaN(progress)) return 0.19084;
  return Math.min(1, Math.max(0, progress));
}

export function normalizeLinearProgressRounded(
  indicatorHeight: LinearProgressIndicatorHeight,
  rounded: LinearProgressIndicatorRounded,
) {
  return indicatorHeight === "4" && rounded === "on" ? "off" : rounded;
}

export function LinearProgressIndicator({
  className,
  indicatorHeight = "default",
  mode = "default",
  progress = 75 / 393,
  rounded = "off",
  ...rest
}: LinearProgressIndicatorProps) {
  const normalizedProgress = clampProgress(progress);
  const resolvedRounded = normalizeLinearProgressRounded(indicatorHeight, rounded);
  const accessibilityProps = rest["aria-label"]
    ? { role: "progressbar" as const }
    : { "aria-hidden": "true" as const };

  return (
    <div
      {...accessibilityProps}
      {...rest}
      aria-valuemax={rest["aria-label"] ? 100 : undefined}
      aria-valuemin={rest["aria-label"] ? 0 : undefined}
      aria-valuenow={rest["aria-label"] ? Math.round(normalizedProgress * 100) : undefined}
      className={cx("chord-linear-progress-indicator", className)}
      data-height={indicatorHeight}
      data-mode={mode}
      data-rounded={resolvedRounded}
    >
      <span style={{ inlineSize: `${normalizedProgress * 100}%` }} />
    </div>
  );
}
