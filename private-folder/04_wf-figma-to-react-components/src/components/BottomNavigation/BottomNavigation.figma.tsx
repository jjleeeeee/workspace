import figma from "@figma/code-connect";
import { BottomNavigation } from "./BottomNavigation";

figma.connect(
  BottomNavigation,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=87669-2290",
  {
    props: {
      os: figma.enum("OS", { iOS: "ios", Android: "android" }),
      mode: figma.enum("Mode", { Default: "default", Fixed: "fixed" }),
    },
    example: ({ os, mode }) => (
      <BottomNavigation
        os={os}
        mode={mode}
        activeTab="home"
        showSystem={true}
      />
    ),
  }
);
