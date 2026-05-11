import figma from "@figma/code-connect";
import { Thumbnail } from "./Thumbnail";

figma.connect(
  Thumbnail,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=50545-51014",
  {
    props: {
      type: figma.enum("Type", { Thumbnail: "thumbnail" }),
      ratio: figma.enum("Ratio", {
        "1:1": "1:1",
        "3:4": "3:4",
        "5:6": "5:6",
        "5:8": "5:8",
        "9:16": "9:16",
        "16:9": "16:9",
      }),
      radius: figma.enum("Radius", { off: "off", on: "on" }),
      fill: figma.boolean("Fill"),
      button: figma.boolean("Button"),
      leftItem: figma.boolean("Left Item"),
      rightItemTop: figma.boolean("Right Item_top"),
      rightItemBottom: figma.boolean("Right Item_bottom"),
      seekBar: figma.boolean("Seek bar"),
    },
    example: ({ type, ratio, radius, fill, button, leftItem, rightItemTop, rightItemBottom, seekBar }) => (
      <Thumbnail type={type} ratio={ratio} radius={radius} {...{ fill, button, leftItem, rightItemTop, rightItemBottom, seekBar }} />
    ),
  }
);
