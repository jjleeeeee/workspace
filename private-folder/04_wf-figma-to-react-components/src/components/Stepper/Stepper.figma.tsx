import figma from "@figma/code-connect";
import { Stepper } from "./Stepper";

figma.connect(
  Stepper,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=61604-4394",
  {
    props: {
      mode: figma.enum("Mode", { Default: "default", Fixed: "fixed" }),
      state: figma.enum("State", { Default: "default", Disabled: "disabled", Enabled: "enabled" }),
      caret: figma.boolean("Caret"),
      label: figma.string("Label"),
    },
    example: ({ mode, state, caret, label }) => (
      <Stepper mode={mode} state={state} label={label} {...{ caret }} />
    ),
  }
);
