import figma from "@figma/code-connect";
import { Avatar } from "./Avatar";

figma.connect(
  Avatar,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=62973-7556",
  {
    props: {
      mode: figma.enum("Mode", { Default: "default", Fixed: "fixed" }),
      avatarType: figma.enum("Type", { Circle: "circle", Squircle: "squircle" }),
      badgeDot: figma.boolean("Badge_Dot"),
      birthdayHat: figma.boolean("Birthday_Hat"),
      emoji: figma.boolean("Emoji"),
      host: figma.boolean("Host"),
      ring: figma.boolean("Ring"),
      size: figma.enum("Size", {
        "\bXXXXLarge": "xxxxlarge",
        XXXXLarge: "xxxxlarge",
        XXXLarge: "xxxlarge",
        XXLarge: "xxlarge",
        XLarge: "xlarge",
        "\bLarge": "large",
        "\bMedium": "medium",
        "\bSmall": "small",
        "\bXSmall": "xsmall",
        "\bXXSmall": "xxsmall",
        "\b\bXXXSmall": "xxxsmall",
        "\bTiny": "tiny",
      }),
    },
    example: ({ mode, avatarType, badgeDot, birthdayHat, emoji, host, ring, size }) => (
      <Avatar
        mode={mode}
        avatarType={avatarType}
        size={size}
        {...{ badgeDot, birthdayHat, emoji, host, ring }}
      />
    ),
  }
);
