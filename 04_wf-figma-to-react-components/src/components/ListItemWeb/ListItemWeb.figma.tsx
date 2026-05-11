import figma from "@figma/code-connect";
import { ListItemWeb } from "./ListItemWeb";

figma.connect(
  ListItemWeb,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=69579-9043",
  {
    props: {
      mode: figma.enum("Mode", { Default: "default", Fixed: "fixed" }),
      size: figma.enum("Size", { Small: "small", Medium: "medium" }),
      states: figma.enum("States", { Default: "default", "Hover(Pressed)": "hover-pressed", Disabled: "disabled" }),
      showTrailing: figma.boolean("Show Trailing"),
      showDivider: figma.boolean("Show Divider"),
      showMediumLeading: figma.boolean("Show Medium Leading"),
      showSmallLeading: figma.boolean("Show Small Leading"),
    },
    example: ({ mode, size, states, showTrailing, showDivider, showMediumLeading, showSmallLeading }) => (
      <ListItemWeb
        mode={mode}
        size={size}
        states={states}
        titleLabel="리스트 항목"
        {...{ showTrailing, showDivider, showMediumLeading, showSmallLeading }}
      />
    ),
  }
);
