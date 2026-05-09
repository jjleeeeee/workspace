import figma from "@figma/code-connect";
import { Tabs } from "./Tabs";

figma.connect(
  Tabs,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=65172-10165",
  {
    props: {
      mode: figma.enum("Mode", { Default: "default", Fixed: "fixed" }),
      style: figma.enum("Style", { Bar: "bar", Chip: "chip" }),
      type: figma.enum("Type", { Fixed: "fixed", Scrollable: "scrollable", "Expand(Only Chips)": "expand" }),
      size: figma.enum("Size", { Medium: "medium", "Small (Only Chips)": "small-only-chips", Small: "small" }),
      showExpandButton: figma.boolean("Expand Button"),
    },
    example: ({ mode, style, type, size, showExpandButton }) => (
      <Tabs
        mode={mode}
        style={style}
        type={type}
        size={size}
        showExpandButton={showExpandButton}
        items={[{ label: "탭 1" }, { label: "탭 2" }, { label: "탭 3" }]}
        activeIndex={0}
      />
    ),
  }
);
