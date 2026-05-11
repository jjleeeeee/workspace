import figma from "@figma/code-connect";
import { Search } from "./Search";

figma.connect(
  Search,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=59722-17972",
  {
    props: {
      mode: figma.enum("Mode", { Default: "default", Fixed: "fixed" }),
      state: figma.enum("State", { Default: "default", Enabled: "enabled", Completed: "completed" }),
      label: figma.string("Label"),
    },
    example: ({ mode, state, label }) => (
      <Search mode={mode} state={state} label={label} />
    ),
  }
);
