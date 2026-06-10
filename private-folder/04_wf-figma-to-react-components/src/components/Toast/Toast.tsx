import type { HTMLAttributes } from "react";
import "./Toast.css";

export type ToastMode = "default" | "fixed";

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  label?: string;
  mode?: ToastMode;
}

export function Toast({
  "aria-live": ariaLive = "polite",
  className,
  label = "Translate it into the following language.",
  mode = "default",
  role = "status",
  ...divProps
}: ToastProps) {
  const classNames = ["chord-toast", className].filter(Boolean).join(" ");

  return (
    <div {...divProps} aria-live={ariaLive} className={classNames} data-mode={mode} role={role}>
      <span className="chord-toast__label">{label}</span>
    </div>
  );
}
