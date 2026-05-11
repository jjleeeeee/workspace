import figma from "@figma/code-connect";
import { Checkbox } from "./Checkbox";

figma.connect(
  Checkbox,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=60365-40276",
  {
    props: {
      mode: figma.enum("Mode", { Default: "default", Fixed: "fixed" }),
      checkboxType: figma.enum("Type", { Circle: "circle", Square: "square" }),
      status: figma.enum("Status", { Default: "default", Enabled: "enabled", Disabled: "disabled" }),
    },
    example: ({ mode, checkboxType, status }) => (
      <Checkbox mode={mode} checkboxType={checkboxType} status={status} />
    ),
  }
);
