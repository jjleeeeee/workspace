import figma from "@figma/code-connect";
import { Tabs } from "./Tabs";

figma.connect(
  Tabs,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=65172-10165",
  {
    props: {
      mode: figma.enum("Mode", { Default: "default", Fixed: "fixed" }),
      type: figma.enum("Type", { "Content Fill": "fill", "Content Swipe": "swipe" }),
    },
    example: ({ mode, type }) => (
      <Tabs
        mode={mode}
        type={type}
        tabItems={["탭 1", "탭 2", "탭 3"]}
        selectedIndex={0}
      />
    ),
  }
);
