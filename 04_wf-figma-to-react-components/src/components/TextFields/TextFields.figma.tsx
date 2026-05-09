import figma from "@figma/code-connect";
import { TextFields } from "./TextFields";

figma.connect(
  TextFields,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=62030-25225",
  {
    props: {
      mode: figma.enum("Mode", { Default: "default", Fixed: "fixed" }),
      lines: figma.enum("Lines", { Single: "single", Multiple: "multiple" }),
      status: figma.enum("Status", { Default: "default", Disabled: "disabled", Enabled: "enabled", Error: "error", Success: "success" }),
      showTitle: figma.boolean("Show Title"),
      showBadgeDot: figma.boolean("Show Badge_Dot"),
      guideMessage: figma.boolean("Guide Message"),
      scrollbar: figma.boolean("Scrollbar"),
      characterCounter: figma.boolean("Character Counter"),
      countryCode: figma.boolean("Country Code"),
    },
    example: ({ mode, lines, status, showTitle, showBadgeDot, guideMessage, scrollbar, characterCounter, countryCode }) => (
      <TextFields
        mode={mode}
        lines={lines}
        status={status}
        label="레이블"
        placeholder="입력하세요"
        showTitle={showTitle}
        showBadgeDot={showBadgeDot}
        guideMessage={guideMessage}
        scrollbar={scrollbar}
        characterCounter={characterCounter}
        countryCode={countryCode}
      />
    ),
  }
);
