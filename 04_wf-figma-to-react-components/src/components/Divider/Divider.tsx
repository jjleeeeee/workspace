import type { HTMLAttributes } from "react";
import "./Divider.css";

export type DividerMode = "default" | "fixed";
export type DividerHeight = "1" | "2" | "8";
export type DividerStyle = "default-50a" | "default-50a-2";

export type DividerProps = HTMLAttributes<HTMLDivElement> & {
  dividerStyle?: DividerStyle;
  height?: DividerHeight;
  mode?: DividerMode;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Divider({
  className,
  dividerStyle = "default-50a",
  height = "1",
  mode = "default",
  role = "separator",
  ...rest
}: DividerProps) {
  return (
    <div
      {...rest}
      className={cx("chord-divider", className)}
      data-height={height}
      data-mode={mode}
      data-style={dividerStyle}
      role={role}
    />
  );
}
