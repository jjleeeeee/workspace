import figma from "@figma/code-connect";
import { Divider } from "./Divider";

figma.connect(
  Divider,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=10379-40800",
  {
    props: {
      height: figma.enum("Height", { "1": "1", "2": "2", "8": "8" }),
      mode: figma.enum("Mode", { Default: "default", Fixed: "fixed" }),
      dividerStyle: figma.enum("Style", { "Default-50a": "default-50a", "Default-50a-2": "default-50a-2" }),
    },
    example: ({ height, mode, dividerStyle }) => <Divider height={height} mode={mode} dividerStyle={dividerStyle} />,
  }
);
