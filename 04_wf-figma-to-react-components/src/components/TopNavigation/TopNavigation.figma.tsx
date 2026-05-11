import figma from "@figma/code-connect";
import { TopNavigation } from "./TopNavigation";

figma.connect(
  TopNavigation,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=64450-39560",
  {
    props: {
      mode: figma.enum("Mode", { Default: "default", Fixed: "fixed" }),
      textType: figma.enum("Text Type", {
        Default: "default",
        Left: "left",
        Center: "center",
        Img: "img",
        "Img+Text": "img-text",
        "Logo Svg": "logo-svg",
        "Logo Svg_center": "logo-svg-center",
        Search: "search",
      }),
      scrollBg: figma.enum("Scroll Bg", { On: "on", Off: "off" }),
      showLeading: figma.boolean("Leading"),
      showTrailing: figma.boolean("Trailing"),
      showImage: figma.boolean("Image"),
      showOfficialBadge: figma.boolean("[Title] Official Badge"),
      showSubTitle: figma.boolean("[Sub] Title"),
      showSubTitleIcon: figma.boolean("[Sub] Title Icon"),
      marquee: figma.boolean("Marquee"),
    },
    example: ({ mode, textType, scrollBg, showLeading, showTrailing, showImage, showOfficialBadge, showSubTitle, showSubTitleIcon, marquee }) => (
      <TopNavigation
        mode={mode}
        textType={textType}
        titleLabel="타이틀"
        {...{ scrollBg, showLeading, showTrailing, showImage, showOfficialBadge, showSubTitle, showSubTitleIcon, marquee }}
      />
    ),
  }
);
