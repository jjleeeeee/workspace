import figma from "@figma/code-connect";
import { Chips } from "./Chips";

figma.connect(
  Chips,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=59869-78921",
  {
    props: {
      mode: figma.enum("Mode", { Default: "default", Fixed: "fixed" }),
      size: figma.enum("Size", { Small: "small", Medium: "medium" }),
      type: figma.enum("Type", { Text: "text", Icon: "icon", Image: "image" }),
      state: figma.enum("State", {
        Default: "default",
        "Filled-Selected": "filled-selected",
        "Outlined-Selected": "outlined-selected",
        "Filled-Disabled": "filled-disabled",
        "Outlined-Disabled": "outlined-disabled",
      }),
      radius: figma.enum("Radius", { ON: "on", OFF: "off" }),
    },
    example: ({ mode, size, type, state, radius }) => (
      <Chips mode={mode} size={size} type={type} state={state} radius={radius} label="텍스트" />
    ),
  }
);
