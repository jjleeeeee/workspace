import figma from "@figma/code-connect";
import { Radio } from "./Radio";

figma.connect(
  Radio,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=59215-200965",
  {
    props: {
      mode: figma.enum("Mode", { Default: "default", Fixed: "fixed" }),
      status: figma.enum("Status", { Default: "default", Enabled: "enabled", Disabled: "disabled" }),
    },
    example: ({ mode, status }) => <Radio mode={mode} status={status} />,
  }
);
