import figma from "@figma/code-connect";
import { BadgeNumber } from "./BadgeNumber";

figma.connect(
  BadgeNumber,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=8451-113030",
  {
    props: {
      badgeType: figma.enum("Type", { Number: "number", New: "new" }),
      mode: figma.enum("Mode", { Default: "default", Fixed: "fixed" }),
      label: figma.string("Label"),
    },
    example: ({ badgeType, mode, label }) => (
      <BadgeNumber badgeType={badgeType} mode={mode} label={label} />
    ),
  }
);
