import figma from "@figma/code-connect";
import { IconButton } from "./IconButton";

figma.connect(
  IconButton,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=54093-38777",
  {
    props: {
      mode: figma.enum("Mode", { Default: "default", Fixed: "fixed" }),
      type: figma.enum("Type", { Filled: "filled", Outlined: "outlined" }),
      size: figma.enum("Size", {
        "XLarge(52)": "xlarge",
        "Medium(40)": "medium",
        "Small(36)": "small",
        "XXSmall(24)": "xxsmall",
      }),
      status: figma.enum("State", { Default: "default", Hover: "hover", Disabled: "disabled" }),
      radius: figma.enum("Radius", { on: "on", off: "off" }),
      color: figma.enum("Button Color", { Default: "default", Black: "black" }),
    },
    example: ({ mode, type, size, status, radius, color }) => (
      <IconButton mode={mode} type={type} size={size} status={status} radius={radius} color={color} iconName="ic_add" />
    ),
  }
);
