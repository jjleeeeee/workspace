import figma from "@figma/code-connect";
import { BadgeDot } from "./BadgeDot";

figma.connect(
  BadgeDot,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=8451-112783",
  {
    props: {
      mode: figma.enum("Mode", { Default: "default", Fixed: "fixed" }),
      size: figma.enum("Size", { Small: "small", Medium: "medium", Large: "large" }),
      outline: figma.enum("Outline", { OFF: "off", ON: "on" }),
    },
    example: ({ mode, size, outline }) => (
      <BadgeDot mode={mode} size={size} outline={outline} />
    ),
  }
);
