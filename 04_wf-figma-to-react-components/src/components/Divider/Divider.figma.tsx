import figma from "@figma/code-connect";
import { Divider } from "./Divider";

figma.connect(
  Divider,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=10379-40800",
  {
    props: {
      height: figma.enum("Height", { "1": "1", "2": "2", "8": "8" }),
      mode: figma.enum("Mode", { Default: "default", Fixed: "fixed" }),
    },
    example: ({ height, mode }) => <Divider height={height} mode={mode} />,
  }
);
