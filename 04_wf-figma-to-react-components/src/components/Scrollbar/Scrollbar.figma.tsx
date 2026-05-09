import figma from "@figma/code-connect";
import { Scrollbar } from "./Scrollbar";

figma.connect(
  Scrollbar,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=27782-8837",
  {
    props: {
      mode: figma.enum("Mode", { Default: "default", "Fixed - White": "fixed-white", "Fixed - Black": "fixed-black" }),
    },
    example: ({ mode }) => <Scrollbar mode={mode} />,
  }
);
