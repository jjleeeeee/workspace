import type { HTMLAttributes } from "react";
import { cx, type ChordMode } from "../shared";
import "./LoadingCircular.css";

export type LoadingCircularProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  mode?: ChordMode;
};

export function LoadingCircular({ className, mode = "default", role = "status", ...rest }: LoadingCircularProps) {
  return (
    <span
      {...rest}
      aria-busy="true"
      className={cx("chord-loading-circular", className)}
      data-mode={mode}
      role={role}
    />
  );
}
