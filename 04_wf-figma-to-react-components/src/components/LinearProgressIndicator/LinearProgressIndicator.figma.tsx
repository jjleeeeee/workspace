import figma from "@figma/code-connect";
import { LinearProgressIndicator } from "./LinearProgressIndicator";

figma.connect(
  LinearProgressIndicator,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=9003-21727",
  {
    props: {
      mode: figma.enum("Mode", { Default: "default", Fixed: "fixed" }),
      rounded: figma.enum("Rounded", { OFF: "off", ON: "on" }),
      height: figma.enum("Height", { Default: "default", "4": "4" }),
    },
    example: ({ mode, rounded, height }) => (
      <LinearProgressIndicator mode={mode} rounded={rounded} height={height} value={60} />
    ),
  }
);
