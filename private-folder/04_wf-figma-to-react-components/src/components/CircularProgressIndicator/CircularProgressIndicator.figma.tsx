import figma from "@figma/code-connect";
import { CircularProgressIndicator } from "./CircularProgressIndicator";

figma.connect(
  CircularProgressIndicator,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=9003-21751",
  {
    props: {
      mode: figma.enum("Mode", { Default: "default", Fixed: "fixed" }),
      button: figma.boolean("Button"),
    },
    example: ({ mode, button }) => (
      <CircularProgressIndicator mode={mode} progress={0.7} {...{ button }} />
    ),
  }
);
