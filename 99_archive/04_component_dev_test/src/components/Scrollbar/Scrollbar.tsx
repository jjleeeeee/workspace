import type { CSSProperties, HTMLAttributes } from "react";
import { cx } from "../shared";
import { normalizeProgressValue } from "../LinearProgressIndicator/LinearProgressIndicator";
import "./Scrollbar.css";

export type ScrollbarState = "default" | "hover" | "dragging";

type ScrollbarStyle = CSSProperties & {
  "--scrollbar-value"?: string;
};

export type ScrollbarProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  state?: ScrollbarState;
  value?: number;
};

export function Scrollbar({ className, state = "default", style, value = 0, ...rest }: ScrollbarProps) {
  const normalizedValue = normalizeProgressValue(value);

  return (
    <div
      {...rest}
      aria-orientation="vertical"
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={normalizedValue}
      className={cx("chord-scrollbar", className)}
      data-state={state}
      role={rest.role ?? "scrollbar"}
      style={{ ...style, "--scrollbar-value": `${normalizedValue}%` } as ScrollbarStyle}
    >
      <span />
    </div>
  );
}
