import figma from "@figma/code-connect";
import { AvatarGroup } from "./AvatarGroup";

figma.connect(
  AvatarGroup,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=73587-6404",
  {
    props: {
      shape: figma.enum("Shape", { Circle: "circle", Squircle: "squircle" }),
      alignment: figma.enum("Alignment", { Tile: "tile", Horizontal: "horizontal" }),
      count: figma.enum("Count", { "1": "1", "2": "2", "3": "3", "4": "4", "5+": "5+" }),
      liveTag: figma.boolean("Live Tag"),
    },
    example: ({ shape, alignment, count, liveTag }) => (
      <AvatarGroup shape={shape} alignment={alignment} count={count} {...{ liveTag }} />
    ),
  }
);
