import figma from "@figma/code-connect";
import { AvatarGroup } from "./AvatarGroup";

figma.connect(
  AvatarGroup,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=62973-7805",
  {
    example: () => <AvatarGroup avatars={[]} />,
  }
);
