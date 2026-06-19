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
        "Down - Align Center": "down-center",
        "Down - Align Left": "down-left",
        "Down - Align Right": "down-right",
        "Up - Align Center": "up-center",
        "Up - Align Left": "up-left",
        "Up - Align Right": "up-right",
        "Left - Align Top": "left-top",
        "Left - Align Middle": "left-middle",
        "Left - Align Bottom": "left-bottom",
        "Right - Align Top": "right-top",
        "Right - Align Middle": "right-middle",
        "Right - Align Bottom": "right-bottom",
      }),
      buttonClose: figma.boolean("Button - Close"),
      label: figma.string("Label"),
    },
    example: ({ mode, size, color, position, buttonClose, label }) => (
      <Tooltip mode={mode} size={size} color={color} position={position} label={label} {...{ buttonClose }} />
    ),
  }
);
