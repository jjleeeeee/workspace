import figma from "@figma/code-connect";
import { LoadingCircular } from "./LoadingCircular";

figma.connect(
  LoadingCircular,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=10384-29888",
  {
    props: {
      mode: figma.enum("\bMode", { Default: "default", Fixed: "fixed" }),
    },
    example: ({ mode }) => (
      <LoadingCircular mode={mode} />
    ),
  }
);
