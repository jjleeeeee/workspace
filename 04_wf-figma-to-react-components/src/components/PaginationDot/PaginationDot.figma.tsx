import figma from "@figma/code-connect";
import { PaginationDot } from "./PaginationDot";

figma.connect(
  PaginationDot,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=62324-12061",
  {
    props: {
      mode: figma.enum("Mode", { Fixed: "fixed", Default: "default" }),
      dots: figma.enum("Dots", { "2": "2", "3": "3", "4": "4", "5": "5", "6+": "6+" }),
      selection: figma.enum("Selection", { "1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6 }),
    },
    example: ({ mode, dots, selection }) => (
      <PaginationDot mode={mode} dots={dots} selection={selection} />
    ),
  }
);
