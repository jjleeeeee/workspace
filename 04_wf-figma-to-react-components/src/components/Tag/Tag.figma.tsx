import figma from "@figma/code-connect";
import { Tag } from "./Tag";

figma.connect(
  Tag,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=30256-32826",
  {
    props: {
      color: figma.enum("Color", {
        Primary: "primary",
        "Secondary-Blue": "secondary-blue",
        "Secondary-Green": "secondary-green",
        Gray: "gray",
        White: "white",
        Red: "red",
      }),
      size: figma.enum("Size", { Small: "small", Medium: "medium" }),
      tagType: figma.enum("Type", { Line: "line", Fill: "fill" }),
      shape: figma.enum("Shape", { Squircle: "squircle", Round: "round" }),
      showIcon: figma.boolean("Show Icon"),
    },
    example: ({ color, size, tagType, shape, showIcon }) => (
      <Tag color={color} size={size} tagType={tagType} shape={shape} showIcon={showIcon} label="텍스트" />
    ),
  }
);
