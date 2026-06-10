import type { CSSProperties, HTMLAttributes } from "react";
import { cx } from "../shared";
import "./ScrimOverlay.css";

export type ScrimOverlayProps = HTMLAttributes<HTMLDivElement> & {
  opacity?: number;
};

export function clamp01(value: number) {
  if (Number.isNaN(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

export function ScrimOverlay({ className, opacity = 0.6, role = "presentation", style, ...rest }: ScrimOverlayProps) {
  return (
    <div
      {...rest}
      className={cx("chord-scrim-overlay", className)}
      role={role}
      style={{ ...style, opacity: clamp01(opacity) } as CSSProperties}
    />
  );
}
