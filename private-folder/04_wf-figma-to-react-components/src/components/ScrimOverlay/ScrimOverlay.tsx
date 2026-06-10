import type { HTMLAttributes } from "react";
import "./ScrimOverlay.css";

export type ScrimOverlayProps = HTMLAttributes<HTMLDivElement> & {
  fullCover?: boolean;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ScrimOverlay({ className, fullCover = false, ...rest }: ScrimOverlayProps) {
  return (
    <div
      {...rest}
      aria-hidden={rest["aria-label"] ? undefined : "true"}
      className={cx("chord-scrim-overlay", className)}
      data-full-cover={fullCover ? "true" : "false"}
    />
  );
}
