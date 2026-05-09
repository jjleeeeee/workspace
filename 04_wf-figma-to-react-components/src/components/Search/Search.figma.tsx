import figma from "@figma/code-connect";
import { Search } from "./Search";

figma.connect(
  Search,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=59722-17972",
  {
    props: {
      mode: figma.enum("Mode", { Default: "default", Fixed: "fixed" }),
      state: figma.enum("State", { Default: "default", Enabled: "enabled", Completed: "completed" }),
    },
    example: ({ mode, state }) => (
      <Search mode={mode} state={state} placeholder="검색어를 입력하세요" />
    ),
  }
);
