import type { HTMLAttributes } from "react";
import "./LoadingCircular.css";

export type LoadingCircularMode = "default" | "fixed";

export type LoadingCircularProps = HTMLAttributes<HTMLSpanElement> & {
  animated?: boolean;
  mode?: LoadingCircularMode;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function LoadingCircular({
  animated = false,
  className,
  mode = "default",
  ...rest
}: LoadingCircularProps) {
  const accessibilityProps = rest["aria-label"] ? { role: "status" } : { "aria-hidden": "true" as const };

  return (
    <span
      {...accessibilityProps}
      {...rest}
      className={cx("chord-loading-circular", className)}
      data-animated={animated ? "true" : "false"}
      data-mode={mode}
    >
      <svg aria-hidden="true" viewBox="0 0 20 20">
        <circle className="chord-loading-circular__track" cx="10" cy="10" r="8" />
        <path className="chord-loading-circular__arc" d="M 14.7 3.5 A 8 8 0 0 1 17.8 9" />
      </svg>
    </span>
  );
}
