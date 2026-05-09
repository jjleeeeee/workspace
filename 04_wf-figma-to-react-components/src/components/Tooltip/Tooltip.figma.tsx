import figma from "@figma/code-connect";
import { Tooltip } from "./Tooltip";

figma.connect(
  Tooltip,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=7891-6903",
  {
    props: {
      mode: figma.enum("Mode", { Default: "default", "\bFixed": "fixed" }),
      size: figma.enum("Size", { Large: "large", Medium: "medium" }),
      color: figma.enum("Color", { Black: "black", White_fixed: "white-fixed", Tint: "tint" }),
      position: figma.enum("Position", {
        "Bottom Center": "bottom-center",
        "Bottom Left": "bottom-left",
        "Bottom Right": "bottom-right",
        "Left Center": "left-center",
        "Right Center": "right-center",
        "Top Center": "top-center",
        "Top Left": "top-left",
        "Top Right": "top-right",
      }),
    },
    example: ({ mode, size, color, position }) => (
      <Tooltip mode={mode} size={size} color={color} position={position} label="툴팁 텍스트" />
    ),
  }
);
