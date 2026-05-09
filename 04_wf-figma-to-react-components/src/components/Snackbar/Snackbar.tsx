import type { HTMLAttributes, ReactNode } from "react";
import { ChordIcon } from "../../assets/chord-icons";
import "./Snackbar.css";

export type SnackbarMode = "default" | "fixed";

export interface SnackbarProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  actionLabel?: string;
  icon?: boolean;
  iconSlot?: ReactNode;
  label?: string;
  mode?: SnackbarMode;
}

export function Snackbar({
  "aria-live": ariaLive = "polite",
  actionLabel = "Retry",
  className,
  icon = false,
  iconSlot,
  label = "Translate it into the following language.",
  mode = "default",
  role = "status",
  ...divProps
}: SnackbarProps) {
  const classNames = ["chord-snackbar", className].filter(Boolean).join(" ");

  return (
    <div {...divProps} aria-live={ariaLive} className={classNames} data-icon={String(icon)} data-mode={mode} role={role}>
      {icon ? (
        <span className="chord-snackbar__icon" aria-hidden={iconSlot ? undefined : "true"}>
          {iconSlot ?? <ChordIcon data-testid="snackbar-default-icon" name="questionMarkMedium" size={24} />}
        </span>
      ) : null}
      <span className="chord-snackbar__label">{label}</span>
      <span className="chord-snackbar__action">{actionLabel}</span>
    </div>
  );
}
