import type { HTMLAttributes } from "react";
import "./SelectNumberBox.css";

export type SelectNumberBoxMode = "default" | "fixed";
export type SelectNumberBoxState = "selected" | "selected-99-plus" | "unselected";

export type SelectNumberBoxProps = HTMLAttributes<HTMLSpanElement> & {
  mode?: SelectNumberBoxMode;
  state?: SelectNumberBoxState;
  value?: number | string | null;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function normalizeSelectNumberBoxValue(value: number | string | null | undefined) {
  const numericValue = typeof value === "number" ? value : Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(numericValue) || numericValue < 1) return "1";
  if (numericValue > 99) return "99+";
  return String(numericValue);
}

export function resolveSelectNumberBoxState(
  state: SelectNumberBoxState | undefined,
  value: number | string | null | undefined,
) {
  if (state === "unselected") return "unselected";
  if (state === "selected-99-plus") return "selected-99-plus";
  return normalizeSelectNumberBoxValue(value) === "99+" ? "selected-99-plus" : "selected";
}

export function SelectNumberBox({
  className,
  mode = "default",
  state = "selected",
  value = 99,
  ...rest
}: SelectNumberBoxProps) {
  const resolvedState = resolveSelectNumberBoxState(state, value);
  const label = resolvedState === "selected-99-plus" ? "99+" : normalizeSelectNumberBoxValue(value);

  return (
    <span
      {...rest}
      className={cx("chord-select-number-box", className)}
      data-mode={mode}
      data-state={resolvedState}
    >
      <span className="chord-select-number-box__marker">
        {resolvedState === "unselected" ? null : <span className="chord-select-number-box__label">{label}</span>}
      </span>
    </span>
  );
}
