import type { HTMLAttributes, ReactNode } from "react";
import "./CircularProgressIndicator.css";

const cancelIconUrl = new URL("../../figma/assets/circular-progress-cancel-icon-area.svg", import.meta.url).href;

export type CircularProgressIndicatorMode = "default" | "fixed";

export type CircularProgressIndicatorProps = HTMLAttributes<HTMLSpanElement> & {
  button?: boolean;
  buttonContent?: ReactNode;
  mode?: CircularProgressIndicatorMode;
  progress?: number;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function clampCircularProgress(value: number | null | undefined) {
  if (typeof value !== "number" || Number.isNaN(value)) return 0.75;
  return Math.min(1, Math.max(0, value));
}

function CircularProgressCancelAsset() {
  return (
    <img
      alt=""
      aria-hidden="true"
      className="chord-circular-progress-indicator__cancel-asset"
      data-asset-source="figma:81407:905664"
      draggable={false}
      src={cancelIconUrl}
    />
  );
}

export function CircularProgressIndicator({
  button = true,
  buttonContent,
  className,
  mode = "default",
  progress = 0.75,
  ...rest
}: CircularProgressIndicatorProps) {
  const resolvedProgress = clampCircularProgress(progress);
  const circumference = 2 * Math.PI * 22;
  const strokeDasharray = `${circumference * resolvedProgress} ${circumference}`;
  const accessibilityProps = rest["aria-label"]
    ? { role: "progressbar", "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": Math.round(resolvedProgress * 100) }
    : { "aria-hidden": "true" as const };

  return (
    <span
      {...accessibilityProps}
      {...rest}
      className={cx("chord-circular-progress-indicator", className)}
      data-button={button ? "true" : "false"}
      data-mode={mode}
      data-progress={Math.round(resolvedProgress * 100)}
    >
      <svg aria-hidden="true" className="chord-circular-progress-indicator__ring" viewBox="0 0 56 56">
        <circle className="chord-circular-progress-indicator__track" cx="28" cy="28" r="22" />
        <circle
          className="chord-circular-progress-indicator__value"
          cx="28"
          cy="28"
          r="22"
          style={{ strokeDasharray }}
        />
      </svg>
      {/* Figma-exported nested DS asset: btn_circle_indicator_cancel, 16x16. */}
      {button ? (
        <span className="chord-circular-progress-indicator__button">
          {buttonContent ?? <CircularProgressCancelAsset />}
        </span>
      ) : null}
    </span>
  );
}
