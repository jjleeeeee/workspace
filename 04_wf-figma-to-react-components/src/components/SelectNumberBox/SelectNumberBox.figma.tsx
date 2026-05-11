import figma from "@figma/code-connect";
import { SelectNumberBox } from "./SelectNumberBox";

figma.connect(
  SelectNumberBox,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=12436-362",
  {
    props: {
      mode: figma.enum("Mode", { Default: "default", Fixed: "fixed" }),
      state: figma.enum("State", { Selected: "selected", "Selected-99+": "selected-99-plus", Unselected: "unselected" }),
    },
    example: ({ mode, state }) => (
      <SelectNumberBox mode={mode} state={state} value={1} />
    ),
  }
);
