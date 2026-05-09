import figma from "@figma/code-connect";
import { DropdownBox } from "./DropdownBox";

figma.connect(
  DropdownBox,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=60730-9605",
  {
    props: {
      mode: figma.enum("Mode", { Default: "default", Fixed: "fixed" }),
      state: figma.enum("State", {
        Default: "default",
        "Pressed (Hover)": "pressed",
        "Enabled_Down": "enabled-down",
        "Enabled_Up": "enabled-up",
        Completed: "completed",
        Error: "error",
        Disabled: "disabled",
      }),
      showTitle: figma.boolean("Show Title"),
      showGuide: figma.boolean("Show Guide"),
      showScrollbar: figma.boolean("Show Scrollbar"),
      showBadgeDot: figma.boolean("Show Badge_Dot"),
    },
    example: ({ mode, state, showTitle, showGuide, showScrollbar, showBadgeDot }) => (
      <DropdownBox
        mode={mode}
        state={state}
        label="선택"
        showTitle={showTitle}
        showGuide={showGuide}
        showScrollbar={showScrollbar}
        showBadgeDot={showBadgeDot}
      />
    ),
  }
);
