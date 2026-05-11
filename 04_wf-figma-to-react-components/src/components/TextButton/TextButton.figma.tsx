import figma from "@figma/code-connect";
import { TextButton } from "./TextButton";

figma.connect(
  TextButton,
  "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=52753-39618",
  {
    props: {
      mode: figma.enum("Mode", { Default: "default", Fixed: "fixed" }),
      buttonType: figma.enum("Type", {
        Filled: "filled",
        Outlined_color: "outlinedColor",
        Outlined_gray: "outlinedGray",
        Ghost: "ghost",
      }),
      size: figma.enum("Size", {
        "XLarge(52)": "xlarge",
        "Large(44)": "large",
        "Medium(40)": "medium",
        "Small(36)": "small",
        "XSmall(32)": "xsmall",
        "XXSmall(24)": "xxsmall",
      }),
      buttonColor: figma.enum("Button Color", {
        "Default (Gray Ghost 단일컬러)": "default",
        "Black(Gray Ghost 미적용)": "black",
      }),
      status: figma.enum("Status", { Default: "default", Hover: "hover", Loading: "loading", Disabled: "disabled" }),
      radius: figma.enum("Radius", { off: "off", on: "on" }),
      optionLeading: figma.boolean("Option-Leading"),
      optionTrailing: figma.boolean("Option-Trailing"),
      trailingIcon: figma.boolean("-> Trailing-Icon"),
      trailingText: figma.boolean("-> Trailing-Text"),
      buttonText: figma.string("Button Text"),
    },
    example: ({ mode, buttonType, size, buttonColor, status, radius, optionLeading, optionTrailing, trailingIcon, trailingText, buttonText }) => (
      <TextButton
        mode={mode}
        buttonType={buttonType}
        size={size}
        buttonColor={buttonColor}
        status={status}
        radius={radius}
        {...{ optionLeading, optionTrailing, trailingIcon, trailingText }}
      >
        {buttonText}
      </TextButton>
    ),
  }
);
