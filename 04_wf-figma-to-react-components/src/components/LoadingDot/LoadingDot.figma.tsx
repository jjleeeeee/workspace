import figma from "@figma/code-connect";
import { LoadingDot } from "./LoadingDot";

figma.connect(
  LoadingDot,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=10384-29778",
  {
    props: {
      mode: figma.enum("Mode", { Default: "default", Fixed: "fixed" }),
      size: figma.enum("Size", { Medium: "medium", Small: "small" }),
      color: figma.enum("Color", { Primary: "primary", White: "white" }),
    },
    example: ({ mode, size, color }) => (
      <LoadingDot mode={mode} size={size} color={color} />
    ),
  }
);
