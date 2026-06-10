import type { HTMLAttributes } from "react";
import "./Scrollbar.css";

export type ScrollbarMode = "default" | "fixed-white" | "fixed-black";

export type ScrollbarProps = HTMLAttributes<HTMLDivElement> & {
  mode?: ScrollbarMode;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Scrollbar({ className, mode = "default", ...rest }: ScrollbarProps) {
  return (
    <div {...rest} className={cx("chord-scrollbar", className)} data-mode={mode}>
      <span className="chord-scrollbar__thumb" />
    </div>
  );
}
