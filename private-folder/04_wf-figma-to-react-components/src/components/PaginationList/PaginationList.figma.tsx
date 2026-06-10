import figma from "@figma/code-connect";
import { PaginationList } from "./PaginationList";

figma.connect(
  PaginationList,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=61753-7839",
  {
    props: {
      mode: figma.enum("Mode", { Default: "default", Fixed: "fixed" }),
      size: figma.enum("Size", { Large: "large", Small: "small" }),
      pages: figma.enum("Pages", { "2": "2", "3": "3", "4": "4", "5": "5", "6": "6", "7": "7", "8+": "8+" }),
    },
    example: ({ mode, size, pages }) => (
      <PaginationList mode={mode} size={size} pages={pages} selectedPage={1} />
    ),
  }
);
