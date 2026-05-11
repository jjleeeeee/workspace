import figma from "@figma/code-connect";
import { Snackbar } from "./Snackbar";

figma.connect(
  Snackbar,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=63694-5774",
  {
    props: {
      mode: figma.enum("Mode", { Default: "default", Fixed: "fixed" }),
      label: figma.string("Label"),
      icon: figma.boolean("Icon"),
    },
    example: ({ mode, label, icon }) => (
      <Snackbar mode={mode} label={label} {...{ icon }} />
    ),
  }
);
