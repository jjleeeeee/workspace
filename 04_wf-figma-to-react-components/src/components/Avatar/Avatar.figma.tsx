import figma from "@figma/code-connect";
import { Avatar } from "./Avatar";

figma.connect(
  Avatar,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=62973-7556",
  {
    props: {
      mode: figma.enum("Mode", { Default: "default", Fixed: "fixed" }),
      type: figma.enum("Type", { Circle: "circle", Squircle: "squircle" }),
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
    example: ({ mode, type, size }) => (
      <Avatar mode={mode} type={type} size={size} />
    ),
  }
);
