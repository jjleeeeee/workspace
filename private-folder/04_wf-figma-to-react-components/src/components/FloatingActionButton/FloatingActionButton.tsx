import type { ButtonHTMLAttributes } from "react";
import { ChordIcon } from "../../assets/chord-icons";
import "./FloatingActionButton.css";

export type FloatingActionButtonMode = "default" | "fixed";
export type FloatingActionButtonFunction = "goToTop" | "goToBottom";

export const floatingActionButtonModeOptions: FloatingActionButtonMode[] = ["default", "fixed"];
export const floatingActionButtonFunctionOptions: FloatingActionButtonFunction[] = ["goToTop", "goToBottom"];

export interface FloatingActionButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  fabFunction?: FloatingActionButtonFunction;
  mode?: FloatingActionButtonMode;
}

export function FloatingActionButton({
  className,
  fabFunction = "goToTop",
  mode = "default",
  type = "button",
  ...buttonProps
}: FloatingActionButtonProps) {
  const iconName = fabFunction === "goToTop" ? "scrollToTopMedium" : "scrollToBottomMedium";
  const classNames = ["chord-fab", className].filter(Boolean).join(" ");

  return (
    <button
      {...buttonProps}
      className={classNames}
      data-function={fabFunction}
      data-mode={mode}
      type={type}
    >
      <ChordIcon name={iconName} size={20} />
    </button>
  );
}
