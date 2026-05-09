import figma from "@figma/code-connect";
import { CircularProgressIndicator } from "./CircularProgressIndicator";

figma.connect(
  CircularProgressIndicator,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=9003-21751",
  {
    props: {
      mode: figma.enum("Mode", { Default: "default", Fixed: "fixed" }),
    },
    example: ({ mode }) => (
      <CircularProgressIndicator mode={mode} value={70} />
    ),
  }
);
