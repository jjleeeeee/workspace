import figma from "@figma/code-connect";
import { TitleHeader } from "./TitleHeader";

figma.connect(
  TitleHeader,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=64450-27844",
  {
    props: {
      mode: figma.enum("Mode", { Default: "default", Fixed: "fixed" }),
      align: figma.enum("Align", { Left: "left", Center: "center" }),
      showLeading: figma.boolean("Leading"),
      showTrailing: figma.boolean("Trailing"),
      showTitleBadge: figma.boolean("[Title] Badge"),
      showBadge1: figma.boolean("Badge_1"),
    },
    example: ({ mode, align, showLeading, showTrailing, showTitleBadge, showBadge1 }) => (
      <TitleHeader
        mode={mode}
        align={align}
        titleLabel="타이틀"
        trailingLabel="Detail"
        showLeading={showLeading}
        showTrailing={showTrailing}
        showTitleBadge={showTitleBadge}
        showBadge1={showBadge1}
      />
    ),
  }
);
