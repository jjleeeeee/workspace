import type { HTMLAttributes, ReactNode } from "react";
import { ChordIcon } from "../../assets/chord-icons";
import "./Tag.css";

export type TagSize = "small" | "medium";
export type TagType = "line" | "fill";
export type TagShape = "squircle" | "round";
export type TagColor =
  | "primary"
  | "secondary-blue"
  | "secondary-green"
  | "secondary-purple"
  | "secondary-pink"
  | "gray"
  | "white"
  | "red"
  | "membership-malachite-green"
  | "membership-lavender"
  | "membership-cornflower-blue"
  | "live-red";

export interface TagVariantInput {
  color?: TagColor;
  shape?: TagShape;
  size?: TagSize;
  tagType?: TagType;
}

export interface ResolvedTagVariant {
  color: TagColor;
  shape: TagShape;
  size: TagSize;
  tagType: TagType;
}

export interface TagProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children" | "color">, TagVariantInput {
  icon?: ReactNode;
  label?: string;
  showIcon?: boolean;
}

export function resolveTagVariant({
  color = "primary",
  shape = "squircle",
  size = "small",
  tagType = "line",
}: TagVariantInput = {}): ResolvedTagVariant {
  if (color === "live-red") {
    return {
      color,
      shape: "squircle",
      size: "small",
      tagType: "fill",
    };
  }

  return {
    color,
    shape,
    size,
    tagType,
  };
}

export function Tag({
  className,
  color,
  icon,
  label = "Text",
  shape,
  showIcon = true,
  size,
  tagType,
  ...spanProps
}: TagProps) {
  const resolved = resolveTagVariant({ color, shape, size, tagType });
  const classNames = ["chord-tag", className].filter(Boolean).join(" ");

  return (
    <span
      {...spanProps}
      className={classNames}
      data-color={resolved.color}
      data-shape={resolved.shape}
      data-show-icon={String(showIcon)}
      data-size={resolved.size}
      data-tag-type={resolved.tagType}
    >
      {showIcon ? (
        <span className="chord-tag__icon" aria-hidden={icon ? undefined : "true"}>
          {icon ?? <ChordIcon className="chord-tag__null-icon" data-testid="tag-null-icon" name="nullMedium" size={10} />}
        </span>
      ) : null}
      <span className="chord-tag__label">{label}</span>
    </span>
  );
}
