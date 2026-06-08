import type { HTMLAttributes } from "react";
import { cx, type ChordMode } from "../shared";
import "./SelectNumberBox.css";

export type SelectNumberBoxState = "default" | "selected" | "over";

export type SelectNumberBoxProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  mode?: ChordMode;
  state?: SelectNumberBoxState;
  value?: number;
};

export function formatSelectNumberLabel(value = 1) {
  const normalized = Math.max(0, Math.floor(value));
  return normalized > 99 ? "99+" : String(normalized);
}

export function SelectNumberBox({
  className,
  mode = "default",
  state = "default",
  value = 1,
  ...rest
}: SelectNumberBoxProps) {
  return (
    <span
      {...rest}
      className={cx("chord-select-number-box", className)}
      data-mode={mode}
      data-state={state}
      role={rest.role ?? "status"}
    >
      {formatSelectNumberLabel(value)}
    </span>
  );
}
