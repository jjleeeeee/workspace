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
        "Secondary-Purple": "secondary-purple",
        "Secondary-Pink": "secondary-pink",
        Gray: "gray",
        White: "white",
        Red: "red",
        "Membership-Malachite-Green": "membership-malachite-green",
        "Membership-Lavender": "membership-lavender",
        "Membership-Cornflower-Blue": "membership-cornflower-blue",
        "LIVE Red": "live-red",
      }),
      size: figma.enum("Size", { Small: "small", Medium: "medium" }),
      tagType: figma.enum("Type", { Line: "line", Fill: "fill" }),
      shape: figma.enum("Shape", { Squircle: "squircle", Round: "round" }),
      showIcon: figma.boolean("Show Icon"),
    },
    example: ({ color, size, tagType, shape, showIcon }) => (
      <Tag color={color} size={size} tagType={tagType} shape={shape} label="텍스트" {...{ showIcon }} />
    ),
  }
);
