import figma from "@figma/code-connect";
import { Stepper } from "./Stepper";

figma.connect(
  Stepper,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=61604-4394",
  {
    props: {
      mode: figma.enum("Mode", { Default: "default", Fixed: "fixed" }),
      state: figma.enum("State", { Default: "default", Disabled: "disabled", Enabled: "enabled" }),
    },
    example: ({ mode, state }) => (
      <Stepper mode={mode} state={state} value={1} />
    ),
  }
);
