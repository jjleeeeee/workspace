import figma from "@figma/code-connect";
import { Thumbnail } from "./Thumbnail";

figma.connect(
  Thumbnail,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=50545-51014",
  {
    props: {
      ratio: figma.enum("Ratio", {
        "1:1": "1:1",
        "3:4": "3:4",
        "5:6": "5:6",
        "5:8": "5:8",
        "9:16": "9:16",
        "16:9": "16:9",
      }),
      radius: figma.enum("Radius", { off: "off", on: "on" }),
    },
    example: ({ ratio, radius }) => (
      <Thumbnail ratio={ratio} radius={radius} />
    ),
  }
);
