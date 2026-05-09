import figma from "@figma/code-connect";
import { ScrimOverlay } from "./ScrimOverlay";

figma.connect(
  ScrimOverlay,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=10482-75325",
  {
    example: () => <ScrimOverlay />,
  }
);
