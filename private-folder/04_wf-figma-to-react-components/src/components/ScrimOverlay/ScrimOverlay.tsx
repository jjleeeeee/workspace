import type { HTMLAttributes } from "react";
import "./ScrimOverlay.css";

export type ScrimOverlayColor = "50" | "80";

export const scrimOverlayColorOptions: ScrimOverlayColor[] = ["50", "80"];

export type ScrimOverlayProps = HTMLAttributes<HTMLDivElement> & {
  color?: ScrimOverlayColor;
  fullCover?: boolean;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ScrimOverlay({ className, color = "50", fullCover = false, ...rest }: ScrimOverlayProps) {
  return (
    <div
      {...rest}
      aria-hidden={rest["aria-label"] ? undefined : "true"}
      className={cx("chord-scrim-overlay", className)}
      data-color={color}
      data-full-cover={fullCover ? "true" : "false"}
    />
  );
}
