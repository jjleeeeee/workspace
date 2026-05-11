import figma from "@figma/code-connect";
import { Menu } from "./Menu";

figma.connect(
  Menu,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=25963-37235",
  {
    props: {
      mode: figma.enum("Mode", { Default: "default", Fixed: "fixed" }),
    },
    example: ({ mode }) => (
      <Menu mode={mode} items={[{ title: "항목 1" }, { title: "항목 2" }]} />
    ),
  }
);
