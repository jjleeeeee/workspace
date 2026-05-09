import figma from "@figma/code-connect";
import { Checkbox } from "./Checkbox";

figma.connect(
  Checkbox,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=60365-40276",
  {
    props: {
      mode: figma.enum("Mode", { Default: "default", Fixed: "fixed" }),
      type: figma.enum("Type", { Circle: "circle", Square: "square" }),
      status: figma.enum("Status", { Default: "default", Enabled: "enabled", Disabled: "disabled" }),
    },
    example: ({ mode, type, status }) => (
      <Checkbox mode={mode} type={type} status={status} />
    ),
  }
);
