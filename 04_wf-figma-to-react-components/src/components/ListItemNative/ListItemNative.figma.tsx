import figma from "@figma/code-connect";
import { ListItemNative } from "./ListItemNative";

figma.connect(
  ListItemNative,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=57343-18628",
  {
    props: {
      mode: figma.enum("Mode", { Default: "default", Fixed: "fixed" }),
      size: figma.enum("Size", { Small: "small", Medium: "medium" }),
      status: figma.enum("Status", { Default: "default", "Hover(Pressed)": "hover-pressed", Disabled: "disabled" }),
      showDivider: figma.boolean("Show Divider (Optional)"),
      showTrailing: figma.boolean("Show Trailing (Optional)"),
      showSmallLeading: figma.boolean("Show Small Leading (Optional)"),
      showMediumLeading: figma.boolean("Show Medium Leading (Optional)"),
    },
    example: ({ mode, size, status, showDivider, showTrailing, showSmallLeading, showMediumLeading }) => (
      <ListItemNative
        mode={mode}
        size={size}
        status={status}
        title="리스트 항목"
        {...{ showDivider, showTrailing, showSmallLeading, showMediumLeading }}
      />
    ),
  }
);
