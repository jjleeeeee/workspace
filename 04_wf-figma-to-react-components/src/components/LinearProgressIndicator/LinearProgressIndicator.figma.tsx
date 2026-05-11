import figma from "@figma/code-connect";
import { LinearProgressIndicator } from "./LinearProgressIndicator";

figma.connect(
  LinearProgressIndicator,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=9003-21727",
  {
    props: {
      mode: figma.enum("Mode", { Default: "default", Fixed: "fixed" }),
      rounded: figma.enum("Rounded", { OFF: "off", ON: "on" }),
      indicatorHeight: figma.enum("Height", { "Default (2)": "default", "4": "4" }),
    },
    example: ({ mode, rounded, indicatorHeight }) => (
      <LinearProgressIndicator mode={mode} rounded={rounded} indicatorHeight={indicatorHeight} progress={0.6} />
    ),
  }
);
