import figma from "@figma/code-connect";
import { ToggleSwitch } from "./ToggleSwitch";

figma.connect(
  ToggleSwitch,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=7927-149092",
  {
    props: {
      mode: figma.enum("Mode", { Default: "default", Fixed: "fixed" }),
      platform: figma.enum("OS", { iOS: "ios", AOS: "aos" }),
      size: figma.enum("Size", { Medium: "medium", Small: "small" }),
      status: figma.enum("Status", { Default: "default", Enabled: "enabled", Disabled: "disabled" }),
    },
    example: ({ mode, platform, size, status }) => (
      <ToggleSwitch mode={mode} platform={platform} size={size} status={status} />
    ),
  }
);
