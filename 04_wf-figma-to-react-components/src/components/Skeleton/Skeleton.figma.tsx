import figma from "@figma/code-connect";
import { Skeleton } from "./Skeleton";

figma.connect(
  Skeleton,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=12447-42302",
  {
    props: {
      mode: figma.enum("Mode", { Default: "default", Fixed: "fixed" }),
      size: figma.enum("Size", { Large: "large", Medium: "medium" }),
    },
    example: ({ mode, size }) => (
      <Skeleton mode={mode} size={size} />
    ),
  }
);
