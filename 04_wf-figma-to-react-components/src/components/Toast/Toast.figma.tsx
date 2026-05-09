import figma from "@figma/code-connect";
import { Toast } from "./Toast";

figma.connect(
  Toast,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=63694-4595",
  {
    props: {
      mode: figma.enum("Mode", { Default: "default", Fixed: "fixed" }),
      label: figma.string("Label"),
    },
    example: ({ mode, label }) => (
      <Toast mode={mode} label={label} />
    ),
  }
);
