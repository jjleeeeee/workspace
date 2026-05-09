import type { HTMLAttributes } from "react";
import { cx, type ChordMode } from "../shared";
import "./Divider.css";

export type DividerHeight = "1" | "2" | "8";
export type DividerStyleVariant = "default-50a" | "default-50a-2";

export type DividerProps = Omit<HTMLAttributes<HTMLHRElement>, "children"> & {
  height?: DividerHeight;
  mode?: ChordMode;
  styleVariant?: DividerStyleVariant;
};

export function Divider({
  className,
  height = "1",
  mode = "default",
  styleVariant = "default-50a",
  ...rest
}: DividerProps) {
  return (
    <hr
      {...rest}
      className={cx("chord-divider", className)}
      data-height={height}
      data-mode={mode}
      data-style-variant={styleVariant}
    />
  );
}
