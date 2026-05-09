import type { CSSProperties, HTMLAttributes } from "react";
import { useEffect, useState } from "react";
import { ChordIcon } from "../../assets/chord-icons";
import type { ChordIconSize } from "../../assets/chord-icons";
import placeholderLarge from "../../assets/avatar/avatar-placeholder-large.svg";
import placeholderMedium from "../../assets/avatar/avatar-placeholder-medium.svg";
import placeholderSmall from "../../assets/avatar/avatar-placeholder-small.svg";
import placeholderTiny from "../../assets/avatar/avatar-placeholder-tiny.svg";
import placeholderXlarge from "../../assets/avatar/avatar-placeholder-xlarge.svg";
import placeholderXsmall from "../../assets/avatar/avatar-placeholder-xsmall.svg";
import placeholderXxlarge from "../../assets/avatar/avatar-placeholder-xxlarge.svg";
import placeholderXxsmall from "../../assets/avatar/avatar-placeholder-xxsmall.svg";
import placeholderXxxlarge from "../../assets/avatar/avatar-placeholder-xxxlarge.svg";
import placeholderXxxsmall from "../../assets/avatar/avatar-placeholder-xxxsmall.svg";
import placeholderXxxxlarge from "../../assets/avatar/avatar-placeholder-xxxxlarge.svg";
import "./Avatar.css";

export type AvatarMode = "default" | "fixed";
export type AvatarType = "circle" | "squircle";
export type AvatarSize =
  | "xxxxlarge"
  | "xxxlarge"
  | "xxlarge"
  | "xlarge"
  | "large"
  | "medium"
  | "small"
  | "xsmall"
  | "xxsmall"
  | "xxxsmall"
  | "tiny";

export const avatarModeOptions: AvatarMode[] = ["default", "fixed"];
export const avatarTypeOptions: AvatarType[] = ["circle", "squircle"];
export const avatarSizeOptions: AvatarSize[] = [
  "xxxxlarge",
  "xxxlarge",
  "xxlarge",
  "xlarge",
  "large",
  "medium",
  "small",
  "xsmall",
  "xxsmall",
  "xxxsmall",
  "tiny",
];

export const avatarVariantOptions = avatarModeOptions.flatMap((mode) =>
  avatarTypeOptions.flatMap((avatarType) => avatarSizeOptions.map((size) => `${mode}-${avatarType}-${size}`)),
);

type AvatarSizeSpec = {
  birthdayHat: number;
  component: number;
  emoji: number;
  host: number;
  hostAvatarSize: AvatarSize | null;
  image: number;
  ringGap: number;
  ringStroke: number;
  squircleBadgeDot: number;
  squircleBadgeStroke: number;
};

const avatarSizeSpecs: Record<AvatarSize, AvatarSizeSpec> = {
  xxxxlarge: {
    birthdayHat: 40,
    component: 140,
    emoji: 38,
    host: 46,
    hostAvatarSize: "small",
    image: 128,
    ringGap: 3,
    ringStroke: 3,
    squircleBadgeDot: 24,
    squircleBadgeStroke: 4,
  },
  xxxlarge: {
    birthdayHat: 32,
    component: 108,
    emoji: 32,
    host: 38,
    hostAvatarSize: "xsmall",
    image: 96,
    ringGap: 3,
    ringStroke: 3,
    squircleBadgeDot: 22,
    squircleBadgeStroke: 4,
  },
  xxlarge: {
    birthdayHat: 24,
    component: 84,
    emoji: 24,
    host: 30,
    hostAvatarSize: "xxsmall",
    image: 72,
    ringGap: 3,
    ringStroke: 3,
    squircleBadgeDot: 16,
    squircleBadgeStroke: 4,
  },
  xlarge: {
    birthdayHat: 24,
    component: 72,
    emoji: 24,
    host: 30,
    hostAvatarSize: "xxsmall",
    image: 64,
    ringGap: 1,
    ringStroke: 3,
    squircleBadgeDot: 12,
    squircleBadgeStroke: 4,
  },
  large: {
    birthdayHat: 24,
    component: 64,
    emoji: 24,
    host: 30,
    hostAvatarSize: "xxsmall",
    image: 56,
    ringGap: 1,
    ringStroke: 3,
    squircleBadgeDot: 12,
    squircleBadgeStroke: 3,
  },
  medium: {
    birthdayHat: 20,
    component: 56,
    emoji: 24,
    host: 30,
    hostAvatarSize: "xxsmall",
    image: 48,
    ringGap: 1,
    ringStroke: 3,
    squircleBadgeDot: 12,
    squircleBadgeStroke: 3,
  },
  small: {
    birthdayHat: 20,
    component: 46,
    emoji: 0,
    host: 0,
    hostAvatarSize: null,
    image: 40,
    ringGap: 1,
    ringStroke: 2,
    squircleBadgeDot: 8,
    squircleBadgeStroke: 2,
  },
  xsmall: {
    birthdayHat: 16,
    component: 38,
    emoji: 0,
    host: 0,
    hostAvatarSize: null,
    image: 32,
    ringGap: 1,
    ringStroke: 2,
    squircleBadgeDot: 8,
    squircleBadgeStroke: 2,
  },
  xxsmall: {
    birthdayHat: 12,
    component: 30,
    emoji: 0,
    host: 0,
    hostAvatarSize: null,
    image: 24,
    ringGap: 1,
    ringStroke: 2,
    squircleBadgeDot: 6,
    squircleBadgeStroke: 2,
  },
  xxxsmall: {
    birthdayHat: 10,
    component: 26,
    emoji: 0,
    host: 0,
    hostAvatarSize: null,
    image: 20,
    ringGap: 1,
    ringStroke: 2,
    squircleBadgeDot: 6,
    squircleBadgeStroke: 2,
  },
  tiny: {
    birthdayHat: 10,
    component: 22,
    emoji: 0,
    host: 0,
    hostAvatarSize: null,
    image: 16,
    ringGap: 0,
    ringStroke: 0,
    squircleBadgeDot: 4,
    squircleBadgeStroke: 2,
  },
};

const avatarPlaceholderAssets: Record<AvatarSize, { fileName: string; nodeId: string; src: string }> = {
  xxxxlarge: { fileName: "avatar-placeholder-xxxxlarge.svg", nodeId: "81500:7444", src: placeholderXxxxlarge },
  xxxlarge: { fileName: "avatar-placeholder-xxxlarge.svg", nodeId: "81500:7443", src: placeholderXxxlarge },
  xxlarge: { fileName: "avatar-placeholder-xxlarge.svg", nodeId: "81500:7446", src: placeholderXxlarge },
  xlarge: { fileName: "avatar-placeholder-xlarge.svg", nodeId: "81500:7442", src: placeholderXlarge },
  large: { fileName: "avatar-placeholder-large.svg", nodeId: "81500:7441", src: placeholderLarge },
  medium: { fileName: "avatar-placeholder-medium.svg", nodeId: "81500:7448", src: placeholderMedium },
  small: { fileName: "avatar-placeholder-small.svg", nodeId: "81500:7440", src: placeholderSmall },
  xsmall: { fileName: "avatar-placeholder-xsmall.svg", nodeId: "81500:7447", src: placeholderXsmall },
  xxsmall: { fileName: "avatar-placeholder-xxsmall.svg", nodeId: "81500:7439", src: placeholderXxsmall },
  xxxsmall: { fileName: "avatar-placeholder-xxxsmall.svg", nodeId: "81500:7445", src: placeholderXxxsmall },
  tiny: { fileName: "avatar-placeholder-tiny.svg", nodeId: "81500:7438", src: placeholderTiny },
};

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  alt?: string;
  avatarType?: AvatarType;
  badgeDot?: boolean;
  birthdayHat?: boolean;
  componentSize?: number;
  emoji?: boolean;
  emojiText?: string;
  host?: boolean;
  hostAlt?: string;
  hostSrc?: string;
  imageSize?: number;
  mode?: AvatarMode;
  ring?: boolean;
  size?: AvatarSize;
  src?: string;
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function getAvatarSizeSpec(size: AvatarSize) {
  const { component, image } = avatarSizeSpecs[size];
  return { component, image };
}

function cssPx(value: number) {
  return `${value}px`;
}

export function Avatar({
  alt = "프로필 이미지",
  avatarType = "circle",
  badgeDot = true,
  birthdayHat = true,
  className,
  componentSize,
  emoji = true,
  emojiText = "🏕",
  host = true,
  hostAlt = "Host profile image",
  hostSrc,
  imageSize,
  mode = "default",
  ring = true,
  size = "xxxxlarge",
  src,
  style,
  ...spanProps
}: AvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const spec = avatarSizeSpecs[size];
  const resolvedComponentSize = componentSize ?? spec.component;
  const resolvedImageSize = imageSize ?? spec.image;
  const imageOffset = (resolvedComponentSize - resolvedImageSize) / 2;
  const isCircle = avatarType === "circle";
  const isSquircle = avatarType === "squircle";
  const showRing = isCircle && ring && spec.ringStroke > 0;
  const showBirthdayHat = isCircle && birthdayHat && spec.birthdayHat > 0;
  const showEmoji = isCircle && emoji && spec.emoji > 0;
  const showBadgeDot = isSquircle && badgeDot;
  const showHost = isSquircle && host && spec.host > 0 && spec.hostAvatarSize !== null;
  const hasImage = Boolean(src && !imageFailed);
  const placeholderAsset = avatarPlaceholderAssets[size];
  const avatarStyle = {
    ...style,
    "--avatar-badge-dot-size": cssPx(spec.squircleBadgeDot),
    "--avatar-badge-frame-size": cssPx(spec.squircleBadgeDot + spec.squircleBadgeStroke * 2),
    "--avatar-badge-stroke": cssPx(spec.squircleBadgeStroke),
    "--avatar-birthday-hat-size": cssPx(spec.birthdayHat),
    "--avatar-component-size": cssPx(resolvedComponentSize),
    "--avatar-emoji-size": cssPx(spec.emoji),
    "--avatar-host-size": cssPx(spec.host),
    "--avatar-image-offset": cssPx(imageOffset),
    "--avatar-image-size": cssPx(resolvedImageSize),
    "--avatar-ring-stroke": cssPx(spec.ringStroke),
  } as CSSProperties;

  useEffect(() => {
    setImageFailed(false);
  }, [src]);

  return (
    <span
      {...spanProps}
      aria-label={spanProps["aria-label"] ?? alt}
      className={cx("chord-avatar", className)}
      data-badge-dot={String(showBadgeDot)}
      data-birthday-hat={String(showBirthdayHat)}
      data-component-size-override={String(componentSize !== undefined || imageSize !== undefined)}
      data-emoji={String(showEmoji)}
      data-has-image={String(hasImage)}
      data-host={String(showHost)}
      data-mode={mode}
      data-ring={String(showRing)}
      data-size={size}
      data-type={avatarType}
      role={spanProps.role ?? "img"}
      style={avatarStyle}
    >
      {showRing ? <span className="chord-avatar__ring" data-testid="avatar-ring" /> : null}
      <span className="chord-avatar__media">
        {hasImage ? (
          <img alt="" className="chord-avatar__image" draggable={false} onError={() => setImageFailed(true)} src={src} />
        ) : (
          <img
            alt=""
            className="chord-avatar__placeholder"
            data-asset-classification="asset-backed-placeholder"
            data-asset-role="avatar-placeholder"
            data-placeholder-file={placeholderAsset.fileName}
            data-placeholder-source-node={placeholderAsset.nodeId}
            data-testid="avatar-placeholder"
            draggable={false}
            src={placeholderAsset.src}
          />
        )}
      </span>
      {showBirthdayHat ? (
        <ChordIcon
          className="chord-avatar__birthday-hat"
          data-testid="avatar-birthday-hat"
          name="birthdayHatMedium"
          size={spec.birthdayHat as ChordIconSize}
        />
      ) : null}
      {showEmoji ? (
        <span className="chord-avatar__emoji" data-testid="avatar-emoji">
          {emojiText}
        </span>
      ) : null}
      {showBadgeDot ? <span className="chord-avatar__badge-dot" data-testid="avatar-badge-dot" /> : null}
      {showHost ? (
        <span className="chord-avatar__host" data-testid="avatar-host">
          <span className="chord-avatar__host-bg" />
          <Avatar
            alt={hostAlt}
            avatarType="circle"
            badgeDot={false}
            birthdayHat={false}
            emoji={false}
            host={false}
            mode={mode}
            ring={false}
            size={spec.hostAvatarSize ?? "xxsmall"}
            src={hostSrc}
          />
        </span>
      ) : null}
    </span>
  );
}
