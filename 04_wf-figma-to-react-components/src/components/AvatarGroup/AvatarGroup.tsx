import type { CSSProperties, HTMLAttributes } from "react";
import { Avatar } from "../Avatar/Avatar";
import "./AvatarGroup.css";

export type AvatarGroupShape = "circle" | "squircle";
export type AvatarGroupAlignment = "tile" | "horizontal";
export type AvatarGroupCount = "1" | "2" | "3" | "4" | "5+";

export const avatarGroupShapeOptions: AvatarGroupShape[] = ["circle", "squircle"];
export const avatarGroupAlignmentOptions: AvatarGroupAlignment[] = ["tile", "horizontal"];
export const avatarGroupCountOptions: AvatarGroupCount[] = ["1", "2", "3", "4", "5+"];
export const avatarGroupVariantOptions = [
  "circle-tile-1",
  "circle-tile-2",
  "circle-tile-3",
  "circle-tile-4",
  "circle-tile-5+",
  "circle-horizontal-1",
  "circle-horizontal-2",
  "circle-horizontal-3",
  "circle-horizontal-4",
  "circle-horizontal-5+",
  "squircle-tile-1",
] as const;

type ResolvedAvatarGroupVariant = {
  alignment: AvatarGroupAlignment;
  count: AvatarGroupCount;
  normalized: boolean;
  shape: AvatarGroupShape;
};

type AvatarGroupSize = {
  avatarAreaSize: number;
  avatarComponentSize: number;
  avatarImageSize: number;
  height: number;
  slotStep: number;
  width: number;
};

export interface AvatarGroupProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  alignment?: AvatarGroupAlignment;
  count?: AvatarGroupCount;
  liveTag?: boolean;
  shape?: AvatarGroupShape;
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function countNumber(count: AvatarGroupCount) {
  return count === "5+" ? 5 : Number(count);
}

export function resolveAvatarGroupVariant(
  shape: AvatarGroupShape,
  alignment: AvatarGroupAlignment,
  count: AvatarGroupCount,
): ResolvedAvatarGroupVariant {
  if (shape === "squircle" && (alignment !== "tile" || count !== "1")) {
    return { alignment: "tile", count: "1", normalized: true, shape };
  }

  return { alignment, count, normalized: false, shape };
}

function getAvatarGroupSize(variant: ResolvedAvatarGroupVariant): AvatarGroupSize {
  if (variant.alignment === "horizontal") {
    const visibleSlots = Math.min(countNumber(variant.count), 4);
    return {
      avatarAreaSize: 26,
      avatarComponentSize: 26,
      avatarImageSize: 20,
      height: 26,
      slotStep: 14,
      width: 26 + Math.max(0, visibleSlots - 1) * 14,
    };
  }

  const isSingle = variant.count === "1";
  return {
    avatarAreaSize: 38,
    avatarComponentSize: isSingle ? 38 : 26,
    avatarImageSize: isSingle ? 32 : 20,
    height: 46,
    slotStep: 12,
    width: 38,
  };
}

function getSlotPositions(variant: ResolvedAvatarGroupVariant, size: AvatarGroupSize) {
  const visibleSlots = Math.min(countNumber(variant.count), 4);

  if (variant.alignment === "horizontal") {
    return Array.from({ length: visibleSlots }, (_, index) => ({
      x: index * size.slotStep,
      y: 0,
    }));
  }

  if (visibleSlots === 1) {
    return [{ x: (size.avatarAreaSize - size.avatarComponentSize) / 2, y: 0 }];
  }

  const compact = [
    { x: 0, y: 0 },
    { x: 12, y: 0 },
    { x: 0, y: 12 },
    { x: 12, y: 12 },
  ];

  return compact.slice(0, visibleSlots);
}

export function AvatarGroup({
  alignment = "tile",
  className,
  count = "1",
  liveTag = true,
  shape = "squircle",
  style,
  ...spanProps
}: AvatarGroupProps) {
  const variant = resolveAvatarGroupVariant(shape, alignment, count);
  const size = getAvatarGroupSize(variant);
  const slotPositions = getSlotPositions(variant, size);
  const showOverflow = variant.count === "5+";
  const showLiveTag = variant.alignment === "tile" && liveTag;
  const avatarType = variant.shape;
  const avatarSize = size.avatarComponentSize === 38 ? "xsmall" : "xxxsmall";
  const groupStyle = {
    ...style,
    "--avatar-group-avatar-area": `${size.avatarAreaSize}px`,
    "--avatar-group-avatar-size": `${size.avatarComponentSize}px`,
    "--avatar-group-height": `${size.height}px`,
    "--avatar-group-width": `${size.width}px`,
  } as CSSProperties;

  return (
    <span
      {...spanProps}
      aria-label={spanProps["aria-label"] ?? "Avatar group"}
      className={cx("chord-avatar-group", className)}
      data-alignment={variant.alignment}
      data-count={variant.count}
      data-normalized={String(variant.normalized)}
      data-requested-alignment={alignment}
      data-requested-count={count}
      data-shape={variant.shape}
      role={spanProps.role ?? "group"}
      style={groupStyle}
    >
      <span className="chord-avatar-group__avatar-area" aria-hidden="true">
        {slotPositions.map((position, index) => (
          <span
            className="chord-avatar-group__slot"
            data-slot-index={index + 1}
            key={`${variant.shape}-${variant.alignment}-${variant.count}-${index}`}
            style={{
              "--avatar-group-slot-x": `${position.x}px`,
              "--avatar-group-slot-y": `${position.y}px`,
            } as CSSProperties}
          >
            <Avatar
              avatarType={avatarType}
              badgeDot={false}
              birthdayHat={false}
              componentSize={size.avatarComponentSize}
              emoji={false}
              host={false}
              imageSize={size.avatarImageSize}
              mode="default"
              ring={false}
              size={avatarSize}
            />
          </span>
        ))}
        {showOverflow ? (
          <span className="chord-avatar-group__overflow" data-testid="avatar-group-overflow">
            5
          </span>
        ) : null}
      </span>
      {showLiveTag ? (
        <span className="chord-avatar-group__live-tag" data-testid="avatar-group-live-tag">
          LIVE
        </span>
      ) : null}
    </span>
  );
}
