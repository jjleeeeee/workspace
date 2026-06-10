import figma from "@figma/code-connect";
import { TitleHeader } from "./TitleHeader";

figma.connect(
  TitleHeader,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=64450-27844",
  {
    props: {
      mode: figma.enum("Mode", { Default: "default", Fixed: "fixed" }),
      align: figma.enum("Align", { Left: "left", Center: "center" }),
      marquee: figma.boolean("Marquee"),
      showLeading: figma.boolean("Leading"),
      showSubTitle: figma.boolean("[Sub] Title"),
      showTrailing: figma.boolean("Trailing"),
      showTitleBadge: figma.boolean("[Title] Badge"),
      showBadge1: figma.boolean("Badge_1"),
      showBadge2: figma.boolean("Badge_2"),
      showSubBadge: figma.boolean("[Sub] Badge"),
    },
    example: ({ mode, align, showLeading, showTrailing, showTitleBadge, showBadge1, showBadge2, showSubBadge, showSubTitle, marquee }) => (
      <TitleHeader
        mode={mode}
        align={align}
        titleLabel="타이틀"
        subTitleLabel="서브타이틀"
        trailingLabel="Detail"
        {...{ showLeading, showTrailing, showTitleBadge, showBadge1, showBadge2, showSubBadge, showSubTitle, marquee }}
      />
    ),
  }
);
