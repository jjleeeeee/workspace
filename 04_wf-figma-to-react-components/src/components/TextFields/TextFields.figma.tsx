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
      titleLabel: figma.string("Title Label"),
      showBadgeDot: figma.boolean("Show Badge_Dot"),
      guideMessage: figma.boolean("Guide Message"),
      scrollbar: figma.boolean("Scrollbar"),
      characterCounter: figma.boolean("Character Counter"),
      characterCounterLabel: figma.string("Character Counter Label"),
      countryCode: figma.boolean("Country Code"),
      multiLineLabel: figma.string("Multi-line Label"),
    },
    example: ({ mode, lines, status, showTitle, titleLabel, showBadgeDot, guideMessage, scrollbar, characterCounter, characterCounterLabel, countryCode, multiLineLabel }) => (
      <TextFields
        mode={mode}
        lines={lines}
        status={status}
        titleLabel={titleLabel}
        placeholder={multiLineLabel}
        multiLineLabel={multiLineLabel}
        characterCounterLabel={characterCounterLabel}
        {...{ showTitle, showBadgeDot, guideMessage, scrollbar, characterCounter, countryCode }}
      />
    ),
  }
);
