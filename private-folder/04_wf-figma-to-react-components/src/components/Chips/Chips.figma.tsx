import figma from "@figma/code-connect";
import { Chips } from "./Chips";

figma.connect(
  Chips,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=59869-78921",
  {
    props: {
      mode: figma.enum("Mode", { Default: "default", Fixed: "fixed" }),
      size: figma.enum("Size", { Small: "small", Medium: "medium" }),
      type: figma.enum("Type", { Text: "text", Icon: "icon", "Image (Only Medium)": "image" }),
      state: figma.enum("State", {
        Default: "default",
        Filled_Selected: "filled-selected",
        Outlined_Selected: "outlined-selected",
        Filled_Disabled: "filled-disabled",
        Outlined_Disabled: "outlined-disabled",
      }),
      marquee: figma.boolean("Marquee"),
      badge: figma.boolean("Badge"),
      badgeNumber: figma.boolean("Badge_Number"),
    },
    example: ({ mode, size, type, state, marquee, badge, badgeNumber }) => (
      <Chips mode={mode} size={size} type={type} state={state} label="텍스트" {...{ marquee, badge, badgeNumber }} />
    ),
  }
);
