import type { ButtonHTMLAttributes, ReactNode } from "react";

import { ChordIcon } from "../../assets/chord-icons";
import { cx } from "../../utils/cx";
import { BadgeDot } from "../BadgeDot/BadgeDot";
import { BadgeNumber } from "../BadgeNumber/BadgeNumber";
import "./Chips.css";

const chipsImageFixture = new URL("../../figma/fixtures/chips-img.png", import.meta.url).href;

export type ChipsMode = "default" | "fixed";
export type ChipsSize = "small" | "medium";
export type ChipsType = "text" | "icon" | "image";
export type ChipsState =
  | "default"
  | "filled-selected"
  | "outlined-selected"
  | "filled-disabled"
  | "outlined-disabled";
export type ChipsProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "disabled" | "type"> & {
  label: string;
  mode?: ChipsMode;
  size?: ChipsSize;
  type?: ChipsType;
  state?: ChipsState;
  marquee?: boolean;
  badge?: boolean;
  badgeNumber?: boolean;
  badgeNumberLabel?: string | number;
  icon?: ReactNode;
  image?: ReactNode;
  trailingIcon?: boolean | ReactNode;
};

export function Chips({
  badge = false,
  badgeNumber = false,
  badgeNumberLabel = 3,
  className,
  icon,
  image,
  label,
  marquee = false,
  mode = "default",
  size = "small",
  state = "default",
  trailingIcon,
  type: typeProp = "text",
  ...buttonProps
}: ChipsProps) {
  const type = typeProp === "image" && size === "small" ? "text" : typeProp;
  const disabled = state === "filled-disabled" || state === "outlined-disabled";

  return (
    <button
      {...buttonProps}
      aria-disabled={disabled ? "true" : undefined}
      className={cx("chord-chips", className)}
      data-badge={badge ? "true" : undefined}
      data-badge-number={badgeNumber ? "true" : undefined}
      data-marquee={marquee ? "true" : undefined}
      data-mode={mode}
      data-size={size}
      data-state={state}
      data-trailing={trailingIcon ? "true" : undefined}
      data-type={type}
      disabled={disabled}
      type="button"
    >
      <span className="chord-chips__content">
        {type === "icon" && (
          <span aria-hidden="true" className="chord-chips__leading" data-leading-type="icon">
            {icon ?? <ChordIcon name="nullMedium" size={16} />}
          </span>
        )}
        {type === "image" && (
          <span aria-hidden="true" className="chord-chips__leading chord-chips__image" data-leading-type="image">
            {image ?? <img alt="" height={24} src={chipsImageFixture} width={24} />}
          </span>
        )}
        <span className="chord-chips__label">{label}</span>
        {trailingIcon && (
          <span aria-hidden="true" className="chord-chips__trailing">
            {trailingIcon}
          </span>
        )}
      </span>
      {badgeNumber ? (
        <span aria-hidden="true" className="chord-chips__badge chord-chips__badge--number">
          <BadgeNumber badgeType="number" label={badgeNumberLabel} mode={mode} />
        </span>
      ) : badge ? (
        <span aria-hidden="true" className="chord-chips__badge chord-chips__badge--dot">
          <BadgeDot mode={mode} outline="off" size="small" />
        </span>
      ) : null}
    </button>
  );
}
